import { describe, it, expect } from 'vitest';
import { html, raw, escapeHtml, jsonForScript, renderLevel0, renderEnhanced, renderDocument, contextFromPage, instance, type PageInput } from '../src/index.js';

const t0 = Date.UTC(2017, 3, 2, 14, 25);
const file = (dir: string, filename: string, fileSize: number, dims?: [number, number], daysAgo = 0) => ({ filename, directory: dir, path: `${dir}/${filename}`, absoluteURL: `/sources/filesystem/${dir}/${encodeURIComponent(filename)}`, editedOn: t0 - daysAgo * 86400000, dimensions: dims, fileSize });
const input: PageInput = {
  sources: [{ id: 0, name: 'filesystem' }, { id: 1, name: 'cloud' }],
  source: { id: 0, name: 'filesystem' },
  path: 'assets/img',
  entries: [
    { foldername: 'redwoods', directory: 'assets/img/redwoods', path: 'assets/img/redwoods', absoluteURL: '/sources/filesystem/assets/img/redwoods', editedOn: t0, fileSize: 4096 },
    file('assets/img', 'schildpad.jpg', 37888, [336, 125], 1),
    file('assets/img', 'Wide Banner <final>.jpg', 98000, [2400, 400], 9),
    file('assets/img', 'archive.zip', 12000000)
  ],
  tree: [{ name: 'assets', cd: 'assets', children: [{ name: 'img', cd: 'assets/img', children: [{ name: 'redwoods', cd: 'assets/img/redwoods', children: [] }] }] }, { name: 'uploads', cd: 'uploads', children: [] }],
  lang: 'en-US', basePath: '/assets/components/eureka/', timeZone: 'UTC'
};

describe('html templating', () => {
  it('escapes interpolations and keeps raw', () => {
    expect(html`<b>${'<i>&"'}</b>`.value).toBe('<b>&lt;i&gt;&amp;&quot;</b>');
    expect(html`${raw('<i>')}${[1, 'a', null, false]}`.value).toBe('<i>1a');
    expect(escapeHtml("it's")).toBe('it&#39;s');
    expect(jsonForScript({ a: '</script>' }).value).toBe('{"a":"\\u003c/script>"}');
  });
});

