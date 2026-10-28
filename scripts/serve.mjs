import { createServer } from 'node:http';
import { stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const port = Number(process.env.PORT || 4173);
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const relative = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    let filename = path.resolve(root, '.' + relative);
    if (!filename.startsWith(root + path.sep) && filename !== path.join(root, 'index.html')) {
      res.writeHead(403).end(); return;
    }
    let info = await stat(filename);
    if(info.isDirectory()){filename=path.join(filename,'index.html');info=await stat(filename)}
    if (!info.isFile()) { res.writeHead(404).end(); return; }
    const headers = {'Content-Type':types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control':'no-store', 'Accept-Ranges':'bytes'};
    let start = 0, end = info.size - 1, status = 200;
    if (req.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!match || (!match[1] && !match[2])) { res.writeHead(416, {'Content-Range':`bytes */${info.size}`}).end(); return; }
      start = match[1] ? Number(match[1]) : Math.max(0, info.size - Number(match[2]));
      end = match[1] && match[2] ? Math.min(Number(match[2]), info.size - 1) : info.size - 1;
      if (start > end || start >= info.size) { res.writeHead(416, {'Content-Range':`bytes */${info.size}`}).end(); return; }
      headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`;
      status = 206;
    }
    headers['Content-Length'] = Math.max(0, end - start + 1);
    res.writeHead(status, headers);
    if (req.method === 'HEAD' || !info.size) { res.end(); return; }
    createReadStream(filename,{start,end}).on('error',()=>res.destroy()).pipe(res);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
