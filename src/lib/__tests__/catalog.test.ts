import { describe, expect, it } from 'vitest';
import {
  ABV_RANGE,
  ALL_BEERS,
  BEER_BY_ID,
  BEERS_BY_STYLE,
  CATEGORIES,
  EMPTY_CATALOG,
  FAMILIES,
  IBU_RANGE,
  SRM_RANGE,
  SORTS,
  STYLES,
  abvOf,
  beerOf,
  beersOfStyle,
  countActiveFilters,
  fromCatalogSearch,
  ibuOf,
  matchesBeer,
  mid,
  queryForStyle,
  rangeLabel,
  searchBeers,
  srmOf,
  styleById,
  styleOfBeer,
  suggestBeers,
  toCatalogSearch,
} from '../catalog';
import type { BjcpBeer } from '../catalog';

// ─────────────────────────────────────────────────────────────────────────────
// T-003 — suite sulla logica pura del catalogo. I dati sotto sono fonti sacre
// (generate): i test li leggono e falliscono se i conteggi cambiano.
// ─────────────────────────────────────────────────────────────────────────────

describe('catalog — insieme dei dati (fonti sacre)', () => {
  it('espone 116 stili: 107 numerati + 9 storici della categoria 27', () => {
    expect(STYLES).toHaveLength(116);
    const numbered = STYLES.filter((s) => /^\d+[A-Z]$/.test(s.code));
    const historical = STYLES.filter((s) => s.categoryId === '27');
    expect(numbered).toHaveLength(107);
    expect(historical).toHaveLength(9);
    expect(numbered.length + historical.length).toBe(116);
  });

  it('espone 613 birre, tutte agganciate a uno stile esistente', () => {
    expect(ALL_BEERS).toHaveLength(613);
    expect(BEER_BY_ID.size).toBe(613);
    expect(ALL_BEERS.every((b) => styleOfBeer(b) != null)).toBe(true);
  });

  it('indicizza le birre per stile senza perderne nessuna', () => {
    const total = [...BEERS_BY_STYLE.values()].reduce((n, arr) => n + arr.length, 0);
    expect(total).toBe(613);
    expect(ALL_BEERS.every((b) => beersOfStyle(b.styleId).includes(b))).toBe(true);
  });

  it('espone 34 categorie e le famiglie sono un insieme senza duplicati', () => {
    expect(CATEGORIES).toHaveLength(34);
    expect(FAMILIES.length).toBeGreaterThan(0);
    expect(new Set(FAMILIES).size).toBe(FAMILIES.length);
  });

  it('deriva gli intervalli globali dagli stili (ABV/IBU/SRM)', () => {
    expect(ABV_RANGE).toEqual({ min: 2, max: 14 });
    expect(IBU_RANGE).toEqual({ min: 0, max: 100 });
    expect(SRM_RANGE).toEqual({ min: 2, max: 35 });
  });
});

describe('catalog — accessor', () => {
  it('beerOf / styleById risolvono gli id noti e ignorano gli sconosciuti', () => {
    const first = ALL_BEERS[0];
    expect(beerOf(first.id)).toBe(first);
    expect(beerOf('__non-esiste__')).toBeUndefined();
    expect(styleById('15B')?.code).toBe('15B');
    expect(styleById('__non-esiste__')).toBeUndefined();
  });

  it('styleOfBeer collega una birra al suo stile', () => {
    const first = ALL_BEERS[0];
    expect(styleOfBeer(first)?.id).toBe(first.styleId);
  });

  it('beersOfStyle restituisce le birre dello stile o un array vuoto', () => {
    const withBeers = STYLES.find((s) => beersOfStyle(s.id).length > 0);
    expect(withBeers).toBeDefined();
    expect(beersOfStyle(withBeers!.id).every((b) => b.styleId === withBeers!.id)).toBe(true);
    expect(beersOfStyle('__non-esiste__')).toEqual([]);
  });

  it('gli accessor derivati sono null-safe su uno stile inesistente', () => {
    const ghost: BjcpBeer = { id: 'ghost', name: 'Ghost', styleId: '__non-esiste__' };
    expect(styleOfBeer(ghost)).toBeUndefined();
    expect(abvOf(ghost)).toBeNull();
    expect(ibuOf(ghost)).toBeNull();
    expect(srmOf(ghost)).toBeNull();
  });

  it('mid/abvOf/ibuOf/srmOf derivano i valori dallo stile', () => {
    const beer = ALL_BEERS[0];
    const style = styleOfBeer(beer)!;
    expect(mid([4, 6])).toBe(5);
    expect(mid(null)).toBeNull();
    expect(abvOf(beer)).toBe(mid(style.abv));
    expect(ibuOf(beer)).toBe(mid(style.ibu));
    expect(srmOf(beer)).toBe(style.srm);
  });

  it('rangeLabel formatta intervalli e buchi', () => {
    expect(rangeLabel([4.2, 5.8], '%')).toBe('4.2–5.8%');
    expect(rangeLabel([4, 5], '%')).toBe('4–5%');
    expect(rangeLabel([0, 100], ' IBU', 0)).toBe('0–100 IBU');
    expect(rangeLabel(null)).toBe('—');
  });
});

