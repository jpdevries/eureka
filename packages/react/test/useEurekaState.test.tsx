// @vitest-environment happy-dom
import { act, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { EurekaBrowser, useEurekaState, type EurekaBrowserElement } from '../src/index.js';

declare global { var IS_REACT_ACT_ENVIRONMENT: boolean | undefined; }

// A stand-in for the element: a `state` getter and the statechange event are all the hook needs.
class StubBrowser extends HTMLElement {
  #state: unknown = undefined;
  get state() { return this.#state; }
  set(state: unknown) { this.#state = state; this.dispatchEvent(new CustomEvent('eureka-statechange', { detail: { state }, bubbles: true })); }
}
customElements.define('eureka-stub', StubBrowser);

let root: Root | null = null; let host: HTMLElement;
beforeAll(() => { globalThis.IS_REACT_ACT_ENVIRONMENT = true; });
afterEach(async () => { if (root) await act(async () => { root!.unmount(); }); root = null; host?.remove(); });

let renders = 0;
function Mode() {
  const ref = useRef<EurekaBrowserElement>(null);
  const mode = useEurekaState(ref, (s) => s.view.mode);
  const whole = useEurekaState(ref);
  renders++;
  return <div><EurekaBrowser ref={ref} tag="eureka-stub" define={false} /><output data-mode>{mode ?? 'none'}</output><output data-count>{whole ? Object.keys(whole).length : 0}</output></div>;
}

describe('useEurekaState', () => {
  it('is undefined before the element starts, then follows the element state through the selector', async () => {
    host = document.createElement('div'); document.body.append(host);
    root = createRoot(host);
    await act(async () => { root!.render(<Mode />); });
    const stub = host.querySelector('eureka-stub') as StubBrowser;
    const mode = host.querySelector('[data-mode]')!;
    expect(mode.textContent).toBe('none');

    await act(async () => { stub.set({ view: { mode: 'grid' }, listing: {} }); });
    expect(mode.textContent).toBe('grid');
    expect(host.querySelector('[data-count]')!.textContent).toBe('2');

    const before = renders;
    await act(async () => { stub.set({ view: { mode: 'grid' }, listing: {}, selection: {} }); });
    expect(mode.textContent).toBe('grid'); // same selection; the whole-state reader still re-rendered
    expect(renders).toBeGreaterThan(before);

    await act(async () => { stub.set({ view: { mode: 'list' }, listing: {}, selection: {} }); });
    expect(mode.textContent).toBe('list');
  });
});
