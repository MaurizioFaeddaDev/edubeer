# Ticket T-012 — Documentazione restyle neubrutalism

- **id**: T-012
- **tipo**: docs
- **stato**: done
- **priorità**: P2 (dopo il gate T-011)
- **complessità**: S
- **dipendenze**: T-011 (si documenta cosa è online, non cosa è previsto)

## User story

Come collega maistru-craft che arriva su edubeer, voglio la documentazione
allineata al tema chiaro "neo-paper", così che il tema sia il nuovo punto di
partenza e la revoca dell'identità scura sia tracciata ovunque serva.

## Acceptance criteria

- [ ] README di edubeer aggiornato: restyle neubrutalism menzionato come stato
      corrente dell'interfaccia
- [ ] Skill di progetto `.pi/skills/edubeer/SKILL.md` aggiornata: mapping token
      verso il set v2 (i nomi storici `--bg-0/--ink/--amber` non sono più attivi
      nel progetto)
- [ ] `DESIGN.md` v2 nel repo aziendale: metodo d'identità invariato (zone A/B,
      token, contrasto verificato), palette = tema "neo-paper"
- [ ] `PROGETTI.md` aggiornato: nota che il tema neubrutalism vale per edubeer;
      **slow-opinions resta in deroga transitoria documentata** (identità scura
      in attesa di decisione dedicata, non si tocca in questo epic)
- [ ] **Registro della revoca**: decisione CEO del 2026-10-24 con cui l'identità
      editoriale scura è revocata in via definitiva per edubeer (identity =
      metodo, palette = tema)
- [ ] Sezione **cosa NON è fatto**: T-013 con esito aperto (font), slow-opinions in
      deroga, eventuali minori lasciati fuori scope
- [ ] Commit docs separato dal codice (conventional, inglese)

## Note

- Regola aziendale «finire le cose»: il "fatto" del restyle include dichiarare
  cosa non è fatto. Nessun marketing: solo stato.
- Il file decisivo è `DESIGN.md` v2: è la fonte per i prossimi progetti
  (slow-opinions compreso, quando la deroga chiuderà).

## Registro

- 2026-10-24 — aperto su decisione CEO; PM materializza come chiusura dell'epic.
- 2026-10-24 — done: documentazione scritta: DESIGN.md v2, skill edubeer e skill globale, README, PROGETTI.md, costs/log.md.
