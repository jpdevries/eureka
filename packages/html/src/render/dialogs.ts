// Dialogs (02 HTML-91/92, 06 A11Y-70): native <dialog>, rendered only when open.
import { basename, selectFolders, selectFiles } from '@eureka/core';
import { attr, html, type Raw } from '../html.js';
import type { Ctx } from '../model.js';
import { hidden } from './icon.js';

export function dialogs(ctx: Ctx): Raw {
  const { state, t, ids } = ctx;
  const d = state.dialog;
  if (!d || ctx.level === 0) return html``;
  const cd = state.listing.path;
  const titleId = ids.id('dialog-title');
  const shell = (cls: string, title: string, body: Raw) => html`<dialog class="eureka__modal ${cls}" id="${ids.id('dialog')}" aria-labelledby="${titleId}" data-dialog="${d.kind}"><div class="eureka__modal-panel"><h2 id="${titleId}">${title}</h2>${body}</div></dialog>`;
  const buttons = (primary: Raw) => html`<div class="flex-bar eureka__button-bar">${html`<button type="button" class="growable" data-action="dialog-cancel">${t('cancel')}</button>`}${primary}</div>`;
  switch (d.kind) {
    case 'createDirectory': {
      const existing = selectFolders(state).map((f) => f.foldername ?? '');
      return shell('eureka__create-directory-modal', t('directory.create'), html`<form method="dialog" data-form="create-directory" data-existing="${existing.join('|')}">
        <label for="${ids.id('dialog-input')}" aria-live="polite">${t('directory.createNewIn', { cd })}</label>
        <input type="text" id="${ids.id('dialog-input')}" name="name" autocomplete="off" required autofocus placeholder="${t('directory.untitled')}">
        ${buttons(html`<button type="submit" class="growable eureka__primary">${t('create')}${hidden(' ' + t('directory'))}</button>`)}</form>`);
    }
    case 'rename': {
      const target = d.target ?? '';
      const current = basename(target);
      const siblings = [...selectFiles(state), ...selectFolders(state)].map((e) => e.filename ?? e.foldername ?? '').filter((n) => n !== current);
      return shell('eureka__rename-modal', t('rename.item', { item: current }), html`<form method="dialog" data-form="rename" data-path="${target}" data-current="${current}" data-existing="${siblings.join('|')}">
        <label for="${ids.id('dialog-input')}" aria-live="polite">${t('new.name')}</label>
        <input type="text" id="${ids.id('dialog-input')}" name="name" value="${current}" autocomplete="off" required autofocus>
        ${buttons(html`<button type="submit" class="growable eureka__primary">${t('rename')}${hidden(' ' + current)}</button>`)}</form>`);
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
      return shell('eureka__greedy eureka__crop-modal', t('croppingItem', { item: basename(target) }), html`<form method="dialog" data-form="crop" data-path="${target}">
        <div class="eureka__crop-stage" data-crop-stage></div>
        <fieldset class="eureka__crop-bounding-box"><legend>${t('crop.boundingBox')}</legend>
          ${(['X', 'Y', 'width', 'height'] as const).map((k) => html`<label for="${ids.id('crop-' + k)}">${t('crop.' + k)}</label><input type="number" id="${ids.id('crop-' + k)}" name="${k.toLowerCase()}" min="0" step="1">`)}
        </fieldset>
        <label for="${ids.id('crop-save-as')}">${t('saveAs')}</label><input type="text" id="${ids.id('crop-save-as')}" name="saveAs" value="${basename(target)}">
        ${buttons(html`<button type="submit" class="growable eureka__primary"${attr('disabled', state.pending.cropping)}>${t('crop')}</button>`)}</form>`);
    }
  }
}
