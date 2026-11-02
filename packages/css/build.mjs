#!/usr/bin/env node
// Assembles dist/eureka.css: the token defaults block generated from
// spec/data/theme-tokens.json, then the hand-written source files in order.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const tokens = JSON.parse(fs.readFileSync(path.join(here, '../../spec/data/theme-tokens.json'), 'utf8'));
const lines = [];
lines.push('/* GENERATED from spec/data/theme-tokens.json: token defaults (08 THEME-01/02). Hosts override on .eureka-root or any ancestor. */');
lines.push('@layer eureka.theme {');
lines.push('  :where(.eureka-root) {');
for (const [name, def] of Object.entries(tokens.tokens)) lines.push(`    ${name}: ${def.default};`);
lines.push('  }');
for (const [key, theme] of Object.entries(tokens.themes)) {
  lines.push(`  ${theme.selector}, ${theme.selector} .eureka-root {`);
  for (const [k, v] of Object.entries(theme)) if (k.startsWith('--')) lines.push(`    ${k}: ${v};`);
  lines.push('  }');
}
lines.push('  @media (forced-colors: active) {');
lines.push('    .eureka-root {');
for (const [k, v] of Object.entries(tokens['forced-colors'])) if (k.startsWith('--')) lines.push(`      ${k}: ${v};`);
lines.push('    }');
lines.push('  }');
lines.push('}');
const generated = lines.join('\n') + '\n';
const order = ['layers.css', 'base.css', 'frame.css', 'listing.css', 'modes.css', 'components.css', 'themes.css'];
const src = order.map((f) => `/* ---- ${f} ---- */\n` + fs.readFileSync(path.join(here, 'src', f), 'utf8')).join('\n');
fs.mkdirSync(path.join(here, 'dist'), { recursive: true });
fs.writeFileSync(path.join(here, 'dist/eureka.css'), src.replace('/* @tokens */', generated));
console.log(`wrote packages/css/dist/eureka.css (${fs.statSync(path.join(here, 'dist/eureka.css')).size} bytes)`);
