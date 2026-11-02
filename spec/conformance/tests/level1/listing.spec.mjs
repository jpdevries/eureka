// Level 1: the listing, sorting and filtering (spec/02 §6, §5).
import { test, expect, openDirectory, rows, rowNamed, listing, filterBox, v3only, baselineDefect, TARGET, setAnimatePreviews } from '../helpers.mjs';

test.beforeEach(async ({ page }) => { await openDirectory(page, 'assets/img'); });

test('HTML-60 the listing is a table with the data columns', async ({ page }) => {
  await expect(listing(page)).toHaveCount(1);
  for (const name of ['Media', 'Name', 'Actions', 'Dimensions', 'File Size', 'Edited On']) {
    await expect(page.getByRole('columnheader', { name })).toHaveCount(1);
  }
});

test('HTML-60 the enhanced listing is a grid that explains its keys', async ({ page }) => {
  v3only('role="grid" with usage instructions; v2 set the role without the arrow-key navigation it implies');
  const grid = page.getByRole('grid');
  await expect(grid).toHaveCount(1);
  await expect(grid).toHaveAccessibleDescription(/arrow keys to move between items/);
  await expect(grid.getByRole('row').first()).toBeVisible();
});

test('HTML-62 one row per file, folders are not rows', async ({ page }) => {
  await expect(rows(page)).toHaveCount(11); // assets/img has 11 files and 1 folder
  await expect(page.getByRole('row', { name: /^redwoods/ })).toHaveCount(0);
});

test('HTML-64 rows expose the generated description', async ({ page }) => {
  await expect(page.getByRole('row', { name: /^schildpad\.jpg displays at 336x125, weighs 37 KB, and was edited on \w+, April 0?1, 2017/ })).toHaveCount(1);
  await expect(page.getByRole('row', { name: /^archive\.zip weighs 11 MB, and was edited on/ })).toHaveCount(1);
});

test('HTML-65,69 cells carry dimensions, human size and short date', async ({ page }) => {
  const row = rowNamed(page, 'schildpad.jpg');
  await expect(row).toContainText('336x125');
  await expect(row).toContainText(/37(\.\d+)?[ \u00a0]KB/); // v3 separates the unit with a non-breaking space (I18N-21)
  await expect(row).toContainText(/04\/0?1\/17|2017/);
});

test('HTML-66 media cells render images lazily and other types by icon', async ({ page }) => {
  const img = rowNamed(page, 'schildpad.jpg').locator('img');
  await expect(img).toHaveAttribute('src', /schildpad\.jpg/);
  await expect(rowNamed(page, 'archive.zip').locator('img')).toHaveCount(0);
  await expect(rowNamed(page, 'archive.zip')).toContainText('archive.zip');
});

test('HTML-66b animated media is still until played; Alt+P and "Animate previews" play it', async ({ page }) => {
  v3only('animated media');
  await openDirectory(page, 'assets'); // logo.svg is the fixture's animated SVG; animation.gif (assets/img) its animated raster
  const row = rowNamed(page, 'logo.svg');
  const badge = row.locator('button.eureka__badge--animated');
  await expect(badge).toHaveAccessibleName('Play logo.svg');
  await expect(badge).toHaveAttribute('aria-pressed', 'false');
  const object = row.locator('object.eureka__media-object');
  await expect(object).toHaveAttribute('data-playing', 'false');
  const paused = () => object.evaluate((o) => { const d = o.contentDocument?.documentElement; return d ? { smil: d.animationsPaused(), css: !!o.contentDocument.getElementById('eureka-pause') } : null; });
  await expect.poll(paused).toEqual({ smil: true, css: true });
  await row.focus();
  await page.keyboard.press('Alt+P');
  await expect(object).toHaveAttribute('data-playing', 'true');
  await expect.poll(paused).toEqual({ smil: false, css: false });
  await expect(row.getByRole('button', { name: 'Pause logo.svg' })).toHaveCount(2); // the toolbar action and the badge
  await expect(badge).toHaveAttribute('aria-pressed', 'true');
  await expect(badge).toHaveAccessibleName('Pause logo.svg');
  await page.keyboard.press('Alt+P');
  await expect(object).toHaveAttribute('data-playing', 'false');
  await expect.poll(paused).toEqual({ smil: true, css: true });
  // the listing-level switch plays every animated item and persists
  await setAnimatePreviews(page, true);
  await expect(object).toHaveAttribute('data-playing', 'true');
  await page.reload();
  await expect(rowNamed(page, 'logo.svg').locator('object.eureka__media-object')).toHaveAttribute('data-playing', 'true');
  await openDirectory(page, 'assets/img');
  await expect(rowNamed(page, 'animation.gif').locator('.eureka__media-animated')).toHaveAttribute('data-playing', 'true');
  await setAnimatePreviews(page, false);
});

