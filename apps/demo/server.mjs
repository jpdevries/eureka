#!/usr/bin/env node
// The demo site. Static pages from ./public, the REST API and the
// server-rendered browser under /browser/ from @eureka/server-node, sample
// media generated on first start. `node server.mjs [--port 3100]`.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createEurekaHandler, createFilesystemSource, cssAssets, elementAssets, escapeHtml, i18nAssets, loadCatalog } from '@eureka/server-node';
import { renderLevel0 } from '@eureka/html';
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
  return `<nav class="demo-nav" aria-label="Demo pages"><a class="demo-brand" href="/">Eureka 3</a><ul>${items.map(([href, label]) => `<li><a href="${href}"${href === active ? ' aria-current="page"' : ''}>${label}</a></li>`).join('')}</ul><a class="demo-nav-link" href="https://github.com/jpdevries/eureka/tree/v3">Source</a></nav>`;
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
</div>
</main>
<script type="module" src="/assets/js/eureka-browser.js"></script>
</body>
</html>
`;
}

const eureka = createEurekaHandler({
  sources: [
    createFilesystemSource({ id: 0, name: 'library', root: MEDIA_ROOT }),
    createFilesystemSource({ id: 1, name: 'uploads', root: path.join(MEDIA_ROOT, 'uploads') })
  ],
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
