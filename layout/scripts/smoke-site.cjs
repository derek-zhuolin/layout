// Run locally, or set SITE_URL to a deployed repository URL. No model calls.
const fs = require('fs');
const path = require('path');
const os = require('os');
const {execFileSync} = require('child_process');
const {pathToFileURL} = require('url');
const {chromium} = require('playwright');
const root = path.resolve(process.argv[2] || path.join(__dirname, '../..'));
const base = process.env.SITE_URL;
const out = process.env.SMOKE_REPORT_DIR || path.join(os.tmpdir(), 'layout-smoke');
const data = JSON.parse(fs.readFileSync(path.join(root, 'layout/assets/playground/data.js'), 'utf8').split('=').slice(1).join('=').trim().replace(/;$/, ''));
const publicBase = 'https://derek-zhuolin.github.io/layout/';
const url = name => base ? new URL(name, base.endsWith('/') ? base : base + '/').href : pathToFileURL(path.join(root, name)).href;
const report = {target: base || 'local checkout', checks: [], pageMetrics: [], errors: [], googleRichResultsTest: 'not submitted'};
const candidates = [process.env.CHROMIUM_EXECUTABLE, chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
const cache = path.join(os.homedir(), 'Library/Caches/ms-playwright');
if (fs.existsSync(cache)) for (const name of fs.readdirSync(cache).filter(x => /^chromium-/.test(x)).sort().reverse()) candidates.push(path.join(cache, name, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'));
function assert(value, message) { if (!value) throw Error(message); }
// Use the system network path for binary downloads; browser API request bodies
// can stall on some proxy configurations even when page/image loading works.
const downloaded = new Map();
function downloadBytes(target) {
  if (!downloaded.has(target)) downloaded.set(target, execFileSync('curl', ['-fsSL','--max-time','60',target], {maxBuffer:32*1024*1024,timeout:65000}));
  return downloaded.get(target);
}
function graph(html) {
  const matches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert(matches.length === 1, 'Expected one JSON-LD block');
  const data = JSON.parse(matches[0][1]);
  assert(data['@context'] === 'https://schema.org', 'Wrong schema context');
  assert(Array.isArray(data['@graph']), 'Missing schema graph');
  return data['@graph'];
}
(async () => {
  fs.mkdirSync(out, {recursive:true});
  const browser = await chromium.launch({headless:true, executablePath:candidates.find(x => x && fs.existsSync(x))});
  const context = await browser.newContext({viewport:{width:1440,height:1050}});
  const page = await context.newPage();
  page.setDefaultNavigationTimeout(60000);
  page.on('pageerror', e => report.errors.push(e.message));
  let requestedFonts = new Set();
  page.on('request', request => {const name=new URL(request.url()).pathname.split('/').pop();if(/\.(otf|woff2)$/.test(name))requestedFonts.add(name);});
  const names = ['index.html', 'layout/assets/playground/index.html', 'layout/assets/approved-cases/index.html'];
  const entities = new Map();
  const graphs = [];
  for (const name of names) {
    requestedFonts = new Set();
    const response = await page.goto(url(name), {waitUntil:'domcontentloaded'});
    if (base) assert(response.status() === 200, name + ': HTTP status');
    const html = await page.content();
    const nodes = graph(html); graphs.push(...nodes);
    for (const node of nodes) {
      assert(node['@id'] && node['@type'], name + ': schema identity/type');
      assert(!/file:\/\/|localhost|\/Users\//.test(JSON.stringify(node)), 'Nonpublic schema URL');
      entities.set(node['@id'], node);
    }
    const meta = await page.evaluate(() => ({title:document.title, desc:document.querySelector('meta[name="description"]')?.content, canonical:document.querySelector('link[rel="canonical"]')?.href,refresh:!!document.querySelector('meta[http-equiv="refresh"]')}));
    assert(meta.title.includes('Layout') && meta.desc && meta.canonical.startsWith(publicBase) && !meta.refresh, name + ': metadata');
    report.checks.push(name + ': HTTP, title, description, canonical, JSON-LD');
    if (name !== 'index.html') {
      const breadcrumb = nodes.find(x => x['@type'] === 'BreadcrumbList');
      assert(breadcrumb?.itemListElement.length === 2, name + ': two breadcrumb nodes');
      const labels = await page.locator('.breadcrumbs li').allTextContents();
      assert(JSON.stringify(labels) === JSON.stringify(breadcrumb.itemListElement.map(x=>x.name)), name + ': visible/schema breadcrumbs differ');
    }
    for (const node of nodes.filter(x=>x['@type']==='ImageObject')) {
      assert(node.creditText && !node.creator && !node.license && !node.copyrightNotice, name + ': only verified image credit');
    }

    for (const viewport of [{width:1440,height:1050},{width:390,height:844}]) {
      await page.setViewportSize(viewport);
      await page.evaluate(async () => {await document.fonts.ready; await Promise.all([...document.images].map(x => x.decode()));});
      const metrics = await page.evaluate(() => ({overflow:document.documentElement.scrollWidth > innerWidth + 2,images:[...document.images].every(x => x.naturalWidth > 0),font:document.fonts.check('700 30px SH'),fontResources:performance.getEntriesByType('resource').filter(x=>/\.(otf|woff2)(\?|$)/.test(x.name)).map(x=>({file:x.name.split('/').pop().split('?')[0],durationMs:Math.round(x.duration),bytes:x.transferSize})),domReadyMs:Math.round(performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd)}));
      assert(!metrics.overflow && metrics.images && metrics.font, name + ': mobile/desktop media or layout');
      assert(![...requestedFonts].some(x=>x.endsWith('.otf')) && !metrics.fontResources.some(x=>x.file.endsWith('.otf')), name + ': unexpected full-font fallback download');
      if(viewport.width===1440) report.pageMetrics.push({page:name,domReadyMs:metrics.domReadyMs,fontResources:metrics.fontResources,requestedFonts:[...requestedFonts]});
      await page.screenshot({path:path.join(out, (names.indexOf(name) + 1) + '-' + viewport.width + '.png'),fullPage:true});
    }
  }
  function references(value) {
    if (!value || typeof value !== 'object') return;
    if (value['@id'] && Object.keys(value).length === 1) assert(entities.has(value['@id']), 'Dangling schema entity');
    for (const x of Object.values(value)) if (Array.isArray(x)) x.forEach(references); else references(x);
  }
  graphs.forEach(references);
  const supportedTypes = ['WebSite','WebPage','SoftwareSourceCode','ImageObject','CollectionPage','ItemList','BreadcrumbList'];
  for (const node of graphs) assert(supportedTypes.includes(node['@type']), 'Unexpected schema type');
  report.checks.push('3 page graphs: JSON syntax, type inventory and entity references');
  await page.setViewportSize({width:1440,height:1050});
  await page.goto(url('layout/assets/playground/index.html'), {waitUntil:'load'});
  for (const format of data.formats) {
    await page.locator('#ratio').selectOption(format.id);
    for (const item of data.cases) {
      await page.locator('.thumb[data-id="' + item.id + '"]').click();
      await page.locator('#frame').contentFrame().locator('.selected.r-' + format.id).waitFor();
      const frame = page.locator('#frame').contentFrame();
      const geometry = await frame.locator('.selected').evaluate(async el => {
        await document.fonts.ready;
        await Promise.all([...el.querySelectorAll('img')].map(x => x.decode()));
        const r = el.getBoundingClientRect();
        const footer = el.querySelector('footer').getBoundingClientRect();
        const bad = [...el.querySelectorAll('h1,h3,p,small,.eyebrow')].filter(n => {
          const b = n.getBoundingClientRect();
          return b.left < r.left+18 || b.right > r.right-18 || b.bottom > footer.top-8 || n.scrollWidth > n.clientWidth+3;
        }).map(n => n.textContent.slice(0,40));
        return {width:el.offsetWidth,height:el.offsetHeight,bad};
      });
      assert(geometry.width === format.width && geometry.height === format.height && !geometry.bad.length, format.id + ': slide bounds ' + item.id + ' ' + JSON.stringify(geometry.bad));
      const link = await page.locator('#download').getAttribute('href');
      let bytes;
      if (base) {
        bytes = downloadBytes(new URL(link, page.url()).href);
        assert(bytes.equals(fs.readFileSync(path.join(root, 'examples',format.folder,String(item.id).padStart(2,'0')+'.png'))), 'PNG differs from exported file');
      } else bytes = fs.readFileSync(path.join(root, 'examples',format.folder,String(item.id).padStart(2,'0')+'.png'));
      assert(bytes.readUInt32BE(16) === format.width * 2 && bytes.readUInt32BE(20) === format.height * 2, 'PNG resolution');
    }
    await page.locator('#depth').selectOption('flat');
    await page.locator('#frame').contentFrame().locator('.selected.flat').waitFor();
    await page.locator('#depth').selectOption('soft');
    await page.locator('#frame').contentFrame().locator('.selected:not(.flat)').waitFor();
    await page.keyboard.press('Home');
    await page.waitForFunction(() => document.querySelector('#counter').textContent === '1 / 4');
    await page.getByRole('button',{name:'下一页',exact:true}).click();
    await page.waitForFunction(() => document.querySelector('#counter').textContent === '2 / 4');
    await page.getByRole('button',{name:'上一页',exact:true}).click();
    await page.waitForFunction(() => document.querySelector('#counter').textContent === '1 / 4');
    await page.keyboard.press('End');
    await page.waitForFunction(() => document.querySelector('#counter').textContent === '4 / 4');
    report.checks.push(format.id + ': 4 slides, bounds, 2x PNGs, thumbnails, previous/next, keyboard, depth');
  }
  report.checks.push('All 16 PNG downloads match the full local exported files');
  await page.locator('#fullscreen').click();
  await page.waitForFunction(() => !!document.fullscreenElement);
  await page.evaluate(() => document.exitFullscreen());
  await page.waitForFunction(() => !document.fullscreenElement);
  report.checks.push('fullscreen entry and exit');
  for (const query of ['ratio=unknown&slide=abc','ratio=3x4&slide=-1','ratio=3x4&slide=1.5']) {
    await page.goto(url('layout/assets/playground/index.html') + '?' + query);
    await page.waitForFunction(() => document.querySelector('#counter').textContent === '1 / 4');
    await page.locator('#frame').contentFrame().locator('.cover.selected').waitFor();
  }
  report.checks.push('invalid / negative / fractional slide queries recover');
  await page.goto(url('xhs-card/assets/playground/index.html') + '?ratio=9x16&slide=4');
  await page.waitForURL('**/layout/assets/playground/index.html?ratio=9x16&slide=4', {waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => document.querySelector('#counter').textContent === '4 / 4');
  await page.locator('#frame').contentFrame().locator('.caseboard.selected.r-9x16').waitFor();
  await page.goto(url('xhs-card/assets/approved-cases/index.html'));
  await page.waitForURL('**/layout/assets/approved-cases/index.html', {waitUntil:'domcontentloaded'});
  await page.goto(url('shengxin-chutu/assets/playground/index.html') + '?ratio=16x9&slide=2');
  await page.waitForURL('**/layout/assets/playground/index.html?ratio=16x9&slide=2', {waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => document.querySelector('#counter').textContent === '2 / 4');
  report.checks.push('both legacy Playground paths preserve ratio/slide; legacy gallery redirects');
  if (base) for (const filename of ['01.png','02.png','03.png']) {
    const old = downloadBytes(url('xhs-card/assets/approved-cases/' + filename));
    const fresh = downloadBytes(url('layout/assets/approved-cases/' + filename));
    assert(old.equals(fresh), 'Legacy image mismatch');
  }
  for (const node of graphs.filter(x => x['@type'] === 'ImageObject')) {
    const local = node.contentUrl.slice(publicBase.length);
    const bytes = base ? downloadBytes(url(local)) : fs.readFileSync(path.join(root, local));
    assert(bytes.readUInt32BE(16) === node.width && bytes.readUInt32BE(20) === node.height, 'Schema image dimensions');
  }
  report.checks.push('schema ImageObject URLs and dimensions match actual PNGs');
  assert(!report.errors.length, 'Browser JavaScript errors: '+report.errors.join('; '));
  report.status = 'passed';
  await browser.close();
  fs.writeFileSync(path.join(out,'smoke.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report));
})().catch(error => {report.status='failed';report.errors.push(error.message);fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'smoke.json'),JSON.stringify(report,null,2));console.error(error);process.exit(1);});
