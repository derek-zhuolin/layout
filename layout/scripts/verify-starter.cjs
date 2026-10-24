// Deterministic starter regression checks. No model calls or private photo discovery.
const fs = require('fs');
const os = require('os');
const path = require('path');
const {execFileSync} = require('child_process');
const {pathToFileURL} = require('url');
const {chromium} = require('playwright');
const sharp = require('sharp');
const root = path.resolve(process.argv[2] || path.join(__dirname, '../..'));
const out = process.env.STARTER_REPORT_DIR || path.join(os.tmpdir(), 'layout-starter-check');
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'layout-starter-'));
const project = path.join(work, 'project');
const report = {checks:[], errors:[], status:'running'};
const assert = (v,m) => {if(!v)throw Error(m);};
let browser;
const configFile = path.join(project,'assets/starter/config.js');
const write = value => fs.writeFileSync(configFile,'window.LAYOUT_CONFIG = '+JSON.stringify(value)+';\n');
const sizes = {'3x4':[1080,1440],'9x16':[1080,1920],'16x9':[1600,900],'4x3':[1200,900]};
(async()=>{
  fs.mkdirSync(out,{recursive:true});
  // Synthetic geometry fixtures: never publish as real event photos.
  for(const [name,width,height] of [['wide',1200,700],['tall',700,1200]])await sharp({create:{width,height,channels:3,background:'#c5e3fa'}}).png().toFile(path.join(work,name+'.png'));
  execFileSync('python3',[path.join(root,'layout/scripts/new-project.py'),'--output',project]);
  const base=JSON.parse(fs.readFileSync(configFile,'utf8').split('=')[1].trim().replace(/;$/,''));
  assert(!base.photo && !base.brand.enabled && !base.corner.enabled,'New project must be unbranded and without inherited photos');
  assert(!fs.existsSync(path.join(project,'assets/approved-cases')) && !fs.existsSync(path.join(project,'assets/playground')),'Do not copy reference gallery into a new project');
  try{execFileSync('python3',[path.join(root,'layout/scripts/new-project.py'),'--output',project],{stdio:'pipe'});throw Error('Existing output was overwritten');}catch(e){assert(e.status===2,'Existing project must be preserved');}
  const photoProject=path.join(work,'photo project');
  const selected=path.join(work,'已确认 图片.png');
  fs.copyFileSync(path.join(work,'wide.png'),selected);
  execFileSync('python3',[path.join(root,'layout/scripts/new-project.py'),'--output',photoProject,'--photo',selected,'--photo-kind','screenshot','--photo-alt','已确认截图']);
  const photoConfig=fs.readFileSync(path.join(photoProject,'assets/starter/config.js'),'utf8');
  assert(photoConfig.includes('../photo.png') && photoConfig.includes('screenshot') && !photoConfig.includes(work),'Selected photo must use portable paths and retain its role');
  assert(fs.readFileSync(selected).equals(fs.readFileSync(path.join(photoProject,'assets/photo.png'))),'Copy the selected image without modification');
  const missingProject=path.join(work,'missing project');
  try{execFileSync('python3',[path.join(root,'layout/scripts/new-project.py'),'--output',missingProject,'--photo',path.join(work,'missing.png')],{stdio:'pipe'});throw Error('Missing photo accepted');}catch(e){assert(e.status===2 && !fs.existsSync(missingProject),'Do not silently create a text-only project when selected photo is missing');}
  report.checks.push('CLI: portable selected-image copy, screenshot role, missing source rejected, existing project preserved');
  for(const name of ['wide','tall'])fs.copyFileSync(path.join(work,name+'.png'),path.join(project,'assets',name+'.png'));
  const candidates=[process.env.CHROMIUM_EXECUTABLE,chromium.executablePath(),'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
  browser=await chromium.launch({headless:true,executablePath:candidates.find(x=>x&&fs.existsSync(x))});
  const page=await browser.newPage();
  page.on('pageerror',e=>report.errors.push(e.message));
  async function load(config){
    write(config);const [w,h]=sizes[config.ratio];await page.setViewportSize({width:w+32,height:h+48});
    await page.goto(pathToFileURL(path.join(project,'index.html')).href,{waitUntil:'load'});
    await page.waitForURL(/assets\/starter\/index.html/);
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(x=>x.decode().catch(()=>{})));});
  }
  async function bounds(){return page.evaluate(()=>{
    const card=document.querySelector('#canvas').getBoundingClientRect();
    const bad=[];
    for(const el of document.querySelectorAll('.copy h1,.copy p,.photo-window,.identity,.corner')){
      let box=el.getBoundingClientRect();
      if(el.matches('h1,p')){const range=document.createRange();range.selectNodeContents(el);box=range.getBoundingClientRect();}
      if(box.left<card.left-1||box.right>card.right+1||box.top<card.top-1||box.bottom>card.bottom+1)bad.push(el.tagName+'.'+el.className);
    }
    return bad;
  });}
  for(const ratio of Object.keys(sizes))for(const kind of ['text','wide','tall']){
    const config={...base,ratio,photo:kind==='text'?null:{src:'../'+kind+'.png',alt:'Geometry fixture',caption:'测试图片，仅用于检查窗口比例。',kind:'photo'}};
    await load(config);
    assert(await page.locator('.identity,.corner,.topline').count()===0,ratio+': branding must not reserve space');
    assert((await bounds()).length===0,ratio+'/'+kind+': content exceeds canvas');
    assert(await page.locator('.photo-window').count()===(kind==='text'?0:1),ratio+': explicit image window');
    assert(!(await page.locator('#canvas').innerText()).includes('互通有无'),ratio+': reference brand leaked');
    if(kind!=='text')assert(await page.locator('.photo').evaluate(el=>getComputedStyle(el).objectFit)==='contain','Photo must not silently crop');
    await page.locator('#canvas').screenshot({path:path.join(out,ratio+'-'+kind+'.png')});
    report.checks.push(ratio+'/'+kind+': content bounds, no inherited brand, correct photo window');
  }
  await load({...base,brand:{enabled:false,name:'SHOULD_NOT_SHOW'},corner:{enabled:false,label:'HIDDEN'}});
  assert(await page.locator('.topline').count()===0,'Disabled fields must stay hidden even when populated');
  await load({...base,brand:{enabled:true,name:'',author:''},corner:{enabled:true,label:'',pageNumber:''}});
  assert(await page.locator('.topline').count()===0,'Empty enabled fields must not create blank slots');
  await load({...base,brand:{enabled:true,name:'测试品牌',author:'测试作者'},corner:{enabled:true,label:'案例',pageNumber:'1 / 2'}});
  assert((await page.locator('.identity').innerText()).includes('测试品牌'),'Explicit brand not rendered');
  assert((await page.locator('.corner').innerText()).includes('1 / 2'),'Explicit corner not rendered');
  report.checks.push('Explicit brand/corner toggles, empty slots and disabled populated fields');
  const literal='保留 <img src=x onerror=alert(1)> 与 ${原话}';
  await load({...base,title:literal});
  assert(await page.locator('h1').innerText()===literal && await page.locator('h1 img').count()===0,'Author text must remain literal');
  await load({...base,photo:{src:'../wide.png',alt:'测试截图',kind:'screenshot'}});
  assert(await page.locator('.photo-window.precise').count()===1 && await page.locator('.paperclip').count()===0,'Screenshots must stay flat and unobstructed');
  await load({...base,photo:{src:'../missing.png',alt:'缺失图片'}});
  assert(await page.locator('#canvas').getAttribute('data-asset-error')==='true','Missing image must be an explicit unfinished state');
  const long='完整观点与必要条件都不能静默删除。'.repeat(70);
  await load({...base,paragraphs:[long]});
  assert(await page.locator('.paragraphs').innerText()===long && (await bounds()).length>0,'Long content must remain intact and expose need for reflow, not be silently shortened');
  report.checks.push('Literal text, flat screenshot, visible missing-image error, long content preserved for manual reflow');
  assert(report.errors.length===0,'Browser runtime errors');
  report.status='passed';
})().catch(e=>{report.status='failed';report.errors.push(e.message);process.exitCode=1;}).finally(async()=>{
  if(browser)await browser.close();fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
});
