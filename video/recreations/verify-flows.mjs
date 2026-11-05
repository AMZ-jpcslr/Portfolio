import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawnSync,execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {pvStories} from '../../site/music/product-pv.js';
const root=fileURLToPath(new URL('../../',import.meta.url));
const ffmpeg=process.env.FFMPEG_EXECUTABLE||(process.platform==='win32'?path.join(root,'video/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'):'ffmpeg');
const qa=path.join(root,'.review/flow-media');await mkdir(qa,{recursive:true});
const info=JSON.parse(await readFile(path.join(root,'site/recreation/media/render-info.json'),'utf8')),checks=[];
for(const [kind,story] of Object.entries(pvStories)){
 const entry=info.find(i=>i.kind===kind);assert.ok(entry);assert.equal(entry.duration,30);assert.equal(story.detailCaptions.length,7);
 const file=path.join(root,'site/recreation/media',entry.file),data=await readFile(file);
 assert.equal(data.length,entry.size);assert.ok(data.length<8*1024*1024);
 const run=spawnSync(ffmpeg,['-i',file,'-c:v','rawvideo','-f','null','-'],{encoding:'utf8',maxBuffer:8*1024*1024});
 await writeFile(path.join(qa,kind+'-decode.log'),run.stderr);assert.equal(run.status,0,kind);assert.equal(run.stderr.includes('Audio:'),false);
 for(const pattern of [/1240x900/,/24 fps/,/00:00:30\.00/,/Video: h264/,/frame=\s*720/])assert.match(run.stderr,pattern,kind);
 const frames=[];
 for(const [stage,time] of [[0,1.5],[1,5.5],[2,10],[3,14],[4,18.5],[5,23.5],[6,28]]){
  const png=execFileSync(ffmpeg,['-v','error','-ss',String(time),'-i',file,'-frames:v','1','-c:v','png','-f','image2pipe','-'],{maxBuffer:12*1024*1024});
  await writeFile(path.join(qa,kind+'-'+stage+'.png'),png);frames.push({stage,time,sha256:createHash('sha256').update(png).digest('hex')});
 }
 assert.equal(new Set(frames.map(f=>f.sha256)).size,7,kind+' must show seven different scenes');
 checks.push({kind,file:entry.file,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex'),duration:30,fps:24,width:1240,height:900,frames:720,audio:false,fullDecode:true,stageFrames:frames});console.log('PASS full decode + seven scenes: '+kind);
}
await writeFile(path.join(qa,'results.json'),JSON.stringify({checks},null,2));
