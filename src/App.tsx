import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { BeerGlass } from './ui/BeerGlass';
import { ThemeSelect } from './ui/ThemeSelect';
import { CatalogFilters, ActiveCatalogFilters } from './ui/CatalogFilters';
import { StyleFilters, ActiveStyleFilters } from './ui/StyleFilters';
import { CatalogView } from './ui/CatalogView';
import { BeerPage } from './ui/BeerPage';
import { DeepDiveList, DeepDivePage } from './ui/DeepDives';
import { StyleGuide } from './ui/StyleGuide';
import { StylePage } from './ui/StylePage';
import { CompareView } from './ui/CompareView';
import { SearchBar } from './ui/SearchBar';
import { ExportCsvButton } from './ui/ExportCsvButton';
import { applyCompareLink, useCompare } from './lib/compare';
import { speciesOf } from './lib/beer';
import { BEER_CSV_FILENAME, beersCsv, STYLE_CSV_FILENAME, stylesCsv } from './lib/csv';
import { countStyleFilters, fromStyleSearch, searchStyles, toStyleSearch } from './lib/styleFilter';
import type { StyleQuery } from './lib/styleFilter';
import { ALL_BEERS, STYLES, EMPTY_CATALOG, countActiveFilters, fromCatalogSearch, searchBeers, toCatalogSearch, beerOf, styleById, type CatalogQuery } from './lib/catalog';
import { parseRoute, styleHref, beerHref } from './lib/routes';

