import {createRequire} from 'node:module';
import {mkdir,readFile,stat,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const require=createRequire(new URL('../package.json',import.meta.url));
const {bundle}=require('@remotion/bundler');
const {openBrowser,getCompositions,renderStill,renderMedia}=require('@remotion/renderer');
const executable=process.env.REMOTION_BROWSER_EXECUTABLE;
if(!executable)throw new Error('Set REMOTION_BROWSER_EXECUTABLE to an existing local Chromium executable.');
const output=path.join(root,'site/recreation/media');
const qa=path.join(root,'.review/mania-local');
await mkdir(qa,{recursive:true});
const browser=await openBrowser('chrome',{browserExecutable:executable});
try {
 const serveUrl=await bundle({entryPoint:path.join(root,'video/recreations/mania.tsx'),outDir:path.join(root,'.review/mania-local-bundle'),webpackOverride:c=>({...c,resolve:{...c.resolve,modules:[path.join(root,'video/node_modules'),'node_modules']}})});
 const [composition]=await getCompositions(serveUrl,{puppeteerInstance:browser});
 for(const [name,frame] of [['initial',12],['search',96],['station',144],['walk-input',210],['recommendation',276],['next-selected',372],['returned',456]]){
  await renderStill({serveUrl,composition,puppeteerInstance:browser,output:path.join(qa,name+'.png'),frame,imageFormat:'png'});
 }
 if(process.env.STILL==='1'){console.log('Rendered QA stills only');}
 else {
  await renderStill({serveUrl,composition,puppeteerInstance:browser,output:path.join(output,'mania.jpg'),frame:276,imageFormat:'jpeg',jpegQuality:94});
  await renderMedia({serveUrl,composition,puppeteerInstance:browser,outputLocation:path.join(output,'mania.mp4'),codec:'h264',pixelFormat:'yuv420p',crf:18,x264Preset:'fast',concurrency:3,logLevel:'warn'});
  const infoPath=path.join(output,'render-info.json'),info=JSON.parse(await readFile(infoPath,'utf8'));
  const entry={kind:'mania',file:'mania.mp4',size:(await stat(path.join(output,'mania.mp4'))).size,width:1240,height:900,fps:24,duration:20,type:'recreation',audio:false};
  const i=info.findIndex(x=>x.kind==='mania');if(i<0)info.push(entry);else info[i]=entry;
  await writeFile(infoPath,JSON.stringify(info,null,2)+'\n');
  console.log(JSON.stringify(entry));
 }
}finally {await browser.close({silent:true});}
