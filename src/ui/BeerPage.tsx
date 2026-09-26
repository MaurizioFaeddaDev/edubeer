import { BeerGlass } from './BeerGlass';
import { beersOfStyle, rangeLabel, styleOfBeer } from '../lib/catalog';
import type { BjcpBeer, BjcpStyle } from '../lib/catalog';

// ─────────────────────────────────────────────────────────────────────────────
// Scheda di una birra citata dal BJCP. Il BJCP non descrive le singole birre:
// descrive lo stile a cui le ascrive. La scheda quindi mostra i numeri e i
// testi ufficiali dello stile, dichiarandolo in chiaro — nessun dato per-birra
// viene inventato.
// ─────────────────────────────────────────────────────────────────────────────

const SECTIONS: { key: keyof BjcpStyle; label: string }[] = [
  { key: 'aroma', label: 'Aroma' },
  { key: 'appearance', label: 'Aspetto' },
  { key: 'flavor', label: 'Sapore' },
  { key: 'mouthfeel', label: 'Corpo e carbonazione' },
  { key: 'comments', label: 'Commenti' },
  { key: 'history', label: 'Storia' },
  { key: 'comparison', label: 'Confronto con altri stili' },
  { key: 'ingredients', label: 'Ingredienti tipici' },
];

export function BeerPage({
  beer, onOpen, onOpenStyle, onBack,
}: {
  beer: BjcpBeer;
  onOpen: (id: string) => void;
  onOpenStyle: (code: string) => void;
  onBack: () => void;
}) {
  const s = styleOfBeer(beer);
  if (!s) {
    return (
      <div className="empty">
        <h2>Stile non trovato</h2>
        <p className="dim">Questa birra rimanda a uno stile che non è nel catalogo.</p>
        <button className="big" onClick={onBack}>Torna all'enciclopedia</button>
      </div>
    );
  }
  const siblings = beersOfStyle(s.id).filter((b) => b.id !== beer.id);

  return (
    <article className="detail">
      <button className="link back" onClick={onBack}>← Enciclopedia</button>

      <header className="detail-head">
        <BeerGlass srm={s.srm ?? 6} level={1} shape="tulipano" size={92} />
        <div className="detail-title">
          <p className="detail-style">
            <span className="bjcp-code">{s.code}</span> {s.name}
          </p>
          <h1>{beer.name}</h1>
          <p className="detail-origin">
            {s.category} · <span className="style-family">{s.family}</span>
          </p>
          <div className="detail-actions">
            <button className="mini" onClick={() => onOpenStyle(s.id)}>
              tutte le birre dello stile {s.code} — {s.name}
            </button>
          </div>
        </div>
      </header>

      <p className="note">
        Il BJCP cita <b>{beer.name}</b> come esempio dello stile <b>{s.name}</b>, ma non
        descrive la singola birra: non ne dichiara ABV, IBU né scheda sensoriale. Quello che
        segue è il profilo <b>ufficiale dello stile</b>, non della bottiglia.
      </p>

      <section className="spec-grid">
        <Spec label="Gradazione" value={rangeLabel(s.abv, '%')} note="intervallo di stile" />
        <Spec label="Amarezza" value={rangeLabel(s.ibu, ' IBU')} note="intervallo di stile" />
        <Spec label="Colore" value={rangeLabel(s.color, ' SRM')} note="intervallo di stile" />
        <Spec label="Densità iniziale" value={rangeLabel(s.og, '', 3)} note="OG, intervallo di stile" />
        <Spec label="Densità finale" value={rangeLabel(s.fg, '', 3)} note="FG, intervallo di stile" />
      </section>

      <section className="blurb-wrap">
        <h2>In sintesi</h2>
        <p className="blurb">{s.blurb}</p>
      </section>

      <section className="prose">
        <h2>Testo ufficiale BJCP 2021</h2>
        <p className="caption dim">
          Le sezioni seguenti sono riportate verbatim dalle linee guida, in inglese. È il
          documento con cui i giudici valutano lo stile.
        </p>
        <div className="prose-grid">
          {SECTIONS.map(({ key, label }) => {
            const text = s[key];
            if (typeof text !== 'string' || !text) return null;
            return (
              <div key={key}>
                <h3>{label}</h3>
                <p>{text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {siblings.length > 0 && (
        <section className="siblings">
          <h2>Altri esempi dello stile {s.code}</h2>
          <p className="caption dim">
            {siblings.length} altre birre citate dal BJCP per questo stile.
          </p>
          <div className="chips">
            {siblings.map((b) => (
              <button key={b.id} className="chip" onClick={() => onOpen(b.id)}>{b.name}</button>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function Spec({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="bigspec">
      <div className="bigspec-head">
        <span className="bigspec-label">{label}</span>
        <span className="bigspec-value">{value}</span>
      </div>
      <p className="bigspec-note">{note}</p>
    </div>
  );
}
