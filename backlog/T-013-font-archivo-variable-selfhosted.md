# Ticket T-013 — Font display Archivo Variable (OFL) self-hosted

- **id**: T-013
- **tipo**: feat
- **stato**: done
- **priorità**: P2 (opzionale dell'epic; può chiudere wontfix)
- **complessità**: S
- **dipendenze**: T-006 (tipografia/brand della shell sono definiti lì; il font è
  un upgrade, non un prerequisito dell'epic)

## User story

Come lettore del titolo e dei numeri dell'app, voglio un font display
**Archivo Variable** self-hosted, così che l'identità neobrutalism sia
riconoscibile anche tipograficamente, senza dipendenze CDN.

## Acceptance criteria

- [ ] Font Archivo Variable, **subset latin**, self-hosted nel progetto
      (nessun CDN, nessuna dipendenza npm — regola «minime dipendenze»)
- [ ] Licenza **SIL OFL** verificata e registrata (file/riga licenza nel repo)
- [ ] `font-display: swap` e fallback dichiarati: il testo resta leggibile
      anche con il fallback attivo
- [ ] Impatto su bundle rispettoso: dimensione del file font riportata in
      ticket; nessun aumento non motivato del bundle
- [ ] **Revertibile in 1 commit**: la modifica è contenuta (font + una regola
      CSS + eventuale @font-face), il commit sta da solo
- [ ] `npm test` e `npm run build` verdi; screenshot `#/` e `#/birre` desktop
      con il font attivo

## Criteri di rigetto (→ wontfix motivato)

Se **una** di queste condizioni non si può rispettare, il ticket passa wontfix
con motivazione scritta:

- la licenza del subset/variante non risulta OFL
- il self-hosting richiede CDN o dipendenze non motivabili
- il peso del file (subset latin compreso) non è accettabile per una pagina
  di dati già a 680 kB raw

## Note

- P2 perché l'epic è mandato anche con la tipografia di T-006 (sistema/fallback):
  Archivo è un upgrade di coerenza, non un prerequisito.
- Si lavora dopo il gate T-011: un font non deve aprire un deploy da solo.

## Registro

- 2026-10-24 — aperto su decisione CEO; PM materializza come extra P2 dell'epic.
- 2026-10-24 — done: implementato: Archivo Variable OFL subset latin 34.9 KB in `src/assets/`, revertibile in un commit; `@font-face` in styles.css.
