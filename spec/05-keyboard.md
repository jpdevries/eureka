# 05. Keyboard

Status: draft. The binding table is normative data in
[`data/keymap.json`](data/keymap.json); this document states the rules
around it.

## 1. Bindings

- **KEY-A1** Implementations MUST import `data/keymap.json` and honour
  every binding whose `when` condition holds. Hosts MAY override
  individual bindings through configuration; an override replaces the
  `keys` array for that action.
- **KEY-A2** Instance-scoped bindings fire only when focus is inside the
  instance root. Row-scoped bindings fire only when a listing row, or a
  control inside its actions toolbar, has focus. Nothing is bound on
  `document` or `window`. v2 bound every shortcut globally through
  Mousetrap and additionally bound Enter, Backspace, Alt+Space and Ctrl+R
  once per mounted row; v3 binds once per instance.
- **KEY-A3** Bindings MUST NOT fire while focus is in a text input,
  textarea, contenteditable or `<select>`, except `Escape` and the
  explicit `focusFilter` chord.
- **KEY-A4** The v2 Control-based chords (`ctrl+f`, `ctrl+n`, `ctrl+u`,
  `ctrl+r`, `ctrl+shift+n`) collide with browser commands on Windows and
  Linux. v3 defaults move them to `Alt+Shift` and `F2` as listed in the
  data file. A host MAY restore the v2 chords for macOS-only audiences.
- **KEY-A5** A shortcuts reference MUST be reachable from the UI and
  generated from the same data file, so overrides (KEY-A1) show up in it.
  v3: the `?` binding (KEY-15, not in text fields) and a "Keyboard
  Shortcuts" button (keyboard icon) beside the "Media Content" heading open a dialog (02 HTML-95) listing
  every active binding under "Anywhere in the browser" and "With an item
  focused", with the toolbar movement of KEY-B2 appended; bindings for
  features the host turned off, and `when`-conditional bindings whose
  condition does not hold, are left out. The welcome notification ends
  with "Press ? for keyboard shortcuts." Controls with a binding also show
  it inline (02 HTML-96). Modifier names follow the platform (Option on a
  Mac).

## 2. Focus management

- **KEY-B1** The listing rows form one tab stop with a roving tabindex
  (02 HTML-63). ArrowDown/ArrowUp move between rows, Home/End to the
  first/last row. Moving focus to a row updates the focused item in
  state (and therefore the path bar and the Choose button). This is the
  WAI-ARIA grid pattern, so the listing is exposed as a grid at Level 1+
  (HTML-60) and carries a one-sentence description of these keys. v2 gave
  every row `tabindex="0"`; v3 trades Tab-per-row for the arrow keys so a
  5,000-item listing stays one stop.
- **KEY-B2** From a focused row, Tab moves into that row's actions
  toolbar (when visible), then out of the listing. The toolbar is a single
  tab stop with a roving tabindex: ArrowLeft/ArrowRight move between its
  controls (wrapping), Home/End to the first/last control. As in a grid,
  ArrowRight on the row itself moves into the first control and ArrowLeft
  on the first control returns to the row; ArrowUp/ArrowDown from a
  control move to the adjacent row. Shift+Tab reverses. So a listing costs at most two tab stops
  (the current row and its toolbar) however many rows and actions it has;
  every toolbar action also has a row-scoped shortcut (KEY-20..23).
- **KEY-B3** After an item is deleted, focus moves to the row that took
  its place (the next row, or the previous one for the last row, or the
  empty-state message when none remain).
- **KEY-B4** After a rename, focus returns to the renamed row. After a
  directory change, focus stays on the control that caused it (the
  directory selector, a tree button, a tree bar button) and the first row
  becomes the listing's tab stop; the item focus in state is cleared, so
  the path bar empties and Choose is disabled until a row is focused. (An
  earlier draft moved focus to the first row; that made every navigation
  also a selection and pulled focus away from the tree.)
- **KEY-B5** Opening a dialog moves focus into it; closing it returns
  focus to the control that opened it (native `<dialog>` behaviour).
  Escape closes the topmost dialog.
- **KEY-B6** Activating "Try another search" focuses the filter;
  activating "upload some files" opens the file picker; activating the
  source panel toggle leaves focus on the toggle.
- **KEY-B9** The row menu (KEY-29, Shift+F10 or the ContextMenu key;
  right-click does the same) exists in the thumb, grid and masonry modes,
  where the row toolbar is not shown (HTML-71); in table and list the
  toolbar is one ArrowRight away and the binding does nothing. It opens
  with focus on the first item;
  ArrowUp/ArrowDown move with wrap, Home/End jump, a letter moves to the
  next item starting with it, Enter and Space activate, Escape and Tab
  close and return focus to the row. An item that opens a dialog returns
  focus to the row when the dialog closes (KEY-B5 treats the row as the
  opener).
- **KEY-B8** Download (KEY-30, `Alt+Shift+D`, when `allowDownload`)
  activates the focused row's Download link, so the browser's own
  download handling applies (the `download` attribute, HTML-68).
- **KEY-B10** Expand (KEY-21) opens the item in the row's named browsing
  context, the same name the Expand link targets (02 HTML-68), so the
  keyboard and the link share one tab per item.
- **KEY-B7** Double-click or double-tap on a media cell chooses the item;
  Enter on the focused row does the same. There MUST be no action that
  is available only by double-click.

## 3. Visible focus

- **KEY-C1** Every focusable element has a visible focus indicator with
  at least 3:1 contrast against adjacent colours in every theme (08),
  including forced-colors mode where the system `Highlight` colour is
  used. v2 relied on `outline: 1px solid var(--active)`; v3 uses
  `:focus-visible` and a 2px outline with offset.
