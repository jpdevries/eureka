// The instance store (07). Pure transitions, no framework, no effects.
import { ancestors, normalizePath, parentPath } from './paths.js';
import { visibleFiles } from './sort-filter.js';
import { isFile, type ChooseMode, type Config, type DialogKind, type DisplayRecord, type Entry, type FileEntry, type Notification, type Sort, type SortBy, type SortDir, type Source, type SourceId, type Status, type TreeNode, type ViewMode } from './types.js';

export interface State {
  config: Config;
  sources: { all: Source[]; current: SourceId | null; status: Status };
  tree: { bySource: Record<string, TreeNode[]>; open: string[]; status: Status };
  listing: { source: SourceId | null; path: string; entries: Entry[]; records: Record<string, DisplayRecord>; status: Status; error?: string; receivedAt?: number; requestId: number };
  selection: { focused: string | null; checked: string[]; inverted: boolean };
  view: { mode: ViewMode; sort: Sort; filter: string; panelOpen: boolean; chooseMode: ChooseMode; fullscreen: boolean; animate: boolean };
  pending: { uploading: boolean; deleting: string[]; renaming: string | null; creating: boolean; cropping: boolean };
  dialog: null | { kind: DialogKind; target?: string; input?: string };
  notifications: Notification[];
  locale: { tag: string; catalogStatus: Status };
}

export type Event =
  | { type: 'sources/loaded'; sources: Source[] }
  | { type: 'sources/failed'; error: string }
  | { type: 'source/select'; id: SourceId }
  | { type: 'tree/loading' }
  | { type: 'tree/loaded'; source: SourceId; nodes: TreeNode[] }
  | { type: 'tree/branchLoaded'; source: SourceId; cd: string; nodes: TreeNode[] }
  | { type: 'tree/toggle'; path: string; open: boolean }
  | { type: 'directory/navigate'; source?: SourceId; path: string }
  | { type: 'listing/loaded'; source: SourceId; path: string; entries: Entry[]; records?: Record<string, DisplayRecord>; fromCache?: boolean }
  | { type: 'listing/records'; records: Record<string, DisplayRecord> }
  | { type: 'listing/failed'; error: string }
  | { type: 'view/setMode'; mode: ViewMode }
  | { type: 'view/setSort'; by?: SortBy; dir?: SortDir }
  | { type: 'view/setFilter'; text: string }
  | { type: 'view/togglePanel'; open?: boolean }
  | { type: 'view/setChooseMode'; mode: ChooseMode }
  | { type: 'view/setFullscreen'; on: boolean }
  | { type: 'view/setAnimate'; on: boolean }
  | { type: 'selection/focus'; path: string | null }
  | { type: 'selection/toggle'; path: string; checked: boolean }
  | { type: 'selection/invert'; on?: boolean }
  | { type: 'selection/clear' }
  | { type: 'items/uploading'; files: string[] }
  | { type: 'items/uploaded'; entries: Entry[] }
  | { type: 'items/uploadFailed'; error: string }
  | { type: 'items/deleting'; paths: string[] }
  | { type: 'items/deleted'; paths: string[]; entries?: Entry[] }
  | { type: 'items/deleteFailed'; paths: string[]; entries: Entry[]; error: string }
  | { type: 'items/renaming'; path: string }
  | { type: 'items/renamed'; from: string; to: string; entries: Entry[] }
  | { type: 'items/renameFailed'; error: string }
  | { type: 'directory/created'; path: string }
  | { type: 'dialog/open'; kind: DialogKind; target?: string }
  | { type: "dialog/close" }
  | { type: 'dialog/input'; value: string }
  | { type: 'notification/push'; message: string; kind?: 'info' | 'danger'; sticky?: boolean; learnMore?: string; id?: string }
  | { type: 'notification/dismiss'; id: string }
  | { type: 'locale/changed'; tag: string }
  | { type: 'locale/catalogLoading' }
  | { type: 'locale/catalogLoaded' }
  | { type: 'locale/catalogMissing' };

