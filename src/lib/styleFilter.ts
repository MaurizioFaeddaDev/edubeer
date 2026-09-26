import { BJCP_STYLES } from '../data/bjcp';
import type { BjcpStyle } from '../data/bjcp';
import { ABV_RANGE, IBU_RANGE, SRM_RANGE } from './catalog';
import type { NumRange } from './catalog';

// ─────────────────────────────────────────────────────────────────────────────
// Il filtro della sezione Stili. Stessa grammatica del catalogo — testo,
// famiglia, categoria, i tre numeri — ma qui l'oggetto filtrato è lo stile
// stesso, non la birra che lo eredita. Un intervallo «ABV ≥ 8%» mostra gli
// stili che *toccano* quella gradazione.
// ─────────────────────────────────────────────────────────────────────────────

export type StyleSort =
  | 'code' | 'name' | 'name-desc'
  | 'abv-asc' | 'abv-desc'
  | 'ibu-asc' | 'ibu-desc'
  | 'srm-asc' | 'srm-desc';

export interface StyleQuery {
  text: string;
  /** Nomi delle categorie BJCP. */
  categories: string[];
  families: string[];
  abv: NumRange;
  ibu: NumRange;
  srm: NumRange;
  sort: StyleSort;
}

export const STYLE_SORTS: { id: StyleSort; label: string }[] = [
  { id: 'code', label: 'Codice BJCP' },
  { id: 'name', label: 'Nome (A→Z)' },
  { id: 'name-desc', label: 'Nome (Z→A)' },
  { id: 'abv-asc', label: 'Gradazione crescente' },
  { id: 'abv-desc', label: 'Gradazione decrescente' },
  { id: 'ibu-asc', label: 'Amarezza crescente' },
  { id: 'ibu-desc', label: 'Amarezza decrescente' },
  { id: 'srm-asc', label: 'Colore crescente' },
  { id: 'srm-desc', label: 'Colore decrescente' },
];

export const EMPTY_STYLE_QUERY: StyleQuery = {
  text: '',
  categories: [],
  families: [],
  abv: { ...ABV_RANGE },
  ibu: { ...IBU_RANGE },
  srm: { ...SRM_RANGE },
  sort: 'code',
};

/** Ordine ufficiale delle linee guida. */
const STYLE_ORDER = new Map(BJCP_STYLES.map((s, i) => [s.id, i]));

const strip = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** Indice testuale: codice, nome, categoria, famiglia e sintesi dello stile. */
const TEXT_INDEX = new Map<string, string>(
  BJCP_STYLES.map((s) => [s.id, strip([s.code, s.name, s.category, s.family, s.blurb].join(' · '))]),
);

const EPS = 1e-9;
const mid = (p: [number, number] | null): number | null => (p ? (p[0] + p[1]) / 2 : null);

/** Vero se l'intervallo dichiarato dallo stile tocca quello scelto nei filtri. */
function touches(pair: [number, number] | null, r: NumRange, global: NumRange): boolean {
  if (!pair) return r.min <= global.min + EPS && r.max >= global.max - EPS;
  return pair[0] <= r.max + EPS && pair[1] >= r.min - EPS;
}

export function matchesStyle(s: BjcpStyle, q: StyleQuery): boolean {
  if (q.categories.length && !q.categories.includes(s.category)) return false;
  if (q.families.length && !q.families.includes(s.family)) return false;
  if (!touches(s.abv, q.abv, ABV_RANGE)) return false;
  if (!touches(s.ibu, q.ibu, IBU_RANGE)) return false;
  if (!touches(s.color, q.srm, SRM_RANGE)) return false;
  const text = q.text.trim();
  if (text) {
    const idx = TEXT_INDEX.get(s.id) ?? '';
    if (!text.split(/\s+/).every((t) => idx.includes(strip(t)))) return false;
  }
  return true;
}

