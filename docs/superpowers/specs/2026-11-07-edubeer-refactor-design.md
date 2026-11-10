# EduBeer: atlante da esplorare, confronto da degustazione

Stato: approvato dall'utente il 7 novembre 2026 con autorizzazione a iniziare lo sviluppo. Direzione A con il confronto di B. Revisione preliminare: nessuna questione sostanziale aperta.

## Intento

Trasformare EduBeer in una web app professionale e riconoscibile per appassionati curiosi, utile anche ai degustatori. Favorire tre compiti: trovare uno stile, capirne le caratteristiche, confrontarlo con altri. L'identità nasce dalla consultazione della birra: bicchieri, colori SRM e intervalli documentati.

## Obiettivi e limiti

- Riprogettare tutte le superfici esistenti e i relativi stati, non soltanto l'homepage.
- Conservare corpus, precisione delle fonti, ricerca, filtri, ordinamenti, CSV, URL condivisibili e selezione di confronto persistente.
- Dare agli stili una destinazione leggibile e collegabile direttamente.
- Offrire sintesi immediata e approfondimento tecnico senza imporre due modalità d'uso separate.
- Conservare React, TypeScript e Vite e l'hosting statico esistente. Nessun backend, account, pagamento, valutazione o diario di degustazione in questa fase.
- Nessuna nuova tassonomia presentata come ufficiale, nessuna traduzione integrale automatica del BJCP e nessun nuovo dato commerciale sulle birre.
- Non pubblicare automaticamente. Il risultato sarà verificabile nel checkout locale.

## Approcci considerati

1. **Atlante da esplorare (A):** composizione ariosa, bicchieri, descrizioni e dati essenziali. Più accogliente, meno denso.
2. **Atlante da degustazione (B):** tabelle, filtri e grafici allineati. Più rapido per lo studio, meno invitante per una prima esplorazione.
3. **Scelta dell'utente:** A per l'app e B per Confronta. Il confronto usa la stessa identità di A, aumentando la densità dove serve; non introduce un secondo tema.

## Identità proposta

- Fondo porcellana `#FAFCFC`, superficie bianca `#FFFFFF`, testo bruno `#302922`, testo secondario `#605A54`, accento petrolio `#175A63`, superficie di selezione `#E6F0F1`. I confini dei controlli hanno un token distinto dai divisori decorativi. Valori da validare per contrasto nelle coppie effettivamente utilizzate.
- Titoli in una serif umanista leggibile, testo e controlli in sans umanista; proposta tecnica Source Serif 4 e Source Sans 3, self-hosted con licenze. La famiglia finale, i pesi e gli eventuali subset sono scelte implementative equivalenti per carattere e leggibilità.
- Numeri tabulari nelle tabelle e nei confronti, senza impiegare il monospace come decorazione.
- Nessun fondo millimetrato, bordo nero spesso, ombra dura o accumulo di badge. Divisori discreti, selezione petrolio, angoli contenuti sui controlli.
- Colori della birra come informazione SRM, non come scala di qualità. Gli eventuali colori di serie distinguono gli stili nei grafici e sono accompagnati da etichette.
- Riutilizzare e raffinare i bicchieri SVG esistenti: forme coerenti, colore calcolato, nessuna foto o asset generato necessario al funzionamento. La scelta del bicchiere è illustrativa, non una prescrizione BJCP. Non ricopiare i bicchieri fotografici delle anteprime.
- Le anteprime fissano gerarchia e atmosfera, non ogni pixel. Dati, testo ufficiale e geometrie reali prevalgono sulle immagini generate.

## Struttura e navigazione

Header comune con marchio EduBeer, Stili, Birre, Confronta, Approfondimenti e ricerca. Segnalazione discreta del numero di stili selezionati per il confronto. Link reali per navigare, pulsanti per modificare stato, stato attivo e focus riconoscibili.

Mantenere le route hash esistenti `#/`, `#/birre`, `#/b/:id`, `#/confronta`, `#/approfondimenti`, `#/a/:id` e i parametri esistenti. Aggiungere `#/stili/:id` per le schede degli stili; mantenere `#/stili` come alias dell'indice. Riutilizzare gli ID del corpus, compresi quelli storici. Aprire uno stile dalla ricerca porterà alla sua scheda. La navigazione torna compatibile con indietro/avanti; i filtri non aggiungono una voce di cronologia per ogni battuta.

## Stili: esplorazione

Introduzione breve, famiglie e risultati facilmente visibili. Conservare categorie e ordinamento ufficiale e tutti gli ordinamenti alternativi. La vista principale presenta voci ariose, non 116 schede piene di testo ufficiale. Ogni voce include bicchiere, codice, nome, sintesi italiana, ABV/IBU/colore e azione Confronta separata dal link allo stile.

Su desktop ampio, una selezione può essere letta in un pannello affiancato con URL della scheda; l'apertura diretta dello stesso URL deve rendere la scheda completa. Questa presentazione affiancata è facoltativa: priorità a un percorso affidabile indice → scheda, senza comprimere filtri e testo in tre colonne strette. Il builder sceglierà il breakpoint e se implementarla, mantenendo l'atmosfera di A.

Filtri avanzati raggruppati e ripiegabili; famiglie non duplicate in comandi divergenti. Risultati e filtri attivi sempre comprensibili. A zero risultati, spiegazione breve e azione per azzerare i filtri.

Schema indicativo desktop:

