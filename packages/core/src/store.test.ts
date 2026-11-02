import { describe, it, expect } from 'vitest';
import { createStore, initialState, reduce, selectChosen, selectVisibleFiles, selectCurrentTree, type State, findTreeNode, graftBranch } from './store.js';
import { resolveConfig, type Entry } from './types.js';
import { loadPersisted, persist } from './persistence.js';

const t0 = Date.UTC(2017, 3, 2);
const f = (name: string, size = 1, dims?: [number, number]): Entry => ({ filename: name, directory: 'd', path: `d/${name}`, absoluteURL: `/d/${name}`, editedOn: t0, fileSize: size, dimensions: dims });
const folder = (name: string): Entry => ({ foldername: name, directory: `d/${name}`, path: `d/${name}`, absoluteURL: `/d/${name}`, editedOn: t0, fileSize: 0 });
const entries = [f('b.jpg', 3, [10, 10]), f('a.jpg', 2), folder('sub'), f('c.txt', 1)];

function loaded(): State {
  let s = initialState({ config: resolveConfig({ currentDirectory: 'd' }) });
  s = reduce(s, { type: 'sources/loaded', sources: [{ id: 0, name: 'fs' }, { id: 1, name: 'cloud' }] });
  s = reduce(s, { type: 'listing/loaded', source: 0, path: 'd', entries });
  return s;
}

