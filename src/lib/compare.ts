import { useSyncExternalStore } from 'react';
import { BJCP_BY_ID } from '../data/bjcp';
import type { BjcpStyle } from '../data/bjcp';
import { rangeLabel } from './catalog';

// ─────────────────────────────────────────────────────────────────────────────
// Confronto stili. Lo stato è un "carrello" di 2–5 stili persistito in
// localStorage: sopravvive alla navigazione (hash routing) e al reload. Le
// metriche numeriche sono quelle dichiarate dal BJCP; OG/FG vivono solo nel
// radar e nella tabella tecnica, non nei grafici a barre.
// ─────────────────────────────────────────────────────────────────────────────

export const MIN_COMPARE = 2;
export const MAX_COMPARE = 5;
const STORAGE_KEY = 'edubeer.compare.v1';

/** Palette fissa: un colore per posizione di selezione, stabile fra i grafici. */
export const STYLE_COLORS = ['#d9a441', '#5b8dd9', '#8bac0f', '#c0563a', '#a06bd6'];
export const styleColor = (index: number): string => STYLE_COLORS[index % STYLE_COLORS.length];

// ── Carrello ────────────────────────────────────────────────────────────────

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr: unknown = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x): x is string => typeof x === 'string' && BJCP_BY_ID.has(x))
      .slice(0, MAX_COMPARE);
  } catch {
    return [];
  }
}

let selected: string[] = load();
const listeners = new Set<() => void>();

function commit(next: string[]) {
  selected = next;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(selected)); } catch { /* quota piena: si ignora */ }
  listeners.forEach((l) => l());
}

const store = {
  subscribe(l: () => void): () => void {
    listeners.add(l);
    return () => { listeners.delete(l); };
  },
  getSnapshot(): string[] { return selected; },
};

/** Id degli stili nel carrello, nell'ordine di aggiunta. */
export function useCompare(): string[] {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

export const isCompared = (id: string): boolean => selected.includes(id);

export function addToCompare(id: string): void {
  if (selected.includes(id) || selected.length >= MAX_COMPARE || !BJCP_BY_ID.has(id)) return;
  commit([...selected, id]);
}

export function removeFromCompare(id: string): void {
  if (!selected.includes(id)) return;
  commit(selected.filter((x) => x !== id));
}

export function toggleCompare(id: string): void {
  if (selected.includes(id)) removeFromCompare(id);
  else addToCompare(id);
}

export function clearCompare(): void { commit([]); }

// ── Metriche ────────────────────────────────────────────────────────────────

export type MetricKey = 'abv' | 'ibu' | 'srm' | 'og' | 'fg';

export interface StyleMetric {
  key: MetricKey;
  label: string;
  /** Sigla per gli assi del radar. */
  short: string;
  /** Unità da appendere ai valori ('' quando non c'è). */
  unit: string;
  digits: number;
  /** Passo dei tick sull'asse dei grafici a barre. */
  tickStep?: number;
  pair: (s: BjcpStyle) => [number, number] | null;
  /** Dominio fisso [min, max] per radar e assi. */
  domain: [number, number];
}

// Dominii fissi, ricavati dai 116 stili BJCP 2021 (min/max globali, arrotondati).
// Zero-based dove lo zero ha senso (ABV, IBU, SRM); OG/FG partono dal minimo reale.
const ABV_DOMAIN: [number, number] = [0, 14];
const IBU_DOMAIN: [number, number] = [0, 100];
const SRM_DOMAIN: [number, number] = [0, 40];
const OG_DOMAIN: [number, number] = [1.02, 1.13];
const FG_DOMAIN: [number, number] = [0.998, 1.04];

export const RADAR_METRICS: StyleMetric[] = [
  { key: 'abv', label: 'Gradazione', short: 'ABV', unit: '%', digits: 1, tickStep: 2, pair: (s) => s.abv, domain: ABV_DOMAIN },
  { key: 'ibu', label: 'Amarezza', short: 'IBU', unit: ' IBU', digits: 0, tickStep: 20, pair: (s) => s.ibu, domain: IBU_DOMAIN },
  { key: 'srm', label: 'Colore', short: 'SRM', unit: ' SRM', digits: 1, tickStep: 10, pair: (s) => s.color, domain: SRM_DOMAIN },
  { key: 'og', label: 'Densità iniziale', short: 'OG', unit: '', digits: 3, pair: (s) => s.og, domain: OG_DOMAIN },
  { key: 'fg', label: 'Densità finale', short: 'FG', unit: '', digits: 3, pair: (s) => s.fg, domain: FG_DOMAIN },
];

export const BAR_METRICS: StyleMetric[] = RADAR_METRICS.filter(
  (m) => m.key === 'abv' || m.key === 'ibu' || m.key === 'srm',
);

export const midOf = (p: [number, number] | null): number | null => (p ? (p[0] + p[1]) / 2 : null);

/** Etichetta di un intervallo: «4.2–5.6%», oppure «n.d.» quando manca. */
export function pairLabel(p: [number, number] | null, unit = '', digits = 1): string {
  if (!p) return 'n.d.';
  return rangeLabel(p, unit, digits);
}

/** Numero formattato per assi e tick. */
export function fmt(v: number, digits = 1): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(digits);
}

// ── Ordinamento ─────────────────────────────────────────────────────────────

export type CompareSort =
  | 'sel' | 'name-asc' | 'name-desc'
  | 'abv-asc' | 'abv-desc'
  | 'ibu-asc' | 'ibu-desc';

export const COMPARE_SORTS: { id: CompareSort; label: string }[] = [
  { id: 'sel', label: 'Ordine di selezione' },
  { id: 'name-asc', label: 'Nome (A→Z)' },
  { id: 'name-desc', label: 'Nome (Z→A)' },
  { id: 'abv-asc', label: 'Gradazione crescente' },
  { id: 'abv-desc', label: 'Gradazione decrescente' },
  { id: 'ibu-asc', label: 'Amarezza crescente' },
  { id: 'ibu-desc', label: 'Amarezza decrescente' },
];

export function sortStyles(styles: BjcpStyle[], sort: CompareSort): BjcpStyle[] {
  const indexed = styles.map((s, i) => ({ s, i }));
  const byMid = (s: BjcpStyle, key: 'abv' | 'ibu'): number => midOf(s[key]) ?? Infinity;
  indexed.sort((a, b) => {
    let d = 0;
    switch (sort) {
      case 'name-asc': d = a.s.name.localeCompare(b.s.name, 'it'); break;
      case 'name-desc': d = b.s.name.localeCompare(a.s.name, 'it'); break;
      case 'abv-asc': d = byMid(a.s, 'abv') - byMid(b.s, 'abv'); break;
      case 'abv-desc': d = byMid(b.s, 'abv') - byMid(a.s, 'abv'); break;
      case 'ibu-asc': d = byMid(a.s, 'ibu') - byMid(b.s, 'ibu'); break;
      case 'ibu-desc': d = byMid(b.s, 'ibu') - byMid(a.s, 'ibu'); break;
      default: d = a.i - b.i;
    }
    // I valori null scivolano in fondo (Infinity), ma l'ordine resta stabile.
    return d || a.i - b.i;
  });
  return indexed.map((x) => x.s);
}
