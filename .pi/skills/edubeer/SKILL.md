---
name: edubeer
description: "Convenzioni del progetto edubeer (enciclopedia BJCP delle birre, https://edubeer.com) — usare per ogni lavoro su ~/Projects/edubeer: stack, fonti dati sacre, comandi di verification, lingua, mapping dei token maistru-craft."
---

# edubeer — skill di progetto

Enciclopedia consultabile delle birre: **116 stili BJCP 2021** + **613 birre citate** +
30 approfondimenti. App online: <https://edubeer.com>. Progetto hobby del CEO, pilota
del workflow maistru-craft.

Prima di lavorare qui leggi anche lo skill `maistru-craft`
(~/.pi/agent/skills/maistru-craft/SKILL.md) — valori e convenzioni aziendali.

## Stack (dichiarato per conventions/STACKS.md)

- **Vite + React 19 + TypeScript strict** — stack "app di dati", CSS custom
  (`src/styles.css`), router su hash custom in `App.tsx`, grafici SVG scritti a mano
  (`ui/charts/`), **zero dipendenze runtime oltre a React**.
- **Testing**: vitest (dev-only) dal ticket T-003 (conventions/TEST.md). Prima di T-003
  il typecheck è `npm run build` (`tsc -b --noEmit` + vite build).
- **Styling**: CSS custom che consuma i token aziendali. `src/tokens.css` è
  **generato** da `maistru-craft/design-system/tokens.css` con `npm run sync-tokens`:
  si usano solo i nomi semantici (`--background`, `--surface-1..3`, `--border`,
  `--foreground*`, `--accent*`, `--positive*`, `--danger*`, `--series-1..5`).
  Identità: neubrutalism disciplinato, tema chiaro **neo-paper** (DESIGN.md v2).
  Unica eccezione locale: `--foam` (bicchiere SVG). Font display Archivo Variable
  self-hosted (`src/assets/`, OFL) — asset, non dipendenza runtime.
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
npm run sync-tokens  # riallinea src/tokens.css dalla fonte aziendale
```

Screenshot UI: skill `frontend-verification`, **uno alla volta** (amdgpu).

## Pattern del progetto

- Logica pura in `src/lib/` (`catalog.ts`, `styleFilter.ts`, `compare.ts`, `beer.ts`,
  `color.ts`) — testabile senza browser, prima cosa da testare.
- Colori SRM (`lib/color.ts`) sono **dato**, non tema: non si sostituiscono con la palette.
- Codice colore **locale** della famiglia BJCP (striscia 6px sulle card): Lager blu,
  Ale giallo, Trappista viola, Spontanea rosa, Speciale verde. Semantico, non aziendale.
- URL condivisibili: i filtri vivono nella query dell'hash (`#/birre?stile=15B&abv=8-14`)
  — ogni filtro/ordinamento aggiunto deve rispettare questo contratto.
- Confronta: selezione 2–5 stili in `localStorage`, sopravvive alla navigazione.
- Il BJCP **non descrive le birre singole**: le schede birra mostrano i dati dello stile
  e lo dichiarano. Nessun dato per-birra inventato, mai.
- Mobile-first: filtri richiudibili in pannello, contenuto prima degli strumenti.
