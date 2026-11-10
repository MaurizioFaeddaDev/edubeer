> Stato aggiornato: su richiesta dell�utente, Amarena & burro viene promossa a homepage pubblica. La build include `index.html` (nuovo template) e `original.html` (versione precedente). `pop.html` resta il laboratorio locale con il selettore delle palette. Le indicazioni sotto che descrivono la proposta come non pubblicata documentano le fasi precedenti e sono superate da questa decisione.

# Proposta locale EduBeer pop/punk

## Template scelto — 10 novembre 2026

L’utente ha scelto **Amarena & burro** come base del redesign. `/pop.html` apre questa palette per impostazione predefinita; i link con `?palette=...` mantengono disponibili le alternative per confronto.

Approvati la direzione visiva dell’apertura della homepage e il logo grande coordinato: fondo burro #fff5d6, amarena #7b193d, giallo #f5ba42 e malva #e4aed0. Logo di riferimento: `output/branding/edubeer-pop-amarena.png`.

**Non considerare approvata l’applicazione attuale dei colori a tutti i componenti.** L’utente non è soddisfatto delle card e della sezione Birre. La prossima fase, rinviata, riguarda card, catalogo, componenti condivisi e sottopagine dove necessario. Ipotesi da valutare: superfici più neutre, amarena per gerarchia e azioni, accenti più misurati; preservare apertura, contenuti e funzionalità. Non estendere automaticamente le campiture della hero alle viste dense di dati.

La scelta del template non autorizza una pubblicazione: il sito attuale resta conservato e la proposta separata. Questa decisione supera le raccomandazioni esplorative nella ricerca palette.

Aprire `/pop.html` sul server Vite (`npm run dev`). `/` conserva la versione attuale. La proposta non è inclusa negli entry point della build di produzione e non è stata pubblicata. Per una futura distribuzione della proposta servirà una scelta esplicita di packaging.

## Direzione iniziale dell’esplorazione

Homepage alternativa richiesta per confrontare il nuovo linguaggio con il sito attuale. Fondo crema #fff7e3, viola #591477, giallo #ffd13c, corallo #ff785f. Apertura da poster con il logo fornito, bordi marcati e un solo sticker; schede più sobrie, dati in colonne e fonte BJCP esplicita. Archivo locale pesante per titoli, Source Sans 3 per testi e dati. L’eccezione Archivo Pop al controllo tipografico è intenzionale e registrata: non cambia la tipografia della versione attuale.

Scelta implementativa: entry point separato che riusa App e i componenti esistenti, con due proprietà opzionali. Evita una copia divergente delle funzioni e dei dati. CSS e logo si caricano solo dall’entry point pop; nessuna dipendenza aggiunta, nessun servizio remoto o analytics nella proposta. La palette della proposta è intenzionalmente chiara; il selettore tema resta nella versione attuale.

## Funzioni e contenuti

Tutti i 116 stili restano consultabili. Le schede introduttive German Pils (5D), American IPA (21A) e Saison (25B) leggono direttamente i dati del progetto; confronto condiviso con l’atlante. Ricerca introduttiva sugli stili e ricerca globale esistente, filtri, URL persistenti, dettagli, catalogo ed esportazioni riutilizzano i componenti originali.

## Verifiche

- Build TypeScript/Vite e 125 test esistenti passati.
- Chrome: ricerca German Pils, persistenza al reload, confronto 5D/21A, filtro Lager e reload, nessun errore JavaScript.
- Nessun overflow orizzontale a 320, 390 e 768 px; controllo visivo desktop a 1440 px e mobile a 390 px.
- Movimento ridotto rispettato dalle animazioni esistenti e dalle nuove transizioni/scroll. Etichette esplicite, focus visibile e controlli semantici.
- Homepage originale verificata senza introduzione pop.
- Screenshot in `output/pop-preview/`; script di controllo locale `.tmp/check-pop.cjs`.

La verifica è funzionale e visiva, non una certificazione completa di accessibilità. Il PNG originale del logo pesa circa 1,3 MB: per l’eventuale estensione in produzione conviene esportarlo in un formato web più compatto mantenendo il master.

## Varianti colore
Il selettore di pop.html include Originale, Pistacchio & inchiostro, Rosa elettrico, Azzurro & pomodoro. La scelta viene conservata nel parametro URL palette e seleziona il logo coordinato. Il file originale resta conservato; le tre varianti cromatiche sono salvate in output/branding/edubeer-pop-{palette}.png. Verificati cambio palette, reload, assenza di overflow a 320 px e contrasto almeno 4,5:1 per testo primario sul fondo, testo secondario sulle schede e testo sugli accenti. Screenshot palette-*.png in output/pop-preview. Nessuna pubblicazione.


## Seconda esplorazione cromatica
Aggiunte Malto & petrolio, Amarena & burro, Cacao & menta, Lavanda & oliva e Fanzine agrumata, tutte con loghi coordinati. Nove palette totali. Ricerca, fonti, motivazioni e compromessi in [palette-research.md](palette-research.md). Build e verifiche delle otto alternative superate, inclusi caricamento immagini, reload, nove combinazioni di contrasto e overflow mobile.


## Applicazione del template — 10 novembre 2026

Su richiesta dell’utente, il template Amarena & burro è ora applicato ai componenti e alle sottopagine della proposta locale. Questa implementazione è da valutare visivamente: non equivale ad approvazione delle nuove card da parte dell’utente.

- Apertura e logo conservano il trattamento approvato.
- Card introduttive con fondi crema uniformi, senza campiture malva/verdi per famiglia; bicchieri completi e dati leggibili.
- Atlante e catalogo usano superfici carta, bordi discreti e selezioni amarena; descrizioni e dati hanno un inchiostro bruno neutro.
- Filtri, pulsanti, chip e ricerca mantengono gli stessi comportamenti e stati espliciti.
- Dettagli stile/birra, approfondimenti, tabelle e confronti adottano pannelli coerenti; valori e colori SRM non vengono alterati.
- Selettore delle palette raccolto in un pannello richiudibile, inizialmente chiuso.

Implementazione dedicata in `src/amarena.css`, caricata solo dall’entry point pop e limitata alla palette amarena. Il sito corrente e le altre esplorazioni cromatiche restano disponibili. Nessuna pubblicazione.

Validazione: build riuscita, 125 test unitari passati, controlli Chrome su ricerca e persistenza, filtri, paginazione, dettagli, confronto e radar; 18 combinazioni pagina/larghezza (320, 390, 768 px) senza overflow. Immagini in `output/amarena-template/`; controllo funzionale `.tmp/check-amarena.cjs` e `.tmp/check-pop.cjs`.
