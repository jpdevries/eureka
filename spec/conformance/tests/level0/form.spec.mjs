// Level 0: the server-rendered form with JavaScript disabled (spec/03).
import { test, expect, baselineDefect, pngFile, TARGET } from '../helpers.mjs';

test.beforeEach(async ({ page }) => { await page.goto('/nojs'); });

test('NOJS-01 the root is a multipart POST form to basePath', async ({ page }) => {
  const form = page.locator('form.eureka');
  await expect(form).toHaveAttribute('method', /post/i);
  await expect(form).toHaveAttribute('enctype', 'multipart/form-data');
  await expect(form).toHaveAttribute('action', '/');
});

test('NOJS-03 the page declares its language', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('lang', /^[a-z]{2}/);
});

test('NOJS-10..12 hidden context fields and the directory selector', async ({ page }) => {
  await expect(page.locator('input[name="eureka__mediaSourceId"]')).toHaveValue('0');
  await expect(page.locator('input[name="eureka__upload-dir"]')).toHaveValue('assets/img');
  const select = page.getByLabel('Browse Directory');
  await expect(select).toHaveAttribute('name', /^eureka__media-browser_\w+__browsing$/);
  await expect(select).toHaveValue('0||assets/img');
  expect(await select.locator('optgroup[label="filesystem"] option').count()).toBeGreaterThanOrEqual(6);
  await expect(select.locator('optgroup[label="filesystem"] option').first()).toHaveAttribute('value', '0||/');
  await expect(select.locator('option[value="0||/"]')).toHaveText('./');
  await expect(page.getByRole('button', { name: 'Set Directory' })).toBeVisible();
});

test('NOJS-13,16 the upload control names its destination and has its own submit', async ({ page }) => {
  const input = page.locator('input[type="file"][name="eureka__uploadFiles"]');
  await expect(input).toHaveAccessibleName(/Upload files to assets\/img/);
  await expect(input).toHaveAttribute('type', 'file');
  await expect(input).toHaveAttribute('multiple', '');
  await expect(page.getByRole('button', { name: 'Upload files', exact: true })).toBeVisible();
});

test('NOJS-14 one radio per file, carrying the filename', async ({ page }) => {
  const radios = page.locator('input[type="radio"][name="eureka__chosen_item"]');
  await expect(radios).toHaveCount(11);
  const values = await radios.evaluateAll((els) => els.map((e) => e.value));
  expect(values).toContain('Wide Banner (final).jpg');
  expect(values).toContain('schildpad.jpg');
});

test('NOJS-17 each radio is named by its filename', async ({ page }) => {
  baselineDefect('v2 sets aria-labelledby to the Choose button on every radio, so all radios are named "Choose media item"');
  await expect(page.getByRole('radio', { name: /^schildpad\.jpg/ })).toHaveCount(1);
});

test('NOJS-18 choose bar has Choose and Cancel', async ({ page }) => {
  await expect(page.getByRole('button', { name: /^Choose/ })).toBeEnabled();
  await expect(page.getByRole('button', { name: /Close Media Browser/ })).toContainText('Cancel');
});

test('NOJS-19 image rows link to the file for expand', async ({ page }) => {
  const links = page.getByRole('link', { name: /in a new tab/ });
  await expect(links).toHaveCount(6); // jpg, jpg, png, png, jpg, gif
  await expect(links.first()).toHaveAttribute('href', /schildpad|Wide( |%20)Banner|hawaii|tall-tree|icon-16|animation/);
  await expect(links.first()).toHaveAttribute('target', /./);
});

test('NOJS-19 expand link names include the filename', async ({ page }) => {
  baselineDefect('v2 formats the link label with an undefined property, yielding "Open  in a new tab"');
  await expect(page.getByRole('link', { name: 'Open schildpad.jpg in a new tab' })).toHaveCount(1);
});

test('NOJS-20 enhanced-only controls are absent', async ({ page }) => {
  await expect(page.getByRole('textbox', { name: /^Filter/ })).toHaveCount(0);
  await expect(page.getByRole('radio', { name: /Layout$/ })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /^(Media|Toggle) Source Panel$/ })).toHaveCount(0);
  await expect(page.getByRole('tree')).toHaveCount(0);
});

test('Level 0 listing has the data columns and generated descriptions', async ({ page }) => {
  for (const name of ['Media', 'Name', 'Dimensions', 'File Size', 'Edited On']) await expect(page.getByRole('columnheader', { name })).toHaveCount(1);
  await expect(page.getByRole('row', { name: /^schildpad\.jpg displays at 336x125, weighs 37 KB, and was edited on/ })).toHaveCount(1);
});

test('NOJS-32 submitting Set Directory posts the chosen source and directory', async ({ page }) => {
  await page.getByLabel('Browse Directory').selectOption('0||assets/docs');
  await page.getByRole('button', { name: 'Set Directory' }).click();
  await expect(page).toHaveURL(/\/$/);
  if (TARGET === 'v2') { // the v2 baseline cannot re-render; the fixture server echoes what it parsed
    const echo = JSON.parse(await page.locator('#echo').textContent());
    expect(echo).toMatchObject({ action: 'navigate', source: '0', directory: 'assets/docs' });
    return;
  }
  // NOJS-33: the response is the same page for the new directory
  await expect(page.getByLabel('Browse Directory')).toHaveValue('0||assets/docs');
  await expect(page.locator('input[name="eureka__upload-dir"]')).toHaveValue('assets/docs');
  await expect(page.locator('input[type="radio"][name="eureka__chosen_item"]')).toHaveCount(2);
});

test('NOJS-31 choosing an item posts its filename and directory', async ({ page }) => {
  await page.locator('input[name="eureka__chosen_item"][value="schildpad.jpg"]').check();
  await page.getByRole('button', { name: /^Choose/ }).click();
  const echo = JSON.parse(await page.locator('#echo').textContent());
  expect(echo).toMatchObject({ action: 'choose', chosen: 'schildpad.jpg', directory: 'assets/img', source: '0' });
});

test('NOJS-30 uploading posts the files to the current directory', async ({ page }) => {
  await page.locator('input[type="file"][name="eureka__uploadFiles"]').setInputFiles([pngFile('nojs-upload.png')]);
  await page.getByRole('button', { name: 'Upload files', exact: true }).click();
  if (TARGET === 'v2') {
    const echo = JSON.parse(await page.locator('#echo').textContent());
    expect(echo.uploaded).toEqual(['nojs-upload.png']);
    expect(echo.directory).toBe('assets/img');
    return;
  }
  // NOJS-30 then NOJS-33: re-rendered listing of the same directory, now with the uploaded file
  await expect(page.locator('input[name="eureka__upload-dir"]')).toHaveValue('assets/img');
  await expect(page.locator('input[type="radio"][name="eureka__chosen_item"][value="nojs-upload.png"]')).toHaveCount(1);
  await expect(page.getByRole('status').filter({ hasText: /Uploaded 1 file/ })).toBeVisible();
});
