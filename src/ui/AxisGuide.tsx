import { AXES, AXIS_IT, AXIS_DESC } from '../data/types';
import type { Axis, BeerSpecies } from '../data/types';
import { BeerGlass } from './BeerGlass';
import { axisDistribution, exemplarsOf, styleOf, ALL, STYLE_LIST, beersOfStyle } from '../lib/beer';
import { intensityWord } from '../lib/color';
import { DESCRIPTORS } from '../data/descriptors';

// ─────────────────────────────────────────────────────────────────────────────
// Guida ai nove assi. È la parte più utile di tutta l'enciclopedia: spiega
// dove si sbaglia, che è diverso da spiegare cosa è un asse.
// ─────────────────────────────────────────────────────────────────────────────

interface Guide {
  /** Perché quell'asse è difficile da riconoscere. */
  mistake: string;
  /** Come si riconosce in pratica. */
  detect: string;
  /** Cosa lo allena. */
  train: string;
}

const GUIDES: Record<Axis, Guide> = {
  malt: {
    mistake: 'Confondere la maltosità con la dolcezza. Il pane tostato e la crosta non sono zucchero: un malto Vienna dà mollica, non caramello.',
    detect: 'Cercalo a bocca chiusa, prima di ingoiare: è la sensazione di "grano" che resta sotto tutto il resto. Nei casi estremi (Doppelbock) diventa quasi un sapore di mollica calda.',
    train: 'Beccati due lager chiare di pari gradazione ma con malti diversi: una con malto Pilsner, una con Monaco. La differenza è tutta lì.',
  },
  hop: {
    mistake: 'Usare "luppolato" come sinonimo di "amaro". Sono due cose indipendenti: la NEIPA è luppolatissima e poco amara, la Bitter inglese è poco luppolata e discretamente amara.',
    detect: 'È naso, non bocca. Agrumato e tropicale vengono dai tioli e dai terpeni; resinoso e pinoso dai luppoli "C" americani; erbaceo e speziato dai continentali.',
    train: 'Assaggia una IPA e una NEIPA una dopo l\'altra. Stesso luppolo, amaro completamente diverso: è la dimostrazione che aroma e amarezza sono due assi.',
  },
  roast: {
    mistake: 'Due errori in uno: confondere "tostato" con "bruciato" (il primo è caffè e cacao, il secondo è cenere e gomma, ed è un difetto) e dedurre dall\'oscurità che la birra sia amara o pesante.',
    detect: 'È la nota più facile di tutte, si sente al primo sorso. Il difficile è graduarla: cacao amaro sta a 4, la crosta di pane tostato a 2, la cenere è un 5 sbagliato.',
    train: 'Guinness contro Imperial Stout: stessa famiglia di colore, il roast va da 5 a 5 ma il corpo passa da 3 a 5. Serve a separare la tostatura dal peso.',
  },
  yeast: {
    mistake: 'Attribuire al lievito quello che è del luppolo. Banana e chiodi di garofano sono lievito (isoamil acetato e 4-vinilguaiacolo); agrumi e resina sono luppolo. Sbagliare questo è l\'errore più frequente in assoluto.',
    detect: 'I fenoli pizzicano in fondo alla gola e ricordano la spezia; gli esteri sono fruttati e "dolci" al naso. Nelle birre a bassa fermentazione non ci sono quasi mai.',
    train: 'Una Hefeweizen e una Pilsner. La prima ha 5 su questo asse, la seconda 0. Dopo due bicchieri non le confondi più per il resto della vita.',
  },
  sour: {
    mistake: 'Chiamare "acido" l\'amaro o l\'astringenza. E considerare l\'acidità un difetto a prescindere: nei lambic è la definizione dello stile, in una lager è un errore di processo.',
    detect: 'L\'acidità fa salivare e stringe ai lati della lingua. La lattica è tonda e lattiginosa, l\'acetica punge il naso, il funk brett sa di cavallo e cuoio.',
    train: 'Una Berliner Weisse e una gueuze. La prima è acida e pulita, la seconda è acida e selvatica. La differenza fra lattico e Brettanomyces si impara solo così.',
  },
  smoke: {
    mistake: 'Due volte: confondere l\'affumicato di faggio con il torbato (che sa di iodio e medicazione) e credere che le birre scozzesi siano tutte torbate. Quelle con torba vera sono pochissime.',
    detect: 'Se lo senti, è impossibile non sentirlo. La domanda è solo quale legna: faggio dà camino e speck, torba dà cerotto e iodio.',
    train: 'Una Schlenkerla e uno Scotch Ale. La prima è affumicata davvero, il secondo è maltato con una punta di fumo. Il mito cade in due sorsi.',
  },
  sweet: {
    mistake: 'Confondere dolcezza con maltosità e dolcezza con corpo. Una Tripel è dolce e leggera; una Imperial Stout può essere poco dolce e densissima.',
    detect: 'Zucchero vero: caramello, miele, melassa. Dipende dall\'attenuazione, cioè da quanto zucchero il lievito ha lasciato indietro — non dalla quantità di malto usata.',
    train: 'Una Tripel e un Quadrupel dello stesso birrificio: stessa ricetta di base, zuccheri residui diversi. Si sente la dolcezza salire e il corpo seguirla.',
  },
  bitter: {
    mistake: 'Stimare l\'amaro dagli IBU. Conta il rapporto fra amaro e densità finale: una IPA da 60 IBU con finale secco risulta più amara di una da 80 IBU con corpo dolce. E l\'astringenza non è amaro.',
    detect: 'È la sensazione che resta dopo aver ingoiato, sul fondo della lingua. Il finale secco "pulisce", quello dolce "copre".',
    train: 'Una Pilsner e una Bitter inglese, una dopo l\'altra. La prima ha 40 IBU e sembra più amara della seconda che ne ha 32. Il numero non è la sensazione.',
  },
  body: {
    mistake: 'Dedurre il corpo dal colore. La Guinness è nera e leggera, la Doppelbock è chiara e densa. È l\'errore che il gioco fa dire a un NPC, ed è quello che fanno tutti.',
    detect: 'È una questione di peso e viscosità, si misura dalla rapidità con cui la saliva se la porta via. Da "acquoso" a "sciropposo" passando per "vellutato".',
    train: 'Guinness e Salvator. Colori opposti, corpi opposti. Un bicchiere ciascuno e il colore smette per sempre di essere un indizio sul corpo.',
  },
};

