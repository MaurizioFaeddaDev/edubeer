# Ticket T-006 — Fondazione token neubrutalism + shell (tema chiaro "neo-paper")

- **id**: T-006
- **tipo**: feat / design
- **stato**: done
- **priorità**: P0 (blocca T-007, T-008, T-009, T-010, T-011)
- **complessità**: M
- **dipendenze**: nessuna (modulo di partenza dell'epic «identità neubrutalism»)

## User story

Come utente di edubeer, voglio un'interfaccia neubrutalism a tema chiaro
"neo-paper" — ombre dure, bordi netti, carta — che sostituisca l'identità
editoriale scura, così che l'app abbia un volto riconoscibile e coerente su
tutte le pagine prima di rifinire le singole sezioni.

## Acceptance criteria

- [ ] `design-system/tokens.css` aziendale aggiornato a **v2 neubrutalism tema
      chiaro "neo-paper"**: palette, ombre dure, bordi, tipografia, spaziatura;
      nessun token storico residuo
- [ ] `src/tokens.css` del progetto sincronizzato dal set aziendale via
      `npm run sync-tokens`
- [ ] Nomi dei token **semantici aziendali**: `--background`, `--surface-1..3`,
      `--border`, `--border-soft`, `--foreground`, `--foreground-muted`,
      `--foreground-faint`, `--accent`, `--accent-soft`, `--positive`,
      `--positive-soft` — **niente** `--bg-0..3`, `--ink`, `--amber`,
      `--line`, `--green` (mapping storico in skill di progetto estinto)
- [ ] Shell rifatta: topbar (senza blur), nav, footer, tipografia di base,
      brand, ricerca, BeerGlass con il nuovo linguaggio
- [ ] Flip di tema: **nessuna** vista resta sull'identità scura precedente;
      la revoca dell'identità editoriale scura è registrata (vedi T-012)
- [ ] `npm test` e `npm run build` verdi
- [ ] Screenshot `#/` e `#/birre` in desktop (1280×900) e mobile (390×844),
      scattati uno alla volta (amdgpu), salvati e riferiti nel ticket

## Note

- Decisione CEO approvata: restyle completo neubrutalism su tutta l'app;
  **identity = metodo** (zone A/B, token, contrasto verificato),
  **palette = tema**. Non è un ri-tint: è un flip di tema sullo stesso metodo.
- Slow-opinions resta **in deroga transitoria documentata** (non si tocca ora):
  da annotare in T-012.
- Contrasto per tema verificato (WCAG AA) è requisito di metodo, non di dettaglio:
  il dato va in T-011, qui si applica il metodo.
- Screenshot: skill `frontend-verification`, mai paralleli (amdgpu).

## Registro

- 2026-10-24 — aperto su decisione CEO approvata (restyle neubrutalism,
  tema chiaro "neo-paper"); PM materializza il ticket e l'epic nel README.
- 2026-10-24 — done: implementato e verificato: `npm run build` + `npm test` (109 test) verdi, screenshot desktop/mobile; `design-system/tokens.css` v2 + `src/tokens.css` sincronizzato.
