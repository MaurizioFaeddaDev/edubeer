import { describe, expect, it } from 'vitest';
import css from '../../tokens.css?raw';

describe.each(['light', 'dark'])('accessibilità del tema atlante: %s', theme => {
  const blocks = [...css.matchAll(/:root(?:\[data-theme='dark'\])?\s*\{([^}]+)\}/g)];
  const declarations = blocks[0][1] + (theme === 'dark' ? blocks[1][1] : '');
  const tokens = new Map([...declarations.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]));
function luminance(name: string): number {
  const hex = tokens.get(name)?.match(/^#[a-f\d]{6}$/i)?.[0];
  if (!hex) throw new Error(`Colore mancante: ${name}`);
  const values = [1, 3, 5].map(i => { const v = parseInt(hex.slice(i, i + 2), 16) / 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
  return .2126 * values[0] + .7152 * values[1] + .0722 * values[2];
}
const ratio = (a: string, b: string) => { const [lo, hi] = [luminance(a), luminance(b)].sort((x, y) => x - y); return (hi + .05) / (lo + .05); };
  it('mantiene il testo AA su tutte le superfici di lettura', () => {
    for (const text of ['foreground', 'foreground-muted', 'foreground-faint', 'accent-ink']) {
      for (const surface of ['background', 'surface-1', 'surface-2', 'surface-3', 'accent-soft']) {
        expect(ratio(text, surface), `${text} su ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
  it('mantiene le azioni primarie AA anche in hover', () => {
    for (const surface of ['accent', 'accent-hover']) expect(ratio('on-accent', surface)).toBeGreaterThanOrEqual(4.5);
  });
  it('mantiene distinguibili controlli e serie quantitative', () => {
    for (const ink of ['border', 'accent', 'series-1', 'series-2', 'series-3', 'series-4', 'series-5']) {
      for (const surface of ['background', 'surface-1', 'surface-2']) expect(ratio(ink, surface), `${ink} su ${surface}`).toBeGreaterThanOrEqual(3);
    }
  });
});
