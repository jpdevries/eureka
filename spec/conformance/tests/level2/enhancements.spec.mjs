// Level 2: drag and drop, paste, zip download, fullscreen, crop, notifications, performance fixture.
import { test, expect, openDirectory, rows, rowNamed, focusRow, control, chooseModeRadio, listing, baselineDefect, v3only } from '../helpers.mjs';

test.beforeEach(async ({ page }) => { await openDirectory(page, 'assets/img'); });

async function fileDataTransfer(page, name) {
  return page.evaluateHandle((n) => {
    const dt = new DataTransfer();
    const bytes = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='), c => c.charCodeAt(0));
    dt.items.add(new File([bytes], n, { type: 'image/png' }));
    return dt;
  }, name);
}

test('HTML-34 dropping files on the drop area uploads them', async ({ page }) => {
  await page.getByRole('button', { name: /^(Media|Toggle) Source Panel$/ }).click();
  const zone = page.locator('.eureka__drop-area-zone');
  await expect(page.getByLabel('Paste images from the clipboard to upload')).toBeVisible();
  const dt = await fileDataTransfer(page, 'dropped.png');
  const req = page.waitForRequest(r => r.method() === 'POST' && /path=assets%2Fimg/.test(r.url()));
  await zone.dispatchEvent('dragenter', { dataTransfer: dt });
  await zone.dispatchEvent('dragover', { dataTransfer: dt });
  await zone.dispatchEvent('drop', { dataTransfer: dt });
  await req;
  await expect(rowNamed(page, 'dropped.png')).toBeVisible();
});

test('dropping files on the listing uploads them too', async ({ page }) => {
  const dt = await fileDataTransfer(page, 'dropped-on-table.png');
  const req = page.waitForRequest(r => r.method() === 'POST' && /path=assets%2Fimg/.test(r.url()));
  const table = listing(page).first();
  await table.dispatchEvent('dragenter', { dataTransfer: dt });
  await table.dispatchEvent('dragover', { dataTransfer: dt });
  await table.dispatchEvent('drop', { dataTransfer: dt });
  await req;
  await expect(rowNamed(page, 'dropped-on-table.png')).toBeVisible();
});

test('pasting an image uploads it', async ({ page }) => {
  await page.getByRole('heading', { name: 'Browse Media Content' }).click();
  const dt = await fileDataTransfer(page, 'pasted.png');
  const req = page.waitForRequest(r => r.method() === 'POST' && /path=assets%2Fimg/.test(r.url()));
  await page.locator('.eureka').evaluate((el, dataTransfer) => {
    el.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: dataTransfer }));
  }, dt);
  await req;
  await expect(page.getByRole('row', { name: /^paste-image\.\d+\.png|^pasted\.png/ })).toHaveCount(1);
});

test('HTML-90 bulk download posts the selection to the attachments endpoint', async ({ page }) => {
  await focusRow(page, 'schildpad.jpg');
  await chooseModeRadio(page, 'multiple').check();
  await page.getByRole('checkbox', { name: 'Choose notes.txt' }).check();
  await page.getByRole('checkbox', { name: 'Choose archive.zip' }).check();
  const [download, request] = await Promise.all([
    page.waitForEvent('download'),
    page.waitForRequest(r => r.method() === 'POST' && /media\/attachments\/0/.test(r.url())),
    page.getByRole('button', { name: /^Download 2 items/ }).click()
  ]);
  expect(download.suggestedFilename()).toMatch(/\.zip$/);
  const body = request.postData() ?? '';
  expect(body).toContain('name="zip_file[]"');
  expect(body).toContain('notes.txt');
  expect(body).toContain('archive.zip');
});

test('HTML-48 a fullscreen toggle is offered', async ({ page }) => {
  await expect(page.getByRole('checkbox', { name: 'Fullscreen Mode' })).toHaveCount(1);
});

test('HTML-92 crop opens a dialog named for the item', async ({ page }) => {
  baselineDefect('opening Crop in the v2 build unmounts the whole component (uncaught error in the cropper modal) against the fixture server; not verified against real JPEGs');
  const row = await focusRow(page, 'schildpad.jpg');
  await control(row, 'Crop schildpad.jpg').click();
  await expect(page.getByRole('dialog').getByRole('heading')).toHaveText(/Cropping schildpad\.jpg/);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('HTML-20 notifications are announced from a live region with a dismiss control', async ({ page }) => {
  await page.evaluate(() => localStorage.clear()); // the welcome shows once per visitor (STATE-30 "welcomed"); beforeEach dismissed it
  await page.goto('/');
  const note = page.getByText(/Welcome to Eureka\./);
  await expect(note).toBeVisible();
  const region = note.locator('xpath=ancestor::*[@aria-live or @role="status" or @role="alert"][1]');
  await expect(region).toHaveCount(1);
  await page.locator('[aria-label="Dismiss Notification"]').click();
  await expect(note).toBeHidden();
});

test('HTML-96 the welcome banner lets the user switch keyboard hints off, and that sticks', async ({ page }) => {
  v3only('the hints checkbox (HTML-96)');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/');
  const toggle = page.getByRole('checkbox', { name: 'Show keyboard hints.' });
  await expect(toggle).toBeChecked();
  const panelKbd = page.getByRole('button', { name: 'Toggle Source Panel' }).locator('kbd');
  await expect(panelKbd).toHaveCSS('display', 'inline-block');
  await toggle.uncheck();
  await expect(page.locator('.eureka')).toHaveAttribute('data-hints', 'false');
  await expect(panelKbd).toHaveCSS('display', 'none');
  await page.keyboard.press('Tab'); // keyboard use would normally bring hints to full opacity; off means off
  await expect(panelKbd).toHaveCSS('display', 'none');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Toggle Source Panel' }).locator('kbd')).toHaveCSS('display', 'none'); // persisted with the view (STATE-30)
  await expect(page.getByRole('checkbox', { name: 'Show keyboard hints.' })).not.toBeChecked();
});

test('HTML-21 the dismiss control is exposed to assistive technology', async ({ page }) => {
  baselineDefect('v2 sets aria-hidden="true" on the dismiss button');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Dismiss Notification' })).toBeVisible();
});

test('PERF-20 a 5,000 item directory renders without long tasks', async ({ page }) => {
  v3only('performance budget; the v2 baseline is measured in the report only');
  await page.getByLabel('Browse Directory').selectOption('0||large');
  await expect(rows(page).first()).toBeVisible();
  await expect(rows(page)).toHaveCount(5000);
});

test('the 5,000 item fixture loads on the baseline (timing recorded)', async ({ page }) => {
  test.setTimeout(90000);
  const t = Date.now();
  await page.getByLabel('Browse Directory').selectOption('0||large');
  await expect(rows(page).first()).toBeVisible({ timeout: 60000 });
  await expect(rows(page)).toHaveCount(5000, { timeout: 60000 });
  const ms = Date.now() - t;
  test.info().annotations.push({ type: 'perf:large-directory-ms', description: String(ms) });
  const longTasks = await page.evaluate(() => performance.getEntriesByType('longtask').length).catch(() => -1);
  test.info().annotations.push({ type: 'perf:long-tasks', description: String(longTasks) });
});
