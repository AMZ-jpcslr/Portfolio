// Rebuild short versions and posters from the approved full recordings.
import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=process.env.PORTFOLIO_ROOT||path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const ffmpeg=process.env.FFMPEG_PATH||path.join(root,'video/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
const ffprobe=process.env.FFPROBE_PATH||ffmpeg.replace('ffmpeg.exe','ffprobe.exe');
const manifest=JSON.parse(await readFile(path.join(root,'site/recordings/manifest.json'),'utf8'));
const {recordings}=await import(new URL('../site/music/recordings.js',import.meta.url));
const probe=p=>JSON.parse(execFileSync(ffprobe,['-v','error','-show_streams','-show_format','-of','json',p],{encoding:'utf8'}));
for(const record of manifest.records){
 const full=path.join(root,'site'+record.src),short=path.join(root,'site'+record.shortSrc),poster=path.join(root,'site'+record.poster);
 const info=probe(full),v=info.streams.find(x=>x.codec_type==='video');
 if(info.streams.some(x=>x.codec_type==='audio'))throw Error(record.id+' unexpectedly has audio');
 const duration=+info.format.duration,target=Math.min(8,duration*.55);
 execFileSync(ffmpeg,['-y','-itsscale',String(target/duration),'-i',full,'-an','-r','25','-c:v','libx264','-preset','fast','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart',short],{stdio:'pipe'});
 execFileSync(ffmpeg,['-y','-ss','1','-i',full,'-frames:v','1','-q:v','2',poster],{stdio:'pipe'});
 const clip=recordings[record.id];Object.assign(clip,{duration,shortDuration:+probe(short).format.duration,size:`${v.width} × ${v.height}`});
 Object.assign(record,clip,{sha256:createHash('sha256').update(await readFile(full)).digest('hex'),shortSha256:createHash('sha256').update(await readFile(short)).digest('hex')});
}
manifest.updatedAt=new Date().toISOString();
await writeFile(path.join(root,'site/recordings/manifest.json'),JSON.stringify(manifest,null,2)+'\n');
await writeFile(path.join(root,'site/music/recordings.js'),'// Actual recordings and source-specific limits. See scripts/prepare-recordings.mjs.\nexport const recordings='+JSON.stringify(recordings,null,2)+';\n');
console.log('Prepared',manifest.records.length,'full/short recording pairs and posters.');