export default function App({ introduction, preview = false }: { introduction?: ReactNode; preview?: boolean } = {}) {
  const [hash, setHash] = useState(() => location.hash || '#/');
  const navRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const pagePath = hash.split('?')[0];
  const { route } = useMemo(() => parseRoute(hash), [hash]);
  const [query, setQuery] = useState<CatalogQuery>(() => fromCatalogSearch(parseRoute(location.hash).search));
  const [styleQuery, setStyleQuery] = useState<StyleQuery>(() => fromStyleSearch(parseRoute(location.hash).search));
  const [deepText, setDeepText] = useState(() => new URLSearchParams(parseRoute(location.hash).search).get('q') ?? '');
  const returns = useRef({ catalog: parseRoute(location.hash).route.name === 'catalog' ? location.hash : '#/birre', deep: parseRoute(location.hash).route.name === 'deep' ? location.hash : '#/approfondimenti', styles: parseRoute(location.hash).route.name === 'styles' ? location.hash : '#/' });
  const positions = useRef(new Map<string, number>());
  const navigated = useRef(false);
  const [searchDraft, setSearchDraft] = useState('');
  const [catalogLimits, setCatalogLimits] = useState<Record<string, number>>({});
  const catalogKey = toCatalogSearch(query);
  const catalogLimit = catalogLimits[catalogKey] ?? 60;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [styleFiltersOpen, setStyleFiltersOpen] = useState(false);
  const compareCount = useCompare().length;

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const update = () => {
      const active = nav.querySelector<HTMLElement>('[aria-current="page"]');
      const indicator = nav.querySelector<HTMLElement>('.nav-indicator');
      if (!indicator) return;
      indicator.style.opacity = active ? '1' : '0';
      if (!active) return;
      const label = active.querySelector<HTMLElement>('.nav-label');
      const width = Math.min(28, label?.offsetWidth ?? active.offsetWidth);
      const center = active.offsetLeft + (label ? label.offsetLeft + label.offsetWidth / 2 : active.offsetWidth / 2);
      indicator.style.width = `${width}px`;
      indicator.style.transform = `translateX(${center - width / 2}px)`;
      indicator.style.bottom = `${nav.clientHeight - active.offsetTop - active.offsetHeight}px`;
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(nav);
    nav.querySelectorAll('.nav').forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, [route.name, compareCount]);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const animation = mainRef.current?.animate(
      [{ opacity: .65, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 180, easing: 'cubic-bezier(.16, 1, .3, 1)' },
    );
    return () => animation?.cancel();
  }, [pagePath]);

  useEffect(() => {
    const onHash = () => {
      const current = location.hash || '#/';
      const parsed = parseRoute(current);
      navigated.current = true;
      if (parsed.route.name === 'catalog') returns.current.catalog = current;
      if (parsed.route.name === 'styles') returns.current.styles = current;
      if (parsed.route.name === 'deep') { returns.current.deep = current; setDeepText(new URLSearchParams(parsed.search).get('q') ?? ''); }
      if (parsed.route.name === 'compare') applyCompareLink(parsed.search);
      setHash(current);
      setSearchDraft('');
      if (parsed.route.name === 'catalog') setQuery(fromCatalogSearch(parsed.search));
      if (parsed.route.name === 'styles') setStyleQuery(fromStyleSearch(parsed.search));

    };
    if (parseRoute(location.hash).route.name === 'compare') applyCompareLink(parseRoute(location.hash).search);
    const onScroll = () => positions.current.set(location.hash || '#/', window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', onHash);
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('scroll', onScroll); };
  }, []);
  useLayoutEffect(() => {
    if (!navigated.current) return;
    const top = positions.current.get(hash) ?? 0;
    document.getElementById('main')?.focus({ preventScroll: true });
    window.scrollTo({ top, behavior: 'instant' });
  }, [hash]);
  const updateDeepText = (text: string) => {
    setDeepText(text);
    const params = new URLSearchParams(); if (text.trim()) params.set('q', text.trim());
    const next = `#/approfondimenti${params.size ? `?${params}` : ''}`;
    returns.current.deep = next; history.replaceState(null, '', next);
  };
  const updateCatalog = (next: CatalogQuery) => {
    setQuery(next);
    if (parseRoute(location.hash).route.name === 'catalog') { returns.current.catalog = `#/birre${toCatalogSearch(next)}`; history.replaceState(null, '', returns.current.catalog); }
  };
  const updateStyles = (next: StyleQuery) => {
    setStyleQuery(next);
    if (parseRoute(location.hash).route.name === 'styles') { returns.current.styles = `#/${toStyleSearch(next)}`; history.replaceState(null, '', returns.current.styles); }
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === '/' && !target.closest('input, select, textarea, [contenteditable="true"]')) {
        e.preventDefault();
        const search = document.querySelector<HTMLInputElement>('.topsearch input');
        if (search && search.tabIndex === 0) search.focus();
        else document.querySelector<HTMLButtonElement>('.search-trigger')?.click();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const go = useCallback((path: string) => { location.hash = path; }, []);
  const openBeer = useCallback((id: string) => { location.hash = beerHref(id); }, []);
  const openStyle = useCallback((id: string) => { location.hash = styleHref(id); }, []);
  const results = useMemo(() => searchBeers(query), [query]);
  const styleResults = useMemo(() => searchStyles(styleQuery), [styleQuery]);
  const activeCount = countActiveFilters(query);
  const styleActiveCount = countStyleFilters(styleQuery);
  const beer = route.name === 'beer' ? beerOf(route.id) : undefined;
  const deep = route.name === 'deepDetail' ? speciesOf(route.id) : undefined;
  const style = route.name === 'style' ? styleById(route.id) : undefined;
  useEffect(() => {
    const section = route.name === 'style' ? style?.name : route.name === 'beer' ? beer?.name
      : route.name === 'deepDetail' ? deep?.name : route.name === 'catalog' ? 'Le birre'
      : route.name === 'compare' ? 'Confronta gli stili' : route.name === 'deep' ? 'Approfondimenti' : 'Atlante degli stili';
    document.title = `${section ?? 'Scheda non trovata'} · EduBeer`;
  }, [route.name, style?.name, beer?.name, deep?.name]);
  const searchValue = route.name === 'catalog' ? query.text : route.name === 'styles' ? styleQuery.text : searchDraft;
  const onSearch = (value: string) => {
    setSearchDraft(value);
    if (route.name === 'catalog') updateCatalog({ ...query, text: value });
    if (route.name === 'styles') updateStyles({ ...styleQuery, text: value });
  };
  const submitSearch = (value: string) => {
    const next = { ...(route.name === 'catalog' ? query : EMPTY_CATALOG), text: value };
    setQuery(next); go(`/birre${toCatalogSearch(next)}`);
  };
  const nav = [
    { href: '#/', name: 'Stili', active: route.name === 'styles' || route.name === 'style' },
    { href: '#/birre', name: 'Birre', active: route.name === 'catalog' || route.name === 'beer' },
    { href: '#/confronta', name: 'Confronta', active: route.name === 'compare' },
    ...(import.meta.env.DEV ? [{ href: '#/approfondimenti', name: 'Approfondimenti', active: route.name === 'deep' || route.name === 'deepDetail' }] : []),
  ];
  return <div className="app">
    {preview && <div className="proposal-bar">Proposta pop/punk <a href="/">Vedi la versione attuale ↗</a></div>}
    <a href="#main" className="skip-link" onClick={e => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Vai al contenuto</a>
    <header className="topbar"><a href="#/" className="brand" aria-label="EduBeer, atlante degli stili"><BeerGlass srm={8} size={25} shape="tulipano" /><span>EduBeer</span></a>
      <nav ref={navRef} aria-label="Navigazione principale">{nav.map(item => <a key={item.name} href={item.href} className={`nav ${item.active ? 'on' : ''}`} aria-current={item.active ? 'page' : undefined}>
        <span className="nav-label">{item.name}</span>{item.name === 'Confronta' && compareCount > 0 && <span className="nav-badge">{compareCount}</span>}</a>)}<span className="nav-indicator" aria-hidden="true" /></nav>
      <SearchBar value={searchValue} onChange={onSearch} onSubmit={submitSearch} onOpenBeer={openBeer} onOpenStyle={openStyle} />
      {!preview && <ThemeSelect />}
    </header>
    <main ref={mainRef} id="main" className="main" data-page={route.name} tabIndex={-1}>
      {route.name === 'styles' && <>
        {introduction}
        <header className="page-heading" id="atlante"><div>{preview ? <h2>Tutti gli stili. La tua curiosità.</h2> : <h1>Trova il tuo prossimo stile.</h1>}<p className="lede">Esplora le differenze, dal primo sorso ai dettagli.</p></div><p className="source-label">{STYLES.length} stili da conoscere<br /><span>Linee guida BJCP 2021</span></p></header>
        <div className="atlas-toolbar"><p aria-live="polite"><b>{styleResults.length}</b> stili nell’atlante</p><div className="toolbar-actions"><ExportCsvButton filename={STYLE_CSV_FILENAME} build={() => stylesCsv(styleResults)} /><button className="mini" aria-label="Filtri e ordinamento" aria-expanded={styleFiltersOpen} aria-controls="style-filters" onClick={() => setStyleFiltersOpen(v => !v)}>Filtri{styleActiveCount > 0 ? ` (${styleActiveCount})` : ''}</button></div></div>
        <div id="style-filters" hidden={!styleFiltersOpen} className="filter-drawer"><StyleFilters query={styleQuery} onChange={updateStyles} resultCount={styleResults.length} /></div>
        <ActiveStyleFilters query={styleQuery} onChange={updateStyles} /><StyleGuide query={styleQuery} filtered={styleResults} onChange={updateStyles} />
      </>}
      {route.name === 'style' && (style ? <StylePage style={style} backHref={returns.current.styles} /> : <NotFound label="Questo stile non è presente nell’atlante." href="#/" />)}
      {route.name === 'catalog' && <>
        <header className="page-heading"><div><h1>Le birre, attraverso gli stili.</h1><p className="lede">Gli esempi commerciali citati dal BJCP. Un punto di partenza per riconoscere ciò che hai nel bicchiere.</p></div><p className="source-label">{ALL_BEERS.length} birre citate<br /><span>Linee guida BJCP 2021</span></p></header>
        <p className="note">I numeri indicano gli intervalli dello stile, non i valori della singola bottiglia.{import.meta.env.DEV && <> Per le schede editoriali e lo stato delle fonti, esplora gli <a href="#/approfondimenti">approfondimenti</a>.</>}</p>
        <div className="atlas-toolbar"><p aria-live="polite"><b>{results.length}</b> birre</p><div className="toolbar-actions"><ExportCsvButton filename={BEER_CSV_FILENAME} build={() => beersCsv(results)} /><button className="mini" aria-expanded={filtersOpen} aria-controls="beer-filters" onClick={() => setFiltersOpen(v => !v)}>Filtri e ordinamento{activeCount > 0 ? ` (${activeCount})` : ''}</button></div></div>
        <div id="beer-filters" hidden={!filtersOpen} className="filter-drawer"><CatalogFilters query={query} onChange={updateCatalog} resultCount={results.length} /></div><ActiveCatalogFilters query={query} onChange={updateCatalog} />
        {results.length ? <CatalogView beers={results} limit={catalogLimit} onMore={() => setCatalogLimits(previous => ({ ...previous, [catalogKey]: catalogLimit + 60 }))} /> : <div className="empty"><h2>Nessuna birra trovata</h2><p>Prova una ricerca più breve o rimuovi qualche filtro.</p><button className="big" onClick={() => updateCatalog({ ...EMPTY_CATALOG })}>Azzera i filtri</button></div>}
      </>}
      {route.name === 'beer' && (beer ? <BeerPage beer={beer} onOpen={openBeer} onOpenStyle={openStyle} onBack={() => go(returns.current.catalog)} /> : <NotFound label="Questa birra non è fra gli esempi citati dal BJCP." href="#/birre" />)}
      {route.name === 'compare' && <CompareView onGoStyles={() => go('/')} />}
      {import.meta.env.DEV && route.name === 'deep' && <DeepDiveList text={deepText} onText={updateDeepText} />}
      {import.meta.env.DEV && route.name === 'deepDetail' && (deep ? <DeepDivePage species={deep} onOpenStyle={openStyle} onBack={() => go(returns.current.deep)} /> : <NotFound label="Questo approfondimento non esiste." href="#/approfondimenti" />)}
      {route.name === 'notFound' && <NotFound label="L’indirizzo richiesto non corrisponde a una pagina dell’atlante." href="#/" />}
    </main>
    <footer className="footer"><a className="footer-brand" href="#/">EduBeer</a><p>La birra si conosce, un dettaglio alla volta.</p><a href="https://www.bjcp.org/bjcp-style-guidelines/" target="_blank" rel="noreferrer">Fonte: BJCP 2021</a></footer>
  </div>;
}
function NotFound({ label, href }: { label: string; href: string }) {
  return <div className="empty"><h1>Scheda non trovata</h1><p>{label}</p><a className="big" href={href}>Torna all’atlante</a></div>;
}
