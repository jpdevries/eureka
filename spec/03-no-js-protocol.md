# 03. No-JS protocol (Level 0)

Status: draft, seeded from `fixtures/snapshots/v2-nojs-table.html` and
Eureka 2.0 `server.js`.

Without script, Eureka is one HTML form. Browse, upload and choose are
plain form submissions handled by the host server. This document is the
contract between that form and the server. Field names are literal and
stable: a server written against them in 2017 keeps working.

## The form

- **NOJS-01** The component root MUST be a `<form method="POST"
  enctype="multipart/form-data">` whose `action` is the configured
  `basePath`. (Enhanced implementations replace the form with a `<div>`;
  see HTML-01.)
- **NOJS-02** The root MUST carry the class `eureka eureka__server-side`
  and the current view mode class (`eureka__view-mode__table` by
  default). The server MAY render any mode class; only `table` and `list`
  are useful without script because the other modes depend on the
  enhanced focus behaviour.
- **NOJS-03** The `<html>` element MUST carry `lang`, and the form SHOULD
  repeat it as `lang` on the root when the component's language differs
  from the page's.

## Fields

`{p}` is the instance prefix, default `eureka__`. `{uid}` is the instance
id, default `0`. Eureka 2.0 used the literal prefix `eureka__` for every
field regardless of configuration; v3 servers MUST accept the literal
names and MAY accept prefixed ones.

| Field name | Control | Value | Required |
|---|---|---|---|
| `eureka__mediaSourceId` | hidden | current media source id | NOJS-10 MUST |
| `eureka__upload-dir` | hidden | current directory path, relative to the source root, no leading slash, `/` for root | NOJS-11 MUST |
| `eureka__media-browser_{uid}__browsing` | `<select>` | `{sourceId}||{directory}`; one `<optgroup label="{source name}">` per source, one `<option>` per directory the server knows about, root rendered as `./` with value `{sourceId}||/`; the current directory is `selected` | NOJS-12 MUST |
| `eureka__uploadFiles` | `<input type="file" multiple>` | files to upload into `eureka__upload-dir` of `eureka__mediaSourceId` | NOJS-13 MUST when uploads are allowed |
| `eureka__chosen_item` | one `<input type="radio">` per listed file | the item's `filename` | NOJS-14 MUST when choosing is allowed |

- **NOJS-15** The browsing `<select>` MUST have a visible `<label>`
  ("Browse Directory") and a submit button ("Set Directory") so a change of
  directory can be submitted without script.
- **NOJS-16** The file input MUST have a visible `<label>` whose text
  names the destination directory ("Upload files to assets/img") and its
  own submit button ("Upload files").
- **NOJS-17** Each radio MUST be labelled by the row's filename cell
  (`<label for>` on the filename) and additionally described by the
  media cell (`aria-describedby`), so a screen reader hears the filename
  and the generated description when the radio is focused.
- **NOJS-18** The choose bar MUST contain a primary submit button
  ("Choose") and a "Cancel" button. Cancel without script is a plain
  button; the host decides what it does (typically nothing, or a link back
  to the host page if rendered as `<a>`).
- **NOJS-19** The media cell of an image row MUST wrap the image in a link
  to `absoluteURL` opening in a new browsing context, so "expand" works
  without script. Non-image rows show a type icon and the URL as text.
- **NOJS-20** The source panel, tree, filter, sort controls, view chooser,
  context actions and modals MUST NOT be rendered in the Level 0 form.
  They have no synchronous equivalent. Sorting and filtering MAY be
  offered as plain links (`GET ?sort=filename&dir=ascending`) in v3; this
  is optional and not part of the v2 protocol.

## Server semantics on POST

The server receives one multipart body and decides what happened by which
fields are present, in this order:

- **NOJS-30 Upload.** If `eureka__uploadFiles` contains one or more files,
  the server MUST store them in `eureka__upload-dir` of
  `eureka__mediaSourceId`, then continue with the steps below (a user may
  upload and choose in one submission; in practice browsers submit one
  button, so upload is followed by a re-render).
- **NOJS-31 Choose.** If `eureka__chosen_item` is present, the user chose
  that file in the directory named by `eureka__upload-dir`. The server
  MUST complete the choice in whatever way the host defines (the v2 demo
  renders a confirmation page; a CMS would store the value and redirect
  back to the editing form).
- **NOJS-32 Navigate.** Otherwise the server MUST parse
  `eureka__media-browser_{uid}__browsing` as `{sourceId}||{directory}`
  (split on the first `||`), and re-render the form for that source and
  directory with HTTP 200.
- **NOJS-33** Rendering after any POST MUST produce the same markup the
  initial GET would produce for that state, so the page can be enhanced
  identically whether reached by GET or POST.
- **NOJS-34** The server MUST escape filenames and directory names it
  echoes into attributes and text.

## Hydration contract

- **NOJS-40** The enhanced implementation MUST be able to take the Level 0
  markup as its initial DOM and upgrade it in place without a flash of
  empty content. The order of controls in the no-JS form therefore matches
  the enhanced layout (HTML-0x region order), and ids follow the same rules
  (HTML-9x).
- **NOJS-41** State that the server already knows (current source,
  directory, listing, tree) SHOULD be embedded for the enhanced layer so
  it does not refetch on load. v3 embeds it as a `<script type="application/json" id="{p}state">`
  block following the schema in `schema/state.json`. v2 relied on
  `localStorage` instead; both are acceptable, embedding is preferred.
  When the page locale is not English the server also embeds the catalog
  it rendered with as `<script type="application/json" id="{p}catalog"
  lang="{tag}">` (09 I18N-12).
