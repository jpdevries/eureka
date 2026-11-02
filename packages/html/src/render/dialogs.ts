// Dialogs (02 HTML-91/92, 06 A11Y-70): native <dialog>, rendered only when open.
import { basename, defaultKeymap, parseChord, selectFolders, selectFiles, type FileEntry, type Translator } from '@mrktps/eureka-core';
import { attr, html, type Raw } from '../html.js';
import type { Ctx } from '../model.js';
import { hidden } from './icon.js';
import { media } from './row.js';

export function dialogs(ctx: Ctx): Raw {
  const { state, t, ids } = ctx;
  const d = state.dialog;
  if (!d || ctx.level === 0) return html``;
  const cd = state.listing.path;
  const titleId = ids.id('dialog-title');
  const shell = (cls: string, title: string, body: Raw) => html`<dialog class="eureka__modal ${cls}" id="${ids.id('dialog')}" aria-labelledby="${titleId}" data-dialog="${d.kind}"><div class="eureka__modal-panel"><h2 id="${titleId}">${title}</h2>${body}</div></dialog>`;
  const buttons = (primary: Raw) => html`<div class="flex-bar eureka__button-bar">${html`<button type="button" class="growable" data-action="dialog-cancel">${t('cancel')}</button>`}${primary}</div>`;
  switch (d.kind) {
    case 'shortcuts': return shell('eureka__shortcuts-modal', t('shortcuts'), shortcuts(ctx, html`<div class="flex-bar eureka__button-bar"><button type="button" class="growable eureka__primary" data-action="dialog-cancel" autofocus>${t('shortcuts.close')}</button></div>`));
    case 'createDirectory': {
      const existing = selectFolders(state).map((f) => f.foldername ?? '');
      const value = (d.input ?? '').trim();
      const taken = value !== '' && existing.includes(value);
      return shell('eureka__create-directory-modal', t('directory.create'), html`<form method="dialog" data-form="create-directory">
        <label for="${ids.id('dialog-input')}" aria-live="polite">${t('directory.createNewIn', { cd })}${taken ? html`. ${t('directory.exists', { name: value })}` : ''}</label>
        <input type="text" id="${ids.id('dialog-input')}" name="name" autocomplete="off" required autofocus placeholder="${t('directory.untitled')}" value="${d.input ?? ''}"${attr('aria-invalid', taken ? 'true' : null)}>
        ${buttons(html`<button type="submit" class="growable eureka__primary"${attr('disabled', value === '' || taken)}>${t('create')}${hidden(' ' + t('directory'))}</button>`)}</form>`);
    }
    case 'rename': {
      const target = d.target ?? '';
      const current = basename(target);
      const siblings = [...selectFiles(state), ...selectFolders(state)].map((e) => e.filename ?? e.foldername ?? '').filter((n) => n !== current);
      const value = (d.input ?? current).trim();
      const same = value === current;
      const taken = !same && siblings.includes(value);
      const problem = same ? t('rename.cannot', { filename: current }) : taken ? t('rename.exists', { name: value }) : '';
      return shell('eureka__rename-modal', t('rename.item', { item: current }), html`<form method="dialog" data-form="rename" data-path="${target}" data-current="${current}">
        <label for="${ids.id('dialog-input')}" aria-live="polite">${t('new.name')}${problem ? html`. ${problem}` : ''}</label>
        <input type="text" id="${ids.id('dialog-input')}" name="name" value="${d.input ?? current}" autocomplete="off" required autofocus${attr('aria-invalid', problem ? 'true' : null)}>
        ${buttons(html`<button type="submit" class="growable eureka__primary"${attr('disabled', value === '' || same || taken)}>${t('rename')}${hidden(' ' + current)}</button>`)}</form>`);
    }
    case 'confirmDelete': {
      const target = d.target ?? '';
      const names = target ? [basename(target)] : [];
      return shell('eureka__confirm-modal', t('delete'), html`<form method="dialog" data-form="confirm-delete" data-path="${target}">
        <p>${t('deleteAreYouSureMessage', { filename: names.join(', ') || t('listing.count', { n: state.selection.checked.length }) })}</p>
        ${buttons(html`<button type="submit" class="growable dangerous">${t('delete')}${hidden(' ' + names.join(', '))}</button>`)}</form>`);
    }
    case 'crop': {
      const target = d.target ?? '';
      const item = selectFiles(state).find((f) => f.path === target) as FileEntry | undefined;
      const [w, h] = item?.dimensions ?? [0, 0];
      const defaults: Record<string, number | string> = { X: 0, Y: 0, width: w || '', height: h || '' };
      return shell('eureka__greedy eureka__crop-modal', t('croppingItem', { item: basename(target) }), html`<form method="dialog" data-form="crop" data-path="${target}">
        <div class="eureka__crop-stage" data-crop-stage>${item ? media(ctx, item, { controls: false }) : ''}</div>
        <fieldset class="eureka__crop-bounding-box"><legend>${t('crop.boundingBox')}</legend>
          ${(['X', 'Y', 'width', 'height'] as const).map((k) => html`<label for="${ids.id('crop-' + k)}">${t('crop.' + k)}</label><input type="number" id="${ids.id('crop-' + k)}" name="${k.toLowerCase()}" min="0" step="1" value="${defaults[k]}"${attr('max', k === 'X' || k === 'width' ? w || null : h || null)}>`)}
        </fieldset>
        <label for="${ids.id('crop-save-as')}">${t('saveAs')}</label><input type="text" id="${ids.id('crop-save-as')}" name="saveAs" value="${basename(target)}">
        ${buttons(html`<button type="submit" class="growable eureka__primary"${attr('disabled', state.pending.cropping)}>${t('crop')}</button>`)}</form>`);
    }
  }
}

