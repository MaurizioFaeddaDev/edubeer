# Sprint-neo — Epic «identità neubrutalism» (edubeer)

Data apertura: 2026-10-24 · PO/CEO: decisione approvata · PM: materializzato
(il nome dello sprint resta `sprint-neo` per storia del flusso)

## Obiettivo

Portare edubeer su **neubrutalism, tema chiaro "neo-paper"**, su tutta l'app, con
il metodo dell'identità invariato (zone A/B, token aziendali, contrasto
verificato) e il tema come sola palette. Deploy online **solo dopo** QA
accessibilità e OK del CEO.

## Ticket in ordine di esecuzione

| # | ticket | priorità | complessità | dipendenze |
|---|---|---|---|---|
| 1 | T-006 — Fondazione token + shell | P0 | M | — |
| 2a | T-007 — Catalogo e card | P1 | M | T-006 |
| 2b | T-008 — Filtri, input, chip, bottoni (+ T-005) | P1 | M | T-006 |
| 2c | T-009 — Schede dettaglio | P1 | M | T-006 |
| 3 | T-010 — Confronto, grafici SVG, tabelle + hex | P1 | M | T-006; dopo 2a/2b/2c |
| 4 | T-011 — QA accessibilità + gate deploy | P0 finale | S | T-006..T-010 |
| 5 | T-012 — Documentazione | P2 | S | T-011 |
| 6 | T-013 — Font Archivo Variable (opzionale) | P2 | S | T-006; dopo T-011 |

2a/2b/2c eseguibili **in parallelo** (sezioni diverse, stesso set token).

## Regola dei 6 step

Ogni workflow della catena non supera **6 passaggi** (conventions/BACKLOG.md,
regola 2). Nessun ticket di questo sprint è L: tutti S/M, quindi senza split
ulteriori. Se T-011 trova un contrasto rosso, **non** si patcha lì: si riapre la
sezione in causa (T-007/T-008/T-009/T-010) in un nuovo giro, sempre ≤ 6 step.

## Workflow proposti

Catena standard per ogni ticket di stile/refactor (5–6 step):

```
po → tech-lead-fe → worker → reviewer → tester
```

- **T-006**: `po → tech-lead-fe → worker → reviewer → tester` + QA visuale
  (screenshot `#/` e `#/birre`, desktop+mobile) nel passo tester.
- **T-007 / T-008 / T-009**: stessa catena; **QA visuale obbligatorio** su ogni
  sezione rimessa a punto (screenshot desktop + mobile per vista, uno alla volta).
- **T-010**: catena standard; QA visuale su confronto e tabella tecnica.
- **T-011**: `tester (matrice + contrasti + keyboard) → reviewer → CEO (OK) →
  deploy Vercel → prova bundle live` — è il gate, non un giro extra di stile.

## Rischi

- **Mid-state**: metà app in tema chiaro, metà scura durante lo sprint.
  Mitigazione: T-006 porta il flip del tema a livello shell prima delle sezioni;
  nessun deploy parziale.
- **Sticky sidebar / layout in tema chiaro**: ombre dure e bordi netti possono
  rompere il comportamento sticky/scroll. Mitigazione: QA desktop+mobile su
  ogni sezione, non solo sul catalogo.
- **Font swap**: se T-013 parte fuori ordine, o licenza/rete/peso falliscono, si
  chiude wontfix secondo i criteri di rigetto del ticket — nessun deploy aperto
  da un font.
- **Budget**: guardrail aziendali (80% della quota $8/mese); lo sprint tiene
  i workflow corti e il gate visuale è il punto dove fermarsi se il budget preme.
  Registro a cura dell'orchestratore alla chiusura di ogni workflow.

## Definizione di «fatto» (per ogni ticket e per l'epic)

Un ticket è **done** solo se tutti e quattro:

1. `npm run build` e `npm test` **verdi**
2. screenshot di verifica della sezione (desktop 1280×900 + mobile 390×844,
   scattati uno alla volta su amdgpu) **salvati e riferiti**
3. **dichiarazione scout** nel file del ticket: cosa è fatto, cosa NON è fatto,
   eventuali minori aperti
4. stato aggiornato nel file ticket e nell'indice README (stato nei file,
   non nei messaggi)

Per l'epic intero si aggiunge: gate T-011 superato (contrasti calcolati,
keyboard/focus, OK CEO, deploy + bundle live) e T-012 chiuso (documentazione +
revoca + cosa NON fatto).

## Stato al 2026-10-24 (chiusura implementazione)

| ticket | stato | prova |
|---|---|---|
| T-006 | done | build + 109 test verdi; screenshot desktop/mobile |
| T-007 | done | card con striscia famiglia; screenshot `#/`, `#/birre` |
| T-008 | done | tap 44px, `.mini-tap` eliminata (T-005 chiuso) |
| T-009 | done | bigspec uniformi, zona A; screenshot schede |
| T-010 | done | hex rimossi dai TSX, serie da token, dash + alone tacca SRM |
| T-011 | done | QA fatto, deploy `edubeer-p5pbfljcg` Ready, bundle live identico al locale |
| T-012 | done | DESIGN.md v2, README, skill, PROGETTI, costs |
| T-013 | done | Archivo 34.9 KB OFL, revertibile in un commit |

Verifica: `npm run build` e `npm test` (109 test, inclusa la guardia di contrasto)
verdi. Deploy eseguito il 2026-10-24 con OK del CEO. Baseline pre-restyle archiviata in
`/tmp/edubeer-shots/before-*.png` (fuori repo).

## Post-epic — T-014 (2026-10-24)

Iterazione richiesta dal CEO: il tema neo-paper si ammorbidisce con una scala di
raggi (`--radius-xs/sm/-lg/pill`), senza toccare bordi inchiostro, ombre dure,
zone A/B o contrasti. Ticket: `T-014-raggi-morbidi-neo-paper.md` (done).
