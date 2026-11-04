// axe-core on each major state. Fails for v3, reports for the v2 baseline (see helpers.axeCheck).
import { test, expect, openDirectory, focusRow, control, setView, chooseModeRadio, axeCheck, v3only } from '../helpers.mjs';

test('axe: Level 0 form', async ({ page }) => {
  await page.goto('/nojs');
  await axeCheck(page, 'level0');
});

test('axe: Level 0 form, dark scheme (THEME-05/07)', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/nojs');
  await axeCheck(page, 'level0-dark');
});

test('axe: enhanced table, dark scheme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await openDirectory(page, 'assets/img');
  await axeCheck(page, 'table-dark');
});

test('axe: enhanced table', async ({ page }) => {
  await openDirectory(page, 'assets/img');
  await axeCheck(page, 'table');
});

test('axe: focused row with actions', async ({ page }) => {
  await openDirectory(page, 'assets/img');
  await focusRow(page, 'schildpad.jpg');
  await axeCheck(page, 'row-focused');
});

test('axe: animated previews playing (HTML-66b)', async ({ page }) => {
  v3only('animated media');
  await openDirectory(page, 'assets');
  await focusRow(page, 'logo.svg');
  await page.keyboard.press('Alt+P');
  await axeCheck(page, 'animated-playing');
});

test('axe: row context menu open (HTML-71)', async ({ page }) => {
  v3only('popover context menu');
  await openDirectory(page, 'assets/img');
  await setView(page, 'grid');
  await focusRow(page, 'schildpad.jpg');
  await page.keyboard.press('Shift+F10');
  await expect(page.getByRole('menu')).toBeVisible();
  await axeCheck(page, 'context-menu');
});

test('axe: grid mode', async ({ page }) => {
  await openDirectory(page, 'assets/img');
  await setView(page, 'grid');
  await axeCheck(page, 'grid');
});

test('axe: multiple choice with source panel open', async ({ page }) => {
  await openDirectory(page, 'assets/img');
  await chooseModeRadio(page, 'multiple').check();
  await page.getByRole('button', { name: /^(Media|Toggle) Source Panel$/ }).click();
  await axeCheck(page, 'multiple-panel');
});

test('axe: rename dialog', async ({ page }) => {
  await openDirectory(page, 'assets/img');
  const row = await focusRow(page, 'notes.txt');
  await control(row, 'Rename notes.txt').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await axeCheck(page, 'dialog');
});

for (const scheme of ['dark', 'light']) test(`A11Y-57 hovering a folder tile never lowers its contrast (${scheme} scheme)`, async ({ page }) => {
  v3only('hover keeps contrast (A11Y-57)');
  await page.emulateMedia({ colorScheme: scheme });
  await openDirectory(page, 'assets');
  await setView(page, 'grid');
  const tile = page.locator('tr[data-kind="folder"][data-path="assets/img"] .eureka__folder-tile');
  await expect(tile).toBeVisible();
  const contrast = () => tile.evaluate((el) => {
    const parse = (c) => c.match(/[\d.]+/g).slice(0, 3).map(Number);
    const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const name = el.querySelector('.eureka__folder-tile__name');
    const text = parse(getComputedStyle(name).color), bg = parse(getComputedStyle(el).backgroundColor);
    const [hi, lo] = [lum(text), lum(bg)].sort((a, b) => b - a);
    return (hi + 0.05) / (lo + 0.05);
  });
  const resting = await contrast();
  await tile.hover();
  await expect(tile).toHaveCSS('border-color', /rgb/); // the hover state has applied
  const hovered = await contrast();
  expect(hovered).toBeGreaterThanOrEqual(4.5);
  expect(hovered).toBeGreaterThanOrEqual(resting - 1e-9); // never lower than at rest
  expect(await tile.locator('.icon').evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
});
