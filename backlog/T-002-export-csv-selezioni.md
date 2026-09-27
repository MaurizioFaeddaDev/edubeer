# Ticket T-002 — Export CSV delle selezioni filtrate

- **id**: T-002
- **tipo**: feat
- **stato**: open
- **priorità**: P1 (questo sprint, dopo T-003)
- **complessità**: M
- **dipendenze**: T-003 (i filtri toccano `lib/catalog.ts`: servono test prima di modificarli)

## User story

Come utente del catalogo filtro/filtrato, voglio esportare in CSV le birre/stili
che sto vedendo, per riutilizzarli in fogli di calcolo e liste di degustazione.

## Acceptance criteria

- [ ] L'esportazione prende **le birre/stili visibili col filtro corrente** — non tutta la lista
- [ ] Il CSV si scarica dal browser lato client (nessun backend)
- [ ] Le colonne del CSV corrispondono ai campi mostrati nella griglia (codice BJCP,
      nome, categoria, famiglia, ABV…), una riga per birra/stile
- [ ] Il CSV usa encoding e separatore apribili in un foglio di calcolo comune
- [ ] Il contratto URL `#/birre?q=stout&stile=15B&abv=8-14` resta invariato: export su
      stato filtrato non rompe i parametri dell'hash
- [ ] `npm run build` passa in verde; i test di T-003 restano verdi (i filtri non cambiano semantica)

## Note

- Fonte dati: il catalogo filtrato esce da `lib/catalog.ts` (quindi T-003 prima,
  così i test proteggono la modifica).
- Nessuna dipendenza runtime aggiuntiva: il CSV si genera a mano (blob + download).

## Registro

- 2025-12 — aperto da PO (da README "Non fatto"); PM materializza il ticket.
