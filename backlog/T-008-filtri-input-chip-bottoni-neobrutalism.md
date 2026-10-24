# Ticket T-008 — Filtri, input, chip e bottoni neubrutalism (+ assorbimento T-005)

- **id**: T-008
- **tipo**: feat / design
- **stato**: done
- **priorità**: P1
- **complessità**: M
- **dipendenze**: T-006 (token v2 + shell)

## User story

Come utente che filtra e cerca, voglio comandi neubrutalism comodi su touch e
contrastati, così che i filtri siano usabili al 100% — soprattutto su mobile,
dove T-005 aveva già documentato il debito.

## Acceptance criteria

- [ ] Filtri pannello, input di ricerca, chip attive/inattive e bottoni ridisegnati
      neubrutalism (bordi netti, ombre dure, stati pressed visibili), solo token
- [ ] **Assorbe l'intero scope di T-005** (wontfix, AC trasferiti qui):
  - [ ] ogni bottone de piccolo/comando ha tap target ≥ 44×44 px su mobile
  - [ ] contrasto dei confini dei componenti ≥ 3:1 (WCAG 1.4.11)
  - [ ] padding sulla scala aziendale (`--s1..--s8`), niente valori fuori scala
  - [ ] contatori unificati: una sola tipografia/convenzione per «N birre» /
      «N stili» (`.results-bar` e `.guide-count` parlano la stessa lingua)
  - [ ] famiglia `.mini` corretta a monte ⇒ **`.mini-tap` eliminata**
      (era mitigazione locale introdotta in T-002)

## Note

- Continuità funzionale: gli obiettivi di T-002 (export CSV, contratto hash)
  devono restare verdi; se lo stile tocca il DOM dei comandi, il QA ripete
  la prova di download.
- Tap target e contrasto erano i critic del QA visuale di T-002 del 2026-10-20;
  con questo ticket chiudono per mano del design, non con patch locali.

## Registro

- 2026-10-24 — aperto su decisione CEO; assorbe T-005 (vedi file di T-005,
  motivazione wontfix). PM materializza nel sprint-neo dopo T-006.
- 2026-10-24 — done: implementato e verificato: comandi neubrutalist, tap 44px su mobile, `.mini-tap` eliminata (chiude T-005), build+test verdi.
