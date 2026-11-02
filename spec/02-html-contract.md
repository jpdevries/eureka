# 02. HTML contract

Status: draft, seeded from `fixtures/snapshots/v2-enhanced-*.html` and
`v2-nojs-*.html`. Where v3 deliberately departs from v2 the v2 behaviour
is noted so the baseline can be compared.

The contract is stated in terms of the accessibility tree (roles, names,
states) first and markup second. Conformance tests query by role and
name. Class names and ids are stable hooks for CSS and for hosts, and are
listed in section 9, but a test never depends on them.

## 1. Root and instance

- **HTML-01** An instance has one root element with class `eureka`. At
  Level 0 the root is the `<form>` described in 03. At Level 1+ the root
  is a `<div>` (the form is replaced because the enhanced layer uses many
  independent forms inside it) with `role="region"`, the accessible name
  "Media Browser", and `tabindex="-1"`: a click anywhere inside gives the
  root programmatic focus so instance-scoped shortcuts (05 KEY-A2) work
  without first tabbing to a control. The root is not in the tab order.
- **HTML-02** The root MUST carry the current view mode as
  `data-view="table|thumb|grid|list|masonry"` and the choose mode as
  `data-choose="single|multiple"`. v2 used the classes
  `eureka__view-mode__{mode}` and `eureka__choose-multiple`; v3 MUST also
  emit those classes for stylesheet compatibility until spec 4.0.
- **HTML-03** The root MUST carry `lang` when the component's language
  differs from the document's.
- **HTML-04** Every id inside an instance MUST be prefixed with the
  instance prefix `{p}` (default `eureka__`, configurable per instance) so
  several instances can share a page. v2 was inconsistent here (some ids
  were prefixed, some literal); v3 prefixes all of them.
- **HTML-05** Ids derived from filenames MUST use the `cssSafe` transform:
  lowercase ASCII letters and digits pass through, space becomes `-`,
  every other character becomes `__` followed by its 4-digit hex code
  point (`Wide Banner (final).jpg` → `wide-banner-__0028final__0029__002ejpg`).
  The no-JS form relies on these ids for `<label for>`.

## 2. Region order

Regions appear in this DOM order. Visual order may differ by CSS but the
DOM order is the reading order and the tab order.

1. Notifications (live region)
2. Source panel (`aside`): source selector, directory tree, drop area, tree bar
3. Stage header: heading, choose-mode radios, filter
4. Toolbar: source panel toggle, directory selector, sort controls, upload, view chooser
5. Listing (the table)
6. Path bar (status for the focused or selected items)
7. Choose bar: Cancel, bulk Download, bulk Delete, Choose
8. Modals (dialogs), rendered last in the root

- **HTML-10** The source panel MUST be collapsible. When collapsed it is
  `hidden`, and a "Toggle Source Panel" toggle button in the toolbar
  carries `aria-expanded` and `aria-controls` pointing at it.
- **HTML-11** When the source panel is collapsed, the toolbar MUST show
  the directory selector (the same `<select>` as NOJS-12) so the directory
  can still be changed; when expanded the tree takes that role and the
  selector is omitted.

## 3. Notifications

- **HTML-20** Notifications render inside a container with
  `role="status"` (`aria-live="polite"`) for informational messages and
  `role="alert"` for errors. v2 used one `aria-live="assertive"` region
  for everything; v3 splits them.
- **HTML-21** A notification MUST contain its message text, MAY contain a
  "Learn more" link, and MUST contain a dismiss button named "Dismiss
  Notification". Sticky notifications stay until dismissed; others MAY
  auto-dismiss after a configured delay and MUST NOT auto-dismiss in under
  five seconds.

## 4. Source panel

- **HTML-30** The source panel is an `<aside>` (`role="complementary"`)
  with accessible name "Media Source Panel". Its toggle button in the
  toolbar reads "Toggle Source Panel" (HTML-10): a verb for the control, a
  noun for the region. (Until 3.0.0-alpha.1 both said "Media Source
  Panel".)
- **HTML-31** The source selector is a `<select>` labelled "Media Source"
  (visible text) whose options are the media sources (`name`, value `id`).
  A visually-hidden prefix "Choose a" completes the label.
- **HTML-32** The directory tree is a `<nav>` labelled "Directories"
  built from one node per directory, the root rendered as `./`. A node is
  a row holding a `<details>` disclosure whose `<summary>` (folder icon,
  visually-hidden "Toggle {name}") only expands or collapses, followed by a
  sibling `<button>` with the directory name that navigates into it; the
  node's children list follows the row and is shown while the disclosure is
  open. The two controls are siblings, never nested, so the summary contains
  no interactive content (axe `nested-interactive`). Directories without
  subdirectories render a static folder icon in place of the disclosure. A
  directory the server has not expanded (no `children`, past `treeDepth`;
  11 MS-43) renders the disclosure anyway, with class
  `eureka__tree-node--unloaded`, and opening it fetches that level. The
  current directory's button carries `aria-current="page"` (v2: class
  `active` on a link). The directory selector shown while the panel is
  closed lists the loaded folders only.
