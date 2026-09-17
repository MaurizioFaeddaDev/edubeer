import { AXES, AXIS_IT } from '../data/types';
import type { Axis, BeerSpecies } from '../data/types';
import { ALL, STYLE_LIST } from './beer';
import { STYLES } from '../data/styles';

// ─────────────────────────────────────────────────────────────────────────────
// Il motore di consultazione: filtro sul profilo sensoriale, ricerca testuale,
// ordinamenti e serializzazione nell'URL (così una ricerca è condivisibile).
// ─────────────────────────────────────────────────────────────────────────────

export type SortKey =
  | 'dex' | 'name' | 'abv-asc' | 'abv-desc' | 'ibu-desc' | 'srm-desc'
  | 'rilevanza'
  | `axis-${Axis}`;

export interface AxisRange {
  min: number;
  max: number;
}

export interface Query {
  text: string;
  families: string[];
  countries: string[];
  styles: string[];
  /** Vincoli sul profilo: min 0 e max 5 significano "nessun vincolo". */
  axes: Record<Axis, AxisRange>;
  abv: { min: number; max: number };
  ibu: { min: number; max: number };
  srm: { min: number; max: number };
  sort: SortKey;
}

export const NO_AXIS_CONSTRAINT: AxisRange = { min: 0, max: 5 };

export const EMPTY_QUERY: Query = {
  text: '',
  families: [],
  countries: [],
  styles: [],
  axes: Object.fromEntries(AXES.map((a) => [a, { ...NO_AXIS_CONSTRAINT }])) as Record<Axis, AxisRange>,
  abv: { min: 0, max: 20 },
  ibu: { min: 0, max: 120 },
  srm: { min: 0, max: 50 },
  sort: 'dex',
};

// ── Normalizzazione del testo (accenti e maiuscole) ─────────────────────────

const strip = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** Indice testuale precalcolato: nome, stile, famiglia, paese, storia, abbinamento. */
const SEARCH_INDEX = new Map<string, string>(
  ALL.map((s) => [
    s.id,
    strip([
      s.name, STYLES[s.style].name, STYLES[s.style].family, STYLES[s.style].blurb,
      s.origin, s.country, s.history, s.pairing, s.fact,
    ].join(' · ')),
  ]),
);

export function matchesText(s: BeerSpecies, query: string): boolean {
  if (!query.trim()) return true;
  const idx = SEARCH_INDEX.get(s.id) ?? '';
  // Tutti i termini devono comparire: ricerca AND, come ci si aspetta da un tool.
  return query.trim().split(/\s+/).every((term) => idx.includes(strip(term)));
}

export function countAxisConstraints(q: Query): number {
  return AXES.filter((a) => q.axes[a].min > 0 || q.axes[a].max < 5).length;
}

export function countActiveFilters(q: Query): number {
  return q.families.length + q.countries.length + q.styles.length + countAxisConstraints(q)
    + (q.abv.min > EMPTY_QUERY.abv.min || q.abv.max < EMPTY_QUERY.abv.max ? 1 : 0)
    + (q.ibu.min > EMPTY_QUERY.ibu.min || q.ibu.max < EMPTY_QUERY.ibu.max ? 1 : 0)
    + (q.srm.min > EMPTY_QUERY.srm.min || q.srm.max < EMPTY_QUERY.srm.max ? 1 : 0)
    + (q.text.trim() ? 1 : 0);
}

export function matches(s: BeerSpecies, q: Query): boolean {
  if (q.families.length && !q.families.includes(STYLES[s.style].family)) return false;
  if (q.countries.length && !q.countries.includes(s.country)) return false;
  if (q.styles.length && !q.styles.includes(s.style)) return false;
  for (const a of AXES) {
    const v = s.profile[a];
    const r = q.axes[a];
    if (v < r.min || v > r.max) return false;
  }
  if (s.abv < q.abv.min - 0.001 || s.abv > q.abv.max + 0.001) return false;
  if (s.ibu < q.ibu.min || s.ibu > q.ibu.max) return false;
  if (s.srm < q.srm.min || s.srm > q.srm.max) return false;
  return matchesText(s, q.text);
}

