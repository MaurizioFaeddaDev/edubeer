import { BJCP_BEERS } from '../data/bjcp-beers';
import { BJCP_BY_ID, BJCP_CATEGORIES, BJCP_STYLES } from '../data/bjcp';
import type { BjcpBeer } from '../data/bjcp-beers';
import type { BjcpStyle } from '../data/bjcp';

// ─────────────────────────────────────────────────────────────────────────────
// Il motore dell'enciclopedia BJCP. Le birre sono solo nomi + codice di stile:
// tutto il resto (ABV, IBU, SRM, testi) è dello stile, e qui si deriva. Nessun
// dato per-birra viene inventato.
// ─────────────────────────────────────────────────────────────────────────────

export type { BjcpBeer, BjcpStyle };

export const ALL_BEERS: BjcpBeer[] = BJCP_BEERS;
export const BEER_BY_ID: Map<string, BjcpBeer> = new Map(ALL_BEERS.map((b) => [b.id, b]));
export const beerOf = (id: string): BjcpBeer | undefined => BEER_BY_ID.get(id);

export const styleById = (id: string): BjcpStyle | undefined => BJCP_BY_ID.get(id);
export const styleOfBeer = (b: BjcpBeer): BjcpStyle | undefined => BJCP_BY_ID.get(b.styleId);

export const CATEGORIES = BJCP_CATEGORIES;
export const STYLES = BJCP_STYLES;

/** Ordine ufficiale degli stili, per gli ordinamenti. */
const STYLE_ORDER = new Map(BJCP_STYLES.map((s, i) => [s.id, i]));
const styleOrder = (b: BjcpBeer): number => STYLE_ORDER.get(b.styleId) ?? Number.MAX_SAFE_INTEGER;

export const FAMILIES: string[] = [...new Set(BJCP_STYLES.map((s) => s.family))]
  .sort((a, b) => a.localeCompare(b, 'it'));

export const BEERS_BY_STYLE: Map<string, BjcpBeer[]> = (() => {
  const m = new Map<string, BjcpBeer[]>();
  for (const b of ALL_BEERS) {
    const arr = m.get(b.styleId);
    if (arr) arr.push(b);
    else m.set(b.styleId, [b]);
  }
  return m;
})();

export const beersOfStyle = (id: string): BjcpBeer[] => BEERS_BY_STYLE.get(id) ?? [];

// ── Intervalli globali, ricavati dagli stili ────────────────────────────────

export interface NumRange {
  min: number;
  max: number;
}

const pairRange = (pick: (s: BjcpStyle) => [number, number] | null): NumRange => {
  const lo: number[] = [];
  const hi: number[] = [];
  for (const s of BJCP_STYLES) {
    const p = pick(s);
    if (p) { lo.push(p[0]); hi.push(p[1]); }
  }
  return { min: Math.floor(Math.min(...lo)), max: Math.ceil(Math.max(...hi)) };
};

export const ABV_RANGE = pairRange((s) => s.abv);
export const IBU_RANGE = pairRange((s) => s.ibu);

const srmValues = BJCP_STYLES.map((s) => s.srm).filter((v): v is number => v != null);
export const SRM_RANGE: NumRange = {
  min: Math.floor(Math.min(...srmValues)),
  max: Math.ceil(Math.max(...srmValues)),
};

/** Metà di un intervallo di stile. Per ordinare e per mostrare un valore singolo. */
export const mid = (p: [number, number] | null): number | null => (p ? (p[0] + p[1]) / 2 : null);
export const abvOf = (b: BjcpBeer): number | null => { const s = styleOfBeer(b); return s ? mid(s.abv) : null; };
export const ibuOf = (b: BjcpBeer): number | null => { const s = styleOfBeer(b); return s ? mid(s.ibu) : null; };
export const srmOf = (b: BjcpBeer): number | null => styleOfBeer(b)?.srm ?? null;

/** Etichetta leggibile di un intervallo: «4.2–5.8%» oppure «—». */
export const rangeLabel = (p: [number, number] | null, unit = '', digits = 1): string => {
  if (!p) return '—';
  const f = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(digits));
  return `${f(p[0])}–${f(p[1])}${unit}`;
};

