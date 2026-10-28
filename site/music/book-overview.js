import {escape as e} from './content.js';
let active=null,projects=[],callbacks={},listeners;
function show(p,opener,{push=true}={}){
 closeBookOverview({restoreFocus:false});
 const dialog=document.createElement('dialog');dialog.className='book-overview';dialog.setAttribute('aria-labelledby','book-overview-title');
 dialog.innerHTML=`<article class="overview-pages"><div class="overview-page"><p class="eyebrow">${p.number} / NOTES &amp; WORKS</p><h2 id="book-overview-title" tabindex="-1">${e(p.title)}</h2><p class="overview-tagline">${e(p.tagline)}</p><h3>作った理由</h3><p>${e(p.trigger)}</p><h3>何ができる？</h3><p>${e(p.purpose)}</p></div><div class="overview-page"><h3>仕組みを、ひと目で</h3><ol class="overview-flow">${p.flow.map(step=>`<li>${e(step)}</li>`).join('')}</ol><div class="overview-result"><h3>取り組んで分かったこと</h3><p>${e(p.impact)}</p></div><a id="book-overview-more" class="overview-more" data-route href="${p.path}">さらに詳しく →</a><p class="overview-detail-hint">設計の理由・考えたこと・動作イメージへ</p></div><button class="overview-close" type="button" aria-label="本を閉じる">閉じる ×</button></article>`;
 document.body.append(dialog);active={dialog,opener,slug:p.slug};callbacks.onOpen?.(p.slug);
 if(push)history.pushState({...history.state,summarySlug:p.slug,summaryOpener:opener?.id||`key-${p.slug}`},'');
 function requestClose(){if(history.state?.summarySlug===p.slug)history.back();else closeBookOverview();}
 dialog.addEventListener('cancel',event=>{event.preventDefault();requestClose();});
 dialog.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const controls=[...dialog.querySelectorAll('a[href],button:not([disabled])')],first=controls[0],last=controls.at(-1),current=document.activeElement;
  if(!controls.includes(current)||(event.shiftKey?current===first:current===last)){event.preventDefault();(event.shiftKey?last:first)?.focus();}
 });
 dialog.querySelector('.overview-close').addEventListener('click',requestClose);
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)requestClose();}});
 dialog.showModal();document.body.classList.add('book-overview-open');dialog.querySelector('h2').focus({preventScroll:true});
}
export function closeBookOverview({restoreFocus=true}={}){
 if(!active)return;const {dialog,opener}=active;active=null;dialog.close();dialog.remove();document.body.classList.remove('book-overview-open');if(restoreFocus&&opener?.isConnected)opener.focus({preventScroll:true});
}
export function handleBookHistory(){
 if(document.body.dataset.page!=='home'||location.pathname!=='/')return false;
 const slug=history.state?.summarySlug,p=projects.find(p=>p.slug===slug);
 if(p){show(p,document.getElementById(history.state.summaryOpener||`key-${slug}`),{push:false});return true;}
 if(active){closeBookOverview();return true;}return false;
}
export function setupBookOverview(main,items,options={}){
 listeners?.abort();listeners=new AbortController();projects=items;callbacks=options;
 main.addEventListener('click',event=>{
  const opener=event.target.closest('[data-book-summary]');if(!opener||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const p=projects.find(p=>p.slug===opener.dataset.bookSummary);if(!p)return;
  event.preventDefault();show(p,opener);
 },{signal:listeners.signal});
 const p=projects.find(p=>p.slug===history.state?.summarySlug);if(p)show(p,document.getElementById(history.state.summaryOpener||`key-${p.slug}`),{push:false});
}
