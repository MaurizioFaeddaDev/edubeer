import { describe, expect, it } from 'vitest';
import { ALL, BY_ID, beersOfStyle, speciesOf, styleOf } from '../beer';
import { SPECIES } from '../../data/beers';
import { STYLES } from '../../data/styles';
import type { BeerSpecies } from '../../data/types';

// ─────────────────────────────────────────────────────────────────────────────
// T-003 — suite sulla libreria degli approfondimenti (`lib/beer.ts`): le trenta
// birre con scheda scritta a mano. Qui non ci sono assi né dati per-birra
// inventati: l'invariante è che ogni specie punti a uno stile esistente.
// ─────────────────────────────────────────────────────────────────────────────

describe('beer — corpus delle trenta schede', () => {
  it('espone esattamente le 30 specie del BeerDex', () => {
    expect(SPECIES).toHaveLength(30);
    expect(ALL).toHaveLength(30);
    expect(new Set(ALL.map((s) => s.id)).size).toBe(30);
  });

  it('ordina per dexNumber crescente, senza buchi né duplicati', () => {
    const dex = ALL.map((s) => s.dexNumber);
    expect(dex).toEqual([...dex].sort((a, b) => a - b));
    expect(new Set(dex).size).toBe(30);
    expect(dex).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
  });

  it('ALL è una copia ordinata, non la stessa referenza di SPECIES', () => {
    expect(ALL).not.toBe(SPECIES);
    expect([...ALL].map((s) => s.id).sort()).toEqual([...SPECIES].map((s) => s.id).sort());
  });
});

describe('beer — accessor', () => {
  it('BY_ID / speciesOf risolvono ogni id noto e ignorano gli sconosciuti', () => {
    expect(BY_ID.size).toBe(30);
    for (const s of ALL) {
      expect(BY_ID.get(s.id)).toBe(s);
      expect(speciesOf(s.id)).toBe(s);
    }
    expect(speciesOf('__non-esiste__')).toBeUndefined();
  });

  it('styleOf è definito per ogni specie: nessuna scheda orfana', () => {
    // Invariante del corpus: ogni `style` deve esistere in STYLES.
    for (const s of ALL) {
      const style = styleOf(s);
      expect(style).toBeDefined();
      expect(style).toBe(STYLES[s.style]);
      expect(style.id).toBe(s.style);
    }
    expect(ALL.every((s) => STYLES[s.style] !== undefined)).toBe(true);
  });
});

describe('beer — beersOfStyle', () => {
  it('restituisce solo le specie dello stile richiesto', () => {
    const pilsner = beersOfStyle('pilsner');
    expect(pilsner.length).toBeGreaterThan(0);
    expect(pilsner.every((s) => s.style === 'pilsner')).toBe(true);
    expect([...pilsner].sort((a, b) => a.dexNumber - b.dexNumber)).toEqual(pilsner);
  });

  it('uno stile senza schede restituisce un array vuoto', () => {
    expect(beersOfStyle('amber')).toEqual(ALL.filter((s) => s.style === 'amber'));
    expect(beersOfStyle('__non-esiste__' as unknown as BeerSpecies['style'])).toEqual([]);
  });

  it('partiziona il corpus: l unione degli stili copre tutte e 30 le specie', () => {
    const styles = new Set(ALL.map((s) => s.style));
    const seen = new Set<string>();
    let total = 0;
    for (const id of styles) {
      const group = beersOfStyle(id);
      total += group.length;
      for (const s of group) {
        expect(s.style).toBe(id);
        expect(seen.has(s.id)).toBe(false);
        seen.add(s.id);
      }
    }
    expect(total).toBe(30);
    expect(seen.size).toBe(30);
  });
});
