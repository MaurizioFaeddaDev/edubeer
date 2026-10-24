# Ticket T-005 — Famiglia `.mini`: tap target, contrasto, scala di spaziatura

- **id**: T-005
- **tipo**: chore / design (passa da ui-designer)
- **stato**: open
- **priorità**: P3 (backlog, nessun blocco)
- **complessità**: S/M
- **dipendenze**: nessuna (emerso dal QA visuale di T-002)

## User story

Come lettrice su telefono o tablet, voglio che i piccoli comandi di contorno
(«azzera tutto», «svuota», «Seleziona tutti», «Esporta CSV») siano facili da
toccare e chiaramente riconoscibili come comandi, senza cambiare il registro
editoriale dell'app.

## Acceptance criteria

- [ ] Ogni bottone della famiglia `.mini` ha un target touch ≥ 44×44 px su mobile
      (DESIGN.md §5) — oggi `.mini` misura ~27px di altezza
- [ ] Il confine del bottone raggiunge il contrasto 3:1 richiesto per i confini dei
      componenti (WCAG 1.4.11) — oggi bordo `--line` su `--bg-2` = 1.48:1
- [ ] Il padding di `.mini` usa la scala aziendale (`--s1..--s8`), non `3px` fuori scala
- [ ] Le due tipografie di conteggio («N birre» mono in `.results-bar`, «**N** stili»
      in `.guide-count`) parlano la stessa lingua, o la differenza è una scelta motivata
- [ ] Zero colori hardcoded: solo token del design system
- [ ] `npm test` e `npm run build` verdi; screenshot mobile (390×844) e desktop (1280×900)
      ricontrollati dal QA visuale

## Note

- La variante `.mini-tap` introdotta in T-002 (min-height 44px su `.mini-tap`, breakpoint
  560px) è una mitigazione locale: se la famiglia `.mini` viene corretta, `.mini-tap`
  sparisce.
- Interessa più viste (filtri, tabella tecnica, confronto, export): per questo non è
  stato risolto dentro T-002 ma è un ticket di design a sé.

## Registro

- 2026-10-20 — aperto dall'orchestratore su segnalazione del QA visuale di T-002
  (minori 2, 3 e 4 del suo verdetto).
