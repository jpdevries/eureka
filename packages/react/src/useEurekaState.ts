import { useCallback, useRef, useSyncExternalStore } from 'react';
import type { State } from '@eureka/core';
import type { EurekaBrowserElement } from './define.js';
import type { RefObject } from 'react';

const identity = (s: State) => s as unknown;

/**
 * Read the browser's state from React (decision 5 of the plan: no Context, the
 * element's store is the external store). Re-renders once per browser render,
 * or only when `selector` returns something new.
 *
 * ```tsx
 * const ref = useRef<EurekaBrowserElement>(null);
 * const focused = useEurekaState(ref, (s) => s.selection.focused);
 * return <EurekaBrowser ref={ref} api="/" />;
 * ```
 *
 * Returns `undefined` until the element has started.
 */
export function useEurekaState(ref: RefObject<EurekaBrowserElement | null>): State | undefined;
export function useEurekaState<T>(ref: RefObject<EurekaBrowserElement | null>, selector: (state: State) => T): T | undefined;
export function useEurekaState<T>(ref: RefObject<EurekaBrowserElement | null>, selector: (state: State) => T = identity as (state: State) => T): T | undefined {
  const cache = useRef<{ state: State | undefined; selector: (state: State) => T; value: T | undefined }>({ state: undefined, selector, value: undefined });
  const subscribe = useCallback((notify: () => void) => {
    const el = ref.current;
    if (!el) return () => {};
    el.addEventListener('eureka-statechange', notify);
    return () => el.removeEventListener('eureka-statechange', notify);
  }, [ref]);
  const getSnapshot = () => {
    const state = ref.current?.state;
    const c = cache.current;
    if (state !== c.state || selector !== c.selector) {
      const value = state ? selector(state) : undefined;
      // keep the previous value when the selection is unchanged, so consumers do not re-render
      cache.current = { state, selector, value: Object.is(value, c.value) ? c.value : value };
    }
    return cache.current.value;
  };
  return useSyncExternalStore(subscribe, getSnapshot, () => undefined);
}
