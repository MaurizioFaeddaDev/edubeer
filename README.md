# EduBeer

Enciclopedia consultabile delle birre. Il catalogo segue il **documento ufficiale BJCP
2021**: **116 stili** (107 numerati + 9 storici della categoria 27) in 34 categorie, e le
**613 birre commerciali** che il BJCP cita come esempi di quegli stili. Il **focus è sugli
stili** — la guida ai 116 stili è l'homepage e ha filtri propri — mentre le birre
citate stanno in un catalogo a parte. In più, una sezione **Confronta** che mette fianco a
fianco da 2 a 5 stili su tutti i numeri dichiarati (ABV, IBU, colore, OG, FG), e una sezione
separata di **Approfondimenti** con 30 birre che hanno una scheda scritta a mano — storia,
origine, abbinamento gastronomico, nota da esperto.

La **ricerca sta in navbar** e vale per tutta l'app: mentre scrivi filtra la lista che hai
davanti (birre o stili) e apre un elenco di scorciatoie raggruppate da cui saltare a una
scheda; Invio cerca la parola nel catalogo delle birre.

Niente assi sensoriali, niente punteggi, niente sblocchi: qui si consulta.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # bundle statico in dist/ — nessuna dipendenza runtime oltre a React
```

---

## Le sezioni

### 1. Stili

I 116 stili BJCP 2021, raggruppati per categoria ufficiale, con i dati vitali (ABV, IBU, OG,
FG, SRM) e una rilettura italiana. Si filtrano per famiglia
(Lager / Ale / Trappista / Fermentazione spontanea / Speciale), categoria e intervallo di
gradazione, amarezza o colore, con gli stessi ordinamenti del catalogo; con un ordinamento
diverso da «Codice BJCP» la guida passa a un'unica griglia, così il criterio resta visibile.
Da ogni stile si arriva alle birre che il BJCP cita per esso e agli approfondimenti collegati.

### 2. Confronta

Da 2 a 5 stili messi fianco a fianco. Un radar a cinque assi (ABV, IBU, SRM, OG, FG)
dà la forma complessiva, tre grafici a barre orizzontali mostrano l'intervallo
[min–max] di ABV, IBU e colore (con la tinta SRM reale), e una tabella riporta i
numeri esatti. Gli stili si aggiungono dalle card della sezione Stili con «＋ Confronta»;
la selezione vive in `localStorage` e sopravvive alla navigazione.

### 3. Birre

Tutte le birre citate dal BJCP 2021. La ricerca testuale è in navbar; qui restano i filtri
per categoria, famiglia, stile e intervallo di gradazione, amarezza o colore.

Il punto delicato: **il BJCP non descrive le singole birre**. Di «Pilsner Urquell» il BJCP
dice solo che è un esempio dello stile *3B Czech Premium Pale Lager*. Non ne dichiara ABV,
IBU, né profilo. Quindi ogni scheda mostra i numeri e i testi **dello stile**, e lo dichiara
in chiaro: nessun dato per-birra viene inventato. Un filtro «ABV ≥ 8%» mostra le birre il cui
stile *tocca* quella gradazione, non le birre che hanno davvero 8 gradi.

### 4. Approfondimenti

Le uniche 30 birre con dati verificati **birra per birra**: storia reale e datata, origine,
abbinamento gastronomico, nota da esperto. Sono il corpus che EduBeer condivide con il gioco
BIRRAMON — Rosso Malto, tenuto qui in una sezione separata proprio perché risponde a un'altra
domanda: non «che stile è?» ma «cosa devo sapere su questa bottiglia?».

---

## Da dove vengono i dati

**Stili e birre BJCP** (`src/data/bjcp.ts`, `src/data/bjcp-beers.ts`) sono generati dal
**documento ufficiale** `2021_Guidelines_Beer_1.25.docx`:

```bash
python3 scripts/gen-bjcp-docx.py [percorso.docx]
```

Perché il `.docx` e non un JSON di terze parti: il primo dataset usato
(`hopalyzer/bjcp-2021.json`) si è rivelato **incompleto** — mancavano la categoria 27
(9 stili storici) e la 33 (Wood Beer, 2 stili), e alcuni nomi erano sbagliati. Il documento
ufficiale è la fonte di verità; il parser legge un campo per paragrafo.

I blurb in italiano degli stili sono scritti a mano in `scripts/bjcp_blurbs.py` (chiave =
codice ufficiale o, per gli stili storici non numerati, il nome). I testi ufficiali (aroma,
aspetto, sapore, corpo, commenti, storia, confronto, ingredienti) sono riportati **verbatim in
inglese**, perché è il documento con cui i giudici valutano.

**Gli approfondimenti** (30 birre) sono sincronizzati dal gioco BIRRAMON:

```bash
npm run sync-data                          # cerca ../birramon
node scripts/sync-data.mjs ~/Progetti/birramon
```

Lo script copia `types.ts`, `styles.ts`, `beers.ts` e scrive `src/data/source.json` con
percorso e data dell'ultima sincronizzazione.

---

## Struttura

```
src/
  data/
    types.ts         modello di dominio (specie, stili, profili)   ← da birramon
    styles.ts        i 27 stili dell'archivio degli approfondimenti ← da birramon
    beers.ts         le 30 birre con storia, origine, abbinamento   ← da birramon
    source.json      manifesto della sincronizzazione               ← da birramon
    bjcp.ts          i 116 stili BJCP 2021, testi e dati vitali     ← dal docx ufficiale
    bjcp-beers.ts    le 613 birre citate dal BJCP                   ← dal docx ufficiale
  lib/
    catalog.ts       enciclopedia BJCP: filtri, ricerca, ordinamenti, URL
    styleFilter.ts   filtri della guida agli stili: query, ordinamenti, URL
    compare.ts       carrello del confronto (2–5 stili) e metriche, persistito
    beer.ts          derivate degli approfondimenti
    color.ts         SRM → colore
  ui/
    BeerGlass.tsx    bicchiere SVG riempito col colore SRM reale
    SearchBar.tsx       ricerca globale in navbar, con suggerimenti raggruppati
    CatalogFilters.tsx  pannello filtri del catalogo (e filtri attivi condivisi)
    CatalogView.tsx     griglia delle birre BJCP
    BeerPage.tsx        scheda di una birra BJCP (testi dello stile)
    StyleFilters.tsx    pannello filtri della guida agli stili
    StyleGuide.tsx      i 116 stili, per categoria (con «＋ Confronta» su ogni card)
    CompareView.tsx     sezione Confronta: radar, barre [min–max], tabella
    DeepDives.tsx       elenco e scheda degli approfondimenti
    charts/             SVG custom: RangeBarChart, RadarChart, useSize (nessuna dipendenza)
  App.tsx            router su hash
