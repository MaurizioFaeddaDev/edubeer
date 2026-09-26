import { SPECIES } from '../data/beers';
import { STYLES } from '../data/styles';
import type { BeerSpecies, BeerStyleId } from '../data/types';

// ─────────────────────────────────────────────────────────────────────────────
// Derivate dal corpus degli approfondimenti: le trenta birre con scheda vera.
// Qui non ci sono assi: l'enciclopedia BJCP vive in `catalog.ts`.
// ─────────────────────────────────────────────────────────────────────────────

export const ALL: BeerSpecies[] = [...SPECIES].sort((a, b) => a.dexNumber - b.dexNumber);

export const BY_ID = new Map(ALL.map((s) => [s.id, s]));

export const speciesOf = (id: string): BeerSpecies | undefined => BY_ID.get(id);

export const styleOf = (s: BeerSpecies) => STYLES[s.style];

export const beersOfStyle = (id: BeerStyleId) => ALL.filter((s) => s.style === id);