describe('Level 0 render (03)', () => {
  const out = renderLevel0(input);
  it('is a multipart POST form with the hidden context fields', () => {
    expect(out).toMatch(/^<form class="eureka eureka__view-mode__table eureka__server-side" method="post" action="\/assets\/components\/eureka\/" enctype="multipart\/form-data"/);
    expect(out).toContain('<input type="hidden" name="eureka__mediaSourceId" value="0">');
    expect(out).toContain('<input type="hidden" name="eureka__upload-dir" value="assets/img">');
    expect(out).not.toContain('role="grid"'); // Level 0 is a plain table; the grid pattern needs the arrow keys (HTML-60)
    expect(out).not.toContain('listing-help');
  });
  it('renders the directory selector with every source and directory, current selected', () => {
    expect(out).toContain('name="eureka__media-browser_0__browsing"');
    expect(out).toContain('<optgroup label="filesystem" data-source="0">');
    expect(out).toContain('<option value="0||assets/img" selected>assets/img</option>');
    expect(out).toContain('<option value="1||/">./</option>');
    expect(out).toContain('>Set Directory</button>');
  });
  it('renders one radio per file, labelled by the filename cell, and no actions column', () => {
    expect(out.match(/type="radio" id="eureka__radio__[^"]+" name="eureka__chosen_item"/g)).toHaveLength(3);
    expect(out).toContain('<label for="eureka__radio__schildpad__002ejpg">schildpa<wbr>d.jpg</label>');
    expect(out).toContain('value="Wide Banner &lt;final&gt;.jpg"');
    expect(out).not.toContain('eureka__context-row');
    expect(out).not.toContain('eureka__th-actions');
  });
  it('carries the generated description and a time element', () => {
    expect(out).toContain('aria-label="schildpad.jpg displays at 336x125, weighs 37\u00a0KB, and was edited on Saturday, April 01, 2017 at Coordinated Universal Time"');
    expect(out).toContain('<time datetime="2017-04-01T14:25:00.000Z" title="Saturday, April 01, 2017 at Coordinated Universal Time">04/01/17</time>');
  });
  it('links images for expand with the filename in the name, and places non-images by icon', () => {
    expect(out).toContain('aria-label="Open schildpad.jpg in a new tab"');
    expect(out).toContain('<img src="/sources/filesystem/assets/img/schildpad.jpg" alt="" loading="lazy" decoding="async" width="336" height="125">');
    expect(out).toContain('icon-file-archive-o');
  });
  it('has the upload control naming its destination and the choose bar', () => {
    expect(out).toContain('name="eureka__uploadFiles" multiple>');
    expect(out).toMatch(/<label for="eureka__upload">Upload files<span class="visually-hidden"> to assets\/img<\/span>:<\/label>/);
    expect(out).toContain('>Cancel<span class="visually-hidden">: Close Media Browser</span></button>');
    expect(out).toContain('id="eureka__choose-button"');
    expect(out).toContain('name="eureka__action" value="choose"');
  });
  it('embeds hydration state', () => {
    const m = /<script type="application\/json" id="eureka__state">(.*?)<\/script>/s.exec(out)!;
    const state = JSON.parse(m[1]!);
    expect(state.listing).toMatchObject({ source: 0, path: 'assets/img' });
    expect(state.listing.entries).toHaveLength(4);
    expect(state.tree.bySource['0']).toHaveLength(2);
  });
  it('shows an upload notice', () => {
    expect(renderLevel0({ ...input, uploaded: ['a.png', 'b.png'] })).toContain('Uploaded 2 files to assets/img');
  });
});

describe('enhanced render (02)', () => {
  const out = renderEnhanced({ ...input, config: { callbacks: { choose: () => {}, close: () => {} } } });
  it('has the regions in order with the required roles and names', () => {
    const order = ['eureka__notification-wrapper', 'class="eureka__pathbrowser"', 'eureka__stage__filter-view', 'role="toolbar" aria-label="Listing controls"', 'class="eureka__table"', 'class="eureka__pathbar"', 'eureka__choose-bar'];
    let last = -1;
    for (const marker of order) { const i = out.indexOf(marker); expect(i, marker).toBeGreaterThan(last); last = i; }
    expect(out).toContain('role="region" aria-label="Media Browser"');
    expect(out).toContain('aria-label="Media Source Panel" hidden');
    expect(out).toMatch(/<table class="eureka__table" id="eureka__table" data-count="\d+" role="grid" aria-describedby="eureka__listing-help">/);
    expect(out).toContain('id="eureka__listing-help">Use the up and down arrow keys');
    expect(out).toContain('<nav class="eureka__tree" aria-label="Directories">');
    expect(out).toContain('aria-current="page"');
    expect(out).toContain('<caption class="visually-hidden" id="eureka__caption">Contents of assets/img, 3 items</caption>');
  });
  it('names controls by action and object', () => {
    expect(out).toContain('role="toolbar" aria-label="Actions for schildpad.jpg"');
    expect(out).toContain('>Choose<span class="visually-hidden"> schildpad.jpg</span><kbd class="eureka__kbd" aria-hidden="true">Enter</kbd></button>');
    expect(out).toContain('download="schildpad.jpg"');
    expect(out).not.toContain('Crop<span class="visually-hidden"> archive.zip');
    expect(out).toContain('<legend>Choose Items</legend>');
    expect(out).toContain('<label for="eureka__view-grid" title="Grid Layout">');
    expect(out).toContain('aria-expanded="false"');
  });
  it('uses a roving tabindex and sortable header buttons', () => {
    expect(out.match(/<tr[^>]*tabindex="0"/g)!.length).toBe(1); // the first row only; the root is a programmatic focus target (tabindex="-1")
    for (const toolbar of out.match(/<div class="eureka__button-bar eureka__context-buttons"[\s\S]*?<\/div>/g)!) expect(toolbar.match(/tabindex="0"/g)!.length).toBe(1); // one tab stop per toolbar (KEY-B2)
    expect(out).toMatch(/data-action="toggle-panel" aria-keyshortcuts="Control\+;">Toggle Source Panel<kbd class="eureka__kbd" aria-hidden="true">Ctrl\+;<\/kbd><\/button>/);
    expect(out).toContain('aria-label="Media Source Panel" hidden');
    expect(out).toMatch(/<table class="eureka__table" id="eureka__table" data-count="\d+" role="grid" aria-describedby="eureka__listing-help">/);
    expect(out).toContain('id="eureka__listing-help">Use the up and down arrow keys');
    expect(out).toContain('data-level="1" tabindex="-1"');
    expect(out).toContain('<th scope="col" class="eureka__th-filename" aria-sort="ascending">');
    expect(out).toContain('data-sort-by="fileSize" aria-pressed="false"');
  });
  it('renders the shortcuts reference from the keymap when that dialog is open', () => {
    const withDialog = renderEnhanced(input).replace(/$/, '');
    expect(withDialog).toContain('data-action="shortcuts" aria-haspopup="dialog"');
    const ctx = contextFromPage(input, 1);
    const open = instance({ ...ctx, state: { ...ctx.state, dialog: { kind: 'shortcuts' } } }).value;
    expect(open).toContain('<h2 id="eureka__dialog-title">Keyboard Shortcuts</h2>');
    expect(open).toContain('<caption>Anywhere in the browser</caption>');
    expect(open).toContain('<th scope="row">Rename the item</th><td><span class="eureka__chord"><kbd>F2</kbd></span></td>');
    expect(open).toContain('<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>S</kbd>');
    expect(open).toContain('<kbd>Alt</kbd>+<kbd>0</kbd></span> to <span class="eureka__chord"><kbd>Alt</kbd>+<kbd>9</kbd>');
    expect(open).not.toContain('Create a file'); // no createFile handler configured
    expect(open).not.toContain('context menu');
  });
  it('renders the request locale from a catalog and embeds it for the element (09 I18N-12)', () => {
    const catalog = { 'media.contents': '[Media Content]', 'listing.caption': '[Contents of {cd}]' };
    const out = renderLevel0({ ...input, lang: 'xx', catalog });
    expect(out).toContain('lang="xx"');
    expect(out).toContain('[Media Content]</h2>');
    expect(out).toContain('[Contents of assets/img]');
    expect(out).toContain('Dimensions'); // missing messages fall back to English (I18N-03)
    expect(out).toContain('<script type="application/json" id="eureka__catalog" lang="xx">{"media.contents":"[Media Content]"');
    expect(renderLevel0(input)).not.toContain('eureka__catalog'); // English needs no catalog
    expect(renderLevel0({ ...input, lang: 'nl' })).toContain('lang="en"'); // no catalog: the text is English, and says so
  });
  it('hints the shortcut on controls with a binding, hidden from AT, and exposes it as aria-keyshortcuts (HTML-96)', () => {
    const out = renderEnhanced(input);
    expect(out).toMatch(/data-action="choose"[^>]*aria-keyshortcuts="Enter"[^>]*>Choose<span class="visually-hidden"> schildpad\.jpg<\/span><kbd class="eureka__kbd" aria-hidden="true">Enter<\/kbd><\/button>/);
    expect(out).toMatch(/data-action="rename"[^>]*aria-keyshortcuts="F2"/);
    expect(out).toMatch(/data-action="delete"[^>]*aria-keyshortcuts="Delete Backspace"[^>]*>Delete<span class="visually-hidden"> schildpad\.jpg<\/span><kbd class="eureka__kbd" aria-hidden="true">Del<\/kbd>/);
    expect(out).toMatch(/data-action="expand"[^>]*aria-keyshortcuts="Alt\+Space"[^>]*>Expand<span class="visually-hidden"> schildpad\.jpg<\/span><kbd class="eureka__kbd" aria-hidden="true">Alt\+Space<\/kbd>/);
    expect(out).toMatch(/data-action="toggle-panel" aria-keyshortcuts="Control\+;">Toggle Source Panel<kbd class="eureka__kbd" aria-hidden="true">Ctrl\+;<\/kbd>/);
    expect(out).toMatch(/name="eureka__filter"[^>]*aria-keyshortcuts="Alt\+Shift\+S \/"/);
    expect(out).toMatch(/data-action="download"[^>]*aria-keyshortcuts="Alt\+Shift\+D"[^>]*>Download<span class="visually-hidden"> schildpad\.jpg<\/span><kbd class="eureka__kbd" aria-hidden="true">Alt\+Shift\+D<\/kbd>/);
    expect(out).not.toMatch(/data-action="crop"[^>]*aria-keyshortcuts/); // no binding, no hint
    expect(renderLevel0(input)).not.toContain('eureka__kbd');
    expect(renderLevel0(input)).not.toContain('aria-keyshortcuts');
  });
  it('renders the row context menu as a manual popover with the row actions when a target is set (HTML-71)', () => {
    const ctx = contextFromPage(input, 1);
    expect(instance(ctx).value).not.toContain('popover=');
    const open = instance({ ...ctx, contextMenu: { path: 'assets/img/schildpad.jpg' } }).value;
    expect(open).toContain('<div popover="manual" role="menu" id="eureka__context-menu" class="eureka__context-menu" aria-label="Actions for schildpad.jpg" data-context-for="assets/img/schildpad.jpg">');
    expect(open).toMatch(/<a role="menuitem" tabindex="-1" class="eureka__menuitem" data-action="expand" data-path="assets\/img\/schildpad\.jpg" aria-keyshortcuts="Alt\+Space" href="[^"]+" target="_blank" rel="noopener">/);
    expect(open).toMatch(/<button type="button" role="menuitem" tabindex="-1" class="eureka__menuitem dangerous" data-action="delete" data-path="assets\/img\/schildpad\.jpg" aria-keyshortcuts="Delete Backspace">/);
    expect(open).toContain('class="eureka__row eureka__context-anchor"');
    expect(open).toContain('<span class="eureka__menuitem-label">Rename<span class="visually-hidden"> schildpad.jpg</span></span><kbd class="eureka__kbd" aria-hidden="true">F2</kbd>');
    expect(instance({ ...contextFromPage(input, 0), contextMenu: { path: 'assets/img/schildpad.jpg' } }).value).not.toContain('popover='); // Level 0 has no menu
  });
  it('puts the shortcuts button beside the heading at Level 1 only', () => {
    expect(renderEnhanced(input)).toContain('Media Content</h2><button type="button" class="eureka__help-button"');
    expect(renderEnhanced(input)).toMatch(/eureka__help-button[^>]*title="Keyboard Shortcuts"><span class="visually-hidden">Keyboard Shortcuts<\/span><svg[^>]*class="icon icon-keyboard"/);
    expect(renderLevel0(input)).not.toContain('eureka__help-button');
  });
  it('does not render Level 0 fields or obsolete elements', () => {
    expect(out).not.toContain('eureka__chosen_item');
    expect(out).not.toContain('<menu');
    expect(out).not.toContain('role="listbox"'); // v2's listbox toolbars; role="grid" on the listing is intentional at Level 1+ (HTML-60)
    expect(out).not.toContain('role="menubar"');
  });
});

describe('document shell', () => {
  it('wraps the body with lang, stylesheet and scripts', () => {
    const doc = renderDocument({ lang: 'nl', body: '<p>x</p>', stylesheets: ['/a.css'], scripts: ['/e.js'] });
    expect(doc).toMatch(/^<!doctype html>\n<html lang="nl">/);
    expect(doc).toContain('<link rel="stylesheet" href="/a.css">');
    expect(doc).toContain('<div id="root" class="eureka-root"><p>x</p></div>');
    expect(doc).toContain('<script type="module" src="/e.js"></script>');
  });
});
