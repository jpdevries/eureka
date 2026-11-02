// Shared helpers for the Eureka conformance suite. Everything here locates
// elements through the accessibility tree; the few attribute selectors are
// for field names that are themselves part of the contract (03).
import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const TARGET = process.env.CONFORMANCE_TARGET ?? 'v2';
const here = path.dirname(fileURLToPath(import.meta.url));
export const keymap = JSON.parse(fs.readFileSync(path.join(here, '..', '..', 'data', 'keymap.json'), 'utf8'));

/** Skip a test that checks a requirement new in v3. */
export function v3only(reason) { base.skip(TARGET === 'v2', `v3 requirement: ${reason}`); }
/** Mark a test as an expected failure on the v2 baseline (a documented defect). */
export function baselineDefect(reason) { base.fail(TARGET === 'v2', `known v2 defect: ${reason}`); }

/** Playwright key chord for a keymap action: v2 bindings for the baseline, v3 otherwise. */
export function chord(action, index = 0) {
  const b = keymap.bindings.find(x => x.action === action);
  if (!b) throw new Error(`no binding for ${action}`);
  if (TARGET !== 'v2') return b.keys[index];
  const v2 = b.v2[index];
  if (!v2) base.skip(true, `v2 has no binding for ${action}`);
  return v2.split('+').map(k => ({ ctrl: 'Control', alt: 'Alt', shift: 'Shift', up: 'ArrowUp', down: 'ArrowDown', space: ' ', enter: 'Enter', backspace: 'Backspace' }[k] ?? k.toUpperCase())).join('+');
}

export const test = base.extend({
  // Fresh fixture data for every test.
  resetFixtures: [async ({ request }, use) => { await request.post('/__reset'); await use(); }, { auto: true }]
});
export { expect };

// ---- locators --------------------------------------------------------------
export const listing = page => page.getByRole('table').or(page.getByRole('grid'));
export const rows = page => page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
export const rowNamed = (page, filename) => page.getByRole('row', { name: new RegExp('^' + filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) });
/** A control by accessible name regardless of whether it is a button, link or (v2) option. */
export const control = (scope, name) => scope.getByRole('button', { name }).or(scope.getByRole('link', { name })).or(scope.getByRole('option', { name }));
export const directoryTree = page => page.getByRole('tree').or(page.getByRole('navigation', { name: 'Directories' }));
export const sourcePanelToggle = page => page.getByRole('button', { name: TARGET === 'v2' ? 'Media Source Panel' : 'Toggle Source Panel' });
export const viewRadioName = mode => `${{ table: 'Table', thumb: 'Thumbnail', grid: 'Grid', list: 'List', masonry: 'Masonry' }[mode]} Layout`;
// v2 names every view radio "View Mode" (aria-labelledby the legend), so the baseline is located by value. HTML-47 has a defect test for this.
export const viewRadio = (page, mode) => TARGET === 'v2' ? page.locator(`input[name="eureka__view"][value="${mode}"]`) : page.getByRole('radio', { name: viewRadioName(mode) });
// v2 names both choose-mode radios "Choose Items:"; same workaround. HTML-41 has a defect test.
export const chooseModeRadio = (page, mode) => TARGET === 'v2' ? page.locator(mode === 'multiple' ? '#eureka____choose_items' : '#eureka____choose_item') : page.getByRole('radio', { name: mode === 'multiple' ? 'Multiple' : 'Single' });
// The filter input has a datalist, which makes it a combobox in the accessibility tree.
export const filterBox = page => page.getByRole('combobox', { name: /^Filter/ }).or(page.getByRole('textbox', { name: /^Filter/ }));
/** Run `action` and return the message of the alert/confirm it triggers (the v2 demo reports chosen items with alert()). */
export async function dialogMessage(page, action) {
  let message;
  const seen = new Promise(resolve => page.once('dialog', async d => { message = d.message(); await d.dismiss(); resolve(); }));
  await action();
  await seen;
  return message;
}

// ---- flows -------------------------------------------------------------------
export async function dismissNotification(page) {
  // The v2 demo shows a welcome notification ~0.5s after the sources load; it overlaps the choose-mode radios, so wait for it and dismiss it.
  const btn = page.locator('[aria-label="Dismiss Notification"], [role="status"] button, [role="alert"] button').first();
  await btn.click({ timeout: TARGET === 'v2' ? 5000 : 1500 }).catch(() => {});
}

/** Select a view mode. The icon radios are visually hidden inputs behind icon labels (v2 and v3 alike), so click the label. */
export async function setView(page, mode) {
  await page.locator(`label[for$="view-${mode}"]`).click();
  await expect(viewRadio(page, mode)).toBeChecked();
}
/** The media source <select> ("Choose a Media Source"); by role, since the panel itself is labelled "Media Source Panel". */
export const sourceSelect = page => page.getByRole('combobox', { name: 'Media Source' });

/** True when an element is removed from the visual layout (display:none or clipped to 1px), whatever its a11y exposure. */
export async function isVisuallyHidden(locator) {
  if ((await locator.count()) === 0) return true; // display:none drops it from the tree entirely
  const box = await locator.first().boundingBox();
  if (box === null || box.width <= 1 || box.height <= 1) return true;
  // Clipped by an ancestor (the visually-hidden pattern on a container): nothing of it is hit-testable.
  return locator.first().evaluate((el, b) => {
    const hit = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
    return !(hit && (hit === el || el.contains(hit)));
  }, box);
}

/** Open the enhanced page and navigate to a directory through the directory selector. */
export async function openDirectory(page, cd = 'assets/img', { source = 0 } = {}) {
  await page.goto('/');
  await dismissNotification(page);
  const select = page.getByLabel('Browse Directory');
  await expect(select).toBeVisible();
  await select.selectOption(`${source}||${cd}`);
  await expect(rows(page).first()).toBeVisible();
  await expect(page.getByText(/Hold tight while we fetch/)).toHaveCount(0);
}

/** Focus a row (moves the roving focus / shows its actions). */
export async function focusRow(page, filename) {
  const row = rowNamed(page, filename);
  await row.scrollIntoViewIfNeeded();
  await row.focus();
  return row;
}

// ---- axe -----------------------------------------------------------------------
/** Run axe on the current page state. Fails for v3; reports for the v2 baseline. */
export async function axeCheck(page, label) {
  // Let CSS transitions finish first (the keyboard hints fade in on focus): axe measures the colours it sees, and a mid-fade frame is not a state.
  await page.evaluate(async () => {
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); // let a pending re-render start its transitions
    await Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {})));
  });
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
  const info = base.info();
  await info.attach(`axe-${label}.json`, { body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' });
  const summary = results.violations.map(v => `${v.impact ?? '-'} ${v.id} ×${v.nodes.length}`).join('; ') || 'none';
  info.annotations.push({ type: `axe:${label}`, description: summary });
  if (TARGET !== 'v2') expect(results.violations, `axe violations in state "${label}"`).toEqual([]);
  return results.violations;
}

export const pngFile = (name = 'upload-test.png') => ({
  name,
  mimeType: 'image/png',
  // 1×1 transparent PNG
  buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
});
