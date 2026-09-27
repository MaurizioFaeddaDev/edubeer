import { describe, expect, it } from 'vitest';
import { darken, lighten, srmToHex } from '../color';

// ─────────────────────────────────────────────────────────────────────────────
// T-003 — suite sulla conversione SRM → colore. Gli ancoraggi reali della scala
// sono 1 SRM (paglierino, il più chiaro) e 45 SRM (imperial stout, il più scuro):
// sotto il primo e sopra l'ultimo la funzione deve saturare, non scivolare.
// ─────────────────────────────────────────────────────────────────────────────

/** I dodici ancoraggi reali, come dichiarati in `color.ts` (fonte di verità). */
const ANCHORS: [number, string][] = [
  [1, '#F7F2AC'],
  [3, '#F1E07E'],
  [5, '#ECCD56'],
  [7, '#E1AF37'],
  [9, '#CF8E2B'],
  [12, '#BA6E27'],
  [15, '#A1542C'],
  [18, '#8A3B2B'],
  [22, '#6F2B23'],
  [27, '#55211D'],
  [35, '#3B1715'],
  [45, '#220E0D'],
];

const rgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

const luminance = (hex: string): number => {
  const [r, g, b] = rgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

describe('color — srmToHex', () => {
  it('riproduce esattamente i dodici ancoraggi', () => {
    for (const [srm, hex] of ANCHORS) {
      expect(srmToHex(srm)).toBe(hex.toLowerCase());
    }
  });

  it('sotto il primo ancoraggio satura al colore più chiaro, non al più scuro', () => {
    // Il clamp inferiore deve fermarsi al primo ancoraggio (1 SRM). 0.5 è il
    // vecchio limite: con esso il primo segmento non veniva mai raggiunto e la
    // funzione restituiva il colore più scuro invece del più chiaro.
    expect(srmToHex(0.5)).toBe(ANCHORS[0][1].toLowerCase());
    expect(srmToHex(0)).toBe(ANCHORS[0][1].toLowerCase());
    expect(srmToHex(-100)).toBe(ANCHORS[0][1].toLowerCase());
  });

  it('sopra l ultimo ancoraggio satura al colore più scuro', () => {
    expect(srmToHex(45)).toBe(ANCHORS[ANCHORS.length - 1][1].toLowerCase());
    expect(srmToHex(50)).toBe(ANCHORS[ANCHORS.length - 1][1].toLowerCase());
    expect(srmToHex(999)).toBe(ANCHORS[ANCHORS.length - 1][1].toLowerCase());
  });

  it('interpola linearmente fra due ancoraggi (punto medio di 1–3 SRM)', () => {
    // t = 0.5 fra #F7F2AC e #F1E07E.
    expect(srmToHex(2)).toBe('#f4e995');
  });

  it('restituisce sempre un hex minuscolo a sei cifre', () => {
    for (let srm = -5; srm <= 60; srm += 0.5) {
      expect(srmToHex(srm)).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it('è monotona: più SRM, meno luminanza', () => {
    let prev = Number.POSITIVE_INFINITY;
    for (let srm = 1; srm <= 45; srm += 0.5) {
      const lum = luminance(srmToHex(srm));
      expect(lum).toBeLessThanOrEqual(prev + 1e-9);
      prev = lum;
    }
    expect(luminance(srmToHex(1))).toBeGreaterThan(luminance(srmToHex(45)));
  });

  it('è continua agli ancoraggi (nessun salto di tinta)', () => {
    for (const [srm] of ANCHORS) {
      const before = rgb(srmToHex(srm - 0.5));
      const at = rgb(srmToHex(srm));
      const after = rgb(srmToHex(srm + 0.5));
      for (let c = 0; c < 3; c++) {
        expect(Math.abs(at[c] - before[c])).toBeLessThanOrEqual(16);
        expect(Math.abs(after[c] - at[c])).toBeLessThanOrEqual(16);
      }
    }
  });
});

describe('color — lighten / darken', () => {
  it('schiarisce verso il bianco e non lo supera', () => {
    expect(lighten('#000000')).toBe('#4d4d4d');
    expect(lighten('#000000', 1)).toBe('#ffffff');
    expect(lighten('#ffffff')).toBe('#ffffff');
    expect(lighten('#ffffff', 2)).toBe('#ffffff');
  });

  it('scurisce verso il nero e non lo supera', () => {
    expect(darken('#ffffff')).toBe('#b3b3b3');
    expect(darken('#ffffff', 1)).toBe('#000000');
    expect(darken('#000000')).toBe('#000000');
    expect(darken('#000000', 2)).toBe('#000000');
  });

  it('con amount 0 lascia il colore invariato', () => {
    expect(lighten('#ba6e27', 0)).toBe('#ba6e27');
    expect(darken('#ba6e27', 0)).toBe('#ba6e27');
  });

  it('schiarito è più luminoso, scurito è meno luminoso', () => {
    const base = srmToHex(12);
    expect(luminance(lighten(base))).toBeGreaterThan(luminance(base));
    expect(luminance(darken(base))).toBeLessThan(luminance(base));
  });
});