export type EventType = Event['type'];

/** What persistence (07 §5) and hydration (07 §6) may supply at init. */
export interface InitialStateOptions {
  config: Config;
  locale?: string;
  persisted?: Partial<{ view: Partial<State['view']>; location: { source: SourceId; path: string }; treeOpen: string[] }>;
  hydrated?: Partial<Pick<State, 'sources' | 'tree' | 'listing'>> & { view?: Partial<State['view']> };
}

export function initialState({ config, locale = config.lang ?? 'en', persisted, hydrated }: InitialStateOptions): State {
  // explicit host options beat persisted values (01 CON-11); we treat an option as explicit when it differs from the default
  const view: State['view'] = {
    mode: config.mode, sort: { ...config.sort }, filter: '', panelOpen: !config.treeHidden, chooseMode: 'single', fullscreen: false, animate: false,
    ...(persisted?.view ?? {}), ...(hydrated?.view ?? {})
  };
  if (config.allowMasonry === false && view.mode === 'masonry') view.mode = 'table';
  const source = hydrated?.listing?.source ?? persisted?.location?.source ?? config.mediaSource ?? null;
  const path = normalizePath(hydrated?.listing?.path ?? persisted?.location?.path ?? config.currentDirectory);
  return {
    config,
    sources: hydrated?.sources ?? { all: [], current: source, status: 'idle' },
    tree: hydrated?.tree ?? { bySource: {}, open: openWith(persisted?.treeOpen ?? [], path), status: 'idle' },
    listing: { source, path, entries: [], records: {}, status: 'idle', requestId: 0, ...(hydrated?.listing ?? {}) },
    selection: { focused: null, checked: [], inverted: false },
    view,
    pending: { uploading: false, deleting: [], renaming: null, creating: false, cropping: false },
    dialog: null,
    notifications: [],
    locale: { tag: locale, catalogStatus: locale.toLowerCase().startsWith('en') ? 'ready' : 'idle' }
  };
}

let notificationSeq = 0;
const clearedSelection = (): State['selection'] => ({ focused: null, checked: [], inverted: false });
/** The tree disclosures that must be open to show `path` (its ancestors and itself), merged into `open`. */
const openWith = (open: string[], path: string): string[] => [...new Set([...open, ...ancestors(path)])];

