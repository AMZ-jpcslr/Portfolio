import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawnSync,execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const file=path.join(root,'site/recreation/media/mania.mp4');
const ffmpeg=process.env.FFMPEG_EXECUTABLE||(process.platform==='win32'?path.join(root,'video/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'):'ffmpeg');
const qa=path.join(root,'.review/mania-local');await mkdir(qa,{recursive:true});
const run=spawnSync(ffmpeg,['-i',file,'-c:v','rawvideo','-f','null','-'],{encoding:'utf8',maxBuffer:8*1024*1024});
await writeFile(path.join(qa,'decode.log'),run.stderr);
assert.equal(run.status,0);assert.equal(run.stderr.includes('Audio:'),false);
assert.match(run.stderr,/1240x900/);assert.match(run.stderr,/24 fps/);assert.match(run.stderr,/00:00:20\.00/);assert.match(run.stderr,/Video: h264/);assert.match(run.stderr,/frame=\s*480/);
const frames=[];
for(const t of [0.5,4,6,8.75,11.5,15.5,19]){
 const out=execFileSync(ffmpeg,['-v','error','-ss',String(t),'-i',file,'-frames:v','1','-c:v','png','-f','image2pipe','-'],{maxBuffer:12*1024*1024});
 const name=`decoded-${String(t).replace('.','-')}.png`;await writeFile(path.join(qa,name),out);
 frames.push({second:t,file:name,sha256:createHash('sha256').update(out).digest('hex')});
}
assert.equal(new Set(frames.map(x=>x.sha256)).size,frames.length);
const data=await readFile(file),report={file:'site/recreation/media/mania.mp4',size:data.length,sha256:createHash('sha256').update(data).digest('hex'),width:1240,height:900,fps:24,duration:20,frames:480,codec:'h264',audio:false,fullDecode:true,distinctDecodedFrames:frames,provenance:'Independent local recreation; synthetic station/timetable examples; fixed 14:00; no cloud source or artifact used.'};
await writeFile(path.join(qa,'verification.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
