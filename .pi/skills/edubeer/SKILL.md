---
name: edubeer
description: "Convenzioni di EduBeer: stack, fonti dati, verifica, lingua e identità autonoma dell'atlante."
---

# edubeer — skill di progetto

Enciclopedia consultabile delle birre: **116 stili BJCP 2021** + **613 birre citate** +
30 approfondimenti. App online: <https://edubeer.com>. Progetto hobby del CEO, pilota
del workflow maistru-craft.

Prima di lavorare qui leggi `PRODUCT.md` e `DESIGN.md`. Il redesign approvato
dall'utente il 7 novembre 2026 sostituisce l'identità condivisa maistru-craft:
atlante da esplorare (A), confronto da degustazione (B). Le precedenti prescrizioni
di brutalismo e sincronizzazione dei token non si applicano più a EduBeer.

## Stack (dichiarato per conventions/STACKS.md)

- **Vite + React 19 + TypeScript strict** — stack "app di dati", CSS custom
  (`src/styles.css`), router su hash custom in `App.tsx`, grafici SVG scritti a mano
  (`ui/charts/`), **zero dipendenze runtime oltre a React**.
- **Testing**: vitest (dev-only) dal ticket T-003 (conventions/TEST.md). Prima di T-003
  il typecheck è `npm run build` (`tsc -b --noEmit` + vite build).
- **Styling**: CSS custom e token locali autonomi in `src/tokens.css`.
  Identità: fondo porcellana, testo bruno e petrolio; Source Serif 4 per i titoli,
  Source Sans 3 per testo e controlli, WOFF2 self-hosted con licenze OFL.
  `DESIGN.md` e `.impeccable/design.json` documentano il sistema finale.
  Il comando `sync-tokens` è stato rimosso: non ripristinare token esterni.
- **Deploy**: Vercel, dominio https://edubeer.com, `vercel.json` esplicito
  (`framework: "vite"`, `outputDirectory: "dist"`). Routing su hash: nessun rewrite SPA.
  **Mai modificare `vercel.json` senza ticket.**

### Token

La tabella di mapping storico→semantico è **dismessa** (2026-10-24): il CSS non
usa più `--bg-0`, `--ink`, `--amber`, `--line`, `--green`. I valori vivono in
`tokens.css`; il progetto non li ridefinisce. `--copper` è fuori dal set v2.

## Lingua

- **App e contenuti: italiano** (i testi ufficiali BJCP restano verbatim in inglese —
  è il documento con cui i giudici valutano).
- **Commit: inglese**, conventional commits (decisione CEO 2025-12; i commit storici
  in italiano restano come sono).

## Fonti dati sacre (MANIFESTO §1: mai inventare)

- `src/data/bjcp.ts`, `src/data/bjcp-beers.ts` — **generati** dal documento ufficiale
  `2021_Guidelines_Beer_1.25.docx` via `python3 scripts/gen-bjcp-docx.py [percorso]`.
  **Mai modificare a mano**: si cambia lo script e si rigenera.
- `scripts/bjcp_blurbs.py` — blurb italiani scritti a mano (chiave = codice ufficiale
  o nome per gli stili storici non numerati).
- `src/data/{types,styles,beers}.ts`, `source.json` — **sincronizzati** da
  `../birramon` (BIRRAMON — Rosso Malto) via `npm run sync-data`. Mai modificare a mano.
- Approfondimenti: 30 schede verificate birra per birra, condivise con BIRRAMON.

## Comandi di verification (conventions/VERIFICATION.md)

```bash
npm run build        # typecheck (tsc -b --noEmit) + bundle statico
npm test             # suite vitest su src/lib/ (vitest run) — include il test di contrasto dei token
```

Screenshot UI: skill `frontend-verification`, **uno alla volta** (amdgpu).

## Pattern del progetto

- Logica pura in `src/lib/` (`catalog.ts`, `styleFilter.ts`, `compare.ts`, `beer.ts`,
  `color.ts`) — testabile senza browser, prima cosa da testare.
- Colori SRM (`lib/color.ts`) sono **dato**, non tema: non si sostituiscono con la palette.
- Le famiglie sono etichette e filtri. Il colore della birra deriva dall'SRM;
  in assenza di dato il bicchiere resta vuoto. Nei grafici di confronto i segmenti
  SRM hanno un contorno interno contrastato per mantenere leggibili gli estremi.
- URL condivisibili: i filtri vivono nella query dell'hash (`#/birre?stile=15B&abv=8-14`)
  — ogni filtro/ordinamento aggiunto deve rispettare questo contratto.
- Confronta: selezione 2–5 stili in `localStorage`, sopravvive alla navigazione.
- Il BJCP **non descrive le birre singole**: le schede birra mostrano i dati dello stile
  e lo dichiarano. Nessun dato per-birra inventato, mai.
- Mobile-first: filtri richiudibili in pannello, contenuto prima degli strumenti.
