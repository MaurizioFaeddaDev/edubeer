import { useMemo, useState } from 'react';
import { BJCP_BY_ID } from '../data/bjcp';
import type { BjcpStyle } from '../data/bjcp';
import { srmToHex } from '../lib/color';
import {
  BAR_METRICS, COMPARE_SORTS, MAX_COMPARE, MIN_COMPARE, RADAR_METRICS,
  clearCompare, midOf, pairLabel, removeFromCompare, sortStyles, styleColor,
  useCompare,
} from '../lib/compare';
import type { CompareSort } from '../lib/compare';
import { RadarChart } from './charts/RadarChart';
import { RangeBarChart } from './charts/RangeBarChart';

// ─────────────────────────────────────────────────────────────────────────────
// Confronta: 2–5 stili messi fianco a fianco. Radar di sintesi, barre
// [min–max] per ABV/IBU/SRM e tabella con i numeri esatti. OG/FG restano nel
// radar e in una riga tecnica della tabella, non nei grafici a barre.
// ─────────────────────────────────────────────────────────────────────────────

export function CompareView({ onGoStyles }: { onGoStyles: () => void }) {
  const ids = useCompare();
  const [sort, setSort] = useState<CompareSort>('sel');

  const styles = useMemo(
    () => ids.map((id) => BJCP_BY_ID.get(id)).filter((s): s is BjcpStyle => s != null),
    [ids],
  );
  const colorOf = useMemo(() => {
    const map = new Map(ids.map((id, i) => [id, styleColor(i)]));
    return (id: string) => map.get(id) ?? styleColor(0);
  }, [ids]);
  const sorted = useMemo(() => sortStyles(styles, sort), [styles, sort]);

  return (
    <div className="compare">
      <header className="guide-head">
        <h1>Confronta gli stili</h1>
        <p className="lede">
          Da {MIN_COMPARE} a {MAX_COMPARE} stili, tutti i numeri che il BJCP dichiara, messi
          fianco a fianco. La linea è il valore medio, la barra è l'intervallo [min–max]:
          qui non si inventa nulla, si mostra l'ampiezza reale di ogni stile.
        </p>
      </header>

      {styles.length < MIN_COMPARE ? (
        <div className="empty">
          <h2>Seleziona almeno {MIN_COMPARE} stili</h2>
          <p className="dim">
            Aggiungi gli stili dalla sezione <b>Stili</b> con il pulsante «＋ Confronta» su
            ogni card (massimo {MAX_COMPARE}). La selezione resta salvata e la ritrovi qui.
          </p>
          <button className="big" onClick={onGoStyles}>Vai agli stili</button>
        </div>
      ) : (
        <>
          <div className="compare-toolbar">
            <div className="chips">
              {sorted.map((s) => (
                <button
                  key={s.id}
                  className="chip on"
                  onClick={() => removeFromCompare(s.id)}
                  title="Rimuovi dal confronto"
                >
                  <i className="dot" style={{ background: colorOf(s.id) }} />
                  {s.code} · {s.name}
                  <em>×</em>
                </button>
              ))}
            </div>
            <div className="compare-controls">
              <select
                className="select inline"
                value={sort}
                onChange={(e) => setSort(e.target.value as CompareSort)}
                aria-label="Ordinamento del confronto"
              >
                {COMPARE_SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <button className="mini" onClick={clearCompare}>svuota</button>
            </div>
          </div>

          <section className="chart-card">
            <h3>Profilo complessivo</h3>
            <RadarChart styles={sorted} colorOf={colorOf} />
          </section>

          <section className="chart-card">
            <h3>I numeri, intervallo per intervallo</h3>
            <p className="caption dim">
              Ogni segmento va dal minimo al massimo dichiarato dal BJCP; la tacca centrale è
              il valore medio. Passa sopra una riga per i numeri esatti.
            </p>
            {BAR_METRICS.map((m) => (
              <div className="range-block" key={m.key}>
                <h4>{m.label} <span className="dim">{m.short}</span></h4>
                <RangeBarChart metric={m} styles={sorted} colorOf={colorOf} />
              </div>
            ))}
          </section>

          <section className="chart-card">
            <h3>Tabella riepilogativa</h3>
            <SummaryTable styles={sorted} colorOf={colorOf} />
          </section>
        </>
      )}
    </div>
  );
}

function SummaryTable({
  styles, colorOf,
}: {
  styles: BjcpStyle[];
  colorOf: (id: string) => string;
}) {
  const main = BAR_METRICS;
  const tech = RADAR_METRICS.filter((m) => m.key === 'og' || m.key === 'fg');

  const head = (cols: typeof main | typeof tech) => (
    <table className="compare-table">
      <thead>
        <tr>
          <th className="compare-metric">Metrica</th>
          {styles.map((s) => (
            <th key={s.id}>
              <i className="dot" style={{ background: colorOf(s.id) }} />
              <span>{s.code} · {s.name}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {cols.map((m) => (
          <tr key={m.key}>
            <td className="compare-metric">{m.label}</td>
            {styles.map((s) => {
              const pair = m.pair(s);
              const mid = midOf(pair);
              return (
                <td key={s.id}>
                  {m.key === 'srm' && mid != null && (
                    <i className="srm-swatch" style={{ background: srmToHex(mid) }} />
                  )}
                  {pairLabel(pair, m.unit, m.digits)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="compare-tables">
      <div className="table-scroll">{head(main)}</div>
      <details className="table-tech">
        <summary>Densità — OG e FG (intervalli di stile)</summary>
        <div className="table-scroll">{head(tech)}</div>
      </details>
    </div>
  );
}
