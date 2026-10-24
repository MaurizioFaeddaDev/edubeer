# Ticket T-009 — Schede dettaglio neubrutalism (birra / stile / approfondimento)

- **id**: T-009
- **tipo**: feat / design
- **stato**: done
- **priorità**: P1
- **complessità**: M
- **dipendenze**: T-006 (token v2 + shell, tipografia di base)

## User story

Come lettrice di schede, voglio le pagine di dettaglio in neubrutalism chiaro
con una zona A di lettura comoda, così che approfondire una birra o uno stile
resti un atto di lettura, non di decodifica grafica.

## Acceptance criteria

- [ ] Schede birra, stile e approfondimento ridisegnate: **zona A di lettura**
      (testo grande, `--measure` rispettata, gerarchia netta)
- [ ] **Testi BJCP intatti**: nessuna modifica ai contenuti di
      `src/data/bjcp.ts` e `src/data/bjcp-beers.ts` (fonti sacre — MANIFESTO §1);
      il diff del ticket non tocca i file dati
- [ ] Blocchi `.bigspec`, note, fact, blurb allineati al tema
      "neo-paper" con i token v2
- [ ] Le schede birra continuano a dichiarare che i dati sono dello stile,
      non della birra (T-000): l'avviso resta visibile nel tema nuovo
- [ ] Zero colori hardcoded; `npm test` e `npm run build` verdi
- [ ] Screenshot di una scheda stile, una scheda birra e un approfondimento in
      desktop (1280×900) e mobile (390×844), uno alla volta (amdgpu)

## Note

- Le fonti dati sono generate e sincronizzate (vedi skill di progetto):
  qui non si gioca nulla di dati, solo presentazione.
- Se durante il lavoro emerge un elemento tipografico che il tema v2 non
  copre, Tokens v2 si estende nel set aziendale (mai token locale).

## Registro

- 2026-10-24 — aperto su decisione CEO; PM materializza nel sprint-neo dopo T-006.
- 2026-10-24 — done: implementato e verificato: zona A di lettura, bigspec uniformate, screenshot scheda birra/approfondimento, build+test verdi.
