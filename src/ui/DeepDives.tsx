import { useState } from 'react';
import { BeerGlass } from './BeerGlass';
import { ALL, styleOf } from '../lib/beer';
import { APP_TO_BJCP } from '../data/bjcp';
import { styleById } from '../lib/catalog';
import type { BeerSpecies } from '../data/types';

// ─────────────────────────────────────────────────────────────────────────────
// Approfondimenti: le trenta birre con scheda scritta a mano — storia vera,
// origine, abbinamento gastronomico, nota da esperto. Sono l'unica parte del
// corpus con dati per-birra reali, quindi vivono in una sezione separata
// dall'enciclopedia BJCP, che invece è tutta derivata dagli stili.
// ─────────────────────────────────────────────────────────────────────────────

export function DeepDiveList({ onOpen }: { onOpen: (id: string) => void }) {
  const [text, setText] = useState('');
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
          {ALL.length} birre con scheda scritta a mano: storia, origine, abbinamento
          gastronomico, nota da esperto. Sono l'unico punto dell'EduBeer dove i dati sono
          verificati birra per birra — tutto il resto dell'enciclopedia è derivato dagli
          stili BJCP.
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

      <div className="grid">
        {items.map((s) => (
          <article className="bcard" key={s.id}>
            <button className="bcard-main" onClick={() => onOpen(s.id)}>
              <BeerGlass srm={s.srm} level={1} shape="tulipano" size={40} />
              <div className="bcard-text">
                <h3>{s.name}</h3>
                <p className="bcard-style">{styleOf(s).name}</p>
                <p className="bcard-meta">{s.abv}% · {s.ibu} IBU · SRM {s.srm}</p>
                <p className="bcard-cat">{s.origin} · {s.country}</p>
              </div>
            </button>
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
  const code = APP_TO_BJCP[species.style]?.[0];
  const bjcp = code ? styleById(code) : undefined;

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
            {bjcp && (
              <button className="mini" onClick={() => onOpenStyle(bjcp.id)}>
                stile BJCP {bjcp.code} — {bjcp.name}
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="spec-grid">
        <Spec label="Gradazione" value={`${species.abv}%`} />
        <Spec label="Amarezza" value={`${species.ibu} IBU`} />
        <Spec label="Colore" value={`SRM ${species.srm}`} />
      </section>

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
