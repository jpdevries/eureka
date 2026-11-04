// One listing row (02 HTML-62..69).
import { browserDecodes, extname, iconForExtension, isCroppable, mediaKind, selectIsChecked, selectRecord, type FileEntry, selectCan, type FolderEntry } from '@mrktps/eureka-core';
import { attr, classes, html, raw, type Raw } from '../html.js';
import type { Ctx } from '../model.js';
import { hidden, icon } from './icon.js';
import { kbdHint, keyshortcuts } from './kbd.js';

const IMAGE_SIZES: Record<string, string> = { table: '(min-width: 40em) 40cqi, 100cqi', list: '10vh', thumb: '(min-width: 40em) 16cqi, 42cqi', grid: '(min-width: 40em) 25cqi, 100cqi', masonry: '(min-width: 40em) 20cqi, 100cqi' };

/** Break long filenames every 8 characters with <wbr> (HTML-67). */
export function breakableName(name: string): Raw {
  const parts: string[] = [];
  for (let i = 0; i < name.length; i += 8) parts.push(name.slice(i, i + 8));
  return raw(parts.map((p) => html`${p}`.value).join('<wbr>'));
}

/** Is this animated item playing? Only when the user asked for it (02 HTML-66b): nothing plays by default. */
export function isPlaying(ctx: Ctx, item: FileEntry): boolean { return !!item.animated && ctx.level > 0 && !!ctx.playing?.has(item.path); }

export function media(ctx: Ctx, item: FileEntry, { controls = true, width, height }: { controls?: boolean; width?: number; height?: number } = {}): Raw {
  const { t, state, level } = ctx;
  const kind = mediaKind(item.filename);
  const src = item.absolutePreviewURL || item.absoluteURL;
  const alt = item.alt ?? '';
  const dims = item.dimensions ? attr('width', item.dimensions[0]).value + attr('height', item.dimensions[1]).value : '';
  switch (kind) {
    case 'image': {
      const rends = item.renditions ?? [];
      // an original the browser cannot decode (TIFF) never becomes an <img>: the row keeps the item's shape as a skeleton tile (HTML-66e)
      if (!rends.length && (!item.absolutePreviewURL || item.absolutePreviewURL === item.absoluteURL) && !browserDecodes(item.filename)) return skeleton(ctx, item);
      // the <img> carries the fallback format: the last type listed (hosts list modern formats first, HTML-66a)
      const fallbackType = rends.length ? rends[rends.length - 1]!.type : undefined;
      const img = html`<img src="${src}" alt="${alt}" loading="lazy" decoding="async"${raw(dims)}${rends.length ? attr('sizes', IMAGE_SIZES[state.view.mode] ?? '100cqi') : ''}${rends.length ? attr('srcset', rends.filter((r) => !r.type || r.type === fallbackType).map((r) => `${r.url} ${r.width}w`).join(', ')) : ''}>`;
      if (item.animated && level > 0) { // still until played (02 HTML-66b); the element pauses or plays what the markup declares
        const playing = isPlaying(ctx, item);
        const ratio = item.dimensions ? ` style="aspect-ratio: ${item.dimensions[0]} / ${item.dimensions[1]}"` : '';
        if (extname(item.filename) === '.svg') return html`<object class="eureka__media-object" data="${src}" type="image/svg+xml" aria-hidden="true" tabindex="-1" data-animated data-playing="${String(playing)}"${raw(dims)}${raw(ratio)}>${img}</object>`;
        return html`<span class="eureka__media-animated" data-playing="${String(playing)}"${raw(ratio)}>${img}${playing ? '' : html`<canvas class="eureka__media-still" aria-hidden="true"${raw(dims)}></canvas>`}</span>`;
      }
      if (!rends.length) return img;
      const byType = new Map<string, typeof rends>();
      for (const r of rends) { const k = r.type ?? 'fallback'; byType.set(k, [...(byType.get(k) ?? []), r]); }
      const sources = [...byType.entries()].filter(([type]) => type.startsWith('image/') && (type === 'image/avif' || type === 'image/webp'))
        .map(([type, rs]) => html`<source type="${type}" sizes="${IMAGE_SIZES[state.view.mode] ?? '100cqi'}" srcset="${rs.map((r) => `${r.url} ${r.width}w`).join(', ')}">`);
      if (!sources.length) return img; // one format: a plain <img srcset> (HTML-66a)
      return html`<picture>${sources}${img}</picture>`;
    }
    case 'video': { // a poster from the source's preview route when it has one; the file's header is fetched only then (HTML-66d)
      const poster = item.absolutePreviewURL && item.absolutePreviewURL !== item.absoluteURL ? item.absolutePreviewURL : null;
      return html`<video${attr('width', width ?? 320)}${attr('height', height ?? 240)}${attr('controls', controls)}${attr('poster', poster)} preload="${poster ? 'none' : 'metadata'}"><source src="${item.absoluteURL}">${t('support.noVideo')}</video>`;
    }
    case 'audio': return html`<audio${attr('controls', controls)} preload="none"><source src="${src}">${t('support.noAudio')}</audio>`;
    case 'pdf': { // never an inline viewer in a row (HTML-66d): the source's first-page preview, lazy like any thumbnail, else the icon
      const preview = item.absolutePreviewURL && item.absolutePreviewURL !== item.absoluteURL ? item.absolutePreviewURL : null;
      if (preview) {
        const rends = item.renditions ?? [];
        return html`<img class="eureka__media-preview eureka__media-pdf" src="${preview}" alt="" loading="lazy" decoding="async"${rends.length ? attr('sizes', IMAGE_SIZES[state.view.mode] ?? '100cqi') : ''}${rends.length ? attr('srcset', rends.filter((r) => !r.type || r.type === rends[rends.length - 1]!.type).map((r) => `${r.url} ${r.width}w`).join(', ')) : ''}>`;
      }
      return html`<p class="eureka__file-placeholder eureka__pdf-placeholder">${icon(ctx, 'file-pdf-o')} <span>${item.filename}</span></p>`;
    }
    case 'text': { // a rendered preview when the source offers one (HTML-66c); the icon otherwise, which the element may replace with a worker-rendered thumbnail
      const mode = state.config.thumbnails;
      const preview = mode !== 'none' && item.absolutePreviewURL && item.absolutePreviewURL !== item.absoluteURL ? item.absolutePreviewURL : mode === 'client' ? ctx.textThumbnails?.get(item.path) ?? null : null;
      if (preview) return html`<img class="eureka__media-text" src="${preview}" alt="" loading="lazy" decoding="async" width="320" height="400">`;
      return html`<p class="eureka__file-placeholder eureka__text-placeholder"${attr('data-text-path', mode === 'client' ? item.path : null)}>${icon(ctx, iconForExtension(extname(item.filename)))} <span>${item.filename}</span></p>`;
    }
    default: return html`<p class="eureka__file-placeholder">${icon(ctx, iconForExtension(extname(item.filename)))} <span>${item.filename}</span></p>`;
  }
}

