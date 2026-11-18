#!/usr/bin/env node
// Tiny static server for local testing, with gzip like GitHub Pages.
// Usage: node scripts/serve.mjs [port]   (serves site/ at /patients-route/ and /)
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');
const port = +process.argv[2] || 8770;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };

createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/patients-route/, '');
  if (p.endsWith('/')) p += 'index.html';
  const file = normalize(join(root, p));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  let body, status = 200;
  try { body = await readFile(file); } catch { status = 404; body = await readFile(join(root, '404.html')); }
  const type = status === 404 ? types['.html'] : (types[extname(file)] || 'application/octet-stream');
  const headers = { 'Content-Type': type, 'Cache-Control': 'max-age=600' };
  if (/text|json|svg/.test(type) && /gzip/.test(req.headers['accept-encoding'] || '')) {
    body = gzipSync(body); headers['Content-Encoding'] = 'gzip';
  }
  res.writeHead(status, headers); res.end(body);
}).listen(port, () => console.log(`http://localhost:${port}/patients-route/`));
