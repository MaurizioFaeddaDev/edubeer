# Esito degli interventi — 7 novembre 2026

Riferimento: `audit-2026-11-07.md`. Gli interventi conservano il design Atlante e i dataset generati. Nessun deploy o commit automatico.

## Copertura

| Punto dell'audit | Intervento |
|---|---|
| Filtro colore incoerente | Catalogo e atlante usano entrambi l'intersezione con l'intervallo `color` |
| Dominio SRM incompleto | Minimo e massimo derivati dagli estremi: 1–40 |
| Categorie nascoste | Chip rimovibili in entrambe le sezioni |
| Intervalli URL invalidi | Parser condiviso: fallback, clamp, ordinamento degli estremi |
| Perdita di contesto | Ritorno a query e posizione; ricerca approfondimenti nell'URL; mantenimento dei gruppi già mostrati |
| Focus dopo navigazione | Focus su `main`, senza spostare il focus durante i filtri |
| Confronto fra schede | Evento storage, validazione e deduplicazione degli ID |
| Provenienza | Modello per metrica e fonte visibile; valori importati esplicitamente da verificare |
| Associazioni BJCP | Tutti gli stili correlati, senza sceglierne arbitrariamente uno |
| Glossario | Definizioni accessibili tramite details/summary nelle superfici numeriche |
| Condivisione | Link con ID, importazione al posto della selezione locale, copia e fallback selezionabile |
| Filtro stili | MultiSelect ricercabile per nome/codice, nomi accessibili specifici |
| Prestazioni | Profilo CPU 6×; catalogo a gruppi di 60 e riuso dei risultati dell'atlante |
| Test | Playwright locale e CI, regressioni di dominio e browser |
| Backlog | Indice aggiornato, specifiche visuali precedenti marcate come storiche |
| Mobile | Spaziatura iniziale ridotta e target touch conservati |

## Misura prestazionale

Chrome headless locale, build di produzione, viewport 390×844, CPU rallentata 6×. Cinque input sintetici: `p`, `pi`, `pil`, `pils`, campo vuoto. Il tempo è misurato nel browser dall'evento al secondo animation frame; non comprende la scansione dei locator Playwright e non è INP di utenti reali.

| Misura | Prima dei gruppi da 60 | Dopo |
|---|---:|---:|
| Elementi DOM iniziali | 20.726 | 2.184 |
| `p` | 675 ms | 281 ms |
| `pi` | 601 ms | 208 ms |
| `pil` | 288 ms | 243 ms |
| `pils` | 111 ms | 95 ms |
| Campo vuoto | 1.790 ms | 249 ms |
| Mediana del ciclo | 601 ms | 243 ms |

La baseline proviene dal primo ciclo completo di una sessione poi interrotta; la verifica finale esegue un ciclo e termina correttamente. Sono campioni diagnostici, non un benchmark statistico. Il DOM iniziale scende di circa l'89%. Il collo di bottiglia di rendering è affrontato senza alterare ricerca, conteggio o CSV: l'esportazione include tutti i risultati, anche quelli non ancora mostrati.

Il caricamento differito del corpus BJCP resta distinto: modificare il generatore e la distribuzione dei dati richiede una misura del trasferimento iniziale. I chunk attuali migliorano il caching, non eliminano il download iniziale; non viene presentato come lazy loading.

## Fonti editoriali

Il corpus non contiene fonti primarie puntuali per i valori delle 30 birre. È stato rimosso il claim generico di verifica. `src/lib/provenance.ts` supporta dato dichiarato, stima documentata, dato da verificare e dato assente, con fonte/URL, variante e data per le informazioni documentate. La data di importazione è distinta dalla verifica. Non sono state inventate fonti o ricerche esterne non eseguite.

## Verifica

- Test di dominio: 121 passati, inclusa parità SRM ai bordi degli intervalli del corpus.
- Profilo prestazionale finale: passato.
- Aggiornamenti compatibili: Vite 6.4.5, Vitest 4.1.12 e dipendenze transitive; `npm audit fix` riporta zero vulnerabilità.
- Detector Impeccable: nessuna segnalazione primaria; restano le 10 indicazioni consultive del sistema tipografico/raggi già presenti nell'audit iniziale.
- Suite E2E finale: 9 test passati. Controlli responsive rinforzati per escludere falsi positivi da pagine non trovate e rieseguiti a 1440, 1024, 390 e 320 px. CSV verificato: 614 righe con intestazione anche quando sono montate soltanto 60 schede.

Limiti: non eseguiti test su telefono fisico, sessione screen reader o Safari/Firefox. La workflow CI è configurata, ma non è stata lanciata su GitHub e il sito non è stato pubblicato.

Controllo visuale concluso sulle nuove schermate: atlante mobile, confronto desktop e approfondimento con provenienza mobile. Nessun clipping o overflow nelle viewport controllate. Gli screenshot della suite sono disponibili localmente in `test-results/`.
