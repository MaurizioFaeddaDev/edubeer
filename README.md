# EduBeer

Atlante consultabile della birra, per appassionati curiosi e degustatori. **116 stili BJCP 2021, 613 birre citate come esempi e 30 approfondimenti curati.**

## Avvio

```sh
npm ci
npm run dev
npm run build
npm test
npm run preview
```

React 19, TypeScript e Vite. Hosting statico; nessun backend o account necessario. I dati e i font sono locali: nessun servizio esterno richiesto durante la consultazione.

## Consultazione

- **Stili:** elenco per categoria ufficiale, ricerca globale, filtri per famiglia, categoria e intervalli, ordinamento e CSV. Su desktop un'anteprima affiancata consente di esplorare senza perdere l'elenco; su telefono i nomi aprono direttamente la scheda.
- **Scheda stile:** sintesi italiana, numeri, scala colore, testo ufficiale in inglese, dati per degustatori, birre citate e approfondimenti collegati.
- **Confronta:** da 2 a 5 stili, aggiungibili dalla guida, dalla scheda o dalla ricerca interna. Intervalli ABV/IBU/SRM su scale comuni, valori esatti, tabella con OG/FG e radar secondario ripiegabile. La selezione è salvata in localStorage.
- **Birre:** esempi commerciali citati dal BJCP, con filtri, ricerca, ordinamento e CSV.
- **Approfondimenti:** 30 schede con storia, origine, abbinamento e nota di degustazione, ricercabili per nome, stile e provenienza.

La ricerca globale suggerisce stili e birre. Frecce e Invio selezionano un suggerimento; Invio senza selezione cerca nel catalogo birre. Escape chiude i suggerimenti. Il tasto `/` porta alla ricerca quando non si sta già scrivendo in un campo.

## Fonti e limiti dei dati

Il BJCP descrive gli **stili**, non le singole birre commerciali: ABV, IBU, SRM, OG e FG sono intervalli di stile. Le liste e le schede dichiarano questa distinzione. I filtri numerici mostrano le birre il cui stile interseca l'intervallo richiesto.

Gli approfondimenti sono un corpus editoriale separato. I valori importati sono indicati come **da verificare** finché non sono disponibili fonte puntuale, variante e data di verifica. `src/lib/provenance.ts` conserva questa provenienza senza modificare i dataset generati. I colori SRM sono informazioni di colore, non punteggi. La tacca di un grafico indica il punto medio matematico dell'intervallo, non una misura della birra. Un valore mancante resta non dichiarato; i bicchieri senza dato SRM sono vuoti. La forma del bicchiere è illustrativa.

Gli stili e le birre citate sono generati dal documento ufficiale BJCP 2021:

```sh
python scripts/gen-bjcp-docx.py percorso/2021_Guidelines_Beer_1.25.docx
```

Le sintesi italiane sono in `scripts/bjcp_blurbs.py`. I testi ufficiali in `src/data/bjcp.ts` restano verbatim in inglese. Non modificare manualmente i dataset generati.

Gli approfondimenti sono sincronizzabili dal progetto BIRRAMON:

```sh
npm run sync-data
node scripts/sync-data.mjs percorso/birramon
```

## Identità visiva

Atlante da esplorare con confronto da degustazione: porcellana, testo bruno, accento petrolio, Source Serif 4 per i titoli e Source Sans 3 per la consultazione. Bicchieri SVG e scale SRM collegano l'identità al contenuto.

`src/tokens.css` è la fonte locale autonoma. La precedente sincronizzazione dei token da maistru-craft è stata rimossa per impedire sovrascritture del tema. `DESIGN.md` descrive il sistema finale; `PRODUCT.md` registra pubblico e vincoli del prodotto. Font WOFF2 latini self-hosted; licenze OFL incluse in `src/assets/`.

## URL

```text
#/                            guida agli stili
#/?fam=Lager                  guida filtrata e condivisibile
#/stili                       alias della guida
#/stili/3B                    scheda dello stile
#/stili/27-kellerbier          stile storico
#/birre?q=pilsner              catalogo filtrato
#/birre?stile=3B               birre citate per lo stile
#/b/pilsner-urquell            scheda birra (ID del corpus)
#/confronta                    selezione locale persistente
#/confronta?stili=3B,5D         confronto condiviso (prevale sulla selezione locale)
#/approfondimenti?q=dupont     approfondimenti con ricerca condivisibile
#/a/saison              approfondimento (ID del corpus)
```

