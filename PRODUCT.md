# EduBeer

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pubblico principale: appassionati curiosi di birra. Il prodotto deve essere utile anche ai degustatori. Confermato dall'utente il 7 novembre 2026.

## Product Purpose

Web app in italiano per consultare informazioni sulle birre e sugli stili, esplorare le loro caratteristiche e confrontare gli intervalli tecnici dichiarati dalle fonti.

## Capabilities and Constraints

- Il repository contiene 116 stili BJCP 2021, 613 birre citate come esempi e 30 approfondimenti curati.
- Sezioni esistenti: Stili (homepage), Confronta, Birre e Approfondimenti.
- Ricerca globale, filtri con stato nell'URL, esportazione CSV e confronto persistente di 2–5 stili.
- I valori BJCP appartengono agli stili: non attribuirli alle singole birre. Gli approfondimenti contengono invece dati per birra.
- Testi ufficiali BJCP in inglese, sintesi italiane e contenuti curati distinti.
- Stack esistente: React, TypeScript e Vite; grafici SVG; sito statico senza backend.

## Brand Commitments

- Nome esistente: EduBeer.
- L'utente richiede un refactor completo, un risultato professionale e un'identità riconoscibile, evitando l'aspetto generico di molti siti generati con AI.
- Il brutalismo attuale può essere sostituito; l'utente ha richiesto un consiglio sulla direzione adatta al prodotto.
- Direzione visiva scelta dall'utente il 7 novembre 2026: proposta A (atlante da esplorare) per identità e consultazione, con il confronto della proposta B (atlante da degustazione).
- Le immagini sono riferimenti di direzione; testi, dati e geometrie dei grafici devono derivare dal corpus e dalle funzioni esistenti.

## Evidence on Hand

- `README.md`: documentazione di funzioni, fonti e limiti dei dati.
- `src/data/bjcp.ts` e `src/data/bjcp-beers.ts`: dataset BJCP.
- `src/data/beers.ts` e `src/data/styles.ts`: corpus degli approfondimenti.
- `src/lib/`: ricerca, filtri, confronto, colori e CSV con test esistenti.
- `src/tokens.css`: token attuali generati da un sistema esterno condiviso.

## Product Principles

- Rendere la consultazione comprensibile agli appassionati curiosi e utile ai degustatori.
- Mantenere riconoscibili la fonte e il livello a cui ogni dato si riferisce.
- Conservare precisione, contenuti e funzioni durante la riprogettazione.
- Far derivare l'identità dalla birra e dalla sua consultazione.
