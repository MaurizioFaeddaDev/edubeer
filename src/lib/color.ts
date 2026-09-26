// Conversione SRM → colore. Stessa taratura usata nel gioco: gli ancoraggi
// seguono la scala BJCP semplificata (2 SRM = pilsner, 40 SRM = imperial stout).
// In un'enciclopedia serve a ricordare che il colore è un dato misurabile.

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

const hexToRgb = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');

export function srmToHex(srm: number): string {
  const v = Math.max(0.5, Math.min(50, srm));
  for (let i = 0; i < ANCHORS.length - 1; i++) {
    const [a, ca] = ANCHORS[i];
    const [b, cb] = ANCHORS[i + 1];
    if (v >= a && v <= b) {
      const t = (v - a) / (b - a);
      const ra = hexToRgb(ca);
      const rb = hexToRgb(cb);
      return `#${toHex(ra[0] + (rb[0] - ra[0]) * t)}${toHex(ra[1] + (rb[1] - ra[1]) * t)}${toHex(ra[2] + (rb[2] - ra[2]) * t)}`;
    }
  }
  return ANCHORS[ANCHORS.length - 1][1];
}

export function lighten(hex: string, amount = 0.3): string {
  const [r, g, b] = hexToRgb(hex);
  return `#${toHex(r + (255 - r) * amount)}${toHex(g + (255 - g) * amount)}${toHex(b + (255 - b) * amount)}`;
}

export function darken(hex: string, amount = 0.3): string {
  const [r, g, b] = hexToRgb(hex);
  return `#${toHex(r * (1 - amount))}${toHex(g * (1 - amount))}${toHex(b * (1 - amount))}`;
}
