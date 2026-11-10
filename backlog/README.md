# Backlog EduBeer

La direzione vigente è **Atlante da esplorare, confronto da degustazione**: vedi `PRODUCT.md` e `DESIGN.md`. L'epic neobrutalista è storico e non guida nuovi interventi.

| Ticket | Stato | Note |
|---|---|---|
| [T-016](T-016-audit-hardening.md) | done | Bug dell'audit, fonti, glossario, confronto condivisibile, filtri ricercabili e suite E2E |
| [T-003](T-003-test-automatici-lib.md) | done | Test di dominio esistenti, ampliati dalle regressioni dell'audit |
| [T-002](T-002-export-csv-selezioni.md) | done | CSV dell'intero risultato filtrato |
| [T-015](T-015-toggle-filtri-mobile.md) | superseded | Il refactor colloca gli strumenti dopo l'introduzione; spaziatura mobile rifinita nell'audit |
| [T-004](T-004-code-splitting-sezioni-estese.md) | open, misurare | Distinguere caching da lazy loading; usare `npm run test:perf` prima di cambiare architettura |
| [T-001](T-001-traduzione-italiana-bjcp.md) | open | Richiede traduzione revisionata; testi ufficiali inglesi mantenuti |
| T-006–T-014 | storico | Epic e varianti visive superati dalla direzione attuale; conservati per tracciabilità |
| T-000, T-005 | wontfix storico | Non riaprire automaticamente |

## Qualità

Prima di integrare: `npm test` e `npm run test:e2e` (include la build). La workflow `.github/workflows/quality.yml` esegue gli stessi gate su push e pull request; non pubblica il sito.

Le fonti dei valori editoriali si registrano in `src/lib/provenance.ts`, separatamente dai dati generati. Gli stati non verificati restano espliciti fino a quando una fonte puntuale, una variante e una data di verifica sono documentate.
