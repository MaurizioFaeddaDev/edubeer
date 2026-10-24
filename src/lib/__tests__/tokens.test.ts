import { describe, expect, it } from 'vitest';
import css from '../../tokens.css?raw';

// ─────────────────────────────────────────────────────────────────────────────
// Guardia sul tema: i token dichiarati devono reggere il contrasto AA.
// DESIGN.md: «il contrasto si verifica, non si presume». Se qualcuno cambia un
// valore in src/tokens.css e rompe una coppia testo/sfondo, la suite diventa
// rossa prima che il sito arrivi a un lettore.
// ─────────────────────────────────────────────────────────────────────────────

// Il CSS arriva grezzo da Vite (?raw): niente dipendenze Node nel typecheck.

function tokens(source: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const match of source.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    map.set(match[1], match[2].trim());
  }
  return map;
}

function hexOf(value: string | undefined): string {
  const hex = value?.match(/#[0-9a-fA-F]{6}\b/)?.[0];
  if (!hex) throw new Error(`Token senza hex: ${value ?? '(mancante)'}`);
  return hex;
}

const luminance = (hex: string): number => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

function contrast(a: string, b: string): number {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

const T = tokens(css);
const AA_TEXT = 4.5;
const AA_NON_TEXT = 3;
const pair = (fg: string, bg: string): number => contrast(hexOf(T.get(fg)), hexOf(T.get(bg)));

describe('tokens — contratto semantico', () => {
  it('espone i token strutturali del tema neo-paper', () => {
    for (const name of [
      'background', 'surface-1', 'surface-2', 'surface-3',
      'border', 'border-soft', 'foreground', 'foreground-muted', 'foreground-faint',
      'accent', 'accent-2', 'accent-3', 'accent-4', 'positive', 'danger',
      'accent-ink', 'accent-2-ink', 'accent-3-ink', 'accent-4-ink', 'positive-ink', 'danger-ink',
      'series-1', 'series-2', 'series-3', 'series-4', 'series-5',
      'bw-2', 'shadow-hard', 'radius', 'radius-xs', 'radius-sm', 'radius-lg', 'radius-pill', 'font-display', 'fs-display',
    ]) {
      expect(T.has(name), `token --${name} mancante`).toBe(true);
    }
  });
});

describe('tokens — contrasto AA calcolato', () => {
  const surfaces = ['background', 'surface-1', 'surface-2', 'surface-3'];

  it('testo principale e secondario su ogni superficie ≥ 4.5:1', () => {
    for (const ink of ['foreground', 'foreground-muted', 'foreground-faint']) {
      for (const surface of surfaces) {
        expect(pair(ink, surface), `${ink} su ${surface}`).toBeGreaterThanOrEqual(AA_TEXT);
      }
    }
  });

  it('inchiostro su ogni pieno e su ogni tinta soft ≥ 4.5:1', () => {
    for (const fill of ['accent', 'accent-2', 'accent-3', 'accent-4', 'positive', 'danger']) {
      expect(pair('foreground', fill), `foreground su ${fill}`).toBeGreaterThanOrEqual(AA_TEXT);
    }
    for (const soft of ['accent-soft', 'accent-2-soft', 'accent-3-soft', 'accent-4-soft', 'positive-soft', 'danger-soft']) {
      expect(pair('foreground', soft), `foreground su ${soft}`).toBeGreaterThanOrEqual(AA_TEXT);
      expect(pair('foreground-muted', soft), `foreground-muted su ${soft}`).toBeGreaterThanOrEqual(AA_TEXT);
    }
    // Testo secondario sopra il giallo: usato da `.chip.on em`.
    expect(pair('foreground-muted', 'accent'), 'foreground-muted su accent').toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('ogni -ink regge su carta e sulla propria tinta soft', () => {
    const couples: [string, string][] = [
      ['accent-ink', 'accent-soft'],
      ['accent-2-ink', 'accent-2-soft'],
      ['accent-3-ink', 'accent-3-soft'],
      ['accent-4-ink', 'accent-4-soft'],
      ['positive-ink', 'positive-soft'],
      ['danger-ink', 'danger-soft'],
    ];
    for (const [ink, soft] of couples) {
      expect(pair(ink, 'surface-1'), `${ink} su surface-1`).toBeGreaterThanOrEqual(AA_TEXT);
      expect(pair(ink, soft), `${ink} su ${soft}`).toBeGreaterThanOrEqual(AA_TEXT);
    }
  });

  it('i confini dei controlli arrivano a 3:1 (WCAG 1.4.11)', () => {
    for (const surface of ['background', 'surface-1', 'surface-2']) {
      expect(pair('border', surface), `border su ${surface}`).toBeGreaterThanOrEqual(AA_NON_TEXT);
    }
    for (const fill of ['accent', 'accent-2', 'accent-3', 'accent-4', 'positive', 'danger']) {
      expect(pair('border', fill), `border su ${fill}`).toBeGreaterThanOrEqual(AA_NON_TEXT);
    }
  });
});
