# Ticket T-002 — Export CSV delle selezioni filtrate

- **id**: T-002
- **tipo**: feat
- **stato**: done
- **priorità**: P1 (questo sprint, dopo T-003)
- **complessità**: M
- **dipendenze**: T-003 (i filtri toccano `lib/catalog.ts`: servono test prima di modificarli)

## User story

Come utente del catalogo filtro/filtrato, voglio esportare in CSV le birre/stili
che sto vedendo, per riutilizzarli in fogli di calcolo e liste di degustazione.

## Acceptance criteria (definitivi, PO 2026-10-20)

- [x] L'esportazione prende **le birre/stili visibili col filtro corrente** — non tutta la lista
- [x] Il CSV si scarica dal browser lato client (nessun backend)
- [x] Le colonne del CSV corrispondono ai campi mostrati nella griglia (codice BJCP,
      nome, categoria, famiglia, ABV…), una riga per birra/stile
- [x] Il CSV usa encoding e separatore apribili in un foglio di calcolo comune
- [x] Il contratto URL `#/birre?q=stout&stile=15B&abv=4-5` resta invariato: export su
      stato filtrato non rompe i parametri dell'hash
- [x] `npm run build` passa in verde; i test di T-003 restano verdi (i filtri non cambiano semantica)

### Scope deciso dal PO

- **In scope**: bottone «Esporta CSV» su **Birre** e su **Stili**, sulle righe filtrate.
- **Colonne birre (11)**: Birra, Codice BJCP, Stile, Categoria, Famiglia, ABV min/max stile,
  IBU min/max stile, SRM min/max stile — gli stessi numeri *dello stile* che la card dichiara.
- **Colonne stili (12)**: Codice BJCP, Stile, Categoria, Famiglia, ABV min/max, IBU min/max,
  SRM min/max, Birre citate, Descrizione (blurb italiano).
- **Fuori scope**: Approfondimenti (sono schede, non righe di griglia), backend/account,
  formati diversi da CSV, scelta del separatore nell'interfaccia.

## Note

- Fonte dati: il catalogo filtrato esce da `lib/catalog.ts` (quindi T-003 prima,
  così i test proteggono la modifica).
- Nessuna dipendenza runtime aggiuntiva: il CSV si genera a mano (blob + download).

## Registro

- 2025-12 — aperto da PO (da README "Non fatto"); PM materializza il ticket.
- 2026-10-20 — catena `/feature` (po → tech-lead-fe → worker → reviewer → tester).
  Implementazione: `src/lib/csv.ts` (puro: `csvField`, `toCsv`, `numIt`, `beersCsv`,
  `stylesCsv`, BOM + `;` + CRLF, numeri it-IT), `src/ui/ExportCsvButton.tsx`
  (blob + download, non tocca l'hash), riga `.results-bar` in Birre, `.guide-tools` in Stili.
  **Tester: VERDE 6/6** — `npm test` 103→**104 test**, `npm run build` verde; prova reale in
  Chromium (preview di `dist`, download completato via CDP): 79 card ↔ 79 righe, 6 ↔ 6, 4 ↔ 4,
  hash identico prima/dopo il click. Zero dipendenze aggiunte (`package.json` intatto).
- 2026-10-20 — **QA visuale: ROSSO** su un criterio, tap target del bottone su mobile
  ~27px < 44px (DESIGN.md §5). Fix del worker: variante `.mini-tap` (min-height 44px sotto
  560px), senza toccare la famiglia `.mini` globale. Ricontrollato su screenshot 390×844.
  Minori della famiglia `.mini` (contrasto bordo 1.48:1, padding 3px fuori scala, due
  tipografie di conteggio) → **T-005**, non di questo ticket.
- 2026-10-20 — corretta l'esempio d'URL del ticket: `abv=8-14` su 15B Irish Stout (3,8–5%)
  rende 0 risultati, quindi non dimostrava la feature → `abv=4-5`.
- 2026-10-20 — **done**. Non fatto, dichiarato: supporto verificato solo su Chromium
  (Firefox non installato su questa macchina: mitigato appendendo l'anchor al DOM e
  revocando l'URL in modo differito). Mitigazioni di profondità non necessarie coi dati
  attuali (dati non editabili): CSV/formula injection, notazione esponenziale in `numIt`.
