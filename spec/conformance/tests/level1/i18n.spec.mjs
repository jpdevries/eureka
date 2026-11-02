// Level 0/1: catalogs and locale loading (spec/09). The fixture server offers `xx`, a pseudo-locale that brackets every
// English message, so a translated string is distinguishable from the English fallback.
import { test, expect, v3only } from '../helpers.mjs';

test('I18N-12 the server renders the request locale and the enhanced layer keeps it', async ({ page }) => {
  v3only('catalog files and embedding');
  await page.goto('/nojs?path=assets/img&ln=xx');
  await expect(page.getByRole('heading', { name: /\[Media Content\]/ })).toBeVisible();
  await expect(page.locator('form.eureka')).toHaveAttribute('lang', 'xx');
  await page.goto('/?path=assets/img&ln=xx');
  await expect(page.getByRole('region', { name: /\[Media Browser\]/ })).toBeVisible(); // enhanced from the embedded catalog, no fetch
  await expect(page.getByRole('region', { name: /\[Media Browser\]/ })).toHaveAttribute('lang', 'xx');
  await expect(page.getByRole('heading', { name: /\[Media Content\]/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /\[Toggle Source Panel\]/ })).toBeVisible();
  const requests = [];
  page.on('request', (r) => { if (r.url().includes('/assets/i18n/')) requests.push(r.url()); });
  await page.waitForTimeout(300);
  expect(requests).toEqual([]);
});

test('I18N-11 a client-side locale change fetches its catalog and re-renders in place, falling back per message', async ({ page }) => {
  v3only('catalog loading');
  await page.goto('/index.html');
  await expect(page.getByRole('heading', { name: 'Media Content' })).toBeVisible();
  const fetched = page.waitForResponse((r) => r.url().endsWith('/assets/i18n/xx.json'));
  await page.locator('eureka-browser').evaluate((el) => el.setAttribute('lang', 'xx'));
  expect((await fetched).status()).toBe(200);
  await expect(page.getByRole('heading', { name: /\[Media Content\]/ })).toBeVisible();
  await expect(page.getByRole('region', { name: /\[Media Browser\]/ })).toHaveAttribute('lang', 'xx');
  // an unknown locale keeps English (I18N-03) after a 404 on its catalog
  await page.locator('eureka-browser').evaluate((el) => el.setAttribute('lang', 'zz'));
  await expect(page.getByRole('heading', { name: 'Media Content' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Media Browser' })).toHaveAttribute('lang', 'en'); // the root names the language of its text
});
