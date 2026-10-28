import{stamp}from'./japan-time.js';
import{observeDrawParts}from'./draw-reveals.js';
const owner='AMZ-jpcslr',actorId=149338110;
export const allowedRepos=['train_time','Syukatu-Note','Streaming-Screen','Yomiage_Discord_Bot','Shindo_Discord_Bot','Artificial-Moral-Architecture','ssl-inspection-prodxy','SSL-DEMO'];
const key='portfolio-public-diary-v1',cooldown=15*60*1000;let saved=null,inflight=null,nextAttempt=0;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validRepo=repo=>repo?.startsWith(owner+'/')&&allowedRepos.includes(repo.slice(owner.length+1));
export function normalizeEvents(events){
 const labels={PushEvent:'コードをpush',CreateEvent:'作成',ReleaseEvent:'リリースを公開',PullRequestEvent:'プルリクエスト',IssuesEvent:'Issue'};
 return [...new Map((Array.isArray(events)?events:[]).filter(x=>x.public===true&&x.actor?.id===actorId&&x.actor?.login===owner&&validRepo(x.repo?.name)&&labels[x.type]&&Number.isFinite(Date.parse(x.created_at))).map(x=>{
  const repo=x.repo.name,base='https://github.com/'+repo,p=x.payload||{};let label=labels[x.type],url=base;
  if(x.type==='PushEvent'){const sha=p.head;if(/^[a-f0-9]{40}$/i.test(sha))url=base+'/commit/'+sha;}
  if(x.type==='CreateEvent')label=({branch:'ブランチを作成',tag:'タグを作成',repository:'リポジトリを作成'})[p.ref_type]||label;
  if(x.type==='ReleaseEvent'){if(p.action!=='published')return null;const tag=p.release?.tag_name;if(tag)url=base+'/releases/tag/'+encodeURIComponent(tag);}
  if(x.type==='PullRequestEvent'){label+=({opened:'を作成',closed:'をクローズ',reopened:'を再開'})[p.action]||'を更新';if(Number.isSafeInteger(p.number))url=base+'/pull/'+p.number;}
  if(x.type==='IssuesEvent'){label+=({opened:'を作成',closed:'をクローズ',reopened:'を再開'})[p.action]||'を更新';if(Number.isSafeInteger(p.issue?.number))url=base+'/issues/'+p.issue.number;}
  return{id:String(x.id),repo,type:x.type,label,date:x.created_at,url};
 }).filter(Boolean).map(x=>[x.id,x])).values()].sort((a,b)=>Date.parse(b.date)-Date.parse(a.date)).slice(0,8);
}
function validSnapshot(data){return data&&data.account===owner&&Number.isFinite(Date.parse(data.fetchedAt))&&Array.isArray(data.items)&&data.items.length<=8&&data.items.every(x=>validRepo(x.repo)&&Number.isFinite(Date.parse(x.date))&&typeof x.label==='string'&&x.label.length<100&&(x.url?.startsWith('https://github.com/'+x.repo+'/')||x.url==='https://github.com/'+x.repo))}
try{const cached=JSON.parse(localStorage.getItem(key));if(validSnapshot(cached)){saved=cached;nextAttempt=Number(cached.nextAttempt)||0}}catch{}
async function loadSaved(){if(saved)return;try{const r=await fetch('/music/github-snapshot.json',{credentials:'omit'}),data=await r.json();if(validSnapshot(data))saved=data;}catch{}}
async function refresh(){
 if(inflight)return inflight;if(Date.now()<nextAttempt)return{cached:true};
 nextAttempt=Date.now()+cooldown;
 inflight=(async()=>{const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);try{
  const response=await fetch('https://api.github.com/users/'+owner+'/events/public?per_page=30',{credentials:'omit',referrerPolicy:'no-referrer',headers:{Accept:'application/vnd.github+json'},signal:controller.signal});
  if(!response.ok){if([403,429].includes(response.status)){const reset=Number(response.headers.get('x-ratelimit-reset'))*1000;if(reset>Date.now())nextAttempt=Math.max(nextAttempt,reset);}throw new Error([403,429].includes(response.status)?'limit':'network');}
  const events=await response.json();if(!Array.isArray(events))throw new Error('network');saved={account:owner,fetchedAt:new Date().toISOString(),nextAttempt,items:normalizeEvents(events)};
  try{localStorage.setItem(key,JSON.stringify(saved))}catch{}return{ok:true};
 }catch(error){if(saved)try{localStorage.setItem(key,JSON.stringify({...saved,nextAttempt}))}catch{}return{error:error.message==='limit'?'limit':'network'};}finally{clearTimeout(timer);inflight=null;}})();return inflight;
}
export function setupDiary(root){
 const records=root.querySelector('#records');if(!records)return;
 const section=document.createElement('section');section.className='github-diary';section.setAttribute('aria-labelledby','diary-title');section.innerHTML=`<div class="diary-binding" aria-hidden="true"></div><div class="diary-heading"><p class="eyebrow">GITHUB / PUBLIC DIARY</p><h3 id="diary-title" tabindex="-1">最近の開発記録</h3><p>このサイトで紹介している作品の、公開GitHub更新です。</p></div><p class="diary-status" role="status">保存した記録を確認しています。</p><ol class="diary-list"></ol><div class="diary-actions"><button type="button" class="diary-refresh">更新を確認</button><a href="https://github.com/AMZ-jpcslr?tab=overview" target="_blank" rel="noopener noreferrer">GitHubの活動を見る ↗</a></div><p class="diary-note">日時は日本時間（Asia/Tokyo）。公開イベントの一部を表示しています。pushは公開リリースを意味しません。最新の操作が反映されるまで時間がかかる場合があります。</p>`;records.append(section);
 const status=section.querySelector('.diary-status'),list=section.querySelector('.diary-list'),button=section.querySelector('button');let retryTimer,renderedIds='';
 function paint(result={}){if(!section.isConnected)return;const ids=(saved?.items||[]).map(x=>x.id).join('|');if(ids!==renderedIds){renderedIds=ids;list.innerHTML=(saved?.items||[]).map((x,i)=>`<li class="diary-entry" data-event-id="${esc(x.id)}" data-note-order="${i}"><time datetime="${esc(x.date)}">${stamp(x.date)}</time><div><p class="diary-event">${esc(x.label)}</p><strong>${esc(x.repo.slice(owner.length+1))}</strong><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(x.repo.slice(owner.length+1)+'の'+x.label)}をGitHubで確認">GitHub ↗</a></div></li>`).join('');}
  let message=saved?'最終取得：'+stamp(saved.fetchedAt)+'。':'保存した記録はありません。';
  if(saved&&!saved.items.length)message+='取得した範囲に、対象作品の公開更新はありません。';
  if(result.error)message=(result.error==='limit'?'APIの利用上限に達したため、':'接続できないため、')+(saved?'保存した記録を表示しています。':'GitHubへのリンクから確認してください。')+' '+message;
  status.textContent=message;button.disabled=Date.now()<nextAttempt;button.textContent=button.disabled?'更新確認はしばらく後に':'更新を確認';observeDrawParts(section);clearTimeout(retryTimer);if(button.disabled)retryTimer=setTimeout(()=>{if(section.isConnected){button.disabled=false;button.textContent='更新を確認'}},Math.min(Math.max(1,nextAttempt-Date.now()),2147483647));
 }
 button.addEventListener('click',async()=>{button.disabled=true;status.textContent='公開更新を確認しています。';paint(await refresh());});
 loadSaved().then(()=>paint());
 const observer=new IntersectionObserver(async entries=>{if(!entries.some(e=>e.isIntersecting))return;observer.disconnect();await loadSaved();paint();if(!saved||Date.now()-Date.parse(saved.fetchedAt)>=cooldown)paint(await refresh());},{rootMargin:'150px'});observer.observe(section);return()=>{clearTimeout(retryTimer);observer.disconnect()};
}