describe('catalog — matchesBeer', () => {
  const beer = ALL_BEERS[0];
  const style = styleOfBeer(beer)!;

  it('una birra senza stile non passa mai il filtro', () => {
    const ghost: BjcpBeer = { id: 'ghost', name: 'Ghost', styleId: '__non-esiste__' };
    expect(matchesBeer(ghost, EMPTY_CATALOG)).toBe(false);
  });

  it('filtra per categoria, famiglia, stile e testo (felice + limite)', () => {
    expect(matchesBeer(beer, EMPTY_CATALOG)).toBe(true);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, categories: [style.category] })).toBe(true);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, categories: ['__nope__'] })).toBe(false);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, families: [style.family] })).toBe(true);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, families: ['__nope__'] })).toBe(false);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, styles: [style.id] })).toBe(true);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, styles: ['__nope__'] })).toBe(false);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, text: beer.name })).toBe(true);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, text: '__nope__' })).toBe(false);
  });

  it('ABV: gli estremi dello stile sono inclusi, appena fuori no', () => {
    const [lo, hi] = style.abv!;
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, abv: { min: lo, max: hi } })).toBe(true);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, abv: { min: hi, max: ABV_RANGE.max } })).toBe(true);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, abv: { min: ABV_RANGE.min, max: lo } })).toBe(true);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, abv: { min: hi + 1, max: ABV_RANGE.max } })).toBe(false);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, abv: { min: ABV_RANGE.min, max: lo - 1 } })).toBe(false);
  });

  it('IBU: gli estremi dello stile sono inclusi, appena fuori no', () => {
    const [lo, hi] = style.ibu!;
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, ibu: { min: lo, max: hi } })).toBe(true);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, ibu: { min: hi, max: IBU_RANGE.max } })).toBe(true);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, ibu: { min: IBU_RANGE.min, max: lo } })).toBe(true);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, ibu: { min: hi + 1, max: IBU_RANGE.max } })).toBe(false);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, ibu: { min: IBU_RANGE.min, max: lo - 1 } })).toBe(false);
  });

  it('SRM: il valore puntuale dello stile è incluso ai bordi, fuori no', () => {
    const srm = style.srm!;
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, srm: { min: srm, max: SRM_RANGE.max } })).toBe(true);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, srm: { min: SRM_RANGE.min, max: srm } })).toBe(true);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, srm: { min: srm + 1, max: SRM_RANGE.max } })).toBe(false);
    expect(matchesBeer(beer, { ...EMPTY_CATALOG, srm: { min: SRM_RANGE.min, max: srm - 1 } })).toBe(false);
  });

  it('uno stile senza ABV dichiarato passa solo con l intervallo globale completo', () => {
    const nullAbv = STYLES.find((s) => s.abv === null);
    expect(nullAbv).toBeDefined();
    const nullBeer: BjcpBeer = { id: 'ghost-null', name: 'Ghost Null', styleId: nullAbv!.id };
    expect(matchesBeer(nullBeer, { ...EMPTY_CATALOG, abv: { min: ABV_RANGE.min, max: ABV_RANGE.max } })).toBe(true);
    expect(matchesBeer(nullBeer, { ...EMPTY_CATALOG, abv: { min: ABV_RANGE.min + 1, max: ABV_RANGE.max } })).toBe(false);
  });

  it('uno stile senza SRM dichiarato passa solo con l intervallo globale completo', () => {
    // Ramo `s.srm == null`: distinto da `overlaps` (qui il confronto è puntuale).
    const nullSrm = STYLES.find((s) => s.srm === null);
    expect(nullSrm).toBeDefined();
    const nullBeer: BjcpBeer = { id: 'ghost-srm', name: 'Ghost SRM', styleId: nullSrm!.id };
    expect(matchesBeer(nullBeer, { ...EMPTY_CATALOG, srm: { min: SRM_RANGE.min, max: SRM_RANGE.max } })).toBe(true);
    expect(matchesBeer(nullBeer, { ...EMPTY_CATALOG, srm: { min: SRM_RANGE.min + 1, max: SRM_RANGE.max } })).toBe(false);
    expect(matchesBeer(nullBeer, { ...EMPTY_CATALOG, srm: { min: SRM_RANGE.min, max: SRM_RANGE.max - 1 } })).toBe(false);
  });
});

