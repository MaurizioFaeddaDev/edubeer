# BirraDex

Enciclopedia consultabile delle birre. Trenta schede complete — storia, origine, ABV/IBU/SRM,
abbinamento gastronomico, nota da esperto — e soprattutto un **profilo sensoriale su nove assi**
che si può cercare, filtrare, ordinare e confrontare.

È il fratello da consultazione di **BIRRAMON — Rosso Malto**: stesso corpus di dati, nessun gioco.
Nel gioco le schede si sbloccano catturando le birre; qui è tutto aperto, sempre, perché
un'enciclopedia che nasconde le voci è un gioco e non un'enciclopedia.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # bundle statico in dist/ — 105 KB gzip, nessuna dipendenza runtime
```

---

## Cosa sa fare che una lista di birre non sa fare

### 1. Filtrare per profilo sensoriale

La ricerca non è solo testuale. Ogni birra è misurata da 0 a 5 su nove assi:

`Maltosità · Luppolo · Tostatura · Lievito · Acidità · Affumicato · Dolcezza · Amaro · Corpo`

Puoi imporre un minimo e un massimo su ciascun asse, e il risultato è una risposta a una domanda
che nessun motore di ricerca normale sa risolvere: *«mostrami le birre tostate che non sono amare»*.

### 2. Ricerche pronte, progettate sui dati reali

Le dieci ricerche pronte non sono decorazione: sono state scelte **dopo aver misurato la
distribuzione effettiva del corpus**. Per esempio:

| Ricerca | Asse | Risultato |
|---|---|---|
| Scuro ma poco amaro | `tostatura ≥ 2`, `amaro ≤ 2` | 5 birre |
| Luppolato ma non amaro | `luppolo ≥ 4`, `amaro ≤ 2` | 1 birra |
| Leggero ma amaro | `corpo ≤ 2`, `amaro ≥ 4` | 3 birre |
| Tostato e dolce | `tostatura ≥ 3`, `dolcezza ≥ 3` | 2 birre |
| Affumicato | `affumicato ≥ 3` | 1 birra |

La prima bozza di queste ricerche conteneva «Tostato ma poco amaro» con `tostatura ≥ 4`,
che sul corpus dà **zero risultati**. Il dato ha corretto il progetto: nel mondo reale la
tostatura porta con sé l'amaro, quindi la ricerca interessante non è «tostato e non amaro»,
è «scuro e non amaro» — che è un fatto vero e smonta lo stereotipo meglio di un'affermazione.

### 3. Dire da dove allargare quando non c'è niente

Quando una ricerca non dà risultati, il tool non si limita a dirlo: per ogni vincolo attivo
calcola quanti risultati otterresti togliendolo, e te li offre in ordine. È il modo onesto di
gestire il vuoto — e in un archivio di trenta voci su nove dimensioni il vuoto è la norma,
non l'eccezione.

### 4. Tabella degli assi

Vista da power user: trenta righe, i nove assi in colonna, ogni cella colorata per intensità.
È il modo più rapido per vedere che «scuro» e «amaro» non sono la stessa cosa — Pilsner Urquell
ha `amaro 4` e `tostatura 0`, Irish Stout ha `tostatura 5` e `amaro 3`.

### 5. Confronto

Da due a sei birre: profili sovrapposti sul radar, matrice di somiglianza a coppie, e una
tabella che mette tutti i valori in colonna con il massimo di ogni riga evidenziato.

La somiglianza è una distanza euclidea sui nove assi corretta dalla differenza di gradazione.
Serve a rispondere alla domanda vera: *«questa mi piace, cos'altro assomiglia?»*.

### 6. I nove assi, spiegati dove si sbaglia

La sezione più utile del sito. Per ogni asse: la distribuzione sull'archivio, **dove si
sbaglia**, come si riconosce, come si allena, e le birre che lo incaricano meglio. Non «cosa
è l'amaro» ma «perché stimare l'amaro dagli IBU è un errore» — che è un'altra cosa.

---

## Il contenuto

Le schede coprono Boemia e Baviera (Plzeň 1842, Hefeweizen, Märzen, Rauchbier, Salvator),
il Belgio (Witbier, Saison Dupont, lambic e gueuze, la scala trappista, Duvel), le isole
britanniche (Bitter, London Porter, Irish Stout, Burton IPA, Barley Wine, Wee Heavy),
l'America (Sierra Nevada Pale Ale, IPA, NEIPA, Double IPA, Imperial Stout, Amber Ale),
l'Italia (Tipopils, Re Ale) e i Paesi Bassi (La Trappe Quadrupel).

Dove la vulgata è falsa, la scheda lo dice — e il BirraDex ha una sezione dedicata a
smontarla:

- **«Scuro = amaro»** → la ricerca pronta mostra cinque controesempi.
- **«Le birre scozzesi sono torbate»** → il Wee Heavy ha `affumicato 2` e la scheda spiega che l'affumicato scozzese era leggero e accidentale, non cercato.
- **«La Guinness è pesante»** → 4,2% ABV, corpo medio-snello, un filo acido di finale.
- **«Bitter = molto amara»** → una Ordinary Bitter sta intorno ai 25 IBU, meno di una pilsner.

---

## Struttura

```
src/
  data/            ⚠ GENERATO — non modificare qui
    types.ts         modello di dominio (assi, profili, specie, stili)
    styles.ts        i 27 stili con descrizione difendibile
    beers.ts         le 30 birre con storia, origine, abbinamento
    descriptors.ts   i 34 descrittori con la spiegazione divulgativa
    source.json      manifesto della sincronizzazione
  lib/
    beer.ts          derivate dal corpus: paesi, famiglie, percentili, similarità
    query.ts         filtri, ricerca testuale, ordinamenti, suggerimenti, URL
    color.ts         SRM → colore, etichette verbali dell'intensità
  ui/
    BeerGlass.tsx    bicchiere SVG riempito col colore SRM reale
    RadarChart.tsx   radar a nove assi + barre del profilo
    Filters.tsx      pannello filtri, ricerche pronte, intervalli doppi
    IndexView.tsx    griglia e tabella degli assi
    DetailView.tsx   la scheda completa
    CompareView.tsx  confronto, matrice di somiglianza, tabella comparativa
    AxisGuide.tsx    guida ai nove assi e agli stili
  App.tsx            router su hash
