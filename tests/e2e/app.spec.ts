import { expect, test } from '@playwright/test';

test('radar legend hover keeps page height and scroll stable', async ({ page }) => {
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#/confronta?stili=3B,5D,25B');
    if (!await page.locator('.radar-details').evaluate(el => (el as HTMLDetailsElement).open)) {
      await page.locator('.radar-details summary').click();
    }
    await expect(page.locator('.radar > svg')).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const geometry = () => page.evaluate(() => ({ height: document.documentElement.scrollHeight, scroll: window.scrollY }));
    const buttons = page.locator('.radar-legend button');
    for (let i = 0; i < await buttons.count(); i++) {
      await page.mouse.move(0, 0);
      await buttons.nth(i).scrollIntoViewIfNeeded();
      const before = await geometry();
      await buttons.nth(i).hover();
      for (let frame = 0; frame < 12; frame++) {
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
        expect(await geometry()).toEqual(before);
      }
      await expect(page.locator('.radar-caption > .active b')).toHaveCount(1);
      await buttons.nth(i).click();
      await expect(buttons.nth(i)).toHaveAttribute('aria-pressed', 'false');
      await buttons.nth(i).click();
    }
    await page.screenshot({ path: `.tmp/radar-hover-${width}.png` });
  }
});

test('color intervals, category chips and normalized URL ranges', async ({ page }) => {
  await page.goto('/#/?srm=3-4&cat=Czech+Lager');
  await expect(page.locator('.style-entry h3')).toContainText(['Czech Pale Lager', 'Czech Premium Pale Lager']);
  await expect(page.locator('.active-filters')).toContainText('Czech Lager');
  await page.locator('.active-filters button').filter({ hasText: 'Czech Lager' }).click();
  await expect(page).not.toHaveURL(/cat=/);
  await page.goto('/#/birre?stile=3B&srm=3-4&cat=Czech+Lager');
  await expect(page.locator('.bcard').first()).toBeVisible();
  await expect(page.locator('.active-filters')).toContainText('Czech Lager');
  await page.goto('/#/?abv=12-4');
  await page.getByRole('button', { name: 'Filtri e ordinamento', exact: true }).click();
  await expect(page.locator('.dual-value').first()).toHaveText('4–12%');
  await expect(page.getByRole('slider', { name: 'Colore massimo' })).toHaveAttribute('max', '40');
  await expect(page.getByRole('slider', { name: 'Colore minimo' })).toHaveAttribute('min', '1');
});

test('return links retain filters, scroll and keyboard focus', async ({ page }) => {
  await page.goto('/#/birre?q=pilsner');
  const resultCount = await page.locator('.bcard').count();
  const link = page.locator('.bcard-main').nth(12);
  await link.focus();
  const before = await page.evaluate(() => scrollY);
  expect(before).toBeGreaterThan(0);
  await link.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.getByRole('button', { name: '← Torna alle birre', exact: true }).click();
  await expect(page).toHaveURL(/#\/birre\?q=pilsner$/);
  await expect(page.locator('.bcard')).toHaveCount(resultCount);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before - 80);
});

