#!/usr/bin/env node
// Eureka fixture server: implements the Eureka REST API over in-memory fixture
// data and serves placeholder media, so any implementation (v2 baseline, v3
// element, a React wrapper) can be driven by the conformance suite without a
// real filesystem source.
//
//   node fixture-server.mjs --port 3101 --static ../../client/build --index ./index.html
//
// --static  directory served at /            (the page under test)
// --index   file served for GET /            (overrides <static>/index.html)
// --api     API prefix, default /assets/components/eureka/media
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => a.startsWith('--') ? [a.slice(2), arr[i + 1] ?? true] : []).filter(Boolean));
const PORT = Number(args.port ?? process.env.PORT ?? 3101);
const STATIC = args.static ? path.resolve(args.static) : null;
const INDEX = args.index ? path.resolve(args.index) : null;
const API = args.api ?? '/assets/components/eureka/media';

// ---- fixture data -----------------------------------------------------------
const sources = [
  { name: 'filesystem', id: 0 },
  { name: 'cloud', id: 1 }
];

// directory -> entries. `directory` is the containing dir; folders carry foldername, files filename.
const DAY = 86400000;
const t0 = Date.UTC(2017, 3, 2, 14, 25); // 2017-04-02
function file(dir, filename, fileSize, dimensions, daysAgo) {
  const p = dir === '/' ? filename : path.posix.join(dir, filename);
  return {
    filename, directory: dir, path: p,
    absoluteURL: `/sources/filesystem/${p}`,
    absolutePreviewURL: `/sources/filesystem/${p}`,
    editedOn: t0 - daysAgo * DAY, dimensions, fileSize
  };
}
function folder(dir, name) {
  const p = dir === '/' ? name : path.posix.join(dir, name);
  return { foldername: name, directory: p, path: p, absoluteURL: `/sources/filesystem/${p}`, absolutePreviewURL: `/sources/filesystem/${p}`, editedOn: t0, fileSize: 4096 };
}
const listings = {
  '/': [folder('/', 'assets'), folder('/', 'uploads'), file('/', 'readme.txt', 1204, undefined, 40)],
  'assets': [folder('assets', 'img'), folder('assets', 'docs'), file('assets', 'logo.svg', 3321, [120, 120], 12)],
  'assets/img': [
    folder('assets/img', 'redwoods'),
    file('assets/img', 'schildpad.jpg', 37888, [336, 125], 1),
    file('assets/img', 'hawaii-sunset.jpg', 1240000, [1920, 1080], 3),
    file('assets/img', 'tall-tree.png', 420000, [600, 1400], 5),
    file('assets/img', 'icon-16.png', 812, [16, 16], 8),
    file('assets/img', 'Wide Banner (final).jpg', 98000, [2400, 400], 9),
    file('assets/img', 'animation.gif', 220000, [320, 240], 14),
    file('assets/img', 'clip.mp4', 8400000, undefined, 20),
    file('assets/img', 'theme.mp3', 3100000, undefined, 21),
    file('assets/img', 'brochure.pdf', 540000, undefined, 30),
    file('assets/img', 'notes.txt', 90, undefined, 60),
    file('assets/img', 'archive.zip', 12000000, undefined, 90)
  ],
  'assets/img/redwoods': Array.from({ length: 24 }, (_, i) => file('assets/img/redwoods', `redwood-${String(i + 1).padStart(2, '0')}.jpg`, 200000 + i * 7919, [800 + (i % 3) * 200, 600 + (i % 4) * 150], i)),
  'assets/docs': [file('assets/docs', 'spec.pdf', 150000, undefined, 2), file('assets/docs', 'budget.xlsx', 44000, undefined, 4)],
  'uploads': []
};
function tree(dir = '/') {
  return (listings[dir] ?? []).filter(e => e.foldername).map(e => ({ name: e.foldername, cd: e.path, children: tree(e.path) }));
}
function norm(p) { p = (p ?? '/').replace(/\/+$/, ''); return p === '' ? '/' : p.replace(/^\//, '') || '/'; }

// ---- placeholder media --------------------------------------------------------
function placeholder(item) {
  const [w, h] = item.dimensions ?? [320, 240];
  const hue = [...item.filename].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="hsl(${hue} 50% 70%)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Math.max(12, Math.min(w, h) / 8)}" fill="#223">${item.filename} ${w}x${h}</text></svg>`;
}
function findItem(p) { for (const dir of Object.keys(listings)) { const hit = listings[dir].find(e => e.path === p); if (hit) return hit; } }

// ---- server -----------------------------------------------------------------
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png', '.ico': 'image/x-icon', '.map': 'application/json' };
function json(res, body, status = 200) { res.writeHead(status, { 'content-type': 'application/json', 'access-control-allow-origin': '*' }); res.end(JSON.stringify(body)); }
function readBody(req) { return new Promise(r => { const c = []; req.on('data', d => c.push(d)); req.on('end', () => r(Buffer.concat(c))); }); }

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const p = url.pathname;
  if (p.startsWith(API + '/')) {
    const rest = p.slice(API.length + 1).replace(/\/$/, '');
    const [kind, id] = rest.split('/');
    if (kind === 'sources' && id === undefined) return json(res, sources);
    if (kind === 'sources') {
      const dir = url.searchParams.get('path') ?? url.searchParams.get('dir');
      if (req.method === 'GET') return json(res, dir ? (listings[norm(dir)] ?? []) : tree('/'));
      if (req.method === 'PUT') { // create or rename
        const name = url.searchParams.get('name'); const d = norm(dir);
        if (name) { const parent = path.posix.dirname(d) === '.' ? '/' : path.posix.dirname(d); const e = (listings[parent] ?? []).find(x => x.path === d); if (e) { e.filename && (e.filename = name); e.foldername && (e.foldername = name); e.path = path.posix.join(parent, name); } return json(res, listings[parent] ?? []); }
        const parent = path.posix.dirname(d) === '.' ? '/' : path.posix.dirname(d); (listings[parent] ??= []).push(folder(parent, path.posix.basename(d))); listings[d] = []; return json(res, true);
      }
      if (req.method === 'POST') { await readBody(req); const d = norm(dir); (listings[d] ??= []).push(file(d, `upload-${Date.now()}.png`, 1234, [100, 100], 0)); return json(res, listings[d]); }
      if (req.method === 'DELETE') { if (dir) { const d = norm(dir); const parent = path.posix.dirname(d) === '.' ? '/' : path.posix.dirname(d); listings[parent] = (listings[parent] ?? []).filter(e => e.path !== d); delete listings[d]; return json(res, true); } await readBody(req); return json(res, []); }
    }
    if (kind === 'attachments') { await readBody(req); res.writeHead(200, { 'content-type': 'application/zip', 'content-disposition': 'attachment; filename="eureka.zip"' }); return res.end(Buffer.alloc(22)); }
    return json(res, { error: 'not found' }, 404);
  }
  if (p.startsWith('/sources/filesystem/')) {
    const item = findItem(decodeURIComponent(p.slice('/sources/filesystem/'.length)));
    if (!item) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': 'image/svg+xml' }); return res.end(placeholder(item));
  }
  if (p === '/__fixtures/listings') return json(res, listings);
  if (p === '/__snapshot' && req.method === 'POST') { // dev aid: page POSTs its DOM, saved under spec/fixtures/snapshots/<name>.html
    const name = (url.searchParams.get('name') ?? 'snapshot').replace(/[^a-z0-9_-]/gi, '_');
    const body = (await readBody(req)).toString('utf8').replace(/></g, '>\n<');
    const out = path.join(here, '..', 'fixtures', 'snapshots', `${name}.html`);
    fs.writeFileSync(out, body); return json(res, { saved: out, bytes: body.length });
  }
  if (STATIC) {
    let f = p === '/' ? (INDEX ?? path.join(STATIC, 'index.html')) : path.join(STATIC, decodeURIComponent(p));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(STATIC, 'index.html');
    res.writeHead(200, { 'content-type': MIME[path.extname(f)] ?? 'application/octet-stream' }); return fs.createReadStream(f).pipe(res);
  }
  res.writeHead(404); res.end();
}).listen(PORT, () => console.log(`eureka fixture server http://localhost:${PORT}/  api=${API} static=${STATIC ?? '(none)'}`));
