import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'file:///C:/Users/yomas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const base=process.env.PORTFOLIO_REVIEW_URL||'http://127.0.0.1:4173';
const out='.review/recordings';await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'msedge'});const errors=[],checks=[];
try{
 for(const width of [1440,390,320]){
  const context=await browser.newContext({viewport:{width,height:1000}});await context.route('https://api.github.com/**',r=>r.fulfill({json:[]}));
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/#works');await page.locator('#key-mania').click();await page.locator('dialog[open]').waitFor();
  const short=page.locator('dialog video');await short.scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const v=document.querySelector('dialog video');return v?.readyState>=2&&!v.paused});
  const shortDuration=await short.evaluate(v=>v.duration);assert.ok(shortDuration<=9);assert.equal(await page.locator('dialog svg.product-pv-svg').count(),0);assert.equal(await page.locator('dialog .core-demo-captions').count(),0);
  await page.locator('dialog .core-demo-toggle').click();await page.waitForTimeout(300);const at=await short.evaluate(v=>v.currentTime);await page.waitForTimeout(500);assert.equal(await short.evaluate(v=>v.currentTime),at);
  await page.screenshot({path:out+'/summary-'+width+'.png'});
  await page.locator('.summary-more').click();await page.waitForURL('**/projects/mania/');await page.locator('.detail-video').scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const v=document.querySelector('.detail-video');return v?.readyState>=2&&!v.paused});
  const fullDuration=await page.locator('video').evaluate(v=>v.duration);assert.ok(fullDuration>shortDuration);
  assert.equal(await page.locator('.detail-flow-caption').count(),0);await page.locator('.media-toggle').click();assert.equal(await page.locator('video').evaluate(v=>v.paused),true);
  await page.locator('.detail-heading').scrollIntoViewIfNeeded();await page.locator('video').scrollIntoViewIfNeeded();await page.waitForTimeout(400);assert.equal(await page.locator('video').evaluate(v=>v.paused),true);
  await page.locator('.media-toggle').click();await page.waitForFunction(()=>!document.querySelector('video').paused);await page.screenshot({path:out+'/detail-'+width+'.png'});
  await page.goBack();await page.locator('dialog[open]').waitFor();await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog').open);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'key-mania');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  checks.push({width,shortDuration,fullDuration,autoplay:true,pauseStickyAcrossScroll:true,historyAndFocus:true});await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});await context.route('https://api.github.com/**',r=>r.fulfill({json:[]}));const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 for(const id of ['mania','career','stream','moral','proxy','soccer','voice','weather']){
  await page.goto(base+'/projects/'+id+'/');
  if(['voice','weather'].includes(id)){assert.equal(await page.locator('video').count(),0);assert.ok((await page.locator('.recording-unavailable').innerText()).includes('Discord'));checks.push({id,unavailableExplicit:true});continue;}
  const video=page.locator('video');await video.scrollIntoViewIfNeeded();await page.waitForTimeout(250);assert.equal(await video.evaluate(v=>v.paused),true);await page.locator('.media-toggle').click();await page.waitForFunction(()=>document.querySelector('video')?.readyState>=2&&!document.querySelector('video').paused);assert.ok((await video.evaluate(v=>v.currentSrc)).includes('/recordings/'));checks.push({id,loaded:true,reducedMotion:true});await page.screenshot({path:out+'/'+id+'.png'});
 }
 await page.goto(base+'/#records');await page.locator('#notebook-tab-mania').focus();await page.locator('.notebook video').scrollIntoViewIfNeeded();await page.locator('.notebook .core-demo-toggle').click();await page.waitForFunction(()=>!document.querySelector('.notebook video').paused);
 await page.locator('#key-mania').click();await page.locator('dialog[open]').waitFor();await page.waitForTimeout(300);assert.equal(await page.locator('.notebook video').evaluate(v=>v.paused),true);await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog').open);
 checks.push({modalPausesUnderlyingRecording:true});assert.deepEqual(errors,[]);await writeFile(out+'/results.json',JSON.stringify({checks,errors},null,2));console.log('PASS recordings',JSON.stringify(checks));
}finally{await browser.close();}
