// SPDX-License-Identifier: AGPL-3.0-only
// 本機預覽用的靜態伺服器：node server.mjs [--port 8080] [--lan]
// 只送這個網頁需要的檔案，其他一律 404。預設只有這台電腦連得到；加 --lan 才讓同一個區域網路的裝置連進來。
// 網頁本身是純靜態的，放到任何靜態主機（例如 GitHub Pages）都能用，不一定要這支伺服器。
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const portArg = process.argv.find((a, i, all) => all[i - 1] === '--port');
const port = Number(portArg || process.env.PORT || 8080);
const lan = process.argv.includes('--lan');
const host = lan ? '0.0.0.0' : '127.0.0.1';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.glb': 'model/gltf-binary', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8',
};
const ALLOWED_DIRS = ['src', 'vendor', 'assets', 'icons'];
const ALLOWED_FILES = new Set(['/index.html', '/style.css', '/manifest.webmanifest', '/LICENSE']);
const NO_EXTENSION = new Set(['LICENSE']); // 授權全文沒有副檔名，當純文字送
const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"; // 與 _headers 相同

const server = http.createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return; }
  try {
    let url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (url === '/') url = '/index.html';
    // 擋掉往上層跳的路徑、Windows 的路徑分隔與磁碟代號
    if (url.includes('..') || url.includes('\\') || url.includes(':') || url.includes('\0')) throw new Error('bad path');
    if (!ALLOWED_FILES.has(url) && !ALLOWED_DIRS.includes(url.split('/')[1])) throw new Error('not allowed');
    const file = path.resolve(root, url.slice(1));
    if (!file.startsWith(root) || !(await stat(file)).isFile()) throw new Error('not a file');
    const data = await readFile(file);
    const type = TYPES[path.extname(file).toLowerCase()] || (NO_EXTENSION.has(path.basename(file)) ? TYPES['.txt'] : 'application/octet-stream');
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': data.length,
      'Cache-Control': url.startsWith('/vendor/') || url.startsWith('/assets/') ? 'public, max-age=3600' : 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': CSP,
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(404); res.end('Not found'); }
});

server.listen(port, host, () => {
  const actual = server.address().port;
  console.log('頭圖 3D');
  console.log('  這台電腦：http://127.0.0.1:' + actual + '/');
  if (!lan) return;
  for (const list of Object.values(os.networkInterfaces())) {
    for (const n of list || []) if (n.family === 'IPv4' && !n.internal) console.log('  同一個網路的裝置：http://' + n.address + ':' + actual + '/');
  }
});
