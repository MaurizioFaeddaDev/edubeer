// ⚠ FILE GENERATO — non modificare qui.
// Sincronizzato da birramon/src/data/ con: npm run sync-data

import type { BeerStyle, BeerStyleId } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Stili birrari. Ogni "blurb" è scritto per essere difendibile davanti a un
// birraio: niente semplificazioni che farebbero ridere un giudice BJCP.
// ─────────────────────────────────────────────────────────────────────────────

export const STYLES: Record<BeerStyleId, BeerStyle> = {
  pilsner: {
    id: 'pilsner', name: 'Pilsner', family: 'Lager', srm: 4,
    blurb: 'Lager chiara, dorata, nata a Plzeň nel 1842. Maltosità delicata di pane, amaro di luppolo netto e finale secco. Il lievito lavora a bassa temperatura: pulizia assoluta, zero esteri.',
  },
  helles: {
    id: 'helles', name: 'Helles', family: 'Lager', srm: 5,
    blurb: 'La risposta bavarese alla Pilsner: stessa chiarezza, ma il maltosità vince sull\'amaro. Pane, miele leggero, finale morbido. Monaco, 1894.',
  },
  marzen: {
    id: 'marzen', name: 'Märzen', family: 'Lager', srm: 12,
    blurb: 'Lager ambrata e maltata, brassata in marzo e lasciata maturare in cantina fino a ottobre. Pane tostato, crosta, caramello tenue. È la birra dell\'Oktoberfest.',
  },
  bock: {
    id: 'bock', name: 'Bock', family: 'Lager', srm: 14,
    blurb: 'Lager forte e maltata di origine tedesca. Pane, frutta secca, corpo sostenuto ma finale asciutto. "Bock" significa caprone: a Einbeck ci si arriva.',
  },
  doppelbock: {
    id: 'doppelbock', name: 'Doppelbock', family: 'Lager', srm: 22,
    blurb: 'Il "doppio bock" dei monaci: nutritiva, dolce, con note di prugna e mollica di pane. I nomi finiscono in -ator (Salvator, Celebrator). Si beve come un pasto.',
  },
  weizenbock: {
    id: 'weizenbock', name: 'Weizenbock', family: 'Ale', srm: 18,
    blurb: 'L\'incrocio fra Weissbier e Bock: banana e chiodi di garofano del lievito più il pane tostato e il corpo del bock. Rara e sottovalutata.',
  },
  hefeweizen: {
    id: 'hefeweizen', name: 'Hefeweizen', family: 'Ale', srm: 5,
    blurb: 'Weissbier bavarese non filtrata. Il lievito è il protagonista: 4-vinilguaiacolo (chiodi di garofano) e isoamil acetato (banana). Torbida per definizione, non per difetto.',
  },
  witbier: {
    id: 'witbier', name: 'Witbier', family: 'Ale', srm: 4,
    blurb: 'Bianca belga di grano non maltato, coriandolo e scorza d\'arancia amara. Torbida, rinfrescante, acidula. Hoegaarden l\'ha resuscitata nel 1966 dopo decenni di oblio.',
  },
  saison: {
    id: 'saison', name: 'Saison', family: 'Ale', srm: 7,
    blurb: 'La birra dei contadini dell\'Hainaut, brassata in inverno per i lavoratori estivi. Lievito ad alta attenuazione: secca, pepata, fruttata, spesso brettata. Il cavallo di battaglia di Brasserie Dupont.',
  },
  berliner: {
    id: 'berliner', name: 'Berliner Weisse', family: 'Ale', srm: 3,
    blurb: 'Grano e lievito lattico: acidità fresca, bassa gradazione, altissima bevibilità. I berlinesi la bevono con sciroppo di lampone (rot) o aspersio (grün). Napoleone la chiamò "lo champagne del nord".',
  },
  lambic: {
    id: 'lambic', name: 'Lambic', family: 'Fermentazione spontanea', srm: 8,
    blurb: 'Solo nella valle della Senna, intorno a Bruxelles. Nessun lievito aggiunto: il mosto raffredda in notte in bacili aperti (coolship) e fermenta con Brettanomyces e batteri lattici. Acidità, funk, complessità selvatica.',
  },
  gueuze: {
    id: 'gueuze', name: 'Gueuze', family: 'Fermentazione spontanea', srm: 9,
    blurb: 'Taglio di lambic di 1, 2 e 3 anni, rifermentato in bottiglia. La "champagne di Bruxelles": secca, acidissima, funk, con una carbonazione finissima e persistente.',
  },
  'pale-ale': {
    id: 'pale-ale', name: 'Pale Ale', family: 'Ale', srm: 7,
    blurb: 'Base dorata, luppolo in evidenza ma non aggressivo. In Inghilterra è la Bitter; negli USA è il punto di partenza della rivoluzione craft di Sierra Nevada (1980).',
  },
  bitter: {
    id: 'bitter', name: 'Bitter', family: 'Ale', srm: 10,
    blurb: 'Il nome è un falso amico: la Bitter inglese è poco amara e molto beverina, servita a 11-13 °C dalla cask. Amaro erbaceo di luppoli inglesi (Goldings, Fuggles), finale secco.',
  },
  amber: {
    id: 'amber', name: 'Amber Ale', family: 'Ale', srm: 13,
    blurb: 'Zona di mezzo fra maltosità e luppolo: caramello, biscotto tostato, amaro contenuto. Negli USA è il ponte fra la lager industriale e l\'IPA.',
  },
  ipa: {
    id: 'ipa', name: 'IPA', family: 'Ale', srm: 9,
    blurb: 'Nata per resistere al viaggio: nel Settecento i birrai di Burton upon Trent aumentavano luppolo e gradazione per esportare in India. Oggi è un\'idea più che uno stile: luppolo dominante, amaro deciso, finale asciutto.',
  },
  'neipa': {
    id: 'neipa', name: 'New England IPA', family: 'Ale', srm: 5,
    blurb: 'Torbida, opalescente, succosa. Luppolatura esplosiva in late/dry hopping e acqua cloruro-dominante per arrotondare l\'amaro. Nata nel Vermont, ha riscritto le regole dell\'aspetto.',
  },
  dipa: {
    id: 'dipa', name: 'Double IPA', family: 'Ale', srm: 10,
    blurb: 'L\'IPA portata all\'estremo: 7,5-10% ABV, luppolatura massiccia, corpo strutturato per reggere l\'alcol. Il nome è un ossimoro: una Double IPA ben fatta NON deve essere stucchevole, deve essere pericolosamente beverina.',
  },
  porter: {
    id: 'porter', name: 'Porter', family: 'Ale', srm: 25,
    blurb: 'Londra, primi del Settecento: la birra dei "porters", gli scaricatori dei mercati. Malti tostati, cacao, caffè, corpo medio. È la madre della Stout — "stout porter" significa semplicemente "porter robusta".',
  },
  stout: {
    id: 'stout', name: 'Stout', family: 'Ale', srm: 35,
    blurb: 'Evoluzione della Porter: più alcol, più tostatura, più corpo. Il malto torrefatto (roasted barley) dà caffè e cacao. La versione irlandese (Guinness, 1759) è sorprendentemente leggera di corpo e acida di finale.',
  },
  'imperial-stout': {
    id: 'imperial-stout', name: 'Imperial Stout', family: 'Ale', srm: 40,
    blurb: 'La "Russian Imperial Stout" brassata a Londra per la corte degli Zar: alta gradazione e luppolatura intensa per sopravvivere al gelo. Caffè, cioccolato fondente, prugna, alcol avvolgente.',
  },
  'strong-golden': {
    id: 'strong-golden', name: 'Belgian Strong Golden', family: 'Ale', srm: 5,
    blurb: 'Chiara, dorata, insidiosa. Zucchero candito per alleggerire il corpo e alzare l\'ABV; lievito belga che spinge su pera e pepe. Duvel è il riferimento dal 1871.',
  },
  dubbel: {
    id: 'dubbel', name: 'Dubbel', family: 'Trappista', srm: 18,
    blurb: 'Ambrata bruna, maltata, con zucchero candito scuro. Uvetta, prugna, caramello. Le birre trappiste prendono il nome dal numero di "cruches" segnate sulla botte: dubbel, tripel, quadrupel.',
  },
  tripel: {
    id: 'tripel', name: 'Tripel', family: 'Trappista', srm: 6,
    blurb: 'Paradosso: chiara come una pils, forte come un vino. Westmalle la codifica nel 1934. Lievito fenolico (pepe, banana), finale amaro e alcolico, altissima attenuazione. Va servita nel calice, non nella pinta.',
  },
  quadrupel: {
    id: 'quadrupel', name: 'Quadrupel', family: 'Trappista', srm: 30,
    blurb: 'Il vertice della scala trappista: 10-12% ABV, densa, dolce, con dattero, melassa e frutta sotto spirito. Si beve a piccoli sorsi e a temperatura di cantina.',
  },
  rauchbier: {
    id: 'rauchbier', name: 'Rauchbier', family: 'Lager', srm: 20,
    blurb: 'Bamberga, Franconia. Il malto è essiccato su fuoco di faggio: la birra sa di speck, affumicato, legno. Un tempo TUTTE le birre sapevano così — la Rauchbier è un fossile vivente della Rivoluzione Industriale.',
  },
  barleywine: {
    id: 'barleywine', name: 'Barleywine', family: 'Ale', srm: 20,
    blurb: 'Il "vino d\'orzo" inglese: 8-12% ABV, maltosità ricchissima, frutta secca, sherry. Nella versione americana il luppolo contrattacca. Invecchia in bottiglia per anni.',
  },
};

export const styleOf = (id: BeerStyleId): BeerStyle => STYLES[id];
