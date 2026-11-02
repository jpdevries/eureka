export { html, raw, attr, classes, escapeHtml, jsonForScript, Raw } from './html.js';
export { createIds, contextFromPage, hydrationState, type Ctx, type Ids, type Level, type PageInput } from './model.js';
export { instance } from './render/instance.js';
export { listing } from './render/listing.js';
export { row, actions, rowActions, rowTargetName, media, isPlaying, breakableName, type RowAction } from './render/row.js';
export { contextMenu } from './render/menu.js';
export { sourcePanel } from './render/panel.js';
export { stageHeader, toolbar, directorySelector, uploadControl } from './render/toolbar.js';
export { notifications, pathBar, chooseBar } from './render/bars.js';
export { dialogs } from './render/dialogs.js';
export { icon, hidden } from './render/icon.js';
export { kbdHint, keyshortcuts, shortLabel } from './render/kbd.js';
export { renderDocument, type DocumentOptions } from './document.js';

import { contextFromPage, type PageInput } from './model.js';
import { instance } from './render/instance.js';

/** Render the Level 0 form for a server page (03). Returns the markup for inside `.eureka-root`. */
export function renderLevel0(input: PageInput): string { return instance(contextFromPage(input, 0)).value; }
/** Render the enhanced markup from server inputs (initial DOM the element hydrates). */
export function renderEnhanced(input: PageInput): string { return instance(contextFromPage(input, 1)).value; }
