import{bookColor,escape as e}from'./content.js';
let historyHandler=null;
export function handleSummaryHistory(){return historyHandler?.()||false}

export function setupBookSummary(root,projects,onSelect){
 const dialog=document.createElement('dialog');dialog.className='book-summary';dialog.setAttribute('aria-labelledby','book-summary-title');dialog.setAttribute('aria-describedby','book-summary-description');root.querySelector('#works').append(dialog);
 const motion=matchMedia('(prefers-reduced-motion:reduce)');
 let trigger=null,closing=null,historyClosing=false,sequence=0;
 const invalidate=()=>{sequence++};
 const restore=()=>{document.body.classList.remove('summary-open');if(trigger?.isConnected)trigger.focus({preventScroll:true})};
 function dismiss(animate=true){
  if(!dialog.open||closing)return;invalidate();const panel=dialog.querySelector('.open-book'),token=sequence;
  if(animate&&!motion.matches){closing=panel.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(8px) scale(.985)'}],{duration:140,easing:'ease-in'});closing.finished.then(()=>{if(sequence!==token)return;closing=null;if(dialog.open)dialog.close();restore()},()=>{})}
  else{dialog.close();restore()}
 }
 function requestClose(){if(historyClosing||closing)return;if(history.state?.summarySlug){historyClosing=true;history.back()}else dismiss()}
 function open(project,button,{push=true}={}){
  invalidate();closing?.cancel();closing=null;historyClosing=false;trigger=button;onSelect(project.slug);
  for(const row of root.querySelectorAll('.piano-row'))row.dataset.selected=String(row.dataset.project===project.slug);
  dialog.innerHTML=`<article class="open-book" style="--project-color:${bookColor(project.kind)}"><div class="book-summary-top"><p class="eyebrow">作品の概要</p><button class="summary-close" type="button" data-summary-close aria-label="作品の概要を閉じる">閉じる ×</button></div><div class="book-summary-pages"><section><p class="book-summary-category">${e(project.category)}</p><h2 id="book-summary-title" tabindex="-1">${e(project.title)}</h2><span class="lifecycle-badge">${e(project.status.label)}</span><p id="book-summary-description">${e(project.summary)}</p><h3>${project.kind==='moral'?'研究の問い':'目指していること'}</h3><p>${e(project.purpose)}</p></section><section class="book-summary-right"><h3>どういう仕組みか</h3><ol class="summary-flow" aria-label="機能の流れ">${project.flow.map(step=>`<li>${e(step)}</li>`).join('')}</ol><h3>${project.kind==='moral'?'研究の現状':'使ってもらって分かったこと'}</h3><p>${e(project.impact)}</p><a class="summary-more" data-route data-book-detail="${e(project.slug)}" href="${project.path}">詳しく見る ↗</a><p class="summary-detail-note">詳細ページでは、設計で考えたことや再現映像を見られます。</p></section></div></article>`;
  dialog.querySelector('[data-summary-close]').addEventListener('click',requestClose);
  if(push){history.replaceState({...history.state,scrollY,focusId:button.id},'');history.pushState({...history.state,summarySlug:project.slug,summaryOpener:button.id},'')}
  document.body.classList.add('summary-open');if(!dialog.open)dialog.showModal();dialog.scrollTop=0;dialog.querySelector('#book-summary-title').focus({preventScroll:true});

 }
 for(const button of root.querySelectorAll('[data-book-open]'))button.addEventListener('click',()=>open(projects.find(p=>p.slug===button.dataset.bookOpen),button));
 dialog.addEventListener('cancel',event=>{event.preventDefault();requestClose()});dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)requestClose()});
 const changed=()=>{if(motion.matches&&closing){closing.cancel();closing=null;dismiss(false)}};motion.addEventListener('change',changed);
 const handle=()=>{historyClosing=false;const project=projects.find(p=>p.slug===history.state?.summarySlug);if(project){open(project,root.querySelector('#'+(history.state.summaryOpener||'key-'+project.slug)),{push:false});return true}if(dialog.open){if(closing){invalidate();closing.cancel();closing=null;dismiss(false);return false}dismiss();return true}return false};historyHandler=handle;
 const restored=projects.find(p=>p.slug===history.state?.summarySlug);if(restored)open(restored,root.querySelector('#'+(history.state.summaryOpener||'key-'+restored.slug)),{push:false});
 return()=>{invalidate();closing?.cancel();closing=null;motion.removeEventListener('change',changed);if(historyHandler===handle)historyHandler=null;if(dialog.open)dialog.close();document.body.classList.remove('summary-open');dialog.remove()};
}