/** A tile for an image no browser can show (HTML-66e): the item's own proportions, the type icon and the name; table and list hide the name, which their name column shows. */
function skeleton(ctx: Ctx, item: FileEntry): Raw {
  const ratio = item.dimensions ? ` style="--eureka-media-ratio: ${item.dimensions[0]} / ${item.dimensions[1]}"` : '';
  return html`<p class="eureka__file-placeholder eureka__media-skeleton"${raw(ratio)}>${icon(ctx, iconForExtension(extname(item.filename)))} <span class="eureka__media-skeleton__name">${breakableName(item.filename)}</span></p>`;
}

/** One action a row offers (HTML-68): the toolbar and the context menu (HTML-71) render the same list. */
export interface RowAction { kind: string; label: string; action?: string; cls?: string; href?: string; target?: string; download?: boolean }

/** The row's named browsing context for Expand (HTML-68): its id, which is a valid name because it never starts with "_". */
export function rowTargetName(ctx: Ctx, item: FileEntry): string { const id = ctx.ids.item('row', item.filename); return id.startsWith('_') ? `e${id}` : id; }

export function rowActions(ctx: Ctx, item: FileEntry): RowAction[] {
  const { t, state: { config } } = ctx;
  const can = selectCan(ctx.state);
  const n = item.filename;
  const list: RowAction[] = [{ kind: 'expand', label: t('expand'), action: 'expandItem', href: item.absoluteURL, target: rowTargetName(ctx, item) }];
  if (item.animated && ctx.level > 0) list.push({ kind: 'play', label: t(isPlaying(ctx, item) ? 'animation.pause' : 'animation.play'), action: 'toggleAnimation', cls: 'eureka__play-btn' });
  if (config.allowChoose) list.push({ kind: 'choose', label: t('choose'), action: 'chooseItem' });
  if (config.allowCrop && isCroppable(n)) list.push({ kind: 'crop', label: t('crop'), cls: 'eureka__crop-btn' });
  if (can.rename) list.push({ kind: 'rename', label: t('rename'), action: 'renameItem' });
  if (can.delete) list.push({ kind: 'delete', label: t('delete'), action: 'deleteItem', cls: 'dangerous' });
  if (config.allowDownload) list.push({ kind: 'download', label: t('download'), action: 'downloadItem', href: item.absoluteURL, download: true });
  return list;
}

