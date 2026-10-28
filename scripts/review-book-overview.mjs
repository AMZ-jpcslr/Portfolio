// Browser regression for the overview book, history, detail media and responsive controls.
// Supply Playwright via PORTFOLIO_PLAYWRIGHT_MODULE if it is not installed in this project.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.PORTFOLIO_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.PORTFOLIO_REVIEW_URL||'http://127.0.0.1:4173';
const out='.review/book-overview';await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:process.platform==='win32'?{channel:'msedge'}:{})});
const slugs=['mania','career','stream','voice','weather','moral','proxy','soccer'],checks=[],errors=[];
try{
 for(const width of [1440,390,320,844]){
  const context=await browser.newContext({viewport:{width,height:width===844?390:1000},hasTouch:width<900,isMobile:width<900});
  await context.route('https://api.github.com/**',r=>r.fulfill({json:[]}));
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));let media=0;page.on('request',r=>{if(/\.mp4(?:\?|$)/.test(r.url()))media++});
  await page.goto(base+'/#works');await page.locator('#key-mania').waitFor();
  if(width===1440)for(const slug of slugs)await page.locator('#key-'+slug).hover();
  assert.equal(await page.locator('video').count(),0);assert.equal(media,0);
  await page.locator('#key-mania').click();await page.locator('dialog[open]').waitFor();
  assert.equal(await page.evaluate(()=>history.state.summarySlug),'mania');
  assert.equal(await page.locator('dialog video').count(),0);assert.equal(media,0);
  assert.equal(await page.locator('.book-opening-cover').count(),0);assert.equal(await page.locator('.book-summary-pages').evaluate(e=>getComputedStyle(e).opacity),'1');assert.equal(await page.locator('dialog').evaluate(d=>d.getAnimations({subtree:true}).filter(a=>a.playState==='running'&&a.effect.target.matches('.open-book,.book-summary-pages')).length),0);
  await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog').open);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'key-mania');
  await page.goForward();await page.locator('dialog[open]').waitFor();
  await page.locator('.summary-more').focus();assert.equal(await page.locator('.book-opening-cover').count(),0);
  await page.locator('.summary-more').click();await page.waitForURL('**/projects/mania/');
  await page.locator('video').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('video').readyState>=2&&!document.querySelector('video').paused);
  assert.deepEqual(await page.locator('video').evaluate(v=>[v.duration,v.videoWidth,v.muted,v.controls]),[20,1240,true,false]);
  await page.goBack();await page.locator('dialog[open]').waitFor();assert.equal(await page.evaluate(()=>history.state.summarySlug),'mania');
  await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog').open);
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const slug of slugs){
   await page.locator('#key-'+slug).click();await page.locator('dialog[open]').waitFor();
   assert.equal(await page.locator('.book-opening-cover').count(),0);assert.equal(await page.locator('dialog').evaluate(d=>d.scrollWidth>d.clientWidth),false);
   for(const selector of ['.summary-close','.summary-more'])assert.ok((await page.locator(selector).boundingBox()).height>=44);
   if(slug==='moral'){await page.locator('.summary-more').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/summary-${width}.png`});}
   await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog').open);
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.goto(base+'/#records');assert.equal(await page.locator('.notebook img:not(.github-mark)').count(),0);
  for(const slug of slugs){await page.locator('#notebook-tab-'+slug).focus();assert.ok((await page.locator('#notebook-reason').innerText()).length>10);assert.ok((await page.locator('#notebook-result').innerText()).length>10)}
  await page.goto(base+'/#search');await page.locator('#shelf-query').fill('理念');await page.locator('#shelf-query').press('Enter');await page.locator('#search-result-section-philosophy').click();await page.waitForURL('**/#philosophy');await page.goBack();assert.equal(await page.locator('#shelf-query').inputValue(),'理念');
  checks.push({width,immediateSummary:true,overviewVideoRequests:0,all8Summaries:true,history:true,touchEmulated:width<900});await context.close();
 }
 const p=await browser.newPage({viewport:{width:1440,height:1000}});p.on('pageerror',e=>errors.push(e.message));
 for(const slug of slugs){await p.goto(base+'/projects/'+slug+'/');await p.locator('.detail-video').waitFor();const text=await p.locator('main').innerText();assert.ok(!/本人申告|本人情報|稼働確認中|年.*月時点/.test(text));assert.ok(await p.locator('.case-reflection').count());}
 await p.goto(base+'/#works');await p.locator('#key-career').click();await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('dialog').open);await p.locator('#key-voice').click();await p.locator('.summary-more').evaluate(e=>{e.click();e.click()});await p.waitForURL('**/projects/voice/');await p.goBack();await p.locator('dialog[open]').waitFor();await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('dialog').open);assert.equal(await p.locator('.flying-key,.key-wipe,.note-flight,.book-opening-cover').count(),0);
 assert.deepEqual(errors,[]);await writeFile(out+'/results.json',JSON.stringify({checks,errors},null,2));console.log('PASS immediate overview book, all8 summaries and detail routes, silent detail video, Back/Forward, focus/cancel/repeated navigation, history/search, desktop/mobile/reduced motion');
}finally{await browser.close()}
