import { useCallback, useEffect, useMemo, useState } from 'react';
import { BeerGlass } from './ui/BeerGlass';
import { Filters, ActiveFilters } from './ui/Filters';
import { IndexView } from './ui/IndexView';
import { DetailView } from './ui/DetailView';
import { CompareView } from './ui/CompareView';
import { AxisGuide, StyleGuide } from './ui/AxisGuide';
import { ALL, speciesOf } from './lib/beer';
import { EMPTY_QUERY, fromSearch, search, toParams, queryForSimilar, countActiveFilters, relaxations as computeRelaxations, type Query } from './lib/query';

// ─────────────────────────────────────────────────────────────────────────────
// Router minimale su hash: la ricerca sta nell'URL, quindi è condivisibile.
//   #/                    archivio
//   #/?q=ipa&assi=roast>=4
//   #/b/pilsner-urquell   scheda
//   #/confronta           confronto
//   #/assi                guida ai nove assi
//   #/stili               guida agli stili
// ─────────────────────────────────────────────────────────────────────────────

type Route =
  | { name: 'index' }
  | { name: 'detail'; id: string }
  | { name: 'compare' }
  | { name: 'axes' }
  | { name: 'styles' };

function parseHash(): { route: Route; search: string } {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, search = ''] = raw.split('?');
  if (path.startsWith('/b/')) return { route: { name: 'detail', id: decodeURIComponent(path.slice(3)) }, search };
  if (path === '/confronta') return { route: { name: 'compare' }, search };
  if (path === '/assi') return { route: { name: 'axes' }, search };
  if (path === '/stili') return { route: { name: 'styles' }, search };
  return { route: { name: 'index' }, search };
}

export default function App() {
  const [hash, setHash] = useState(() => location.hash || '#/');
  const [query, setQuery] = useState<Query>(() => fromSearch(parseHash().search));
  const [filtersOpen, setFiltersOpen] = useState(() => window.innerWidth > 1080);
  const [compareIds, setCompareIds] = useState<string[]>(() => {
    const b = new URLSearchParams(parseHash().search).get('b');
    return b ? b.split(',').filter((id) => speciesOf(id)) : [];
  });

  useEffect(() => {
    const onHash = () => setHash(location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const { route } = useMemo(() => parseHash(), [hash]);

  // Quando si cambia filtro, l'URL della vista archivio si aggiorna di conseguenza.
  useEffect(() => {
    if (route.name !== 'index') return;
    const next = `#/${toParams(query)}`;
    if (next !== (location.hash || '#/')) history.replaceState(null, '', next);
  }, [query, route.name]);

  // Una nuova ricerca riparte dall'alto.
  useEffect(() => { window.scrollTo({ top: 0 }); }, [hash]);

  const go = useCallback((path: string) => { location.hash = path; }, []);
  const openBeer = useCallback((id: string) => go(`/b/${encodeURIComponent(id)}`), [go]);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= 6 ? cur : [...cur, id]));
  }, []);

  const results = useMemo(() => search(query), [query]);
  const relaxations = useMemo(() => (results.length ? [] : computeRelaxations(query)), [results.length, query]);

  // Scorciatoia "/" per la ricerca, come in ogni tool che si rispetti.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'SELECT') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('.searchbox input')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const detail = route.name === 'detail' ? speciesOf(route.id) : null;

  return (
    <div className="app">
      <Header route={route} onNavigate={go} />

      <main className="main">
        {route.name === 'index' && (
          <div className="layout">
            <div className={`sidebar ${filtersOpen ? 'open' : 'closed'}`}>
              <button className="filters-toggle" onClick={() => setFiltersOpen((v) => !v)}>
                {filtersOpen ? '▾ Nascondi i filtri' : '▸ Filtri'}
                {countActiveFilters(query) > 0 && <span className="badge">{countActiveFilters(query)}</span>}
              </button>
              <Filters query={query} onChange={setQuery} resultCount={results.length} />
            </div>
            <div className="content">
              <ActiveFilters query={query} onChange={setQuery} />
              {countActiveFilters(query) === 0 && (
                <div className="intro">
                  <h1>Trenta birre, nove assi, zero sblocchi</h1>
                  <p>
                    Il BirraDex è un archivio consultabile: tutte le schede sono aperte, sempre. Cerca per
                    nome o per storia, filtra per paese e stile, oppure — la parte interessante —{' '}
                    <b>filtra per profilo sensoriale</b>: «tostato ma poco amaro», «acido e dissetante»,
                    «lievito protagonista».
                  </p>
                  <p className="dim">
                    Se non sai da dove cominciare, apri <button className="link" onClick={() => go('/assi')}>i nove assi</button>:
                    spiegano dove si sbaglia, che è più utile di spiegare cosa sono.
                  </p>
                </div>
              )}
              <IndexView
                species={results}
                snippetFor={query.text}
                onOpen={openBeer}
                onCompare={toggleCompare}
                compareIds={compareIds}
                relaxations={relaxations}
                onRelax={(q) => setQuery(q)}
                onReset={() => setQuery({ ...EMPTY_QUERY })}
              />
            </div>
          </div>
        )}

        {route.name === 'detail' && (
          detail
            ? (
              <div className="layout single">
                <div className="content">
                  <DetailView
                    species={detail}
                    onOpen={openBeer}
                    onCompare={(id) => { toggleCompare(id); go('/confronta'); }}
                    onSameProfile={(id) => {
                      const s = speciesOf(id);
                      if (s) { setQuery(queryForSimilar(s)); go('/'); }
                    }}
                  />
                </div>
              </div>
            )
            : <NotFound onHome={() => go('/')} />
        )}

        {route.name === 'compare' && (
          <CompareView
            ids={compareIds}
            onOpen={openBeer}
            onRemove={(id) => setCompareIds((c) => c.filter((x) => x !== id))}
            onClear={() => setCompareIds([])}
            onPick={() => go('/')}
          />
        )}

        {route.name === 'axes' && <AxisGuide onOpen={openBeer} />}
        {route.name === 'styles' && <StyleGuide onOpen={openBeer} />}
      </main>

      {compareIds.length > 0 && route.name !== 'compare' && (
        <CompareTray
          ids={compareIds}
          onRemove={(id) => setCompareIds((c) => c.filter((x) => x !== id))}
          onClear={() => setCompareIds([])}
          onOpen={() => go('/confronta')}
        />
      )}

      <Footer />
    </div>
  );
}

