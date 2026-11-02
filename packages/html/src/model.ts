// What every render function receives, and how to build it on the server.
import { buildDisplayRecord, cssSafe, createTranslator, initialState, reduce, resolveConfig, selectCurrentTree, type Config, type Entry, type PartialConfig, type Source, type State, type TreeNode, type Translator, type Keymap, type Catalog } from '@mrktps/eureka-core';

export type Level = 0 | 1;

export interface Ids {
  /** The instance prefix `{p}` (02 HTML-04). */
  p: string;
  id(suffix: string): string;
  item(kind: string, path: string): string;
}
export function createIds(prefix: string): Ids {
  return { p: prefix, id: (s) => prefix + s, item: (kind, path) => `${prefix}${kind}__${cssSafe(path)}` };
}

export interface Ctx {
  state: State;
  t: Translator;
  ids: Ids;
  level: Level;
  /** Base URL of the icon sprite, e.g. "./assets/img/icons.svg". */
  iconSprite: string;
  /** Rendered on the server for a notice after a no-JS upload. */
  uploaded?: string[];
  /** True when the page location came from the request (a POST navigate or a query), not the server default (07 STATE-40). */
  locationRequested?: boolean;
  /** The instance's keymap (with host overrides) for the shortcuts reference (05 KEY-A5); the default keymap when absent. */
  keymap?: Keymap;
  /** Names modifier keys for the platform in the shortcuts reference ("Option" on a Mac). */
  platform?: 'mac' | 'other';
  /** Non-English catalog the page was rendered with, embedded for the element (09 I18N-12). */
  catalog?: Catalog;
  /** The row whose context menu is open (02 HTML-71); element-local, never in State. */
  contextMenu?: { path: string };
  /**
   * Row markup memo for incremental client renders (10 PERF-11): `previous` holds the markup of each row
   * as last rendered, keyed by path; the listing fills `next` and emits a keep-placeholder
   * (`<tr id data-eureka-keep>`) for rows whose markup is unchanged, which the morph leaves untouched.
   */
  rowMemo?: RowMemo;
}
export interface RowMemo { previous: ReadonlyMap<string, string>; next: Map<string, string> }

export interface PageInput {
  sources: Source[];
  source: Source;
  path: string;
  entries: Entry[];
  tree: TreeNode[];
  lang: string;
  basePath: string;
  uploaded?: string[];
  locationRequested?: boolean;
  config?: PartialConfig;
  timeZone?: string;
  /** Catalog of the request locale (09 I18N-12); omitted for English, which is compiled in. Embedded in the page for hydration. */
  catalog?: Catalog;
}

/** Build a render context from server-side inputs (what @mrktps/eureka-server's renderPage receives). */
export function contextFromPage(input: PageInput, level: Level = 0): Ctx {
  const config: Config = resolveConfig({ basePath: input.basePath, currentDirectory: input.path, mediaSource: input.source.id, lang: input.lang, ...(input.config ?? {}) });
  const t = createTranslator(input.lang, input.catalog ?? {}, input.timeZone ? { timeZone: input.timeZone } : {});
  let state = initialState({ config, locale: input.lang });
  if (!input.lang.toLowerCase().startsWith('en') && !(input.catalog && Object.keys(input.catalog).length)) state = reduce(state, { type: 'locale/catalogMissing' }); // rendered in English (09 I18N-03)
  state = reduce(state, { type: 'sources/loaded', sources: input.sources });
  state = reduce(state, { type: 'source/select', id: input.source.id });
  state = reduce(state, { type: 'directory/navigate', source: input.source.id, path: input.path });
  state = reduce(state, { type: 'tree/loaded', source: input.source.id, nodes: input.tree });
  const records = Object.fromEntries(input.entries.map((e) => [e.path, buildDisplayRecord(e, { locale: input.lang, timeZone: input.timeZone, t })]));
  state = reduce(state, { type: 'listing/loaded', source: input.source.id, path: input.path, entries: input.entries, records });
  return { state, t, ids: createIds(config.storagePrefix), level, iconSprite: `${config.assetsBasePath.replace(/\/+$/, '')}/img/icons.svg`, ...(input.uploaded ? { uploaded: input.uploaded } : {}), ...(input.locationRequested ? { locationRequested: true } : {}), ...(input.catalog && Object.keys(input.catalog).length ? { catalog: input.catalog } : {}) };
}

/** The part of state a server embeds for hydration (03 NOJS-41, 07 STATE-40). */
export function hydrationState(state: State, { requested = false }: { requested?: boolean } = {}): Record<string, unknown> {
  return {
    location: requested ? 'requested' : 'default',
    sources: { all: state.sources.all, current: state.sources.current, status: 'ready' },
    tree: { bySource: { [String(state.listing.source)]: selectCurrentTree(state) }, open: state.tree.open, status: 'ready' },
    listing: { source: state.listing.source, path: state.listing.path, entries: state.listing.entries, status: 'ready' },
    view: { mode: state.view.mode, sort: state.view.sort, panelOpen: state.view.panelOpen, chooseMode: state.view.chooseMode }
  };
}