export function reduce(s: State, e: Event): State {
  switch (e.type) {
    case 'sources/loaded': {
      const current = s.sources.current !== null && e.sources.some((x) => String(x.id) === String(s.sources.current)) ? s.sources.current : (e.sources[0]?.id ?? null);
      return { ...s, sources: { all: e.sources, current, status: 'ready' }, listing: s.listing.source === null ? { ...s.listing, source: current } : s.listing };
    }
    case 'sources/failed': return { ...s, sources: { ...s.sources, status: 'error' } };
    case 'source/select':
      if (String(e.id) === String(s.sources.current)) return s;
      return { ...s, sources: { ...s.sources, current: e.id }, listing: { ...s.listing, source: e.id, path: '/', entries: [], records: {}, status: 'loading', requestId: s.listing.requestId + 1 }, selection: clearedSelection(), view: { ...s.view, filter: '' }, dialog: null };
    case 'tree/loading': return { ...s, tree: { ...s.tree, status: 'loading' } };
    case 'tree/loaded': return { ...s, tree: { ...s.tree, bySource: { ...s.tree.bySource, [String(e.source)]: e.nodes }, status: 'ready' } };
    case 'tree/branchLoaded': { // the children of one node, fetched when it was opened (11 MS-43)
      const src = String(e.source), cd = normalizePath(e.cd);
      const nodes = s.tree.bySource[src];
      if (!nodes) return s;
      return { ...s, tree: { ...s.tree, bySource: { ...s.tree.bySource, [src]: cd === '/' ? e.nodes : graftBranch(nodes, cd, e.nodes) } } };
    }
    case 'tree/toggle': {
      const p = normalizePath(e.path); const open = s.tree.open.filter((x) => x !== p);
      return { ...s, tree: { ...s.tree, open: e.open ? [...open, p] : open } };
    }
    case 'directory/navigate': {
      const source = e.source ?? s.listing.source;
      return { ...s, sources: e.source !== undefined ? { ...s.sources, current: e.source } : s.sources,
        listing: { ...s.listing, source, path: normalizePath(e.path), status: 'loading', error: undefined, requestId: s.listing.requestId + 1 },
        tree: { ...s.tree, open: openWith(s.tree.open, e.path) },
        selection: clearedSelection(), view: { ...s.view, filter: '' }, dialog: null };
    }
    case 'listing/loaded': {
      if (String(e.source) !== String(s.listing.source) || normalizePath(e.path) !== s.listing.path) return s; // stale (STATE-20)
      if (e.fromCache && s.listing.status === 'ready') return s;
      return { ...s, listing: { ...s.listing, entries: e.entries, records: e.records ?? {}, status: e.fromCache ? 'loading' : 'ready', error: undefined, receivedAt: Date.now() } };
    }
    case 'listing/records': return { ...s, listing: { ...s.listing, records: { ...s.listing.records, ...e.records } } };
    case 'listing/failed': return { ...s, listing: { ...s.listing, status: 'error', error: e.error } };
    case 'view/setMode': return s.view.mode === e.mode ? s : { ...s, view: { ...s.view, mode: e.mode } };
    case 'view/setSort': return { ...s, view: { ...s.view, sort: { by: e.by ?? s.view.sort.by, dir: e.dir ?? s.view.sort.dir } } };
    case 'view/setFilter': return s.view.filter === e.text ? s : { ...s, view: { ...s.view, filter: e.text } };
    case 'view/togglePanel': return { ...s, view: { ...s.view, panelOpen: e.open ?? !s.view.panelOpen } };
    case 'view/setChooseMode':
      if (s.view.chooseMode === e.mode) return s;
      return { ...s, view: { ...s.view, chooseMode: e.mode }, selection: e.mode === 'single' ? { ...s.selection, checked: [], inverted: false } : s.selection };
    case 'view/setFullscreen': return { ...s, view: { ...s.view, fullscreen: e.on } };
    case 'view/setAnimate': return { ...s, view: { ...s.view, animate: e.on } }; // every animated item plays (02 HTML-66b); persisted
    case 'selection/focus': return s.selection.focused === e.path ? s : { ...s, selection: { ...s.selection, focused: e.path } };
    case 'selection/toggle': {
      if (s.view.chooseMode !== 'multiple') return s;
      const without = s.selection.checked.filter((p) => p !== e.path);
      return { ...s, selection: { ...s.selection, checked: e.checked ? [...without, e.path] : without } };
    }
    case 'selection/invert': return { ...s, selection: { ...s.selection, inverted: e.on ?? !s.selection.inverted } };
    case 'selection/clear': return { ...s, selection: { ...s.selection, checked: [], inverted: false } };
    case 'items/uploading': return { ...s, pending: { ...s.pending, uploading: true } };
    case 'items/uploaded': return { ...s, pending: { ...s.pending, uploading: false }, listing: { ...s.listing, entries: e.entries, status: 'ready' } };
    case 'items/uploadFailed': return { ...s, pending: { ...s.pending, uploading: false } };
    case 'items/deleting': { // optimistic (STATE-21)
      const gone = new Set(e.paths);
      return { ...s, pending: { ...s.pending, deleting: [...s.pending.deleting, ...e.paths] },
        listing: { ...s.listing, entries: s.listing.entries.filter((x) => !gone.has(x.path)) },
        selection: { ...s.selection, focused: s.selection.focused && gone.has(s.selection.focused) ? null : s.selection.focused, checked: s.selection.checked.filter((p) => !gone.has(p)) } };
    }
    case 'items/deleted': {
      const gone = new Set(e.paths);
      const stillPending = s.pending.deleting.filter((p) => !gone.has(p));
      let listing = s.listing;
      if (e.entries) listing = { ...listing, entries: e.entries };
      else if (listing.entries.some((x) => gone.has(x.path))) listing = { ...listing, entries: listing.entries.filter((x) => !gone.has(x.path)) };
      const path = gone.has(listing.path) ? parentPath(listing.path) : listing.path; // deleted the current directory
      return { ...s, pending: { ...s.pending, deleting: stillPending }, listing: { ...listing, path }, selection: { ...s.selection, checked: s.selection.checked.filter((p) => !gone.has(p)) } };
    }
    case 'items/deleteFailed': {
      const gone = new Set(e.paths);
      return { ...s, pending: { ...s.pending, deleting: s.pending.deleting.filter((p) => !gone.has(p)) }, listing: { ...s.listing, entries: e.entries } };
    }
    case 'items/renaming': return { ...s, pending: { ...s.pending, renaming: e.path } };
    case 'items/renamed': return { ...s, pending: { ...s.pending, renaming: null }, dialog: null,
      listing: { ...s.listing, entries: e.entries },
      selection: { ...s.selection, focused: s.selection.focused === e.from ? e.to : s.selection.focused, checked: s.selection.checked.map((p) => (p === e.from ? e.to : p)) } };
    case 'items/renameFailed': return { ...s, pending: { ...s.pending, renaming: null } };
    case 'directory/created': {
      const p = normalizePath(e.path), parent = parentPath(p), name = p.slice(p.lastIndexOf('/') + 1);
      const src = String(s.listing.source);
      const insert = (nodes: TreeNode[]): TreeNode[] => parent === '/'
        ? (nodes.some((n) => normalizePath(n.cd) === p) ? nodes : [...nodes, { name, cd: p, children: [] }])
        : nodes.map((n) => normalizePath(n.cd) === parent
          ? { ...n, children: (n.children ?? []).some((c) => normalizePath(c.cd) === p) ? n.children : [...(n.children ?? []), { name, cd: p, children: [] }] }
          : (n.children ? { ...n, children: insert(n.children) } : n));
      const tree = s.tree.bySource[src] ? { ...s.tree, bySource: { ...s.tree.bySource, [src]: insert(s.tree.bySource[src]!) } } : s.tree;
      const entries = parent === s.listing.path && !s.listing.entries.some((x) => x.path === p)
        ? [...s.listing.entries, { foldername: name, directory: p, path: p, absoluteURL: '', editedOn: Date.now(), fileSize: 0 }]
        : s.listing.entries;
      return { ...s, tree, listing: { ...s.listing, entries }, pending: { ...s.pending, creating: false }, dialog: null };
    }
    case 'dialog/open': return { ...s, dialog: { kind: e.kind, ...(e.target !== undefined ? { target: e.target } : {}) } };
    case 'dialog/close': return s.dialog === null ? s : { ...s, dialog: null };
    case 'dialog/input': return s.dialog === null ? s : { ...s, dialog: { ...s.dialog, input: e.value } };
    case 'notification/push': {
      const n: Notification = { id: e.id ?? `n${++notificationSeq}`, message: e.message, kind: e.kind ?? 'info', sticky: e.sticky ?? false, createdAt: Date.now(), ...(e.learnMore ? { learnMore: e.learnMore } : {}) };
      return { ...s, notifications: [...s.notifications, n] };
    }
    case 'notification/dismiss': return { ...s, notifications: s.notifications.filter((n) => n.id !== e.id) };
    case 'locale/changed': return { ...s, locale: { tag: e.tag, catalogStatus: e.tag.toLowerCase().startsWith('en') ? 'ready' : 'idle' } };
    case 'locale/catalogLoading': return { ...s, locale: { ...s.locale, catalogStatus: 'loading' } };
    case 'locale/catalogLoaded': return { ...s, locale: { ...s.locale, catalogStatus: 'ready' } };
    case 'locale/catalogMissing': return { ...s, locale: { ...s.locale, catalogStatus: 'error' } }; // text stays English (09 I18N-03); formatting keeps the tag
    default: return s;
  }
}

