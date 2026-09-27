import { describe, expect, it } from 'vitest';
import {
  EMPTY_STYLE_QUERY,
  STYLE_SORTS,
  countStyleFilters,
  fromStyleSearch,
  matchesStyle,
  searchStyles,
  suggestStyles,
  toStyleSearch,
} from '../styleFilter';
import { ABV_RANGE, IBU_RANGE, SRM_RANGE, STYLES } from '../catalog';

// ─────────────────────────────────────────────────────────────────────────────
// T-003 — suite sulla logica pura del filtro Stili. Qui l oggetto filtrato è
// lo stile stesso: un intervallo tocca lo stile, non la birra che lo eredita.
// ─────────────────────────────────────────────────────────────────────────────

describe('styleFilter — insieme dei dati', () => {
  it('la query vuota restituisce tutti i 116 stili senza alterarne i conteggi', () => {
    expect(searchStyles(EMPTY_STYLE_QUERY)).toHaveLength(116);
    expect(STYLES).toHaveLength(116);
  });

  it('STYLE_SORTS espone i nove ordinamenti', () => {
    expect(STYLE_SORTS).toHaveLength(9);
    expect(STYLE_SORTS[0].id).toBe('code');
    expect(STYLE_SORTS.map((s) => s.id)).toContain('srm-desc');
  });
});

describe('styleFilter — matchesStyle', () => {
  const style = STYLES[0];

  it('accetta uno stile con la query vuota', () => {
    expect(matchesStyle(style, EMPTY_STYLE_QUERY)).toBe(true);
  });

  it('filtra per categoria, famiglia e testo (felice + limite)', () => {
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, categories: [style.category] })).toBe(true);
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, categories: ['__nope__'] })).toBe(false);
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, families: [style.family] })).toBe(true);
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, families: ['__nope__'] })).toBe(false);
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, text: style.code })).toBe(true);
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, text: '__nope__' })).toBe(false);
  });

  it('ABV: gli estremi dichiarati sono inclusi, appena fuori no', () => {
    const [lo, hi] = style.abv!;
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, abv: { min: lo, max: hi } })).toBe(true);
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, abv: { min: hi, max: ABV_RANGE.max } })).toBe(true);
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, abv: { min: ABV_RANGE.min, max: lo } })).toBe(true);
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, abv: { min: hi + 1, max: ABV_RANGE.max } })).toBe(false);
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, abv: { min: ABV_RANGE.min, max: lo - 1 } })).toBe(false);
  });

  it('IBU: gli estremi dichiarati sono inclusi, appena fuori no', () => {
    const [lo, hi] = style.ibu!;
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, ibu: { min: lo, max: hi } })).toBe(true);
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, ibu: { min: hi, max: IBU_RANGE.max } })).toBe(true);
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, ibu: { min: IBU_RANGE.min, max: lo } })).toBe(true);
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, ibu: { min: hi + 1, max: IBU_RANGE.max } })).toBe(false);
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, ibu: { min: IBU_RANGE.min, max: lo - 1 } })).toBe(false);
  });

  it('SRM: l intervallo di colore dichiarato è incluso ai bordi, fuori no', () => {
    const [c0, c1] = style.color!;
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, srm: { min: c1, max: SRM_RANGE.max } })).toBe(true);
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, srm: { min: SRM_RANGE.min, max: c0 } })).toBe(true);
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, srm: { min: c1 + 1, max: SRM_RANGE.max } })).toBe(false);
    expect(matchesStyle(style, { ...EMPTY_STYLE_QUERY, srm: { min: SRM_RANGE.min, max: c0 - 1 } })).toBe(false);
  });

  it('uno stile senza ABV dichiarato passa solo con l intervallo globale completo', () => {
    const nullAbv = STYLES.find((s) => s.abv === null);
    expect(nullAbv).toBeDefined();
    expect(matchesStyle(nullAbv!, EMPTY_STYLE_QUERY)).toBe(true);
    expect(matchesStyle(nullAbv!, { ...EMPTY_STYLE_QUERY, abv: { min: ABV_RANGE.min + 1, max: ABV_RANGE.max } })).toBe(false);
  });

  it('uno stile senza colore dichiarato passa solo con l intervallo globale completo', () => {
    // Ramo `touches(s.color, ...)` con `pair === null`.
    const nullColor = STYLES.find((s) => s.color === null);
    expect(nullColor).toBeDefined();
    expect(matchesStyle(nullColor!, EMPTY_STYLE_QUERY)).toBe(true);
    expect(matchesStyle(nullColor!, { ...EMPTY_STYLE_QUERY, srm: { min: SRM_RANGE.min + 1, max: SRM_RANGE.max } })).toBe(false);
    expect(matchesStyle(nullColor!, { ...EMPTY_STYLE_QUERY, srm: { min: SRM_RANGE.min, max: SRM_RANGE.max - 1 } })).toBe(false);
  });
});

