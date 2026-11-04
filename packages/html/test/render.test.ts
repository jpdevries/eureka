import { describe, it, expect } from 'vitest';
import { reduce } from '@mrktps/eureka-core';
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

describe('single-mode selection and the tile menu (07 STATE-11, 02 HTML-63, HTML-71a)', () => {
  const entries: PageInput['entries'] = [
    { filename: 'a.png', directory: '/', path: 'a.png', absoluteURL: '/s/a.png', editedOn: 0, fileSize: 1 },
    { filename: 'b.png', directory: '/', path: 'b.png', absoluteURL: '/s/b.png', editedOn: 0, fileSize: 1 }
  ];
  const input: PageInput = { sources: [{ id: 0, name: 's' }], source: { id: 0, name: 's' }, path: '/', entries, tree: [], lang: 'en', basePath: '/' };
  it('every file row carries aria-selected; the selected one is true and the choose bar names it', () => {
    const ctx = contextFromPage({ ...input, config: { callbacks: { choose: () => {} } } }, 1);
    ctx.state = reduce(reduce(ctx.state, { type: 'selection/focus', path: 'a.png' }), { type: 'selection/select', path: 'b.png' });
    const out = instance(ctx).value;
    expect(/<tr[^>]*data-path="a\.png"[^>]*>/.exec(out)![0]).toContain('aria-selected="false"');
    expect(/<tr[^>]*data-path="b\.png"[^>]*>/.exec(out)![0]).toContain('aria-selected="true"');
    expect(/<button[^>]*id="eureka__choose-button"[^>]*>[\s\S]*?<\/button>/.exec(out)![0]).toContain('b.png'); // Choose commits the selected item, not the focused one
    expect(out).toContain('data-choose="single"');
  });
  it('each file tile has a menu button; only the focused row\'s is in the tab order; Level 0 has none', () => {
    const ctx = contextFromPage(input, 1);
    ctx.state = reduce(ctx.state, { type: 'selection/focus', path: 'b.png' });
    const out = instance(ctx).value;
    const menus = [...out.matchAll(/<button[^>]*class="eureka__tile-menu"[^>]*>/g)].map((m) => m[0]);
    expect(menus).toHaveLength(2);
    expect(menus[0]).toContain('data-path="a.png"'); expect(menus[0]).toContain('tabindex="-1"');
    expect(menus[1]).toContain('data-path="b.png"'); expect(menus[1]).toContain('tabindex="0"'); expect(menus[1]).toContain('aria-haspopup="menu"'); expect(menus[1]).toContain('aria-label="Actions for b.png"');
    expect(renderLevel0(input)).not.toContain('eureka__tile-menu');
  });
});

