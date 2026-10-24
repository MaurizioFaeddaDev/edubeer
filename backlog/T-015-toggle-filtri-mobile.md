# Ticket T-015 — Mobile: posizione del toggle «Filtri» rispetto al contenuto

- **id**: T-015
- **tipo**: design / ux
- **stato**: open
- **priorità**: P3
- **complessità**: S
- **dipendenze**: T-006 (shell), dottrina zone DESIGN.md §5

## User story

Come lettrice su telefono, voglio che il contenuto della pagina venga prima degli
strumenti, per non dover scorrere un comando prima di vedere ciò che sono venuta
a leggere.

## Acceptance criteria

- [ ] Decisione esplicita di PO + UI designer sulla posizione del toggle
      «Filtri» su mobile (sopra l'h1, dopo l'intro, o sticky in basso)
- [ ] Se si sposta: contenuto prima degli strumenti, senza perdere l'accesso
      rapido ai filtri né il conteggio dei filtri attivi
- [ ] `npm run build` + `npm test` verdi, screenshot 390×844

## Note

- Segnalato due volte dal QA visuale (T-002 e T-014). Il comportamento attuale è
  ereditato dal pre-restyle: il toggle è il primo elemento della colonna filtri,
  quindi precede l'h1. Non è un bug del tema, è una scelta da confermare.
- Con i filtri chiusi il contenuto segue subito: l'impatto è di un comando.

## Registro

- 2026-10-24 — aperto dall'orchestratore su segnalazione QA visuale (T-014),
  per non correggere in silenzio una decisione di design.
