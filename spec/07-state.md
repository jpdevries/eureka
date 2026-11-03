# 07. State

Status: draft. Derived from the v2 Redux reducers
(`client/src/model/reducers.js`) and re-shaped for the framework-free
core. Normative shape in `schema/state.json`.

## 1. Store

- **STATE-01** An instance owns one store: an immutable state value, a
  `dispatch(event)` that applies a pure transition, and `subscribe(fn)`.
  No framework is involved; the element and any adapter read it (React
  via `useSyncExternalStore`, Vue via a shallowRef, …).
- **STATE-02** Transitions are synchronous and pure. Effects (API calls,
  persistence, worker messages, focus moves) run in effect handlers that
  react to state changes and dispatch follow-up events. This replaces
  redux-thunk action creators.
- **STATE-03** Every state change produces a new top-level object and new
  objects along the changed path only, so renderers can diff by identity.

## 2. Shape

```ts
interface State {
  config: Config;                                   // 01 §3, frozen after init
  sources: { all: Source[]; current: SourceId | null; status: Status };
  tree:    { bySource: Record<SourceId, TreeNode[]>; open: string[]; status: Status };
  listing: { source: SourceId | null; path: string; entries: Entry[]; status: Status; error?: string; receivedAt?: number };
  selection: { focused: string | null; selected: string | null; checked: string[]; inverted: boolean };
  view:    { mode: 'table'|'thumb'|'grid'|'list'|'masonry'; sort: { by: 'filename'|'dimensions'|'fileSize'|'editedOn'; dir: 'ascending'|'descending' };
             filter: string; panelOpen: boolean; chooseMode: 'single'|'multiple'; fullscreen: boolean };
  pending: { uploading: boolean; deleting: string[]; renaming: string | null; creating: boolean; cropping: boolean };
  dialog:  null | { kind: 'createDirectory'|'rename'|'crop'|'confirmDelete'; target?: string };
  notifications: Notification[];                    // { id, message, kind: 'info'|'danger', sticky, learnMore?, createdAt }
  locale:  { tag: string; catalogStatus: Status };
}
type Status = 'idle' | 'loading' | 'ready' | 'error';
```

`checked` and `focused` hold entry `path`s (CON-01). v2 stored whole
entry objects and compared them by identity, which broke after a refetch.

## 3. Derived data (selectors)

Computed, never stored:

- **STATE-10** `visibleEntries`: files of `listing.entries` (folders
  excluded), filtered by `view.filter` against the display record
  (filename, dimensions text, size text, the date strings), then sorted
  by `view.sort` (collation rules in 09 I18N-22; `dimensions` sorts by
  area; `editedOn` by time; unknown values sort last).
- **STATE-10a** The filter text is a query (Level 1+ only; the Level 0
  filter is a plain `<input>` the server may ignore, 03 NOJS-20). Grammar,
  the Lucene/Gmail/GitHub convention: whitespace separates tokens; quotes
  group a value with spaces (`name:"Wide Banner"`); `key:value` restricts
  one field; a value may start with `>`, `>=`, `<`, `<=` or `=`, or be a
  range `a..b`; a leading `-` negates the token; every token must match.
  A token whose qualifier is unknown, malformed, or unavailable for the
  current source is matched as plain text, never an error. A query with
  no live qualifier keeps the pre-existing behaviour: the whole string is
  one case-insensitive substring of the display record's haystack.
  Qualifiers: `type:image|video|audio|pdf|text|other` (media kind),
  `ext:jpg`; `is:animated|folder|chosen` (states only, never formats);
  `size:` with `b kb mb gb tb` in binary multiples, the size column's
  units; `modified:` and `created:` with ISO dates at year, month or day
  precision, where `>` means after the period, `<` before it, a bare date
  within it and `a..b` spans both, against `editedOn` and `createdOn`
  (an entry without `createdOn` never matches `created:`); from
  `dimensions`: `width:`, `height:`, `px:WxH` (both axes), `min:4k|1080p|
  720p|<n>` (long edge; other `k`/`p` suffixes are refused), `orientation:
  landscape|portrait|square` and `ratio:16:9|1.5` with a 2 % tolerance,
  where an entry without dimensions never matches; with
  `capabilities.location` (01 CON-05): `has:location`, `near:lat,lng,
  25km|mi` (haversine) and `within:south,west,north,east`, otherwise plain
  text. `is:chosen` reads the chosen set of STATE-11.
- **STATE-11** `chosenEntries`: in single mode, `[selected]` when an item
  is selected, else `[focused]` when set; in multiple mode, `checked` or,
  when `inverted`, every visible file not in `checked`. This is what
  `callbacks.choose` receives. `selection.selected` is set by Space on
  the focused row or a click on a file row, cleared by Space again, by
  navigation, by a listing that no longer holds it, and by switching to
  multiple mode; Enter on a row selects and commits that row, Choose
  commits the selected item or, with none, the focused one.
- **STATE-12** `displayRecord(entry)`: the per-item strings (sizes, dates,
  icon, description) produced once per entry per locale, in the worker
  when available (10 PERF-01), memoised by `(path, editedOn, fileSize,
  locale)`.
- **STATE-13** `folders`: the folder entries of the listing merged into
  the tree under the current directory (v2 did this in the tree reducer).

## 4. Events

Event names are `area/verb`. Payloads in `schema/state.json#/$defs/events`.

