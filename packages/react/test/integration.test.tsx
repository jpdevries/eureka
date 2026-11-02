// @vitest-environment happy-dom
// The real element inside React: inline engine, fetch answered from fixtures.
import { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { EurekaBrowser, type EurekaBrowserElement } from '../src/index.js';

declare global { var IS_REACT_ACT_ENVIRONMENT: boolean | undefined; }

const entries = [
  { directory: 'img', path: 'img/sub', foldername: 'sub', absoluteURL: '/s/img/sub', editedOn: 1700000000000, fileSize: 0 },
  { directory: 'img', path: 'img/a.jpg', filename: 'a.jpg', absoluteURL: '/s/img/a.jpg', absolutePreviewURL: '/s/img/a.jpg', editedOn: 1700000000000, fileSize: 1234, dimensions: [10, 20] },
  { directory: 'img', path: 'img/b.png', filename: 'b.png', absoluteURL: '/s/img/b.png', absolutePreviewURL: '/s/img/b.png', editedOn: 1700000100000, fileSize: 5678, dimensions: [30, 40] }
];
const respond = (body: unknown) => new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
  const url = new URL(String(input instanceof Request ? input.url : input), 'http://localhost');
  if (url.pathname === '/api/media/sources/') return respond([{ id: 0, name: 'filesystem' }]);
  if (url.pathname === '/api/media/sources/0' && !url.searchParams.has('path')) return respond([{ cd: 'img', name: 'img', children: [{ cd: 'img/sub', name: 'sub', children: [] }] }]);
  if (url.pathname === '/api/media/sources/0') return respond(entries);
  return new Response('not found', { status: 404 });
});

let root: Root | null = null; let host: HTMLElement;
beforeAll(() => { globalThis.IS_REACT_ACT_ENVIRONMENT = true; vi.stubGlobal('fetch', fetchMock); });
afterEach(async () => { if (root) await act(async () => { root!.unmount(); }); root = null; host?.remove(); });

const until = async (pred: () => boolean, ms = 3000) => { const t0 = Date.now(); while (!pred()) { if (Date.now() - t0 > ms) throw new Error('timed out'); await act(async () => { await new Promise((r) => setTimeout(r, 10)); }); } };

describe('EurekaBrowser with the real element', () => {
  it('defines the element, loads the listing through the inline engine and reports navigation', async () => {
    const ref = createRef<EurekaBrowserElement>();
    const onNavigate = vi.fn(); const onError = vi.fn();
    host = document.createElement('div'); document.body.append(host);
    root = createRoot(host);
    await act(async () => { root!.render(<EurekaBrowser ref={ref} api="/api/" path="img" worker="inline" noStorage noWelcome onNavigate={onNavigate} onError={onError} />); });
    await until(() => !!customElements.get('eureka-browser'));
    await until(() => (ref.current?.state?.listing.entries.length ?? 0) === 3);
    expect(onError).not.toHaveBeenCalled();
    expect(ref.current!.engineMode).toBe('inline');
    expect(onNavigate).toHaveBeenCalledWith({ source: 0, path: 'img' }, expect.any(CustomEvent));
    await until(() => host.querySelectorAll('tr[data-path]').length === 2); // files are rows; the folder is offered by the directory selector
    expect(host.querySelector('.eureka')).not.toBeNull();
    expect(host.querySelector('select[data-control="browsing"] option[value$="img/sub"]')).not.toBeNull();
    expect(fetchMock.mock.calls.some(([u]) => String(u).includes('/api/media/sources/0?path=img'))).toBe(true);
  });
});