function Header({ route, onNavigate }: { route: Route; onNavigate: (p: string) => void }) {
  const tab = (name: Route['name'], label: string, path: string) => (
    <button className={`nav ${route.name === name ? 'on' : ''}`} onClick={() => onNavigate(path)}>{label}</button>
  );
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onNavigate('/')}>
        <BeerGlass srm={9} level={1} shape="tulipano" size={20} />
        <span>BirraDex</span>
      </button>
      <nav>
        {tab('index', 'Archivio', '/')}
        {tab('axes', 'I nove assi', '/assi')}
        {tab('styles', 'Gli stili', '/stili')}
        {tab('compare', 'Confronto', '/confronta')}
      </nav>
    </header>
  );
}

function CompareTray({
  ids, onRemove, onClear, onOpen,
}: {
  ids: string[]; onRemove: (id: string) => void; onClear: () => void; onOpen: () => void;
}) {
  return (
    <div className="tray">
      <div className="tray-items">
        {ids.map((id) => {
          const s = speciesOf(id);
          if (!s) return null;
          return (
            <button key={id} className="tray-item" onClick={() => onRemove(id)} title="Rimuovi dal confronto">
              <BeerGlass srm={s.srm} level={1} shape="tulipano" size={18} />
              <span>{s.name}</span>
              <em>×</em>
            </button>
          );
        })}
      </div>
      <button className="mini ghost" onClick={onClear}>svuota</button>
      <button className="big" onClick={onOpen} disabled={ids.length < 2}>
        Confronta {ids.length} {ids.length === 1 ? 'birra' : 'birre'}
      </button>
    </div>
  );
}

function NotFound({ onHome }: { onHome: () => void }) {
  return (
    <div className="empty">
      <h2>Scheda non trovata</h2>
      <p className="dim">Questa birra non è nell'archivio.</p>
      <button className="big" onClick={onHome}>Torna all'archivio</button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>
        {ALL.length} birre · 9 assi sensoriali · dati sincronizzati da BIRRAMON — Rosso Malto
      </span>
      <span className="dim">
        Le schede sono scritte per essere difendibili davanti a un birraio. Dove la vulgata è falsa, la
        scheda lo dice.
      </span>
    </footer>
  );
}