test('HTML-66b with reduced motion the animated SVG itself holds its CSS animation; the still is the default either way', async ({ page }) => {
  v3only('animated media');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openDirectory(page, 'assets');
  const object = rowNamed(page, 'logo.svg').locator('object.eureka__media-object');
  await expect(object).toHaveAttribute('data-playing', 'false');
  await setAnimatePreviews(page, true);
  await expect(object).toHaveAttribute('data-playing', 'true');
  // the file's own @media (prefers-reduced-motion: no-preference) gate keeps the CSS spinner static even while "playing"
  const running = await object.evaluate((o) => { const el = o.contentDocument.querySelector('.spin'); return el ? getComputedStyle(el).animationName : null; });
  expect(running).toBe('none');
  await setAnimatePreviews(page, false);
});

test('HTML-66 images are lazy and decode asynchronously', async ({ page }) => {
  v3only('loading=lazy and decoding=async on thumbnails');
  const img = rowNamed(page, 'schildpad.jpg').locator('img');
  await expect(img).toHaveAttribute('loading', 'lazy');
  await expect(img).toHaveAttribute('decoding', 'async');
});

test('HTML-61 the sorted column announces its direction', async ({ page }) => {
  await expect(page.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'ascending');
  await expect(page.getByRole('columnheader', { name: 'File Size' })).not.toHaveAttribute('aria-sort', /./);
});

test('HTML-61 sortable headers are buttons', async ({ page }) => {
  v3only('v2 sorts on th click with no keyboard path');
  await expect(page.getByRole('columnheader', { name: 'Name' }).getByRole('button')).toHaveCount(1);
});

test('HTML-45 sort controls reorder the rows and move aria-sort', async ({ page }) => {
  await page.getByLabel('Sort by').selectOption('fileSize');
  await expect(rows(page).first()).toHaveAccessibleName(/^notes\.txt/);
  await expect(page.getByRole('columnheader', { name: 'File Size' })).toHaveAttribute('aria-sort', 'ascending');
  await page.getByLabel('Sort Direction').selectOption('descending');
  await expect(rows(page).first()).toHaveAccessibleName(/^archive\.zip/);
  await expect(page.getByRole('columnheader', { name: 'File Size' })).toHaveAttribute('aria-sort', 'descending');
});

test('HTML-45 sorting by name is alphabetical and reversible', async ({ page }) => {
  const names = async () => (await rows(page).allInnerTexts()).map(t => t.trim().split('\n')[0]);
  await page.getByLabel('Sort by').selectOption('filename');
  await page.getByLabel('Sort Direction').selectOption('ascending');
  // v2 compared raw strings (uppercase first); v3 uses Intl.Collator (I18N-22), so "animation" sorts before "Wide Banner"
  await expect(rows(page).first()).toHaveAccessibleName(TARGET === 'v2' ? /^Wide Banner/ : /^animation\.gif/);
  await page.getByLabel('Sort Direction').selectOption('descending');
  await expect(rows(page).first()).toHaveAccessibleName(TARGET === 'v2' ? /^theme\.mp3/ : /^Wide Banner/);
});

test('HTML-43 the filter narrows rows across name, dimensions, size and date', async ({ page }) => {
  const box = filterBox(page);
  await expect(box).toHaveAttribute('list', /./);
  await box.fill('png');
  await expect(rows(page)).toHaveCount(2);
  await box.fill('1920x1080');
  await expect(rows(page)).toHaveCount(1);
  await expect(rows(page).first()).toHaveAccessibleName(/^hawaii-sunset/);
  await box.fill('MB');
  await expect(rows(page)).toHaveCount(4); // 1.18 MB, 8.01 MB, 2.96 MB, 11.44 MB
  await box.fill('');
  await expect(rows(page)).toHaveCount(11);
});

test('HTML-70 no results state offers to retry or clear', async ({ page }) => {
  await filterBox(page).fill('zzz-nothing');
  await expect(page.getByText(/No results found for "zzz-nothing"/)).toBeVisible();
  await page.getByRole('link', { name: 'clear the search filter' }).click();
  await expect(rows(page)).toHaveCount(11);
  await expect(filterBox(page)).toHaveValue('');
});

test('HTML-70 empty directory state offers to upload', async ({ page }) => {
  await page.getByLabel('Browse Directory').selectOption('0||uploads');
  await expect(page.getByText(/Directory "uploads" appears to be empty/)).toBeVisible();
  await expect(page.getByRole('link', { name: /upload some files/ })).toBeVisible();
});

test('HTML-70 empty and no-result messages are status regions', async ({ page }) => {
  baselineDefect('v2 renders the notice as <p aria-live="assertive"> without a status role');
  await filterBox(page).fill('zzz-nothing');
  await expect(page.getByRole('status').filter({ hasText: /No results found/ })).toBeVisible();
});

test('HTML-70 tbody is not a live region', async ({ page }) => {
  baselineDefect('v2 puts aria-live="polite" on the tbody');
  await expect(page.locator('tbody[aria-live]')).toHaveCount(0);
});

test('HTML-71 no obsolete context menu elements', async ({ page }) => {
  baselineDefect('v2 renders <menu type="context"> per row');
  await expect(page.locator('menu[type="context"]')).toHaveCount(0);
});
