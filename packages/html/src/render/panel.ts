// The source panel: source selector, directory tree, drop area, tree bar (02 §4).
import { normalizePath, selectCurrentTree, type TreeNode } from '@eureka/core';
import { attr, classes, html, type Raw } from '../html.js';
import type { Ctx } from '../model.js';
import { hidden, icon } from './icon.js';

function node(ctx: Ctx, n: TreeNode, depth: number): Raw {
  const { state, ids } = ctx;
  const cd = normalizePath(n.cd);
  const current = state.listing.path === cd;
  const open = cd === '/' || state.tree.open.includes(cd) || (state.listing.path !== '/' && (state.listing.path + '/').startsWith(cd + '/'));
  const children = n.children ?? [];
  return html`<details class="eureka__tree-node" data-cd="${cd}"${attr('open', open)}>
    <summary class="${classes({ active: current })}"${attr('aria-current', current ? 'page' : null)}>${icon(ctx, 'folder', 'eureka__icon-closed')}${icon(ctx, 'folder-open', 'eureka__icon-open')} <button type="button" class="eureka__tree-link" id="${ids.item('tree', cd)}" data-action="navigate" data-cd="${cd}" data-source="${String(state.listing.source ?? '')}">${n.name}</button></summary>
    <div class="eureka__tree-children" style="--depth: ${depth + 1}">${children.map((c) => node(ctx, c, depth + 1))}</div>
  </details>`;
}

export function sourcePanel(ctx: Ctx): Raw {
  const { state, t, ids } = ctx;
  const cd = state.listing.path;
  const open = state.view.panelOpen;
  const tree = selectCurrentTree(state);
  const root: TreeNode = { name: './', cd: '/', children: tree };
  const createFile = state.config.handlers.createFile ? state.config.handlers.createFile(state.listing.source ?? '', cd) : null;
  return html`<aside class="eureka__pathbrowser" id="${ids.id('pathbrowser')}" aria-label="${t('mediaSourceTree')}"${attr('hidden', !open)}>
    <div class="eureka__media-source-selector">
      <h2><label for="${ids.id('source-select')}">${hidden(t('choose') + ' ' + t('grammar.a') + ' ')}${t('media.source')}</label></h2>
      <select id="${ids.id('source-select')}" name="eureka__media-source" data-control="source">${state.sources.all.map((s) => html`<option value="${s.id}"${attr('selected', String(s.id) === String(state.listing.source))}>${s.name}</option>`)}</select>
    </div>
    <nav class="eureka__tree" aria-label="${t('tree.label')}">${node(ctx, root, 0)}</nav>
    ${state.config.allowUploads && state.config.doDragNDrop ? html`<div class="eureka__drop-area" tabindex="0" aria-label="${t('pastImageFromClipboardMessage')}" title="${t(state.pending.uploading ? 'upload.dragFilesUploading' : 'upload.dragFilestoUpload', { cd })}" data-drop-zone><div class="eureka__drop-area-zone">${icon(ctx, state.pending.uploading ? 'circle-o-notch' : 'upload')}</div></div>` : ''}
    <div class="eureka__tree-bar flex-bar">
      <button type="button" title="${t('directory.createNewIn', { cd })}" data-action="create-directory">${hidden(t('directory.createNewIn', { cd }))}${icon(ctx, 'plus-square')}</button>
      ${createFile ? html`<a class="button eureka__create-file-button" href="${createFile.href}"${attr('target', createFile.target)} title="${t('upload.createFileIn', { cd })}" data-action="create-file">${hidden(t('upload.createFileIn', { cd }))}${icon(ctx, 'file-text-o')}</a>` : ''}
      ${state.config.allowUploads ? html`<button type="button" title="${t('upload.filesTo', { cd })}" data-action="upload">${hidden(t('upload.filesTo', { cd }))}${icon(ctx, 'upload')}</button>` : ''}
    </div>
  </aside>`;
}
