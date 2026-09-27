# Ticket T-001 — Traduzione italiana dei testi ufficiali BJCP

- **id**: T-001
- **tipo**: feat
- **stato**: open
- **priorità**: P2 (backlog)
- **complessità**: L — non sprint-ready; da spezzare per categoria prima di entrare in uno sprint (regola dei 6 step)
- **dipendenze**: fonte dati esterna: traduzione italiana revisionata delle sezioni BJCP (da definire con il CEO) + verifica della licenza BJCP per opera derivata

## User story

Come lettrice/lettore italiano di edubeer, voglio leggere i testi ufficiali BJCP
(aroma, aspetto, sapore, corpo, commenti, storia, confronto, ingredienti) in italiano,
per capire lo stile senza sforzo, mantenendo l'originale inglese come riferimento.

## Acceptance criteria

- [ ] Il ticket è spezzato in ticket-figli S/M, uno per categoria BJCP (34 categorie),
      prima di entrare in qualsiasi sprint
- [ ] La licenza BJCP è verificata per opera derivata e l'esito è registrato in questo file
- [ ] La fonte della traduzione (revisionata) è approvata dal CEO prima dell'ingresso in sprint
- [ ] Per ogni categoria tradotta: la vista mostra l'italiano con l'originale inglese
      accessibile (i giudici valutano con l'inglese)
- [ ] I testi ufficiali inglesi restano verbatim nelle fonti generate (nessuna modifica a mano
      a `src/data/bjcp.ts` / `bjcp-beers.ts`): le traduzioni vivono in un layer separato
- [ ] `npm run build` passa in verde e la suite di test di T-003 resta verde

## Note

- "Centinaia di sezioni" (dal README): per questo è L e va spezzata. Ordine
  proposto di spezzatura: una categoria BJCP per ticket-figlio.
- MANIFESTO §1: mai inventare — la traduzione non può aggiungere contenuti che il
  documento BJCP non contiene.
- Skill di progetto: app e contenuti in italiano, testi ufficiali BJCP verbatim in inglese.

## Registro

- 2025-12 — aperto da PO (da README "Non fatto"); PM materializza il ticket.
- 2025-12 — decisione PO: L, P2, non sprint-ready finché non spezzata per categoria;
  dipendenze fonte/traduzione revisionata e licenza da verificare.
