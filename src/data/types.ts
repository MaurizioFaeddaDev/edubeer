// ⚠ FILE GENERATO — non modificare qui.
// Sincronizzato da birramon/src/data/ con: npm run sync-data

// ─────────────────────────────────────────────────────────────────────────────
// BIRRAMON — Tipi di dominio
// Il modello è volutamente "data-driven": nessuna tabella di efficacia hard-coded.
// La "type chart" EMERGE dai profili reali delle birre (assi sensoriali BJCP-style),
// così ogni moltiplicatore ha una giustificazione sensoriale vera.
// ─────────────────────────────────────────────────────────────────────────────

/** I nove assi del profilo sensoriale. Sono i "tipi" di Birramon. */
export type Axis =
  | 'malt'   // Maltosità — pane, biscotto, crosta
  | 'hop'    // Luppolo — agrumato, resinoso, erbaceo, tropicale
  | 'roast'  // Tostatura — caffè, cacao, bruciato
  | 'yeast'  // Lievito — banana, chiodi di garofano, fruttato, fenolico
  | 'sour'   // Acidità — lattico, acetico, funk brettanomyces
  | 'smoke'  // Affumicato — malti torbati/affumicati
  | 'sweet'  // Dolcezza — caramello, miele, frutta secca
  | 'bitter' // Amaro — IBU, finale amaro
  | 'body';  // Corpo — pienezza, viscosità, scorrevolezza

export const AXES: Axis[] = ['malt', 'hop', 'roast', 'yeast', 'sour', 'smoke', 'sweet', 'bitter', 'body'];

export const AXIS_IT: Record<Axis, string> = {
  malt: 'Maltosità',
  hop: 'Luppolo',
  roast: 'Tostatura',
  yeast: 'Lievito',
  sour: 'Acidità',
  smoke: 'Affumicato',
  sweet: 'Dolcezza',
  bitter: 'Amaro',
  body: 'Corpo',
};

export const AXIS_DESC: Record<Axis, string> = {
  malt: 'Pane, biscotto, crosta di pane. Il "grano" che senti sotto tutto il resto.',
  hop: 'Agrumato, resinoso, erbaceo, tropicale. Il contributo aromatico del luppolo.',
  roast: 'Caffè, cacao, tostato, bruciato. Viene dai malti scuri e dai malti torrefatti.',
  yeast: 'Banana, chiodi di garofano, fruttato, solvente. Il carattere del ceppo di lievito.',
  sour: 'Lattico, acetico, funk. Fermentazione spontanea o lieviti non-Saccharomyces.',
  smoke: 'Fenolico affumicato, torbato. Malti essiccati su fuoco di legna.',
  sweet: 'Caramello, miele, frutta secca, melassa. Zuccheri residui e malti speciali.',
  bitter: 'L\'amaro di bocca e di finale, misurato in IBU. Non confonderlo con l\'aroma.',
  body: 'Pienezza in bocca: da acquoso a sciropposo. Dipende da zuccheri residui e proteine.',
};

/** Profilo sensoriale: intensità 0–5 su ciascun asse. */
export type Profile = Record<Axis, number>;

/** I sei "stat" di una birra, in stile Pokémon ma con nomi che un birraio riconosce. */
export interface BeerStats {
  corpo: number;         // → HP (Palato): quanto regge la degustazione
  luppolo: number;       // → Attacco: forza dell'amaro/aroma di attacco
  maltosita: number;     // → Difesa: struttura che attutisce
  aroma: number;         // → Att. Spec.: complessità aromatica
  fermentazione: number; // → Dif. Spec.: equilibrio, pulizia
  bevibilita: number;    // → Velocità: quanto è "sessionabile", agisce prima
}

export type BeerStyleId =
  | 'pilsner' | 'helles' | 'witbier' | 'hefeweizen' | 'saison' | 'berliner'
  | 'lambic' | 'gueuze' | 'pale-ale' | 'ipa' | 'neipa' | 'bitter'
  | 'porter' | 'stout' | 'imperial-stout' | 'marzen' | 'bock' | 'doppelbock'
  | 'tripel' | 'quadrupel' | 'dubbel' | 'strong-golden' | 'rauchbier'
  | 'barleywine' | 'amber' | 'weizenbock' | 'dipa';

export interface BeerStyle {
  id: BeerStyleId;
  name: string;
  family: string;
  /** Colore SRM approssimato, per la palette dello sprite. */
  srm: number;
  /** Testo divulgativo: cosa definisce lo stile, in modo difendibile. */
  blurb: string;
}

