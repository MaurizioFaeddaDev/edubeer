# Ticket T-004 — Code-splitting delle sezioni estese

- **id**: T-004
- **tipo**: chore
- **stato**: open
- **priorità**: P2 (backlog)
- **complessità**: M
- **dipendenze**: T-003 (consigliata: misurare before/after con la suite verde)

## User story

Come visitatore del sito su mobile, voglio che il bundle iniziale non contenga
tutto il corpus, per avere un caricamento più rapido.

## Acceptance criteria

- [ ] Le sezioni estese BJCP (testi lunghi: aroma, sapore, storia…) sono caricate
      **solo nella scheda** (lazy, non nel bundle iniziale)
- [ ] Il bundle iniziale scende sotto i 500 KB raw (oggi li supera per via dei testi BJCP)
- [ ] Le schede funzionano identicamente: i testi si vedono interi quando si apre la scheda
- [ ] Le pagine hash del router (`#/`, `#/birre`, `#/confronta`, `#/approfondimenti`) restano accessibili
- [ ] `vercel.json` **non viene modificato** (routing su hash: nessun rewrite SPA — regola dello skill)
- [ ] `npm run build` passa in verde e la suite di T-003 resta verde

## Note

- Fonte del problema: tutto il corpus è compilato nel bundle (README, sezione Struttura).
- Misurare la dimensione del bundle prima/dopo e riportarla nel Registro.

## Registro

- 2025-12 — aperto da PO (da README "Non fatto"); PM materializza il ticket.
