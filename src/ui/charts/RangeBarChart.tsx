import type { BjcpStyle } from '../../data/bjcp';
import type { StyleMetric } from '../../lib/compare';
import { fmt, pairLabel } from '../../lib/compare';
import { srmToHex } from '../../lib/color';
import { styleHref } from '../../lib/routes';

/** Shared domain per metric; DOM labels stay readable at every width. */
export function RangeBarChart({ metric, styles, colorOf }: { metric: StyleMetric; styles: BjcpStyle[]; colorOf: (id: string) => string }) {
  const lo = Math.min(metric.domain[0], ...styles.flatMap(s => metric.pair(s)?.[0] ?? []));
  const hi = Math.max(metric.domain[1], ...styles.flatMap(s => metric.pair(s)?.[1] ?? []));
  const percent = (n: number) => ((n - lo) / (hi - lo || 1)) * 100;
  return <div className="range-chart" role="group" aria-label={`${metric.label}: confronto degli intervalli`}>
    {styles.map(s => {
      const pair = metric.pair(s);
      return <div className="interval-row" key={s.id}><div className="interval-name"><span className="style-code">{s.code}</span><a href={styleHref(s.id)}>{s.name}</a></div>
        <div className="interval-track" aria-hidden="true">{pair && <span className={`interval-span ${metric.key === 'srm' ? 'srm-interval' : ''}`} style={{ left: `${percent(pair[0])}%`, width: `${percent(pair[1]) - percent(pair[0])}%`, background: metric.key === 'srm' ? `linear-gradient(90deg, ${srmToHex(pair[0])}, ${srmToHex(pair[1])})` : colorOf(s.id) }}><span className="interval-mid" style={{ left: '50%' }} /></span>}</div>
        <div className="interval-value">{pairLabel(pair, metric.unit, metric.digits)}</div></div>;
    })}
    <div className="interval-axis" aria-hidden="true">{[0, .25, .5, .75, 1].map(f => <span key={f}>{fmt(lo + (hi - lo) * f, metric.digits > 0 ? metric.digits : metric.key === 'abv' ? 1 : 0)}</span>)}</div>
  </div>;
}
