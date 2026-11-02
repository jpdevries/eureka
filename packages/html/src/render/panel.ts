// The source panel: source selector, directory tree, drop area, tree bar (02 §4).
import { normalizePath, selectCan, selectCurrentTree, type TreeNode } from '@mrktps/eureka-core';
import { attr, classes, html, type Raw } from '../html.js';
import type { Ctx } from '../model.js';
import { hidden, icon } from './icon.js';
import { kbdHint, keyshortcuts } from './kbd.js';

/**
 * One directory (HTML-32): the disclosure (<details> holding only its <summary>) and the
 * navigation button are siblings, so no interactive control nests inside the summary;
 * the children list follows and is shown while the disclosure is open.
 */
function node(ctx: Ctx, n: TreeNode, depth: number): Raw {
  const { state, t, ids } = ctx;
  const cd = normalizePath(n.cd);
  const current = state.listing.path === cd;
  const open = cd === '/' || state.tree.open.includes(cd); // ancestors of the current directory are added to tree.open by the store
  const children = n.children ?? [];
  const unloaded = cd !== '/' && n.children === undefined; // past the depth the server returned: expandable, fetched on open (11 MS-43)
  const toggle = children.length || unloaded
    ? html`<details class="eureka__tree-toggle" data-cd="${cd}"${attr('open', open)}><summary>${icon(ctx, 'folder', 'eureka__icon-closed')}${icon(ctx, 'folder-open', 'eureka__icon-open')}${hidden(t('tree.toggle', { name: n.name }))}</summary></details>`
    : html`<span class="eureka__tree-leaf">${icon(ctx, current ? 'folder-open' : 'folder')}</span>`;
  return html`<div class="${classes('eureka__tree-node', { 'eureka__tree-node--open': open || (!children.length && !unloaded), 'eureka__tree-node--unloaded': unloaded, active: current })}" data-cd="${cd}" style="--depth: ${depth}">
    <div class="eureka__tree-row">${toggle}<button type="button" class="eureka__tree-link" id="${ids.item('tree', cd)}" data-action="navigate" data-cd="${cd}" data-source="${String(state.listing.source ?? '')}"${attr('aria-current', current ? 'page' : null)}>${n.name}</button></div>
    ${children.length ? html`<div class="eureka__tree-children">${children.map((c) => node(ctx, c, depth + 1))}</div>` : ''}
  </div>`;
}

export function sourcePanel(ctx: Ctx): Raw {
  const { state, t, ids } = ctx;
  const can = selectCan(state); // instance config AND the current source's capabilities (01 CON-04)
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
    ${can.upload && state.config.doDragNDrop ? html`<button type="button" class="eureka__drop-area" data-action="upload" aria-label="${t(state.pending.uploading ? 'upload.dragFilesUploading' : 'upload.dragFilestoUpload', { cd })}. ${t('pastImageFromClipboardMessage')}" data-drop-zone><span class="eureka__drop-area-zone">${icon(ctx, state.pending.uploading ? 'circle-o-notch' : 'upload')}</span></button>` : ''}
    <div class="eureka__tree-bar flex-bar">
      ${can.createDirectory ? html`<button type="button" title="${t('directory.createNewIn', { cd })}" data-action="create-directory"${keyshortcuts(ctx, 'createDirectory')}>${hidden(t('directory.createNewIn', { cd }))}${icon(ctx, 'plus-square')}${kbdHint(ctx, 'createDirectory')}</button>` : ''}
      ${createFile ? html`<a class="button eureka__create-file-button" href="${createFile.href}"${attr('target', createFile.target)} title="${t('upload.createFileIn', { cd })}" data-action="create-file">${hidden(t('upload.createFileIn', { cd }))}${icon(ctx, 'file-text-o')}</a>` : ''}
      ${can.upload ? html`<button type="button" title="${t('upload.filesTo', { cd })}" data-action="upload"${keyshortcuts(ctx, 'upload')}>${hidden(t('upload.filesTo', { cd }))}${icon(ctx, 'upload')}${kbdHint(ctx, 'upload')}</button>` : ''}
    </div>
  </aside>`;
}