describe('folders as items (02 HTML-62, 03 NOJS-32a)', () => {
  const entries: PageInput['entries'] = [
    { filename: 'pic.png', directory: 'photos', path: 'photos/pic.png', absoluteURL: '/s/photos/pic.png', editedOn: 0, fileSize: 1 },
    { foldername: 'trips', directory: 'photos/trips', path: 'photos/trips', absoluteURL: '/s/photos/trips', editedOn: 1700000000000, fileSize: 0 }
  ];
  const input: PageInput = { sources: [{ id: 0, name: 's' }], source: { id: 0, name: 's' }, path: 'photos', entries, tree: [], lang: 'en', basePath: '/' };
  it('Level 0: the folder row comes first and its tile is a submit button carrying eureka__open', () => {
    const out = renderLevel0(input);
    const rows = [...out.matchAll(/<tr [^>]*data-path="([^"]+)"[^>]*data-kind="([^"]+)"/g)].map((m) => [m[1], m[2]]);
    expect(rows).toEqual([['photos/trips', 'folder'], ['photos/pic.png', 'image']]);
    const folder = /<tr[^>]*data-kind="folder"[^>]*>[\s\S]*?<\/tr>/.exec(out)![0];
    expect(folder).toContain('aria-label="trips, folder"');
    expect(folder).toContain('<button type="submit" class="eureka__folder-tile" name="eureka__open" value="0||photos/trips" aria-label="Open folder trips">');
    expect(folder).not.toContain('type="radio"'); expect(folder).not.toContain('eureka__chosen');
    expect(out).toContain('data-count="1"'); // files only
  });
  it('Level 1: the tile navigates, the toolbar offers Open, Rename and Delete only, and a read-only source drops the last two', () => {
    const out = renderEnhanced(input);
    const folder = /<tr[^>]*data-kind="folder"[^>]*>[\s\S]*?<\/tr>/.exec(out)![0];
    expect(folder).toContain('data-action="navigate" data-cd="photos/trips"');
    expect(folder).toContain('tabindex="0"'); // first row: the roving tab stop
    const actions = [...folder.matchAll(/data-action="([^"]+)"/g)].map((m) => m[1]);
    expect(actions).toEqual(['navigate', 'navigate', 'rename', 'delete']); // the tile and the Open button both navigate
    expect(folder).not.toContain('chooseItem'); expect(folder).not.toContain('download');
    const ro = renderEnhanced({ ...input, sources: [{ id: 0, name: 's', capabilities: { rename: false, delete: false } }], source: { id: 0, name: 's', capabilities: { rename: false, delete: false } } });
    const roFolder = /<tr[^>]*data-kind="folder"[^>]*>[\s\S]*?<\/tr>/.exec(ro)![0];
    expect([...roFolder.matchAll(/data-action="([^"]+)"/g)].map((m) => m[1])).toEqual(['navigate', 'navigate']);
    const off = renderEnhanced({ ...input, config: { listFolders: false } });
    expect(off).not.toContain('data-kind="folder"');
  });
});

describe('documents and videos (02 HTML-66d)', () => {
  const page = (entries: PageInput['entries']) => renderLevel0({ sources: [{ id: 0, name: 's' }], source: { id: 0, name: 's' }, path: '/', entries, tree: [], lang: 'en', basePath: '/' });
  it('a PDF with a preview is a lazy image, without one the icon; never an inline viewer', () => {
    const withPreview = page([{ filename: 'deck.pdf', directory: '/', path: 'deck.pdf', absoluteURL: '/s/deck.pdf', absolutePreviewURL: '/s/__preview/deck.pdf', editedOn: 0, fileSize: 9, renditions: [{ url: '/s/__preview/deck.pdf?w=220', width: 220, type: 'image/jpeg' }] }]);
    expect(withPreview).not.toContain('<object'); expect(withPreview).not.toContain('application/pdf');
    const img = /<img class="eureka__media-preview eureka__media-pdf"[^>]*>/.exec(withPreview)![0];
    expect(img).toContain('loading="lazy"'); expect(img).toContain('src="/s/__preview/deck.pdf"'); expect(img).toContain('srcset="/s/__preview/deck.pdf?w=220 220w"');
    const without = page([{ filename: 'deck.pdf', directory: '/', path: 'deck.pdf', absoluteURL: '/s/deck.pdf', absolutePreviewURL: '/s/deck.pdf', editedOn: 0, fileSize: 9 }]);
    expect(without).not.toContain('<object'); expect(without).toContain('eureka__pdf-placeholder'); expect(without).toContain('deck.pdf</span>');
  });
  it('an image the browser cannot decode is a skeleton tile in its own proportions, never an <img> of the original (HTML-66e)', () => {
    const tiff = page([{ filename: 'scan.tif', directory: '/', path: 'scan.tif', absoluteURL: '/s/scan.tif', absolutePreviewURL: '/s/scan.tif', editedOn: 0, fileSize: 9, dimensions: [4000, 3000] }]);
    expect(tiff).not.toContain('<img'); expect(tiff).toContain('class="eureka__file-placeholder eureka__media-skeleton" style="--eureka-media-ratio: 4000 / 3000"');
    const previewed = page([{ filename: 'scan.tif', directory: '/', path: 'scan.tif', absoluteURL: '/s/scan.tif', absolutePreviewURL: '/s/__preview/scan.tif', editedOn: 0, fileSize: 9, dimensions: [4000, 3000] }]);
    expect(previewed).toContain('<img src="/s/__preview/scan.tif"'); expect(previewed).not.toContain('eureka__media-skeleton');
    const paged = page([{ filename: 'scan.tif', directory: '/', path: 'scan.tif', absoluteURL: '/s/scan.tif', absolutePreviewURL: '/s/scan.tif', editedOn: 0, fileSize: 9, dimensions: [4000, 3000], pages: 3 }]);
    expect(paged).toContain('<td class="eureka__dimensions">4000x3000 <small class="eureka__pages">3 pages</small></td>'); // a multi-page original (11 MS-76)
    expect(tiff).not.toContain('eureka__pages');
  });
  it('a video takes a poster and preload="none" only when the source offers a preview', () => {
    const posterless = page([{ filename: 'clip.mp4', directory: '/', path: 'clip.mp4', absoluteURL: '/s/clip.mp4', editedOn: 0, fileSize: 9 }]);
    expect(/<video[^>]*>/.exec(posterless)![0]).toContain('preload="metadata"'); expect(posterless).not.toContain('poster=');
    const withPoster = page([{ filename: 'clip.mp4', directory: '/', path: 'clip.mp4', absoluteURL: '/s/clip.mp4', absolutePreviewURL: '/s/__preview/clip.mp4', editedOn: 0, fileSize: 9 }]);
    const video = /<video[^>]*>/.exec(withPoster)![0];
    expect(video).toContain('poster="/s/__preview/clip.mp4"'); expect(video).toContain('preload="none"'); expect(withPoster).toContain('<source src="/s/clip.mp4">');
  });
});

describe('renditions (02 HTML-66a)', () => {
  it('puts modern formats in <source> and the last-listed format in the fallback <img> srcset', () => {
    const entry = { filename: 'big.tif', directory: '/', path: 'big.tif', absoluteURL: '/s/big.tif', absolutePreviewURL: '/s/__preview/big.tif', editedOn: 0, fileSize: 1, dimensions: [3000, 2000] as [number, number],
      renditions: [{ url: '/p?w=220&f=webp', width: 220, type: 'image/webp' }, { url: '/p?w=220&f=jpeg', width: 220, type: 'image/jpeg' }, { url: '/p?w=440&f=jpeg', width: 440, type: 'image/jpeg' }] };
    const out = renderLevel0({ sources: [{ id: 0, name: 's' }], source: { id: 0, name: 's' }, path: '/', entries: [entry], tree: [], lang: 'en', basePath: '/' });
    const source = /<source[^>]*>/.exec(out)![0];
    expect(source).toContain('type="image/webp"'); expect(source).toContain('f=webp 220w'); expect(source).not.toContain('f=jpeg');
    const img = /<img[^>]*big\.tif[^>]*>/.exec(out)![0];
    expect(img).toContain('f=jpeg 220w'); expect(img).toContain('f=jpeg 440w'); expect(img).not.toContain('f=webp');
    const jpegOnly = renderLevel0({ sources: [{ id: 0, name: 's' }], source: { id: 0, name: 's' }, path: '/', entries: [{ ...entry, renditions: entry.renditions.slice(1) }], tree: [], lang: 'en', basePath: '/' });
    expect(jpegOnly).not.toContain('<picture>'); // one format: a plain <img srcset>
    expect(/<img[^>]*big\.tif[^>]*>/.exec(jpegOnly)![0]).toContain('srcset=');
  });
});

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
    expect(out.match(/type="radio" id="eureka__row__[^"]+__radio" name="eureka__chosen_item"/g)).toHaveLength(3);
    expect(out).toContain('<label for="eureka__row__schildpad__002ejpg__radio">schildpa<wbr>d.jpg</label>');
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
    expect(open).toMatch(/<a role="menuitem" tabindex="-1" class="eureka__menuitem" data-action="expand" data-path="assets\/img\/schildpad\.jpg" aria-keyshortcuts="Alt\+Space" href="[^"]+" target="eureka__row__schildpad__002ejpg">/);
    expect(open).not.toContain('rel="noopener"');
    expect(open).toMatch(/<button type="button" role="menuitem" tabindex="-1" class="eureka__menuitem dangerous" data-action="delete" data-path="assets\/img\/schildpad\.jpg" aria-keyshortcuts="Delete Backspace">/);
    expect(open).toContain('class="eureka__row eureka__context-anchor"');
    expect(open).toContain('<span class="eureka__menuitem-label">Rename<span class="visually-hidden"> schildpad.jpg</span></span><kbd class="eureka__kbd" aria-hidden="true">F2</kbd>');
    expect(instance({ ...contextFromPage(input, 0), contextMenu: { path: 'assets/img/schildpad.jpg' } }).value).not.toContain('popover='); // Level 0 has no menu
  });
  it('names everything in a row by appending to the row id, and Expand targets that name (HTML-64, HTML-68)', () => {
    const out = renderEnhanced(input);
    expect(out).toContain('<tr id="eureka__row__schildpad__002ejpg"');
    expect(out).toContain('id="eureka__row__schildpad__002ejpg__media"');
    expect(out).toContain('id="eureka__row__schildpad__002ejpg__filename"');
    expect(out).toMatch(/<a class="button eureka__action" id="eureka__row__schildpad__002ejpg__expand" href="[^"]+" target="eureka__row__schildpad__002ejpg" data-action="expand"/);
    const ctx = contextFromPage(input, 1);
    const focused = instance({ ...ctx, state: { ...ctx.state, selection: { ...ctx.state.selection, focused: 'assets/img/schildpad.jpg' } } }).value;
    expect(focused).toContain('id="eureka__row__schildpad__002ejpg__pathbar-expand"');
    expect(out).not.toContain('target="_blank"');
    expect(renderLevel0(input)).toContain('id="eureka__row__schildpad__002ejpg__radio"');
  });
  it('shows animated media still until played, with a badge and a Play action (HTML-66b)', () => {
    const anim = { ...input, entries: input.entries.map((e) => (e.filename === 'schildpad.jpg' ? { ...e, filename: 'loop.svg', path: 'assets/img/loop.svg', absoluteURL: '/x/loop.svg', animated: true } : e)) };
    const out = renderEnhanced(anim);
    expect(out).toMatch(/<object class="eureka__media-object" data="[^"]+" type="image\/svg\+xml" aria-hidden="true" tabindex="-1" data-animated data-playing="false" width="336" height="125" style="aspect-ratio: 336 \/ 125"><img /);
    expect(out).toMatch(/<button type="button" class="eureka__badge eureka__badge--animated" data-action="play" data-path="assets\/img\/loop\.svg" tabindex="-1" aria-pressed="false" aria-label="Play loop\.svg"><svg[^>]*class="icon icon-caret-right"/);
    expect(out).toMatch(/data-action="play"[^>]*aria-keyshortcuts="Alt\+P"[^>]*>Play<span class="visually-hidden"> loop\.svg<\/span><kbd class="eureka__kbd" aria-hidden="true">Alt\+P<\/kbd>/);
    const ctx = contextFromPage(anim, 1);
    const playing = instance({ ...ctx, playing: new Set(['assets/img/loop.svg']) }).value;
    expect(playing).toContain('data-playing="true"');
    expect(playing).toMatch(/data-action="play"[^>]*>Pause</);
    expect(playing).toMatch(/eureka__badge--animated"[^>]*aria-pressed="true" aria-label="Pause loop\.svg"><svg[^>]*class="icon icon-pause"/);
    expect(instance(ctx).value).not.toContain('eureka__animate'); // no listing-wide switch: playback is per item
    const gif = renderEnhanced({ ...input, entries: input.entries.map((e) => (e.filename === 'schildpad.jpg' ? { ...e, filename: 'loop.gif', path: 'assets/img/loop.gif', absoluteURL: '/x/loop.gif', animated: true } : e)) });
    expect(gif).toMatch(/<span class="eureka__media-animated" data-playing="false"[^>]*><img [^>]+><canvas class="eureka__media-still" aria-hidden="true"/);
    expect(renderLevel0(anim)).not.toContain('<object'); // Level 0: the plain image
    expect(renderLevel0(anim)).toContain('<span class="eureka__badge eureka__badge--animated">');
  });
  it('shows text files as rendered previews when the API supplies one, the icon otherwise (HTML-66c)', () => {
    const asText = (preview?: string) => ({ ...input, entries: input.entries.map((e) => (e.filename === 'schildpad.jpg' ? { ...e, filename: 'notes.txt', path: 'assets/img/notes.txt', absoluteURL: '/x/notes.txt', absolutePreviewURL: preview ?? '/x/notes.txt', dimensions: undefined } : e)) });
    const withPreview = asText('/sources/x/__thumb/assets/img/notes.txt');
    expect(renderEnhanced(withPreview)).toContain('<img class="eureka__media-text" src="/sources/x/__thumb/assets/img/notes.txt" alt="" loading="lazy" decoding="async" width="320" height="400">');
    expect(renderLevel0(withPreview)).toContain('class="eureka__media-text"'); // Level 0 shows it too
    const plain = renderEnhanced(asText()); // previews as itself: no image, the icon
    expect(plain).toMatch(/<p class="eureka__file-placeholder eureka__text-placeholder">.*notes\.txt/);
    expect(plain).not.toContain('data-text-path');
    const clientInput = { ...asText(), config: { ...(input.config ?? {}), thumbnails: 'client' as const } };
    expect(renderEnhanced(clientInput)).toContain('data-text-path="assets/img/notes.txt"');
    const ctx = contextFromPage(clientInput, 1);
    expect(instance({ ...ctx, textThumbnails: new Map([['assets/img/notes.txt', 'blob:x']]) }).value).toContain('class="eureka__media-text" src="blob:x"');
    expect(renderEnhanced({ ...withPreview, config: { ...(input.config ?? {}), thumbnails: 'none' as const } })).not.toContain('eureka__media-text');
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