function comparator(q: StyleQuery): (a: BjcpStyle, b: BjcpStyle) => number {
  switch (q.sort) {
    case 'name':
      return (a, b) => a.name.localeCompare(b.name, 'it');
    case 'abv-asc':
      return (a, b) => (mid(a.abv) ?? 99) - (mid(b.abv) ?? 99);
    case 'abv-desc':
      return (a, b) => (mid(b.abv) ?? -1) - (mid(a.abv) ?? -1);
    case 'ibu-asc':
      return (a, b) => (mid(a.ibu) ?? 99) - (mid(b.ibu) ?? 99);
    case 'ibu-desc':
      return (a, b) => (mid(b.ibu) ?? -1) - (mid(a.ibu) ?? -1);
    case 'srm-asc':
      return (a, b) => (a.srm ?? 99) - (b.srm ?? 99);
    case 'srm-desc':
      return (a, b) => (b.srm ?? -1) - (a.srm ?? -1);
    case 'name-desc':
      return (a, b) => b.name.localeCompare(a.name, 'it');
    default:
      return (a, b) => (STYLE_ORDER.get(a.id) ?? 0) - (STYLE_ORDER.get(b.id) ?? 0);
  }
}

export function searchStyles(q: StyleQuery): BjcpStyle[] {
  return BJCP_STYLES.filter((s) => matchesStyle(s, q)).sort(comparator(q));
}

/** Suggerimenti per la ricerca in navbar: pochi risultati, dal più pertinente. */
export function suggestStyles(text: string, limit = 5): BjcpStyle[] {
  const t = text.trim();
  if (!t) return [];
  return searchStyles({ ...EMPTY_STYLE_QUERY, text: t }).slice(0, limit);
}

export function countStyleFilters(q: StyleQuery): number {
  let n = q.categories.length + q.families.length;
  if (q.abv.min > ABV_RANGE.min || q.abv.max < ABV_RANGE.max) n++;
  if (q.ibu.min > IBU_RANGE.min || q.ibu.max < IBU_RANGE.max) n++;
  if (q.srm.min > SRM_RANGE.min || q.srm.max < SRM_RANGE.max) n++;
  if (q.text.trim()) n++;
  return n;
}

// ── Serializzazione nell'URL ────────────────────────────────────────────────

const numInRange = (r: NumRange, g: NumRange) => r.min > g.min || r.max < g.max;

const numPair = (raw: string | null, fallback: NumRange): NumRange => {
  if (!raw) return { ...fallback };
  const [a, b] = raw.split('-');
  const num = (s: string, f: number) => (s != null && s.trim() !== '' && Number.isFinite(Number(s)) ? Number(s) : f);
  return { min: num(a, fallback.min), max: num(b, fallback.max) };
};

export function toStyleSearch(q: StyleQuery): string {
  const p = new URLSearchParams();
  if (q.text.trim()) p.set('q', q.text.trim());
  if (q.categories.length) p.set('cat', q.categories.join('|'));
  if (q.families.length) p.set('fam', q.families.join('|'));
  if (q.sort !== 'code') p.set('ord', q.sort);
  if (numInRange(q.abv, ABV_RANGE)) p.set('abv', `${q.abv.min}-${q.abv.max}`);
  if (numInRange(q.ibu, IBU_RANGE)) p.set('ibu', `${q.ibu.min}-${q.ibu.max}`);
  if (numInRange(q.srm, SRM_RANGE)) p.set('srm', `${q.srm.min}-${q.srm.max}`);
  const s = p.toString();
  return s ? `?${s}` : '';
}

export function fromStyleSearch(search: string): StyleQuery {
  const p = new URLSearchParams(search);
  const pipe = (k: string) => (p.get(k) ? p.get(k)!.split('|').filter(Boolean) : []);
  const sort = p.get('ord') as StyleSort | null;
  return {
    text: p.get('q') ?? '',
    categories: pipe('cat'),
    families: pipe('fam'),
    abv: numPair(p.get('abv'), ABV_RANGE),
    ibu: numPair(p.get('ibu'), IBU_RANGE),
    srm: numPair(p.get('srm'), SRM_RANGE),
    sort: STYLE_SORTS.some((s) => s.id === sort) ? (sort as StyleSort) : 'code',
  };
}
