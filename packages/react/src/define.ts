// Registers <eureka-browser> on demand. The element module extends HTMLElement
// at import time, so it is loaded dynamically and only where a DOM exists:
// server rendering never touches it.
import type { EurekaBrowser as EurekaBrowserElement } from '@mrktps/eureka';

export type { EurekaBrowserElement };

const pending = new Map<string, Promise<void>>();

/** True when a DOM with custom elements is available (false during server rendering). */
export const hasDOM = (): boolean => typeof window !== 'undefined' && typeof customElements !== 'undefined';

/**
 * Make sure `tag` is defined, importing `@mrktps/eureka` the first time.
 * Resolves at once when the host already loaded the element bundle.
 */
export function defineEurekaBrowser(tag = 'eureka-browser'): Promise<void> {
  if (!hasDOM() || customElements.get(tag)) return Promise.resolve();
  let p = pending.get(tag);
  if (!p) {
    p = import('@mrktps/eureka').then((m) => { if (!customElements.get(tag)) m.define(tag); });
    pending.set(tag, p);
  }
  return p;
}