| Event | Transition |
|---|---|
| `sources/loaded {sources}` | set `sources.all`; if `current` is null pick `config.mediaSource` or the first |
| `source/select {id}` | set `current`; reset listing to `/` of that source; clear selection and filter |
| `tree/loaded {source, nodes}` | replace `tree.bySource[source]`, preserving `open` |
| `tree/branchLoaded {source, cd, nodes}` | set `children` of the node at `cd` (fetched when a cut-off node opens or the current directory lies below the loaded depth, 11 MS-43); other branches untouched |
| `tree/toggle {path, open}` | add/remove in `tree.open` |
| `directory/navigate {source?, path}` | set `listing.source/path`, `status: loading`; clear selection, filter and `dialog`; keep sort and mode |
| `listing/loaded {source, path, entries}` | ignored unless it matches the current `listing` request; set entries, `status: ready` |
| `listing/failed {error}` | `status: error`, push a danger notification |
| `view/setMode {mode}` · `view/setSort {by?, dir?}` · `view/setFilter {text}` · `view/togglePanel {open?}` · `view/setChooseMode {mode}` · `view/setFullscreen {on}` | set the field; `setSort` keeps the other half (v2 lost `dir`, KEY-10 defect); switching to single clears `checked` and `inverted` |
| `selection/focus {path|null}` | set `focused` |
| `selection/select {path|null}` | set `selected` (single mode, STATE-11) |
| `selection/toggle {path, checked}` | add/remove in `checked` (multiple mode only) |
| `selection/invert {on?}` | toggle `inverted` |
| `selection/clear` | `checked = []`, `inverted = false` |
| `items/uploading {files}` · `items/uploaded {entries}` · `items/uploadFailed {error}` | pending flag; replace entries; notify |
| `items/deleting {paths}` · `items/deleted {paths, entries?}` | optimistic removal from entries and selection; refreshed entries when the server returns them |
| `items/renaming {path}` · `items/renamed {from, to, entries}` | replace entries; move `focused`/`checked` from `from` to `to` |
| `directory/created {path}` | insert folder into tree and listing |
| `dialog/open {kind, target?}` · `dialog/close` | set `dialog` |
| `notification/push {message, kind, sticky, learnMore?}` · `notification/dismiss {id}` | append / remove |
| `locale/changed {tag}` · `locale/catalogLoaded` | set locale; display records are recomputed |

- **STATE-20** Stale responses are dropped: a `listing/loaded` whose
  `(source, path)` differ from the current request is ignored. Every API
  request carries an `AbortController` cancelled by the next navigation.
- **STATE-21** Mutations are optimistic where the outcome is certain
  (delete removes the row immediately) and pessimistic where it is not
  (rename waits for the server's listing). A failed optimistic mutation
  restores the entry and raises an alert.

## 5. Persistence

- **STATE-30** With `useLocalStorage`, these keys are written under
  `{p}`: `view` (`mode`, `sort`, `panelOpen`, `chooseMode`), `location`
  (`source`, `path`), `tree.open`, and `welcomed`. Nothing else: not
  selection, not filter, not pending, not entries. v2 also cached the
  listing and tree in `localStorage`; v3 moves that cache to IndexedDB in
  the worker (10 PERF-05) and treats it as a cache, not state.
- **STATE-31** Persisted values are read once at init and validated
  against the schema; an invalid value is ignored, never thrown.
- **STATE-32** Instances with different `uid`s but the same
  `storagePrefix` share persisted view preferences by design (a host with
  two browsers wants one preference). Hosts that want isolation set
  distinct prefixes.

## 6. Hydration

- **STATE-40** When the server embeds `<script type="application/json"
  id="{p}state">` (03 NOJS-41) the store initialises `sources` and
  `tree` from it and skips those fetches. The embedded `listing` is used
  when its `location` is `"requested"` (the page answered a POST
  navigate or a `?path=` query), or when nothing is persisted, or when it
  matches the persisted location; otherwise the visitor's persisted
  location wins and is fetched, because a default server location must not
  override where they left off. The embedded `view` is informative only;
  view preferences come from configuration and persistence (CON-11).
  Without the script, the store initialises from persisted keys and fetches
  sources, tree and listing in that order, rendering the cached listing
  meanwhile.

## 7. Host integration

- **STATE-41** Withdrawn: the persisted `view` object holds mode, sort,
  panel and choose mode only. Animated media plays per item and is not
  persisted (02 HTML-66b); a stored `animate` key from earlier builds is
  ignored.
- **STATE-50** The custom element mirrors `callbacks` as DOM events:
  `eureka-choose` (`detail.items`), `eureka-close`, plus
  `eureka-navigate` (`detail.{source, path}`), `eureka-error`
  (`detail.{message, cause}`) and `eureka-statechange` (`detail.state`,
  throttled). Adapters map these to their idioms.
- **STATE-51** The REST client is an interface with one method per
  operation (`listSources`, `listTree`, `listDirectory`, `upload`,
  `createDirectory`, `rename`, `remove`, `removeMany`, `zip`). A host may
  pass its own implementation as `config.api` to talk to a non-REST
  backend. This replaces v2's "decorated actions".
- **STATE-52** The element exposes imperative methods mirroring the
  events hosts commonly need: `navigate(source, path)`, `setView(mode)`,
  `refresh()`, `choose()`, and a read-only `state` getter.
