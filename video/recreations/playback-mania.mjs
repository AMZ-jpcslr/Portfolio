import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../../',import.meta.url));
const require=createRequire(new URL('../package.json',import.meta.url));
const {openBrowser}=require('@remotion/renderer');
const executable=process.env.REMOTION_BROWSER_EXECUTABLE;
if(!executable)throw Error('Set REMOTION_BROWSER_EXECUTABLE to an installed browser with H.264 support (e.g. Edge).');
const media=await readFile(path.join(root,'site/recreation/media/mania.mp4'));
const browser=await openBrowser('chrome',{browserExecutable:executable});
try{
 const page=await browser.newPage({context:()=>null,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:null,onLog:()=>{}});
 const result=await page.evaluate(async (src)=>{
  const v=document.createElement('video');v.muted=true;v.playsInline=true;v.controls=false;v.src=src;document.body.append(v);
  await new Promise((ok,bad)=>{v.onloadedmetadata=ok;v.onerror=()=>bad(new Error('Video metadata error'));setTimeout(()=>bad(new Error('Metadata timeout')),15000)});
  const dimensions={width:v.videoWidth,height:v.videoHeight,duration:v.duration};
  await v.play();await new Promise((ok,bad)=>{v.onended=ok;v.onerror=()=>bad(new Error('Playback error'));setTimeout(()=>bad(new Error('Playback timeout')),30000)});
  return {...dimensions,ended:v.ended,currentTime:v.currentTime,quality:v.getVideoPlaybackQuality().totalVideoFrames,error:v.error?.message??null};
 },'data:video/mp4;base64,'+media.toString('base64'));
 assert.equal(result.width,1240);assert.equal(result.height,900);assert.equal(result.duration,20);assert.equal(result.ended,true);assert.equal(result.error,null);
 await writeFile(path.join(root,'.review/mania-local/playback.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await browser.close({silent:true})}
