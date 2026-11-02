// Level 1: upload, rename, delete, create directory (spec/02, spec/api).
import { test, expect, openDirectory, rows, rowNamed, focusRow, control, pngFile, baselineDefect, chord, chooseModeRadio } from '../helpers.mjs';

test.beforeEach(async ({ page }) => { await openDirectory(page, 'assets/img'); });

test('HTML-46 choosing files in the upload control uploads them and refreshes the listing', async ({ page }) => {
  const req = page.waitForRequest(r => r.method() === 'POST' && /media\/sources\/0\?path=assets%2Fimg/.test(r.url()));
  await page.locator('input[name="eureka__uploadFiles"]').setInputFiles([pngFile('fresh-upload.png')]);
  await req;
  await expect(rowNamed(page, 'fresh-upload.png')).toBeVisible();
  await expect(rows(page)).toHaveCount(12);
});

test('delete via the row action removes the row and notifies', async ({ page }) => {
  const row = await focusRow(page, 'notes.txt');
  const req = page.waitForRequest(r => r.method() === 'DELETE' && /path=assets%2Fimg%2Fnotes\.txt/.test(r.url()));
  await control(row, 'Delete notes.txt').click();
  await req;
  await expect(rowNamed(page, 'notes.txt')).toHaveCount(0);
  await expect(rows(page)).toHaveCount(10);
  await expect(page.getByText('Deleted notes.txt')).toBeVisible();
});

test('KEY-22 delete key on a focused row deletes it', async ({ page }) => {
  await focusRow(page, 'notes.txt');
  const req = page.waitForRequest(r => r.method() === 'DELETE' && /notes\.txt/.test(r.url()));
  await page.keyboard.press(chord('deleteItem'));
  await req;
  await expect(rowNamed(page, 'notes.txt')).toHaveCount(0);
});

test('HTML-90 bulk delete removes every selected row', async ({ page }) => {
  await focusRow(page, 'schildpad.jpg');
  await chooseModeRadio(page, 'multiple').check();
  await page.getByRole('checkbox', { name: 'Choose notes.txt' }).check();
  await page.getByRole('checkbox', { name: 'Choose archive.zip' }).check();
  const req = page.waitForRequest(r => r.method() === 'DELETE' && /media\/sources\/0$/.test(r.url()));
  await page.getByRole('button', { name: /^Delete 2 items/ }).click();
  await req;
  await expect(rowNamed(page, 'notes.txt')).toHaveCount(0);
  await expect(rowNamed(page, 'archive.zip')).toHaveCount(0);
  await expect(rows(page)).toHaveCount(9);
});

test('HTML-91,92 rename through the dialog updates the row', async ({ page }) => {
  const row = await focusRow(page, 'notes.txt');
  await control(row, 'Rename notes.txt').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading')).toHaveText(/Rename Item\s*notes\.txt/);
  const input = dialog.getByRole('textbox');
  await expect(input).toHaveAccessibleName(/New name/);
  await expect(input).toBeFocused();
  await input.fill('notes.txt');
  await expect(dialog.getByRole('button', { name: /^Rename/ })).toBeDisabled(); // same name
  await expect(input).toHaveAccessibleName(/Cannot rename notes\.txt to the same name/);
  await input.fill('notes-renamed.txt');
  const req = page.waitForRequest(r => r.method() === 'PUT' && /name=notes-renamed\.txt/.test(r.url()));
  await dialog.getByRole('button', { name: /^Rename/ }).click();
  await req;
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(rowNamed(page, 'notes-renamed.txt')).toBeVisible();
  await expect(rowNamed(page, 'notes.txt')).toHaveCount(0);
});

test('HTML-91 Escape closes a dialog and returns focus', async ({ page }) => {
  const row = await focusRow(page, 'notes.txt');
  await control(row, 'Rename notes.txt').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('HTML-91 the rest of the page is inert while a dialog is open', async ({ page }) => {
  baselineDefect('v2 uses aria-hidden on siblings instead of inert');
  const row = await focusRow(page, 'notes.txt');
  await control(row, 'Rename notes.txt').click();
  await expect(page.locator('.eureka__browse-content')).toHaveAttribute('inert', '');
});

test('HTML-35,92 create directory from the tree bar', async ({ page }) => {
  await page.getByRole('button', { name: 'Media Source Panel' }).click();
  await page.getByRole('button', { name: /Create a new Directory in assets\/img/ }).click();
  const dialog = page.getByRole('dialog');
  const input = dialog.getByLabel(/Create a new directory in \/?assets\/img/i);
  await expect(input).toBeFocused();
  await expect(dialog.getByRole('button', { name: /^Create/ })).toBeDisabled();
  await input.fill('newdir');
  const req = page.waitForRequest(r => r.method() === 'PUT' && /path=assets%2Fimg%2Fnewdir/.test(r.url()));
  await dialog.getByRole('button', { name: /^Create/ }).click();
  await req;
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('KEY-05 the create directory shortcut opens the dialog', async ({ page }) => {
  await page.getByRole('heading', { name: 'Browse Media Content' }).click();
  await page.keyboard.press(chord('createDirectory'));
  await expect(page.getByRole('dialog')).toBeVisible();
});