scripts/
  gen-bjcp-docx.py       genera bjcp.ts e bjcp-beers.ts dal docx BJCP
  bjcp_blurbs.py         i blurb italiani degli stili (scritti a mano)
  sync-data.mjs          sincronizza gli approfondimenti da birramon
```

Nessun backend: tutto il corpus è compilato nel bundle, quindi il sito è un insieme di file
statici servibili da qualsiasi parte.

### Router

```
#/                                  i 116 stili BJCP (homepage)
#/?fam=Lager&abv=8-14               guida agli stili filtrata
#/birre                             catalogo delle birre
#/birre?q=stout&stile=15B&abv=8-14  catalogo filtrato
#/b/pilsner-urquell                 scheda di una birra BJCP
#/confronta                         confronto fra 2–5 stili
#/approfondimenti                   le 30 schede curate
#/a/saison-dupont                   scheda di approfondimento
```

Gli stili storici non hanno un codice a lettera nel documento BJCP (sono «27. Historical
Beer: Kellerbier»): nel data model hanno un `id` univoco (`27-kellerbier`) e il codice
mostrato resta `27`.

---

## Deploy

Su Vercel, progetto dedicato, dominio di produzione <https://edubeer.com>. Il progetto
nasce da quello che ospitava Hopalyzer: il source è stato ripuntato su questo repo e il
preset è tornato **Vite**. Questo è il motivo per cui `vercel.json` esiste ed è esplicito —
`framework: "vite"`, `outputDirectory: "dist"` — invece di affidarsi all'auto-detection,
che sul progetto ereditava il preset Next.js.

Il routing è su **hash** (`#/birre`, `#/confronta`), quindi il sito è un singolo
`index.html` con asset: **nessun rewrite SPA** è necessario né configurato.

---

## Stato e prossimi passi

**Fatto:** guida ai 116 stili in 34 categorie come homepage, con ricerca in navbar
e filtri per famiglia, categoria e intervalli ABV/IBU/SRM; catalogo di 613 birre BJCP con
filtri per categoria, famiglia, stile e intervalli ABV/IBU/SRM, ordinamenti e URL condivisibili;
scheda birra con i testi ufficiali dello stile; ricerca globale in navbar con suggerimenti
gruppati (stili e birre); sezione Confronta (2–5 stili) con radar, grafici a barre [min–max] e
tabella riepilogativa, tutta in SVG custom senza nuove dipendenze; sezione Approfondimenti con
30 schede scritte a mano; layout mobile con filtri richiudibili.

**Non fatto:**

- I testi ufficiali BJCP nella scheda sono in inglese: una traduzione italiana sarebbe il
  prossimo miglioramento di sostanza, ma sono centinaia di sezioni.
- Nessuna indicazione di *quanto* una birra reale si discosti dallo stile: il BJCP non lo
  dice, e non si inventa.
- Esportazione (CSV) delle selezioni filtrate.
- Nessun test automatico. La logica in `lib/catalog.ts` è pura e testabile con poco.
- Il bundle supera i 500 KB raw (testi BJCP): si può ridurre caricando le sezioni estese
  solo nella scheda (code-splitting).
