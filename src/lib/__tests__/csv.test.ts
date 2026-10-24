import { describe, expect, it } from 'vitest';
import {
  BEER_CSV_FILENAME,
  CSV_BOM,
  STYLE_CSV_FILENAME,
  beersCsv,
  csvField,
  numIt,
  stylesCsv,
  toCsv,
} from '../csv';
import {
  ALL_BEERS,
  CATEGORIES,
  EMPTY_CATALOG,
  STYLES,
  beerOf,
  beersOfStyle,
  searchBeers,
  styleById,
  styleOfBeer,
} from '../catalog';
import type { BjcpBeer } from '../catalog';
import { EMPTY_STYLE_QUERY, searchStyles } from '../styleFilter';

// ─────────────────────────────────────────────────────────────────────────────
// T-002 — suite sull'export CSV. Il formato è piccolo ma l'escaping è la parte
// che si rompe in silenzio in Excel: qui si prova a byte, a stringa esatta e
// con un mini-parser RFC 4180 che simula la riapertura del file.
// ─────────────────────────────────────────────────────────────────────────────

/** Rilegge il nostro CSV come farebbe un foglio di calcolo (RFC 4180, «;»). */
function parseCsv(text: string): string[][] {
  const src = text.startsWith(CSV_BOM) ? text.slice(CSV_BOM.length) : text;
  if (!src) return [];
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < src.length; i += 1) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') { field += '"'; i += 1; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ';') { row.push(field); field = ''; }
    else if (c === '\r' && src[i + 1] === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      i += 1;
    } else field += c;
  }
  row.push(field);
  rows.push(row);
  return rows;
}

describe('csv — filename deterministici', () => {
  it('espone i due nomi di file, senza data', () => {
    expect(BEER_CSV_FILENAME).toBe('edubeer-birre.csv');
    expect(STYLE_CSV_FILENAME).toBe('edubeer-stili.csv');
  });
});

describe('csv — csvField (escaping RFC 4180)', () => {
  it('lascia intatto un campo semplice', () => {
    expect(csvField('Pilsner Urquell')).toBe('Pilsner Urquell');
  });

  it('quota il punto e virgola, che è il nostro delimitatore', () => {
    expect(csvField('Bitter; IPA')).toBe('"Bitter; IPA"');
  });

  it('quota le virgolette e le raddoppia', () => {
    expect(csvField('va"la')).toBe('"va""la"');
    expect(csvField('"già quotato"')).toBe('"""già quotato"""');
  });

  it('quota gli a-capo', () => {
    expect(csvField('riga\nnuova')).toBe('"riga\nnuova"');
    expect(csvField('ritorno\r')).toBe('"ritorno\r"');
  });

  it('non quota la virgola: è il separatore decimale, non il delimitatore', () => {
    expect(csvField('4,2')).toBe('4,2');
  });
});

describe('csv — numIt', () => {
  it('scrive i decimali con la virgola e gli interi senza', () => {
    expect(numIt(2.8)).toBe('2,8');
    expect(numIt(4)).toBe('4');
  });

  it('distingue lo zero dichiarato dal buco', () => {
    expect(numIt(0)).toBe('0');
    expect(numIt(null)).toBe('');
  });
});

describe('csv — toCsv', () => {
  it('mette il BOM in testa e nessun a-capo finale', () => {
    const text = toCsv([['a', 'b'], ['c', 'd']]);
    expect(text).toBe(`${CSV_BOM}a;b\r\nc;d`);
    expect(text.startsWith(CSV_BOM)).toBe(true);
    expect(text.endsWith('\r\n')).toBe(false);
  });

  it('con zero righe restituisce solo il BOM', () => {
    expect(toCsv([])).toBe(CSV_BOM);
  });

  it('fa il round-trip con tutti i caratteri ostili (il «doppio click in Excel»)', () => {
    const fields = ['semplice', 'con;punto e virgola', 'va"la', 'riga\nnuova', 'ritorno\r', '4,2'];
    expect(parseCsv(toCsv([fields]))).toEqual([fields]);
  });

  it('scrive un BOM UTF-8 vero, non un carattere visibile', () => {
    const bytes = new TextEncoder().encode(toCsv([['a']]));
    expect([...bytes.slice(0, 3)]).toEqual([0xef, 0xbb, 0xbf]);
  });

  it('sopravvive ai caratteri non ASCII del catalogo (Weißbier, à, °)', () => {
    const fields = ['Weißbier', 'Città d’origine', '15°C', 'Belgian Ale — Saison'];
    expect(parseCsv(toCsv([fields]))).toEqual([fields]);
  });
});

describe('csv — header esatti', () => {
  it('l header birre non ha spazi dopo il punto e virgola', () => {
    expect(beersCsv([])).toBe(
      `${CSV_BOM}Birra;Codice BJCP;Stile;Categoria;Famiglia;`
      + 'ABV min stile (%);ABV max stile (%);IBU min stile;IBU max stile;SRM min stile;SRM max stile',
    );
  });

  it('l header stili non ha spazi dopo il punto e virgola', () => {
    expect(stylesCsv([])).toBe(
      `${CSV_BOM}Codice BJCP;Stile;Categoria;Famiglia;`
      + 'ABV min (%);ABV max (%);IBU min;IBU max;SRM min;SRM max;Birre citate;Descrizione',
    );
  });
});

