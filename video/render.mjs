import {bundle} from '@remotion/bundler';
import {getCompositions, openBrowser, renderMedia, renderStill} from '@remotion/renderer';
import {mkdir, stat, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here,'..');
const output = path.join(root,'dist/assets/films');
await mkdir(output,{recursive:true});
const browserExecutable = process.env.REMOTION_BROWSER || null;
const browser = await openBrowser('chrome',{browserExecutable});
try {
  const serveUrl = await bundle({entryPoint:path.join(here,'src/index.tsx'), publicDir:path.join(root,'dist'), outDir:path.join(root,'.review/remotion-bundle')});
  const compositions = await getCompositions(serveUrl,{puppeteerInstance:browser});
  const only = process.env.FILM;
  for (const composition of compositions.filter(c => !only || c.id === `Film-${only}`)) {
    const kind = composition.id.slice(5);
    await renderStill({serveUrl, composition, puppeteerInstance:browser, output:path.join(output,`${kind}.jpg`), frame:360, imageFormat:'jpeg', jpegQuality:95});
    if (process.env.STILLS_ONLY === '1') continue;
    let last = -1;
    await renderMedia({serveUrl,composition,puppeteerInstance:browser,outputLocation:path.join(output,`${kind}.mp4`),codec:'h264',pixelFormat:'yuv420p',crf:18,x264Preset:'fast',concurrency:3,logLevel:'warn',onProgress:({progress})=>{const mark=Math.floor(progress*4);if(mark!==last){last=mark;console.log(`${kind}: ${Math.round(progress*100)}%`);}}});
    console.log(`DONE ${kind}: ${(await stat(path.join(output,`${kind}.mp4`))).size} bytes`);
  }
  await writeFile(path.join(output,'render-info.json'),JSON.stringify({engine:'Remotion',version:'4.0.535',width:1240,height:900,fps:30,duration:24,style:'editorial',kinds:compositions.map(c=>c.id.slice(5))},null,2));
} finally { await browser.close({silent:true}); }
