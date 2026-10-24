(() => {
  const c = window.LAYOUT_CONFIG || {};
  const formats = {"3x4":[1080,1440],"9x16":[1080,1920],"16x9":[1600,900],"4x3":[1200,900]};
  const ratio = Object.hasOwn(formats,c.ratio) ? c.ratio : "3x4";
  const [width,height] = formats[ratio];
  const canvas = document.getElementById("canvas");
  const viewport = document.getElementById("viewport");
  const make = (tag,cls,text) => {const el=document.createElement(tag);el.className=cls||"";if(text != null)el.textContent=text;return el;};
  const fail = (image,label) => {canvas.dataset.assetError="true";image.replaceWith(make("p","asset-error",label+"加载失败，请修复素材路径后再导出。"));};
  canvas.style.setProperty("--w",width+"px");
  canvas.style.setProperty("--h",height+"px");
  canvas.className = "r-"+ratio+(c.photo?.src ? " photo-mode" : " text-mode");
  const top = make("div","topline");
  if(c.brand?.enabled && (c.brand.name || c.brand.logo || c.brand.author)){
    const identity=make("div","identity");
    if(c.brand.logo){const logo=make("img");logo.src=c.brand.logo;logo.alt=c.brand.logoAlt||c.brand.name||"";logo.onerror=()=>fail(logo,"Logo");identity.append(logo);}
    if(c.brand.name)identity.append(make("span","brand-name",c.brand.name));
    if(c.brand.author)identity.append(make("span","author",c.brand.author));
    top.append(identity);
  }
  if(c.corner?.enabled && (c.corner.label || c.corner.pageNumber))top.append(make("div","corner",[c.corner.label,c.corner.pageNumber].filter(Boolean).join(" · ")));
  if(top.childNodes.length)canvas.append(top);
  const composition=make("div","composition");
  const copy=make("section","copy");
  copy.append(make("h1","",c.title||""));
  if(c.lead)copy.append(make("p","lead",c.lead));
  if(c.paragraphs?.length){const group=make("div","paragraphs");c.paragraphs.forEach(t=>group.append(make("p","",t)));copy.append(group);}
  composition.append(copy);
  if(c.photo?.src){
    const precise=["screenshot","chart"].includes(c.photo.kind);
    const frame=make("figure","photo-window"+(precise?" precise":""));
    const area=make("div","image-area");
    const photo=make("img","photo");photo.src=c.photo.src;photo.alt=c.photo.alt||"";photo.onerror=()=>fail(photo,"图片");area.append(photo);frame.append(area);
    if(c.decoration !== false && !precise){const pin=make("span","paperclip");pin.setAttribute("aria-hidden","true");frame.append(pin);}
    if(c.photo.caption)frame.append(make("figcaption","",c.photo.caption));
    composition.append(frame);
  }
  canvas.append(composition);
  function resize(){const scale=Math.min((window.innerWidth-32)/width,1);canvas.style.transform=`scale(${scale})`;viewport.style.width=width*scale+"px";viewport.style.height=height*scale+"px";}
  window.addEventListener("resize",resize);resize();
})();
