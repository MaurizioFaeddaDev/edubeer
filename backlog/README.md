# Backlog — edubeer

Indice del backlog. Stato e dettagli vivono nei file dei ticket (conventions/BACKLOG.md).

| id | titolo | tipo | stato | priorità | complessità |
|---|---|---|---|---|---|
| [T-003](T-003-test-automatici-lib.md) | Test automatici su `src/lib/` (vitest) | chore | open | P0 | S/M |
| [T-002](T-002-export-csv-selezioni.md) | Export CSV delle selezioni filtrate | feat | open | P1 | M |
| [T-001](T-001-traduzione-italiana-bjcp.md) | Traduzione italiana dei testi BJCP | feat | open | P2 | L |
| [T-004](T-004-code-splitting-sezioni-estese.md) | Code-splitting sezioni estese (>500 KB) | chore | open | P2 | M |
| [T-000](T-000-wontfix-scostamento-birra-stile.md) | Scostamento birra-stile | wontfix | wontfix | — | — |

## Note di priorità

- **T-003** è la priorità più alta (decisione PO): il typecheck `npm run build` è oggi
  l'unico gate; T-002 e poi T-001/T-004 vanno protette da test prima di essere toccate.
- **T-001** è L e **non sprint-ready**: va spezzata in ticket S/M per categoria
  prima di entrare in uno sprint. Dipende da fonte di traduzione revisionata
  (da chiedere al CEO) e da verifica della licenza BJCP per opera derivata.
