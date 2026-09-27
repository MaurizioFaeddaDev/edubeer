# Ticket T-003 — Test automatici su `src/lib/` (vitest)

- **id**: T-003
- **tipo**: chore / test
- **stato**: done
- **priorità**: P0 (blocca — priorità più alta)
- **complessità**: S/M
- **dipendenze**: nessune

## User story

Come manutentore del progetto, voglio una suite automatica sulla logica pura in
`src/lib/`, per modificare filtri, catalogo e confronto senza romperli.

## Acceptance criteria

- [x] `npm test` gira con runner dev-only (vitest) e fa parte dei comandi di verification
- [x] Ogni funzione esportata di `catalog.ts`, `styleFilter.ts` e `compare.ts` è coperta
      da almeno un caso felice + un caso limite
- [x] Caso obbligatorio: il set completo — **116 stili** (107 numerati + 9 storici cat. 27)
- [x] Casi obbligatori: gli intervalli dei filtri ai **bordi** (ABV/IBU/SRM min e max inclusi/esclusi)
- [x] Caso obbligatorio: **round-trip URL** `#/birre?q=stout&stile=15B&abv=8-14`
      (stato → hash → stato riproduce gli stessi filtri)
- [x] Caso obbligatorio: carrello **Confronta min 2 / max 5** con persistenza `localStorage`
- [x] La suite fallisce se un filtro altera i conteggi attesi (**116 stili, 613 birre**)
- [x] `npm run build` resta verde (typecheck restato unico gate per UI, non per lib)

## Note

- La logica in `src/lib/` è pura e testabile senza browser — prima cosa da coprire
  (criterio dello skill di progetto).
- vitest configurato dev-only: nessun impatto sul bundle di produzione.
- Il tester verifica proprio questi acceptance criteria (conventions/BACKLOG.md).

## Registro

- 2025-12 — aperto da PO (da README "Non fatto"); decisione per lo smoke test:
  priorità più alta (P0). PM materializza il ticket.
- 2026-09-27 — implementata la suite **vitest dev-only: 78 test su 5 file**
  (`catalog`, `styleFilter`, `compare`, `color`, `beer`). Durante la scrittura
  dei test è emerso un bug in `srmToHex`: sotto il primo ancoraggio (SRM < 1)
  il clamp cadeva fuori dal primo segmento e restituiva il colore più scuro
  invece del più chiaro — fix red→green, nessun impatto sui dati reali
  (dominio 2–35 SRM). Precisazione: il fix normalizza anche il casing
  dell'output per SRM > 45 (da `#220E0D` a `#220e0d`, stesso colore; nessun
  dato reale supera 35 SRM). README aggiornato con i comandi di test.
- 2026-09-27 — **tester: VERDE**. `npm test` exit 0 (5 file, 78/78 test passati,
  vitest 4.1.11) e `npm run build` exit 0 (tsc + vite, bundle 679 kB). Acceptance
  criteria verificati uno a uno sul codice dei test reali (non sul report): conteggi
  sacri 116/613 asseriti in `catalog.test.ts` e `styleFilter.test.ts`; bordi ABV/IBU/SRM
  con `±1` fuori range asseriti per birre e stili; round-trip `#/birre?q=stout&stile=15B&abv=8-14`
  con hash esatto; carrello 2–5 con reload su `MemoryStorage` e chiave canarino
  `edubeer.compare.v1`; tutte le funzioni esportate di catalog/styleFilter/compare coperte.
  Bug `srmToHex` sotto 1 SRM riprodotto e corretto (test dedicato). Nessun criterio
  rosso. Dettaglio nel verdetto del tester (sessione workflow /feature).
