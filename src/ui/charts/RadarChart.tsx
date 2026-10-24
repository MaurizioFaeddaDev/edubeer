import { useState } from 'react';
import { fmt, midOf, pairLabel, RADAR_METRICS } from '../../lib/compare';
import type { BjcpStyle } from '../../data/bjcp';
import { useSize } from './useSize';

// ─────────────────────────────────────────────────────────────────────────────
// Radar a cinque assi (ABV, IBU, SRM, OG, FG). La linea piena è il valore
// medio dello stile; il trattino lungo l'asse è l'intervallo [min–max]
// dichiarato dal BJCP. Il tratteggio della linea distingue le serie anche
// senza colore. La legenda mostra/nasconde gli stili e l'hover ne evidenzia uno.
// ─────────────────────────────────────────────────────────────────────────────

/** Tratteggi per serie: la differenza non è affidata al solo colore. */
const DASH = ['none', '8 4', '2 3', '10 3 2 3', '4 2'];

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

interface AxisPoint {
  metric: (typeof RADAR_METRICS)[number];
  min: number;
  mid: number;
  max: number;
}

export function RadarChart({
  styles, colorOf,
}: {
  styles: BjcpStyle[];
  colorOf: (id: string) => string;
}) {
  const { ref, width } = useSize<HTMLDivElement>();
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [hover, setHover] = useState<string | null>(null);

  const size = Math.min(width, 460);
  const cx = width / 2;
  const cy = size / 2;
  const radius = Math.max(40, size / 2 - 52);
  const N = RADAR_METRICS.length;

  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / N;
  const pt = (i: number, r: number): [number, number] => [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];

  const axesOf = (style: BjcpStyle): (AxisPoint | null)[] =>
    RADAR_METRICS.map((m) => {
      const p = m.pair(style);
      if (!p) return null;
      const [lo, hi] = m.domain;
      const norm = (v: number) => clamp01((v - lo) / (hi - lo));
      return { metric: m, min: norm(p[0]), mid: norm(midOf(p)!), max: norm(p[1]) };
    });

  const hovered = hover ? styles.find((s) => s.id === hover) : undefined;

  return (
    <div className="radar" ref={ref}>
      {width > 10 && (
        <svg
          className="chart"
          width={width}
          height={size + 8}
          role="img"
          aria-label={`Profilo complessivo di ${styles.map((s) => s.name).join(', ')}`}
        >
          {/* griglia */}
          {[0.2, 0.4, 0.6, 0.8, 1].map((f) => (
            <polygon key={f} className="chart-grid" points={RADAR_METRICS.map((_, i) => pt(i, radius * f).join(',')).join(' ')} fill="none" />
          ))}
          {RADAR_METRICS.map((_, i) => {
            const [x, y] = pt(i, radius);
            return <line key={i} className="chart-grid" x1={cx} y1={cy} x2={x} y2={y} />;
          })}

          {/* etichette degli assi */}
          {RADAR_METRICS.map((m, i) => {
            const [x, y] = pt(i, radius + 22);
            return (
              <g key={m.key}>
                <text className="radar-axis" x={x} y={y} textAnchor="middle">{m.short}</text>
                <text className="radar-scale" x={x} y={y + 13} textAnchor="middle">
                  {fmt(m.domain[0], m.digits)}–{fmt(m.domain[1], m.digits)}
                </text>
              </g>
            );
          })}

          {/* stili */}
          {styles.map((style, seriesIndex) => {
            if (hidden.has(style.id)) return null;
            const axes = axesOf(style);
            const color = colorOf(style.id);
            const dash = DASH[seriesIndex % DASH.length];
            const dimmed = hover != null && hover !== style.id;
            const present = axes.filter((a): a is AxisPoint => a != null);

            return (
              <g
                key={style.id}
                opacity={dimmed ? 0.12 : 1}
                onPointerEnter={() => setHover(style.id)}
                onPointerLeave={() => setHover(null)}
              >
                {present.length >= 3 && (
                  <polygon
                    points={RADAR_METRICS.map((_, i) => {
                      const a = axes[i];
                      if (!a) return null;
                      return pt(i, radius * a.mid).join(',');
                    }).filter((p): p is string => p != null).join(' ')}
                    style={{ fill: color, stroke: color }}
                    fillOpacity={0.14}
                    strokeWidth={2.5}
                    strokeDasharray={dash}
                    strokeLinejoin="round"
                  />
                )}

                {/* intervalli [min–max] sugli assi */}
                {axes.map((a, i) => {
                  if (!a) return null;
                  const [x1, y1] = pt(i, radius * a.min);
                  const [x2, y2] = pt(i, radius * a.max);
                  return (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: color }} strokeWidth={4} strokeLinecap="round" opacity={0.55} />
                  );
                })}

                {/* punto medio */}
                {axes.map((a, i) => {
                  if (!a) return null;
                  const [x, y] = pt(i, radius * a.mid);
                  return <circle key={i} className="chart-dot" cx={x} cy={y} r={3.2} style={{ fill: color }} />;
                })}
              </g>
            );
          })}
        </svg>
      )}

      <div className="radar-legend">
        {styles.map((style, seriesIndex) => {
          const hasAny = RADAR_METRICS.some((m) => m.pair(style) != null);
          const off = hidden.has(style.id);
          const color = colorOf(style.id);
          return (
            <button
              key={style.id}
              className={`chip ${off ? '' : 'on'}`}
              onClick={() => {
                const next = new Set(hidden);
                if (next.has(style.id)) next.delete(style.id);
                else next.add(style.id);
                setHidden(next);
              }}
              onPointerEnter={() => setHover(style.id)}
              onPointerLeave={() => setHover(null)}
              title={off ? 'Mostra' : 'Nascondi'}
            >
              <i className="dot" style={{ background: color }} />
              <svg className="legend-dash" width="16" height="8" aria-hidden="true">
                <line
                  x1="1" y1="4" x2="15" y2="4"
                  style={{ stroke: color }}
                  strokeWidth="2.5"
                  strokeDasharray={DASH[seriesIndex % DASH.length]}
                />
              </svg>
              {style.code} · {style.name}
              {!hasAny && <em> n.d.</em>}
            </button>
          );
        })}
      </div>

      <p className="radar-caption">
        {hovered
          ? (
            <span>
              <b>{hovered.name}</b>
              {' — '}
              {RADAR_METRICS.map((m) => `${m.short} ${pairLabel(m.pair(hovered), m.unit, m.digits)}`).join(' · ')}
            </span>
          )
          : 'La linea è il valore medio dello stile; il trattino sull\u2019asse è l\u2019intervallo [min–max] dichiarato dal BJCP. OG e FG compaiono solo qui, per dare cinque vertici al pentagono.'}
      </p>
    </div>
  );
}
