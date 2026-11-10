# T-016 — Correzioni e migliorie dell'audit

- Stato: done
- Priorità: P1
- Origine: `docs/audit-2026-11-07.md`
- Direzione: conservare l'Atlante; correggere logica, accessibilità e tracciabilità.

## Criteri

- [x] SRM per intersezione in entrambi i cataloghi; dominio derivato dagli estremi.
- [x] Parser numerico condiviso, ordinamento e limiti degli intervalli da URL.
- [x] Categorie visibili e rimovibili; filtro stili ricercabile e correttamente nominato.
- [x] Ritorno ai risultati filtrati con posizione e focus coerenti; ricerca approfondimenti nell'URL.
- [x] Confronto sincronizzato fra schede; link condiviso con validazione, deduplicazione e limite di cinque.
- [x] Glossario contestuale con controlli nativi accessibili.
- [x] Provenienza per metrica e stato non verificato esplicito per i dati importati.
- [x] Associazioni editoriali presentate come stili correlati.
- [x] Suite E2E versionata, comando locale e CI; test di regressione di dominio.
- [x] Spaziatura mobile rifinita senza ridurre i target touch.
- [x] Dipendenze di sviluppo corrette con aggiornamenti compatibili, audit npm senza vulnerabilità.
- [x] Misura prestazionale e verifica finale visuale/documentata.

Esito: `docs/audit-implementation-2026-11-07.md`. 121 test di dominio e 9 E2E passati; build riuscita.

Le fonti primarie dei 30 approfondimenti non sono state inventate: il modello espone la mancanza e permette di registrare fonte, variante, stato e data di verifica. La raccolta editoriale delle fonti è distinta dalla correzione dell'app.
