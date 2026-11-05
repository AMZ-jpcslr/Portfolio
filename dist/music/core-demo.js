import{featureFlows,renderFlowSvg}from'./feature-flows.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const coreDemos=Object.fromEntries(Object.entries(featureFlows).map(([kind,d])=>[kind,{steps:d.steps,description:d.note}]));
export function renderCoreDemo(kind){
 const d=featureFlows[kind];if(!d)return'';
 return `<figure class="core-demo" data-core-kind="${esc(kind)}" data-running="false" data-static="true"><div class="core-demo-bar"><span>入力から結果まで <small>約12秒 / 無音</small></span><button type="button" class="core-demo-toggle" aria-label="機能アニメーションを再生">再生</button></div><div class="core-demo-visual" aria-hidden="true"><div class="flow-scenes">${d.steps.map((s,i)=>`<div class="flow-scene cd-at-${i}" data-flow-stage="${i}">${renderFlowSvg(kind,i,0)}</div>`).join('')}</div><div class="core-demo-captions">${d.steps.map((s,i)=>`<span class="cd-caption cd-at-${i}"><b>0${i+1} / 04</b> ${esc(s)}</span>`).join('')}</div><div class="core-demo-progress"></div></div><figcaption><strong>動作イメージ（フローの再現）</strong><span>${esc(d.note)}</span><span class="core-demo-text-flow">${d.steps.map(esc).join(' → ')}</span></figcaption></figure>`;
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
  button.textContent=running?'一時停止':'再生';button.setAttribute('aria-label',running?'機能アニメーションを一時停止':'機能アニメーションを再生');
 }
 const observer=new IntersectionObserver(entries=>{visible=entries.at(-1).isIntersecting;sync()},{threshold:.15});observer.observe(figure);
 const toggle=()=>{if(figure.dataset.running==='true'){userPaused=true;explicitPlay=false}else{userPaused=false;explicitPlay=true}sync()};
 const changed=()=>{explicitPlay=false;if(motion.matches)started=false;sync()};
 button.addEventListener('click',toggle);motion.addEventListener('change',changed);document.addEventListener('visibilitychange',sync);document.addEventListener('core-demo-modal',sync);
 sync();
 return()=>{disposed=true;observer.disconnect();figure.dataset.running='false';button.removeEventListener('click',toggle);motion.removeEventListener('change',changed);document.removeEventListener('visibilitychange',sync);document.removeEventListener('core-demo-modal',sync)};
}
