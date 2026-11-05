import{createRequire}from'node:module';
import{mkdir,readFile,stat,writeFile}from'node:fs/promises';
import path from'node:path';
import{fileURLToPath}from'node:url';
import{spawnSync}from'node:child_process';
import{pvStories}from'../../site/music/product-pv.js';
const root=fileURLToPath(new URL('../../',import.meta.url)),require=createRequire(new URL('../package.json',import.meta.url));
const{bundle}=require('@remotion/bundler'),{openBrowser,getCompositions,renderStill,renderMedia}=require('@remotion/renderer');
const executable=process.env.REMOTION_BROWSER_EXECUTABLE;if(!executable)throw Error('Set REMOTION_BROWSER_EXECUTABLE to an existing Chromium executable.');
const format=process.env.FORMAT==='short'?'short':'long';
// A fresh renderer per film avoids reusing a closed localhost page between films on Windows.
if(!process.env.ONLY){
 for(const kind of Object.keys(pvStories)){
  const child=spawnSync(process.execPath,[fileURLToPath(import.meta.url)],{stdio:'inherit',env:{...process.env,ONLY:kind}});
  if(child.error)throw child.error;
  if(child.status!==0)process.exit(child.status||1);
 }
 process.exit(0);
}
if(!pvStories[process.env.ONLY])throw Error('ONLY must name one of the eight project kinds.');
const output=path.join(root,format==='long'?'site/recreation/media':'.review/pv-short-media');await mkdir(output,{recursive:true});
let info=[];try{info=JSON.parse(await readFile(path.join(output,'render-info.json'),'utf8'))}catch{}
const browser=await openBrowser('chrome',{browserExecutable:executable});
try{
 const serveUrl=await bundle({entryPoint:path.join(root,'video/recreations/product-pv.tsx'),publicDir:path.join(root,'dist'),outDir:path.join(root,'.review/pv-build-'+format),webpackOverride:c=>({...c,resolve:{...c.resolve,modules:[path.join(root,'video/node_modules'),'node_modules']}})});
 for(const composition of await getCompositions(serveUrl,{puppeteerInstance:browser})){
  if(!composition.id.startsWith(format==='long'?'PV-Long-':'PV-Short-'))continue;
  const kind=composition.id.replace(/^PV-(Long|Short)-/,'');if(process.env.ONLY&&kind!==process.env.ONLY)continue;
  const file=kind==='soccer'?'soccer-v2.mp4':kind+'.mp4',qa=path.join(root,'.review/pv-storyboards',format);await mkdir(qa,{recursive:true});
  const times=format==='long'?[1,5,10,14,18.5,23.5,28]:[1.5,5.5,9.5];
  for(const [stage,time] of times.entries())await renderStill({serveUrl,composition,puppeteerInstance:browser,output:path.join(qa,kind+'-'+stage+'.png'),frame:Math.round(time*24),imageFormat:'png'});
  if(process.env.STILL==='1'){console.log('Rendered '+format+' PV storyboards: '+kind);continue}
  await renderStill({serveUrl,composition,puppeteerInstance:browser,output:path.join(output,kind+'.jpg'),frame:format==='long'?672:252,imageFormat:'jpeg',jpegQuality:92});
  await renderMedia({serveUrl,composition,puppeteerInstance:browser,outputLocation:path.join(output,file),codec:'h264',pixelFormat:'yuv420p',crf:21,x264Preset:'fast',concurrency:4,logLevel:'warn'});
  const entry={kind,file,size:(await stat(path.join(output,file))).size,width:composition.width,height:composition.height,fps:composition.fps,duration:composition.durationInFrames/composition.fps,type:'recreation',presentation:'product-pv',audio:false};
  const i=info.findIndex(x=>x.kind===kind);if(i<0)info.push(entry);else info[i]=entry;await writeFile(path.join(output,'render-info.json'),JSON.stringify(info,null,2)+'\n');console.log('Rendered '+format+' PV: '+kind);
 }
 if(process.env.STILL!=='1')await writeFile(path.join(output,'render-info.json'),JSON.stringify(info,null,2)+'\n');
}finally{await browser.close({silent:true})}
