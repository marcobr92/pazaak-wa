// Servidor estático mínimo para testar a build local. Node puro, sem dependência.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.argv[3] || process.cwd();
const port = Number(process.argv[2] || 8787);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.wasm': 'application/wasm',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

createServer(async (req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  const rel = normalize(url === '/' ? '/index.html' : url).replace(/^([/\\])+/, '');
  const file = join(root, rel);
  if (!file.startsWith(root)) {
    res.writeHead(403).end('fora do diretório');
    return;
  }
  try {
    const data = await readFile(file);
    res.writeHead(200, {
      'Content-Type': MIME[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  } catch {
    res.writeHead(404).end('não encontrado');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`pazaak-wa em http://127.0.0.1:${port}`);
});
