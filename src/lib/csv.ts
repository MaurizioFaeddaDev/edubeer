import { beersOfStyle, styleOfBeer } from './catalog';
import type { BjcpBeer, BjcpStyle } from './catalog';

// ─────────────────────────────────────────────────────────────────────────────
// Export CSV dell'enciclopedia, scritto a mano: righe in ingresso → testo in
// uscita, nell'ordine ricevuto. Niente filtri, niente URL, niente DOM: il
// separatore è «;» e i numeri usano la virgola, così Excel e LibreOffice in
// italiano aprono il file nei posti giusti al doppio click.
// ─────────────────────────────────────────────────────────────────────────────

/** BOM UTF-8: senza, Excel it legge gli accenti come mojibake. */
export const CSV_BOM = '\uFEFF';

export const BEER_CSV_FILENAME = 'edubeer-birre.csv' as const;
export const STYLE_CSV_FILENAME = 'edubeer-stili.csv' as const;

/** Numero in forma italiana; `null` resta una cella vuota, lo zero è un dato. */
export function numIt(v: number | null): string {
  return v == null ? '' : String(v).replace('.', ',');
}

/** Quota un campo solo quando serve davvero (RFC 4180, con «;» al posto della virgola). */
export function csvField(field: string): string {
  return /[;"\n\r]/.test(field) ? `"${field.replace(/"/g, '""')}"` : field;
}

/** BOM + righe separate da CRLF, senza a-capo finale. */
export function toCsv(rows: readonly (readonly string[])[]): string {
  return CSV_BOM + rows.map((row) => row.map(csvField).join(';')).join('\r\n');
}

const BEER_CSV_HEADER = [
  'Birra', 'Codice BJCP', 'Stile', 'Categoria', 'Famiglia',
  'ABV min stile (%)', 'ABV max stile (%)',
  'IBU min stile', 'IBU max stile',
  'SRM min stile', 'SRM max stile',
];

const STYLE_CSV_HEADER = [
  'Codice BJCP', 'Stile', 'Categoria', 'Famiglia',
  'ABV min (%)', 'ABV max (%)',
  'IBU min', 'IBU max',
  'SRM min', 'SRM max',
  'Birre citate', 'Descrizione',
];

/** L'intervallo mostrato in card: `color` (SRM ufficiale), non il midpoint `srm`. */
const rangeCells = (p: [number, number] | null): string[] => (
  p ? [numIt(p[0]), numIt(p[1])] : ['', '']
);

export function beersCsv(beers: readonly BjcpBeer[]): string {
  const rows: string[][] = [BEER_CSV_HEADER];
  for (const b of beers) {
    const s = styleOfBeer(b);
    // Una birra senza stile non ha nemmeno una card: la riga non esiste.
    if (!s) continue;
    rows.push([
      b.name, s.code, s.name, s.category, s.family,
      ...rangeCells(s.abv), ...rangeCells(s.ibu), ...rangeCells(s.color),
    ]);
  }
  return toCsv(rows);
}

export function stylesCsv(styles: readonly BjcpStyle[]): string {
  const rows: string[][] = [STYLE_CSV_HEADER];
  for (const s of styles) {
    rows.push([
      s.code, s.name, s.category, s.family,
      ...rangeCells(s.abv), ...rangeCells(s.ibu), ...rangeCells(s.color),
      String(beersOfStyle(s.id).length), s.blurb,
    ]);
  }
  return toCsv(rows);
}
