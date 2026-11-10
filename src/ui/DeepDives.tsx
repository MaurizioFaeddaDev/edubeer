import { BeerSources } from './BeerSources';
import { MetricGlossary } from './MetricGlossary';
import { BeerGlass } from './BeerGlass';
import { ALL, styleOf } from '../lib/beer';
import { APP_TO_BJCP } from '../data/bjcp';
import { styleById } from '../lib/catalog';
import type { BeerSpecies } from '../data/types';
import { deepHref } from '../lib/routes';

// ─────────────────────────────────────────────────────────────────────────────
// Approfondimenti: le trenta birre con scheda scritta a mano — storia vera,
// origine, abbinamento gastronomico, nota da esperto. Sono l'unica parte del
// corpus con valori editoriali per birra, con provenienza esplicita, separati
// dall'enciclopedia BJCP, che invece è tutta derivata dagli stili.
// ─────────────────────────────────────────────────────────────────────────────

export function DeepDiveList({ text, onText: setText }: { text: string; onText: (text: string) => void }) {
  const q = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const items = ALL.filter((s) => {
    if (!q) return true;
    const hay = `${s.name} ${styleOf(s).name} ${s.origin} ${s.country}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return q.split(/\s+/).every((t) => hay.includes(t));
  });

  return (
    <div className="guide">
      <header className="guide-head">
        <h1>Approfondimenti</h1>
        <p className="lede">
          {ALL.length} birre, altrettante storie da conoscere. Origine, abbinamenti e
          dettagli di degustazione. Le schede riportano lo stato delle fonti per ogni valore.
        </p>
      </header>

      <div className="filter-block">
        <div className="searchbox">
          <input
            type="search"
            placeholder="Cerca fra gli approfondimenti…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Cerca negli approfondimenti"
          />
        </div>
        <span className="searchbox-count">{items.length} schede</span>
      </div>

      {items.length === 0 && <div className="empty"><h2>Nessun approfondimento trovato</h2><p>Prova un nome, un paese o uno stile diverso.</p><button className="big" onClick={() => setText('')}>Mostra tutti gli approfondimenti</button></div>}
      <div className="grid">
        {items.map((s) => (
          <article className="bcard" key={s.id}>
            <a className="bcard-main" href={deepHref(s.id)}>
              <BeerGlass srm={s.srm} level={1} shape="tulipano" size={40} />
              <div className="bcard-text">
                <h3>{s.name}</h3>
                <p className="bcard-style">{styleOf(s).name}</p>
                <p className="bcard-meta">{s.abv}% · {s.ibu} IBU · SRM {s.srm}</p><p className="caption">Valori editoriali · fonti nella scheda</p>
                <p className="bcard-cat">{s.origin} · {s.country}</p>
              </div>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

export function DeepDivePage({
  species, onOpenStyle, onBack,
}: {
  species: BeerSpecies;
  onOpenStyle: (code: string) => void;
  onBack: () => void;
}) {
  const st = styleOf(species);
  const related = (APP_TO_BJCP[species.style] ?? []).map(styleById).filter(s => s != null);

  return (
    <article className="detail">
      <button className="link back" onClick={onBack}>← Approfondimenti</button>

      <header className="detail-head">
        <BeerGlass srm={species.srm} level={1} shape="tulipano" size={92} />
        <div className="detail-title">
          <p className="detail-style">{st.name}</p>
          <h1>{species.name}</h1>
          <p className="detail-origin">
            {species.origin} · {species.country}{species.year ? ` · ${species.year}` : ''}
          </p>
          <div className="detail-actions">
            {related.map(bjcp => <button key={bjcp.id} className="mini" onClick={() => onOpenStyle(bjcp.id)}>
              Stile correlato: {bjcp.code} — {bjcp.name}
            </button>)}
          </div>
        </div>
      </header>

      <p className="caption">Gli stili correlati derivano dalla famiglia editoriale; non attestano la classificazione BJCP della singola birra.</p>
      <section className="spec-grid">
        <Spec label="Gradazione" value={`${species.abv}%`} />
        <Spec label="Amarezza" value={`${species.ibu} IBU`} />
        <Spec label="Colore" value={`SRM ${species.srm}`} />
      </section>

      <p className="note">Valori del corpus editoriale: consulta qui sotto lo stato di verifica di ogni dato.</p>
      <MetricGlossary /><BeerSources id={species.id} />
      <section className="blurb-wrap">
        <h2>Lo stile</h2>
        <p className="blurb">{st.blurb}</p>
      </section>

      <section className="prose">
        <div className="prose-grid">
          <div>
            <h3>Storia</h3>
            <p>{species.history}</p>
          </div>
          <div>
            <h3>A tavola</h3>
            <p>{species.pairing}</p>
          </div>
        </div>
        <p className="fact">{species.fact}</p>
      </section>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bigspec">
      <div className="bigspec-head">
        <span className="bigspec-label">{label}</span>
        <span className="bigspec-value">{value}</span>
      </div>
    </div>
  );
}
