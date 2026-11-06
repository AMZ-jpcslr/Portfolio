import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const ffmpeg=process.env.FFMPEG_PATH||path.join(root,'video/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'),ffprobe=ffmpeg.replace('ffmpeg.exe','ffprobe.exe');
const {interactionDemos:recordings}=await import('../site/music/interaction-demos.js');const results=[];
for(const [id,clip] of Object.entries(recordings)){
 if(clip.type==='unavailable')continue;
 for(const [variant,src] of [['full',clip.src],['short',clip.shortSrc]]){
  const file=path.join(root,'site'+src);const bytes=await readFile(file);assert.deepEqual(bytes,await readFile(path.join(root,'dist'+src)));
  const meta=JSON.parse(execFileSync(ffprobe,['-v','error','-show_streams','-show_format','-of','json',file],{encoding:'utf8'}));assert.equal(meta.streams.length,1);assert.equal(meta.streams[0].codec_type,'video');assert.equal(meta.streams[0].codec_name,'h264');assert.ok(+meta.format.duration>1);
  execFileSync(ffmpeg,['-v','error','-xerror','-i',file,'-c:v','rawvideo','-f','null','-'],{stdio:'pipe'});
  results.push({id,variant,duration:+meta.format.duration,width:meta.streams[0].width,height:meta.streams[0].height,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),fullDecode:true,sourceBuildParity:true,noAudio:true});
 }
 assert.ok(clip.shortDuration<clip.duration);
}
await mkdir(path.join(root,'.review/ui-interactions'),{recursive:true});await writeFile(path.join(root,'.review/ui-interactions/media-results.json'),JSON.stringify(results,null,2));console.log('PASS: full decode, H.264, no audio and source/build parity for',results.length,'videos.');
