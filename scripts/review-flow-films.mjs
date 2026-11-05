import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {featureFlows} from '../site/music/feature-flows.js';
const {chromium}=await import(process.env.PORTFOLIO_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.PORTFOLIO_REVIEW_URL||'http://127.0.0.1:4173',out='.review/flow-playback';await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:process.platform==='win32'?{channel:'msedge'}:{})});
const checks=[],errors=[];
try{
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});await context.route('https://api.github.com/**',r=>r.fulfill({json:[]}));
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  for(const [kind,story] of Object.entries(featureFlows)){
   await page.goto(base+'/projects/'+kind+'/');const video=page.locator('.detail-video');await video.waitFor();
   assert.equal(await page.locator('[data-film-caption]').innerText(),story.captions[3],'poster caption must describe the static result');
   await video.evaluate(async v=>{v.preload='auto';v.load();await new Promise((ok,bad)=>{if(v.readyState>=2)return ok();v.addEventListener('loadeddata',ok,{once:true});v.addEventListener('error',()=>bad(new Error('Media failed')),{once:true})});v.pause()});
   assert.deepEqual(await video.evaluate(v=>[v.duration,v.videoWidth,v.videoHeight,v.muted,v.controls]),[20,1240,900,true,false]);
   for(const [phase,time] of [[0,1.5],[1,6.5],[2,11.5],[3,17.5]]){
    await video.evaluate((v,time)=>new Promise(ok=>{v.addEventListener('seeked',ok,{once:true});v.currentTime=time}),time);
    assert.equal(await page.locator('[data-film-caption]').innerText(),story.captions[phase]);
    assert.equal(await page.locator('[data-film-stage]').innerText(),'0'+(phase+1)+' / 04');
    if(kind==='mania'||kind==='career')await video.screenshot({path:`${out}/${kind}-${width}-${phase}.png`});
   }
   assert.ok(await page.locator('.detail-flow-caption').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=14));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.locator('.detail-media').screenshot({path:`${out}/${kind}-${width}-detail.png`});
   checks.push({kind,width,all4PhaseCaptions:true,duration:20,silent:true,videoDimensions:[1240,900],readableExternalCaption:true});
  }
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
 const markup=`<style>body{margin:20px;background:#f2f0e5;display:grid;grid-template-columns:repeat(4,1fr);gap:16px;font:16px sans-serif}video{width:100%;height:auto}figure{margin:0}</style>`+Object.entries(featureFlows).map(([kind,story])=>`<figure><figcaption>${story.title}</figcaption><video muted playsinline preload="auto" src="${base}/recreation/media/${kind==='soccer'?'soccer-v2':kind}.mp4" data-kind="${kind}"></video></figure>`).join('');
 await page.route(base+'/__flow_playback__',route=>route.fulfill({contentType:'text/html',body:markup}));await page.goto(base+'/__flow_playback__');
 const playback=await page.evaluate(async()=>Promise.all([...document.querySelectorAll('video')].map(async v=>{
  await new Promise((ok,bad)=>{if(v.readyState>=2)return ok();v.addEventListener('loadeddata',ok,{once:true});v.addEventListener('error',()=>bad(new Error(v.dataset.kind+' load failed')),{once:true})});
  v.muted=true;const ended=new Promise((ok,bad)=>{v.addEventListener('ended',ok,{once:true});v.addEventListener('error',()=>bad(new Error('Playback failed')),{once:true});setTimeout(()=>bad(new Error(v.dataset.kind+' timeout')),30000)});await v.play();await ended;
  return {kind:v.dataset.kind,duration:v.duration,ended:v.ended,error:v.error?.message||null,decodedFrames:v.getVideoPlaybackQuality().totalVideoFrames};
 })));
 for(const p of playback){assert.equal(p.duration,20);assert.equal(p.ended,true);assert.equal(p.error,null);assert.ok(p.decodedFrames>=470)}
 await page.screenshot({path:out+'/all-eight-ended.png'});await context.close();assert.deepEqual(errors,[]);
 await writeFile(out+'/results.json',JSON.stringify({checks,playback,errors},null,2));console.log('PASS all8 20-second films: four stage captions on desktop/mobile; full browser playback, no media or page errors.');
}finally{await browser.close()}
