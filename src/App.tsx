import { useCallback, useEffect, useMemo, useState } from 'react';
import { BeerGlass } from './ui/BeerGlass';
import { CatalogFilters, ActiveCatalogFilters } from './ui/CatalogFilters';
import { StyleFilters, ActiveStyleFilters } from './ui/StyleFilters';
import { CatalogView } from './ui/CatalogView';
import { BeerPage } from './ui/BeerPage';
import { DeepDiveList, DeepDivePage } from './ui/DeepDives';
import { StyleGuide } from './ui/StyleGuide';
import { CompareView } from './ui/CompareView';
import { SearchBar } from './ui/SearchBar';
import { useCompare } from './lib/compare';
import { speciesOf } from './lib/beer';
import {
  EMPTY_STYLE_QUERY, countStyleFilters, fromStyleSearch, searchStyles, toStyleSearch,
} from './lib/styleFilter';
import type { StyleQuery } from './lib/styleFilter';
import {
  ALL_BEERS, STYLES, EMPTY_CATALOG, countActiveFilters, fromCatalogSearch, searchBeers,
  toCatalogSearch, beerOf, type CatalogQuery,
} from './lib/catalog';

// ─────────────────────────────────────────────────────────────────────────────
// Router minimale su hash: i filtri stanno nell'URL, quindi una ricerca è
// condivisibile.
//   #/                        i 116 stili BJCP (homepage)
//   #/?fam=Lager&abv=8-        stili filtrati
//   #/birre                   catalogo delle birre citate dal BJCP
//   #/birre?q=stout&stile=15B catalogo filtrato
//   #/b/pilsner-urquell       scheda di una birra BJCP
//   #/confronta               confronto 2–5 stili
//   #/approfondimenti         le 30 schede curate
//   #/a/saison-dupont         scheda di approfondimento
// ─────────────────────────────────────────────────────────────────────────────

type Route =
  | { name: 'styles' }
  | { name: 'catalog' }
  | { name: 'beer'; id: string }
  | { name: 'compare' }
  | { name: 'deep' }
  | { name: 'deepDetail'; id: string };

function parseHash(): { route: Route; search: string } {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, search = ''] = raw.split('?');
  if (path.startsWith('/b/')) return { route: { name: 'beer', id: decodeURIComponent(path.slice(3)) }, search };
  if (path.startsWith('/a/')) return { route: { name: 'deepDetail', id: decodeURIComponent(path.slice(3)) }, search };
  if (path === '/birre') return { route: { name: 'catalog' }, search };
  if (path === '/confronta') return { route: { name: 'compare' }, search };
  if (path === '/approfondimenti') return { route: { name: 'deep' }, search };
  // «/» e «/stili» sono la stessa pagina: la guida agli stili è l'homepage.
  return { route: { name: 'styles' }, search };
}

