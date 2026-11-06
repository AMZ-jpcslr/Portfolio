import {chromium} from 'file:///C:/Users/yomas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=process.env.PORTFOLIO_ROOT||new URL('../',import.meta.url).pathname.replace(/^\/(\w:)/,'$1');
const ffmpeg=root+'/video/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe';
process.env.PLAYWRIGHT_FFMPEG_PATH=ffmpeg;
const out=root+'/site/recordings/media';const review=root+'/.review/recording-capture';await mkdir(out,{recursive:true});await mkdir(review,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const opts={viewport:{width:430,height:932},deviceScaleFactor:1,permissions:['geolocation'],geolocation:{latitude:35.0289,longitude:135.7595,accuracy:10},serviceWorkers:'block',timezoneId:'Asia/Tokyo'};
 const prep=await browser.newContext(opts);const setup=await prep.newPage();await setup.goto('http://127.0.0.1:5199/');await setup.getByRole('button',{name:'乗車駅',exact:true}).click();await setup.getByPlaceholder(/駅名/).fill('今出川');await setup.locator('[data-station-id="kyoto-imadegawa"]').click();const storageState=await prep.storageState();await prep.close();
 const context=await browser.newContext({...opts,storageState,recordVideo:{dir:review+'/raw',size:opts.viewport}});
 const page=await context.newPage();const errors=[],walking=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',async r=>{if(r.url().includes('/api/walking'))walking.push({status:r.status(),body:JSON.parse(await r.text())});});
 const began=Date.now();await page.goto('http://127.0.0.1:5199/');await page.getByRole('button',{name:'現在地を再取得',exact:true}).waitFor();await page.waitForTimeout(3500);const trim=(Date.now()-began)/1000;
 await page.getByRole('button',{name:'現在地を再取得',exact:true}).click();await page.waitForTimeout(1800);
 await page.getByRole('button',{name:'乗車駅',exact:true}).click();await page.waitForTimeout(900);await page.getByPlaceholder(/駅名/).pressSequentially('今出川',{delay:350});await page.waitForTimeout(1300);await page.locator('[data-station-id="kyoto-imadegawa"]').click();
 await page.getByText(/現在地から駅入口まで 約/).first().waitFor({timeout:30000});await page.waitForTimeout(1800);await page.screenshot({path:out+'/mania.jpg',type:'jpeg',quality:94});
 const card=page.locator('button').filter({hasText:'余裕あり'}).first();await card.scrollIntoViewIfNeeded();await page.waitForTimeout(900);await card.click();await page.waitForTimeout(1000);await page.mouse.wheel(0,480);await page.waitForTimeout(3500);await page.screenshot({path:review+'/mania-result.png'});
 const source=await page.video().path();await context.close();assert.deepEqual(errors,[]);assert.ok(walking.some(r=>r.status===200));
 execFileSync(ffmpeg,['-y','-ss',String(trim),'-i',source,'-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',out+'/mania.mp4'],{stdio:'pipe'});
 await writeFile(review+'/mania-capture.json',JSON.stringify({id:'mania',capturedAt:new Date().toISOString(),url:'http://127.0.0.1:5199/',viewport:opts.viewport,sensor:'Browser geolocation override: synthetic test position near Imadegawa, accuracy 10 m; not this PC GPS',method:'Actual local React application, real station search and timetable, real walking API response. No response mocks, captions, overlays or recreated UI. Only initial loading trimmed.',actions:['現在地を再取得','乗車駅を開く','今出川を検索・選択','徒歩経路・発車判定を表示','余裕ありの便を開いて詳細表示'],walking:walking.map(r=>({status:r.status,distanceMeters:r.body.distanceMeters,durationSeconds:r.body.durationSeconds,error:r.body.error})),errors},null,2));const captured=JSON.parse(await readFile(review+'/mania-capture.json','utf8'));const manifest=JSON.parse(await readFile(root+'/site/recordings/manifest.json','utf8'));manifest.mania=captured;Object.assign(manifest.records.find(x=>x.id==='mania'),{capturedAt:captured.capturedAt,sourceURL:captured.url,trimStartSeconds:0});await writeFile(root+'/site/recordings/manifest.json',JSON.stringify(manifest,null,2));console.log('CAPTURED mania',walking.map(r=>r.status));
}finally{await browser.close();}
