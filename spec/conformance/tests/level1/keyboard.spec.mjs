// Level 1: shortcuts from data/keymap.json and focus management (spec/05).
import { test, expect, openDirectory, rows, rowNamed, focusRow, setView, sourcePanelToggle, viewRadio, chooseModeRadio, filterBox, chord, dialogMessage, v3only, baselineDefect } from '../helpers.mjs';

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

test('KEY-B2 a row toolbar is one tab stop; arrows move inside it', async ({ page }) => {
  v3only('roving tabindex inside the actions toolbar');
  const row = await focusRow(page, 'schildpad.jpg');
  await page.keyboard.press('Tab');
  const toolbar = row.getByRole('toolbar', { name: 'Actions for schildpad.jpg' });
  await expect(toolbar.getByRole('link', { name: 'Expand schildpad.jpg' })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(toolbar.getByRole('button', { name: 'Choose schildpad.jpg' })).toBeFocused();
  await page.keyboard.press('End');
  await expect(toolbar.getByRole('link', { name: 'Download schildpad.jpg' })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(toolbar.getByRole('link', { name: 'Expand schildpad.jpg' })).toBeFocused();
  await page.keyboard.press('ArrowLeft'); // from the first control back to the row, as between grid cells
  await expect(row).toBeFocused();
  await page.keyboard.press('ArrowRight'); // and from the row into its actions
  await expect(toolbar.getByRole('link', { name: 'Expand schildpad.jpg' })).toBeFocused();
  await expect(page.getByRole('grid')).toHaveAttribute('aria-describedby', /listing-help$/);
  await page.keyboard.press('End');
  await page.keyboard.press('Tab'); // leaves the toolbar in one step (the next stop may be a later row's media controls)
  const focused = page.locator(':focus');
  await expect(focused).not.toHaveAttribute('data-action', /.+/);
  expect(await focused.evaluate((el) => !!el.closest('tr[data-path="assets/img/schildpad.jpg"]'))).toBe(false);
});

test('KEY-A5 ? and the help button open the shortcuts reference generated from the keymap', async ({ page }) => {
  v3only('shortcuts reference');
  // A11Y-55: the hint rests knocked back (never below 3:1) and comes to full opacity on keyboard use
  const hint = page.getByRole('button', { name: 'Keyboard Shortcuts' });
  const resting = Number(await hint.evaluate((el) => getComputedStyle(el).opacity));
  expect(resting).toBeLessThan(1);
  expect(resting).toBeGreaterThanOrEqual(0.5);
  await expect(page.locator('.eureka')).not.toHaveAttribute('data-keyboard', 'true');
  // HTML-96: with no focus inside the instance and no keyboard use yet, the <kbd> hints rest faint (at least the 4.5:1 floor, 0.55) and keep their space, so revealing them shifts nothing
  const panelKbd = page.getByRole('button', { name: 'Toggle Source Panel' }).locator('kbd');
  await page.evaluate(() => document.activeElement?.blur());
  const kbdResting = Number(await panelKbd.evaluate((el) => getComputedStyle(el).opacity));
  expect(kbdResting).toBeLessThan(1);
  expect(kbdResting).toBeGreaterThanOrEqual(0.55);
  const restingWidth = await panelKbd.evaluate((el) => el.getBoundingClientRect().width);
  expect(restingWidth).toBeGreaterThan(0);
  await page.getByRole('heading', { name: 'Browse Media Content' }).click(); // focus back inside the instance (KEY-A2)
  await page.keyboard.press(chord('showShortcuts'));
  const dialog = page.getByRole('dialog', { name: 'Keyboard Shortcuts' });
  await expect(dialog).toBeVisible();
  await expect(page.locator('.eureka')).toHaveAttribute('data-keyboard', 'true');
  await expect(hint).toHaveCSS('opacity', '1');
  expect(await panelKbd.evaluate((el) => el.getBoundingClientRect().width)).toBe(restingWidth); // same box, only the opacity moved
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  // HTML-96: the Choose action carries its shortcut as aria-keyshortcuts and an inline <kbd> hint, now at full opacity
  const row = await focusRow(page, 'schildpad.jpg');
  const choose = row.getByRole('button', { name: 'Choose schildpad.jpg' });
  await expect(choose).toHaveAttribute('aria-keyshortcuts', 'Enter');
  await expect(choose.locator('kbd')).toHaveText('Enter');
  await expect(choose.locator('kbd')).toHaveCSS('opacity', '1');
  await page.keyboard.press(chord('showShortcuts'));
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('row', { name: /Rename the item/ })).toContainText('F2');
  await expect(dialog.getByRole('row', { name: /Filter the listing/ })).toContainText(/(Alt|Option)\+Shift\+S/); // modifier names follow the platform
  await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  const help = page.getByRole('button', { name: 'Keyboard Shortcuts' });
  await help.click();
  await expect(page.getByRole('dialog', { name: 'Keyboard Shortcuts' })).toBeVisible();
  await page.getByRole('dialog', { name: 'Keyboard Shortcuts' }).getByRole('button', { name: 'Close' }).click();
  await expect(help).toBeFocused(); // KEY-B5: focus returns to the opener
  // not in text fields (KEY-A3)
  await filterBox(page).focus();
  await page.keyboard.type('?');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(filterBox(page)).toHaveValue('?');
});

test('KEY-29 Shift+F10 opens the row menu as a popover; arrows, typeahead, Enter and Escape work', async ({ page }) => {
  v3only('popover context menu');
  // table mode has the inline toolbar: the binding does nothing there (HTML-71)
  await focusRow(page, 'schildpad.jpg');
  await page.keyboard.press(chord('openContextMenu'));
  await expect(page.getByRole('menu')).toHaveCount(0);
  await setView(page, 'grid');
  const row = await focusRow(page, 'schildpad.jpg');
  await page.keyboard.press(chord('openContextMenu'));
  const menu = page.getByRole('menu', { name: 'Actions for schildpad.jpg' });
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute('popover', 'manual');
  await expect(menu.getByRole('menuitem')).toHaveText([/^Expand/, /^Choose/, /^Crop/, /^Rename/, /^Delete/, /^Download/]);
  await expect(menu.getByRole('menuitem', { name: 'Expand schildpad.jpg' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Choose schildpad.jpg' })).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp'); // wraps
  await expect(menu.getByRole('menuitem', { name: 'Download schildpad.jpg' })).toBeFocused();
  await page.keyboard.press('r'); // typeahead
  await expect(menu.getByRole('menuitem', { name: 'Rename schildpad.jpg' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(row).toBeFocused();
  // Enter on an item acts and closes the menu; a dialog it opens returns focus to the row (KEY-B5)
  await page.keyboard.press(chord('openContextMenu'));
  await page.keyboard.press('r');
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading')).toHaveText(/schildpad\.jpg/);
  await expect(page.getByRole('menu')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(row).toBeFocused();
  // right-click opens it too, at the pointer
  await page.evaluate(() => addEventListener('contextmenu', (e) => { window.__cm = [e.clientX, e.clientY]; }, true));
  await row.click({ button: 'right', position: { x: 240, y: 12 } });
  const pointerMenu = page.getByRole('menu', { name: 'Actions for schildpad.jpg' });
  await expect(pointerMenu).toBeVisible();
  const [cx, cy] = await page.evaluate(() => window.__cm);
  const mbox = await pointerMenu.boundingBox();
  expect(Math.abs(mbox.x - cx)).toBeLessThan(4); // at the pointer (clamping only applies near the viewport edges)
  expect(Math.abs(mbox.y - cy)).toBeLessThan(4);
  await page.mouse.click(5, 5); // pointer down outside closes
  await expect(page.getByRole('menu')).toHaveCount(0);
});

test('HTML-68 Expand opens the item in a named tab per row, and a second Expand reuses it', async ({ page }) => {
  v3only('named browsing context per row');
  const row = await focusRow(page, 'schildpad.jpg');
  const expand = row.getByRole('link', { name: 'Expand schildpad.jpg' });
  await expect(expand).toHaveAttribute('target', await row.getAttribute('id'));
  const [popup] = await Promise.all([page.waitForEvent('popup'), expand.click()]);
  await popup.waitForLoadState();
  expect(popup.url()).toContain('schildpad.jpg');
  const pages = page.context().pages().length;
  await focusRow(page, 'schildpad.jpg');
  await expand.click();
  await page.waitForTimeout(500);
  expect(page.context().pages().length).toBe(pages); // same named context: no second tab
  // the keyboard binding targets the same name
  await focusRow(page, 'schildpad.jpg');
  await page.keyboard.press(chord('expandItem'));
  await page.waitForTimeout(500);
  expect(page.context().pages().length).toBe(pages);
  await popup.close();
});

test('KEY-30 the download shortcut downloads the focused item', async ({ page }) => {
  v3only('download binding');
  await focusRow(page, 'schildpad.jpg');
  const download = page.waitForEvent('download');
  await page.keyboard.press(chord('downloadItem'));
  expect((await download).suggestedFilename()).toBe('schildpad.jpg');
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
