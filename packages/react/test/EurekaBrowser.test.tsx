// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { EurekaBrowser, attributesFromProps, type EurekaBrowserElement } from '../src/index.js';

declare global { var IS_REACT_ACT_ENVIRONMENT: boolean | undefined; }

let root: Root | null = null;
let host: HTMLElement;
beforeAll(() => { globalThis.IS_REACT_ACT_ENVIRONMENT = true; });
afterEach(async () => { if (root) await act(async () => { root!.unmount(); }); root = null; host?.remove(); });

async function mount(ui: React.ReactElement) {
  host = document.createElement('div'); document.body.append(host);
  root = createRoot(host);
  await act(async () => { root!.render(ui); });
  return host.firstElementChild as EurekaBrowserElement;
}

describe('attributesFromProps', () => {
  it('maps camelCase props to the element attributes, booleans as presence', () => {
    expect(attributesFromProps({ api: '/x/', source: 1, path: 'a/b', mode: 'grid', basePath: '/root', treeOpen: true, noUploads: true, noCrop: false, learnMore: 'https://e.x' }))
      .toEqual({ api: '/x/', source: '1', path: 'a/b', mode: 'grid', 'base-path': '/root', 'tree-open': '', 'no-uploads': '', 'learn-more': 'https://e.x' });
  });
});

describe('<EurekaBrowser>', () => {
  it('renders the element with attributes, sets config as a property and exposes the element through ref', async () => {
    const ref = createRef<EurekaBrowserElement>();
    const config = { headers: { 'X-Test': '1' } };
    const el = await mount(<EurekaBrowser ref={ref} define={false} api="/api/" source={2} mode="list" noWelcome config={config} id="b1" className="demo" />);
    expect(el.tagName.toLowerCase()).toBe('eureka-browser');
    expect(el.getAttribute('api')).toBe('/api/');
    expect(el.getAttribute('source')).toBe('2');
    expect(el.getAttribute('mode')).toBe('list');
    expect(el.hasAttribute('no-welcome')).toBe(true);
    expect(el.hasAttribute('no-uploads')).toBe(false);
    expect(el.id).toBe('b1');
    expect(el.className).toBe('demo');
    expect((el as unknown as { config: unknown }).config).toBe(config);
    expect(ref.current).toBe(el);
  });

  it('renders server markup through dangerouslySetInnerHTML and children otherwise', async () => {
    const el = await mount(<EurekaBrowser define={false} markup="<form class='eureka'><p>level 0</p></form>" />);
    expect(el.querySelector('form.eureka p')?.textContent).toBe('level 0');
    await act(async () => { root!.unmount(); }); host.remove();
    const el2 = await mount(<EurekaBrowser define={false}><p>loading</p></EurekaBrowser>);
    expect(el2.textContent).toBe('loading');
  });

  it('maps the element events to handler props, reading the latest handler', async () => {
    const onChoose = vi.fn(); const onNavigate = vi.fn(); const onError = vi.fn(); const onClose = vi.fn(); const onStateChange = vi.fn();
    const el = await mount(<EurekaBrowser define={false} onChoose={onChoose} onNavigate={onNavigate} onError={onError} onClose={onClose} onStateChange={onStateChange} />);
    const items = [{ path: 'a.jpg', filename: 'a.jpg', directory: '/', absoluteURL: '/a.jpg' }];
    el.dispatchEvent(new CustomEvent('eureka-choose', { detail: { items }, bubbles: true }));
    el.dispatchEvent(new CustomEvent('eureka-navigate', { detail: { source: 0, path: 'img' }, bubbles: true }));
    el.dispatchEvent(new CustomEvent('eureka-error', { detail: { message: 'nope' }, bubbles: true }));
    el.dispatchEvent(new CustomEvent('eureka-close', { bubbles: true }));
    el.dispatchEvent(new CustomEvent('eureka-statechange', { detail: { state: { view: { mode: 'grid' } } }, bubbles: true }));
    expect(onChoose).toHaveBeenCalledWith(items, expect.any(CustomEvent));
    expect(onNavigate).toHaveBeenCalledWith({ source: 0, path: 'img' }, expect.any(CustomEvent));
    expect(onError).toHaveBeenCalledWith({ message: 'nope' }, expect.any(CustomEvent));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenCalledWith({ view: { mode: 'grid' } }, expect.any(CustomEvent));

    // a re-render with a new handler swaps what is called without re-binding
    const later = vi.fn();
    await act(async () => { root!.render(<EurekaBrowser define={false} onChoose={later} />); });
    el.dispatchEvent(new CustomEvent('eureka-choose', { detail: { items }, bubbles: true }));
    expect(later).toHaveBeenCalledTimes(1);
    expect(onChoose).toHaveBeenCalledTimes(1);
  });
});