/**
 * Quanto una birra "assomiglia" alla ricerca sul piano sensoriale. Serve a
 * ordinare per rilevanza quando si è impostato un profilo obiettivo.
 */
export function profileFit(s: BeerSpecies, q: Query): number {
  let score = 0;
  let weight = 0;
  for (const a of AXES) {
    const r = q.axes[a];
    const constrained = r.min > 0 || r.max < 5;
    if (!constrained) continue;
    const v = s.profile[a];
    const target = (r.min + r.max) / 2;
    const amplitude = Math.max(0.5, (r.max - r.min) / 2);
    score += 1 - Math.min(1, Math.abs(v - target) / amplitude);
    weight += 1;
  }
  return weight === 0 ? 0 : score / weight;
}

export function search(q: Query): BeerSpecies[] {
  const out = ALL.filter((s) => matches(s, q));
  const cmp = comparator(q);
  return out.sort(cmp);
}

function comparator(q: Query): (a: BeerSpecies, b: BeerSpecies) => number {
  switch (q.sort) {
    case 'name': return (a, b) => a.name.localeCompare(b.name, 'it');
    case 'abv-asc': return (a, b) => a.abv - b.abv;
    case 'abv-desc': return (a, b) => b.abv - a.abv;
    case 'ibu-desc': return (a, b) => b.ibu - a.ibu;
    case 'srm-desc': return (a, b) => b.srm - a.srm;
    case 'rilevanza': return (a, b) => profileFit(b, q) - profileFit(a, q) || a.dexNumber - b.dexNumber;
    default: {
      if (q.sort.startsWith('axis-')) {
        const axis = q.sort.slice(5) as Axis;
        return (a, b) => b.profile[axis] - a.profile[axis] || a.dexNumber - b.dexNumber;
      }
      return (a, b) => a.dexNumber - b.dexNumber;
    }
  }
}

// ── Ricerche pronte: la parte che rende il tool utile a chi non sa i numeri ──

export interface Preset {
  id: string;
  label: string;
  hint: string;
  apply: (q: Query) => Query;
}

const withAxes = (base: Query, spec: Partial<Record<Axis, Partial<AxisRange>>>): Query => {
  const axes = { ...base.axes };
  for (const a of AXES) axes[a] = { ...NO_AXIS_CONSTRAINT };
  for (const [axis, range] of Object.entries(spec) as [Axis, Partial<AxisRange>][]) {
    axes[axis] = { min: range.min ?? 0, max: range.max ?? 5 };
  }
  return { ...EMPTY_QUERY, text: base.text, axes, sort: 'rilevanza' };
};

