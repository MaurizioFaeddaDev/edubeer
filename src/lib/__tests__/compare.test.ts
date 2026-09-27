import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BJCP_STYLES } from '../../data/bjcp';
import { MemoryStorage } from './helpers/localStorage';

// ─────────────────────────────────────────────────────────────────────────────
// T-003 — suite sulla logica pura del Confronta. L hook è testato sostituendo
// useSyncExternalStore: qui interessa la selezione persistita, non il render.
// ─────────────────────────────────────────────────────────────────────────────

vi.mock('react', () => ({
  useSyncExternalStore: (_subscribe: unknown, getSnapshot: () => string[]) => getSnapshot(),
}));

const STORAGE_KEY = 'edubeer.compare.v1';
const IDS = BJCP_STYLES.slice(0, 6).map((s) => s.id);
const load = () => import('../compare');

let storage: MemoryStorage;

beforeEach(() => {
  vi.resetModules();
  storage = new MemoryStorage();
  vi.stubGlobal('localStorage', storage);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('compare — costanti e helper puri', () => {
  it('espone i vincoli 2–5 e la palette di cinque colori', async () => {
    const c = await load();
    expect(c.MIN_COMPARE).toBe(2);
    expect(c.MAX_COMPARE).toBe(5);
    expect(c.STYLE_COLORS).toHaveLength(5);
    expect(c.styleColor(0)).toBe(c.STYLE_COLORS[0]);
    expect(c.styleColor(5)).toBe(c.STYLE_COLORS[0]);
    expect(c.styleColor(6)).toBe(c.STYLE_COLORS[1]);
  });

  it('midOf / pairLabel / fmt formattano i valori e i buchi', async () => {
    const c = await load();
    expect(c.midOf([4, 6])).toBe(5);
    expect(c.midOf(null)).toBeNull();
    expect(c.pairLabel([4.2, 5.6], '%')).toBe('4.2–5.6%');
    expect(c.pairLabel(null)).toBe('n.d.');
    expect(c.fmt(4, 1)).toBe('4');
    expect(c.fmt(4.2, 1)).toBe('4.2');
  });

  it('radar e barre espongono le metriche attese', async () => {
    const c = await load();
    expect(c.RADAR_METRICS.map((m) => m.key)).toEqual(['abv', 'ibu', 'srm', 'og', 'fg']);
    expect(c.BAR_METRICS.map((m) => m.key)).toEqual(['abv', 'ibu', 'srm']);
    const style = BJCP_STYLES[0];
    expect(c.RADAR_METRICS[0].pair(style)).toBe(style.abv);
    expect(c.RADAR_METRICS[0].domain).toEqual([0, 14]);
    expect(c.COMPARE_SORTS).toHaveLength(7);
    expect(c.COMPARE_SORTS[0].id).toBe('sel');
  });
});

describe('compare — carrello 2–5', () => {
  it('aggiunge, rileva e rimuove stili', async () => {
    const c = await load();
    expect(c.useCompare()).toEqual([]);
    c.addToCompare(IDS[0]);
    c.addToCompare(IDS[1]);
    expect(c.useCompare()).toEqual([IDS[0], IDS[1]]);
    expect(c.isCompared(IDS[0])).toBe(true);
    expect(c.isCompared('__non-esiste__')).toBe(false);
    c.removeFromCompare(IDS[0]);
    expect(c.useCompare()).toEqual([IDS[1]]);
    expect(() => c.removeFromCompare('__non-esiste__')).not.toThrow();
  });

  it('non supera i 5 stili e ignora duplicati e id sconosciuti', async () => {
    const c = await load();
    for (const id of IDS) c.addToCompare(id);
    c.addToCompare(IDS[0]);
    c.addToCompare('__non-esiste__');
    expect(c.useCompare()).toEqual(IDS.slice(0, 5));
    expect(c.isCompared(IDS[5])).toBe(false);
  });

  it('toggle alterna e clear svuota', async () => {
    const c = await load();
    c.toggleCompare(IDS[0]);
    expect(c.isCompared(IDS[0])).toBe(true);
    c.toggleCompare(IDS[0]);
    expect(c.isCompared(IDS[0])).toBe(false);
    c.addToCompare(IDS[1]);
    c.clearCompare();
    expect(c.useCompare()).toEqual([]);
  });
});

describe('compare — persistenza in localStorage', () => {
  it('usa la chiave stabile edubeer.compare.v1 (canarino)', async () => {
    // Canarino: il literal è scritto a mano di proposito. Se qualcuno rinomina la
    // chiave in `compare.ts`, il test fallisce invece di seguirla in silenzio.
    expect(STORAGE_KEY).toBe('edubeer.compare.v1');
    const c = await load();
    c.addToCompare(IDS[0]);
    expect(storage.getItem('edubeer.compare.v1')).toBe(JSON.stringify([IDS[0]]));
  });

  it('scrive il carrello e lo ricarica al reload', async () => {
    const c = await load();
    c.addToCompare(IDS[0]);
    c.addToCompare(IDS[1]);
    expect(JSON.parse(storage.getItem(STORAGE_KEY)!)).toEqual([IDS[0], IDS[1]]);

    vi.resetModules();
    const reloaded = await load();
    expect(reloaded.useCompare()).toEqual([IDS[0], IDS[1]]);

    reloaded.clearCompare();
    expect(JSON.parse(storage.getItem(STORAGE_KEY)!)).toEqual([]);
  });

  it('riparte da zero su storage corrotto, non-array o con voci non valide', async () => {
    storage.setItem(STORAGE_KEY, 'not json');
    let c = await load();
    expect(c.useCompare()).toEqual([]);

    vi.resetModules();
    storage.setItem(STORAGE_KEY, JSON.stringify({ a: 1 }));
    c = await load();
    expect(c.useCompare()).toEqual([]);

    vi.resetModules();
    storage.setItem(STORAGE_KEY, JSON.stringify([IDS[0], 42, null, '__non-esiste__', IDS[1]]));
    c = await load();
    expect(c.useCompare()).toEqual([IDS[0], IDS[1]]);

    vi.resetModules();
    storage.setItem(STORAGE_KEY, JSON.stringify(IDS.concat(IDS)));
    c = await load();
    expect(c.useCompare()).toEqual(IDS.slice(0, 5));
  });

  it('funziona anche senza localStorage (ambiente senza browser)', async () => {
    vi.unstubAllGlobals();
    const c = await load();
    expect(c.useCompare()).toEqual([]);
    expect(() => c.addToCompare(IDS[0])).not.toThrow();
    expect(c.useCompare()).toEqual([IDS[0]]);
  });
});

describe('compare — sortStyles', () => {
  it('ordina per nome e per metrica, stabile, con i mancanti in fondo', async () => {
    const c = await load();
    const [a, b] = [BJCP_STYLES[0], BJCP_STYLES[1]];

    expect(c.sortStyles([], 'name-asc')).toEqual([]);
    expect(c.sortStyles([b, a], 'sel')).toEqual([b, a]);

    const byName = c.sortStyles([b, a], 'name-asc').map((s) => s.name);
    expect(byName).toEqual([...byName].sort((x, y) => x.localeCompare(y, 'it')));

    const subset = BJCP_STYLES.slice(0, 20);
    const mid = (p: [number, number] | null) => (p ? (p[0] + p[1]) / 2 : null);
    const asc = c.sortStyles(subset, 'abv-asc').map((s) => mid(s.abv)).filter((v): v is number => v != null);
    expect(asc).toEqual([...asc].sort((x, y) => x - y));

    const nullAbv = BJCP_STYLES.find((s) => s.abv === null)!;
    const withAbv = BJCP_STYLES.find((s) => s.abv !== null)!;
    // Il sentinella `?? Infinity` manda i mancanti in fondo in salita e in cima in discesa.
    expect(c.sortStyles([nullAbv, withAbv], 'abv-asc').at(-1)).toBe(nullAbv);
    expect(c.sortStyles([withAbv, nullAbv], 'abv-asc').at(-1)).toBe(nullAbv);
    expect(c.sortStyles([withAbv, nullAbv], 'abv-desc').at(0)).toBe(nullAbv);
    expect(c.sortStyles([nullAbv, withAbv], 'abv-desc').at(0)).toBe(nullAbv);
  });
});
