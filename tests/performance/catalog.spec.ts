import { test } from '@playwright/test';

// Diagnostic only: repeatable CPU-throttled browser, not a physical phone or INP.
test('catalog typing and render profile', async ({ page, context }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
  await page.goto('/#/birre');
  await page.locator('.bcard').first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  const domNodes = await page.locator('*').count();
  const times: number[] = [];
  console.log(`Initial DOM: ${domNodes} nodes`);
  for (let i = 0; i < 1; i++) {
    for (const query of ['p', 'pi', 'pil', 'pils', '']) {
      const elapsed = await page.evaluate(async value => {
        const input = document.querySelector<HTMLInputElement>('.topsearch input')!;
        const start = performance.now();
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        return performance.now() - start;
      }, query);
      times.push(elapsed);
      console.log(`query=${query || '(clear)'} elapsed=${Math.round(elapsed)}ms cards=${await page.locator('.bcard').count()}`);
    }
  }
  times.sort((a, b) => a - b);
  const result = { cpuSlowdown: 6, viewport: '390x844', domNodes, samples: times.length, medianMs: times[Math.floor(times.length / 2)], p95Ms: times[Math.ceil(times.length * .95) - 1], note: 'Synthetic input event to two animation frames inside the browser. Not field INP.' };
  console.log(JSON.stringify(result));
  await info.attach('profile', { body: JSON.stringify(result, null, 2), contentType: 'application/json' });
});
