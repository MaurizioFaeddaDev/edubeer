# Ticket T-011 — QA accessibilità + gate deploy epic neubrutalism

- **id**: T-011
- **tipo**: chore / quality
- **stato**: in-progress
- **priorità**: P0 (finale, tiene il deploy)
- **complessità**: S
- **dipendenze**: T-006, T-007, T-008, T-009, T-010 (si verifica l'epic completo)

## User story

Come CEO che approva il deploy, voglio una verifica sistematica di
accessibilità e QA visuale dell'intero restyle, così che il tema chiaro
"neo-paper" vada online solo se il metodo dell'identità regge.

## Acceptance criteria

- [ ] **Matrice screenshot** di tutte le viste toccate (catalogo, stili, schede
      birra/stile/approfondimento, confronto, tabella tecnica) in desktop
      (1280×900) e mobile (390×844), uno alla volta (amdgpu)
- [ ] **Contrasti calcolati** (non a occhio): testo AA ≥ 4.5:1 e confini
      componenti ≥ 3:1 (WCAG 1.4.11) sul tema chiaro; valori riportati in ticket
- [ ] **Keyboard/focus**: percorso completo a tastiera (nav → filtri → card →
      export → confronto), focus visibile nel tema chiaro, nessuna trappola
- [ ] `npm test` e `npm run build` verdi sulla catena intera
- [ ] **OK del CEO** registrato in ticket
- [ ] Deploy su Vercel riuscito + **prova del bundle live** su https://edubeer.com
      (skill `deploy-vercel`): quello che serve è il tema nuovo, non una cache

## Note

- Convenzioni/VERIFICATION.md: screenshot uno alla volta; contrasti calcolati
  con numeri, non stimati.
- Skill di guida: `frontend-verification` per la matrice, `deploy-vercel` per il gate.
- Se un contrasto esce rosso: torna al ticket di sezione (T-007/T-008/T-009/T-010),
  non si patcha qui.

## Registro

- 2026-10-24 — aperto su decisione CEO; gate finale dell'epic. PM materializza.
- 2026-10-24 — QA eseguito: 2 punti corretti (nav 44px, bigspec) + critico BeerGlass del reviewer; build+test verdi, screenshot matrice. Resta il deploy con OK del CEO.
