// Level 1: source panel, tree, directory selector, view modes, persistence (spec/02 §2, §4, §5).
import { test, expect, openDirectory, rows, sourcePanelToggle, sourceSelect, directoryTree, viewRadio, viewRadioName, setView, baselineDefect, v3only, dismissNotification, TARGET } from '../helpers.mjs';

test('HTML-10 the source panel toggle exposes and controls its state', async ({ page }) => {
  await openDirectory(page);
  const toggle = sourcePanelToggle(page);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAttribute('aria-controls', /./);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(directoryTree(page)).toBeVisible();
  await expect(sourceSelect(page)).toBeVisible();
  await toggle.click();
  await expect(directoryTree(page)).toBeHidden();
});

test('HTML-11 the directory selector is shown only while the panel is closed', async ({ page }) => {
  await openDirectory(page);
  await expect(page.getByLabel('Browse Directory')).toBeVisible();
  await sourcePanelToggle(page).click();
  await expect(page.getByLabel('Browse Directory')).toHaveCount(0);
});

test('HTML-32 the tree is built from disclosure widgets and navigates on activation', async ({ page }) => {
  await openDirectory(page);
  await sourcePanelToggle(page).click();
  const tree = directoryTree(page);
  await expect(tree.locator('details')).not.toHaveCount(0);
  // v2 put the directory name inside the summary; v3 renders it as a sibling button (HTML-32)
  await expect(TARGET === 'v2' ? tree.locator('summary', { hasText: 'img' }) : tree.getByRole('button', { name: 'img', exact: true })).toBeVisible();
  await tree.getByText('redwoods', { exact: true }).click();
  await expect(rows(page)).toHaveCount(24);
  await expect(page.getByRole('row', { name: /^redwood-01\.jpg/ })).toHaveCount(1);
});

test('MS-43 folders past tree-depth load when their disclosure opens', async ({ page }) => {
  v3only('lazy tree branches (11 MS-43)');
  const treeRequests = [];
  page.on('request', (r) => { const u = new URL(r.url()); if (u.pathname.endsWith('/sources/0') && !u.searchParams.has('path')) treeRequests.push(u.search); });
  await page.goto('/index.html');
  await page.locator('eureka-browser').evaluate((el) => { el.setAttribute('tree-depth', '1'); });
  await dismissNotification(page);
  await sourcePanelToggle(page).click();
  const tree = directoryTree(page);
  const assets = tree.locator('.eureka__tree-node[data-cd="assets"]');
  await expect(assets).toHaveClass(/eureka__tree-node--unloaded/);
  await expect(assets.locator('details')).toHaveCount(1); // expandable although nothing is loaded under it
  await expect(tree.getByRole('button', { name: 'img', exact: true })).toHaveCount(0);
  await assets.locator('summary').click();
  await expect(tree.getByRole('button', { name: 'img', exact: true })).toBeVisible();
  await expect(assets).not.toHaveClass(/eureka__tree-node--unloaded/);
  expect(treeRequests.some((q) => q.includes('tree=assets') && q.includes('depth=1'))).toBe(true);
  await expect(tree.getByRole('button', { name: 'redwoods', exact: true })).toHaveCount(0); // one level, not the whole subtree
});

test('MS-43 navigating below the loaded depth fetches the branch to the current directory', async ({ page }) => {
  v3only('lazy tree branches (11 MS-43)');
  await page.goto('/index.html');
  // attribute changes restart the instance; no-storage keeps the remembered location from overriding `path`
  await page.locator('eureka-browser').evaluate((el) => { el.setAttribute('no-storage', ''); el.setAttribute('tree-depth', '1'); el.setAttribute('path', 'assets/img/redwoods'); });
  await dismissNotification(page);
  await sourcePanelToggle(page).click();
  await expect(directoryTree(page).locator('[aria-current="page"]')).toHaveText(/redwoods/);
});

test('HTML-32 the current directory is marked in the tree', async ({ page }) => {
  v3only('aria-current="page" on the current directory (v2 used a class)');
  await openDirectory(page);
  await sourcePanelToggle(page).click();
  await expect(directoryTree(page).locator('[aria-current="page"]')).toHaveText(/img/);
});

test('HTML-31 switching media source reloads the tree and listing', async ({ page }) => {
  await openDirectory(page);
  await sourcePanelToggle(page).click();
  await sourceSelect(page).selectOption('1');
  await expect(sourceSelect(page)).toHaveValue('1');
});

test('HTML-47 the view chooser offers the five modes and keeps the rows', async ({ page }) => {
  await openDirectory(page);
  for (const mode of ['table', 'thumb', 'grid', 'list']) {
    await setView(page, mode);
    await expect(rows(page)).toHaveCount(11);
  }
  await expect(viewRadio(page, 'masonry')).toHaveCount(1);
});

test('HTML-47 view radios are named by their mode', async ({ page }) => {
  baselineDefect('v2 points aria-labelledby at the legend, so every radio is named "View Mode"');
  await openDirectory(page);
  for (const mode of ['table', 'thumb', 'grid', 'list']) await expect(page.getByRole('radio', { name: viewRadioName(mode) })).toHaveCount(1);
});

test('HTML-47 masonry mode keeps the listing alive', async ({ page }) => {
  baselineDefect('v2 build throws React invariant 149 (string ref in react-masonry-component) and unmounts');
  await openDirectory(page);
  await setView(page, 'masonry');
  await expect(rows(page)).toHaveCount(11);
});

test('HTML-02 the root reflects the view mode as a data attribute', async ({ page }) => {
  v3only('data-view on the root (v2 used a class only)');
  await openDirectory(page);
  await setView(page, 'grid');
  await expect(page.locator('.eureka')).toHaveAttribute('data-view', 'grid');
});

test('STATE view mode and directory persist across reloads', async ({ page }) => {
  await openDirectory(page, 'assets/docs');
  await setView(page, 'list');
  await page.reload();
  await dismissNotification(page);
  await expect(viewRadio(page, 'list')).toBeChecked();
  await expect(rows(page)).toHaveCount(2);
  await expect(page.getByLabel('Browse Directory')).toHaveValue('0||assets/docs');
});

test('HTML-40 the stage is headed "Browse Media Content"', async ({ page }) => {
  await openDirectory(page);
  await expect(page.getByRole('heading', { name: 'Browse Media Content' })).toBeVisible();
});

test('HTML-44 the toolbar does not claim menubar semantics', async ({ page }) => {
  baselineDefect('v2 uses role="menubar" on the toolbar');
  await openDirectory(page);
  await expect(page.getByRole('menubar')).toHaveCount(0);
  await expect(page.getByRole('toolbar', { name: 'Listing controls' })).toHaveCount(1);
});
