#!/usr/bin/env node
// eureka-server --root ./media [--name filesystem] [--port 3000] [--base-path /] [--static ./public] [--render] [--enhance]
// --render serves the Level 0 page (and its stylesheet) at --base-path; --enhance adds the <eureka-browser> element bundle.
import { createFilesystemSource } from './fs-source.js';
import { startServer } from './server.js';
import { createDefaultRenderer, cssAssets, elementAssets, i18nAssets } from './render.js';

const argv = process.argv.slice(2);
const args: Record<string, string | true> = {};
for (let i = 0; i < argv.length; i++) { const a = argv[i]!; if (a.startsWith('--')) { const v = argv[i + 1]; if (v && !v.startsWith('--')) { args[a.slice(2)] = v; i++; } else args[a.slice(2)] = true; } }
const roots = String(args.root ?? './media').split(',');
const names = String(args.name ?? roots.map((r) => r.split('/').filter(Boolean).pop() ?? 'media').join(',')).split(',');
const sources = roots.map((root, i) => createFilesystemSource({ id: i, name: names[i] ?? `source-${i}`, root }));
const { port } = await startServer({
  sources,
  port: Number(args.port ?? process.env.PORT ?? 3000),
  host: String(args.host ?? '127.0.0.1'),
  basePath: String(args['base-path'] ?? '/'),
  ...(typeof args.static === 'string' ? { staticDir: args.static } : {}),
  ...(args.render || args.enhance ? { renderPage: createDefaultRenderer({ enhance: !!args.enhance }), assetFiles: { ...cssAssets(), ...i18nAssets(), ...(args.enhance ? elementAssets() : {}) } } : {}),
  log: (l) => console.error(l)
});
console.log(`eureka reference server on http://127.0.0.1:${port}  sources: ${sources.map((s) => `${s.id}=${s.name}`).join(', ')}`);
