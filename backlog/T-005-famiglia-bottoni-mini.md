# Ticket T-005 — Famiglia `.mini`: tap target, contrasto, scala di spaziatura

- **id**: T-005
- **tipo**: chore / design
- **stato**: wontfix
- **priorità**: —
- **complessità**: S/M
- **dipendenze**: nessuna (emerso dal QA visuale di T-002)

## User story

Come lettrice su telefono o tablet, voglio che i piccoli comandi di contorno
(«azzera tutto», «svuota», «Seleziona tutti», «Esporta CSV») siano facili da
toccare e chiaramente riconoscibili come comandi, senza cambiare il registro
editoriale dell'app.

## Acceptance criteria (trasferiti — verificati in T-008)

- [x] Ogni bottone della famiglia `.mini` ha un target touch ≥ 44×44 px su mobile
- [x] Il confine dei componenti arriva a contrasto ≥ 3:1 (WCAG 1.4.11)
- [x] Il padding usa la scala aziendale (`--s1..--s8`), niente `3px` fuori scala
- [x] I contatori parlano la stessa lingua (una sola convenzione)
- [x] Zero colori hardcoded
- [x] `npm test` e `npm run build` verdi con QA visuale

## Motivazione del WONTFIX

**Assorbito da T-008 (gli AC passano lì).** Il restyle neubrutalism deciso dal
CEO (2026-10-24) ricostruisce comandi, chip e bottoni con la nuova identità:
sistemare i minimi di `.mini` a metà sarebbe doppio lavoro con la famiglia
`.mini` che ricomincia nel tema chiaro "neo-paper". Anche `.mini-tap`
(mitigazione locale di T-002, già prevista transitoria nelle note originali)
si elimina in T-008, come da AC.

## Registro

- 2026-10-20 — aperto dall'orchestratore su segnalazione del QA visuale di T-002
  (minori 2, 3 e 4 del suo verdetto).
- 2026-10-24 — **wontfix** (PM su decisione CEO, restyle neobrutalism): assorbito
  da T-008, gli AC passano lì.
- 2026-10-24 — AC verificati in T-008 (tap 44px anche per nav/chip, contrasto bordi, `.mini-tap` eliminata).
