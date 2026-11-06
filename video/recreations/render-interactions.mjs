import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {spawnSync,execFileSync} from 'node:child_process';
import {interactionScenes} from '../../site/music/interaction-scenes.js';
const root=fileURLToPath(new URL('../../',import.meta.url)),require=createRequire(new URL('../package.json',import.meta.url));
const {bundle}=require('@remotion/bundler'),{openBrowser,getCompositions,renderStill,renderMedia}=require('@remotion/renderer');
const browserExecutable=process.env.REMOTION_BROWSER_EXECUTABLE||'C:/Users/yomas/AppData/Local/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe';
const ffmpeg=path.join(root,'video/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'),ffprobe=ffmpeg.replace('ffmpeg.exe','ffprobe.exe');
if(!process.env.ONLY){
 for(const kind of Object.keys(interactionScenes)){
  const result=spawnSync(process.execPath,[fileURLToPath(import.meta.url)],{env:{...process.env,ONLY:kind},stdio:'inherit'});
  if(result.status!==0)process.exit(result.status||1);
 }
 process.exit(0);
}
const kind=process.env.ONLY,meta=interactionScenes[kind];if(!meta)throw Error('Unknown ONLY scene');
const output=path.join(root,'site/interaction-demos/media'),qa=path.join(root,'.review/ui-interactions');await mkdir(output,{recursive:true});await mkdir(qa,{recursive:true});
const browser=await openBrowser('chrome',{browserExecutable});
try{
 const serveUrl=await bundle({entryPoint:path.join(root,'video/recreations/ui-interactions.tsx'),publicDir:null,outDir:path.join(root,'.review/ui-interactions-bundle'),webpackOverride:c=>({...c,resolve:{...c.resolve,modules:[path.join(root,'video/node_modules'),'node_modules']}})});
 const composition=(await getCompositions(serveUrl,{puppeteerInstance:browser})).find(c=>c.id==='UI-'+kind);
 for(const [i,p] of meta.checkpoints.entries())await renderStill({serveUrl,composition,puppeteerInstance:browser,frame:Math.floor(p*(composition.durationInFrames-1)),output:path.join(qa,kind+'-'+i+'.png'),imageFormat:'png'});
 await renderStill({serveUrl,composition,puppeteerInstance:browser,frame:Math.floor(.91*(composition.durationInFrames-1)),output:path.join(output,kind+'.jpg'),imageFormat:'jpeg',jpegQuality:92});
 if(process.env.STILL==='1'){console.log('STILLS',kind);process.exitCode=0;}
 else{
  await renderMedia({serveUrl,composition,puppeteerInstance:browser,codec:'h264',pixelFormat:'yuv420p',crf:20,x264Preset:'fast',concurrency:4,outputLocation:path.join(output,kind+'.mp4'),logLevel:'warn'});
  execFileSync(ffmpeg,['-y','-itsscale',String(8/meta.duration),'-i',path.join(output,kind+'.mp4'),'-an','-r','24','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',path.join(output,kind+'-short.mp4')],{stdio:'pipe'});
  const probe=JSON.parse(execFileSync(ffprobe,['-v','error','-show_format','-of','json',path.join(output,kind+'-short.mp4')],{encoding:'utf8'}));
  const file=path.join(root,'site/interaction-demos/render-info.json');let info=[];try{info=JSON.parse(await readFile(file,'utf8'))}catch{}
  const item={kind,...meta,shortDuration:+probe.format.duration,bytes:(await stat(path.join(output,kind+'.mp4'))).size,type:'animation',audio:false};const at=info.findIndex(x=>x.kind===kind);if(at<0)info.push(item);else info[at]=item;await writeFile(file,JSON.stringify(info,null,2));console.log('RENDERED',kind,item.bytes);
 }
}finally{await browser.close({silent:true})}
