// Level 1: shortcuts from data/keymap.json and focus management (spec/05).
import { test, expect, openDirectory, rows, rowNamed, focusRow, sourcePanelToggle, viewRadio, chooseModeRadio, filterBox, chord, dialogMessage, v3only, baselineDefect } from '../helpers.mjs';

test.beforeEach(async ({ page }) => {
  await openDirectory(page, 'assets/img');
  await page.getByRole('heading', { name: 'Browse Media Content' }).click(); // put focus inside the instance
});

test('KEY-01 toggles the source panel', async ({ page }) => {
  await page.keyboard.press(chord('toggleSourcePanel'));
  await expect(sourcePanelToggle(page)).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press(chord('toggleSourcePanel'));
  await expect(sourcePanelToggle(page)).toHaveAttribute('aria-expanded', 'false');
});

test('KEY-02 switches view modes', async ({ page }) => {
  await page.keyboard.press(chord('setView', 1));
  await expect(viewRadio(page, 'thumb')).toBeChecked();
  await page.keyboard.press(chord('setView', 3));
  await expect(viewRadio(page, 'list')).toBeChecked();
  await page.keyboard.press(chord('setView', 0));
  await expect(viewRadio(page, 'table')).toBeChecked();
});

test('KEY-07 focuses the filter', async ({ page }) => {
  baselineDefect('v2 binds ctrl+f, which Chromium claims for find-in-page; the browser steals focus back (one reason v3 moves the binding)');
  await page.keyboard.press(chord('focusFilter'));
  await expect(filterBox(page)).toBeFocused();
});

test('KEY-08,09 set the sort direction', async ({ page }) => {
  await page.keyboard.press(chord('sortDescending'));
  await expect(page.getByLabel('Sort Direction')).toHaveValue('descending');
  await page.keyboard.press(chord('sortAscending'));
  await expect(page.getByLabel('Sort Direction')).toHaveValue('ascending');
});

test('KEY-10 sorts by column', async ({ page }) => {
  await page.keyboard.press(chord('sortBy', 2)); // fileSize
  await expect(page.getByLabel('Sort by')).toHaveValue('fileSize');
});

test('KEY-10 sorting by shortcut keeps the direction and announces it', async ({ page }) => {
  baselineDefect('v2 replaces the sort object with {by} only, dropping the direction so aria-sort disappears');
  await page.keyboard.press(chord('sortBy', 2));
  await expect(page.getByRole('columnheader', { name: 'File Size' })).toHaveAttribute('aria-sort', /ascending|descending/);
});

test('KEY-11,12 switch choose mode', async ({ page }) => {
  await page.keyboard.press(chord('chooseMultiple'));
  await expect(chooseModeRadio(page, 'multiple')).toBeChecked();
  await page.keyboard.press(chord('chooseSingle'));
  await expect(chooseModeRadio(page, 'single')).toBeChecked();
});

test('KEY-20 Enter on a focused row chooses it', async ({ page }) => {
  await focusRow(page, 'schildpad.jpg');
  const msg = await dialogMessage(page, () => page.keyboard.press(chord('chooseItem')));
  expect(msg).toContain('schildpad.jpg');
});

test('KEY-23 rename shortcut opens the rename dialog for the focused row', async ({ page }) => {
  await focusRow(page, 'notes.txt');
  await page.keyboard.press(chord('renameItem'));
  await expect(page.getByRole('dialog').getByRole('heading')).toHaveText(/notes\.txt/);
});

test('KEY-25..28 arrow keys move between rows with a roving tabindex', async ({ page }) => {
  v3only('arrow-key row navigation');
  await rows(page).first().focus();
  await page.keyboard.press(chord('nextRow'));
  await expect(rows(page).nth(1)).toBeFocused();
  await page.keyboard.press(chord('lastRow'));
  await expect(rows(page).last()).toBeFocused();
  await expect(page.locator('tr[tabindex="0"]')).toHaveCount(1);
});

test('HTML-63 the listing is a single tab stop', async ({ page }) => {
  baselineDefect('v2 gives every row tabindex="0"');
  await expect(page.locator('tbody tr[tabindex="0"]')).toHaveCount(1);
});

test('KEY-B2 Tab from a focused row enters its actions toolbar', async ({ page }) => {
  await focusRow(page, 'schildpad.jpg');
  await page.keyboard.press('Tab');
  const row = rowNamed(page, 'schildpad.jpg');
  await expect(row.locator(':focus')).toHaveCount(1);
});

test('KEY-A2 shortcuts do not fire while typing in the filter', async ({ page }) => {
  await filterBox(page).focus();
  await page.keyboard.type('n');
  await expect(page.getByLabel('Sort by')).toHaveValue('filename');
  await expect(filterBox(page)).toHaveValue('n');
});
