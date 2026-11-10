import { describe, expect, it } from 'vitest';
import { ALL_BEERS, EMPTY_CATALOG, SRM_RANGE, STYLES, fromCatalogSearch, matchesBeer, styleOfBeer } from '../catalog';
import { EMPTY_STYLE_QUERY, fromStyleSearch, matchesStyle } from '../styleFilter';
import { parseRange } from '../range';
import { evidenceFor } from '../provenance';

describe('audit regressions', () => {
  it('catalog and atlas agree at every SRM endpoint in the corpus', () => {
    for (const beer of ALL_BEERS) {
      const style = styleOfBeer(beer)!;
      for (const value of style.color ?? [SRM_RANGE.min, SRM_RANGE.max]) {
        const srm = { min: value, max: value };
        expect(matchesBeer(beer, { ...EMPTY_CATALOG, srm })).toBe(matchesStyle(style, { ...EMPTY_STYLE_QUERY, srm }));
      }
    }
    expect(SRM_RANGE.max).toBe(40);
    expect(STYLES.every(s => !s.color || (s.color[0] >= SRM_RANGE.min && s.color[1] <= SRM_RANGE.max))).toBe(true);
  });
  it.each([
    ['12-4', { min: 4, max: 12 }], ['-5-99', { min: 2, max: 14 }],
    ['5', { min: 5, max: 14 }], ['5-', { min: 5, max: 14 }],
    ['NaN-Infinity', { min: 2, max: 14 }], ['4-8-extra', { min: 2, max: 14 }],
    ['4.5-7.5', { min: 4.5, max: 7.5 }],
  ])('normalizes shared ranges: %s', (raw, expected) => {
    expect(parseRange(raw, { min: 2, max: 14 })).toEqual(expected);
    expect(fromCatalogSearch(`abv=${raw}`).abv).toEqual(expected);
    expect(fromStyleSearch(`abv=${raw}`).abv).toEqual(expected);
  });
  it('does not invent verification dates for imported values', () => {
    for (const item of Object.values(evidenceFor('saison-dupont'))) {
      expect(item.status).toBe('unverified');
      expect(item.checkedAt).toBeNull();
    }
  });
});
