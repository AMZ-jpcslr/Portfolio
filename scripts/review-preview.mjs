// Local review only: compare the saved baseline with the current prototype.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const workspace=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const review=path.join(workspace,'.review');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const port=Number(process.env.PORT||4175);
createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  const pathname=decodeURIComponent(url.pathname);
  if(pathname==='/before'||pathname==='/after'){res.writeHead(302,{Location:pathname+'/'}).end();return;}
  const prefix=pathname.startsWith('/before/')?'/before/':pathname.startsWith('/after/')?'/after/':null;
  const base=prefix==='/before/'?path.join(review,'before'):prefix==='/after/'?path.join(workspace,'dist'):review;
  const relative=prefix?pathname.slice(prefix.length):pathname.slice(1);
  const file=path.resolve(base,relative||'index.html');
  if(!file.startsWith(base+path.sep)){res.writeHead(403).end();return;}
  const data=await readFile(file);
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(data);
 }catch{res.writeHead(404).end('Review file not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Review: http://127.0.0.1:${port}/`));