export default function App() {
  const [hash, setHash] = useState(() => location.hash || '#/');
  const [query, setQuery] = useState<CatalogQuery>(() => fromCatalogSearch(parseHash().search));
  const [styleQuery, setStyleQuery] = useState<StyleQuery>(() => fromStyleSearch(parseHash().search));
  const [styleFocus, setStyleFocus] = useState<string | null>(null);
  const [searchDraft, setSearchDraft] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(() => window.innerWidth > 1080);
  const [styleFiltersOpen, setStyleFiltersOpen] = useState(() => window.innerWidth > 1080);

  useEffect(() => {
    const onHash = () => {
      setHash(location.hash || '#/');
      window.scrollTo({ top: 0 });
      const parsed = parseHash();
      // Arrivando da fuori (es. «tutte le birre dello stile 3B») i filtri
      // vanno riletti dall'URL, altrimenti resterebbero quelli di prima.
      if (parsed.route.name === 'catalog') setQuery(fromCatalogSearch(parsed.search));
      if (parsed.route.name === 'styles') setStyleQuery(fromStyleSearch(parsed.search));
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const { route } = useMemo(() => parseHash(), [hash]);

  // I filtri modificano l'URL senza aggiungere voci alla cronologia.
  useEffect(() => {
    if (route.name !== 'catalog') return;
    const next = `#/birre${toCatalogSearch(query)}`;
    if (next !== (location.hash || '#/')) history.replaceState(null, '', next);
  }, [query, route.name]);

  useEffect(() => {
    if (route.name !== 'styles') return;
    const next = `#/${toStyleSearch(styleQuery)}`;
    if (next !== (location.hash || '#/')) history.replaceState(null, '', next);
  }, [styleQuery, route.name]);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const go = useCallback((path: string) => { location.hash = path; }, []);
  const openBeer = useCallback((id: string) => go(`/b/${encodeURIComponent(id)}`), [go]);
  const openDeepDive = useCallback((id: string) => go(`/a/${encodeURIComponent(id)}`), [go]);
  const openStyle = useCallback((code: string) => go(`/birre?stile=${encodeURIComponent(code)}`), [go]);

  // Salta a uno stile preciso dalla ricerca globale, azzerando i filtri così
  // la card è sicuramente visibile.
  const openStyleFocus = useCallback((id: string) => {
    setStyleQuery({ ...EMPTY_STYLE_QUERY });
    setStyleFocus(id);
    if (route.name !== 'styles') go('/');
  }, [route.name, go]);
  const clearStyleFocus = useCallback(() => setStyleFocus(null), []);

  const results = useMemo(() => searchBeers(query), [query]);
  const activeCount = countActiveFilters(query);
  const styleResults = useMemo(() => searchStyles(styleQuery), [styleQuery]);
  const styleActiveCount = countStyleFilters(styleQuery);

  // Scorciatoia "/" per la ricerca in navbar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'SELECT') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('.topsearch input')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Il campo di ricerca segue la sezione: birre nel catalogo, stili nella guida,
  // e altrove tiene l'ultima parola scritta.
  const searchValue = route.name === 'catalog'
    ? query.text
    : route.name === 'styles'
      ? styleQuery.text
      : searchDraft;

  const onSearch = useCallback((v: string) => {
    setSearchDraft(v);
    if (route.name === 'catalog') setQuery((q) => ({ ...q, text: v }));
    else if (route.name === 'styles') setStyleQuery((q) => ({ ...q, text: v }));
  }, [route.name]);

  const submitSearch = useCallback((v: string) => {
    const next: CatalogQuery = route.name === 'catalog'
      ? { ...query, text: v }
      : { ...EMPTY_CATALOG, text: v };
    setQuery(next);
    go(`/birre${toCatalogSearch(next)}`);
  }, [route.name, query, go]);

  const beer = route.name === 'beer' ? beerOf(route.id) : undefined;
  const deep = route.name === 'deepDetail' ? speciesOf(route.id) : undefined;

  return (
    <div className="app">
      <Header
        route={route}
        onNavigate={go}
        searchValue={searchValue}
        onSearch={onSearch}
        onSubmitSearch={submitSearch}
        onOpenBeer={openBeer}
        onOpenStyle={openStyleFocus}
      />

      <main className="main">
        {route.name === 'catalog' && (
          <div className="layout">
            <div className={`sidebar ${filtersOpen ? 'open' : 'closed'}`}>
              <button className="filters-toggle" onClick={() => setFiltersOpen((v) => !v)}>
                {filtersOpen ? '▾ Nascondi i filtri' : '▸ Filtri'}
                {activeCount > 0 && <span className="badge">{activeCount}</span>}
              </button>
              <CatalogFilters query={query} onChange={setQuery} resultCount={results.length} />
            </div>
            <div className="content">
              <ActiveCatalogFilters query={query} onChange={setQuery} />
              {activeCount === 0 && (
                <div className="intro">
                  <h1>Le birre che il BJCP cita, tutte insieme</h1>
                  <p>
                    {ALL_BEERS.length} birre commerciali, ognuna legata allo stile che le
                    linee guida BJCP 2021 le attribuiscono. Cerca dalla barra in alto, filtra
                    per categoria, famiglia, stile e intervallo di gradazione, amarezza o colore.
                  </p>
                  <p className="dim">
                    Il BJCP non descrive le singole birre: descrive gli stili. Ogni scheda lo
                    dice in chiaro e mostra i numeri <b>dello stile</b>, non della bottiglia.
                    Per partire dal documento, apri <b>Stili</b>.
                  </p>
                </div>
              )}
              <CatalogView beers={results} onOpen={openBeer} />
            </div>
          </div>
        )}

        {route.name === 'beer' && (
          beer
            ? (
              <div className="layout single">
                <div className="content">
                  <BeerPage beer={beer} onOpen={openBeer} onOpenStyle={openStyle} onBack={() => go('/birre')} />
                </div>
              </div>
            )
            : <NotFound label="Questa birra non è fra quelle citate dal BJCP." onHome={() => go('/birre')} />
        )}

        {route.name === 'styles' && (
          <div className="layout">
            <div className={`sidebar ${styleFiltersOpen ? 'open' : 'closed'}`}>
              <button className="filters-toggle" onClick={() => setStyleFiltersOpen((v) => !v)}>
                {styleFiltersOpen ? '▾ Nascondi i filtri' : '▸ Filtri'}
                {styleActiveCount > 0 && <span className="badge">{styleActiveCount}</span>}
              </button>
              <StyleFilters query={styleQuery} onChange={setStyleQuery} resultCount={styleResults.length} />
            </div>
            <div className="content">
              <ActiveStyleFilters query={styleQuery} onChange={setStyleQuery} />
              <StyleGuide
                query={styleQuery}
                onOpenBeer={openDeepDive}
                onOpenStyle={openStyle}
                focusId={styleFocus}
                onFocusHandled={clearStyleFocus}
              />
            </div>
          </div>
        )}

        {route.name === 'compare' && <CompareView onGoStyles={() => go('/')} />}

        {route.name === 'deep' && <DeepDiveList onOpen={openDeepDive} />}

        {route.name === 'deepDetail' && (
          deep
            ? (
              <div className="layout single">
                <div className="content">
                  <DeepDivePage species={deep} onOpenStyle={openStyle} onBack={() => go('/approfondimenti')} />
                </div>
              </div>
            )
            : <NotFound label="Questa scheda di approfondimento non esiste." onHome={() => go('/approfondimenti')} />
        )}
      </main>

      <Footer />
    </div>
  );
}

function Header({
  route, onNavigate, searchValue, onSearch, onSubmitSearch, onOpenBeer, onOpenStyle,
}: {
  route: Route;
  onNavigate: (p: string) => void;
  searchValue: string;
  onSearch: (v: string) => void;
  onSubmitSearch: (v: string) => void;
  onOpenBeer: (id: string) => void;
  onOpenStyle: (id: string) => void;
}) {
  const isCatalog = route.name === 'catalog' || route.name === 'beer';
  const isDeep = route.name === 'deep' || route.name === 'deepDetail';
  const compareCount = useCompare().length;
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onNavigate('/')}>
        <BeerGlass srm={9} level={1} shape="tulipano" size={20} />
        <span>EduBeer</span>
      </button>

      <SearchBar
        value={searchValue}
        onChange={onSearch}
        onSubmit={onSubmitSearch}
        onOpenBeer={onOpenBeer}
        onOpenStyle={onOpenStyle}
      />

      <nav>
        <button className={`nav ${route.name === 'styles' ? 'on' : ''}`} onClick={() => onNavigate('/')}>Stili</button>
        <button className={`nav ${route.name === 'compare' ? 'on' : ''}`} onClick={() => onNavigate('/confronta')}>
          Confronta
          {compareCount > 0 && <span className="nav-badge">{compareCount}</span>}
        </button>
        <button className={`nav ${isCatalog ? 'on' : ''}`} onClick={() => onNavigate('/birre')}>Birre</button>
        <button className={`nav ${isDeep ? 'on' : ''}`} onClick={() => onNavigate('/approfondimenti')}>Approfondimenti</button>
      </nav>
    </header>
  );
}

function NotFound({ label, onHome }: { label: string; onHome: () => void }) {
  return (
    <div className="empty">
      <h2>Scheda non trovata</h2>
      <p className="dim">{label}</p>
      <button className="big" onClick={onHome}>Torna indietro</button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>
        {ALL_BEERS.length} birre citate · {STYLES.length} stili BJCP 2021 · 30 approfondimenti
      </span>
      <span className="dim">
        Le schede degli stili sono le linee guida BJCP; gli approfondimenti sono scritti per
        essere difendibili davanti a un birraio.
      </span>
    </footer>
  );
}