- **HTML-33** Open state of tree nodes MUST persist across renders and
  reloads (07, persistence).
- **HTML-34** The drop area, when drag and drop uploads are enabled, is a
  `<button>` whose accessible name is "Drag files here to be uploaded to
  {cd}. Paste images from the clipboard to upload"; activating it opens the
  file picker, and files dropped on it (or anywhere in the instance) or
  pasted while focus is inside the instance are uploaded to the current
  directory. When an upload is in progress its icon changes to a spinner
  and its name starts with "Uploading files…". v2 used a `div` with
  `tabindex="0"` and an `aria-label`, which is not a permitted
  combination.
- **HTML-35** The tree bar contains icon buttons, each with visually-hidden
  text and `title`: "Create a new Directory in {cd}", "Create File in
  {cd}" (a link, only when the host supplies a createFile handler), and
  "Upload File to {cd}".

## 5. Stage header and toolbar

- **HTML-40** The stage begins with an `<h2>` whose accessible name is
  "Browse Media Content" (visible "Media Content", visually-hidden
  "Browse").
- **HTML-41** When multiple choice is allowed, a `<fieldset>` with
  `<legend>` "Choose Items" holds two radios labelled "Single" and
  "Multiple". v2 used `role="radiogroup"` on a div with a stray
  `<legend>`; v3 uses a real fieldset.
- **HTML-42** When multiple choice is active an "Invert" checkbox MAY
  follow the radios (visible in v2 when `allowInvertSelection`).
- **HTML-43** The filter is a `<form role="search">` (v3 MAY use
  `<search>`) containing an `<input type="text">` labelled "Filter" with
  visually-hidden suffix "contents of {cd} by filename, filesize,
  dimensions or even modification date", and a `<datalist>` of the current
  filenames. Its placeholder cycles through sample values from the
  listing. Submitting the form MUST NOT navigate.
- **HTML-44** The toolbar is a `role="toolbar"` labelled "Listing
  controls". v2 used `role="menubar"`, which implies menu keyboard
  semantics it never implemented; v3 corrects this.
- **HTML-45** Sort controls are two `<select>`s labelled "Sort by"
  (options Name, Dimensions, File Size, Edited On; values `filename`,
  `dimensions`, `fileSize`, `editedOn`) and "Sort Direction" (Ascending,
  Descending). They mirror the state of the column headers (HTML-61).
