import{pvStories,renderShortPvSvg}from'./product-pv.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const coreDemos=Object.fromEntries(Object.entries(pvStories).map(([kind,d])=>[kind,{steps:d.shortCaptions,description:d.note}]));
export function renderCoreDemo(kind){
 const d=pvStories[kind];if(!d)return'';
 return `<figure class="core-demo" data-core-kind="${esc(kind)}" data-running="false" data-static="true"><div class="core-demo-bar"><span>作品のショートPV <small>約12秒 / 無音</small></span><button type="button" class="core-demo-toggle" aria-label="PVを再生">再生</button></div><div class="core-demo-visual" aria-hidden="true"><div class="flow-scenes">${d.shortCaptions.map((s,i)=>`<div class="flow-scene cd-at-${i}" data-pv-phase="${i}">${renderShortPvSvg(kind,i,0)}</div>`).join('')}</div><div class="core-demo-captions">${d.shortCaptions.map((s,i)=>`<span class="cd-caption cd-at-${i}">${esc(s)}</span>`).join('')}</div><div class="core-demo-progress"></div></div><figcaption><span class="sr-only">${d.shortCaptions.map(esc).join(" ")}</span><strong>PV / 動作イメージ・再現</strong><span>${esc(d.shortCaution)}</span><details class="pv-scope"><summary>再現の範囲</summary><span>${esc(d.note)}</span></details></figcaption></figure>`;
}
export function setupCoreDemo(figure){
 if(!figure)return()=>{};
 const button=figure.querySelector('.core-demo-toggle'),motion=matchMedia('(prefers-reduced-motion:reduce)');
 let visible=false,userPaused=false,started=false,disposed=false,explicitPlay=false;
 function sync(){
  if(disposed)return;
  const modal=document.querySelector('.book-summary[open]');
  const allowed=visible&&!document.hidden&&(!modal||modal.contains(figure));
  const running=allowed&&!userPaused&&(!motion.matches||explicitPlay);
  if(running)started=true;
  figure.dataset.static=String(!started);figure.dataset.running=String(running);
  button.textContent=running?'一時停止':'再生';button.setAttribute('aria-label',running?'PVを一時停止':'PVを再生');
 }
 const observer=new IntersectionObserver(entries=>{visible=entries.at(-1).isIntersecting;sync()},{threshold:.15});observer.observe(figure);
 const toggle=()=>{if(figure.dataset.running==='true'){userPaused=true;explicitPlay=false}else{userPaused=false;explicitPlay=true}sync()};
 const changed=()=>{explicitPlay=false;if(motion.matches)started=false;sync()};
 button.addEventListener('click',toggle);motion.addEventListener('change',changed);document.addEventListener('visibilitychange',sync);document.addEventListener('core-demo-modal',sync);
 sync();
 return()=>{disposed=true;observer.disconnect();figure.dataset.running='false';button.removeEventListener('click',toggle);motion.removeEventListener('change',changed);document.removeEventListener('visibilitychange',sync);document.removeEventListener('core-demo-modal',sync)};
}
