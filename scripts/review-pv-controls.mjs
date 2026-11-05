// Exercises actual PV controls, including a denied autoplay promise and motion preferences.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.PORTFOLIO_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.PORTFOLIO_REVIEW_URL||'http://127.0.0.1:4173',out='.review/pv-controls';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
const checks=[],errors=[];
try{
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:1000}});
  await context.route('https://api.github.com/**',r=>r.fulfill({json:[]}));
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/projects/mania/');
  const video=page.locator('.detail-video'),button=page.locator('.media-toggle');
  await video.scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>{const v=document.querySelector('video');return v.readyState>=2&&!v.paused&&v.currentTime>.15});
  assert.deepEqual(await video.evaluate(v=>[v.muted,v.playsInline,v.loop,v.autoplay]),[true,true,true,true]);
  await page.locator('.site-footer').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('video').paused);
  await video.scrollIntoViewIfNeeded();await page.waitForFunction(()=>!document.querySelector('video').paused);
  await button.click();assert.equal(await video.evaluate(v=>v.paused),true);
  const frozen=await video.evaluate(v=>v.currentTime);await page.waitForTimeout(180);assert.equal(await video.evaluate(v=>v.currentTime),frozen);
  await page.locator('.site-footer').scrollIntoViewIfNeeded();await video.scrollIntoViewIfNeeded();
  await page.waitForTimeout(180);assert.equal(await video.evaluate(v=>v.paused),true,'user pause persists after scrolling');
  await button.click();await page.waitForFunction(()=>!document.querySelector('video').paused);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'))});
  assert.equal(await video.evaluate(v=>v.paused),true);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:false,configurable:true});document.dispatchEvent(new Event('visibilitychange'))});
  await page.waitForFunction(()=>!document.querySelector('video').paused);
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('video').paused);
  await button.click();await page.waitForFunction(()=>!document.querySelector('video').paused);
  await button.click();await page.reload();await video.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);assert.equal(await video.evaluate(v=>v.paused),true);assert.equal(await video.evaluate(v=>v.autoplay),false);
  assert.match(await button.getAttribute('aria-label'),/再生/);
  await page.screenshot({path:`${out}/reduced-motion-${width}.png`});
  await button.click();await page.waitForFunction(()=>!document.querySelector('video').paused);
  checks.push({width,mutedInlineAutoplay:true,offscreenPauseResume:true,pauseFreezesTime:true,pauseSurvivesScrolling:true,backgroundPauseResume:true,reducedMotionStops:true,reducedMotionManualPlay:true});
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 await context.addInitScript(()=>{
  const play=HTMLMediaElement.prototype.play;
  window.__permitPvPlayback=()=>{HTMLMediaElement.prototype.play=play};
  HTMLMediaElement.prototype.play=function(){this.autoplay=false;this.pause();return Promise.reject(new DOMException('Autoplay blocked for fallback verification','NotAllowedError'))};
 });
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/projects/mania/');const video=page.locator('.detail-video'),button=page.locator('.media-toggle');
 await video.scrollIntoViewIfNeeded();await page.waitForTimeout(250);
 assert.equal(await video.evaluate(v=>v.paused),true);assert.equal(await button.isEnabled(),true);assert.match(await button.getAttribute('aria-label'),/再生/);
 await page.evaluate(()=>window.__permitPvPlayback());await button.click();await page.waitForFunction(()=>!document.querySelector('video').paused&&document.querySelector('video').currentTime>.1);
 checks.push({autoplayRejectionHandled:true,manualPlayAfterRejection:true});await context.close();
 assert.deepEqual(errors,[]);await writeFile(out+'/results.json',JSON.stringify({checks,errors},null,2));
 console.log('PASS PV autoplay, pause/resume, motion preference, background, and blocked-autoplay fallback.');
}finally{await browser.close()}