// ---- selectors (07 §3) ---------------------------------------------------------
// Sorting 5,000 entries with a collator costs tens of milliseconds, and the listing is re-read on every render,
// so the visible list is cached per entries array for the last (sort, filter, locale, records) seen (10 PERF-02).
const visibleCache = new WeakMap<Entry[], { key: string; records: Record<string, DisplayRecord>; result: FileEntry[] }>();
export const selectVisibleFiles = (s: State): FileEntry[] => {
  const key = `${s.view.sort.by}|${s.view.sort.dir}|${s.view.filter}|${s.locale.tag}`;
  const hit = visibleCache.get(s.listing.entries);
  if (hit && hit.key === key && hit.records === s.listing.records) return hit.result;
  const result = visibleFiles(s.listing.entries, s.view, s.locale.tag, s.listing.records);
  visibleCache.set(s.listing.entries, { key, records: s.listing.records, result });
  return result;
};
export const selectFiles = (s: State): FileEntry[] => s.listing.entries.filter(isFile);
export const selectFolders = (s: State): Entry[] => s.listing.entries.filter((e) => !isFile(e));
export const selectFocused = (s: State): FileEntry | null => (s.selection.focused ? (selectFiles(s).find((f) => f.path === s.selection.focused) ?? null) : null);
/** Effective chosen set (STATE-11): single → focused; multiple → checked, or visible minus checked when inverted. */
export function selectChosen(s: State): FileEntry[] {
  if (s.view.chooseMode === 'single') { const f = selectFocused(s); return f ? [f] : []; }
  const checked = new Set(s.selection.checked);
  const visible = selectVisibleFiles(s);
  return s.selection.inverted ? visible.filter((f) => !checked.has(f.path)) : visible.filter((f) => checked.has(f.path));
}
export const selectIsChecked = (s: State, path: string): boolean => s.selection.inverted !== s.selection.checked.includes(path);
export const selectCurrentTree = (s: State): TreeNode[] => s.tree.bySource[String(s.listing.source)] ?? [];

