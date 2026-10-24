# Backlog — edubeer

Indice del backlog. Stato e dettagli vivono nei file dei ticket (conventions/BACKLOG.md).

| id | titolo | tipo | stato | priorità | complessità |
|---|---|---|---|---|---|
| [T-006](T-006-token-fondazione-shell-neobrutalism.md) | Fondazione token neubrutalism + shell (tema chiaro "neo-paper") | feat / design | done | P0 | M |
| [T-007](T-007-catalogo-card-neobrutalism.md) | Catalogo e card neubrutalism | feat / design | done | P1 | M |
| [T-008](T-008-filtri-input-chip-bottoni-neobrutalism.md) | Filtri, input, chip e bottoni (+ T-005) | feat / design | done | P1 | M |
| [T-009](T-009-schede-dettaglio-neobrutalism.md) | Schede dettaglio (birra/stile/approfondimento) | feat / design | done | P1 | M |
| [T-010](T-010-confronto-grafici-tabelle-neobrutalism.md) | Confronto, grafici SVG, tabelle + debito hex | feat / refactor / design | done | P1 | M |
| [T-011](T-011-qa-accessibilita-gate-deploy-neobrutalism.md) | QA accessibilità + gate deploy epic | chore / quality | done | P0 (finale) | S |
| [T-012](T-012-documentazione-restyle-neobrutalism.md) | Documentazione restyle (README, skill, DESIGN.md v2, PROGETTI.md) | docs | done | P2 | S |
| [T-013](T-013-font-archivo-variable-selfhosted.md) | Font display Archivo Variable OFL self-hosted | feat | done | P2 | S |
| [T-014](T-014-raggi-morbidi-neo-paper.md) | Ammorbidire il tema: scala di raggi | feat / design | done | P1 | S |
| [T-015](T-015-toggle-filtri-mobile.md) | Mobile: posizione del toggle «Filtri» | design / ux | open | P3 | S |
| [T-003](T-003-test-automatici-lib.md) | Test automatici su `src/lib/` (vitest) | chore | open | P0 | S/M |
| [T-002](T-002-export-csv-selezioni.md) | Export CSV delle selezioni filtrate | feat | done | P1 | M |
| [T-001](T-001-traduzione-italiana-bjcp.md) | Traduzione italiana dei testi BJCP | feat | open | P2 | L |
| [T-004](T-004-code-splitting-sezioni-estese.md) | Code-splitting sezioni estese (>500 KB) | chore | open | P2 | M |
| [T-005](T-005-famiglia-bottoni-mini.md) | Famiglia `.mini`: tap target, contrasto, spaziatura | chore/design | wontfix | — | S/M |
| [T-000](T-000-wontfix-scostamento-birra-stile.md) | Scostamento birra-stile | wontfix | wontfix | — | — |

## Epic: identità neubrutalism

**Decisione CEO approvata (2026-10-24):** restyle completo neubrutalism a tema
chiaro "neo-paper" su tutta l'app. Revoca dell'identità editoriale scura:
**identity = metodo** (zone A/B, token, contrasto verificato), **palette = tema**.
Slow-opinions resta in deroga transitoria documentata (non si tocca in questo epic).

**Ordine di esecuzione (completato il 2026-10-24):**

```
T-006 (fondazione token + shell)
  → T-007 ∥ T-008 ∥ T-009   (in parallelo, dopo i token)
    → T-010                  (confronto/grafici/tabelle)
      → T-011                (QA + gate deploy, OK CEO, Vercel)
        → T-012              (documentazione)
           T-013             (font, opzionale, dopo il gate)
```

- **T-006** è il modulo di partenza: niente sezioni prima dei token v2.
- **T-007/T-008/T-009** parallelizzabili: tocchano sezioni diverse, stesso set di token.
- **T-005 è wontfix** (assorbito da T-008 — gli AC passano lì, inclusa l'eliminazione
  di `.mini-tap`); nessun lavoro separato sulla famiglia `.mini`.
- **T-014** è l'iterazione post-epic: raggi morbidi, nessun cambio di identità.
- **T-011** è il gate: nessun deploy senza matrice screenshot, contrasti calcolati,
  keyboard/focus e OK del CEO.
- **T-012** chiude l'epic documentando anche cosa NON è fatto; **T-013** è opzionale
  e può chiudere wontfix (criteri di rigetto nel ticket).

Sprint di riferimento: `backlog/sprint-neo.md`.

## Note di priorità

- **T-006 e T-011 sono i P0 dell'epic**: prima la fondazione, poi il gate finale.
- T-001/T-003/T-004 restano fuori da questo epic (vedi sotto).
- **T-002 chiuso** (2026-10-20): l'export CSV è la prima feature nata dalla catena
  `/feature` completa con QA visuale — metro per le prossime; il suo fix locale
  `.mini-tap` viene ora eliminato in T-008 (vedi T-005).
- **T-003** resta P0 del backlog ordinario: il typecheck `npm run build` è oggi
  l'unico gate generico; l'epic neubrutalism si appoggia a `npm test` a ogni ticket.
- **T-004** è il prossimo candidato P2 fuori epic: il bundle è a **680 kB raw**
  (204 kB gzip); T-013 deve tenerne conto nel proprio budget di peso.
- **T-001** è L e **non sprint-ready**: va spezzata in ticket S/M per categoria
  prima di entrare in uno sprint. Dipende da fonte di traduzione revisionata
  (da chiedere al CEO) e da verifica della licenza BJCP per opera derivata.
