# Backlog — edubeer

Indice del backlog. Stato e dettagli vivono nei file dei ticket (conventions/BACKLOG.md).

| id | titolo | tipo | stato | priorità | complessità |
|---|---|---|---|---|---|
| [T-003](T-003-test-automatici-lib.md) | Test automatici su `src/lib/` (vitest) | chore | open | P0 | S/M |
| [T-002](T-002-export-csv-selezioni.md) | Export CSV delle selezioni filtrate | feat | done | P1 | M |
| [T-001](T-001-traduzione-italiana-bjcp.md) | Traduzione italiana dei testi BJCP | feat | open | P2 | L |
| [T-004](T-004-code-splitting-sezioni-estese.md) | Code-splitting sezioni estese (>500 KB) | chore | open | P2 | M |
| [T-005](T-005-famiglia-bottoni-mini.md) | Famiglia `.mini`: tap target, contrasto, spaziatura | chore/design | open | P3 | S/M |
| [T-000](T-000-wontfix-scostamento-birra-stile.md) | Scostamento birra-stile | wontfix | wontfix | — | — |

## Note di priorità

- **T-003** è la priorità più alta (decisione PO): il typecheck `npm run build` è oggi
  l'unico gate; T-002 e poi T-001/T-004 vanno protette da test prima di essere toccate.
- **T-002 chiuso** (2026-10-20): l'export CSV è la prima feature nata dalla catena
  `/feature` completa con QA visuale — usarlo come metro per le prossime.
- **T-004** è il prossimo candidato P2: il bundle è a **680 kB raw** (204 kB gzip) e il
  warning di Vite a ogni build lo ricorda.
- **T-005** è debito di design emerso dal QA visuale di T-002: richiede l'ui-designer,
  non è lavoro da worker isolato.
- **T-001** è L e **non sprint-ready**: va spezzata in ticket S/M per categoria
  prima di entrare in uno sprint. Dipende da fonte di traduzione revisionata
  (da chiedere al CEO) e da verifica della licenza BJCP per opera derivata.