```

Nessuna dipendenza oltre a React. Nessun backend: il corpus è compilato dentro il bundle, quindi
il sito è un insieme di file statici che si possono servire da qualsiasi parte.

### Router

Tutto lo stato di consultazione vive nell'URL, quindi ogni ricerca è condivisibile:

```
#/                                  archivio
#/?q=ipa&assi=tostatura>=4,amaro<=2
#/b/pilsner-urquell                 scheda
#/confronta?b=rauchbier,gueuze      confronto
#/assi                              guida ai nove assi
#/stili                             guida agli stili
```

Il pulsante **copia link** accanto ai filtri attivi copia l'URL della ricerca corrente.

---

## Sincronizzare i dati dal gioco

La fonte di verità del corpus è il repository di **BIRRAMON**. BirraDex ne copia quattro file,
che sono autosufficienti (importano solo da `./types`):

```bash
npm run sync-data                          # cerca ../birramon
node scripts/sync-data.mjs ~/Progetti/birramon
```

Lo script antepone a ogni file un banner di avvertimento e scrive `src/data/source.json` con
percorso e data dell'ultima sincronizzazione. Se il gioco aggiunge una birra, arriva qui con un
comando — e viceversa, un filtro che non trova niente qui è un'informazione sul gioco.

---

## Stato e prossimi passi

**Fatto:** archivio con ricerca testuale AND su tutti i campi, filtri per famiglia/paese/stile,
intervalli doppi su ABV/IBU/SRM, vincoli su nove assi con istogramma di distribuzione,
dieci ricerche pronte validate sui dati, ordinamenti (incluso per asse singolo e per aderenza
al profilo), stato vuoto con suggerimenti di allargamento, griglia e tabella, scheda completa,
confronto a sei, guide, URL condivisibili, layout mobile con filtri richiudibili.

**Non fatto:**

- Esportazione (CSV, PDF) delle selezioni filtrate.
- Ricerca per abbinamento gastronomico («cosa bevo con le ostriche»): i dati ci sono già,
  manca l'indice dedicato.
- Confronto con intervalli di stile BJCP ufficiali: servirebbe un dataset aggiuntivo.
- Nessun test automatico. La logica in `lib/query.ts` è pura e testabile con poco.
- Il corpus è di trenta voci: ogni preset va rivisto quando cresce.
