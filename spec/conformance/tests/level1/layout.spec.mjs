// Level 1: layout modes at wide and narrow widths (spec/04). Runs in the
// "enhanced" (desktop) and "enhanced-narrow" (phone) projects.
import { test, expect, openDirectory, rows, rowNamed, focusRow, setView, control, isVisuallyHidden, v3only } from '../helpers.mjs';

test.beforeEach(async ({ page }) => { await openDirectory(page, 'assets/img'); });

test('LAY-20/23 table mode shows data columns only when wide', async ({ page }, testInfo) => {
  const narrow = testInfo.project.name.includes('narrow');
  const dims = rowNamed(page, 'schildpad.jpg').getByText('336x125');
  const header = page.getByRole('columnheader', { name: 'Dimensions' });
  if (narrow) { await expect(dims).toBeHidden(); expect(await isVisuallyHidden(header)).toBe(true); }
  else { await expect(dims).toBeVisible(); expect(await isVisuallyHidden(header)).toBe(false); }
});

test('LAY-30 thumb, grid and masonry hide everything but the media', async ({ page }) => {
  for (const mode of ['thumb', 'grid']) {
    await setView(page, mode);
    const row = rowNamed(page, 'schildpad.jpg');
    await expect(row.locator('img')).toBeVisible();
    await expect(row.getByText('336x125')).toBeHidden();
    expect(await isVisuallyHidden(page.getByRole('columnheader', { name: 'Name' }))).toBe(true);
  }
});

test('LAY-34 masonry packs items in columns without JavaScript', async ({ page }) => {
  v3only('masonry tiers');
  await setView(page, 'masonry');
  const tbody = page.locator('.eureka__table > tbody');
  const layout = await tbody.evaluate((el) => { const cs = getComputedStyle(el); return { display: cs.display, columnCount: cs.columnCount, columnWidth: cs.columnWidth, rows: cs.gridTemplateRows }; });
  const native = layout.display === 'masonry' || layout.rows === 'masonry';
  if (!native) expect(layout.columnWidth !== 'auto' || Number(layout.columnCount) > 1).toBe(true); // multi-column fallback
  // whole images: the first two items have different heights (different aspect ratios), none is cropped
  const boxes = await Promise.all(['schildpad.jpg', 'tall-tree.png'].map((n) => rowNamed(page, n).locator('img').boundingBox()));
  expect(Math.abs(boxes[0].height - boxes[1].height)).toBeGreaterThan(20);
  const fit = await rowNamed(page, 'tall-tree.png').locator('img').evaluate((img) => getComputedStyle(img).objectFit);
  expect(fit).not.toBe('cover');
});

test('LAY-21 the actions row appears only on the focused row and spans the row', async ({ page }) => {
  await setView(page, 'table');
  const row = await focusRow(page, 'schildpad.jpg');
  const actions = control(row, 'Choose schildpad.jpg');
  await expect(actions).toBeVisible();
  const rowBox = await row.boundingBox();
  const btnBox = await actions.boundingBox();
  expect(btnBox.y).toBeGreaterThan(rowBox.y); // below the data cells, inside the row
  expect(btnBox.y + btnBox.height).toBeLessThanOrEqual(rowBox.y + rowBox.height + 1);
});

test('LAY-31 thumb mode lays rows out side by side when wide', async ({ page }, testInfo) => {
  await setView(page, 'thumb');
  // the first two items in sort order sit side by side in thumb mode at every width (two across when narrow); in v3 the first is the subfolder
  const items = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
  const a = await items.nth(0).boundingBox();
  const b = await items.nth(1).boundingBox();
  expect(Math.abs(a.y - b.y)).toBeLessThan(Math.max(a.height, b.height));
  expect(b.x).toBeGreaterThan(a.x);
});

test('LAY-12 the listing body scrolls independently when wide', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes('narrow'), 'narrow layout scrolls the page');
  test.setTimeout(120000);
  await page.getByLabel('Browse Directory').selectOption('0||large');
  await expect(rows(page).first()).toBeVisible({ timeout: 90000 });
  const scrollable = await page.evaluate(() => {
    const tb = document.querySelector('.eureka__table tbody');
    return tb && tb.scrollHeight > tb.clientHeight && getComputedStyle(tb).overflowY !== 'visible';
  });
  expect(scrollable).toBeTruthy();
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1)).toBeTruthy();
});