describe('styleFilter — searchStyles', () => {
  it('non altera i conteggi quando filtra', () => {
    const lager = searchStyles({ ...EMPTY_STYLE_QUERY, families: ['Lager'] });
    expect(lager.length).toBeGreaterThan(0);
    expect(lager.length).toBeLessThan(116);
    expect(lager.every((s) => s.family === 'Lager')).toBe(true);
  });

  it('ordina per codice BJCP di default e per nome su richiesta', () => {
    const order = new Map(STYLES.map((s, i) => [s.id, i]));
    const byCode = searchStyles(EMPTY_STYLE_QUERY).map((s) => order.get(s.id)!);
    expect(byCode).toEqual([...byCode].sort((a, b) => a - b));
    const byName = searchStyles({ ...EMPTY_STYLE_QUERY, sort: 'name' }).map((s) => s.name);
    expect(byName).toEqual([...byName].sort((a, b) => a.localeCompare(b, 'it')));
  });

  it('ordina numericamente su ABV/IBU/SRM, in salita e in discesa', () => {
    const mid = (p: [number, number] | null) => (p ? (p[0] + p[1]) / 2 : null);
    const monotone = (values: (number | null)[], dir: 1 | -1) => {
      const real = values.filter((v): v is number => v != null);
      expect(real).toEqual([...real].sort((a, b) => (a - b) * dir));
    };
    monotone(searchStyles({ ...EMPTY_STYLE_QUERY, sort: 'abv-asc' }).map((s) => mid(s.abv)), 1);
    monotone(searchStyles({ ...EMPTY_STYLE_QUERY, sort: 'abv-desc' }).map((s) => mid(s.abv)), -1);
    monotone(searchStyles({ ...EMPTY_STYLE_QUERY, sort: 'ibu-asc' }).map((s) => mid(s.ibu)), 1);
    monotone(searchStyles({ ...EMPTY_STYLE_QUERY, sort: 'ibu-desc' }).map((s) => mid(s.ibu)), -1);
    monotone(searchStyles({ ...EMPTY_STYLE_QUERY, sort: 'srm-asc' }).map((s) => s.srm), 1);
    monotone(searchStyles({ ...EMPTY_STYLE_QUERY, sort: 'srm-desc' }).map((s) => s.srm), -1);
  });
});

describe('styleFilter — suggestStyles e countStyleFilters', () => {
  it('i suggerimenti sono vuoti senza testo e limitati con testo', () => {
    expect(suggestStyles('')).toEqual([]);
    expect(suggestStyles('__nope__')).toEqual([]);
    expect(suggestStyles('stout').length).toBeGreaterThan(0);
    expect(suggestStyles('stout').length).toBeLessThanOrEqual(5);
    expect(suggestStyles('stout', 2).length).toBeLessThanOrEqual(2);
  });

  it('conta i filtri attivi uno per uno', () => {
    expect(countStyleFilters(EMPTY_STYLE_QUERY)).toBe(0);
    expect(countStyleFilters({ ...EMPTY_STYLE_QUERY, text: 'stout' })).toBe(1);
    expect(countStyleFilters({ ...EMPTY_STYLE_QUERY, categories: ['Lager'] })).toBe(1);
    expect(countStyleFilters({ ...EMPTY_STYLE_QUERY, families: ['Lager'] })).toBe(1);
    expect(countStyleFilters({ ...EMPTY_STYLE_QUERY, abv: { min: ABV_RANGE.min + 1, max: ABV_RANGE.max } })).toBe(1);
    expect(countStyleFilters({ ...EMPTY_STYLE_QUERY, ibu: { min: IBU_RANGE.min, max: IBU_RANGE.max - 1 } })).toBe(1);
    expect(countStyleFilters({ ...EMPTY_STYLE_QUERY, srm: { min: SRM_RANGE.min + 1, max: SRM_RANGE.max } })).toBe(1);
    expect(
      countStyleFilters({
        ...EMPTY_STYLE_QUERY,
        text: 'stout',
        categories: ['Lager'],
        families: ['Lager'],
        abv: { min: ABV_RANGE.min + 1, max: ABV_RANGE.max },
      }),
    ).toBe(4);
  });
});

describe('styleFilter — round-trip URL', () => {
  it('la query vuota non produce parametri', () => {
    expect(toStyleSearch(EMPTY_STYLE_QUERY)).toBe('');
    expect(fromStyleSearch('')).toEqual(EMPTY_STYLE_QUERY);
  });

  it('stato → hash → stato conserva i filtri', () => {
    const state = fromStyleSearch('?q=stout&fam=Lager&abv=8-14&ord=abv-desc');
    expect(state.text).toBe('stout');
    expect(state.families).toEqual(['Lager']);
    expect(state.abv).toEqual({ min: 8, max: 14 });
    expect(state.sort).toBe('abv-desc');
    expect(toStyleSearch(state)).toBe('?q=stout&fam=Lager&ord=abv-desc&abv=8-14');
    expect(fromStyleSearch(toStyleSearch(state))).toEqual(state);
  });

  it('fa fallback onesto su ordinamenti e numeri non validi', () => {
    expect(fromStyleSearch('?ord=nope').sort).toBe('code');
    expect(fromStyleSearch('?abv=abc').abv).toEqual({ ...ABV_RANGE });
    expect(fromStyleSearch('?srm=5').srm).toEqual({ min: 5, max: SRM_RANGE.max });
  });
});