// ── Ricerca e filtri ────────────────────────────────────────────────────────

export type CatalogSort =
  | 'name' | 'name-desc' | 'style'
  | 'abv-asc' | 'abv-desc'
  | 'ibu-asc' | 'ibu-desc'
  | 'srm-asc' | 'srm-desc';

export interface CatalogQuery {
  text: string;
  /** Nomi delle categorie BJCP. */
  categories: string[];
  families: string[];
  /** id degli stili, es. "3B" oppure "27-kellerbier". */
  styles: string[];
  abv: NumRange;
  ibu: NumRange;
  srm: NumRange;
  sort: CatalogSort;
}

export const SORTS: { id: CatalogSort; label: string }[] = [
  { id: 'name', label: 'Nome (A→Z)' },
  { id: 'name-desc', label: 'Nome (Z→A)' },
  { id: 'style', label: 'Stile (codice BJCP)' },
  { id: 'abv-asc', label: 'Gradazione crescente' },
  { id: 'abv-desc', label: 'Gradazione decrescente' },
  { id: 'ibu-asc', label: 'Amarezza crescente' },
  { id: 'ibu-desc', label: 'Amarezza decrescente' },
  { id: 'srm-asc', label: 'Colore crescente' },
  { id: 'srm-desc', label: 'Colore decrescente' },
];

export const EMPTY_CATALOG: CatalogQuery = {
  text: '',
  categories: [],
  families: [],
  styles: [],
  abv: { ...ABV_RANGE },
  ibu: { ...IBU_RANGE },
  srm: { ...SRM_RANGE },
  sort: 'name',
};

const strip = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** Indice testuale: nome, stile, categoria, famiglia e sintesi dello stile. */
const INDEX = new Map<string, string>(
  ALL_BEERS.map((b) => {
    const s = styleOfBeer(b);
    return [b.id, strip([
      b.name, s?.code ?? '', s?.name ?? '', s?.category ?? '', s?.family ?? '', s?.blurb ?? '',
    ].join(' · '))];
  }),
);

const EPS = 1e-9;

/** Vero se l'intervallo dello stile tocca quello scelto nei filtri. */
function overlaps(pair: [number, number] | null, r: NumRange, global: NumRange): boolean {
  if (!pair) return r.min <= global.min + EPS && r.max >= global.max - EPS;
  return pair[0] <= r.max + EPS && pair[1] >= r.min - EPS;
}

export function matchesBeer(b: BjcpBeer, q: CatalogQuery): boolean {
  const s = styleOfBeer(b);
  if (!s) return false;
  if (q.categories.length && !q.categories.includes(s.category)) return false;
  if (q.families.length && !q.families.includes(s.family)) return false;
  if (q.styles.length && !q.styles.includes(s.id)) return false;
  if (!overlaps(s.abv, q.abv, ABV_RANGE)) return false;
  if (!overlaps(s.ibu, q.ibu, IBU_RANGE)) return false;
  if (s.srm == null) {
    if (!(q.srm.min <= SRM_RANGE.min + EPS && q.srm.max >= SRM_RANGE.max - EPS)) return false;
  } else if (s.srm < q.srm.min - EPS || s.srm > q.srm.max + EPS) {
    return false;
  }
  const text = q.text.trim();
  if (text) {
    const idx = INDEX.get(b.id) ?? '';
    if (!text.split(/\s+/).every((t) => idx.includes(strip(t)))) return false;
  }
  return true;
}