export function actions(ctx: Ctx, item: FileEntry, idPrefix = ''): Raw {
  return renderActions(ctx, item.filename, item.path, rowActions(ctx, item), idPrefix);
}

/** The folder item's toolbar (02 HTML-62): Open, Rename and Delete, subject to capabilities; never Choose, Download or Crop. */
export function folderActions(ctx: Ctx, item: FolderEntry): RowAction[] {
  const { t } = ctx;
  const can = selectCan(ctx.state);
  const list: RowAction[] = [{ kind: 'open', label: t('open'), action: 'chooseItem', cls: 'eureka__open-btn' }];
  if (can.rename) list.push({ kind: 'rename', label: t('rename'), action: 'renameItem' });
  if (can.delete) list.push({ kind: 'delete', label: t('delete'), action: 'deleteItem', cls: 'dangerous' });
  return list;
}

function renderActions(ctx: Ctx, n: string, path: string, list: RowAction[], idPrefix = ''): Raw {
  const { t, ids, level } = ctx;
  const item = { filename: n, path };
  // One tab stop per toolbar (05 KEY-B2): the first control is tabbable, the rest are reached with the arrow keys.
  const roving = (i: number) => (level > 0 ? ` tabindex="${i === 0 ? 0 : -1}"` : '');
  const controls = list.map((a, i) => {
    const keys = a.action ? keyshortcuts(ctx, a.action) : '';
    const body = html`${a.label}${hidden(' ' + n)}${a.action ? kbdHint(ctx, a.action) : ''}`;
    if (a.href) return html`<a class="button eureka__action" id="${ids.item(idPrefix + a.kind, item.filename)}" href="${a.href}"${attr('target', a.target ?? null)}${attr('download', a.download ? n : null)} data-action="${a.kind}"${raw(roving(i))}${keys}>${body}</a>`;
    if (a.kind === 'open') return html`<button type="button" class="${classes('eureka__action', a.cls)}" id="${ids.item(idPrefix + a.kind, item.filename)}" data-action="navigate" data-cd="${item.path}" data-path="${item.path}"${raw(roving(i))}${keys}>${body}</button>`;
    return html`<button type="button" class="${classes('eureka__action', a.cls)}" id="${ids.item(idPrefix + a.kind, item.filename)}" data-action="${a.kind}" data-path="${item.path}"${raw(roving(i))}${keys}>${body}</button>`;
  });
  return html`<div class="eureka__button-bar eureka__context-buttons" role="toolbar" aria-label="${t('actions.for', { filename: n })}" data-row-actions>
    ${controls}
  </div>`;
}

export function row(ctx: Ctx, item: FileEntry, index: number): Raw {
  const { state, t, ids, level } = ctx;
  const rec = selectRecord(state, item.path);
  const description = rec?.description ?? item.filename;
  const multiple = level > 0 && state.view.chooseMode === 'multiple';
  const focused = state.selection.focused === item.path;
  const checked = multiple && selectIsChecked(state, item.path);
  const selected = !multiple && level > 0 && state.selection.selected === item.path; // single-mode selection (STATE-11)
  const rowId = ids.item('row', item.filename);
  const mediaId = ids.item('media', item.filename);
  const nameId = ids.item('filename', item.filename);
  const radioId = ids.item('radio', item.filename);
  const checkboxId = ids.item('check', item.filename);
  const tabindex = level === 0 ? '' : attr('tabindex', focused || (index === 0 && !state.selection.focused) ? 0 : -1).value;
  const mediaCell = level === 0 && mediaKind(item.filename) === 'image'
    ? html`<a href="${item.absoluteURL}" target="_blank" rel="noopener" aria-label="${t('file.openInNewTab', { filename: item.filename })}">${media(ctx, item)}</a>`
    : media(ctx, item);
  const dateTitle = rec?.dateLong ?? '';
  const datetime = new Date(item.editedOn).toISOString();
  return html`<tr id="${rowId}" class="${classes('eureka__row', { 'eureka__focused-media-item': focused, 'eureka__context-anchor': ctx.contextMenu?.path === item.path })}" aria-label="${description}" data-path="${item.path}" data-kind="${mediaKind(item.filename)}"${raw(tabindex)}${attr('aria-selected', multiple ? String(checked) : level > 0 ? String(selected) : null)}>
    ${multiple ? html`<td class="eureka__choose"><input type="checkbox" id="${checkboxId}" name="eureka__chosen_items" value="${item.filename}" aria-label="${t('choose.item', { filename: item.filename })}"${attr('checked', checked)} data-path="${item.path}" tabindex="-1"></td>` : ''}
    ${level === 0 ? html`<td class="eureka__select"><input type="radio" id="${radioId}" name="eureka__chosen_item" value="${item.filename}" aria-describedby="${mediaId}"></td>`
      : !multiple ? html`<td class="eureka__select"><input type="radio" id="${radioId}" name="eureka__selected_item" value="${item.filename}" aria-label="${t('choose.item', { filename: item.filename })}"${attr('checked', selected)} data-path="${item.path}" tabindex="-1"></td>` : ''}
    <td class="eureka__td-media" id="${mediaId}">${mediaCell}${item.animated ? (level > 0
      ? html`<button type="button" class="eureka__badge eureka__badge--animated" data-action="play" data-path="${item.path}" tabindex="-1" aria-pressed="${String(isPlaying(ctx, item))}" aria-label="${t(isPlaying(ctx, item) ? 'animation.pause' : 'animation.play')} ${item.filename}">${icon(ctx, isPlaying(ctx, item) ? 'pause' : 'caret-right')}</button>`
      : html`<span class="eureka__badge eureka__badge--animated">${icon(ctx, 'caret-right')}${hidden(t('media.animated'))}</span>`) : ''}${level > 0 ? html`<button type="button" class="eureka__tile-menu" data-action="menu" data-path="${item.path}" aria-haspopup="menu" aria-label="${t('actions.for', { filename: item.filename })}"${attr('tabindex', focused ? 0 : -1)}>${icon(ctx, 'ellipsis-h')}</button>` : ''}</td>
    <td class="eureka__td-filename" id="${nameId}">${level === 0 ? html`<label for="${radioId}">${breakableName(item.filename)}</label>` : breakableName(item.filename)}</td>
    ${level > 0 ? html`<td class="eureka__context-row"${attr('hidden', !focused)}>${actions(ctx, item)}</td>` : ''}
    <td class="eureka__dimensions">${rec?.dimensionsText ?? ''}${rec?.pagesText ? html` <small class="eureka__pages">${rec.pagesText}</small>` : ''}</td>
    <td class="eureka__file-size">${rec?.sizeText ?? ''}</td>
    <td class="eureka__edited-on"><time datetime="${datetime}"${attr('title', dateTitle)}>${rec?.dateShort ?? ''}</time></td>
  </tr>`;
}

