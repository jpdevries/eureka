// localStorage persistence (07 §5). Validated on read, never throws.
import { VIEW_MODES, type SourceId } from './types.js';
import type { State } from './store.js';

export interface StorageLike { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void }

export interface Persisted {
  view?: Partial<State['view']>;
  location?: { source: SourceId; path: string };
  treeOpen?: string[];
  welcomed?: boolean;
}

const KEYS = { view: 'view', location: 'location', treeOpen: 'tree.open', welcomed: 'welcomed' } as const;
const SORT_BY = new Set(['filename', 'dimensions', 'fileSize', 'editedOn']);

function readJSON(storage: StorageLike, key: string): unknown {
  try { const raw = storage.getItem(key); return raw === null ? undefined : JSON.parse(raw); } catch { return undefined; }
}

/** Read and validate persisted state; anything malformed is dropped (STATE-31). */
export function loadPersisted(storage: StorageLike | null | undefined, prefix: string): Persisted {
  if (!storage) return {};
  const out: Persisted = {};
  const v = readJSON(storage, prefix + KEYS.view);
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>; const view: Partial<State['view']> = {};
    if (typeof o.mode === 'string' && (VIEW_MODES as string[]).includes(o.mode)) view.mode = o.mode as State['view']['mode'];
    if (o.sort && typeof o.sort === 'object') { const so = o.sort as Record<string, unknown>; if (typeof so.by === 'string' && SORT_BY.has(so.by) && (so.dir === 'ascending' || so.dir === 'descending')) view.sort = { by: so.by as never, dir: so.dir }; }
    if (typeof o.panelOpen === 'boolean') view.panelOpen = o.panelOpen;
    if (o.chooseMode === 'single' || o.chooseMode === 'multiple') view.chooseMode = o.chooseMode;
    if (typeof o.animate === 'boolean') view.animate = o.animate;
    if (Object.keys(view).length) out.view = view;
  }
  const loc = readJSON(storage, prefix + KEYS.location);
  if (loc && typeof loc === 'object') { const o = loc as Record<string, unknown>; if ((typeof o.source === 'string' || typeof o.source === 'number') && typeof o.path === 'string') out.location = { source: o.source, path: o.path }; }
  const open = readJSON(storage, prefix + KEYS.treeOpen);
  if (Array.isArray(open) && open.every((x) => typeof x === 'string')) out.treeOpen = open as string[];
  const w = readJSON(storage, prefix + KEYS.welcomed);
  if (typeof w === 'boolean') out.welcomed = w;
  return out;
}

/** Write the persisted subset of state. Call from a store subscriber; cheap enough to run on every change. */
export function persist(storage: StorageLike | null | undefined, prefix: string, state: State): void {
  if (!storage || !state.config.useLocalStorage) return;
  const { mode, sort, panelOpen, chooseMode, animate } = state.view;
  try {
    storage.setItem(prefix + KEYS.view, JSON.stringify({ mode, sort, panelOpen, chooseMode, animate }));
    if (state.listing.source !== null) storage.setItem(prefix + KEYS.location, JSON.stringify({ source: state.listing.source, path: state.listing.path }));
    storage.setItem(prefix + KEYS.treeOpen, JSON.stringify(state.tree.open));
  } catch { /* quota or privacy mode: persistence is best effort */ }
}

export function markWelcomed(storage: StorageLike | null | undefined, prefix: string): void {
  try { storage?.setItem(prefix + KEYS.welcomed, 'true'); } catch { /* ignore */ }
}

/** Keys v2 wrote under the same prefix that v3 no longer uses; hosts may clear them on upgrade. */
export const legacyKeys = (prefix: string): string[] => ['currentDirectory', 'directory', 'currentSource', 'source', 'content', 'tree', 'view', 'mode', 'sort', 'treeHidden', 'welcome'].map((k) => prefix + k);
