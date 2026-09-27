# Ticket T-003 — Test automatici su `src/lib/` (vitest)

- **id**: T-003
- **tipo**: chore / test
- **stato**: open
- **priorità**: P0 (blocca — priorità più alta)
- **complessità**: S/M
- **dipendenze**: nessune

## User story

Come manutentore del progetto, voglio una suite automatica sulla logica pura in
`src/lib/`, per modificare filtri, catalogo e confronto senza romperli.

## Acceptance criteria

- [ ] `npm test` gira con runner dev-only (vitest) e fa parte dei comandi di verification
- [ ] Ogni funzione esportata di `catalog.ts`, `styleFilter.ts` e `compare.ts` è coperta
      da almeno un caso felice + un caso limite
- [ ] Caso obbligatorio: il set completo — **116 stili** (107 numerati + 9 storici cat. 27)
- [ ] Casi obbligatori: gli intervalli dei filtri ai **bordi** (ABV/IBU/SRM min e max inclusi/esclusi)
- [ ] Caso obbligatorio: **round-trip URL** `#/birre?q=stout&stile=15B&abv=8-14`
      (stato → hash → stato riproduce gli stessi filtri)
- [ ] Caso obbligatorio: carrello **Confronta min 2 / max 5** con persistenza `localStorage`
- [ ] La suite fallisce se un filtro altera i conteggi attesi (**116 stili, 613 birre**)
- [ ] `npm run build` resta verde (typecheck restato unico gate per UI, non per lib)

## Note

- La logica in `src/lib/` è pura e testabile senza browser — prima cosa da coprire
  (criterio dello skill di progetto).
- vitest configurato dev-only: nessun impatto sul bundle di produzione.
- Il tester verifica proprio questi acceptance criteria (conventions/BACKLOG.md).

## Registro

- 2025-12 — aperto da PO (da README "Non fatto"); decisione per lo smoke test:
  priorità più alta (P0). PM materializza il ticket.
