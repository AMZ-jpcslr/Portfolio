// Browser regression review. Run npm run build and PORT=4186 npm start first.
// Requires Playwright and Chromium in the execution environment.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const out=require('node:path').resolve(__dirname,'../docs/portfolio-lab/cloud-revision');require('node:fs').mkdirSync(out,{recursive:true});
 const base=process.env.PORTFOLIO_REVIEW_URL||'http://127.0.0.1:4186';
 const report=[];
 for(const width of [1440,390,320]){
  const context=await browser.newContext({viewport:{width,height:width===1440?1000:844},isMobile:width<500,hasTouch:width<500});
  const page=await context.newPage(),errors=[],media=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\.mp4(?:\?|$)/.test(r.url()))media.push(r.url())});
  await page.goto(base+'/',{waitUntil:'networkidle'});
  await page.locator('#key-mania').scrollIntoViewIfNeeded();if(width===1440){for(const slug of ['mania','voice','moral'])await page.locator('#key-'+slug).hover();}
  assert.equal(await page.locator('video').count(),0);assert.deepEqual(media,[]);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:`${out}/home-${width}.png`,fullPage:true});
  await page.locator('#key-mania').click();await page.locator('dialog[open]').waitFor();
  assert.equal(await page.locator('dialog video').count(),0);assert.deepEqual(media,[]);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'book-overview-title');
  assert.ok(await page.locator('dialog').innerText().then(t=>t.includes('20人近く')&&t.includes('既存の乗換案内')));
  assert.ok(await page.evaluate(()=>document.querySelector('dialog').scrollWidth<=document.querySelector('dialog').clientWidth));
  await page.waitForTimeout(300);await page.screenshot({path:`${out}/summary-${width}.png`});
  await page.keyboard.press('Escape');await page.locator('dialog').waitFor({state:'detached'});assert.equal(await page.evaluate(()=>document.activeElement.id),'key-mania');
  await page.locator('#key-mania').click();await page.locator('dialog[open]').waitFor();await page.goBack();await page.locator('dialog').waitFor({state:'detached'});
  await page.goForward();await page.locator('dialog[open]').waitFor();
  await page.locator('#book-overview-more').click();await page.waitForURL('**/projects/mania/');
  await page.locator('.detail-video').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('.detail-video').readyState>=2);
  const info=await page.locator('.detail-video').evaluate(v=>({duration:v.duration,width:v.videoWidth,src:v.currentSrc}));assert.ok(info.duration>=19&&info.duration<=21,JSON.stringify(info));assert.ok(info.width>0);assert.ok(media.length>0);
  await page.screenshot({path:`${out}/detail-${width}.png`});
  await page.goBack();await page.locator('dialog[open]').waitFor();await page.goForward();await page.waitForFunction(()=>document.body.dataset.page==='detail');await page.goBack();await page.locator('dialog[open]').waitFor();await page.locator('.overview-close').click();await page.locator('dialog').waitFor({state:'detached'});
  // Verify the listener remains single after returning from detail.
  await page.locator('#key-voice').click();await page.locator('dialog[open]').waitFor();assert.equal(await page.locator('dialog').count(),1);await page.keyboard.press('Escape');await page.locator('dialog').waitFor({state:'detached'});assert.equal(await page.evaluate(()=>document.activeElement.id),'key-voice');
  assert.equal(await page.locator('.notebook-visual, #notebook-image').count(),0);
  for(const slug of ['voice','weather','stream','soccer','proxy','moral','career','mania']){
   await page.locator(`[data-notebook="${slug}"]`).focus();assert.ok((await page.locator('#notebook-reason').innerText()).length>15);
  }
  await page.locator('#shelf-query').fill('音声');await page.locator('.shelf-search-form').evaluate(f=>f.requestSubmit());await page.waitForTimeout(900);assert.equal(await page.locator('.search-book').count(),1);
  await page.locator('#search-result-voice').click();await page.waitForURL('**/projects/voice/');await page.goBack();await page.locator('#shelf-query').waitFor();assert.equal(await page.locator('#shelf-query').inputValue(),'音声');assert.equal(await page.locator('.search-book').count(),1);
  assert.deepEqual(errors,[]);report.push({width,homeVideoRequests:0,summaryVideoRequests:0,detailVideo:info,errors,summaryCloseFocusBack:true,historySearch:true,notebookReasons:8});await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage();
 const routes=[];for(const slug of ['mania','career','stream','voice','weather','moral','proxy','soccer']){
  const response=await page.goto(`${base}/projects/${slug}/`,{waitUntil:'networkidle'});assert.equal(response.status(),200);
  const body=await page.locator('main').innerText();assert.ok(!/本人申告|本人情報|何日時点|2026年9月時点|稼働確認中|運用確認中/.test(body),slug);
  assert.equal(await page.locator('.case-flow li').count(),3);assert.equal(await page.locator('.case-reflection').count(),1);assert.equal(await page.locator('.detail-video').count(),1);await page.locator('.detail-video').scrollIntoViewIfNeeded();await page.locator('.media-toggle').click();await page.waitForFunction(()=>document.querySelector('.detail-video').readyState>=2);routes.push(slug);
 }
 await page.goto(base+'/');
 const overviewRequests=[];page.on('request',r=>{if(/\.mp4(?:\?|$)/.test(r.url()))overviewRequests.push(r.url())});
 for(const slug of routes){await page.locator('#key-'+slug).click();await page.locator('dialog[open]').waitFor();assert.equal(await page.locator('dialog h2').innerText(),await page.locator('#key-'+slug+' strong').innerText());await page.keyboard.press('Escape');await page.locator('dialog').waitFor({state:'detached'});}
 assert.deepEqual(overviewRequests,[]);
 await page.locator('#key-career').click();await page.locator('dialog').waitFor();
 await page.keyboard.press('Shift+Tab');assert.ok(await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement)));await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement)));
 await page.keyboard.press('Escape');await page.locator('dialog').waitFor({state:'detached'});assert.equal(await page.evaluate(()=>document.activeElement.id),'key-career');
 report.push({directRoutes:routes,reducedMotionAndFocusTrap:true});
 require('node:fs').writeFileSync(out+'/browser-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
