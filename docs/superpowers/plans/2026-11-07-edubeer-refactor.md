# Piano di implementazione EduBeer

Specifica approvata: ../specs/2026-11-07-edubeer-refactor-design.md.

Stato: completato. Implementazione, 111 test, build, 32 verifiche browser e documentazione finale conclusi. Revisione indipendente con verdetto `ship` dopo la correzione del contrasto dei segmenti SRM. Sistema finale in DESIGN.md e .impeccable/design.json; esiti dettagliati in docs/refactor-verification.md.

La skill superpowers:writing-plans richiamata dal brainstorming non è installata nei percorsi disponibili; questo piano esplicito ne copre la funzione senza bloccare lo sviluppo autorizzato.

1. Creare token autonomi e font locali, sostituire il CSS del brutalismo e rimuovere la sincronizzazione dei token esterni.
2. Estrarre il parsing delle route, aggiungere schede stile collegabili e componenti condivisi per numeri, confronto e colore.
3. Riprogettare guida, catalogo, approfondimenti e ricerca. Conservare filtri, CSV, URL e dati.
4. Riorganizzare Confronta con intervalli leggibili, tabella precisa e radar secondario.
5. Eseguire test di dominio e nuove route, build e verifica browser dei percorsi a desktop, tablet e mobile.
6. Eseguire rilevazione meccanica, revisione indipendente delle schermate, correggere eventuali problemi e documentare identità e token finali.
