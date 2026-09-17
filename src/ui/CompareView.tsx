import { AXES, AXIS_IT } from '../data/types';
import type { BeerSpecies } from '../data/types';
import { BeerGlass } from './BeerGlass';
import { RadarChart } from './RadarChart';
import { intensityWord } from '../lib/color';
import { styleOf, similarity } from '../lib/beer';
import { speciesOf } from '../lib/beer';

// ─────────────────────────────────────────────────────────────────────────────
// Confronto. Sopravvalutato il radar da solo: la tabella qui sotto è la parte
// che risolve le discussioni, perché mette i numeri in colonna.
// ─────────────────────────────────────────────────────────────────────────────

const SERIES_COLORS = ['#d9a441', '#8bac0f', '#c0563a', '#6aa8b8', '#b07ad0', '#7fbfbf'];

export function CompareView({
  ids, onOpen, onRemove, onClear, onPick,
}: {
  ids: string[];
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onPick: () => void;
}) {
  const beers = ids.map(speciesOf).filter((s): s is BeerSpecies => !!s);

  if (beers.length < 2) {
    return (
      <div className="empty">
        <h2>Confronto</h2>
        <p className="dim">
          Seleziona almeno due birre con il pulsante <b>confronta</b> nelle schede, poi torna qui.
          Il confronto mostra i profili sovrapposti, una tabella di tutti i valori e la somiglianza
          a coppie.
        </p>
        <button className="big" onClick={onPick}>Vai all'archivio</button>
      </div>
    );
  }

  const rows: { label: string; render: (s: BeerSpecies) => React.ReactNode; numeric?: (s: BeerSpecies) => number }[] = [
    { label: 'Stile', render: (s) => styleOf(s).name },
    { label: 'Famiglia', render: (s) => styleOf(s).family },
    { label: 'Paese', render: (s) => s.country },
    { label: 'Origine', render: (s) => s.origin },
    { label: 'Riferimento', render: (s) => s.year ?? '—' },
    { label: 'Gradazione', render: (s) => `${s.abv}%`, numeric: (s) => s.abv },
    { label: 'Amarezza', render: (s) => `${s.ibu} IBU`, numeric: (s) => s.ibu },
    { label: 'Colore', render: (s) => `${s.srm} SRM`, numeric: (s) => s.srm },
    ...AXES.map((a) => ({
      label: AXIS_IT[a],
      render: (s: BeerSpecies) => (
        <span className="cmp-axis">
          <span className={`cell lv${s.profile[a]}`}>{s.profile[a]}</span>
          <span className="dim">{intensityWord(s.profile[a])}</span>
        </span>
      ),
      numeric: (s: BeerSpecies) => s.profile[a],
    })),
  ];

  return (
    <div className="compare">
      <header className="compare-head">
        <h1>Confronto</h1>
        <div className="row">
          <button className="mini" onClick={onPick}>+ aggiungi</button>
          <button className="mini" onClick={onClear}>svuota</button>
        </div>
      </header>

      <section className="compare-top">
        <div className="compare-radar">
          <RadarChart
            size={360}
            series={beers.map((s, i) => ({
              profile: s.profile,
              color: SERIES_COLORS[i % SERIES_COLORS.length],
              label: s.name,
            }))}
          />
        </div>
        <div className="compare-legend">
          {beers.map((s, i) => (
            <div className="legend-row" key={s.id}>
              <span className="legend-dot" style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }} />
              <BeerGlass srm={s.srm} level={1} shape="tulipano" size={28} />
              <button className="legend-name" onClick={() => onOpen(s.id)}>{s.name}</button>
              <span className="dim">{styleOf(s).name}</span>
              <button className="mini ghost" onClick={() => onRemove(s.id)} aria-label={`Rimuovi ${s.name}`}>×</button>
            </div>
          ))}
          <div className="similarity-matrix">
            <h3>Somiglianza a coppie</h3>
            <table>
              <thead>
                <tr>
                  <th />
                  {beers.map((b) => <th key={b.id}>{b.name.split(' ')[0]}</th>)}
                </tr>
              </thead>
              <tbody>
                {beers.map((a) => (
                  <tr key={a.id}>
                    <th>{a.name.split(' ')[0]}</th>
                    {beers.map((b) => (
                      <td key={b.id} className={a.id === b.id ? 'self' : ''}>
                        {a.id === b.id ? '—' : `${Math.round(similarity(a, b) * 100)}%`}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="compare-table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="cmp-label" />
              {beers.map((s) => (
                <th key={s.id}>
                  <button className="cmp-head" onClick={() => onOpen(s.id)}>
                    <BeerGlass srm={s.srm} level={1} shape="boccale" size={30} />
                    <span>{s.name}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const values = r.numeric ? beers.map(r.numeric) : null;
              const max = values ? Math.max(...values) : null;
              const min = values ? Math.min(...values) : null;
              const allSame = values ? max === min : true;
              return (
                <tr key={r.label}>
                  <th className="cmp-label">{r.label}</th>
                  {beers.map((s, i) => {
                    const v = values?.[i];
                    const isMax = !allSame && v === max && max > 0;
                    const isMin = !allSame && v === min && r.numeric !== undefined && r.label !== 'Gradazione';
                    return (
                      <td key={s.id} className={`${isMax ? 'best' : ''} ${isMin && !isMax ? 'lowest' : ''}`}>
                        {r.render(s)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="table-note dim">
          In evidenza il valore più alto di ogni riga. Attenzione a leggerla bene: più alto non vuol dire
          migliore. Su un asse sensoriale «più alto» significa solo «più intenso» — e l'intensità è una scelta
          di stile, non un merito.
        </p>
      </section>
    </div>
  );
}
