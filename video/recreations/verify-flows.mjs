import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawnSync,execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {featureFlows} from '../../site/music/feature-flows.js';
const root=fileURLToPath(new URL('../../',import.meta.url));
const ffmpeg=process.env.FFMPEG_EXECUTABLE||(process.platform==='win32'?path.join(root,'video/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'):'ffmpeg');
const qa=path.join(root,'.review/flow-media');await mkdir(qa,{recursive:true});
const info=JSON.parse(await readFile(path.join(root,'site/recreation/media/render-info.json'),'utf8')),checks=[];
for(const [kind,story] of Object.entries(featureFlows)){
 const entry=info.find(i=>i.kind===kind);assert.ok(entry);assert.equal(entry.duration,20);assert.equal(story.steps.length,4);assert.equal(story.captions.length,4);
 const file=path.join(root,'site/recreation/media',entry.file),data=await readFile(file);
 assert.equal(data.length,entry.size);assert.ok(data.length<8*1024*1024);
 const run=spawnSync(ffmpeg,['-i',file,'-c:v','rawvideo','-f','null','-'],{encoding:'utf8',maxBuffer:8*1024*1024});
 await writeFile(path.join(qa,kind+'-decode.log'),run.stderr);assert.equal(run.status,0,kind);assert.equal(run.stderr.includes('Audio:'),false);
 for(const pattern of [/1240x900/,/24 fps/,/00:00:20\.00/,/Video: h264/,/frame=\s*480/])assert.match(run.stderr,pattern,kind);
 const frames=[];
 for(const [stage,time] of [[0,1.5],[1,6.5],[2,11.5],[3,17.5]]){
  const png=execFileSync(ffmpeg,['-v','error','-ss',String(time),'-i',file,'-frames:v','1','-c:v','png','-f','image2pipe','-'],{maxBuffer:12*1024*1024});
  await writeFile(path.join(qa,kind+'-'+stage+'.png'),png);frames.push({stage,time,sha256:createHash('sha256').update(png).digest('hex')});
 }
 assert.equal(new Set(frames.map(f=>f.sha256)).size,4,kind+' must show four different stages');
 checks.push({kind,file:entry.file,source:story.source,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex'),duration:20,fps:24,width:1240,height:900,frames:480,audio:false,fullDecode:true,stageFrames:frames});console.log('PASS full decode + four stages: '+kind);
}
await writeFile(path.join(qa,'results.json'),JSON.stringify({checks},null,2));
