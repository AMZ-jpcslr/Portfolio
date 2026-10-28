import{setupBookSummary,handleSummaryHistory}from'./book-summary.js';
import {setupSearchShelf} from './search-shelf.js';
try{localStorage.removeItem('portfolio-sound')}catch{}
import {monthKey,monthLabel} from './japan-time.js';
import {setupNotebook} from './notebook.js';
import {setupDrawReveals,revealDrawTarget} from './draw-reveals.js';
import {setupDiary} from './github-diary.js';
import {initPaperUI} from './paper-actions.js';
import {projects,chronology,philosophy,github,escape as e} from './content.js';
const main=document.querySelector('main'),motion=matchMedia('(prefers-reduced-motion: reduce)');
let selected='mania',observer,summaryCleanup;
let transition=null,routeToken=0,restoring=false,scrollTimer;
let diaryCleanup,searchCleanup;
let returnRequested=false;
history.scrollRestoration='manual';
const projectBySlug=slug=>projects.find(p=>p.slug===slug);
const anchorFor=hash=>document.getElementById(({work:'works-title',timeline:'records-title',works:'works-title',records:'records-title',closing:'closing-title',search:'search-title',ground:'ground-title',philosophy:'philosophy-title'}[hash.replace(/^#/, '')])||decodeURIComponent(hash.replace(/^#/, '')));
const pathProject=()=>projectBySlug(location.pathname.match(/^\/projects\/([^/]+)\/?$/)?.[1])||projects.find(p=>location.hash==='#project='+encodeURIComponent(p.id));
function footerLinks(p){return `${p.liveUrl?`<a href="${e(p.liveUrl)}" target="_blank" rel="noopener noreferrer">公開アプリを開く ↗</a>`:''}${p.repository?`<a href="${e(p.repository)}" target="_blank" rel="noopener noreferrer">ソースコード / GitHub ↗</a>`:''}`;}
function key(p,i){return `<div class="piano-row" data-project="${p.slug}" data-selected="${p.slug===selected}"><button type="button" class="piano-key" id="key-${p.slug}" data-book-open="${p.slug}" aria-haspopup="dialog"><span class="key-number">${p.number}</span><span class="key-copy"><strong>${e(p.title)}</strong><span class="lifecycle-badge">${e(p.status.label)}</span><small>${e(p.short)}</small></span><span class="key-arrow" aria-hidden="true">↗</span></button></div>`;}
function renderHome(){
 document.body.dataset.page='home';document.title='北岡 英磨 / AMZ — Notes & Works';
 main.innerHTML=`<section class="home-intro" aria-labelledby="home-title"><div><p class="eyebrow">PERSONAL DEVELOPMENT &amp; RESEARCH</p><h1 id="home-title" tabindex="-1">誰の課題を解決するかを考え、<br>プロダクトをつくる。</h1></div><div class="intro-right"><p class="identity">北岡 英磨<small>Yoma Kitaoka / AMZ-jpcslr</small></p><p>PdMを目指し、個人開発・個人研究に取り組んでいます。課題設定から設計・実装まで、自分で手を動かして確かめています。</p><a class="profile-link" href="${github}" target="_blank" rel="noopener noreferrer">github.com/AMZ-jpcslr ↗</a></div></section>
 <section id="works" class="instrument-section" aria-labelledby="works-title"><div class="section-heading"><div><p class="eyebrow">01 / WORKS · 8 PROJECTS</p><h2 id="works-title" tabindex="-1">これまでの作品一覧</h2></div><p>本の背表紙を押すと、作品の概要が開きます。<br>「さらに詳しく」から設計や再現映像へ。</p></div><div class="instrument-grid"><aside class="book-overview" aria-label="作品の見方"><p class="eyebrow">PROJECT BOOKS</p><h3>本を開いて、<br>作品を知る。</h3><p>誰のどんな課題に取り組み、何を考えてつくったのか。まずは短い説明から紹介します。</p><ol class="overview-steps"><li>背表紙を押す</li><li>目的と工夫を読む</li><li>詳細で設計を見る</li></ol></aside><div class="piano" aria-label="8作品の背表紙">${projects.map(key).join('')}</div></div></section>
 <section class="home-section" id="records" aria-labelledby="records-title"><div class="section-score" aria-hidden="true"></div><div class="section-heading"><div><p class="eyebrow">02 / RECORDS &amp; ACTIVITY</p><h2 id="records-title" tabindex="-1">活動と開発の記録</h2></div><p>それぞれの関心から生まれた制作と、<br>団体での活動。</p></div><article class="activity-card"><div><p class="eyebrow">RI-ONE / 団体での活動</p><div class="rione-identity"><img class="rione-logo" src="/music/assets/rione-logo.png" width="2560" height="578" loading="lazy" alt="Ri-one"><h3 id="activity-title" tabindex="-1">Ri-oneでの活動</h3></div><p>立命館大学の公認団体Ri-oneに所属し、戦略班でロボットをどう動かし、どう使って攻めるかを考えています。小学校から高校まで10年間、ゴールキーパーを務めた経験から、主にゴールキーパーを担当するロボットの戦略に携わっています。活動ではJavaを使用しています。</p><a class="rione-official" href="https://rione.org/" target="_blank" rel="noopener noreferrer">Ri-one公式サイト / rione.org ↗</a></div><aside class="activity-aside"><p class="eyebrow">個人制作との関係</p><h4>SSL Robot AI</h4><p>私は候補位置をマップ上で評価する2D環境を個人で制作しました。位置評価の仕組みを、Ri-oneへの導入用プロトタイプとして活用してもらいました。</p><a data-route href="/projects/soccer/">個人制作の詳細へ ↗</a></aside></article><h3 id="repository-history-title" tabindex="-1">リポジトリの作成記録</h3><p class="timeline-note">GitHubの作成年月順・日本時間（Asia/Tokyo）。開発開始日や完成日を表すものではありません。</p><ol class="timeline">${chronology.map(p=>`<li><time datetime="${monthKey(p.repositoryCreatedAt)}">${monthLabel(p.repositoryCreatedAt)}</time><a data-route href="/projects/${p.kind}/">${e(p.title)}<small>${e(p.category)}</small></a></li>`).join('')}</ol></section>
 <section class="philosophy-section" id="philosophy" aria-labelledby="philosophy-title"><div class="home-section"><div class="section-score" aria-hidden="true"></div><div class="section-heading"><div><p class="eyebrow">03 / PHILOSOPHY</p><h2 id="philosophy-title" tabindex="-1">個人開発と個人研究の理念</h2></div></div><p class="principle-intro">制作や研究で大切にしたい行動です。</p><div class="philosophy-grid">${['課題を理解する','試して改善する','伝え方と研究姿勢'].map((group,i)=>`<section class="principle-group" aria-labelledby="principle-group-${i}"><h3 id="principle-group-${i}">${group}</h3><div class="principle-cards">${philosophy.filter(p=>p.group===group).map(p=>`<article><p class="eyebrow">${e(p.label)}</p><h4>${e(p.title)}</h4><p>${e(p.body)}</p></article>`).join('')}</div></section>`).join('')}</div></div></section>`;
 setupNotebook(main,chronology,projects,history.state?.notebookKind);
 summaryCleanup=setupBookSummary(main,projects,slug=>{selected=slug});diaryCleanup=setupDiary(main);renderClosing();searchCleanup=setupSearchShelf(main,projects,{query:history.state?.searchQuery,expanded:history.state?.searchExpanded,resultIds:history.state?.searchResultIds});setupDrawReveals(main);
}
function media(p){return `<div class="media-frame video-panel"><video class="detail-video" muted autoplay loop playsinline preload="none" poster="${p.clip.poster}" aria-label="${e(p.title)}の動作イメージ（再現映像）" aria-describedby="clip-note"><source src="${p.clip.src}" type="video/mp4"></video><span class="recreation-mark">動作イメージ・再現映像</span><button class="media-toggle" type="button" aria-label="再現映像を一時停止">一時停止</button></div><div class="media-meta"><strong>動作イメージ（再現映像）</strong><span>${p.clip.size} ・ 無音</span><a href="${p.clip.src}">動画を大きく開く ↗</a></div><p class="media-caption" id="clip-note">${e(p.clip.note)}</p>`;}

function renderDetail(p){
 document.body.dataset.page='detail';document.title=`${p.title} — AMZ / Notes & Works`;
 const next=projects[(projects.indexOf(p)+1)%projects.length],c=p.caseStudy;
 main.innerHTML=`<section class="detail-heading"><a class="back-link" data-home href="/#works">← 作品一覧に戻る</a><div class="detail-topline"><span class="measure" aria-hidden="true">${p.number}</span><p class="eyebrow">${e(p.category)}</p></div><h1 id="detail-title" tabindex="-1">${e(p.title)}</h1><p class="detail-tagline">${e(p.tagline)}</p><p class="detail-summary">${e(p.summary)}</p><div class="detail-links">${footerLinks(p)}</div></section>
 <section class="detail-media" aria-label="再現映像のプレビュー">${media(p)}</section>
 <div class="detail-content"><p class="detail-status"><span class="lifecycle-badge">${e(p.status.label)}</span> ${e(p.status.detail)}</p><section class="detail-takeaway" aria-labelledby="takeaway-title"><h2 id="takeaway-title">${p.kind==='moral'?'研究で確かめたいこと':'この作品で取り組むこと'}</h2><p>${e(p.purpose)}</p></section><dl class="detail-facts"><div><dt>担当</dt><dd>${e(c.role.scope)}</dd></div><div><dt>技術・領域</dt><dd class="tags">${p.tags.map(e).join(' / ')}</dd></div><div><dt>利用・活動の範囲</dt><dd>${e(p.audience)}</dd></div></dl><nav class="detail-toc" aria-label="作品詳細の目次"><a href="#context">目的</a><a href="#trigger">きっかけ</a><a href="#decisions">アプローチ</a><a href="#limits">結果と現状</a><a href="#role">担当・AI活用</a></nav><div class="detail-grid"><div><section class="detail-block" id="context" tabindex="-1"><p class="eyebrow">01 / PURPOSE</p><h2>${p.kind==='moral'?'研究の問い':'誰のどんな課題に取り組むか'}</h2><p>${e(p.purpose)}</p>${p.features?`<ul>${p.features.map(f=>`<li>${e(f)}</li>`).join('')}</ul>`:''}</section><section class="detail-block" id="trigger" tabindex="-1"><p class="eyebrow">02 / BACKGROUND</p><h2>きっかけ</h2><p>${e(p.trigger)}</p></section><section class="detail-block" id="decisions" tabindex="-1"><p class="eyebrow">03 / APPROACH</p><h2>${p.kind==='moral'?'検証の方法':'何を優先し、どう設計したか'}</h2><p>${e(p.engineering)}</p><ol class="detail-flow" aria-label="仕組みの流れ">${p.flow.map(step=>`<li>${e(step)}</li>`).join('')}</ol><div class="decision-panel"><h3>${e(c.decision.choice)}</h3><p>${e(c.decision.reason)}</p></div></section><section class="detail-block" id="limits" tabindex="-1"><p class="eyebrow">04 / RESULTS &amp; CURRENT STATE</p><h2>${p.kind==='moral'?'研究の現状と限界':'使ってもらって分かったこと'}</h2><div class="result-callout"><p>${e(p.impact)}</p></div><h3>現在の課題</h3><p class="limits-note">${e(p.limits)}</p>${p.outlook?`<p>${e(p.outlook)}</p>`:''}<aside class="case-reflection" aria-label="学びと考えたこと"><h3>${e(p.reflectionTitle)}</h3><p>${e(p.reflection)}</p></aside></section></div><aside><section class="detail-block" aria-labelledby="process-title"><p class="eyebrow">APPROACH</p><h2 id="process-title">設計で検討したこと</h2><ol class="detail-process">${c.process.map(s=>`<li><h3>${e(s.title)}</h3><p>${e(s.body)}</p></li>`).join('')}</ol></section><section class="detail-block" id="role" tabindex="-1"><p class="eyebrow">MY ROLE</p><h2>担当とAIの活用</h2><p>${e(c.role.collaboration)}</p>${c.ai?`<p>${e(c.ai.human)}</p><p>${e(c.ai.assistant)}</p>`:'<p>この作品は個人開発です。課題設定、UIの検討、開発を行っています。</p>'}</section></aside></div><nav class="next-project" aria-label="ほかの作品"><a class="back-link" data-home href="/#works">← 作品一覧へ</a><a data-route href="${next.path}">次の作品 / ${e(next.title)} ↗</a></nav></div>`;
 wireDetailMedia();setupDrawReveals(main);
}
function stopMedia(){summaryCleanup?.();summaryCleanup=null;searchCleanup?.();searchCleanup=null;diaryCleanup?.();diaryCleanup=null;observer?.disconnect();for(const video of document.querySelectorAll('video'))if(!video.paused)video.pause();}
function savePosition(focusId){if(restoring)return;history.replaceState({...history.state,scrollY:scrollY,searchQuery:main.querySelector('.search-shelf')?.dataset.query??history.state?.searchQuery,searchExpanded:main.querySelector('.search-shelf')?.dataset.expanded==='true',searchResultIds:JSON.parse(main.querySelector('.search-shelf')?.dataset.resultIds||'null')??history.state?.searchResultIds,notebookKind:main.querySelector('.notebook')?.dataset.preview??history.state?.notebookKind,focusId:focusId??history.state?.focusId},'');}
function cancelTransition(restoreFocus=false){
 if(!transition)return;const previous=transition;transition=null;previous.controller.abort();for(const animation of previous.animations)animation.cancel();for(const node of previous.nodes)node.remove();document.body.removeAttribute('data-navigating');main.style.visibility='';
 if(restoreFocus)(document.getElementById(previous.focusId)||document.querySelector('#detail-title'))?.focus({preventScroll:true});
}
function wait(ms,signal){return new Promise((resolve,reject)=>{const timer=setTimeout(resolve,ms);signal.addEventListener('abort',()=>{clearTimeout(timer);reject(new DOMException('Cancelled','AbortError'));},{once:true});});}
async function navigate(url,{keyElement,replace=false}={}){
 if(transition)return;const destination=new URL(url,location.origin);if(destination.origin!==location.origin)return;
 const p=projectBySlug(destination.pathname.match(/^\/projects\/([^/]+)\/?$/)?.[1]);
 if(destination.pathname!=='/'&&!p){location.href=destination.href;return;}
 const fromHome=document.body.dataset.page==='home',focusId=keyElement?.id||document.activeElement?.id;
 savePosition(focusId);stopMedia();const thisRoute=++routeToken;
 let controller;
 try{
  if(!p&&!fromHome&&!motion.matches){await closeDetail();}
  if(keyElement&&!motion.matches){
   controller=new AbortController();const rect=keyElement.closest('.piano-row').getBoundingClientRect();
   const clone=document.createElement('div');clone.className='flying-key';clone.setAttribute('aria-hidden','true');clone.innerHTML=`<span>${p.number}</span><strong>${e(p.title)}</strong>`;Object.assign(clone.style,{left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`});
   const wipe=document.createElement('div');wipe.className='key-wipe';wipe.setAttribute('aria-hidden','true');const trail=document.createElement('div');trail.className='key-trail';trail.setAttribute('aria-hidden','true');trail.style.top=`${rect.top+rect.height/2}px`;
   document.body.append(wipe,clone,trail);const top=Math.max(0,Math.min(100,rect.top/innerHeight*100)),bottom=Math.max(0,Math.min(100,rect.bottom/innerHeight*100));
   const animations=[clone.animate([{transform:'translateX(0)'},{transform:`translateX(${-rect.right-80}px)`}],{duration:340,easing:'cubic-bezier(.45,0,.7,1)',fill:'forwards'}),wipe.animate([{clipPath:`polygon(100% ${top}%,100% ${bottom}%,100% ${bottom}%,100% ${top}%)`},{clipPath:`polygon(0 ${top}%,100% 0,100% 100%,0 ${bottom}%)`,offset:.7},{clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)'}],{duration:360,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'}),trail.animate([{opacity:0,transform:'scaleX(.05)'},{opacity:.7,transform:'scaleX(1)',offset:.55},{opacity:0,transform:'scaleX(1)'}],{duration:380,fill:'forwards'})];
   transition={controller,animations,nodes:[clone,wipe,trail],focusId};document.body.dataset.navigating='true';
   await wait(360,controller.signal);
  }
  if(thisRoute!==routeToken)return;
  const state={route:p?'detail':'home',slug:p?.slug,scrollY:0,fromHome:p?fromHome:false,returnId:p?`key-${p.slug}`:null};
  history[replace?'replaceState':'pushState'](state,'',destination.pathname+destination.hash);
  p?renderDetail(p):renderHome();window.scrollTo({top:0,behavior:'instant'});
  if(!p&&destination.hash)anchorFor(destination.hash)?.scrollIntoView({behavior:'instant'});
  if(!p&&!fromHome){cancelTransition();await enterKeys();}
  if(transition?.nodes[1]){const wipe=transition.nodes[1];const fade=wipe.animate([{opacity:1},{opacity:0}],{duration:130,fill:'forwards'});transition.animations.push(fade);await wait(130,controller.signal);}
  cancelTransition();
  const target=p?document.querySelector('#detail-title'):anchorFor(destination.hash||'#home-title');(target?.matches('h1,h2,[tabindex],a,button')?target:target?.querySelector('h2'))?.focus({preventScroll:true});
  if(!p&&destination.hash)target?.scrollIntoView({behavior:'instant'});
  document.querySelector('#route-status').textContent=p?`${p.title}の詳細ページ`:'ポートフォリオのメインページ';
 }catch(error){if(error.name!=='AbortError'){console.error(error);cancelTransition(true);location.href=destination.href;}}
 finally{if(transition?.controller===controller)cancelTransition();}
}
document.addEventListener('click',event=>{
 const link=event.target.closest('a');if(!link||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target||link.hasAttribute('download'))return;
 const local=new URL(link.href);if(local.origin===location.origin&&local.pathname===location.pathname&&local.hash){
  const target=anchorFor(local.hash);if(target){event.preventDefault();if(link.classList.contains('search-book')){savePosition(link.id);history.pushState({...history.state,focusId:target.id},'',local.pathname+local.hash)}else{history.replaceState({...history.state},'',local.pathname+local.hash)}target.scrollIntoView({behavior:motion.matches?'instant':'smooth'});(target.matches('h1,h2,[tabindex],a,button')?target:target.querySelector('h2'))?.focus({preventScroll:true});return;}
 }
 if(link.hasAttribute('data-book-detail')){event.preventDefault();navigate(link.href,{keyElement:document.getElementById('key-'+link.dataset.bookDetail)});return;}
 if(link.hasAttribute('data-home')){event.preventDefault();if(transition||returnRequested)return;if(history.state?.fromHome){returnRequested=true;history.back();}else{navigate(link.href);}return;}
 if(link.hasAttribute('data-route')){
  const url=new URL(link.href);if(url.pathname===location.pathname&&url.hash){event.preventDefault();document.querySelector(url.hash)?.scrollIntoView({behavior:motion.matches?'instant':'smooth'});document.querySelector(url.hash+' h2')?.focus({preventScroll:true});return;}
  event.preventDefault();navigate(link.href);
 }
});
function finishHistoryView(){stopMedia();const p=pathProject(),state=history.state||{};p?renderDetail(p):renderHome();window.scrollTo({top:state.scrollY||0,behavior:'instant'});(document.getElementById(state.focusId||'')||document.querySelector(p?'#detail-title':'#works-title'))?.focus({preventScroll:true});restoring=false;}
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&transition){event.preventDefault();const historyTransition=restoring;routeToken++;cancelTransition(!historyTransition);if(historyTransition)finishHistoryView();}});
window.addEventListener('popstate',async()=>{
 if(document.body.dataset.page==='home'&&!pathProject()&&handleSummaryHistory())return;
 const token=++routeToken;returnRequested=false;cancelTransition();stopMedia();restoring=true;const p=pathProject(),state=history.state||{},returning=document.body.dataset.page==='detail'&&!p;
 try{if(returning&&!motion.matches)await closeDetail();if(token!==routeToken)return;cancelTransition();p?renderDetail(p):renderHome();
 await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));if(token!==routeToken)return;
 window.scrollTo({top:state.scrollY||0,behavior:'instant'});const focus=document.getElementById(state.focusId||'')||document.querySelector(p?'#detail-title':'#works-title');focus?.focus({preventScroll:true});restoring=false;
 if(returning&&!state.summarySlug)await enterKeys();
 }catch(error){if(error.name!=='AbortError')console.error(error);}finally{if(token===routeToken){cancelTransition();restoring=false;}}
});
window.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>savePosition(),120);},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden){for(const video of document.querySelectorAll('video'))if(!video.paused)video.pause();}else resumeVisibleMedia();});
window.addEventListener('pagehide',()=>{routeToken++;cancelTransition();stopMedia();});
motion.addEventListener('change',()=>{if(motion.matches){const historyTransition=restoring;routeToken++;cancelTransition(!historyTransition);if(historyTransition)finishHistoryView();for(const video of main.querySelectorAll('video'))video.pause();}else resumeVisibleMedia();});
const initial=pathProject();if(!history.state?.route)history.replaceState({route:initial?'detail':'home',scrollY:0},'');if(initial&&location.hash.startsWith('#project='))history.replaceState({...history.state,route:'detail'},'',initial.path);initial?renderDetail(initial):renderHome();
if(location.hash)requestAnimationFrame(()=>{const target=anchorFor(location.hash);target?.scrollIntoView({behavior:'instant'});revealDrawTarget(target)});
window.addEventListener('hashchange',()=>revealDrawTarget(anchorFor(location.hash)));

function wireDetailMedia(){
 const video=main.querySelector('.detail-video'),button=main.querySelector('.media-toggle');if(!video)return;
 let visible=false,userPaused=false;video.autoplay=!motion.matches;
 function label(){button.textContent=video.paused?'再生':'一時停止';button.setAttribute('aria-label',video.paused?'再現映像を再生':'再現映像を一時停止');button.setAttribute('aria-pressed',String(!video.paused));}
 video.addEventListener('play',label);video.addEventListener('pause',label);
 video.dataset.resume='true';video._resume=()=>{if(visible&&!userPaused&&!motion.matches&&!document.hidden)video.play().catch(label);};
 button.addEventListener('click',()=>{if(video.paused){userPaused=false;video.play().catch(label);}else{userPaused=true;video.pause();}label();});
 observer=new IntersectionObserver(entries=>{visible=entries.at(-1).isIntersecting;if(!visible)video.pause();else video._resume();label();},{threshold:.08});observer.observe(video);label();
 const error=()=>{document.querySelector('#route-status').textContent='動画を読み込めませんでした。動画リンクから確認できます。';button.textContent='読み込みエラー';button.disabled=true;};video.addEventListener('error',error);video.querySelector('source')?.addEventListener('error',error);
}
function resumeVisibleMedia(){main.querySelector('.detail-video')?._resume?.();}
async function closeDetail(){
 const controller=new AbortController(),surface=document.createElement('div'),copy=main.cloneNode(true),headerHeight=document.querySelector('.site-header').getBoundingClientRect().height;
 surface.className='detail-closing-surface';surface.setAttribute('aria-hidden','true');surface.inert=true;surface.style.top=headerHeight+'px';
 for(const el of copy.querySelectorAll('[id]'))el.removeAttribute('id');copy.removeAttribute('id');
 const originalVideos=[...main.querySelectorAll('video')];[...copy.querySelectorAll('video')].forEach((v,i)=>{const original=originalVideos[i],canvas=document.createElement('canvas');canvas.width=original.videoWidth||1240;canvas.height=original.videoHeight||900;canvas.style.cssText='display:block;width:100%;height:auto;aspect-ratio:1240/900';try{if(original.readyState>=2)canvas.getContext('2d').drawImage(original,0,0,canvas.width,canvas.height);}catch{}if(original.readyState>=2)v.replaceWith(canvas);else{const img=document.createElement('img');img.src=original.poster;img.alt='';img.style.cssText=canvas.style.cssText;v.replaceWith(img);}});
 Object.assign(copy.style,{position:'absolute',top:(main.getBoundingClientRect().top-headerHeight)+'px',left:'0',width:main.getBoundingClientRect().width+'px',margin:'0',background:'#f5f0e4',visibility:'visible'});surface.append(copy);document.body.append(surface);main.style.visibility='hidden';
 const animation=surface.animate([{clipPath:'inset(0 0% 0 0)',transform:'translateX(0)'},{clipPath:'inset(0 100% 0 0)',transform:'translateX(-18px)'}],{duration:360,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
 transition={controller,animations:[animation],nodes:[surface],focusId:'detail-title'};document.body.dataset.navigating='true';await wait(360,controller.signal);
}

async function enterKeys(){
 if(motion.matches)return;const rows=[...main.querySelectorAll('.piano-row')],visible=rows.some(e=>{const r=e.getBoundingClientRect();return r.bottom>document.querySelector('.site-header').getBoundingClientRect().height&&r.top<innerHeight});const targets=visible?rows:[main.querySelector('.notebook')].filter(Boolean);const controller=new AbortController();const animations=targets.map((row,i)=>row.animate([{transform:'translateX(110%)',opacity:0},{transform:'translateX(0)',opacity:1}],{duration:240,delay:i*14,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'}));
 transition={controller,animations,nodes:[],focusId:'works-title'};document.body.dataset.navigating='true';await wait(340,controller.signal);cancelTransition();
}

initPaperUI();
document.addEventListener('portfolio-paper-intent',event=>{if(!event.detail.element.closest('.site-header')||!transition)return;const historyTransition=restoring;routeToken++;cancelTransition();returnRequested=false;if(historyTransition)finishHistoryView()});
// The always-visible menu can interrupt a decorative page transition immediately.
document.addEventListener('click',event=>{if(!event.target.closest('.site-header a')||!transition)return;const historyTransition=restoring;routeToken++;cancelTransition();returnRequested=false;if(historyTransition)finishHistoryView();},{capture:true});

function renderClosing(){
 const section=document.createElement('section');section.className='closing-section home-section';section.id='closing';section.setAttribute('aria-labelledby','closing-title');section.innerHTML=`<div class="closing-paper"><p class="eyebrow">04 / 採用担当の方へ</p><h2 id="closing-title" tabindex="-1">一緒につくりたいこと</h2><p>「社会の役に立ってから死ぬ」。これは、私が大切にしている人生の抱負です。自分がつくったもので誰かの困りごとを減らす。その小さな貢献を、積み重ねていきたいです。</p><p>私の夢は、2112年にドラえもんをつくることです。世界中の「のび太」を助けたい。困ったときや、一人ではうまくいかないときに、その人に寄り添い、挑戦を支えられる存在を技術で実現したいと考えています。</p><p>この夢に向けた一歩として、身近な課題の解決策を形にする個人開発と、AIの行動判断や影響評価を考える個人研究に取り組んでいます。</p><p class="closing-invitation">私は、つくることだけでなく、誰のどんな課題を解決するのか、何を優先してつくるのかを考えることにも面白さを感じています。利用者の声と実際の使われ方を確かめ、異なる専門性を持つ方々と協力しながら、使われ続けるプロダクトに育てていきたいです。</p></div>`;main.append(section);
}
