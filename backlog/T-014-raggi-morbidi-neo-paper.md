# Ticket T-014 — Ammorbidire il tema neo-paper: scala di raggi

- **id**: T-014
- **tipo**: feat / design
- **stato**: done
- **priorità**: P1
- **complessità**: S
- **dipendenze**: T-006 (token e shell), T-007..T-010 (superfici su cui si applica)

## User story

Come lettrice, voglio un neubrutalism **leggermente più morbido** — angoli
arrotondati e curve gentili — per sentire l'interfaccia più fresca e accogliente,
senza perdere bordi inchiostro e ombre dure che danno carattere.

## Acceptance criteria

- [x] `tokens.css` v2.1: scala `--radius-xs 4px`, `--radius-sm 8px`,
      `--radius 14px`, `--radius-lg 18px`, `--radius-pill 999px`
- [x] Contenitori (card, filter-block, bigspec, chart-card) a `--radius`
- [x] Comandi (nav, input, select, mini, note, fact) a `--radius-sm`
- [x] Chip, badge, contatori e scrollbar a `--radius-pill`
- [x] Popover, empty state e tooltip a `--radius-lg`
- [x] Micro-tag (codice BJCP, cat-id, kbd, swatch SRM, thumb slider) a `--radius-xs`
- [x] Ombre dure e bordi 2px invariati; contrasto AA invariato (test verdi)
- [x] `npm run build` e `npm test` verdi
- [x] Screenshot desktop 1280×900 e mobile 390×844 (uno alla volta)
- [x] DESIGN.md, skill globale, README e skill di progetto aggiornati

## Note

- Non è un cambio di identità: resta il tema neo-paper, cambia solo la forma.
  La regola delle zone (A riposo / B stile) non si tocca.
- Il font display Archivo resta (confermato dal CEO).
- `rx=2` sulle barre dei grafici: micro-morbidezza senza perdere precisione.

## Registro

- 2026-10-24 — aperto su richiesta CEO («leggermente più morbido, con border
  radius e curve più morbide»), implementato e verificato nello stesso giorno.
