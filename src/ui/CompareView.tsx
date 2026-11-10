import { MetricGlossary } from './MetricGlossary';
import { useMemo, useState } from 'react';
import { BJCP_BY_ID } from '../data/bjcp';
import type { BjcpStyle } from '../data/bjcp';
import { srmToHex } from '../lib/color';
import { BAR_METRICS, COMPARE_SORTS, MAX_COMPARE, MIN_COMPARE, RADAR_METRICS, addToCompare, clearCompare, compareHref, midOf, pairLabel, removeFromCompare, sortStyles, styleColor, useCompare } from '../lib/compare';
import type { CompareSort } from '../lib/compare';
import { suggestStyles } from '../lib/styleFilter';
import { styleHref } from '../lib/routes';
import { RadarChart } from './charts/RadarChart';
import { RangeBarChart } from './charts/RangeBarChart';

export function CompareView({ onGoStyles }: { onGoStyles: () => void }) {
  const ids = useCompare();
  const [sort, setSort] = useState<CompareSort>('sel');
  const [term, setTerm] = useState('');
  const [shareStatus, setShareStatus] = useState<{ url: string; message: string } | null>(null);
  const shareUrl = new URL(compareHref(ids), location.href).href;
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setShareStatus({ url: shareUrl, message: 'Link copiato.' }); }
    catch { setShareStatus({ url: shareUrl, message: 'Copia il link dal campo qui sotto.' }); }
  };
  const styles = useMemo(() => ids.map(id => BJCP_BY_ID.get(id)).filter((s): s is BjcpStyle => s != null), [ids]);
  const sorted = useMemo(() => sortStyles(styles, sort), [styles, sort]);
  const colorOf = (id: string) => styleColor(ids.indexOf(id));
  const suggestions = suggestStyles(term, 8).filter(s => !ids.includes(s.id));
  return <div className="compare">
    <header className="guide-head"><h1>Gli stili, a confronto.</h1><p className="lede">Guarda dove si incontrano e dove si distinguono. Da {MIN_COMPARE} a {MAX_COMPARE} stili, con gli intervalli dichiarati dal BJCP.</p></header>
    <MetricGlossary />
    <div className="compare-picker"><label htmlFor="compare-search">Aggiungi uno stile <span className="dim">({ids.length}/{MAX_COMPARE})</span></label>
      <div className="searchbox"><input id="compare-search" type="search" value={term} onChange={e => setTerm(e.target.value)} placeholder="Cerca per nome o codice BJCP" disabled={ids.length >= MAX_COMPARE} /></div>
      {ids.length >= MAX_COMPARE && <p className="caption" role="status">Hai selezionato cinque stili. Rimuovine uno per aggiungerne un altro.</p>}
      {term.trim() && ids.length < MAX_COMPARE && <div className="compare-suggestions">{suggestions.length ? suggestions.map(s => <button className="mini" key={s.id} onClick={() => { addToCompare(s.id); setTerm(''); }}>{s.code} {s.name}</button>) : <p className="caption">Nessun altro stile trovato. Prova un nome diverso.</p>}</div>}
    </div>
    <div className="compare-toolbar"><div className="chips" aria-label="Stili selezionati">{sorted.map(s => <button key={s.id} className="chip on" onClick={() => removeFromCompare(s.id)} aria-label={`Rimuovi ${s.name} dal confronto`}><i className="dot" style={{ background: colorOf(s.id) }} aria-hidden="true" />{s.code} {s.name}<span aria-hidden="true">×</span></button>)}</div>
      {ids.length > 0 && <div className="compare-controls"><select className="select inline" value={sort} onChange={e => setSort(e.target.value as CompareSort)} aria-label="Ordina il confronto">{COMPARE_SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select><button className="mini" onClick={clearCompare}>Svuota il confronto</button></div>}
    </div>
    {ids.length > 0 && <details className="compare-share"><summary>Condividi questo confronto</summary>
      <p className="caption">Chi apre il link carica questi stili al posto della propria selezione locale.</p>
      <label htmlFor="compare-link">Link al confronto</label><input id="compare-link" type="url" readOnly value={shareUrl} onFocus={e => e.currentTarget.select()} />
      <button className="mini" onClick={copyLink}>Copia link</button><p role="status">{shareStatus?.url === shareUrl ? shareStatus.message : ''}</p>
    </details>}
    {styles.length < MIN_COMPARE ? <div className="empty"><h2>{styles.length ? 'Ancora uno stile per iniziare.' : 'Le differenze si vedono meglio insieme.'}</h2><p>Seleziona almeno due stili dalla ricerca qui sopra o esplora l’atlante. La selezione resta salvata su questo dispositivo.</p><button className="big" onClick={onGoStyles}>Esplora gli stili</button></div> : <>
      <section className="chart-card"><h2>Intervallo per intervallo</h2><p className="caption">Ogni segmento unisce il minimo e il massimo dello stile. La tacca indica il punto medio dell’intervallo, non un valore misurato sulle birre.</p>
        {BAR_METRICS.map(m => <div className="range-block" key={m.key}><h3>{m.label}<span className="caption"> {m.short}</span></h3><RangeBarChart metric={m} styles={sorted} colorOf={colorOf} /></div>)}
      </section>
      <section className="chart-card"><h2>I numeri esatti</h2><p className="caption">Intervalli dello stile · BJCP 2021. Un trattino indica un dato non dichiarato.</p><SummaryTable styles={sorted} colorOf={colorOf} /></section>
      <details className="chart-card radar-details"><summary>Vista radar: cinque metriche</summary><p className="caption">Punti medi normalizzati sui domini indicati per ABV, IBU, SRM, OG e FG. È una sintesi numerica, non un profilo sensoriale. Puoi nascondere una serie dalla legenda.</p><RadarChart styles={sorted} colorOf={colorOf} /></details>
    </>}
  </div>;
}
function SummaryTable({ styles, colorOf }: { styles: BjcpStyle[]; colorOf: (id: string) => string }) {
  return <div className="table-scroll" role="region" aria-label="Tabella degli intervalli degli stili" tabIndex={0}><table className="compare-table"><caption className="sr-only">Valori minimi e massimi degli stili selezionati</caption><thead><tr><th scope="col" className="compare-metric">Metrica</th>{styles.map(s => <th scope="col" key={s.id}><i className="dot" aria-hidden="true" style={{ background: colorOf(s.id) }} /><a href={styleHref(s.id)}>{s.code} {s.name}</a></th>)}</tr></thead><tbody>{RADAR_METRICS.map(m => <tr key={m.key}><th scope="row" className="compare-metric">{m.label}</th>{styles.map(s => {
    const pair = m.pair(s); const mid = midOf(pair);
    return <td key={s.id}>{m.key === 'srm' && mid != null && <i className="srm-swatch" aria-hidden="true" style={{ background: srmToHex(mid) }} />}{pairLabel(pair, m.unit, m.digits)}</td>;
  })}</tr>)}</tbody></table></div>;
}
