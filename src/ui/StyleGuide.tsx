import { useState } from 'react';
import { CATEGORIES, FAMILIES } from '../lib/catalog';
import { EMPTY_STYLE_QUERY } from '../lib/styleFilter';
import type { StyleQuery } from '../lib/styleFilter';
import { BeerGlass } from './BeerGlass';
import { CompareButton, StyleNumbers } from './StyleElements';
import { StyleOverview } from './StylePage';
import { styleHref } from '../lib/routes';
import type { BjcpStyle } from '../data/bjcp';

export function StyleGuide({ query, filtered, onChange }: { query: StyleQuery; filtered: BjcpStyle[]; onChange: (q: StyleQuery) => void }) {
  const [previewId, setPreviewId] = useState('');
  const selected = filtered.find(s => s.id === previewId) ?? filtered[0];
  const sections = query.sort === 'code' ? CATEGORIES.map(c => ({ name: c.name, id: c.id, styles: filtered.filter(s => s.categoryId === c.id) })).filter(c => c.styles.length) : [{ name: '', id: '', styles: filtered }];
  return <div className="guide">
    <div className="family-toolbar"><div className="family-tabs" aria-label="Famiglie di stili">
      <button className={`family-tab ${query.families.length === 0 ? 'on' : ''}`} aria-pressed={query.families.length === 0} onClick={() => onChange({ ...query, families: [] })}>Tutti</button>
      {FAMILIES.map(f => <button key={f} className={`family-tab ${query.families.includes(f) ? 'on' : ''}`} aria-pressed={query.families.includes(f)} onClick={() => onChange({ ...query, families: query.families.includes(f) ? query.families.filter(x => x !== f) : [...query.families, f] })}>{f}</button>)}
    </div></div>
    {filtered.length === 0 ? <div className="empty"><h2>Nessuno stile trovato</h2><p>Allarga un intervallo o prova un termine diverso.</p><button className="big" onClick={() => onChange({ ...EMPTY_STYLE_QUERY })}>Azzera i filtri</button></div> :
      <div className="atlas-columns"><div className="style-list">{sections.map(section => <section className="style-section" key={section.id}>
        {section.name && <h2 className="category-heading"><span>{section.id}</span>{section.name}</h2>}
        {section.styles.map(s => <StyleEntry key={s.id} style={s} selected={selected.id === s.id} onPreview={() => setPreviewId(s.id)} />)}
      </section>)}</div><aside className="style-preview" aria-label="Anteprima dello stile" tabIndex={0} key={selected.id}><StyleOverview style={selected} compact /><a className="text-link preview-full" href={styleHref(selected.id)}>Leggi la scheda completa</a></aside></div>}
  </div>;
}
function StyleEntry({ style: s, selected, onPreview }: { style: BjcpStyle; selected: boolean; onPreview: () => void }) {
  return <article className={`style-entry ${selected ? 'selected' : ''}`}>
    <a className="style-entry-glass" href={styleHref(s.id)} aria-label={`Leggi ${s.name}`}><BeerGlass srm={s.srm ?? 6} level={s.srm == null ? 0 : 1} label={s.srm == null ? 'Colore non dichiarato' : 'Colore medio dello stile, illustrativo'} size={53} shape={s.srm != null && s.srm > 25 ? 'snifter' : s.family === 'Lager' ? 'boccale' : 'tulipano'} /></a>
    <div className="style-entry-content"><div className="style-entry-heading"><h3><a href={styleHref(s.id)}>{s.name}</a></h3><span className="style-code">{s.code}</span></div>
      <p className="style-description">{s.blurb}</p><StyleNumbers style={s} />
      <div className="entry-actions"><button className="preview-choice" onClick={onPreview} aria-pressed={selected}>{selected ? 'In anteprima' : 'Anteprima'}</button><CompareButton styleId={s.id} /></div>
    </div>
  </article>;
}
