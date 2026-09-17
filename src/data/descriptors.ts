// ⚠ FILE GENERATO — non modificare qui.
// Sincronizzato da birramon/src/data/ con: npm run sync-data

import type { Descriptor } from './types';

const d = (x: Descriptor): Descriptor => x;

// ─────────────────────────────────────────────────────────────────────────────
// I "descrittori" sono le mosse. Ognuno bersaglia un asse del profilo della
// birra avversaria. Chi ha studiato sa che la difficoltà NON è inventare
// aggettivi: è non dire "caffè" davanti a una Weissbier.
//
// Precisione bassa = nota difficile da rilevare anche per un palato allenato.
// Potenza alta = il descrittore, se centrato, chiude il discorso.
// ─────────────────────────────────────────────────────────────────────────────

export const DESCRIPTORS: Descriptor[] = [
  // ── MALTOSITÀ ──────────────────────────────────────────────────────────────
  d({ id: 'note-pane', name: 'Pane e crosta', axis: 'malt', kind: 'attack', power: 45, accuracy: 100, pp: 25, level: 1,
    miss: '«Il pane…» Il bicchiere non profuma di forno. Silenzio.',
    hit: 'Crosta di pane appena sfornato. È lì, e tutti l\'hanno sentita.',
    why: 'La maltosità di base è il "pane" che viene dal malto base (Pilsner o Pale) e dalla reazione di Maillard in bollitura.' }),
  d({ id: 'note-biscotto', name: 'Biscotto e cracker', axis: 'malt', kind: 'attack', power: 60, accuracy: 95, pp: 20, level: 5,
    miss: '«Biscotto»… il vicino di bancone scuote la testa.',
    hit: 'Biscotto secco, crosta dorata. Descrizione da manuale.',
    why: 'Le note di biscotto/cracker arrivano dai malti chiari più tostati (Munich, Vienna, Biscuit) e dai malti cara-pils.' }),
  d({ id: 'note-mollica', name: 'Mollica e frutta secca', axis: 'malt', kind: 'attack', power: 80, accuracy: 90, pp: 12, level: 14,
    miss: '«Mollica?» Ma qui non c\'è struttura maltata. Hai sparato.',
    hit: 'Mollica calda, mandorla. La struttura maltata è evidente.',
    why: 'Una maltosità ricca e dolce-amidata è tipica di Bock, Doppelbock e delle lager forti tedesche.' }),

  // ── LUPPOLO ────────────────────────────────────────────────────────────────
  d({ id: 'note-agrumate', name: 'Agrumato', axis: 'hop', kind: 'attack', power: 45, accuracy: 95, pp: 25, level: 1,
    miss: '«Agrumi»… ma quale luppolo? Questo bicchiere è muto.',
    hit: 'Scorza di limone e pompelmo, netti. Luppolo in primo piano.',
    why: 'Gli oli di luppolo (mircene, limonene) danno agrumato; è il descrittore più frequente nelle IPA americane.' }),
  d({ id: 'note-erbacee', name: 'Erbaceo e speziato', axis: 'hop', kind: 'attack', power: 60, accuracy: 95, pp: 20, level: 9,
    miss: '«Erbaceo»… qui il luppolo tace. Era un\'affermazione temeraria.',
    hit: 'Foglia di tè, erba tagliata, pepe bianco. Luppoli nobili europei.',
    why: 'L\'erbaceo-speziato è tipico dei luppoli continentali (Saaz, Hallertau, Tettnang) e dei luppoli inglesi Goldings.' }),
  d({ id: 'note-resinose', name: 'Resinoso', axis: 'hop', kind: 'attack', power: 65, accuracy: 90, pp: 18, level: 7,
    miss: '«Resina»? Niente. Hai confuso l\'idea di luppolo con il luppolo.',
    hit: 'Resina di pino, aghi, terra bagnata. Luppoli americani in pieno.',
    why: 'Il resinoso-pinoso viene dai luppoli "C" americani (Cascade, Chinook, Columbus) e dai terpeni come il pinene.' }),
  d({ id: 'note-tropicali', name: 'Tropicale', axis: 'hop', kind: 'attack', power: 85, accuracy: 85, pp: 10, level: 15,
    miss: '«Mango e frutto della passione»… non c\'è niente di tutto questo.',
    hit: 'Mango, passion fruit, ananas. Bomba di tioli varietali.',
    why: 'Le note tropicali intense dipendono dai tioli (3MH, 3MHA) e dai luppoli moderni (Citra, Mosaic, Galaxy).' }),

  // ── TOSTATURA ──────────────────────────────────────────────────────────────
  d({ id: 'note-caffe', name: 'Caffè', axis: 'roast', kind: 'attack', power: 50, accuracy: 95, pp: 20, level: 1,
    miss: '«Caffè»… in un bicchiere chiaro. Il pub ti guarda.',
    hit: 'Caffè espresso, tostato. Il malto torrefatto è inconfondibile.',
    why: 'Il caffè viene dal roasted barley e dal black malt: malti portati a 200-220 °C, senza enzimi residui.' }),
  d({ id: 'note-cioccolato', name: 'Cioccolato', axis: 'roast', kind: 'attack', power: 75, accuracy: 90, pp: 12, level: 10,
    miss: '«Cioccolato»? Qui c\'è solo malto chiaro. Figurati.',
    hit: 'Cioccolato fondente, cacao amaro. Tostatura nobile.',
    why: 'Il cioccolato arriva dal chocolate malt. Attenzione: cioccolato ≠ bruciato. Il bruciato è un difetto, il cacao no.' }),
  d({ id: 'note-bruciato', name: 'Bruciato', axis: 'roast', kind: 'attack', power: 95, accuracy: 70, pp: 8, level: 20,
    miss: '«Bruciato!» Nessuna tostatura. Hai accusato una birra innocente.',
    hit: 'Bruciato, cenere, gomma. E stavolta è davvero tostatura spinta.',
    why: 'Il "bruciato" vero è un confine sottile: oltre il roastiness diventa cenere e gomma bruciata, che è un off-flavor.' }),

  // ── LIEVITO ────────────────────────────────────────────────────────────────
  d({ id: 'note-banana', name: 'Banana', axis: 'yeast', kind: 'attack', power: 50, accuracy: 85, pp: 20, level: 1,
    miss: '«Banana»… in una lager pulita. È il classico errore del principiante.',
    hit: 'Banana matura. Isoamil acetato a palla. È una Weissbier.',
    why: 'L\'isoamil acetato è l\'estere che dà banana: il lievito di Weissbier lo produce in quantità, le lager quasi mai.' }),
  d({ id: 'note-garofano', name: 'Chiodi di garofano', axis: 'yeast', kind: 'attack', power: 60, accuracy: 85, pp: 18, level: 8,
    miss: '«Chiodi di garofano»? Nessun fenolo. Hai sovrainterpretato.',
    hit: 'Chiodi di garofano, spezia, quasi dentifricio. Fenoli chiari.',
    why: 'Il 4-vinilguaiacolo (4-VG) dà chiodi di garofano. Nelle Weissbier è voluto; in una lager è un difetto grave.' }),
  d({ id: 'note-fruttato', name: 'Fruttato (pera, mela)', axis: 'yeast', kind: 'attack', power: 70, accuracy: 90, pp: 15, level: 12,
    miss: '«Pera e mela verde»… l\'aroma è fermo. Non ci siamo.',
    hit: 'Pera williams, mela verde, un che di tropicale. Esteri da lievito belga.',
    why: 'Gli esteri etil-esanoato ed etil-acetato danno mela e pera: firma dei lieviti belgi e inglesi fermentati caldi.' }),
  d({ id: 'note-solvente', name: 'Solvente e acetone', axis: 'yeast', kind: 'attack', power: 90, accuracy: 75, pp: 8, level: 22,
    miss: '«Solvente»? Niente alcol superiore. Accusa infondata.',
    hit: 'Alcol superiore, acetone, sballo. Non è classe: è un difetto.',
    why: 'Gli alcol superiori (amili, isoamilico) in eccesso danno solvente: quasi sempre colpa di fermentazioni troppo calde.' }),

  // ── ACIDITÀ ────────────────────────────────────────────────────────────────
  d({ id: 'note-lattica', name: 'Lattico e yogurt', axis: 'sour', kind: 'attack', power: 50, accuracy: 90, pp: 20, level: 1,
    miss: '«Yogurt»… l\'acidità non c\'è. Hai sentito quello che volevi sentire.',
    hit: 'Lattico, fresco, yogurt bianco. Acidità pulita.',
    why: 'L\'acidità lattica viene da Lactobacillus o da lievito lattico (Berliner Weisse) ed è tonda e "lattiginosa".' }),
  d({ id: 'note-acetica', name: 'Acetico', axis: 'sour', kind: 'attack', power: 75, accuracy: 80, pp: 12, level: 13,
    miss: '«Aceto»? Nessun acetico. Osservazione sbagliata.',
    hit: 'Aceto di vino, volatile, pungente. C\'è dell\'acido acetico.',
    why: 'L\'acetico è prodotto da Acetobacter in presenza di ossigeno. Nei lambic vecchi è voluto, altrove è un difetto.' }),
  d({ id: 'note-funk', name: 'Funk brett', axis: 'sour', kind: 'attack', power: 90, accuracy: 70, pp: 10, level: 18,
    miss: '«Cavallo e stalla»? Qui non c\'è Brettanomyces. Solo la tua fantasia.',
    hit: 'Cavallo, cuoio, stalla, pipì di gatto. Brett in forma smagliante.',
    why: 'Brettanomyces produce 4-etilfenolo (stalla) e 4-etilguaiacolo (speziato). Nei lambic è un pregio, non un difetto.' }),

  // ── AFFUMICATO ─────────────────────────────────────────────────────────────
  d({ id: 'note-affumicata', name: 'Affumicato', axis: 'smoke', kind: 'attack', power: 60, accuracy: 90, pp: 20, level: 1,
    miss: '«Affumicato»? Nessun fenolo di faggio. Su questo non ci siamo.',
    hit: 'Legno di faggio, camino, bacon. Il malto è stato essiccato sul fuoco.',
    why: 'L\'affumicato è guaiacolo e 4-metilguaiacolo dai malti essiccati su faggio: la firma di Bamberga.' }),
  d({ id: 'note-torbata', name: 'Torbato e iodato', axis: 'smoke', kind: 'attack', power: 85, accuracy: 80, pp: 10, level: 16,
    miss: '«Torbato»? Qui c\'è solo affumicato pulito, non torba. Distinzione da esperti.',
    hit: 'Torba, iodio, medicinale, cerotto. È whisky in forma di birra.',
    why: 'La torba dà fenoli più pesanti (cresolo, iodio) rispetto al faggio: per questo lo Scotch Ale sa di medicazione.' }),

  // ── DOLCEZZA ───────────────────────────────────────────────────────────────
  d({ id: 'note-caramello', name: 'Caramello', axis: 'sweet', kind: 'attack', power: 45, accuracy: 100, pp: 25, level: 1,
    miss: '«Caramello»… nessuno zucchero residuo. Bocciato.',
    hit: 'Caramello, toffee. C\'è dolcezza, ed è dichiarata.',
    why: 'Il caramello viene dai malti cristallo (Crystal/Caramel): zuccheri non fermentabili che restano nel bicchiere.' }),
  d({ id: 'note-miele', name: 'Miele', axis: 'sweet', kind: 'attack', power: 55, accuracy: 95, pp: 20, level: 6,
    miss: '«Miele»? Nessuna dolcezza floreale. Hai sognato.',
    hit: 'Miele d\'acacia, zucchero candito. Dolcezza elegante.',
    why: 'Il miele e lo zucchero candito alzano l\'ABV alleggerendo il corpo: il trucco dei trappisti per la Tripel.' }),
  d({ id: 'note-frutta-secca', name: 'Uvetta e prugna', axis: 'sweet', kind: 'attack', power: 70, accuracy: 90, pp: 14, level: 11,
    miss: '«Uvetta»? Nessuna nota ossidata o di frutta sotto spirito.',
    hit: 'Uvetta, prugna, dattero, sherry. Complessità da cantina.',
    why: 'Uvetta e prugna arrivano dai malti speciali belgi (Special B) e dall\'ossidazione controllata delle birre forti.' }),
  d({ id: 'note-melassa', name: 'Melassa e sciroppo', axis: 'sweet', kind: 'attack', power: 85, accuracy: 85, pp: 10, level: 19,
    miss: '«Melassa»? Questa birra è asciutta come un cracker.',
    hit: 'Melassa, zucchero nero, liquirizia. Densità imbarazzante.',
    why: 'La melassa è il fondo aromatico dei Quadrupel e delle Imperial Stout: dipende dalla bassa attenuazione.' }),

  // ── AMARO ──────────────────────────────────────────────────────────────────
  d({ id: 'finale-amaro', name: 'Finale amaro', axis: 'bitter', kind: 'attack', power: 45, accuracy: 100, pp: 25, level: 1,
    miss: '«Amaro»? Ma se scende come acqua. Non c\'è finale amaro.',
    hit: 'Finale amaro, persistente, pulito. Il luppolo si fa sentire.',
    why: 'L\'amaro di bocca si misura in IBU e dipende dall\'isomerizzazione degli alfa-acidi in bollitura.' }),
  d({ id: 'amaro-secco', name: 'Amaro secco', axis: 'bitter', kind: 'attack', power: 65, accuracy: 90, pp: 18, level: 7,
    miss: '«Secco e amaro»? Qui il finale è dolce. Errore di fondo.',
    hit: 'Amaro secco, dissetante, finale che pulisce. Da manuale.',
    why: 'Amaro + secchezza (bassa densità finale) è la firma delle pilsner boeme e delle saison ben attenuate.' }),
  d({ id: 'amaro-resinoso', name: 'Amaro resinoso', axis: 'bitter', kind: 'attack', power: 80, accuracy: 85, pp: 12, level: 14,
    miss: '«Amaro resinoso»? Nessuna luppolatura tardiva aggressiva.',
    hit: 'Amaro resinoso, aggressivo, quasi da masticare. Luppolo ovunque.',
    why: 'L\'amaro resinoso deriva dagli alfa-acidi di luppoli ad alto contenuto (Columbus, Chinook) e dall\'asciutto finale.' }),
  d({ id: 'amaro-pungente', name: 'Amaro pungente', axis: 'bitter', kind: 'attack', power: 95, accuracy: 75, pp: 8, level: 21,
    miss: '«Pungente!» Nessuna asprezza. Hai scambiato l\'astringenza per amaro.',
    hit: 'Amaro che pizzica, astringente, quasi metallico. Al limite.',
    why: 'L\'amaro "pungente" è spesso astringenza da tannini o da pH alto: può essere uno stile estremo o un difetto.' }),

  // ── CORPO ──────────────────────────────────────────────────────────────────
  d({ id: 'corpo-leggero', name: 'Corpo leggero', axis: 'body', kind: 'attack', power: 40, accuracy: 100, pp: 25, level: 1,
    miss: '«Leggero»? Ma se è denso come uno sciroppo. Descrizione invertita.',
    hit: 'Corpo leggero, scorrevole, quasi acquoso. Sessionabilissima.',
    why: 'Corpo leggero = alta attenuazione e pochi destrine: la birra si beva a litri senza stancare.' }),
  d({ id: 'corpo-medio', name: 'Corpo medio', axis: 'body', kind: 'attack', power: 55, accuracy: 95, pp: 20, level: 5,
    miss: '«Corpo medio»? Qui o è acqua o è sciroppo. Non è questa la misura.',
    hit: 'Corpo medio, pieno al punto giusto. Bilancia tutto.',
    why: 'Il corpo medio è il compromesso: destrine, beta-glucani e proteine in equilibrio con l\'attenuazione.' }),
  d({ id: 'corpo-pieno', name: 'Corpo pieno', axis: 'body', kind: 'attack', power: 70, accuracy: 90, pp: 15, level: 12,
    miss: '«Pieno»? Questo bicchiere è trasparente e leggero.',
    hit: 'Corpo pieno, vellutato, avvolgente. Struttura importante.',
    why: 'Corpo pieno viene da malti speciali, fiocchi d\'avena o bassa attenuazione: da Guinness (nitro) a Imperial Stout.' }),
  d({ id: 'corpo-sciropposo', name: 'Corpo sciropposo', axis: 'body', kind: 'attack', power: 90, accuracy: 80, pp: 10, level: 20,
    miss: '«Sciropposo»? Macché, qui scorre via. Hai esagerato.',
    hit: 'Sciropposo, viscoso, quasi oleoso. Densità da dessert.',
    why: 'La viscosità estrema è di Barleywine, Quadrupel e Imperial Stout: zuccheri residui alti e alcol che addensa.' }),

  // ── MOSSE DI STATO ─────────────────────────────────────────────────────────
  d({ id: 'annusa', name: 'Annusa il bicchiere', axis: null, kind: 'status', power: 0, accuracy: 100, pp: 20, level: 1,
    miss: '', hit: 'Avvicini il naso. Un asse del profilo si rivela.',
    why: 'Tecnica base: due annusate brevi, mai una lunga. Il naso si satura e smette di distinguere.' }),
  d({ id: 'osserva-colore', name: 'Osserva il colore', axis: null, kind: 'status', power: 0, accuracy: 100, pp: 12, level: 1,
    miss: '', hit: 'Contro la luce: l\'asse dominante di questa birra è chiaro.',
    why: 'Il colore (SRM) predice la tostatura: sotto 6 SRM niente caffè, sopra 30 il roast domina. Guardare prima di annusare.' }),
  d({ id: 'pulisci-palato', name: 'Pulisci il palato', axis: null, kind: 'status', power: 0, accuracy: 100, pp: 12, level: 1,
    miss: '', hit: 'Un sorso d\'acqua e un grissino. Il palato torna a respirare.',
    why: 'Acqua naturale e pane neutro azzerano la memoria gustativa. Il caffè e il luppolo "sporcano" il palato a lungo.' }),
  d({ id: 'sorso-acqua', name: 'Sorso d\'acqua', axis: null, kind: 'status', power: 0, accuracy: 100, pp: 6, level: 1,
    miss: '', hit: 'Mezzo litro d\'acqua. Recupero serio del palato.',
    why: 'L\'acqua è lo strumento numero uno del degustatore. Chi non beve acqua finisce la degustazione senza naso.' }),
  d({ id: 'annota', name: 'Prendi appunti', axis: null, kind: 'status', power: 0, accuracy: 100, pp: 12, level: 1,
    miss: '', hit: 'Scrivi sul taccuino. La prossima descrizione sarà chirurgica.',
    why: 'Scrivere obbliga a scegliere le parole: è la differenza fra "buona" e "finale amaro secco con note di crosta".' }),
  d({ id: 'cambia-argomento', name: 'Cambia argomento', axis: null, kind: 'status', power: 0, accuracy: 95, pp: 10, level: 1,
    miss: '', hit: '«Ma tu l\'hai assaggiata la nuova DIPA di…?» L\'avversario perde il filo.',
    why: 'Tecnica da veri bastardi da degustazione: distrarre l\'avversario mentre annusa è scorretto ma efficace.' }),
];

export const DESCRIPTOR_BY_ID: Record<string, Descriptor> = Object.fromEntries(
  DESCRIPTORS.map((x) => [x.id, x]),
);

export const getDescriptor = (id: string): Descriptor => {
  const found = DESCRIPTOR_BY_ID[id];
  if (!found) throw new Error(`Descrittore sconosciuto: ${id}`);
  return found;
};
