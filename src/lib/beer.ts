import { SPECIES } from '../data/beers';
import { STYLES } from '../data/styles';
import { AXES } from '../data/types';
import type { Axis, BeerSpecies, BeerStats, BeerStyleId } from '../data/types';

// ─────────────────────────────────────────────────────────────────────────────
// Derivate dal corpus. Tutto ciò che si può calcolare dai dati non va scritto
// a mano: elenchi di paesi, famiglie, intervalli di ABV/IBU/SRM.
// ─────────────────────────────────────────────────────────────────────────────

export interface ComputedStats {
  maxPalato: number;
  luppolo: number;
  maltosita: number;
  aroma: number;
  fermentazione: number;
  bevibilita: number;
}

const scalar = (base: number, level: number) => Math.floor((base * 2 * level) / 100) + 5 + level;

/** Le stesse formule del gioco, così le due schede non divergono. */
export function computeStats(species: BeerSpecies, level: number): ComputedStats {
  const b: BeerStats = species.baseStats;
  return {
    maxPalato: Math.floor((b.corpo * 2 * level) / 100) + level + 12,
    luppolo: scalar(b.luppolo, level),
    maltosita: scalar(b.maltosita, level),
    aroma: scalar(b.aroma, level),
    fermentazione: scalar(b.fermentazione, level),
    bevibilita: scalar(b.bevibilita, level),
  };
}

export const ALL: BeerSpecies[] = [...SPECIES].sort((a, b) => a.dexNumber - b.dexNumber);

export const BY_ID = new Map(ALL.map((s) => [s.id, s]));

export const speciesOf = (id: string): BeerSpecies | undefined => BY_ID.get(id);

export const styleOf = (s: BeerSpecies) => STYLES[s.style];

export const COUNTRIES: string[] = [...new Set(ALL.map((s) => s.country))].sort((a, b) => a.localeCompare(b, 'it'));

export const FAMILIES: string[] = [...new Set(ALL.map((s) => styleOf(s).family))].sort((a, b) => a.localeCompare(b, 'it'));

export const STYLE_LIST = Object.values(STYLES).sort((a, b) => a.name.localeCompare(b.name, 'it'));

export const beersOfStyle = (id: BeerStyleId) => ALL.filter((s) => s.style === id);

export const beersOfFamily = (family: string) => ALL.filter((s) => styleOf(s).family === family);

export const beersOfCountry = (country: string) => ALL.filter((s) => s.country === country);

/** Intervallo reale di un campo numerico del corpus. Usato dai filtri. */
export function rangeOf(pick: (s: BeerSpecies) => number) {
  const vals = ALL.map(pick);
  return { min: Math.floor(Math.min(...vals)), max: Math.ceil(Math.max(...vals)) };
}

export const ABV_RANGE = rangeOf((s) => s.abv);
export const IBU_RANGE = rangeOf((s) => s.ibu);
export const SRM_RANGE = rangeOf((s) => s.srm);

/** L'asse su cui una birra è più caratteristica: la sua "firma". */
export function signatureAxis(s: BeerSpecies): Axis {
  return AXES.reduce((best, a) => (s.profile[a] > s.profile[best] ? a : best), AXES[0]);
}

/** Il profilo normalizzato: serve per la similarità e per il radar comparativo. */
export function profileVector(s: BeerSpecies): number[] {
  return AXES.map((a) => s.profile[a]);
}

/** Distanza euclidea pesata fra profili, con un termine sulla gradazione. */
export function profileDistance(a: BeerSpecies, b: BeerSpecies): number {
  let sum = 0;
  for (const ax of AXES) {
    const d = a.profile[ax] - b.profile[ax];
    sum += d * d;
  }
  const gradazione = Math.abs(a.abv - b.abv) * 0.6;
  return Math.sqrt(sum) + gradazione;
}

export const MAX_PROFILE_DISTANCE = Math.sqrt(AXES.length * 25) + 6;

/** Somiglianza 0–1, per mostrarla come percentuale. */
export function similarity(a: BeerSpecies, b: BeerSpecies): number {
  return Math.max(0, 1 - profileDistance(a, b) / MAX_PROFILE_DISTANCE);
}

export function similarTo(target: BeerSpecies, n = 5) {
  return ALL
    .filter((s) => s.id !== target.id)
    .map((s) => ({ species: s, score: similarity(target, s) }))
    .sort((x, y) => y.score - x.score)
    .slice(0, n);
}

/** La birra del corpus che incarna meglio un asse. Usato nella guida. */
export function exemplarsOf(axis: Axis, n = 3) {
  return [...ALL].sort((a, b) => b.profile[axis] - a.profile[axis]).slice(0, n);
}

/** Quante birre hanno un asse a un certo livello. Per i grafici di distribuzione. */
export function axisDistribution(axis: Axis): number[] {
  const out = [0, 0, 0, 0, 0, 0];
  for (const s of ALL) out[s.profile[axis]]++;
  return out;
}

/** Estrae il primo frammento di testo che contiene la query, per l'anteprima. */
export function findSnippet(s: BeerSpecies, needle: string, maxLen = 190): string | null {
  if (!needle) return null;
  const n = needle.toLowerCase();
  const fields: string[] = [
    styleOf(s).blurb, s.history, s.pairing, s.fact, `${s.origin} ${s.country}`,
  ];
  for (const f of fields) {
    const i = f.toLowerCase().indexOf(n);
    if (i < 0) continue;
    const start = Math.max(0, i - 70);
    const end = Math.min(f.length, i + n.length + maxLen - 70);
    return `${start > 0 ? '…' : ''}${f.slice(start, end).trim()}${end < f.length ? '…' : ''}`;
  }
  return null;
}

/** Raggruppa per un campo testuale, ordinando i gruppi per dimensione. */
export function groupBy<T>(items: T[], key: (t: T) => string): { key: string; items: T[] }[] {
  const map = new Map<string, T[]>();
  for (const it of items) {
    const k = key(it);
    const arr = map.get(k);
    if (arr) arr.push(it);
    else map.set(k, [it]);
  }
  return [...map.entries()]
    .map(([k, v]) => ({ key: k, items: v }))
    .sort((a, b) => b.items.length - a.items.length || a.key.localeCompare(b.key, 'it'));
}