/** A subfolder as an item (02 HTML-62): opens on activation, never chosen; Level 0 submits `eureka__open` (03 NOJS-32a). */
export function folderRow(ctx: Ctx, item: FolderEntry, index: number): Raw {
  const { state, t, ids, level } = ctx;
  const name = item.foldername;
  const rec = selectRecord(state, item.path);
  const multiple = level > 0 && state.view.chooseMode === 'multiple';
  const focused = state.selection.focused === item.path;
  const rowId = ids.item('row', name), mediaId = ids.item('media', name), nameId = ids.item('filename', name);
  const tabindex = level === 0 ? '' : attr('tabindex', focused || (index === 0 && !state.selection.focused) ? 0 : -1).value;
  const label = t('folder.open', { name });
  // the name sits inside the tile for the thumbnail modes, where the name column is hidden; the stylesheet hides it in table and list
  const tileBody = html`${icon(ctx, 'folder')}<span class="eureka__folder-tile__name" aria-hidden="true">${breakableName(name)}</span>`;
  const tile = level === 0
    ? html`<button type="submit" class="eureka__folder-tile" name="eureka__open" value="${String(state.listing.source ?? '')}||${item.path}" aria-label="${label}">${tileBody}</button>`
    : html`<button type="button" class="eureka__folder-tile" data-action="navigate" data-cd="${item.path}" aria-label="${label}" tabindex="-1">${tileBody}</button>`;
  const datetime = Number.isFinite(new Date(item.editedOn).getTime()) && item.editedOn ? new Date(item.editedOn).toISOString() : '';
  return html`<tr id="${rowId}" class="${classes('eureka__row eureka__row--folder', { 'eureka__focused-media-item': focused })}" aria-label="${name}, ${t('folder')}" data-path="${item.path}" data-kind="folder"${raw(tabindex)}${attr('aria-selected', multiple ? 'false' : null)}>
    ${multiple ? html`<td class="eureka__choose"></td>` : html`<td class="eureka__select"></td>`}
    <td class="eureka__td-media" id="${mediaId}">${tile}</td>
    <td class="eureka__td-filename" id="${nameId}">${breakableName(name)}</td>
    ${level > 0 ? html`<td class="eureka__context-row"${attr('hidden', !focused)}>${renderActions(ctx, name, item.path, folderActions(ctx, item))}</td>` : ''}
    <td class="eureka__dimensions"></td>
    <td class="eureka__file-size"></td>
    <td class="eureka__edited-on">${datetime ? html`<time datetime="${datetime}"${attr('title', rec?.dateLong ?? null)}>${rec?.dateShort ?? ''}</time>` : ''}</td>
  </tr>`;
}
