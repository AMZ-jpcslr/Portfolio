// Browser checks for both places that use the short feature animations.
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
const {chromium}=await import(process.env.PORTFOLIO_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.PORTFOLIO_REVIEW_URL||'http://127.0.0.1:4173';
const out='.review/core-demos';await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:process.platform==='win32'?{channel:'msedge'}:{})});
const kinds=['mania','career','stream','voice','weather','moral','proxy','soccer'],errors=[],checks=[];
async function running(figure,value){await figure.page().waitForFunction(({selector,value})=>document.querySelector(selector)?.dataset.running===String(value),{selector:await figure.evaluate(el=>el.closest('dialog')?'dialog[open] .core-demo':'.notebook .core-demo'),value});}
const clocks=figure=>figure.evaluate(el=>el.querySelector('.core-demo-visual').getAnimations({subtree:true}).map(a=>({time:a.currentTime,state:a.playState})));
try{
 for(const width of [1440,390,320,844]){
  const context=await browser.newContext({viewport:{width,height:width===844?390:900},hasTouch:width<900,isMobile:width<900});
  await context.route('https://api.github.com/**',r=>r.fulfill({json:[]}));
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));const media=[];page.on('request',r=>{if(/\.mp4(?:\?|$)/.test(r.url()))media.push(r.url())});
  await page.goto(base+'/#works');
  for(const kind of kinds){
   await page.locator('#key-'+kind).click();const figure=page.locator('dialog[open] .core-demo');await figure.waitFor();
   assert.equal(await figure.getAttribute('data-core-kind'),kind);assert.ok((await figure.locator('figcaption').innerText()).length>25);
   if(width===390&&kind==='mania')assert.ok((await figure.boundingBox()).y<650,'demo must appear near the first mobile explanation');
   await figure.scrollIntoViewIfNeeded();await running(figure,true);
   const before=await clocks(figure);assert.ok(before.some(a=>a.state==='running'));
   await figure.locator('button').click();await running(figure,false);const paused=await clocks(figure);await page.waitForTimeout(100);const still=await clocks(figure);
   assert.deepEqual(paused,still,'pause must freeze every visual animation');assert.ok(still.every(a=>a.state==='paused'));
   for(const [time,index] of [[100,0],[3100,1],[6100,2],[9100,3]]){
    await figure.evaluate((el,time)=>el.querySelector('.core-demo-visual').getAnimations({subtree:true}).forEach(a=>a.currentTime=time),time);
    assert.equal(await figure.locator('.cd-caption.cd-at-'+index).evaluate(el=>getComputedStyle(el).visibility),'visible');
   }
   if(width===1440)await figure.screenshot({path:`${out}/${kind}.png`});
   if(kind==='mania'&&[1440,390,320].includes(width))await page.screenshot({path:`${out}/overview-${width}.png`});
   await figure.locator('button').click();await figure.locator('.flow-scenes').scrollIntoViewIfNeeded();await running(figure,true)
   await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog').open);
   assert.equal(await page.evaluate(()=>document.activeElement.id),'key-'+kind);
  }
  assert.equal(media.length,0,'overviews must not fetch video');
  await page.goto(base+'/#records');
  for(const kind of kinds){
   if(width<900)await page.locator('#notebook-tab-'+kind).tap();else await page.locator('#notebook-tab-'+kind).focus();
   const figure=page.locator('.notebook .core-demo');assert.equal(await figure.count(),1);assert.equal(await figure.getAttribute('data-core-kind'),kind);
   await figure.scrollIntoViewIfNeeded();await running(figure,true);
   assert.equal(await page.locator('#notebook-detail').getAttribute('href'),`/projects/${kind}/`);
   if(kind==='career'&&[1440,390].includes(width))await page.screenshot({path:`${out}/records-${width}.png`});
  }
  await page.locator('#closing-title').scrollIntoViewIfNeeded();await running(page.locator('.notebook .core-demo'),false);
  await page.locator('.notebook .core-demo').scrollIntoViewIfNeeded();await running(page.locator('.notebook .core-demo'),true);
  await page.emulateMedia({reducedMotion:'reduce'});const figure=page.locator('.notebook .core-demo');await running(figure,false);
  assert.equal(await figure.getAttribute('data-static'),'true');assert.equal((await clocks(figure)).length,0);
  await figure.locator('button').click();await running(figure,true);assert.ok((await clocks(figure)).some(a=>a.state==='running'),'explicit play works with reduced motion');
  await figure.locator('button').click();await running(figure,false);
  await page.goto(base+'/#works');await page.locator('#key-mania').click();const summary=page.locator('dialog[open] .core-demo');await summary.scrollIntoViewIfNeeded();await running(summary,false);assert.equal((await clocks(summary)).length,0);await summary.locator('button').click();await summary.locator('.flow-scenes').scrollIntoViewIfNeeded();await running(summary,true);assert.ok((await clocks(summary)).length>0);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'))});await running(summary,false);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:false,configurable:true});document.dispatchEvent(new Event('visibilitychange'))});await running(summary,true);
  await page.locator('.summary-more').click();await page.waitForURL('**/projects/mania/');assert.equal(await page.locator('.core-demo').count(),0);
  await page.goBack();await page.locator('dialog[open] .core-demo').waitFor();assert.equal(await page.locator('dialog .core-demo').count(),1);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await page.locator('dialog').evaluate(el=>el.scrollWidth>el.clientWidth),false);
  checks.push({width,all8Overviews:true,all8RecordTabs:true,pauseResume:true,offscreenPause:true,reducedMotionAndExplicitPlay:true,backgroundPause:true,history:true,overviewVideoRequests:media.length});await context.close();
 }
 assert.deepEqual(errors,[]);
 const source=Buffer.concat(await Promise.all(['feature-flows.js','core-demo.js','core-demo.css'].map(name=>readFile('site/music/'+name))));
 const results={checks,errors,assets:{rawBytes:source.length,gzipBytes:gzipSync(source).length,externalDependencies:0,additionalVideoRequests:0}};
 await writeFile(out+'/results.json',JSON.stringify(results,null,2));console.log('PASS short core demos: 8 overview + 8 record views at 4 viewport sizes; pause/resume, offscreen/background, reduced motion/manual play, history, zero overview video requests.',results.assets);
}finally{await browser.close()}
