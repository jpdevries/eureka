// Level 1: focusing rows, the actions toolbar, choosing, multiple selection (spec/02 §6-8).
import { test, expect, openDirectory, rows, rowNamed, focusRow, control, chooseModeRadio, dialogMessage, baselineDefect, v3only } from '../helpers.mjs';

test.beforeEach(async ({ page }) => { await openDirectory(page, 'assets/img'); });

test('HTML-68 focusing a row reveals its actions, each naming the file', async ({ page }) => {
  const row = await focusRow(page, 'schildpad.jpg');
  for (const verb of ['Expand', 'Choose', 'Crop', 'Rename', 'Delete', 'Download']) {
    await expect(control(row, `${verb} schildpad.jpg`)).toBeVisible();
  }
  await expect(control(row, 'Expand schildpad.jpg')).toHaveAttribute('href', /schildpad\.jpg/);
  await expect(control(row, 'Download schildpad.jpg')).toHaveAttribute('download', 'schildpad.jpg');
  // a non-image has no Crop
  const zip = await focusRow(page, 'archive.zip');
  await expect(control(zip, 'Crop archive.zip')).toHaveCount(0);
});

test('HTML-68 actions of unfocused rows are hidden', async ({ page }) => {
  await focusRow(page, 'schildpad.jpg');
  await expect(control(rowNamed(page, 'notes.txt'), 'Choose notes.txt')).toBeHidden();
});

test('HTML-68 the actions group is a toolbar', async ({ page }) => {
  baselineDefect('v2 marks the group role="listbox" with role="option" children');
  const row = await focusRow(page, 'schildpad.jpg');
  await expect(row.getByRole('toolbar', { name: 'Actions for schildpad.jpg' })).toHaveCount(1);
});

test('HTML-80,90 focusing a row fills the path bar and enables Choose', async ({ page }) => {
  const choose = page.getByRole('button', { name: /^Choose/ }).last();
  await expect(choose).toBeDisabled();
  await focusRow(page, 'schildpad.jpg');
  await expect(choose).toBeEnabled();
  await expect(choose).toHaveAccessibleName(/^Choose\s+schildpad\.jpg/);
  await expect(page.getByRole('status').filter({ hasText: 'assets/img/schildpad.jpg' })).toBeVisible();
});

test('choose via the row action reports the item to the host', async ({ page }) => {
  const row = await focusRow(page, 'schildpad.jpg');
  const msg = await dialogMessage(page, () => control(row, 'Choose schildpad.jpg').click());
  expect(msg).toContain('"filename":"schildpad.jpg"');
});

test('choose via the choose bar reports the focused item', async ({ page }) => {
  await focusRow(page, 'notes.txt');
  const msg = await dialogMessage(page, () => page.getByRole('button', { name: /^Choose/ }).last().click());
  expect(msg).toContain('"filename":"notes.txt"');
});

test('HTML-66 double-click on the media chooses the item', async ({ page }) => {
  await focusRow(page, 'schildpad.jpg');
  const msg = await dialogMessage(page, () => rowNamed(page, 'schildpad.jpg').locator('img').dblclick());
  expect(msg).toContain('schildpad.jpg');
});

test('HTML-41 switching to multiple shows checkboxes without any row focused', async ({ page }) => {
  baselineDefect('v2 rows skip re-rendering until a row has been focused (MediaRow.shouldComponentUpdate), so the checkboxes do not appear');
  await chooseModeRadio(page, 'multiple').check();
  await expect(page.getByRole('checkbox', { name: 'Choose schildpad.jpg' })).toBeVisible();
});

test('HTML-41,65,90 multiple choice adds checkboxes and bulk actions', async ({ page }) => {
  await focusRow(page, 'schildpad.jpg');
  await chooseModeRadio(page, 'multiple').check();
  const cb = name => page.getByRole('checkbox', { name: `Choose ${name}` });
  await expect(cb('schildpad.jpg')).toBeVisible();
  await cb('schildpad.jpg').check();
  await cb('notes.txt').check();
  await expect(page.getByRole('button', { name: /^Choose 2 items/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Delete 2 items/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Download 2 items/ })).toBeVisible();
  const msg = await dialogMessage(page, () => page.getByRole('button', { name: /^Choose 2 items/ }).click());
  expect(msg).toContain('schildpad.jpg');
  expect(msg).toContain('notes.txt');
});

test('HTML-41 multiple choice is a fieldset with a legend and named radios', async ({ page }) => {
  baselineDefect('v2 uses a div role=radiogroup with a stray legend, and aria-labelledby names both radios "Choose Items:"');
  await expect(page.getByRole('group', { name: 'Choose Items' })).toHaveCount(1);
  await expect(page.getByRole('radio', { name: 'Multiple' })).toHaveCount(1);
  await expect(page.getByRole('radio', { name: 'Single' })).toHaveCount(1);
});

test('HTML-42 inverting the selection flips every checkbox', async ({ page }) => {
  await focusRow(page, 'schildpad.jpg');
  await chooseModeRadio(page, 'multiple').check();
  await page.getByRole('checkbox', { name: 'Choose schildpad.jpg' }).check();
  await page.getByRole('checkbox', { name: /Invert/ }).check();
  await expect(page.getByRole('button', { name: /^Choose 10 items/ })).toBeVisible();
});

test('switching back to single choice removes the checkboxes', async ({ page }) => {
  await focusRow(page, 'schildpad.jpg');
  await chooseModeRadio(page, 'multiple').check();
  await expect(page.getByRole('checkbox', { name: 'Choose schildpad.jpg' })).toBeVisible();
  await chooseModeRadio(page, 'single').check();
  await expect(page.getByRole('checkbox', { name: /^Choose / })).toHaveCount(0);
});

test('STATE-11 single mode: Tab enters the grid once, arrows move, Space selects with a visible state, Choose commits the selected item', async ({ page }) => {
  v3only('explicit single-mode selection (07 STATE-11, 06 A11Y-56)');
  await openDirectory(page);
  await page.evaluate(() => { const el = document.querySelector('eureka-browser'); window.__chosen = []; el.addEventListener('eureka-choose', (e) => window.__chosen.push(e.detail.items.map((i) => i.path))); });
  const first = rows(page).first();
  await first.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  const third = rows(page).nth(2);
  await expect(third).toBeFocused();
  await expect(third).toHaveAttribute('aria-selected', 'false');
  await page.keyboard.press('Space');
  await expect(third).toHaveAttribute('aria-selected', 'true');
  await expect(third).toHaveClass(/eureka__focused-media-item/);
  await page.keyboard.press('ArrowDown'); // focus moves on, the selection stays
  await expect(third).toHaveAttribute('aria-selected', 'true');
  await expect(rows(page).nth(3)).toBeFocused();
  const thirdPath = await third.getAttribute('data-path');
  await page.keyboard.press('Tab'); // one stop out of the grid lands on the focused row's toolbar, not on another row
  await expect(page.locator(':focus')).not.toHaveAttribute('data-path', /./);
  await page.getByRole('button', { name: /^Choose(?! Items)/ }).last().click();
  const chosen = await page.evaluate(() => window.__chosen);
  expect(chosen).toEqual([[thirdPath]]); // the selected item, not the focused fourth row
});
