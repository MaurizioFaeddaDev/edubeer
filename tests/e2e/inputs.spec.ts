import { expect, test } from '@playwright/test';

test('input layouts fit their containers across pages and viewport sizes', async ({ page }) => {
  for (const width of [1440, 768, 375]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/birre', '/confronta?stili=3B,5D']) {
      await page.goto(`/#${route}`);
      const checkInputs = async () => {
        const fields = await page.locator('input:visible').evaluateAll(inputs => inputs.map(el => {
          const bounds = el.getBoundingClientRect();
          const box = el.closest('.searchbox')?.getBoundingClientRect();
          return {
            type: (el as HTMLInputElement).type,
            bounds: { x: bounds.x, width: bounds.width, height: bounds.height },
            fit: !box || (bounds.left >= box.left && bounds.right <= box.right),
          };
        }));
        for (const { type, bounds, fit } of fields) {
          expect(bounds.x).toBeGreaterThanOrEqual(0);
          expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
          if (type === 'checkbox') {
            expect(bounds.width).toBeGreaterThanOrEqual(16);
            expect(bounds.height).toBeGreaterThanOrEqual(13);
          } else {
            expect(bounds.width, `${route}: ${type} width`).toBeGreaterThan(140);
            expect(bounds.height).toBeGreaterThanOrEqual(type === 'range' ? 40 : 44);
          }
          if (type === 'search') {
            expect(fit).toBe(true);
          }
        }
      };
      await page.getByRole('button', { name: 'Apri ricerca', exact: true }).click();
      const globalSearch = page.getByRole('combobox', { name: 'Cerca nella guida e nel catalogo' });
      await expect.poll(async () => (await globalSearch.boundingBox())?.width ?? 0).toBeGreaterThan(140);
      await checkInputs();
      await globalSearch.press('Escape');
      await expect(page.locator('.topsearch .searchbox')).toHaveCSS('width', '46px');

      if (route === '/' || route === '/birre') {
        const toggle = page.getByRole('button', { name: 'Filtri e ordinamento', exact: true });
        if (await toggle.getAttribute('aria-expanded') === 'false') await toggle.click();
        await checkInputs();
        const pickers = page.locator('.ms-trigger');
        for (let i = 0; i < await pickers.count(); i++) {
          await pickers.nth(i).click();
          await checkInputs();
          await page.locator('.ms-search input').fill('lager');
          await expect(page.locator('.ms-list')).toBeVisible();
          await page.locator('.ms-search input').press('Escape');
        }
      }
      if (route.startsWith('/confronta')) {
        await page.getByText('Condividi questo confronto', { exact: true }).click();
        await checkInputs();
        await page.locator('#compare-search').fill('Saison');
        await expect(page.locator('.compare-suggestions button')).not.toHaveCount(0);
      }
    }
  }
});
