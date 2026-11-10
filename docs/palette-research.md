# EduBeer — ricerca palette e cinque nuove direzioni

**Decisione finale, 10 novembre 2026:** l’utente ha scelto **Amarena & burro** come template. Approvate apertura e logo della homepage; card, catalogo e sottopagine restano da rifinire. Le raccomandazioni sotto documentano la fase esplorativa e non sostituiscono questa scelta. Vedi [decisione e prossima fase](pop-proposal.md).

Ricerca del 10 novembre 2026. Le cinque combinazioni sono proposte originali per EduBeer: i riferimenti indicano principi utili, non palette da copiare. I nomi evocano ingredienti o registri grafici, non descrivono categorie scientifiche degli stili.

## Riferimenti verificati

### Mikkeller — beer, colore e illustrazione

Il [brand book ufficiale](https://www.mikkeller.com/brand-book-external) distingue colori principali per testo e fondi da colori secondari per accenti. Pubblica, fra gli altri, Evening Blue #0f0f54, Moss Green #357c4f, Paper #eee5d2, Burgundy #882c29, Peach #f0b7ad e Yellow #f5e14b. Raccomanda il lettering disegnato solo nei titoli e con misura. La [pagina sull’arte](https://www.mikkeller.com/art) spiega il ruolo delle illustrazioni nell’identità del marchio.

Applicazione a EduBeer: un colore scuro riconoscibile sostiene testo e navigazione; le tinte chiare e vivaci danno personalità a logo e campiture. I colori dell’interfaccia non devono cambiare il significato della scala SRM dei bicchieri nelle schede.

### Graza — food, accessibilità del linguaggio

Il [case study di Gander](https://takeagander.com/project/graza) descrive un’identità informale che unisce illustrazioni e spiegazioni dei termini dell’olio. Nell’ispezione del [sito](https://www.graza.co/) ho rilevato nei colori CSS campionati un verde oliva scuro #3c422e, una crema rosata #f6e6d9 e un fondo più chiaro #fff4ec; l’apertura presenta anche un accento giallo-verde. Questi sono colori osservati nella pagina, non una specifica ufficiale completa del brand.

Applicazione: colori legati agli ingredienti possono comunicare competenza senza sembrare austeri. È uno spunto per Lavanda & oliva e Cacao & menta, con accostamenti deliberatamente diversi da Graza.

### MOLD — magazine food e gerarchia editoriale

La [pagina attuale](https://thisismold.com/) usa un impianto molto essenziale in bianco e nero e comunica la cessazione delle pubblicazioni nel giugno 2025 e la transizione all’archivio. Il [case study dello studio House of 207](https://houseof207.com/mold-magazine/) documenta il redesign editoriale del 2022, una griglia modulare e l’attenzione alla lettura mobile per il pubblico proveniente dai social.

Applicazione: il riferimento utile è la priorità dei contenuti. Da qui Fanzine agrumata: carta e inchiostro per leggere, arancio e azzurro per gli elementi di identità. È una nostra interpretazione, non la palette di MOLD.

### DEYA — verifica con limite

Il [sito ufficiale](https://www.deyabrewing.com/) è stato consultato, ma l’apertura è coperta da verifica dell’età e consenso cookie. Il campionamento della UI restituisce soprattutto bianco e grigi: non lo considero una palette rappresentativa né lo uso per giustificare i nuovi colori. Le schermate di ricerca sono in `output/palette-research/`.

## Cinque proposte

| Palette | Fondo | Colore principale | Accenti | Perché ha senso | Compromesso |
| --- | --- | --- | --- | --- | --- |
| Malto & petrolio | #fff2d5 | #00545b | #ffbc47, #f8a08f | Ambra e crema richiamano malto e schiuma; il petrolio introduce una nota fresca e sostiene i dati | Meno punk di Rosa elettrico, più equilibrata |
| Amarena & burro | #fff5d6 | #7b193d | #f5ba42, #e4aed0 | Tono caldo, alimentare ed editoriale; bordeaux leggibile e vicino al mondo delle fermentazioni e dei frutti rossi | Può ricordare il vino se il calice e i contenuti birrari perdono presenza |
| Cacao & menta | #fff0e5 | #4e2b25 | #f8a657, #acdcca | Tostature e note aromatiche, con il contrasto fresco della menta | Più morbida; può evocare caffetteria o cioccolato |
| Lavanda & oliva | #f0eafa | #444d23 | #dbdf71, #f5ad91 | Il verde botanico incontra un fondo insolito: curiosità e sperimentazione senza tinte fluorescenti dominanti | La meno immediatamente birraria: utile se cerchiamo originalità |
| Fanzine agrumata | #f5f1e9 | #252839 | #ffab63, #a6c9f5 | Carta e inchiostro per un atlante da leggere, arancio per energia e associazioni agrumate | Meno distintiva nel solo colore principale; dipende da logo e accenti |

## Raccomandazione

La mia scelta per equilibrio è **Malto & petrolio**. Metterei in finale anche **Originale** per continuità con Instagram e **Lavanda & oliva** per originalità. **Rosa elettrico** resta la candidata più pop. Questa è una valutazione progettuale, non un risultato di test con utenti.

## Implementazione e controllo

Nove palette complessive nel selettore locale di `/pop.html`, tutte con logo coordinato e URL persistente. Le cinque nuove immagini sono varianti generate a partire dal master originale, conservato; non sono una conversione vettoriale con equivalenza geometrica certificata.

Palette applicate a UI, titoli, schede e logo. I colori informativi dei bicchieri continuano a dipendere dai valori SRM del catalogo, non dalla palette. Nessuna dipendenza nuova e nessuna modifica pubblicata. Si carica l’immagine della palette selezionata, non tutte le immagini insieme.

Verifica completata con esito positivo sulle combinazioni testo/fondo e testo/accenti con soglia 4,5:1, caricamento del logo, selezione e reload, overflow a 320 px e controllo visivo desktop. Build TypeScript/Vite superata. Report di esecuzione: `.tmp/check-palettes.cjs`; anteprime: `output/pop-preview/`.
