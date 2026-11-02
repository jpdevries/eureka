#!/usr/bin/env node
// eureka-server --root ./media [--name filesystem] [--port 3000] [--base-path /] [--static ./public] [--render] [--enhance]
//               [--s3-bucket media --s3-region us-east-1 --s3-endpoint https://… --s3-prefix lib --s3-public-url https://cdn… --s3-name bucket]
// --render serves the Level 0 page (and its stylesheet) at --base-path; --enhance adds the <eureka-browser> element bundle.
// An S3-compatible source (spec 11) reads its credentials from AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (/ AWS_SESSION_TOKEN).
import { createFilesystemSource, type MediaSource } from './fs-source.js';
import { createS3Source } from './s3-source.js';
import { startServer } from './server.js';
import { createDefaultRenderer, cssAssets, elementAssets, i18nAssets } from './render.js';

const argv = process.argv.slice(2);
const args: Record<string, string | true> = {};
for (let i = 0; i < argv.length; i++) { const a = argv[i]!; if (a.startsWith('--')) { const v = argv[i + 1]; if (v && !v.startsWith('--')) { args[a.slice(2)] = v; i++; } else args[a.slice(2)] = true; } }
const roots = args.root === undefined && args['s3-bucket'] ? [] : String(args.root ?? './media').split(',');
const names = String(args.name ?? roots.map((r) => r.split('/').filter(Boolean).pop() ?? 'media').join(',')).split(',');
const sources: MediaSource[] = roots.map((root, i) => createFilesystemSource({ id: i, name: names[i] ?? `source-${i}`, root }));
if (typeof args['s3-bucket'] === 'string') {
  const { AWS_ACCESS_KEY_ID: accessKeyId, AWS_SECRET_ACCESS_KEY: secretAccessKey, AWS_SESSION_TOKEN: sessionToken } = process.env;
  if (!accessKeyId || !secretAccessKey) { console.error('--s3-bucket needs AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in the environment'); process.exit(2); }
  sources.push(createS3Source({
    id: sources.length, name: String(args['s3-name'] ?? args['s3-bucket']), bucket: args['s3-bucket'],
    credentials: { accessKeyId, secretAccessKey, ...(sessionToken ? { sessionToken } : {}) },
    ...(typeof args['s3-region'] === 'string' ? { region: args['s3-region'] } : process.env.AWS_REGION ? { region: process.env.AWS_REGION } : {}),
    ...(typeof args['s3-endpoint'] === 'string' ? { endpoint: args['s3-endpoint'] } : process.env.AWS_ENDPOINT_URL_S3 ? { endpoint: process.env.AWS_ENDPOINT_URL_S3 } : {}),
    ...(typeof args['s3-prefix'] === 'string' ? { prefix: args['s3-prefix'] } : {}),
    ...(typeof args['s3-public-url'] === 'string' ? { publicBaseUrl: args['s3-public-url'] } : {}),
    ...(args['s3-path-style'] ? { forcePathStyle: true } : {}),
    ...(args['s3-no-probe'] ? { probe: false } : {})
  }));
}
if (!sources.length) { console.error('nothing to serve: pass --root and/or --s3-bucket'); process.exit(2); }
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
