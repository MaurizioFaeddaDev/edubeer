---
name: edubeer
description: Convenzioni del progetto edubeer (enciclopedia BJCP delle birre, https://edubeer.com) — usare per ogni lavoro su ~/Projects/edubeer: stack, fonti dati sacre, comandi di verification, lingua, mapping dei token maistru-craft.
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
- **Styling**: CSS custom con i token storici del progetto, mappati sui semantici
  maistru-craft (tabella sotto). Nuovi component usano i nomi semantici aziendali.
- **Deploy**: Vercel, dominio https://edubeer.com, `vercel.json` esplicito
  (`framework: "vite"`, `outputDirectory: "dist"`). Routing su hash: nessun rewrite SPA.
  **Mai modificare `vercel.json` senza ticket.**

### Mapping token (storico → maistru-craft)

| edubeer (storico) | maistru-craft (semantico) |
|---|---|
| `--bg-0..--bg-3` | `--background`, `--surface-1..3` |
| `--line`, `--line-soft` | `--border`, `--border-soft` |
| `--ink`, `--ink-dim`, `--ink-faint` | `--foreground`, `--foreground-muted`, `--foreground-faint` |
| `--amber`, `--amber-soft` | `--accent`, `--accent-soft` |
| `--green`, `--green-soft` | `--positive`, `--positive-soft` |
| `--fs-*`, `--s1..--s8`, `--radius`, `--shadow`, `--measure` | identici (già conformi) |

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
npm run build    # typecheck (tsc -b --noEmit) + bundle statico
npm test         # dal ticket T-003: suite vitest su src/lib/ (vitest run)
```

Screenshot UI: skill `frontend-verification`, **uno alla volta** (amdgpu).

## Pattern del progetto

- Logica pura in `src/lib/` (`catalog.ts`, `styleFilter.ts`, `compare.ts`, `beer.ts`,
  `color.ts`) — testabile senza browser, prima cosa da testare.
- URL condivisibili: i filtri vivono nella query dell'hash (`#/birre?stile=15B&abv=8-14`)
  — ogni filtro/ordinamento aggiunto deve rispettare questo contratto.
- Confronta: selezione 2–5 stili in `localStorage`, sopravvive alla navigazione.
- Il BJCP **non descrive le birre singole**: le schede birra mostrano i dati dello stile
  e lo dichiarano. Nessun dato per-birra inventato, mai.
- Mobile-first: filtri richiudibili in pannello, contenuto prima degli strumenti.
