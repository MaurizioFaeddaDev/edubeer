import { useId, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { srmToHex } from '../../lib/color';
import { fmt, pairLabel } from '../../lib/compare';
import type { StyleMetric } from '../../lib/compare';
import type { BjcpStyle } from '../../data/bjcp';
import { useSize } from './useSize';

// ─────────────────────────────────────────────────────────────────────────────
// Barra orizzontale [min–max] per una singola metrica. Uno stile = una riga:
// segmento dal minimo al massimo dichiarato, tacca sul valore medio. Nel
// grafico SRM il segmento usa la tinta reale della birra (gradiente), altrove
// il colore assegnato allo stile. I numeri esatti compaiono al passaggio.
// ─────────────────────────────────────────────────────────────────────────────

const ROW_H = 46;
const PAD_TOP = 12;
const PAD_RIGHT = 16;
const PAD_BOTTOM = 30;

// I colori arrivano dal CSS (.chart-grid/.chart-axis/.chart-mid/.chart-name):
// nei TSX restano solo le struttura e i token delle serie.

const truncate = (s: string, n: number): string => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const safeId = (id: string): string => id.replace(/[^a-zA-Z0-9-]/g, '');

interface Tip {
  x: number;
  y: number;
  style: BjcpStyle;
  value: string;
}

export function RangeBarChart({
  metric, styles, colorOf,
}: {
  metric: StyleMetric;
  styles: BjcpStyle[];
  colorOf: (id: string) => string;
}) {
  const uid = useId().replace(/[:]/g, '');
  const { ref, width } = useSize<HTMLDivElement>();
  const [tip, setTip] = useState<Tip | null>(null);

  const narrow = width < 560;
  const gutter = narrow ? 132 : 186;
  const plotW = Math.max(10, width - gutter - PAD_RIGHT);
  const plotH = styles.length * ROW_H;
  const H = PAD_TOP + plotH + PAD_BOTTOM;

  const [lo, hi] = metric.domain;
  const x = (v: number) => gutter + ((v - lo) / (hi - lo)) * plotW;
  const rowY = (i: number) => PAD_TOP + i * ROW_H + ROW_H / 2;

  const ticks: number[] = [];
  if (metric.tickStep) {
    for (let v = lo; v <= hi + 1e-6; v += metric.tickStep) ticks.push(v);
  }

  const showTip = (e: { clientX: number; clientY: number }, style: BjcpStyle) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setTip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      style,
      value: pairLabel(metric.pair(style), metric.unit, metric.digits),
    });
  };

  const isSrm = metric.key === 'srm';

  return (
    <div className="range-chart" ref={ref}>
      {width > 10 && (
        <svg
          className="chart"
          width={width}
          height={H}
          role="img"
          aria-label={`${metric.label}: confronto degli intervalli ${styles.map((s) => s.name).join(', ')}`}
        >
          <defs>
            {isSrm && styles.map((style) => {
              const pair = metric.pair(style);
              if (!pair) return null;
              return (
                <linearGradient key={style.id} id={`rg-${uid}-${safeId(style.id)}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={srmToHex(pair[0])} />
                  <stop offset="100%" stopColor={srmToHex(pair[1])} />
                </linearGradient>
              );
            })}
          </defs>

          {/* griglia e tick */}
          {ticks.map((t) => (
            <g key={t}>
              <line className="chart-grid" x1={x(t)} y1={PAD_TOP} x2={x(t)} y2={PAD_TOP + plotH} />
              <text className="chart-tick" x={x(t)} y={H - 10} textAnchor="middle">{fmt(t, metric.digits)}</text>
            </g>
          ))}
          <line className="chart-axis" x1={gutter} y1={PAD_TOP + plotH} x2={gutter + plotW} y2={PAD_TOP + plotH} />

          {styles.map((style, i) => {
            const pair = metric.pair(style);
            const cy = rowY(i);
            const color = colorOf(style.id);
            const has = pair != null;
            const minX = has ? x(pair[0]) : gutter;
            const maxX = has ? x(pair[1]) : gutter;
            const midX = pair ? x((pair[0] + pair[1]) / 2) : gutter;

            return (
              <g
                key={style.id}
                onPointerEnter={(e: ReactPointerEvent) => showTip(e, style)}
                onPointerMove={(e: ReactPointerEvent) => showTip(e, style)}
                onPointerLeave={() => setTip(null)}
              >
                <rect x={0} y={cy - ROW_H / 2} width={width} height={ROW_H} fill="transparent" />
                <text className="chart-label" x={0} y={cy} dominantBaseline="central">
                  <tspan className="chart-code" fontWeight={700}>{style.code}</tspan>
                  <tspan dx={6} className="chart-name">{truncate(style.name, narrow ? 16 : 26)}</tspan>
                </text>

                {has ? (
                  <g>
                    <rect
                      className="chart-bar"
                      x={minX} y={cy - 6} width={Math.max(2, maxX - minX)} height={12} rx={2}
                      style={{ fill: isSrm ? `url(#rg-${uid}-${safeId(style.id)})` : color }}
                    />
                    <circle className="chart-dot" cx={minX} cy={cy} r={3} style={{ fill: isSrm ? srmToHex(pair[0]) : color }} />
                    <circle className="chart-dot" cx={maxX} cy={cy} r={3} style={{ fill: isSrm ? srmToHex(pair[1]) : color }} />
                    <line className="chart-mid-halo" x1={midX} y1={cy - 9} x2={midX} y2={cy + 9} strokeWidth={6} />
                    <line className="chart-mid" x1={midX} y1={cy - 9} x2={midX} y2={cy + 9} strokeWidth={2.5} />
                  </g>
                ) : (
                  <text className="chart-label chart-note" x={gutter + 6} y={cy} dominantBaseline="central">n.d.</text>
                )}
              </g>
            );
          })}
        </svg>
      )}

      {tip && (
        <div
          className="chart-tip"
          style={{ left: Math.min(tip.x + 14, width - 170), top: tip.y + 12 }}
          role="status"
        >
          <div className="chart-tip-name">{tip.style.code} · {tip.style.name}</div>
          <div className="chart-tip-val">{tip.value}</div>
        </div>
      )}
    </div>
  );
}