```text
EduBeer   Stili  Birre  Confronta  Approfondimenti     Cerca
Gli stili della birra                         116 risultati
Famiglie                          Ordina / Filtri / CSV
Bicchiere | Nome dello stile | sintesi | intervalli | Confronta
Bicchiere | Nome dello stile | sintesi | intervalli | Confronta
```

## Scheda stile

Nome ufficiale, codice e famiglia; sintesi italiana esistente; bicchiere illustrativo; ABV, IBU e SRM come intervalli. Scale colore con unità e range espliciti. Nessun valore inventato quando il corpus contiene null.

Testo ufficiale accessibile per Aroma, Aspetto, Sapore, Corpo, Commenti, Storia, Confronto e Ingredienti. Etichette italiane e lingua inglese del testo dichiarata; non trasformare descrizioni qualitative in punteggi numerici. OG e FG raccolti nei dettagli tecnici. Collegamenti alle birre citate e agli approfondimenti disponibili. Azione di confronto e ritorno alla guida.

## Confronta: precisione di B

Conservare selezione di 2–5 stili in localStorage e limite esistente, ordinamento, rimozione e azzeramento. Con zero o uno stile mostrare istruzioni contestuali e ritorno alla guida. Il builder può aggiungere ricerca di stili direttamente nel confronto riutilizzando la logica esistente, senza introdurre un secondo motore di filtro.

Le barre min–max per ABV, IBU e SRM diventano il primo strumento di lettura, con scale comuni per metrica, valori esatti visibili anche senza hover e legenda associata ai nomi. Tacca centrale denominata punto medio dell'intervallo: non valore misurato o media di birre commerciali. La tabella conserva ABV, IBU, SRM, OG e FG. Radar esistente conservato come vista secondaria ripiegabile, con metrica e normalizzazione spiegate; non presentarlo come profilo sensoriale.

Su telefono, grafici in colonna con etichette complete; tabella con scorrimento contenuto, senza far scorrere l'intera pagina lateralmente. Nessun grafico ritagliato o illeggibile a cinque stili.

## Birre e approfondimenti

Catalogo Birre con medesima grammatica visiva, filtri e ordinamento esistenti. Ogni intervallo è etichettato come dato dello stile, anche nei risultati sintetici. La scheda birra evidenzia che è un esempio citato e rimanda alla scheda stile. Preservare informazioni e collegamenti attuali evitando la duplicazione non necessaria dei lunghi testi.

Approfondimenti con indice ricercabile, identità editoriale di A e pagine con storia, origine, abbinamento e nota presenti nel corpus. Questi dati sono della singola birra. Nessuna fotografia di bottiglia, testimonianza o claim commerciale inventato.

## Mobile, accessibilità e stati

Desktop, tablet e telefono costituiscono lo stesso prodotto. Header e navigazione vanno a capo senza sovrapporsi; ricerca accessibile e senza doppioni. Filtri in sezione espandibile in flusso su schermi stretti. Schede in colonna, testo lungo con misura controllata e niente altezze fisse che tagliano contenuto.

Focus visibile, uso completo da tastiera, label, stato selezionato esplicito e target touch adeguati. Contrasto AA: 4,5:1 per testo normale, 3:1 per testo grande e segnali grafici essenziali. Colore mai unico veicolo di significato. Movimento ridotto rispettato; nessun contenuto nascosto in attesa di animazioni.

Verificare ricerca con risultati e vuota, filtri attivi e azzerati, nomi lunghi, valori mancanti, scheda inesistente, confronto vuoto/parziale/pieno, selezione al limite, menu e filtri aperti/chiusi. Non simulare spinner per dati già locali.

## Refactor tecnico

Creare token locali autonomi in `src/tokens.css`, componenti condivisi per intervalli, azioni, titoli, note di fonte e schede. Riscrivere i CSS del tema rimuovendo le regole sostituite, evitando uno strato di override sopra il brutalismo. Suddividere il coordinamento di navigazione e le viste dove migliora la chiarezza, preservando le librerie di dominio esistenti.

Rimuovere il comando `sync-tokens` e lo script che sovrascriverebbero la nuova identità con maistru-craft; aggiornare README, metadati e documentazione del design. Conservare gli script relativi al corpus. Aggiornare i test dei token al nuovo contratto semantico e alle coppie effettivamente utilizzate, mantenendo le verifiche di contrasto. Non modificare i dataset generati.

## Verifica e completamento

- `npm test` e `npm run build` devono passare.
- Test mirati per nuove route o logica non banale; conservare verifiche di filtri, CSV e confronto.
- Percorsi reali: ricerca → scheda stile → birre citate → scheda birra; selezione di 2 e 5 stili → confronto → rimozione; filtri → URL → ricarica; approfondimenti → scheda → stile.
- Verifica visiva e funzionale a 1440, 1024 e 390 px, controllo overflow a 320 px; tastiera e riduzione movimento. Acquisire e osservare le schermate delle viste principali.
- Revisione indipendente del risultato e documentazione dei token finali in DESIGN.md e relativo formato previsto dalla skill di design.
- Nessuna pubblicazione automatica; riferire chiaramente eventuali limiti di verifica.

## Decisioni affidate al builder

Breakpoints, misure e spaziatura; scelta definitiva dei font coerenti con la proposta e loro caricamento locale; struttura dei file e componenti; presentazione affiancata della scheda quando lo spazio lo consente; dettagli di focus, ordinamento degli elementi mobile e animazioni funzionali. Sono vincolanti pubblico, direzione A+B, accuratezza, funzioni conservate e accessibilità.
