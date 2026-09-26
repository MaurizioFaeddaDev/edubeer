import { useEffect, useMemo } from 'react';
import { BeerGlass } from './BeerGlass';
import { BJCP_TO_APP } from '../data/bjcp';
import type { BjcpStyle } from '../data/bjcp';
import { CATEGORIES, STYLES, beersOfStyle as bjcpBeers } from '../lib/catalog';
import { countStyleFilters, searchStyles } from '../lib/styleFilter';
import type { StyleQuery } from '../lib/styleFilter';
import { beersOfStyle as curatedOfStyle } from '../lib/beer';
import { MAX_COMPARE, MIN_COMPARE, toggleCompare, useCompare } from '../lib/compare';
import type { BeerSpecies } from '../data/types';

// ─────────────────────────────────────────────────────────────────────────────
// Guida agli stili: tutti i 116 stili BJCP 2021, raggruppati per categoria
// ufficiale, con i dati vitali. Ogni stile rimanda alle birre che il BJCP cita
// per esso e, se ne ha, alle schede di approfondimento dell'archivio.
// È la sezione principale: si può filtrare per famiglia, categoria, numeri e
// testo (dalla ricerca in navbar).
// ─────────────────────────────────────────────────────────────────────────────

/** Gli approfondimenti dell'archivio che appartengono a uno stile BJCP. */
function curatedFor(st: BjcpStyle): BeerSpecies[] {
  const apps = BJCP_TO_APP.get(st.code) ?? [];
  return apps.flatMap((a) => curatedOfStyle(a));
}