describe('store', () => {
  it('initialises from config, persisted and hydrated values in that precedence', () => {
    const s = initialState({ config: resolveConfig({ mode: 'list', treeHidden: false }), persisted: { view: { mode: 'grid' }, location: { source: 1, path: '/x/' }, treeOpen: ['x'] } });
    expect(s.view.mode).toBe('grid');
    expect(s.view.panelOpen).toBe(true);
    expect(s.listing).toMatchObject({ source: 1, path: 'x' });
    expect(s.tree.open).toEqual(['x']);
    const h = initialState({ config: resolveConfig(), hydrated: { listing: { source: 0, path: 'd', entries, records: {}, status: 'ready', requestId: 0 }, view: { mode: 'thumb' } } });
    expect(h.listing.entries.length).toBe(4);
    expect(h.view.mode).toBe('thumb');
  });
  it('picks the first source and keeps the current one when still present', () => {
    const s = loaded();
    expect(s.sources.current).toBe(0);
    expect(s.listing.source).toBe(0);
  });
  it('drops stale listings and clears selection on navigate', () => {
    let s = loaded();
    s = reduce(s, { type: 'selection/focus', path: 'd/a.jpg' });
    s = reduce(s, { type: 'view/setFilter', text: 'a' });
    s = reduce(s, { type: 'directory/navigate', path: 'd/sub' });
    expect(s.listing.status).toBe('loading');
    expect(s.selection.focused).toBeNull();
    expect(s.view.filter).toBe('');
    const stale = reduce(s, { type: 'listing/loaded', source: 0, path: 'd', entries });
    expect(stale).toBe(s);
    const fresh = reduce(s, { type: 'listing/loaded', source: 0, path: 'd/sub', entries: [] });
    expect(fresh.listing.status).toBe('ready');
  });
  it('setSort keeps the other half (KEY-10 defect fixed)', () => {
    let s = loaded();
    s = reduce(s, { type: 'view/setSort', dir: 'descending' });
    s = reduce(s, { type: 'view/setSort', by: 'fileSize' });
    expect(s.view.sort).toEqual({ by: 'fileSize', dir: 'descending' });
    expect(selectVisibleFiles(s).map((e) => e.filename)).toEqual(['b.jpg', 'a.jpg', 'c.txt']);
  });
  it('selection: single uses focus, multiple uses checked and inversion', () => {
    let s = loaded();
    s = reduce(s, { type: 'selection/focus', path: 'd/a.jpg' });
    expect(selectChosen(s).map((e) => e.filename)).toEqual(['a.jpg']);
    s = reduce(s, { type: 'selection/toggle', path: 'd/b.jpg', checked: true }); // ignored in single mode
    expect(s.selection.checked).toEqual([]);
    s = reduce(s, { type: 'view/setChooseMode', mode: 'multiple' });
    s = reduce(s, { type: 'selection/toggle', path: 'd/b.jpg', checked: true });
    expect(selectChosen(s).map((e) => e.filename)).toEqual(['b.jpg']);
    s = reduce(s, { type: 'selection/invert' });
    expect(selectChosen(s).map((e) => e.filename).sort()).toEqual(['a.jpg', 'c.txt']);
    s = reduce(s, { type: 'view/setChooseMode', mode: 'single' });
    expect(s.selection).toMatchObject({ checked: [], inverted: false, focused: 'd/a.jpg' });
  });
  it('delete is optimistic and restorable; rename moves focus', () => {
    let s = loaded();
    s = reduce(s, { type: 'selection/focus', path: 'd/a.jpg' });
    s = reduce(s, { type: 'items/deleting', paths: ['d/a.jpg'] });
    expect(s.listing.entries.some((e) => e.path === 'd/a.jpg')).toBe(false);
    expect(s.selection.focused).toBeNull();
    s = reduce(s, { type: 'items/deleteFailed', paths: ['d/a.jpg'], entries, error: 'nope' });
    expect(s.listing.entries.length).toBe(4);
    expect(s.pending.deleting).toEqual([]);
    s = reduce(s, { type: 'selection/focus', path: 'd/a.jpg' });
    s = reduce(s, { type: 'items/renamed', from: 'd/a.jpg', to: 'd/z.jpg', entries: entries.map((e) => (e.path === 'd/a.jpg' ? { ...e, filename: 'z.jpg', path: 'd/z.jpg' } : e)) });
    expect(s.selection.focused).toBe('d/z.jpg');
  });
  it('deleting the current directory moves up', () => {
    let s = loaded();
    s = reduce(s, { type: 'items/deleted', paths: ['d'] });
    expect(s.listing.path).toBe('/');
  });
  it('directory/created inserts into tree and listing', () => {
    let s = loaded();
    s = reduce(s, { type: 'tree/loaded', source: 0, nodes: [{ name: 'd', cd: 'd', children: [] }] });
    s = reduce(s, { type: 'directory/created', path: 'd/new' });
    expect(selectCurrentTree(s)[0]!.children!.map((c) => c.cd)).toEqual(['d/new']);
    expect(s.listing.entries.some((e) => e.foldername === 'new')).toBe(true);
  });
  it('tree/branchLoaded grafts the children of one cut-off node (11 MS-43)', () => {
    let s = loaded();
    s = reduce(s, { type: 'tree/loaded', source: 0, nodes: [{ name: 'a', cd: 'a', children: [{ name: 'b', cd: 'a/b' }] }, { name: 'z', cd: 'z', children: [] }] });
    expect(findTreeNode(selectCurrentTree(s), 'a/b')).toEqual({ name: 'b', cd: 'a/b' });
    expect(findTreeNode(selectCurrentTree(s), 'a/b/c')).toBeUndefined(); // not loaded yet
    s = reduce(s, { type: 'tree/branchLoaded', source: 0, cd: 'a/b', nodes: [{ name: 'c', cd: 'a/b/c' }] });
    expect(findTreeNode(selectCurrentTree(s), 'a/b')!.children).toEqual([{ name: 'c', cd: 'a/b/c' }]);
    expect(selectCurrentTree(s)[1]).toEqual({ name: 'z', cd: 'z', children: [] }); // untouched
    expect(reduce(s, { type: 'tree/branchLoaded', source: 7, cd: 'a', nodes: [] })).toBe(s); // unknown source: no-op
    expect(graftBranch([{ name: 'a', cd: 'a' }], 'a/missing', [])).toEqual([{ name: 'a', cd: 'a' }]); // ancestor not loaded: unchanged
  });
  it('notifications push and dismiss', () => {
    let s = loaded();
    s = reduce(s, { type: 'notification/push', message: 'hi', id: 'x' });
    expect(s.notifications[0]).toMatchObject({ id: 'x', kind: 'info', sticky: false });
    s = reduce(s, { type: 'notification/dismiss', id: 'x' });
    expect(s.notifications).toEqual([]);
  });
  it('store notifies subscribers only on change', () => {
    const store = createStore(loaded());
    const seen: string[] = [];
    store.subscribe((_, e) => seen.push(e?.type ?? '?'));
    store.dispatch({ type: 'view/setMode', mode: 'table' }); // no-op
    store.dispatch({ type: 'view/setMode', mode: 'grid' });
    expect(seen).toEqual(['view/setMode']);
  });
});

describe('persistence', () => {
  const mem = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), m }; };
  it('round-trips view, location and open tree nodes, ignoring garbage', () => {
    const st = mem();
    let s = loaded();
    s = reduce(s, { type: 'view/setMode', mode: 'list' });
    s = reduce(s, { type: 'tree/toggle', path: 'd', open: true });
    persist(st, 'p__', s);
    expect(loadPersisted(st, 'p__')).toEqual({ view: { mode: 'list', sort: { by: 'filename', dir: 'ascending' }, panelOpen: false, chooseMode: 'single', animate: false }, location: { source: 0, path: 'd' }, treeOpen: ['d'] });
    st.setItem('p__view', '{"mode":"carousel","sort":{"by":"x"}}');
    expect(loadPersisted(st, 'p__').view).toBeUndefined();
    st.setItem('p__view', 'not json');
    expect(loadPersisted(st, 'p__').view).toBeUndefined();
    expect(loadPersisted(null, 'p__')).toEqual({});
  });
});