export function AxisGuide({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="guide">
      <header className="guide-head">
        <h1>I nove assi</h1>
        <p className="lede">
          Tutto il BirraDex si regge su nove assi sensoriali. Sono le stesse nove dimensioni che un
          degustatore ha in testa quando scrive una scheda — solo che qui sono numeri, e quindi si possono
          filtrare, ordinare e confrontare.
        </p>
        <p className="dim">
          L'ordine non è casuale: i primi cinque assi si misurano col <b>gusto di bocca</b> (dolce, amaro,
          acido, salato, e le sensazioni tattili), i quattro aromatici si misurano col <b>naso</b>. È la stessa
          distinzione su cui si basa il motore di ricerca: puoi filtrare separatamente quello che senti in
          bocca e quello che senti col naso.
        </p>
      </header>

      {AXES.map((a) => {
        const dist = axisDistribution(a);
        const peak = Math.max(1, ...dist);
        const exemplars = exemplarsOf(a, 3);
        const descriptors = DESCRIPTORS.filter((d) => d.axis === a);
        const total = ALL.length;
        return (
          <section className="axis-section" key={a}>
            <header>
              <h2>{AXIS_IT[a]}</h2>
              <p className="axis-desc">{AXIS_DESC[a]}</p>
            </header>

            <div className="axis-dist">
              {dist.map((n, v) => (
                <div className="dist-col" key={v}>
                  <div className="dist-bar-wrap">
                    <i style={{ height: `${(n / peak) * 100}%` }} className={`lv${v}`} />
                  </div>
                  <span className="dist-val">{v}</span>
                  <span className="dist-n">{n}</span>
                  <span className="dist-word">{intensityWord(v)}</span>
                </div>
              ))}
              <p className="dist-note dim">
                Distribuzione sull'archivio: {dist[0]} birre su {total} hanno questo asse {intensityWord(0).toLowerCase()},
                {' '}{dist[5]} {dist[5] === 1 ? 'lo ha' : 'lo hanno'} {intensityWord(5).toLowerCase()}.
              </p>
            </div>

            <div className="axis-grid">
              <div className="axis-cell warn">
                <h3>Dove si sbaglia</h3>
                <p>{GUIDES[a].mistake}</p>
              </div>
              <div className="axis-cell">
                <h3>Come si riconosce</h3>
                <p>{GUIDES[a].detect}</p>
              </div>
              <div className="axis-cell">
                <h3>Come si allena</h3>
                <p>{GUIDES[a].train}</p>
              </div>
            </div>

            <div className="axis-exemplars">
              <h3>Chi lo incarna</h3>
              <div className="exemplar-row">
                {exemplars.map((s) => (
                  <button key={s.id} className="exemplar" onClick={() => onOpen(s.id)}>
                    <BeerGlass srm={s.srm} level={1} shape="tulipano" size={32} />
                    <span className="exemplar-name">{s.name}</span>
                    <span className="exemplar-style">{styleOf(s).name}</span>
                    <span className={`cell lv${s.profile[a]}`}>{s.profile[a]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="axis-descriptors">
              <h3>I descrittori che lo cercano ({descriptors.length})</h3>
              <ul>
                {descriptors.map((d) => (
                  <li key={d.id}>
                    <b>{d.name}</b>
                    <span className="dim"> — potenza {d.power}, precisione {d.accuracy}%</span>
                    <p className="desc-why">{d.why}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function StyleGuide({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="guide">
      <header className="guide-head">
        <h1>Gli stili</h1>
        <p className="lede">
          Uno stile non è un'etichetta commerciale: è un insieme di attese condivise. Dire «questa è una
          pilsner» significa che qualcuno può contraddirti su basi verificabili.
        </p>
      </header>
      <nav className="style-index" aria-label="Salta a uno stile">
        {STYLE_LIST.map((st) => (
          <a key={st.id} href={`#stile-${st.id}`} className="chip">{st.name}</a>
        ))}
      </nav>
      <div className="style-list">
        {STYLE_LIST.map((st) => {
          const beers: BeerSpecies[] = beersOfStyle(st.id);
          return (
            <section className="style-block" key={st.id} id={`stile-${st.id}`}>
              <header>
                <h2>{st.name}</h2>
                <span className="style-family">{st.family}</span>
                {beers.length > 0 && <span className="dim">· {beers.length} in archivio</span>}
              </header>
              <p>{st.blurb}</p>
              {beers.length > 0 && (
                <div className="style-beers">
                  {beers.map((s) => (
                    <button key={s.id} className="style-beer" onClick={() => onOpen(s.id)}>
                      <BeerGlass srm={s.srm} level={1} shape="tulipano" size={30} />
                      <span>{s.name}</span>
                      <span className="dim">{s.abv}% · {s.ibu} IBU · {s.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