export function StyleGuide({
  query, onOpenBeer, onOpenStyle, focusId, onFocusHandled,
}: {
  query: StyleQuery;
  /** Apre una scheda di approfondimento (birra curata). */
  onOpenBeer: (id: string) => void;
  /** Filtra l'enciclopedia su uno stile BJCP. */
  onOpenStyle: (code: string) => void;
  /** Stile da mettere a fuoco arrivando dalla ricerca globale. */
  focusId?: string | null;
  /** Segnala che lo stile a fuoco è stato raggiunto. */
  onFocusHandled?: () => void;
}) {
  const filtered = useMemo(() => searchStyles(query), [query]);
  const active = countStyleFilters(query);
  // Con l'ordinamento ufficiale la guida resta raggruppata per categoria; con
  // gli altri ordinamenti diventa un'unica griglia, altrimenti il criterio
  // resterebbe invisibile dentro ogni sezione.
  const grouped = query.sort === 'code';

  const sections = useMemo(
    () => CATEGORIES
      .map((c) => ({ cat: c, styles: filtered.filter((s) => s.categoryId === c.id) }))
      .filter((g) => g.styles.length > 0),
    [filtered],
  );

  // Arrivando da un suggerimento della navbar, porta la card in vista.
  useEffect(() => {
    if (!focusId) return;
    document.getElementById(`bjcp-${focusId}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    onFocusHandled?.();
  }, [focusId, filtered, onFocusHandled]);

  return (
    <div className="guide">
      <header className="guide-head">
        <h1>Gli stili</h1>
        <p className="lede">
          Uno stile non è un'etichetta commerciale: è un insieme di attese condivise. Dire
          «questa è una pilsner» significa che qualcuno può contraddirti su basi verificabili.
        </p>
        <p className="lede">
          Qui ci sono i {STYLES.length} stili delle linee guida BJCP 2021, in{' '}
          {CATEGORIES.length} categorie. La BJCP è il linguaggio comune dei giudici: se un
          birraio dice «è fuori stile», sta citando questo documento.
        </p>
        <p className="guide-count">
          <b>{filtered.length}</b> {filtered.length === 1 ? 'stile' : 'stili'}
          {active > 0 ? ' con i filtri attivi' : ' in ordine ufficiale'}
        </p>
        <CompareHint />
      </header>

      {grouped && sections.length > 0 && (
        <nav className="style-index" aria-label="Salta a una categoria">
          {sections.map(({ cat }) => (
            <button
              key={`${cat.id}-${cat.name}`}
              className="chip"
              onClick={() => document.getElementById(`bjcp-cat-${cat.id}-${cat.name}`)?.scrollIntoView({ block: 'start' })}
            >
              {cat.id !== 'X' ? `${cat.id} · ` : ''}{cat.name}
            </button>
          ))}
        </nav>
      )}

      {filtered.length === 0 ? (
        <div className="empty">
          <h2>Nessuno stile con questi filtri</h2>
          <p className="dim">
            I BJCP 2021 sono {STYLES.length}: se il filtro non trova niente, è il filtro a
            essere troppo stretto. Prova ad allargare un intervallo o a togliere una famiglia.
          </p>
        </div>
      ) : grouped ? (
        <div className="bjcp-list">
          {sections.map(({ cat, styles }) => (
            <section className="bjcp-category" key={`${cat.id}-${cat.name}`} id={`bjcp-cat-${cat.id}-${cat.name}`}>
              <header>
                <span className="bjcp-cat-id">{cat.id}</span>
                <h3>{cat.name}</h3>
                <span className="dim">· {styles.length} {styles.length === 1 ? 'stile' : 'stili'}</span>
              </header>
              <div className="bjcp-grid">
                {styles.map((st) => (
                  <StyleCard key={st.id} style={st} onOpenBeer={onOpenBeer} onOpenStyle={onOpenStyle} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="bjcp-grid">
          {filtered.map((st) => (
            <StyleCard key={st.id} style={st} onOpenBeer={onOpenBeer} onOpenStyle={onOpenStyle} />
          ))}
        </div>
      )}
    </div>
  );
}

/** La card di un singolo stile: numeri, sintesi, confronto e collegamenti. */
function StyleCard({
  style: st, onOpenBeer, onOpenStyle,
}: {
  style: BjcpStyle;
  onOpenBeer: (id: string) => void;
  onOpenStyle: (code: string) => void;
}) {
  const count = bjcpBeers(st.id).length;
  const curated = curatedFor(st);
  return (
    <article className="bjcp-style" id={`bjcp-${st.id}`}>
      <header>
        <code className="bjcp-code">{st.code}</code>
        <h4>{st.name}</h4>
      </header>
      <div className="bjcp-meta">
        <span className="style-family">{st.family}</span>
        {st.abv && <span>{st.abv[0]}–{st.abv[1]}% ABV</span>}
        {st.ibu && <span>{st.ibu[0]}–{st.ibu[1]} IBU</span>}
        {st.color && <span>SRM {st.color[0]}–{st.color[1]}</span>}
      </div>
      <p>{st.blurb}</p>
      <div className="bjcp-actions">
        <CompareButton styleId={st.id} />
        {count > 0 && (
          <button className="chip bjcp-more" onClick={() => onOpenStyle(st.id)}>
            {count} {count === 1 ? 'birra citata' : 'birre citate'} dal BJCP
          </button>
        )}
      </div>
      {curated.length > 0 && (
        <div className="bjcp-have">
          <span className="dim">Approfondimenti in archivio</span>
          <div className="style-beers">
            {curated.map((s) => (
              <button key={s.id} className="style-beer" onClick={() => onOpenBeer(s.id)}>
                <BeerGlass srm={s.srm} level={1} shape="tulipano" size={30} />
                <span>{s.name}</span>
                <span className="dim">{s.abv}% · {s.ibu} IBU · {s.country}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

/** Invito a usare il confronto, con il conteggio corrente del carrello. */
function CompareHint() {
  const ids = useCompare();
  return (
    <p className="lede">
      Aggiungi da {MIN_COMPARE} a {MAX_COMPARE} stili con «＋ Confronta» su ogni card, poi
      aprili nella sezione <b>Confronta</b> del menu.
      {ids.length > 0 && <b> Nel carrello: {ids.length}/{MAX_COMPARE}.</b>}
    </p>
  );
}

/** Toggle del carrello sulla singola card di stile. */
function CompareButton({ styleId }: { styleId: string }) {
  const ids = useCompare();
  const on = ids.includes(styleId);
  const full = ids.length >= MAX_COMPARE;
  const disabled = !on && full;
  return (
    <button
      className={`chip compare-toggle ${on ? 'on' : ''}`}
      disabled={disabled}
      onClick={() => toggleCompare(styleId)}
      aria-pressed={on}
      title={disabled ? `Massimo ${MAX_COMPARE} stili nel confronto` : on ? 'Rimuovi dal confronto' : 'Aggiungi al confronto'}
    >
      {on ? '✓ Nel confronto' : '＋ Confronta'}
    </button>
  );
}
