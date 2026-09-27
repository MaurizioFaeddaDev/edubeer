// Conversione SRM → colore. Stessa taratura usata nel gioco: gli ancoraggi
// seguono la scala BJCP semplificata (1 SRM = paglierino, 45 SRM = imperial stout).
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

const ANCHOR_MIN = ANCHORS[0][0];
const ANCHOR_MAX = ANCHORS[ANCHORS.length - 1][0];

export function srmToHex(srm: number): string {
  // Il clamp usa gli ancoraggi reali: sotto 1 SRM si resta sul paglierino più
  // chiaro, sopra 45 SRM sulla imperial stout più scura. Prima il limite
  // inferiore era 0.5, fuori dal primo segmento: sotto 1 SRM la funzione
  // restituiva così il colore più scuro invece del più chiaro.
  const v = Math.max(ANCHOR_MIN, Math.min(ANCHOR_MAX, srm));
  // L'indice si ferma all'ultimo segmento: il clamp garantisce che l'ancoraggio
  // superiore esista sempre, quindi il return è unico e non serve fallback.
  let i = 0;
  while (i < ANCHORS.length - 2 && v > ANCHORS[i + 1][0]) i++;
  const [a, ca] = ANCHORS[i];
  const [b, cb] = ANCHORS[i + 1];
  const t = (v - a) / (b - a);
  const ra = hexToRgb(ca);
  const rb = hexToRgb(cb);
  return `#${toHex(ra[0] + (rb[0] - ra[0]) * t)}${toHex(ra[1] + (rb[1] - ra[1]) * t)}${toHex(ra[2] + (rb[2] - ra[2]) * t)}`;
}

export function lighten(hex: string, amount = 0.3): string {
  const [r, g, b] = hexToRgb(hex);
  return `#${toHex(r + (255 - r) * amount)}${toHex(g + (255 - g) * amount)}${toHex(b + (255 - b) * amount)}`;
}

export function darken(hex: string, amount = 0.3): string {
  const [r, g, b] = hexToRgb(hex);
  return `#${toHex(r * (1 - amount))}${toHex(g * (1 - amount))}${toHex(b * (1 - amount))}`;
}