export const PRESETS: Preset[] = [
  {
    id: 'scuro-poco-amaro',
    label: 'Scuro ma poco amaro',
    hint: 'Smonta lo stereotipo più duro a morire: «scuro = amaro». La tostatura dà caffè e cacao, non IBU. Cinque birre brune e nere che non aggrediscono.',
    apply: (q) => withAxes(q, { roast: { min: 2 }, bitter: { max: 2 } }),
  },
  {
    id: 'luppolato-non-amaro',
    label: 'Luppolato ma non amaro',
    hint: 'Una sola birra in archivio, ed è esattamente il punto: aroma di luppolo e amarezza sono due cose indipendenti. Chi non lo sa non capisce una NEIPA.',
    apply: (q) => withAxes(q, { hop: { min: 4 }, bitter: { max: 2 } }),
  },
  {
    id: 'acido-dissetante',
    label: 'Acido e dissetante',
    hint: 'Fermentazione mista o spontanea, corpo leggero. L\'acidità che rinfresca invece di stancare.',
    apply: (q) => withAxes(q, { sour: { min: 3 }, body: { max: 2 } }),
  },
  {
    id: 'leggero-ma-amaro',
    label: 'Leggero ma amaro',
    hint: 'Amaro alto e corpo snello: la combinazione che rende una birra pericolosamente beverina. Finale secco, zero appesantimento.',
    apply: (q) => withAxes(q, { body: { max: 2 }, bitter: { min: 4 } }),
  },
  {
    id: 'tostato-dolce',
    label: 'Tostato e dolce',
    hint: 'Tostatura e dolcezza insieme: due assi che sembrano opposti e invece convivono. È il segreto di una buona porter.',
    apply: (q) => withAxes(q, { roast: { min: 3 }, sweet: { min: 3 } }),
  },
  {
    id: 'maltato-alcolico',
    label: 'Maltato e alcolico',
    hint: 'Struttura da meditazione: frutta secca, melassa, corpo pieno. Le birre da calice, da sedia e da tempo.',
    apply: (q) => withAxes(q, { malt: { min: 4 }, sweet: { min: 3 }, body: { min: 4 } }),
  },
  {
    id: 'lievito-protagonista',
    label: 'Lievito protagonista',
    hint: 'Esteri e fenoli in evidenza: banana, chiodi di garofano, pepe. Il ceppo di lievito come firma del birrificio.',
    apply: (q) => withAxes(q, { yeast: { min: 4 } }),
  },
  {
    id: 'delicato-pulito',
    label: 'Delicato e pulito',
    hint: 'Niente di dominante e poco luppolo aromatico: birre che non si nascondono dietro nulla. Il banco di prova più difficile per un birraio.',
    apply: (q) => withAxes(q, { roast: { max: 1 }, sour: { max: 1 }, smoke: { max: 1 }, hop: { max: 2 } }),
  },
  {
    id: 'affumicato',
    label: 'Affumicato',
    hint: 'Malto essiccato su fuoco diretto. Una sola birra in archivio — e un tempo tutte le birre del mondo sapevano così.',
    apply: (q) => withAxes(q, { smoke: { min: 3 } }),
  },
  {
    id: 'estremo',
    label: 'Estremo, sopra gli 8%',
    hint: 'Le birre che non si dimenticano: gradazione alta, struttura importante, sorsi piccoli.',
    apply: (q) => ({ ...withAxes(q, {}), abv: { min: 8, max: 20 }, sort: 'abv-desc' }),
  },
];

// ── Serializzazione nell'URL ────────────────────────────────────────────────

export function toParams(q: Query): string {
  const p = new URLSearchParams();
  if (q.text.trim()) p.set('q', q.text.trim());
  if (q.families.length) p.set('fam', q.families.join(','));
  if (q.countries.length) p.set('paese', q.countries.join(','));
  if (q.styles.length) p.set('stile', q.styles.join(','));
  if (q.sort !== 'dex') p.set('ord', q.sort);
  const axes: string[] = [];
  for (const a of AXES) {
    const r = q.axes[a];
    if (r.min > 0) axes.push(`${a}>=${r.min}`);
    if (r.max < 5) axes.push(`${a}<=${r.max}`);
  }
  if (axes.length) p.set('assi', axes.join(','));
  if (q.abv.min > 0 || q.abv.max < 20) p.set('abv', `${q.abv.min}-${q.abv.max}`);
  if (q.ibu.min > 0 || q.ibu.max < 120) p.set('ibu', `${q.ibu.min}-${q.ibu.max}`);
  if (q.srm.min > 0 || q.srm.max < 50) p.set('srm', `${q.srm.min}-${q.srm.max}`);
  const s = p.toString();
  return s ? `?${s}` : '';
}

const numPair = (raw: string | null, fallback: { min: number; max: number }) => {
  if (!raw) return { ...fallback };
  const [a, b] = raw.split('-').map(Number);
  return {
    min: Number.isFinite(a) ? a : fallback.min,
    max: Number.isFinite(b) ? b : fallback.max,
  };
};