Gli ID delle birre e degli approfondimenti derivano dal corpus. I filtri cambiano l'URL senza aggiungere una voce di cronologia per ogni modifica. Gli URL malformati hanno una pagina di recupero.

## Struttura

```text
src/App.tsx                   shell, navigazione e stato delle query
src/lib/routes.ts             parsing e link delle route
src/lib/catalog.ts            catalogo e filtri birre
src/lib/styleFilter.ts        ricerca e filtri stili
src/lib/compare.ts            selezione, ordinamenti e metriche
src/lib/csv.ts                esportazione CSV
src/lib/__tests__/            test di dominio, route e contrasto
src/ui/StyleGuide.tsx          elenco e anteprima
src/ui/StylePage.tsx           scheda stile
src/ui/StyleElements.tsx       numeri, scala SRM e selezione confronto
src/ui/CompareView.tsx         confronto e ricerca interna
src/ui/charts/                intervalli e radar
src/ui/                       catalogo, schede, ricerca e filtri
src/data/                     dataset e provenienza
src/styles.css                layout, componenti e responsive
src/tokens.css                token autonomi
```

## Verifica

`npm test` verifica filtri, ricerca, CSV, confronto, colori, route condivisibili e contrasto del tema. `npm run build` esegue TypeScript e produce `dist/`, con dati BJCP e dipendenze separati per caching.

Il refactor è verificato anche in Chrome headless: guida, schede, ricerca da tastiera, filtri e ricarica URL, CSV, confronto e limite di cinque stili, percorsi tra stili/birre/approfondimenti, stati vuoti e indirizzi malformati. Controlli responsive a 1440, 1024, 390 e 320 px. Evidenze locali non versionate in `.impeccable/review/`.

La configurazione di deploy statico è in `vercel.json`. Il refactor non pubblica automaticamente il sito.


## Verifica dell'audit

```sh
npm ci
npx playwright install chromium
npm test
npm run test:e2e
npm run test:perf
```

Playwright è una dipendenza di sviluppo versionata. I test E2E avviano una preview della build, verificano regressioni, condivisione e sincronizzazione fra schede, accessibilità da tastiera e layout da 320 a 1440 px. In alternativa al Chromium scaricato, impostare `PLAYWRIGHT_CHANNEL=chrome` per un Chrome già installato. In PowerShell: `$env:PLAYWRIGHT_CHANNEL='chrome'`.

`npm run test:perf` misura digitazione e DOM con CPU rallentata 6× e viewport 390×844. È una diagnosi riproducibile, non un punteggio INP reale. Report e trace sono in `playwright-report/` e `test-results/` (non versionati). La CI esegue unit test, build ed E2E.

I filtri numerici da URL sono limitati al dominio e riordinati quando invertiti. Il colore interseca l'intervallo SRM di stile, su un dominio completo 1–40. Le categorie attive sono rimovibili dal riepilogo; il filtro stili è ricercabile per nome e codice.

Il ritorno alle liste conserva query e posizione durante la navigazione nella stessa sessione dell'app. Il cambio pagina porta il focus al contenuto. Il confronto si sincronizza fra schede aperte; un link condiviso importa una fotografia degli ID, validati e deduplicati (massimo cinque). Il link generato dal pannello Condividi riflette sempre la selezione corrente.

Le definizioni di ABV, IBU, SRM, OG e FG sono disponibili accanto ai numeri. Le relazioni fra approfondimenti e BJCP sono esplicitamente presentate come stili correlati, senza scegliere arbitrariamente un unico codice.

Il catalogo mostra 60 birre alla volta. «Mostra altre» aggiunge il gruppo successivo e porta il focus alla prima nuova voce; tornando dalla scheda resta visibile quanto già caricato. Ricerca, conteggi e CSV riguardano sempre tutte le birre corrispondenti.


## Template Amarena & burro

La homepage pubblica usa il template Amarena & burro con logo coordinato, bicchieri SVG e microanimazioni rispettose del movimento ridotto. La versione precedente resta disponibile in `/original.html`. In sviluppo `/pop.html` permette il confronto fra le nove palette. `npm run build` genera entrambe le pagine pubbliche; il laboratorio cromatico non entra nella build.