describe('catalog — searchBeers', () => {
  it('la query vuota restituisce l intero catalogo (613 birre, 116 stili)', () => {
    expect(searchBeers(EMPTY_CATALOG)).toHaveLength(613);
    expect(STYLES).toHaveLength(116);
  });

  it('non altera i conteggi attesi quando filtra', () => {
    const only15B = searchBeers({ ...EMPTY_CATALOG, styles: ['15B'] });
    expect(only15B.length).toBeGreaterThan(0);
    expect(only15B.length).toBeLessThan(613);
    expect(only15B.every((b) => b.styleId === '15B')).toBe(true);
  });

  it('ordina per nome (A→Z) di default e Z→A su richiesta', () => {
    const asc = searchBeers(EMPTY_CATALOG).map((b) => b.name);
    expect(asc).toEqual([...asc].sort((a, b) => a.localeCompare(b, 'it')));
    const desc = searchBeers({ ...EMPTY_CATALOG, sort: 'name-desc' }).map((b) => b.name);
    expect(desc).toEqual([...desc].sort((a, b) => b.localeCompare(a, 'it')));
  });

  it('ordina per codice BJCP seguendo l ordine ufficiale', () => {
    const order = new Map(STYLES.map((s, i) => [s.id, i]));
    const seq = searchBeers({ ...EMPTY_CATALOG, sort: 'style' }).map((b) => order.get(b.styleId)!);
    expect(seq).toEqual([...seq].sort((a, b) => a - b));
  });

  it('ordina numericamente su ABV/IBU/SRM, in salita e in discesa', () => {
    const monotone = (values: (number | null)[], dir: 1 | -1) => {
      const real = values.filter((v): v is number => v != null);
      expect(real).toEqual([...real].sort((a, b) => (a - b) * dir));
    };
    monotone(searchBeers({ ...EMPTY_CATALOG, sort: 'abv-asc' }).map(abvOf), 1);
    monotone(searchBeers({ ...EMPTY_CATALOG, sort: 'abv-desc' }).map(abvOf), -1);
    monotone(searchBeers({ ...EMPTY_CATALOG, sort: 'ibu-asc' }).map(ibuOf), 1);
    monotone(searchBeers({ ...EMPTY_CATALOG, sort: 'ibu-desc' }).map(ibuOf), -1);
    monotone(searchBeers({ ...EMPTY_CATALOG, sort: 'srm-asc' }).map(srmOf), 1);
    monotone(searchBeers({ ...EMPTY_CATALOG, sort: 'srm-desc' }).map(srmOf), -1);
  });

  it('SORTS espone i nove ordinamenti del catalogo', () => {
    expect(SORTS).toHaveLength(9);
    expect(SORTS.map((s) => s.id)).toContain('name');
    expect(SORTS.map((s) => s.id)).toContain('srm-desc');
  });
});