export function fromSearch(search: string): Query {
  const p = new URLSearchParams(search);
  const list = (k: string) => (p.get(k) ? p.get(k)!.split(',').filter(Boolean) : []);
  const axes = Object.fromEntries(AXES.map((a) => [a, { ...NO_AXIS_CONSTRAINT }])) as Record<Axis, AxisRange>;
  for (const token of list('assi')) {
    const m = /^([a-z]+)(>=|<=)(\d)$/.exec(token);
    if (!m) continue;
    const axis = m[1] as Axis;
    if (!AXES.includes(axis)) continue;
    if (m[2] === '>=') axes[axis].min = Number(m[3]);
    else axes[axis].max = Number(m[3]);
  }
  return {
    text: p.get('q') ?? '',
    families: list('fam'),
    countries: list('paese'),
    styles: list('stile'),
    axes,
    abv: numPair(p.get('abv'), EMPTY_QUERY.abv),
    ibu: numPair(p.get('ibu'), EMPTY_QUERY.ibu),
    srm: numPair(p.get('srm'), EMPTY_QUERY.srm),
    sort: (p.get('ord') as SortKey) ?? 'dex',
  };
}

export const ALL_STYLE_IDS = STYLE_LIST.map((s) => s.id);

/**
 * Quando una ricerca non dà risultati, il tool deve dire da dove allargare.
 * Per ogni vincolo attivo calcola quanti risultati si otterrebbero togliendolo:
 * è il modo più onesto di gestire il vuoto, invece di lasciare l'utente a
 * fiddlare a caso.
 */
export function relaxations(q: Query, limit = 5): { label: string; query: Query; count: number }[] {
  const out: { label: string; query: Query; count: number }[] = [];
  const push = (label: string, next: Query) => {
    const count = ALL.filter((s) => matches(s, next)).length;
    if (count > 0) out.push({ label, query: next, count });
  };

  for (const a of AXES) {
    const r = q.axes[a];
    if (r.min > 0) push(`togli «${AXIS_IT[a]} ≥ ${r.min}»`, { ...q, axes: { ...q.axes, [a]: { ...r, min: 0 } } });
    if (r.max < 5) push(`togli «${AXIS_IT[a]} ≤ ${r.max}»`, { ...q, axes: { ...q.axes, [a]: { ...r, max: 5 } } });
  }
  if (q.families.length) push('togli il filtro famiglia', { ...q, families: [] });
  if (q.countries.length) push('togli il filtro paese', { ...q, countries: [] });
  if (q.styles.length) push('togli il filtro stile', { ...q, styles: [] });
  if (q.abv.min > 0 || q.abv.max < 20) push('allarga la gradazione', { ...q, abv: { ...EMPTY_QUERY.abv } });
  if (q.ibu.min > 0 || q.ibu.max < 120) push('allarga l\'amarezza', { ...q, ibu: { ...EMPTY_QUERY.ibu } });
  if (q.srm.min > 0 || q.srm.max < 50) push('allarga il colore', { ...q, srm: { ...EMPTY_QUERY.srm } });
  if (q.text.trim()) push('cancella la ricerca testuale', { ...q, text: '' });

  return out.sort((x, y) => x.count - y.count || x.label.localeCompare(y.label, 'it')).slice(0, limit);
}

/** Filtri derivati da una birra: "mostrami le sue simili" in un clic. */
export function queryForSimilar(s: BeerSpecies): Query {
  const axes = Object.fromEntries(AXES.map((a) => [a, { ...NO_AXIS_CONSTRAINT }])) as Record<Axis, AxisRange>;
  for (const a of AXES) {
    axes[a] = { min: Math.max(0, s.profile[a] - 1), max: Math.min(5, s.profile[a] + 1) };
  }
  return { ...EMPTY_QUERY, axes, sort: 'rilevanza' };
}
