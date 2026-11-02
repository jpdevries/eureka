# 01. Concepts

Status: draft. Vocabulary used by every other document, and the
configuration surface of an instance.

## 1. Vocabulary

- **Host.** The page or application that embeds Eureka and consumes its
  result. The host supplies configuration, a REST API (`api/openapi.yaml`)
  and, for Level 0, a server that renders and accepts the form (03).
- **Instance.** One mounted media browser. A page may hold several; each
  has a `uid` and an id prefix `{p}` (02 HTML-04) and its own state and
  persistence namespace.
- **Media source.** A named root the host exposes through the API
  (`Source`: `id`, `name`, optional `capabilities`). Ids appear in URLs
  and in no-JS form values and MUST NOT contain `|` or `/`.
- **Directory.** A path inside a source, relative to the source root, `/`
  separated, with no leading slash; the root is `/`. The **current
  directory** (`cd`) is the one being listed.
- **Entry.** One row of a listing: a **file** (has `filename`) or a
  **folder** (has `foldername`). Files are listing rows; folders feed the
  tree and the directory selector and are never rows (02 HTML-62).
- **Listing.** The entries of the current directory as returned by the API
  plus derived display fields (07 §3). **Visible entries** are the listing
  after filter and sort.
- **Tree.** The nested folders of the current source (`TreeNode`: `name`,
  `cd`, `children?`), shown in the source panel. Nodes remember whether
  they are open.
- **Focused item.** The file whose row has keyboard focus or was focused
  last. It drives the path bar, the actions toolbar and the Choose button
  in single mode.
- **Chosen items.** In multiple mode, the set of checked files. With the
  selection **inverted**, the chosen set is every visible file except the
  checked ones.
- **Choose.** The act of handing items to the host: the `choose` callback
  (Level 1+) or the form POST with `eureka__chosen_item` (Level 0). Eureka
  does not navigate away or close itself; the host decides.
- **View.** Presentation state: layout mode, sort, filter, source panel
  open, choose mode, fullscreen. Persisted per instance (07 §5).
- **Level.** Conformance level 0, 1 or 2 (README).

## 2. Identifiers and paths

- **CON-01** Entry identity is `path` (source-relative). Two entries with
  the same `path` in one source are the same item. Clients key rows,
  selection and caches by `(sourceId, path)`.
- **CON-02** Paths are compared byte-wise after normalisation: collapse
  repeated `/`, strip a trailing `/`, map the empty string to `/`.
  Clients never resolve `..`; servers MUST reject paths that escape the
  source root.
- **CON-03** Filenames are displayed as sent. Any transformation for ids
  uses the `cssSafe` algorithm (02 HTML-05); any transformation for URLs
  uses `encodeURIComponent` per segment.

## 3. Configuration

The instance configuration is the union of the v2 React props and
`initialConfigState`. Names are kept for continuity. Normative shape and
defaults live in `schema/config.json`; the table is the human index.

| Option | Default | Meaning |
|---|---|---|
| `basePath` | `"/"` | Prefix for API requests and the Level 0 form action |
| `uid` | `"0"` | Instance id, used in field names and id prefixes |
| `storagePrefix` | `"eureka__"` | Prefix `{p}` for ids and persistence keys |
| `lang` | document language | BCP 47 tag; see 09 |
| `mediaSource` | first source | Initial source id |
| `currentDirectory` | `"/"` | Initial directory |
| `mode` | `"table"` | Initial layout mode |
| `sort` | `{by:"filename",dir:"ascending"}` | Initial sort |
| `treeHidden` | `true` | Source panel initially collapsed |
| `treeDepth` | `3` | Levels of the folder tree fetched at once; deeper folders load when opened (11 MS-43) |
| `useLocalStorage` | `true` | Persist view preferences and remember location |
| `allowChoose` | `true` | Offer Choose |
| `allowChooseMultiple` | `true` | Offer the Single/Multiple switch |
| `allowInvertSelection` | `true` | Offer Invert in multiple mode |
| `allowUploads` | `true` | Offer upload controls |
| `doDragNDrop` | `true` | Drop area and drop-on-listing (Level 2) |
| `allowRename` | `true` | Rename action and dialog |
| `allowDelete` | `true` | Delete action and bulk delete |
| `confirmBeforeDelete` | `false` | Confirm dialog before deleting |
| `allowDownload` | `true` | Download action on rows |
| `allowDownloadMultiple` | `true` | Bulk zip download |
| `allowCrop` | `true` | Crop action for raster images (Level 2) |
| `allowMasonry` | `true` | Offer the masonry mode |
| `allowFullscreen` | `true` | Offer the fullscreen toggle |
| `enlargeFocusedRows` | `false` | Larger thumbnail on the focused table row |
| `emphasisFocusedMediaItem` | `true` | Bold filename on the focused row |
| `welcome` / `alwaysWelcome` | `true` / `false` | Welcome notification once / every load |
| `learnMore` | project URL | Link in the welcome notification |
| `headers` | `{}` | Extra request headers for every API call |
| `endpoints.i18n` | `{assetsBasePath}js/i18n/locales/` | Where locale catalogs are fetched from |
| `assetsBasePath`, `iconSVG` | `"./assets/"`, `img/icons.svg` | Icon sprite location |
| `intervals.fetchDirectoryContents` | `false` | Poll the listing every n ms (`false` off) |
| `intervals.updateSourceTree` | `false` | Poll the tree every n ms |
| `intervals.searchBarPlaceholder` | `false` | Rotate the filter placeholder every n ms |
| `callbacks.choose(items)` | required for Choose | Receives one entry (single) or an array (multiple) |
| `callbacks.close()` | optional | Cancel button |
| `handlers.createFile(sourceId, cd)` | optional | Returns `{href, target, onClick?}` for a "Create File" affordance |
| `api` | REST client | Optional adapter replacing the REST calls (07 §7); supersedes v2 "decorated actions" |

- **CON-04** A source MAY declare `capabilities` (`upload`,
  `createDirectory`, `rename`, `delete`; a field left out means allowed;
  schema `source.json`). What the instance offers for the current source
  is the instance option AND the source capability: `allowDelete: true`
  with a source whose `delete` is `false` shows no Delete control, bulk
  delete, context menu entry or shortcut, in Level 0 as in Level 2. The
  server refuses a declared-unavailable mutation with 403 before touching
  the backend (11 MS-09), and a client that receives 403 for a mutation
  re-reads the source list so capabilities a backend discovered late
  take effect without a reload.
- **CON-10** Unknown options MUST be ignored, not rejected, so hosts can
  share one configuration object across spec versions.
- **CON-11** When `useLocalStorage` is on, persisted view state wins over
  `mode`, `sort`, `treeHidden`, `currentDirectory` and `mediaSource`
  defaults, but an option the host passes explicitly wins over persisted
  state (v2 README rule, kept).
- **CON-12** `callbacks.choose` absent means the choose bar is not
  rendered at Level 1+ (v2 behaviour). At Level 0 the server always
  renders Choose because the POST is the callback.
