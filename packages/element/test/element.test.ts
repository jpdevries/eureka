// @vitest-environment happy-dom
// The real element under happy-dom: inline engine, fetch answered from fixtures.
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { define, type EurekaBrowser } from '../src/index.js';

const entries = [
  { directory: '/', path: 'a.svg', filename: 'a.svg', absoluteURL: '/s/a.svg', editedOn: 1700000000000, fileSize: 1234, dimensions: [10, 20] },
  { directory: '/', path: 'notes.txt', filename: 'notes.txt', absoluteURL: '/s/notes.txt', editedOn: 1700000100000, fileSize: 56 }
];
const respond = (body: unknown) => new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
beforeAll(() => {
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input instanceof Request ? input.url : input), 'http://localhost');
    if (url.pathname === '/api/media/sources/') return respond([{ id: 0, name: 'fs' }]);
    if (url.pathname === '/api/media/sources/0' && !url.searchParams.has('path')) return respond([]);
    if (url.pathname === '/api/media/sources/0') return respond(entries);
    return new Response('not found', { status: 404 });
  }));
  define();
});
afterEach(() => { document.body.innerHTML = ''; });

const until = async (pred: () => boolean, ms = 3000) => { const t0 = Date.now(); while (!pred()) { if (Date.now() - t0 > ms) throw new Error('timed out'); await new Promise((r) => setTimeout(r, 10)); } };

function mount(wrapper: (el: Element) => Element = (el) => el): EurekaBrowser {
  const el = document.createElement('eureka-browser') as EurekaBrowser;
  el.setAttribute('api', '/api/'); el.setAttribute('worker', 'inline'); el.setAttribute('no-storage', ''); el.setAttribute('no-welcome', '');
  document.body.append(wrapper(el));
  return el;
}

describe('<eureka-browser>', () => {
  it('loads the listing and chooses the focused row on Enter', async () => {
    const el = mount();
    await until(() => el.querySelectorAll('tr[data-path]').length === 2);
    const chosen: string[][] = [];
    el.addEventListener('eureka-choose', (e) => chosen.push((e as CustomEvent).detail.items.map((i: { path: string }) => i.path)));
    const row = el.querySelector<HTMLElement>('tr[data-path="a.svg"]')!;
    row.focus();
    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    expect(chosen).toEqual([['a.svg']]);
  });

  it('keeps its keyboard shortcuts when a host puts the whole browser inside a <dialog>', async () => {
    const el = mount((e) => { const d = document.createElement('dialog'); d.append(e); return d; });
    await until(() => el.querySelectorAll('tr[data-path]').length === 2);
    const chosen: string[] = [];
    el.addEventListener('eureka-choose', (e) => chosen.push(...(e as CustomEvent).detail.items.map((i: { path: string }) => i.path)));
    const row = el.querySelector<HTMLElement>('tr[data-path="notes.txt"]')!;
    row.focus();
    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    expect(chosen).toEqual(['notes.txt']);
    // the element's own dialogs still own their keys
    const rename = new KeyboardEvent('keydown', { key: 'F2', bubbles: true, cancelable: true });
    row.dispatchEvent(rename);
    await until(() => !!el.querySelector('dialog.eureka__modal'));
    const input = el.querySelector<HTMLInputElement>('dialog.eureka__modal input')!;
    const before = chosen.length;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    expect(chosen.length).toBe(before);
  });
});
