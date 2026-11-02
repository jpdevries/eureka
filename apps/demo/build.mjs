#!/usr/bin/env node
// Bundles the React demo page's script. The workspace packages are aliased to
// their sources so the demo always reflects the checkout (no tsc step needed).
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const pkg = (name) => path.join(here, '../../packages', name, 'src/index.ts');
await build({
  entryPoints: { 'react-demo': path.join(here, 'src/react-demo.tsx') },
  bundle: true,
  format: 'esm',
  target: ['es2022'],
  platform: 'browser',
  jsx: 'automatic',
  outdir: path.join(here, 'public/assets/js'),
  sourcemap: true,
  minify: true,
  legalComments: 'none',
  logLevel: 'warning',
  define: { 'process.env.NODE_ENV': '"production"' },
  alias: { '@eureka/react': pkg('react'), '@eureka/element': pkg('element'), '@eureka/core': pkg('core'), '@eureka/html': pkg('html') }
});
const out = path.join(here, 'public/assets/js/react-demo.js');
const buf = fs.readFileSync(out);
console.log(`wrote apps/demo/public/assets/js/react-demo.js (${buf.length} bytes, ${zlib.gzipSync(buf).length} gzip)`);