- **HTML-46** The upload form in the toolbar is a `<form
  enctype="multipart/form-data">` with a file input named
  `eureka__uploadFiles` labelled "Upload files to {cd}" (visible "Upload
  files", hidden suffix). Choosing files submits immediately; the control
  is disabled and relabelled "Uploading files…" while an upload runs.
- **HTML-47** The view chooser is a `<fieldset>` with `<legend>` "View
  Mode" containing radios named `eureka__view` with values `table`,
  `thumb`, `grid`, `masonry`, `list` and accessible names "Table Layout",
  "Thumbnail Layout", "Grid Layout", "Masonry Layout", "List Layout".
  Each label also carries a `title` with the mode description message.
  The masonry radio is present only when masonry is allowed.
- **HTML-48** A fullscreen toggle, when allowed and supported, is a
  checkbox labelled "Fullscreen Mode" after the view radios.

## 6. Listing

- **HTML-60** The listing is a `<table>` with class `eureka__table` and a
  visually-hidden `<caption>` "Contents of {cd}, {n} items". At Level 0 it
  is a plain table. At Level 1+ it carries `role="grid"` (so `tr` are rows
  and `td` gridcells), `aria-multiselectable="true"` in multiple-choose
  mode, and `aria-describedby` pointing at a visually-hidden sentence of
  usage instructions ("Use the up and down arrow keys to move between
  items, the right arrow key for an item's actions, and Enter to
  choose."). Rationale: the rows are one tab stop navigated with arrow
  keys (HTML-63, 05 KEY-B1/B2), which is the ARIA grid pattern; screen
  readers switch to focus mode on a grid so those keys reach the browser
  rather than the virtual cursor, and the description tells first-time
  keyboard users what to press. (An earlier draft forbade `role="grid"`
  because v2 set it without arrow-key navigation; v3 has the navigation.)
- **HTML-61** `<thead>` has one row of `<th scope="col">`: Media, Name,
  Actions (visually hidden), Dimensions, File Size, Edited On. In multiple
  choice mode a leading "Choose" column (visually-hidden text) is added;
  at Level 0 a leading "Select" column is added. Sortable headers (Name,
  Dimensions, File Size, Edited On) contain a `<button>` that toggles the
  sort and carry `aria-sort="ascending|descending"` on the sorted column.
  v2 attached a click handler to the `<th>` itself, unreachable by
  keyboard; v3 requires the button.
- **HTML-62** `<tbody>` holds one `<tr>` per file. Folders in the listing
  are not rows; they appear in the tree and the directory selector.
- **HTML-63** Rows are focusable with a roving tabindex: the current row
  `tabindex="0"`, all others `tabindex="-1"`, Arrow Up/Down move between
  rows. v2 gave every row `tabindex="0"`; v3 adopts roving tabindex so a
  5,000 row listing is one tab stop.
- **HTML-64** Each row's id is `{p}row__{cssSafe(filename)}`, a valid
  HTML id (the prefix defaults to `eureka__`, so it starts with a letter).
  Everything inside the row that needs an id appends to it rather than
  deriving a fresh one: `{rowId}__media`, `{rowId}__filename`,
  `{rowId}__check`, `{rowId}__expand`, `{rowId}__choose`, …, and the
  path bar's copies `{rowId}__pathbar-expand` and so on. Its
  accessible description (exposed via `aria-describedby` to a
  visually-hidden element, or via `aria-label` as v2 did) MUST follow the
  message `item.description`: "{filename} displays at {w}x{h}, weighs
  {size}, and was edited on {long date with time zone}", omitting the
  dimensions clause when unknown.
- **HTML-65** Cells, in order: Choose (multiple mode only; a checkbox
  labelled "Choose {filename}"), Select (Level 0 only; the radio of
  NOJS-14), Media, Name, Actions, Dimensions, File Size, Edited On. Cell
  classes are listed in section 9 because the layout CSS targets them.
- **HTML-66** Media cell: for image types (`jpg jpeg gif png svg bmp
  tiff webp avif`) an `<img>` whose `src` is `absolutePreviewURL` falling
  back to `absoluteURL`, `alt` from the item's `alt` field or empty when
  the row description already conveys the item, `loading="lazy"`,
  `decoding="async"`. For video an `<video controls>`, for audio an
  `<audio controls>`, for PDF an `<embed>` (v3 MAY use `<object>`), for
  anything else a type icon followed by the filename. Double-click or
  double-tap on the media cell chooses the item.
- **HTML-66a** When the entry carries `renditions` (API schema), the
  image MUST be rendered as a `<picture>`: one `<source>` per modern
  format offered (`image/avif`, `image/webp`) with a `srcset` of that
  format's renditions, and the `<img>` with a `srcset` of the fallback
  format plus a `sizes` attribute matching the current mode's item width
  (04: table thumbnails up to 40% of the instance, thumb 16cqi, grid
  25cqi, masonry 20cqi, list 10vh, narrow layouts 100cqi). Without
  `renditions` a plain `<img>` is used. v2 had neither; its server chose
  one size per request from the `Save-Data` header, which servers MAY
  still honour.
- **HTML-66b** Animated media (entries with `animated: true` in the API:
  SVG with SMIL or CSS animation, multi-frame GIF, APNG or WebP) is shown
  still until the user plays it, and the media cell carries a badge: at
  Level 1+ a `button.eureka__badge--animated` with `data-action="play"`,
  `tabindex="-1"` (a pointer affordance; keyboard users have the row's
  Play action and KEY-31, so rows gain no tab stop), `aria-pressed` for
  the playing state and the name "Play {filename}" or "Pause {filename}",
  showing a play or pause glyph; at Level 0 a `span` with the play glyph
  and the hidden text "Animated". A double-click on the badge does not
  choose the item. At Level 1+ an animated SVG renders as `<object
  type="image/svg+xml" class="eureka__media-object" aria-hidden="true"
  tabindex="-1" data-animated data-playing="true|false">` with the `<img>`
  as fallback content; the element pauses or unpauses the document's SMIL
  and CSS animations to match `data-playing` (same-origin only; a
  cross-origin file plays by its own `prefers-reduced-motion` rule). A
  raster animation renders as `<span class="eureka__media-animated"
  data-playing>` holding the `<img>` and, while paused, a `<canvas
  class="eureka__media-still">` the element paints with the current
  frame. Playback is per item (the row's Play/Pause action, HTML-68, and
  KEY-31) or for every item through the toolbar's "Animate previews"
  switch (`input[name="eureka__animate"]`, persisted as `view.animate`,
  default off). Nothing autoplays, so a reduced-motion preference needs
  no special case here; files SHOULD still gate their own animation on
  `@media (prefers-reduced-motion: no-preference)` for every other
  context they are shown in. Level 0 renders the plain `<img>`.
- **HTML-66c** Text files (`.txt`, `.md`, `.json`, `.css`, `.js`, `.ts`,
  `.html`, `.xml`, `.yaml`, `.sh`, `.py` and the rest of the list in
  `@mrktps/eureka-core`'s `isTextLike`) preview as a rendered page of
  their first lines. The API supplies it: a text entry's
  `absolutePreviewURL`, when it differs from `absoluteURL`, is an image
  (the reference server renders an SVG at `/sources/{name}/__thumb/{path}`
  from the first 8 KB, cached by size and mtime, with an ETag). The media
  cell shows it as `<img class="eureka__media-text" alt="" loading="lazy"
  decoding="async" width="320" height="400">`; the row already names the
  file, so the image is decorative (WCAG 1.4.5 is satisfied by the file
  itself being one Expand away). Without a preview the cell shows the
  type icon and filename (`p.eureka__text-placeholder`). With
  `thumbnails: "client"` the element renders missing previews itself,
  in the worker, from a `Range` request for the file's first 8 KB,
  only once the row is near the viewport, at most four at a time, never
  under `prefers-reduced-data` or `saveData`, keeping the result as a
  small SVG blob rather than a bitmap; `thumbnails: "none"` shows icons
  only. The renderer is one module (`renderTextThumbnail`): the same SVG
  comes from the server, the worker, or a pipeline that writes
  thumbnails next to the files and points `absolutePreviewURL` at them,
  which is the shape for a bucket-backed source. Its colours follow
  `prefers-color-scheme` and forced colors from inside the SVG, and it
  carries a `<title>` ("Preview of {filename}") for direct viewing.
- **HTML-67** Name cell: the filename with a `<wbr>` after every 8
  characters so long names wrap. When renaming inline it becomes
  editable; Enter commits, Escape cancels, empty names are rejected.
- **HTML-68** Actions cell: a `role="toolbar"` labelled "Actions for
  {filename}" containing, in order and each only when allowed: Expand
  (link to `absoluteURL` with `target` set to the row's id, a named
  browsing context per item, so expanding the same item again reuses its
  tab instead of opening another; the name gets an `e` prefix in the
  unlikely case the id starts with `_`, which is reserved; no
  `rel="noopener"`, because a context opened with noopener is not
  familiar to the page and could not be found again by name), Play or
  Pause (button, animated items only, label by state; HTML-66b), Choose (button), Crop (button,
  raster images only), Rename (button), Delete (button, class
  `dangerous`), Download (link with `download` attribute). Each control's
  visible text is the verb and its accessible name is "{verb} {filename}".
  The toolbar is one tab stop (05 KEY-B2): at Level 1+ its first control
  has `tabindex="0"` and the others `tabindex="-1"`; ArrowLeft/ArrowRight
  move between them and move the tabindex along. (Until 3.0.0-alpha.1
  every control was a tab stop, which made tabbing through a listing
  slow.) The cell is `hidden` except for the focused row and rows containing
  focus (`:focus-within`), and in thumb/grid/masonry modes its contents
  are reachable via the path bar instead. v2 marked this group
  `role="listbox"` with `role="option"` children; v3 uses toolbar.
- **HTML-69** Dimensions cell: "{w}x{h}" or empty. File Size cell: a
  human readable size (`filesize` semantics, e.g. "95.7 KB"). Edited On
  cell: a `<time datetime="{ISO}">` with the short locale date and a
  `title` holding the long form with time zone.
- **HTML-70** Empty states replace the rows with a single row whose cell
  spans all columns and contains a `<p role="status">`:
  while fetching, "Hold tight while we fetch {cd}" with a spinner; with
  an active filter and no matches, "Uh oh. No results found for
  \"{filter}\"" followed by links "Try another search" (focuses the
  filter) and "clear the search filter"; otherwise "Directory \"{cd}\"
  appears to be empty." followed by a link "upload some files to {cd}"
  that opens the file picker. The `<tbody>` itself MUST NOT be a live
  region (v2 set `aria-live="polite"` on it, which announces every
  re-render).
- **HTML-71** Context menu (Level 1+, thumb, grid and masonry modes only:
  table and list show the row toolbar inline, HTML-68, and keep the
  browser's own menu): v2 rendered `<menu type="context">` per row; the
  API was removed from browsers and MUST NOT be rendered. v3 renders one `<div popover="manual" role="menu" id="{p}context-menu"
  class="eureka__context-menu">` per instance, after the dialogs, only
  while a row's menu is open, labelled "Actions for {filename}" and
  carrying `data-context-for="{path}"`. Its children are the row's
  actions (HTML-68, same order, same `allow*` gating) as
  `role="menuitem"` controls with `tabindex="-1"`: `<button>` for Choose,
  Crop, Rename and Delete, `<a>` for Expand and Download, each with the
  same `data-action`, `data-path`, `aria-keyshortcuts` and `<kbd>` hint
  as the toolbar (shown at full opacity in the menu). It opens on
  `contextmenu` over a row, placed at the pointer like a native menu and
  kept inside the viewport (class `eureka__context-menu--placed`, inline
  `left`/`top`), and on KEY-29 from a focused row, anchored to the row
  with CSS anchor positioning (the row carries `anchor-name` via class
  `eureka__context-anchor`) or placed under the row's start where
  anchoring is unsupported. Being `popover="manual"` it
  has no light dismiss; the element closes it on pointer down outside,
  on Escape and Tab (returning focus to the row), after any item acts,
  on resize, and when the row leaves the listing. Level 0 has no menu.

## 7. Path bar

- **HTML-80** When a row is focused or items are selected, a path bar
  renders between the listing and the choose bar with `role="status"`,
  id `{p}selected_file_names`. For a single item it shows a type icon and
  a link to `absoluteURL` whose text is `{directory}/{filename}`. For
  several selected items it shows the common directory and a read-only
  `<textarea>` labelled "Copy list of selected files" containing the
  filenames comma-separated; above 12 items the textarea sits inside a
  `<details open>` with summary "Selected Paths".
- **HTML-81** On narrow layouts the path bar additionally contains a
  `<details>` with the media preview and a copy of the actions toolbar
  (HTML-68), since the row's own actions cell is hidden in the stacked
  layout for non-table modes.

## 8. Choose bar and modals

- **HTML-90** The choose bar is a `<div class="eureka__button-bar
  eureka__choose-bar">` containing, in order: Cancel (button, class
  `dangerous`, visible text "Cancel", accessible name beginning with it
  and including "Close Media Browser"); when two or more
  items are selected and bulk download is allowed, a form posting to the
  attachments endpoint with hidden `cd`, `cs` and `zip_file[]` inputs and
  a submit "Download {n} items"; when two or more are selected and delete
  is allowed, a form with hidden `cd`, `cs`, `delete_file[]` and a submit
  "Delete {n} items" (class `dangerous`); and Choose (button, class
  `eureka__primary`, id `{p}choose-button`, `aria-describedby` the path
  bar). Choose is disabled until an item is focused or selected. Its
  text is "Choose" plus a visually-hidden object ("media item" or the
  filename) or, with several selected, "Choose {n} items".
- **HTML-91** Modals (create directory, rename, crop, confirm delete,
  shortcuts) are `<dialog>`
  elements opened with `showModal()`, with an `<h2>` title, a form, and
  Cancel plus a primary action button whose names include their object
  ("Create directory {name}", "Rename {old} to {new}"). While a dialog is
  open the rest of the instance is `inert`. v2 used a `div role="dialog"`
  plus `aria-hidden` on siblings and a scrim `div role="button"`; v3 uses
  the native dialog and Escape closes it.
- **HTML-95** Shortcuts dialog (05 KEY-A5): `<dialog class="eureka__modal
  eureka__shortcuts-modal">` titled "Keyboard Shortcuts", an introductory
  sentence, then one `<table class="eureka__shortcuts">` per scope with a
  `<caption>` ("Anywhere in the browser", "With an item focused"), each
  row a `<th scope="row">` description and a cell of `<kbd>` keys joined
  by "+", several chords separated by commas, runs of more than four
  chords shown as "first to last". A single Close button. Opened by the
  `?` binding or the "Keyboard Shortcuts" button beside the "Media Content"
  heading (`.eureka__heading > button.eureka__help-button[aria-haspopup="dialog"]`:
  the `keyboard` sprite icon, a visually-hidden label and a `title`), Level
  1+ only. The button rests knocked back and fades in on keyboard use (06
  A11Y-55); the root carries `data-keyboard="true"` while the instance is
  being driven from the keyboard.
- **HTML-96** Shortcut hints (Level 1+): controls whose action has a
  keymap binding carry `aria-keyshortcuts` with every chord ("Enter",
  "Alt+Shift+U", "Alt+Space") and end with `<kbd class="eureka__kbd"
  aria-hidden="true">` showing the first chord compactly ("⌥⇧U" on a Mac,
  "Alt+Shift+U" elsewhere; "Del", "Esc", arrows as glyphs). The hint is
  hidden from assistive technology so the accessible name stays the verb
  plus its object; the binding is exposed through `aria-keyshortcuts` and
  the shortcuts dialog. Hinted controls: the row's Expand, Choose, Rename
  and Delete; the upload control and the panel's upload and new-directory
  buttons; the filter (hint in its label); the panel toggle. Hints are
  not rendered until something in the instance has visible focus or the
  instance has seen keyboard use (never on hover, which would shift the
  control), rest knocked back under visible focus that did not come
  through the instance's own keys (the first Tab in from the page), come
  to full opacity with keyboard use (06 A11Y-55), and are not shown on
  narrow layouts.
- **HTML-92** Create directory form: a text input labelled "Create a new
  Directory in {cd}". Rename form: a text input labelled "New name"
  prefilled with the current name. Crop form: see 06 for its controls;
  it is Level 2.

## 9. Stable hooks (classes and ids)

Informative mapping used by the stylesheet. Hosts MAY style these.

| Hook | Element |
|---|---|
| `.eureka-root` | the mount element supplied by the host |
| `.eureka` | instance root (HTML-01) |
| `.eureka__browse-content` | wrapper of source panel + stage |
| `.eureka__pathbrowser` `#{p}pathbrowser` | source panel |
| `.eureka__media-source-selector`, `.eureka__tree`, `.eureka__drop-area`, `.eureka__drop-area-zone`, `.eureka__tree-bar` | source panel parts |
| `.eureka__stage`, `.eureka__stage__filter-view` | stage, stage header |
| `.eureka__choose-radio`, `.eureka__search-bar`, `.eureka__tree-toggle`, `.eureka__media-directory-selector`, `.eureka__sort-select`, `.eureka__upload-form`, `.eureka__layout-chooser`, `.eureka__icon-radio-btns` | header and toolbar parts |
| `.eureka__table-wrapper`, `.eureka__table` | listing |
| `.eureka__th-media`, `.eureka__th-filename`, `.eureka__th-actions`, `.eureka__th-dimensions`, `.eureka__th-file-size`, `.eureka__th-edited-on`, `.eureka__choose` (th and td) | header cells |
| `.eureka__td-media`, `.eureka__td-filename`, `.eureka__context-row`, `.eureka__dimensions`, `.eureka__file-size`, `.eureka__edited-on` | row cells |
| `.eureka__focused-media-item` | the focused row (v2 also toggled this by hand; v3 relies on `:focus-within`) |
| `.eureka__context-buttons`, `.eureka__button-bar` | action toolbars |
| `.eureka__pathbar`, `#{p}selected_file_names` | path bar |
| `.eureka__choose-bar`, `#{p}choose-button`, `.eureka__primary`, `.dangerous` | choose bar |
| `.eureka__modal`, `.eureka__modal-panel`, `.eureka__crop-modal` | dialogs |
| `.eureka__notification-wrapper`, `.eureka__sticky-bar`, `.eureka__dangerous` | notifications |
| `.visually-hidden` | screen-reader-only text |
| `svg.icon.icon-{name}` | inline SVG icons via `<use href="{sprite}#icon-{name}">`, always `aria-hidden="true"` |