/** Un descrittore: la "mossa". Bersaglia un asse del profilo avversario. */
export interface Descriptor {
  id: string;
  name: string;
  axis: Axis | null;         // null per le mosse di stato
  kind: 'attack' | 'status';
  power: number;
  accuracy: number;          // 0–100
  pp: number;
  /** Livello minimo del degustatore per apprenderla. */
  level: number;
  /** Frase ironica quando il descrittore NON è presente nella birra bersaglio. */
  miss: string;
  /** Frase quando è perfettamente centrato. */
  hit: string;
  /** Spiegazione divulgativa mostrata nel BeerDex / dopo il match. */
  why: string;
}

export interface BeerSpecies {
  id: string;
  name: string;
  style: BeerStyleId;
  /** Origine reale (città/regione). */
  origin: string;
  /** Paese moderno di riferimento: serve per filtrare e raggruppare. */
  country: string;
  /** Anno/periodo di riferimento, se documentato. */
  year?: string;
  abv: number;
  ibu: number;
  srm: number;
  profile: Profile;
  baseStats: BeerStats;
  /** Storia reale: è il cuore divulgativo del BeerDex. */
  history: string;
  /** Abbinamento gastronomico consigliato. */
  pairing: string;
  /** Curiosità / nota da esperto. */
  fact: string;
  /** Mosse apprese per livello; la prima è quella di partenza. */
  learnset: { level: number; descriptor: string }[];
  evolvesTo?: string;
  evolveLevel?: number;
  baseExp: number;
  catchRate: number; // 1–255, più alto = più facile
  dexNumber: number;
}

/** Bicchieri = le "ball". */
export interface Glass {
  id: string;
  name: string;
  bonus: number;
  blurb: string;
}

export interface BeerInstance {
  uid: string;
  speciesId: string;
  nickname?: string;
  level: number;
  exp: number;
  palato: number;    // HP attuale
  maxPalato: number;
  moves: { id: string; pp: number; maxPp: number }[];
  /** Asse "svelato" — nel BeerDex: quanto hai studiato questa specie. */
  dexSeen: boolean;
  dexCaught: boolean;
}

export interface Trainer {
  id: string;
  name: string;
  title: string;
  sprite: string;
  intro: string;
  defeat: string;
  win: string;
  reward: number;
  /** Riga dopo la sconfitta, quando lo rincontri. */
  postBattle?: string;
  team: { speciesId: string; level: number }[];
}

export type TileChar =
  | '.'   // erba calpestabile
  | '#'   // albero / bordo (solido)
  | 'T'   // campo d'orzo (incontri)
  | 'r'   // muro di casa (solido)
  | 'd'   // porta (warp)
  | 'p'   // sentiero
  | 'f'   // staccionata (solido)
  | 'w'   // acqua (solido)
  | 's'   // cartello (solido, interagibile)
  | '~';  // tappeto / interno

export interface Warp {
  x: number;
  y: number;
  to: string;
  spawn: { x: number; y: number };
  /** Direzione in cui il giocatore guarda appena entrato. */
  facing?: 'up' | 'down' | 'left' | 'right';
}

export interface NpcDef {
  id: string;
  x: number;
  y: number;
  name: string;
  sprite: 'villager' | 'brewer' | 'sommelier' | 'publican' | 'kid' | 'granny';
  facing: 'up' | 'down' | 'left' | 'right';
  /** Se presente, è un rivale da affrontare. */
  trainer?: string;
  /** Battute in sequenza. */
  lines: string[];
  /** Battute dopo averlo battuto. */
  linesAfter?: string[];
  /** Se true, dopo le battute offre una birra da combattere (incontro scriptato). */
  encounter?: string;
  /** Se true, cura il palato del giocatore. */
  heals?: boolean;
  /** Se true, dà una pozione/bicchiere. */
  gift?: { glass?: string; item?: string; text: string };
  /** Evento speciale gestito dalla UI (es. scelta dello starter). */
  event?: 'starter' | string;
}

export interface MapDef {
  id: string;
  name: string;
  /** Musica / atmosfera, per ora solo descrittiva. */
  tiles: string[];
  indoors: boolean;
  warps: Warp[];
  npcs: NpcDef[];
  /** Se definito, questa mappa non ha incontri. */
  encounterTable?: { speciesId: string; min: number; max: number; weight: number }[];
  encounterRate?: number;
  signs?: { x: number; y: number; text: string }[];
}