test('production hides editorial links and blocks direct deep-dive URLs', async ({ page }) => {
  for (const hash of ['#/', '#/birre', '#/stili/25B']) {
    await page.goto('/' + hash);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('a[href^="#/approfondimenti"], a[href^="#/a/"]')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Storie da approfondire' })).toHaveCount(0);
  }
  for (const hash of ['#/approfondimenti?q=dupont', '#/a/saison-dupont']) {
    await page.goto('/' + hash);
    await expect(page.getByRole('heading', { name: 'Scheda non trovata' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Scheda non trovata' })).toBeVisible();
  }
});

test('comparison syncs tabs and imports a share link without duplicate IDs', async ({ page, context }) => {
  await page.goto('/#/confronta?stili=3B,3B,invalid,5D');
  await expect(page.locator('.interval-row')).toHaveCount(6);
  const second = await context.newPage();
  await second.goto('/#/confronta');
  await expect(second.locator('.interval-row')).toHaveCount(6);
  await page.locator('#compare-search').fill('Saison');
  await page.locator('.compare-suggestions button').first().click();
  await expect(second.locator('.interval-row')).toHaveCount(9);
  await second.getByRole('button', { name: 'Rimuovi German Pils dal confronto' }).click();
  await expect(page.locator('.interval-row')).toHaveCount(6);
  await page.getByText('Condividi questo confronto', { exact: true }).click();
  const share = await page.locator('#compare-link').inputValue();
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Clipboard unavailable'); } } }));
  await page.getByRole('button', { name: 'Copia link', exact: true }).click();
  await expect(page.locator('.compare-share [role="status"]')).toHaveText('Copia il link dal campo qui sotto.');

  await second.getByRole('button', { name: 'Svuota il confronto' }).click();
  await expect(page.locator('.interval-row')).toHaveCount(0);
  await second.goto(share);
  await expect(second.locator('.interval-row')).toHaveCount(6);
  await expect(page.locator('.interval-row')).toHaveCount(6);
  await second.evaluate(() => localStorage.clear());
  await expect(page.locator('.interval-row')).toHaveCount(0);
});

test('searchable style filter, glossary, CSV and empty states', async ({ page }) => {
  await page.goto('/#/birre');
  await page.getByRole('button', { name: 'Filtri e ordinamento', exact: true }).click();
  await page.getByRole('button', { name: 'stili: Tutti gli stili', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Cerca stili' }).fill('3B');
  await page.getByRole('checkbox', { name: /3B · Czech Premium/ }).check();
  await page.getByRole('searchbox', { name: 'Cerca stili' }).press('Escape');
  await expect(page.getByRole('button', { name: /stili: 3B/ })).toBeFocused();
  await page.locator('.metric-glossary summary').click();
  await expect(page.locator('.metric-glossary dd').first()).toContainText('percentuale di alcol');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: /CSV/ }).click();
  expect((await download).suggestedFilename()).toMatch(/\.csv$/);
  await page.getByRole('button', { name: 'Apri ricerca', exact: true }).click();
  await page.getByRole('combobox', { name: 'Cerca nella guida e nel catalogo' }).fill('nonexistentzzzz');
  await expect(page.getByRole('heading', { name: 'Nessuna birra trovata' })).toBeVisible();
  await page.getByRole('combobox', { name: 'Cerca nella guida e nel catalogo' }).press('Escape');
  await page.getByRole('button', { name: 'Azzera i filtri', exact: true }).click();
  await expect(page.locator('.bcard')).toHaveCount(60);
  await expect(page.locator('.catalog-pagination')).toContainText('60 di 613');
  const fullDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /CSV/ }).click();
  const stream = await (await fullDownloadPromise).createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  expect(Buffer.concat(chunks).toString('utf8').split('\r\n')).toHaveLength(614);
  await page.getByRole('button', { name: 'Mostra altre 60 birre' }).click();
  await expect(page.locator('.bcard')).toHaveCount(120);
  await expect(page.locator('.bcard-main').nth(60)).toBeFocused();
  await page.locator('.bcard-main').nth(70).click();
  await page.getByRole('button', { name: '← Torna alle birre', exact: true }).click();
  await expect(page.locator('.bcard')).toHaveCount(120);
});

test('keyboard search, comparison limits, malformed links and missing values', async ({ page }) => {
  await page.goto('/#/');
  await page.keyboard.press('/');
  const search = page.getByRole('combobox', { name: 'Cerca nella guida e nel catalogo' });
  await search.fill('German Pils'); await search.press('ArrowDown'); await search.press('Enter');
  await expect(page.getByRole('heading', { name: 'German Pils', exact: true, level: 1 })).toBeVisible();
  await page.goto('/#/confronta?stili=1A,1B,1C,1D,2A,2B');
  await expect(page.locator('#compare-search')).toBeDisabled();
  await expect(page.locator('.interval-row')).toHaveCount(15);
  await page.locator('.radar-details summary').click();
  await page.locator('.radar-legend button').first().click();
  await expect(page.locator('.radar-legend button').first()).toHaveAttribute('aria-pressed', 'false');
  await page.goto('/#/stili/%E0%A4%A');
  await expect(page.getByRole('heading', { name: 'Scheda non trovata' })).toBeVisible();
  await page.goto('/#/stili/27-kellerbier');
  await expect(page.getByRole('img', { name: 'Colore non dichiarato' })).toBeVisible();
  await expect(page.locator('.style-numbers dd')).toHaveText(['—', '—', '—']);
});

for (const width of [1440, 1024, 390, 320]) {
  test(`responsive routes at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    for (const [index, hash] of ['#/', '#/stili/3B', '#/confronta?stili=3B,5D', '#/birre?q=pilsner', '#/b/pilsner-urquell'].entries()) {
      await page.goto('/' + hash);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('h1')).not.toHaveText('Scheda non trovata');
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: info.outputPath(`route-${index}-${width}.png`), fullPage: index === 4 });
    }
    await page.screenshot({ path: info.outputPath(`detail-${width}.png`), fullPage: true });
    expect(errors).toEqual([]);
  });
}



test('desktop preview scrolls independently at desktop and tablet widths', async ({ page }) => {
  for (const width of [1440, 900]) {
    await page.setViewportSize({ width, height: 650 });
    await page.goto('/#/');
    const preview = page.getByRole('complementary', { name: 'Anteprima dello stile' });
    await expect(preview).toBeVisible();
    await expect.poll(() => preview.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
    await preview.focus();
    await page.keyboard.press('End');
    await expect.poll(() => preview.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
    await expect(preview.getByRole('link', { name: 'Leggi la scheda completa' })).toBeInViewport();
  }
});
