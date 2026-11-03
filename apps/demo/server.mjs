#!/usr/bin/env node
// The demo site. Static pages from ./public, the REST API and the
// server-rendered browser under /browser/ from @mrktps/eureka-server, sample
// media generated on first start. `node server.mjs [--port 3100]`.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createEurekaHandler, createFilesystemSource, createS3Source, createGoogleDriveSource, createWebDavSource, createServiceAccountToken, createRefreshTokenProvider, DRIVE_SCOPE, DRIVE_READONLY_SCOPE, cssAssets, elementAssets, escapeHtml, i18nAssets, loadCatalog } from '@mrktps/eureka-server';
import { renderLevel0 } from '@mrktps/eureka-html';
import { MEDIA_ROOT, seed } from './scripts/seed-media.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const arg = (name, fallback) => { const i = argv.indexOf(`--${name}`); return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback; };
const PORT = Number(arg('port', process.env.PORT ?? 3100));
const HOST = arg('host', '127.0.0.1');
const PUBLIC = path.join(here, 'public');
const BASE = '/browser';

if (seed(MEDIA_ROOT)) console.error(`seeded sample media in ${MEDIA_ROOT}`);
fs.mkdirSync(path.join(MEDIA_ROOT, 'uploads'), { recursive: true });

const nav = (active) => {
  const items = [['/', 'Home'], ['/browser/', 'Server-rendered'], ['/client.html', 'Client-only'], ['/react.html', 'React'], ['/embed.html', 'Embed']];
  return `<nav class="demo-nav" aria-label="Demo pages"><a class="demo-brand" href="/">Eureka 3</a><ul>${items.map(([href, label]) => `<li><a href="${href}"${href === active ? ' aria-current="page"' : ''}>${label}</a></li>`).join('')}</ul><a class="demo-nav-link" href="https://github.com/mrktps/eureka/tree/v3">Source</a></nav>`;
};

/** The server-rendered page: the Level 0 form inside the demo shell, wrapped in <eureka-browser> so the bundle enhances it. */
function renderPage(ctx) {
  const basePath = ctx.basePath.endsWith('/') ? ctx.basePath : ctx.basePath + '/';
  const catalog = loadCatalog(ctx.lang); // 09 I18N-12: the request locale, embedded for the element
  const form = renderLevel0({ sources: ctx.sources, source: { id: ctx.source.id, name: ctx.source.name }, path: ctx.path, entries: ctx.entries, tree: ctx.tree, lang: ctx.lang, basePath, locationRequested: ctx.locationRequested ?? false, ...(ctx.uploaded ? { uploaded: ctx.uploaded } : {}), ...(catalog ? { catalog } : {}), config: { assetsBasePath: '/assets/' } });
  return `<!doctype html>
<html lang="${escapeHtml(ctx.lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Server-rendered · Eureka 3 demo</title>
<meta name="color-scheme" content="light dark">
<link rel="stylesheet" href="/assets/css/eureka.css">
<link rel="stylesheet" href="/assets/demo.css">
</head>
<body class="demo-page demo-page--browser">
${nav('/browser/')}
<main class="demo-main">
<h1 class="visually-hidden">Eureka Media Browser</h1>
<div id="root" class="eureka-root">
<eureka-browser api="${escapeHtml(basePath)}" assets="/assets/" lang="${escapeHtml(ctx.lang)}">${form}</eureka-browser>
<output class="demo-choose-result" id="demo-chosen" aria-live="polite" hidden></output>
<script type="module">
  // The host's side of Choose: a callback (which also makes the Choose bar render, spec 01 CON-12) and the event.
  const el = document.querySelector('eureka-browser'), out = document.getElementById('demo-chosen');
  const show = (items) => { const list = [].concat(items); out.hidden = false; out.textContent = 'Chose ' + (list.length === 1 ? list[0].path : list.length + ' items: ' + list.map((i) => i.path).join(', ')); };
  el.config = { callbacks: { choose: show } };
</script>
</div>
</main>
<script type="module" src="/assets/js/eureka-browser.js"></script>
</body>
</html>
`;
}

