# Ticket T-010 — Confronto, grafici SVG e tabelle neubrutalism (+ chiusura debito hex)

- **id**: T-010
- **tipo**: feat / refactor / design
- **stato**: done
- **priorità**: P1
- **complessità**: M
- **dipendenze**: T-006 (token v2); in sprint-neo si esegue **dopo**
  T-007/T-008/T-009, così che l'epic si chiude in un colpo solo

## User story

Come utente che confronta stili, voglio grafici e tabelle in tema con il resto
dell'app, così che la sezione più densa di dati resti leggibile restando
coerente col neubrutalism — e senza più hex scritti a mano nei TSX.

## Acceptance criteria

- [ ] Confronto, grafici SVG (radar, barre, range) e tabelle tecnica ridisegnati
      nel tema chiaro "neo-paper", solo token
- [ ] **Chiusura debito hex nei TSX**: zero letterali colore a mano nei
      componenti; ogni colore passa da token del set v2 (se manca una variabile
      per serie, si aggiunge al set aziendale, mai locale)
- [ ] `STYLE_COLORS` → mappata su `var(--series-1..5)` (niente hex costanti)
- [ ] Radar: pattern tratteggiato coerente col nuovo tema; tick centrale in
      colore ink (`--foreground`)
- [ ] **SRM resta un dato intoccabile**: la scala dei colori-malto non si
      ridefinisce per estetica — è dato sorgente (MANIFESTO §1); si rifanno
      cornice, assi, etichette e contrasto del theme, non la scala
- [ ] `npm test` e `npm run build` verdi (i test su `lib/color.ts` e sul
      confronto restano verdi)
- [ ] Screenshot pagina confronto (2 stili selezionati) e tabella tecnica in
      desktop (1280×900) e mobile (390×844), uno alla volta (amdgpu)

## Note

- Unico ticket che tocca `ui/charts/`: i grafici SVG restano scritti a mano
  (regola aziendale, nessuna libreria di charts).
- Qui la grafica è agganciata al dato (SRM), quindi si cambiano presentazione
  e contorno, non semantica dei colori.

## Registro

- 2026-10-24 — aperto su decisione CEO; PM materializza nel sprint-neo dopo il
  blocco T-007/T-008/T-009.
- 2026-10-24 — done: implementato e verificato: hex rimossi dai TSX, `STYLE_COLORS` → `var(--series-*)`, dash radar, tacca media con alone; build+test verdi.