/** The node at `cd` in a tree, or undefined (also when an ancestor has not been loaded). */
export function findTreeNode(nodes: TreeNode[], cd: string): TreeNode | undefined {
  const target = normalizePath(cd);
  for (const n of nodes) {
    const ncd = normalizePath(n.cd);
    if (ncd === target) return n;
    if (n.children && (target + '/').startsWith(ncd + '/')) return findTreeNode(n.children, target);
  }
  return undefined;
}
/** `nodes` with the children of the node at `cd` replaced; other branches untouched. */
export function graftBranch(nodes: TreeNode[], cd: string, children: TreeNode[]): TreeNode[] {
  return nodes.map((n) => {
    const ncd = normalizePath(n.cd);
    if (ncd === cd) return { ...n, children };
    return n.children && (cd + '/').startsWith(ncd + '/') ? { ...n, children: graftBranch(n.children, cd, children) } : n;
  });
}
export const selectRecord = (s: State, path: string): DisplayRecord | undefined => s.listing.records[path];

// ---- store -------------------------------------------------------------------------
export type Listener = (state: State, event: Event | null, previous: State) => void;
export interface Store {
  getState(): State;
  dispatch(event: Event): State;
  subscribe(listener: Listener): () => void;
}

export function createStore(initial: State, reducer: (s: State, e: Event) => State = reduce): Store {
  let state = initial;
  const listeners = new Set<Listener>();
  return {
    getState: () => state,
    dispatch(event) {
      const previous = state;
      const next = reducer(state, event);
      if (next !== previous) { state = next; for (const l of [...listeners]) l(next, event, previous); }
      return state;
    },
    subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; }
  };
}
