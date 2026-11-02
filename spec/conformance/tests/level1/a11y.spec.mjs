// axe-core on each major state. Fails for v3, reports for the v2 baseline (see helpers.axeCheck).
import { test, expect, openDirectory, focusRow, control, setView, chooseModeRadio, axeCheck } from '../helpers.mjs';

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
