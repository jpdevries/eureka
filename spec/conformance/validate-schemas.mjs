#!/usr/bin/env node
// Validates the spec's data files, fixtures and the fixture server's live
// output against spec/schema/*.json. Run: npm run validate:schemas
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const spec = path.join(here, '..');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
for (const f of fs.readdirSync(path.join(spec, 'schema'))) if (f.endsWith('.json')) ajv.addSchema(read(path.join(spec, 'schema', f)));
const base = 'https://eureka.markup.tips/spec/3/schema/';
let failures = 0;
function check(label, schemaRef, data) {
  const validate = ajv.getSchema(base + schemaRef);
  if (!validate) throw new Error(`schema not found: ${schemaRef}`);
  const ok = validate(data);
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}`);
  if (!ok) { failures++; console.log(JSON.stringify(validate.errors, null, 2)); }
}
const arrayOf = ref => ({ $id: base + `_arr_${ref}`, type: 'array', items: { $ref: base + ref } });
for (const ref of ['entry.json', 'tree-node.json', 'source.json']) ajv.addSchema(arrayOf(ref));

// compile-only checks
for (const s of ['state.json', 'worker-messages.json', 'config.json']) { ajv.getSchema(base + s); console.log(`ok   ${s} compiles`); }

check('data/keymap.json', 'keymap.schema.json', read(path.join(spec, 'data', 'keymap.json')));
check('fixtures/fakepi/content.json (entries, v2 fixture)', '_arr_entry.json', read(path.join(spec, 'fixtures', 'fakepi', 'content.json')).map(e => ({ absoluteURL: e.path, ...e })));
check('fixtures/fakepi/tree-source-0.json', '_arr_tree-node.json', read(path.join(spec, 'fixtures', 'fakepi', 'tree-source-0.json')));

// live fixture server
const port = 3177;
const srv = spawn('node', [path.join(here, 'fixture-server.mjs'), '--port', String(port)]);
await new Promise(r => setTimeout(r, 700));
try {
  const api = `http://localhost:${port}/assets/components/eureka/media`;
  const get = async u => (await fetch(u)).json();
  check('fixture server: sources', '_arr_source.json', await get(`${api}/sources/`));
  check('fixture server: tree', '_arr_tree-node.json', await get(`${api}/sources/0`));
  for (const dir of ['/', 'assets', 'assets/img', 'assets/img/redwoods', 'large']) check(`fixture server: listing ${dir}`, '_arr_entry.json', await get(`${api}/sources/0?path=${encodeURIComponent(dir)}`));
} finally { srv.kill(); }

// example hydration state and events
check('example state', 'state.json', { view: { mode: 'grid', sort: { by: 'fileSize', dir: 'descending' }, filter: '', panelOpen: true, chooseMode: 'single', fullscreen: false }, selection: { focused: 'assets/img/schildpad.jpg', checked: [], inverted: false }, notifications: [] });
const ev = ajv.compile({ $ref: base + 'state.json#/$defs/events' });
for (const e of [{ type: 'directory/navigate', path: 'assets' }, { type: 'view/setSort', dir: 'descending' }, { type: 'selection/toggle', path: 'a.jpg', checked: true }, { type: 'notification/push', message: 'hi', kind: 'info' }]) {
  const ok = ev(e); console.log(`${ok ? 'ok  ' : 'FAIL'} event ${e.type}`); if (!ok) { failures++; console.log(ev.errors); }
}
const bad = ev({ type: 'view/setMode', mode: 'carousel' }); console.log(`${!bad ? 'ok  ' : 'FAIL'} event rejects unknown mode`); if (bad) failures++;
const wm = ajv.compile({ $ref: base + 'worker-messages.json' });
for (const m of [{ id: '1', type: 'listDirectory', locale: 'en', headers: {}, source: 0, path: 'assets' }, { id: '1', ok: true, result: [] }, { id: '2', ok: false, error: { message: 'boom', status: 500 } }]) {
  const ok = wm(m); console.log(`${ok ? 'ok  ' : 'FAIL'} worker message ${m.type ?? (m.ok ? 'response ok' : 'response error')}`); if (!ok) { failures++; console.log(wm.errors); }
}
console.log(failures ? `\n${failures} schema check(s) failed` : '\nall schema checks passed');
process.exit(failures ? 1 : 0);
