import { MetricGlossary } from './MetricGlossary';
import type { BjcpStyle } from '../data/bjcp';
import { BJCP_TO_APP } from '../data/bjcp';
import { beersOfStyle as bjcpBeers, rangeLabel } from '../lib/catalog';
import { beersOfStyle as curatedOfStyle } from '../lib/beer';
import { beerHref, deepHref } from '../lib/routes';
import { BeerGlass } from './BeerGlass';
import { ColorScale, CompareButton, StyleNumbers } from './StyleElements';

const SECTIONS = [['aroma', 'Aroma'], ['appearance', 'Aspetto'], ['flavor', 'Sapore'], ['mouthfeel', 'Corpo e carbonazione'], ['comments', 'Commenti'], ['history', 'Storia'], ['comparison', 'Confronto con altri stili'], ['ingredients', 'Ingredienti tipici']] as const;

export function StyleOverview({ style: s, compact = false }: { style: BjcpStyle; compact?: boolean }) {
  const examples = bjcpBeers(s.id);
  const Heading = compact ? 'h2' : 'h1';
  return <>
    <header className="style-overview-head"><BeerGlass srm={s.srm ?? 6} level={s.srm == null ? 0 : 1} label={s.srm == null ? 'Colore non dichiarato' : 'Colore medio dello stile, illustrativo'} size={compact ? 76 : 100} shape={s.srm != null && s.srm > 25 ? 'snifter' : 'tulipano'} /><div><Heading>{s.name}</Heading><p className="style-overview-meta"><span className="style-code">{s.code}</span>{s.family}</p><p className="overview-blurb">{s.blurb}</p></div></header>
    <p className="source-caption">Intervalli dello stile · BJCP 2021</p><StyleNumbers style={s} /><ColorScale range={s.color} /><MetricGlossary />
    <div className="overview-actions"><CompareButton styleId={s.id} /><a className="text-link" href="#/confronta">Apri il confronto</a></div>
    {compact && <>
      <section className="overview-section"><h3>Dentro lo stile</h3><p className="caption">Aroma, sapore, corpo e storia nel testo ufficiale. Apri la scheda per conoscere tutti i dettagli.</p></section>
      {examples.length > 0 && <section className="overview-section"><h3>Birre di riferimento</h3><ul className="reference-list">{examples.slice(0, 4).map(b => <li key={b.id}><a href={beerHref(b.id)}>{b.name}</a></li>)}</ul></section>}
    </>}
  </>;
}
export function StylePage({ style: s, backHref = '#/' }: { style: BjcpStyle; backHref?: string }) {
  const examples = bjcpBeers(s.id);
  const curated = (BJCP_TO_APP.get(s.code) ?? []).flatMap(a => curatedOfStyle(a));
  return <article className="detail style-detail"><a className="back text-link" href={backHref}>Torna agli stili</a><div className="style-detail-top"><StyleOverview style={s} /></div>
    <div className="reading-layout"><div className="reading-column"><section className="official-text"><h2>Dentro lo stile</h2><p className="caption">Descrizione ufficiale BJCP 2021, in inglese. La sintesi italiana introduce lo stile; il testo originale ne conserva tutti i dettagli.</p>
      {SECTIONS.map(([key, label]) => s[key] ? <section key={key} className="reading-section"><h3>{label}</h3><p lang="en">{s[key]}</p></section> : null)}
    </section></div><aside className="reference-aside"><section><h2>Birre di riferimento</h2>{examples.length ? <ul className="reference-list">{examples.map(b => <li key={b.id}><a href={beerHref(b.id)}>{b.name}</a></li>)}</ul> : <p className="caption">Nessun esempio commerciale dichiarato.</p>}<a className="text-link" href={`#/birre?stile=${encodeURIComponent(s.id)}`}>Esplora le birre dello stile</a></section>
      <details className="technical-details"><summary>Dati per degustatori</summary><dl className="technical-numbers"><div><dt>Densità iniziale (OG)</dt><dd>{rangeLabel(s.og, '', 3)}</dd></div><div><dt>Densità finale (FG)</dt><dd>{rangeLabel(s.fg, '', 3)}</dd></div></dl><p className="caption">Intervalli dello stile. I valori non descrivono una singola birra.</p></details>
      {import.meta.env.DEV && curated.length > 0 && <section><h2>Storie da approfondire</h2><ul className="reference-list">{curated.map(b => <li key={b.id}><a href={deepHref(b.id)}>{b.name}</a></li>)}</ul></section>}
      <p className="caption">Categoria {s.categoryId}: {s.category}</p>
    </aside></div>
  </article>;
}
