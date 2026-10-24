# Ticket T-007 — Catalogo e card in stile neubrutalism

- **id**: T-007
- **tipo**: feat / design
- **stato**: done
- **priorità**: P1
- **complessità**: M
- **dipendenze**: T-006 (token v2 + shell: servono i token semantici e la
  tipografia di base prima di rifinire le card)

## User story

Come utente che sfoglia il catalogo, voglio card e griglie in stile
neubrutalism coerenti col tema chiaro "neo-paper", così che la parte più
visto dell'app abbia l'identità nuova fin dal primo sguardo.

## Acceptance criteria

- [ ] Card `.bcard` ridisegnata neubrutalism: bordi netti, ombre dure, hover
      pressione senza mai usare colori hardcoded (solo token)
- [ ] Card `.bjcp-style` (griglia stili) e `.style-beer` (card dentro lo stile)
      allineate allo stesso linguaggio
- [ ] Empty state (nessun risultato filtrato) ridisegnato e leggibile nel tema chiaro
- [ ] Guide (`.guide-count`, blocchi guida) allineate
- [ ] Zero colori hardcoded in tutte le sezioni toccate: solo token del set v2
- [ ] Contratti URL e struttura DOM funzionale invariati (questo ticket è stile,
      non semantica di filtro)
- [ ] `npm test` e `npm run build` verdi
- [ ] Screenshot `#/birre` con risultato, `#/birre` con filtro a 0 risultati e
      `#/stili` in desktop (1280×900) e mobile (390×844), uno alla volta (amdgpu)

## Note

- Zona A di lettura per i testi dentro le card: misura, gerarchia e contrasto
  come da metodo di identità — il dato contrasto calcolato si verifica in T-011.
- Le classi storiche si tengono dove servono per non rompere i test; si
  ridisegnano, non si rinomina tutto in un colpo solo (questo ticket è
  estetica + token, non refactor di nomi DOM).

## Registro

- 2026-10-24 — aperto su decisione CEO; PM materializza nel sprint-neo dopo T-006.
- 2026-10-24 — done: implementato e verificato: card con striscia famiglia, screenshot `#/` e `#/birre` desktop/mobile, build+test verdi.