describe('csv — conteggi sacri (dati reali)', () => {
  it('esporta 613 birre più l header', () => {
    const rows = parseCsv(beersCsv(searchBeers(EMPTY_CATALOG)));
    expect(rows).toHaveLength(614);
  });

  it('esporta 116 stili più l header', () => {
    const rows = parseCsv(stylesCsv(searchStyles(EMPTY_STYLE_QUERY)));
    expect(rows).toHaveLength(117);
  });

  it('ogni riga completa ha tutte le colonne, senza «;» o virgolette sfuggite', () => {
    const beerRows = parseCsv(beersCsv(searchBeers(EMPTY_CATALOG)));
    const styleRows = parseCsv(stylesCsv(searchStyles(EMPTY_STYLE_QUERY)));
    expect(beerRows.every((r) => r.length === 11)).toBe(true);
    expect(styleRows.every((r) => r.length === 12)).toBe(true);
  });
});

describe('csv — prima card = prima riga', () => {
  it('la prima birra esportata è la prima della griglia, con i suoi numeri', () => {
    const first = searchBeers(EMPTY_CATALOG)[0];
    const s = styleOfBeer(first)!;
    const row = parseCsv(beersCsv([first]))[1];
    expect(row.slice(0, 5)).toEqual([first.name, s.code, s.name, s.category, s.family]);
    expect(row.slice(5)).toEqual([
      ...(s.abv ? [numIt(s.abv[0]), numIt(s.abv[1])] : ['', '']),
      ...(s.ibu ? [numIt(s.ibu[0]), numIt(s.ibu[1])] : ['', '']),
      ...(s.color ? [numIt(s.color[0]), numIt(s.color[1])] : ['', '']),
    ]);
  });

  it('usa l intervallo `color` (3B: 3,5–6), non il midpoint `srm` (4,8)', () => {
    const pils = ALL_BEERS.find((b) => b.styleId === '3B')!;
    const row = parseCsv(beersCsv([pils]))[1];
    expect(row.slice(5)).toEqual(['4,2', '5,8', '30', '45', '3,5', '6']);
  });

  it('il primo stile esportato è il primo della guida, con conteggio e descrizione', () => {
    const first = searchStyles(EMPTY_STYLE_QUERY)[0];
    const row = parseCsv(stylesCsv([first]))[1];
    expect(row.slice(0, 4)).toEqual([first.code, first.name, first.category, first.family]);
    expect(row.slice(4, 10)).toEqual(['2,8', '4,2', '8', '12', '2', '3']);
    expect(row[10]).toBe(String(beersOfStyle(first.id).length));
    expect(row[11]).toBe(first.blurb);
  });
});

describe('csv — ordine e buchi onesti', () => {
  it('preserva l ordine ricevuto, senza ordinare internamente', () => {
    const beers = [beerOf('de-cam')!, beerOf('bud-light')!];
    expect(parseCsv(beersCsv(beers)).slice(1).map((r) => r[0])).toEqual(beers.map((b) => b.name));
    const styles = [STYLES[2], STYLES[0]];
    expect(parseCsv(stylesCsv(styles)).slice(1).map((r) => r[0])).toEqual(styles.map((s) => s.code));
  });

  it('salta la riga di una birra senza stile, come fa la griglia', () => {
    const orphan: BjcpBeer = { id: 'ghost', name: 'Ghost', styleId: '__non-esiste__' };
    expect(parseCsv(beersCsv([orphan]))).toHaveLength(1);
  });

  it('scrive celle vuote per i numeri non dichiarati (kellerbier)', () => {
    const ghost: BjcpBeer = { id: 'ghost-keller', name: 'Ghost Keller', styleId: '27-kellerbier' };
    expect(parseCsv(beersCsv([ghost]))[1].slice(5)).toEqual(['', '', '', '', '', '']);
    const keller = styleById('27-kellerbier')!;
    expect(parseCsv(stylesCsv([keller]))[1].slice(4, 10)).toEqual(['', '', '', '', '', '']);
  });

  it('scrive «0» quando lo zero è dichiarato (Lambic, IBU min)', () => {
    const lambicBeer = beerOf('de-cam')!;
    expect(lambicBeer.styleId).toBe('23D');
    const row = parseCsv(beersCsv([lambicBeer]))[1];
    expect(row[7]).toBe('0');
    expect(row[8]).toBe('10');
  });
});

describe('csv — ordine raggruppato uguale a sort=code', () => {
  it('le categorie ricompongono esattamente la sequenza degli stili', () => {
    expect(CATEGORIES.flatMap((c) => c.styles).map((s) => s.id)).toEqual(STYLES.map((s) => s.id));
  });
});
