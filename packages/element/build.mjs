#!/usr/bin/env node
// Bundles the browser entry points with esbuild: the element (auto-defining)
// the worker, and the filter query parser (side-loaded on focus, 10 PERF-29).
// All are single ES modules with source maps; the element finds the others
// next to itself via import.meta.url.
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
await build({
  entryPoints: { 'eureka-browser': path.join(here, 'src/define.ts'), 'eureka-worker': path.join(here, '../core/src/worker/entry.ts'), 'eureka-filter': path.join(here, 'src/filter-entry.ts') },
  bundle: true,
  format: 'esm',
  target: ['es2022'],
  platform: 'browser',
  outdir: path.join(here, 'dist'),
  sourcemap: true,
  minify: true,
  legalComments: 'none',
  logLevel: 'warning'
});
for (const f of ['eureka-browser.js', 'eureka-worker.js', 'eureka-filter.js']) {
  const buf = fs.readFileSync(path.join(here, 'dist', f));
  console.log(`wrote packages/element/dist/${f} (${buf.length} bytes, ${zlib.gzipSync(buf).length} gzip)`);
}
