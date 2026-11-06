import assert from 'node:assert/strict';
import {writeFile,mkdir} from 'node:fs/promises';
import {chromium} from 'file:///C:/Users/yomas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {interactionScenes,renderInteractionSvg} from 'file:///C:/Users/yomas/github/Portfolio/site/music/interaction-scenes.js';
const browser=await chromium.launch({headless:true,channel:'msedge'});const checks=[],overflow=[];
try{for(const [kind,meta] of Object.entries(interactionScenes)){
 const page=await browser.newPage({viewport:{width:meta.width,height:meta.height}});
 const snapshots=[];
 for(const p of [0,...meta.checkpoints,.999]){
  const svg=renderInteractionSvg(kind,p);await page.setContent('<style>body{margin:0}</style>'+svg);await page.evaluate(()=>document.fonts.ready);
  const off=await page.locator('svg text').evaluateAll((es,dim)=>es.map(e=>({text:e.textContent,b:e.getBBox()})).filter(({b})=>b.x<0||b.y<0||b.x+b.width>dim.width+2||b.y+b.height>dim.height+2).map(e=>e.text),meta);
  if(off.length)overflow.push({kind,p,texts:off});snapshots.push(svg);
 }
 assert.ok(new Set(snapshots).size>=5);checks.push({kind,frames:snapshots.length,distinctFrames:true});await page.close();
}await mkdir('C:/Users/yomas/github/Portfolio/.review/ui-interactions',{recursive:true});await writeFile('C:/Users/yomas/github/Portfolio/.review/ui-interactions/svg-results.json',JSON.stringify({checks,overflow},null,2));assert.deepEqual(overflow,[]);console.log('PASS eight UI sequences, distinct states and text bounds.');}finally{await browser.close();}