const sources = [
  createFilesystemSource({ id: 0, name: 'library', root: MEDIA_ROOT }),
  createFilesystemSource({ id: 1, name: 'uploads', root: path.join(MEDIA_ROOT, 'uploads') })
];
// S3-compatible buckets as further sources (spec 11), one per env file: apps/demo/.env plus any apps/demo/.env.<name>
// (all gitignored; see .env.example). The shell environment counts as one more. For R2:
//   EUREKA_S3_BUCKET=media EUREKA_S3_ENDPOINT=https://ACCOUNT.r2.cloudflarestorage.com AWS_ACCESS_KEY_ID=… AWS_SECRET_ACCESS_KEY=… npm start
function parseEnv(text) {
  const out = {};
  for (const line of text.split(/\r?\n/)) { const m = /^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line); if (m && !line.trim().startsWith('#')) out[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2'); }
  return out;
}
const envSets = [process.env, ...fs.readdirSync(here).filter((f) => f === '.env' || (f.startsWith('.env.') && f !== '.env.example')).sort().map((f) => parseEnv(fs.readFileSync(path.join(here, f), 'utf8')))];
for (const e of envSets) {
  // Google Drive (spec 11 §4): EUREKA_GDRIVE_FOLDER (a folder id or `root`) or EUREKA_GDRIVE_DRIVE (a shared drive id), with a
  // service account (GOOGLE_APPLICATION_CREDENTIALS file, or GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY) or a refresh token.
  if ((e.EUREKA_GDRIVE_FOLDER || e.EUREKA_GDRIVE_DRIVE) && !sources.some((s) => s.name === (e.EUREKA_GDRIVE_NAME || 'drive'))) {
    const readOnly = /^(1|true|yes)$/i.test(e.EUREKA_GDRIVE_READ_ONLY ?? '');
    const scopes = [readOnly ? DRIVE_READONLY_SCOPE : DRIVE_SCOPE];
    let getToken;
    if (e.GOOGLE_APPLICATION_CREDENTIALS) { const sa = JSON.parse(fs.readFileSync(path.resolve(here, e.GOOGLE_APPLICATION_CREDENTIALS), 'utf8')); getToken = createServiceAccountToken({ clientEmail: sa.client_email, privateKey: sa.private_key, scopes, ...(e.GOOGLE_IMPERSONATE ? { subject: e.GOOGLE_IMPERSONATE } : {}) }); }
    else if (e.GOOGLE_SERVICE_ACCOUNT_EMAIL && e.GOOGLE_PRIVATE_KEY) getToken = createServiceAccountToken({ clientEmail: e.GOOGLE_SERVICE_ACCOUNT_EMAIL, privateKey: e.GOOGLE_PRIVATE_KEY, scopes, ...(e.GOOGLE_IMPERSONATE ? { subject: e.GOOGLE_IMPERSONATE } : {}) });
    else if (e.GOOGLE_CLIENT_ID && e.GOOGLE_CLIENT_SECRET && e.GOOGLE_REFRESH_TOKEN) getToken = createRefreshTokenProvider({ clientId: e.GOOGLE_CLIENT_ID, clientSecret: e.GOOGLE_CLIENT_SECRET, refreshToken: e.GOOGLE_REFRESH_TOKEN });
    if (getToken) sources.push(createGoogleDriveSource({ id: sources.length, name: e.EUREKA_GDRIVE_NAME || 'drive', getToken, ...(e.EUREKA_GDRIVE_FOLDER ? { rootFolderId: e.EUREKA_GDRIVE_FOLDER } : {}), ...(e.EUREKA_GDRIVE_DRIVE ? { driveId: e.EUREKA_GDRIVE_DRIVE } : {}), ...(readOnly ? { readOnly: true } : {}) }));
    else console.error(`[demo] ${e.EUREKA_GDRIVE_NAME || 'drive'}: a Drive folder is named but no Google credentials are set`);
  }
  // WebDAV (spec 11 §5): EUREKA_WEBDAV_URL with WEBDAV_USERNAME + WEBDAV_PASSWORD (an app password) or WEBDAV_TOKEN
  if (e.EUREKA_WEBDAV_URL && !sources.some((s) => s.name === (e.EUREKA_WEBDAV_NAME || 'webdav'))) {
    sources.push(createWebDavSource({
      id: sources.length, name: e.EUREKA_WEBDAV_NAME || 'webdav', url: e.EUREKA_WEBDAV_URL,
      ...(e.WEBDAV_USERNAME !== undefined ? { username: e.WEBDAV_USERNAME } : {}), ...(e.WEBDAV_PASSWORD !== undefined ? { password: e.WEBDAV_PASSWORD } : {}), ...(e.WEBDAV_TOKEN ? { token: e.WEBDAV_TOKEN } : {}),
      ...(/^(1|true|yes)$/i.test(e.EUREKA_WEBDAV_READ_ONLY ?? '') ? { readOnly: true } : {})
    }));
  }
  if (!e.EUREKA_S3_BUCKET || !e.AWS_ACCESS_KEY_ID || !e.AWS_SECRET_ACCESS_KEY) continue;
  if (sources.some((s) => s.name === (e.EUREKA_S3_NAME || 'bucket'))) continue; // the shell and a file describing the same source
  sources.push(createS3Source({
    id: sources.length, name: e.EUREKA_S3_NAME || 'bucket', bucket: e.EUREKA_S3_BUCKET,
    credentials: { accessKeyId: e.AWS_ACCESS_KEY_ID, secretAccessKey: e.AWS_SECRET_ACCESS_KEY, ...(e.AWS_SESSION_TOKEN ? { sessionToken: e.AWS_SESSION_TOKEN } : {}) },
    ...(e.EUREKA_S3_ENDPOINT ? { endpoint: e.EUREKA_S3_ENDPOINT } : {}), ...(e.EUREKA_S3_REGION ? { region: e.EUREKA_S3_REGION } : {}),
    ...(e.EUREKA_S3_PREFIX ? { prefix: e.EUREKA_S3_PREFIX } : {}), ...(e.EUREKA_S3_PUBLIC_URL ? { publicBaseUrl: e.EUREKA_S3_PUBLIC_URL } : {}),
    ...(/^(1|true|yes)$/i.test(e.EUREKA_S3_READ_ONLY ?? '') ? { readOnly: true } : {}) // a browse-only token (spec 11 MS-09); a 403 flips it anyway
  }));
}

const eureka = createEurekaHandler({
  sources,
  basePath: BASE,
  renderPage,
  staticDir: PUBLIC,
  assetFiles: { ...cssAssets(), ...elementAssets(), ...i18nAssets() },
  log: (line) => console.error(line)
});

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return fs.createReadStream(path.join(PUBLIC, 'index.html')).pipe(res);
  }
  if (url.pathname === BASE) { res.writeHead(302, { location: BASE + '/' + url.search }); return res.end(); }
  if (await eureka(req, res)) return;
  res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
  res.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Not found</title><link rel="stylesheet" href="/assets/demo.css"></head><body class="demo-page">${nav('')}<main class="demo-main demo-prose"><h1>Not found</h1><p><a href="/">Back to the demo home.</a></p></main></body></html>`);
});
server.listen(PORT, HOST, () => console.log(`eureka demo on http://${HOST}:${PORT}/  (api ${BASE}/media/, media in ${MEDIA_ROOT})`));