describe('catalog — suggestBeers e countActiveFilters', () => {
  it('i suggerimenti sono vuoti senza testo e limitati con testo', () => {
    expect(suggestBeers('')).toEqual([]);
    expect(suggestBeers('__nope__')).toEqual([]);
    expect(suggestBeers('stout').length).toBeGreaterThan(0);
    expect(suggestBeers('stout').length).toBeLessThanOrEqual(6);
    expect(suggestBeers('stout', 3).length).toBeLessThanOrEqual(3);
  });

  it('conta i filtri attivi uno per uno', () => {
    expect(countActiveFilters(EMPTY_CATALOG)).toBe(0);
    expect(countActiveFilters({ ...EMPTY_CATALOG, text: 'stout' })).toBe(1);
    expect(countActiveFilters({ ...EMPTY_CATALOG, categories: ['Lager'] })).toBe(1);
    expect(countActiveFilters({ ...EMPTY_CATALOG, families: ['Lager'] })).toBe(1);
    expect(countActiveFilters({ ...EMPTY_CATALOG, styles: ['15B'] })).toBe(1);
    expect(countActiveFilters({ ...EMPTY_CATALOG, abv: { min: ABV_RANGE.min + 1, max: ABV_RANGE.max } })).toBe(1);
    expect(countActiveFilters({ ...EMPTY_CATALOG, ibu: { min: IBU_RANGE.min, max: IBU_RANGE.max - 1 } })).toBe(1);
    expect(countActiveFilters({ ...EMPTY_CATALOG, srm: { min: SRM_RANGE.min + 1, max: SRM_RANGE.max } })).toBe(1);
    expect(
      countActiveFilters({
        ...EMPTY_CATALOG,
        text: 'stout',
        categories: ['Lager'],
        families: ['Lager'],
        styles: ['15B'],
        abv: { min: ABV_RANGE.min + 1, max: ABV_RANGE.max },
      }),
    ).toBe(5);
  });
});

describe('catalog — round-trip URL', () => {
  it('la query vuota non produce parametri', () => {
    expect(toCatalogSearch(EMPTY_CATALOG)).toBe('');
    expect(fromCatalogSearch('')).toEqual(EMPTY_CATALOG);
  });

  it('stato → hash → stato conserva i filtri dell esempio del ticket', () => {
    const search = '?q=stout&stile=15B&abv=8-14';
    const state = fromCatalogSearch(search);
    expect(state.text).toBe('stout');
    expect(state.styles).toEqual(['15B']);
    expect(state.abv).toEqual({ min: 8, max: 14 });
    expect(state.ibu).toEqual({ ...IBU_RANGE });
    expect(toCatalogSearch(state)).toBe(search);

    const hash = `#/birre${toCatalogSearch(state)}`;
    expect(hash).toBe('#/birre?q=stout&stile=15B&abv=8-14');
    expect(fromCatalogSearch(hash.slice(hash.indexOf('?')))).toEqual(state);
  });

  it('conserva tutti i parametri in un round-trip completo', () => {
    const state = {
      ...EMPTY_CATALOG,
      text: 'ipa',
      categories: ['India Pale Ale'],
      families: ['Ale'],
      styles: ['21A', '21B'],
      abv: { min: 5, max: 9 },
      ibu: { min: 30, max: 70 },
      srm: { min: 6, max: 20 },
      sort: 'ibu-desc' as const,
    };
    expect(fromCatalogSearch(toCatalogSearch(state))).toEqual(state);
  });

  it('fa fallback onesto su ordinamenti e numeri non validi', () => {
    expect(fromCatalogSearch('?ord=nope').sort).toBe('name');
    expect(fromCatalogSearch('?abv=abc').abv).toEqual({ ...ABV_RANGE });
    expect(fromCatalogSearch('?abv=5').abv).toEqual({ min: 5, max: ABV_RANGE.max });
    expect(fromCatalogSearch('?ibu=').ibu).toEqual({ ...IBU_RANGE });
  });

  it('queryForStyle punta a un solo stile', () => {
    const q = queryForStyle('15B');
    expect(q.styles).toEqual(['15B']);
    expect({ ...q, styles: [] }).toEqual(EMPTY_CATALOG);
    expect(searchBeers(q).every((b) => b.styleId === '15B')).toBe(true);
  });
});