function comparator(q: CatalogQuery): (a: BjcpBeer, b: BjcpBeer) => number {
  switch (q.sort) {
    case 'style':
      return (a, b) => styleOrder(a) - styleOrder(b) || a.name.localeCompare(b.name, 'it');
    case 'abv-asc':
      return (a, b) => (abvOf(a) ?? 99) - (abvOf(b) ?? 99);
    case 'abv-desc':
      return (a, b) => (abvOf(b) ?? -1) - (abvOf(a) ?? -1);
    case 'ibu-asc':
      return (a, b) => (ibuOf(a) ?? 99) - (ibuOf(b) ?? 99);
    case 'ibu-desc':
      return (a, b) => (ibuOf(b) ?? -1) - (ibuOf(a) ?? -1);
    case 'srm-asc':
      return (a, b) => (srmOf(a) ?? 99) - (srmOf(b) ?? 99);
    case 'srm-desc':
      return (a, b) => (srmOf(b) ?? -1) - (srmOf(a) ?? -1);
    case 'name-desc':
      return (a, b) => b.name.localeCompare(a.name, 'it');
    default:
      return (a, b) => a.name.localeCompare(b.name, 'it');
  }
}

export function searchBeers(q: CatalogQuery): BjcpBeer[] {
  return ALL_BEERS.filter((b) => matchesBeer(b, q)).sort(comparator(q));
}

/** Suggerimenti per la ricerca in navbar: pochi risultati, per nome. */
export function suggestBeers(text: string, limit = 6): BjcpBeer[] {
  const t = text.trim();
  if (!t) return [];
  return searchBeers({ ...EMPTY_CATALOG, text: t }).slice(0, limit);
}

export function countActiveFilters(q: CatalogQuery): number {
  let n = q.categories.length + q.families.length + q.styles.length;
  if (q.abv.min > ABV_RANGE.min || q.abv.max < ABV_RANGE.max) n++;
  if (q.ibu.min > IBU_RANGE.min || q.ibu.max < IBU_RANGE.max) n++;
  if (q.srm.min > SRM_RANGE.min || q.srm.max < SRM_RANGE.max) n++;
  if (q.text.trim()) n++;
  return n;
}

// ── Serializzazione nell'URL ────────────────────────────────────────────────

const numInRange = (r: NumRange, g: NumRange) => r.min > g.min || r.max < g.max;

export function toCatalogSearch(q: CatalogQuery): string {
  const p = new URLSearchParams();
  if (q.text.trim()) p.set('q', q.text.trim());
  if (q.categories.length) p.set('cat', q.categories.join('|'));
  if (q.families.length) p.set('fam', q.families.join('|'));
  if (q.styles.length) p.set('stile', q.styles.join(','));
  if (q.sort !== 'name') p.set('ord', q.sort);
  if (numInRange(q.abv, ABV_RANGE)) p.set('abv', `${q.abv.min}-${q.abv.max}`);
  if (numInRange(q.ibu, IBU_RANGE)) p.set('ibu', `${q.ibu.min}-${q.ibu.max}`);
  if (numInRange(q.srm, SRM_RANGE)) p.set('srm', `${q.srm.min}-${q.srm.max}`);
  const s = p.toString();
  return s ? `?${s}` : '';
}

function numPair(raw: string | null, fallback: NumRange): NumRange {
  if (!raw) return { ...fallback };
  const [a, b] = raw.split('-');
  const num = (s: string, f: number) => (s != null && s.trim() !== '' && Number.isFinite(Number(s)) ? Number(s) : f);
  return { min: num(a, fallback.min), max: num(b, fallback.max) };
}

export function fromCatalogSearch(search: string): CatalogQuery {
  const p = new URLSearchParams(search);
  const pipe = (k: string) => (p.get(k) ? p.get(k)!.split('|').filter(Boolean) : []);
  const comma = (k: string) => (p.get(k) ? p.get(k)!.split(',').filter(Boolean) : []);
  const sort = p.get('ord') as CatalogSort | null;
  return {
    text: p.get('q') ?? '',
    categories: pipe('cat'),
    families: pipe('fam'),
    styles: comma('stile'),
    abv: numPair(p.get('abv'), ABV_RANGE),
    ibu: numPair(p.get('ibu'), IBU_RANGE),
    srm: numPair(p.get('srm'), SRM_RANGE),
    sort: SORTS.some((s) => s.id === sort) ? (sort as CatalogSort) : 'name',
  };
}

/** Query puntata su un solo stile: «vedi tutte le birre di questo stile». */
export function queryForStyle(id: string): CatalogQuery {
  return { ...EMPTY_CATALOG, styles: [id] };
}