const KEY_NAMES: Record<string, string> = { ' ': 'key.space', Enter: 'key.enter', Escape: 'key.escape', Backspace: 'key.backspace', Delete: 'key.delete', Home: 'key.home', End: 'key.end', ArrowUp: 'key.arrowUp', ArrowDown: 'key.arrowDown', ArrowLeft: 'key.arrowLeft', ArrowRight: 'key.arrowRight' };

/** A chord as <kbd> elements with platform key names ("Alt+Shift+S" → Alt Shift S; Option on a Mac). */
export function chordLabel(chord: string, t: Translator, mac = false): Raw {
  const c = parseChord(chord);
  const parts: string[] = [];
  if (c.ctrl) parts.push(t('key.control'));
  if (c.alt) parts.push(t(mac ? 'key.option' : 'key.alt'));
  if (c.shift) parts.push(t('key.shift'));
  if (c.meta) parts.push(t(mac ? 'key.command' : 'key.meta'));
  parts.push(KEY_NAMES[c.key] ? t(KEY_NAMES[c.key]!) : c.key.length === 1 ? c.key.toUpperCase() : c.key);
  return html`<span class="eureka__chord">${parts.map((p, i) => html`${i ? '+' : ''}<kbd>${p}</kbd>`)}</span>`;
}

/** The shortcuts reference (05 KEY-A5), generated from the keymap data the instance runs on. */
function shortcuts(ctx: Ctx, footer: Raw): Raw {
  const { state: { config }, t } = ctx;
  const mac = ctx.platform === 'mac';
  const keymap = ctx.keymap ?? defaultKeymap;
  const hide = new Set<string>(['openContextMenu']); // not implemented (HTML-71)
  if (!config.handlers.createFile) hide.add('createFile');
  if (!config.allowUploads) hide.add('upload');
  if (!config.allowRename) hide.add('renameItem');
  if (!config.allowDelete) hide.add('deleteItem');
  if (!config.allowDownload) hide.add('downloadItem');
  if (!config.allowChoose) { hide.add('chooseItem'); hide.add('chooseSingle'); }
  if (!config.allowChooseMultiple) { hide.add('chooseMultiple'); hide.add('invertSelection'); hide.add('toggleItemChecked'); }
  const chords = (keys: string[]) => keys.length > 4
    ? html`${chordLabel(keys[0]!, t, mac)} ${t('key.to')} ${chordLabel(keys[keys.length - 1]!, t, mac)}`
    : html`${keys.map((k, i) => html`${i ? html`<span class="eureka__chord-or">, </span>` : ''}${chordLabel(k, t, mac)}`)}`;
  const rowsFor = (scope: 'instance' | 'row') => keymap.describe().filter((b) => b.scope === scope && !hide.has(b.action)).map((b) => html`<tr><th scope="row">${t('shortcut.' + b.action)}</th><td>${chords(b.chords)}</td></tr>`);
  const extra = html`<tr><th scope="row">${t('shortcut.rowActions')}</th><td>${chordLabel('ArrowRight', t, mac)}<span class="eureka__chord-or">, </span>${chordLabel('ArrowLeft', t, mac)}</td></tr>`; // KEY-B2 focus movement, not a keymap binding
  return html`<p>${t('shortcuts.intro')}</p>
    <table class="eureka__shortcuts"><caption>${t('shortcuts.scope.instance')}</caption><tbody>${rowsFor('instance')}</tbody></table>
    <table class="eureka__shortcuts"><caption>${t('shortcuts.scope.row')}</caption><tbody>${rowsFor('row')}${extra}</tbody></table>
    ${footer}`;
}
