import { AXES, AXIS_IT } from '../data/types';
import type { Axis, Profile } from '../data/types';

// ─────────────────────────────────────────────────────────────────────────────
// Grafico radar a nove assi. È la lettura più immediata di un profilo
// sensoriale e, in confronto, l'unico modo per vedere due birre sovrapporsi.
// ─────────────────────────────────────────────────────────────────────────────

export interface RadarSeries {
  profile: Profile;
  color: string;
  label?: string;
}

interface Props {
  series: RadarSeries[];
  size?: number;
  /** Mostra i valori numerici sui vertici (utile con una sola serie). */
  showValues?: boolean;
}

const RINGS = [1, 2, 3, 4, 5];

/** Il margine deve contenere le etichette, che sui raggi orizzontali sono larghe. */
/** Raggio del disco e spazio per le etichette. Il viewBox si allarga oltre il
 *  quadrato proprio perché sui raggi orizzontali le etichette escono dal disco. */
export function RadarChart({ series, size = 320, showValues = false }: Props) {
  const padX = 58;
  const padY = 14;
  const vbW = size + padX * 2;
  const vbH = size + padY * 2;
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 26;
  const labelRadius = 5.85;

  const point = (i: number, value: number) => {
    const angle = (-Math.PI / 2) + (i * 2 * Math.PI) / AXES.length;
    const r = (value / 5) * R;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] as const;
  };

  const polygon = (p: Profile) =>
    AXES.map((a, i) => point(i, p[a]).join(',')).join(' ');

  return (
    <svg viewBox={`${-padX} ${-padY} ${vbW} ${vbH}`} width="100%" role="img"
      aria-label={`Profilo sensoriale su nove assi${series[0]?.label ? ` di ${series[0].label}` : ''}`}>
      {/* anelli */}
      {RINGS.map((ring) => (
        <polygon
          key={ring}
          points={AXES.map((_, i) => point(i, ring).join(',')).join(' ')}
          fill="none"
          stroke="var(--line-soft)"
          strokeWidth={ring === 5 ? 1.4 : 0.8}
        />
      ))}
      {/* raggi */}
      {AXES.map((a, i) => {
        const [x, y] = point(i, 5);
        return <line key={a} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--line-soft)" strokeWidth="0.8" />;
      })}
      {/* serie */}
      {series.map((s, idx) => (
        <g key={idx}>
          <polygon
            points={polygon(s.profile)}
            fill={s.color}
            fillOpacity={series.length > 1 ? 0.16 : 0.24}
            stroke={s.color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {series.length === 1 && AXES.map((a, i) => {
            const [x, y] = point(i, s.profile[a]);
            return <circle key={a} cx={x} cy={y} r="3" fill={s.color} />;
          })}
        </g>
      ))}
      {/* etichette */}
      {AXES.map((a, i) => {
        const [x, y] = point(i, labelRadius);        return (
          <text
            key={a}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={size < 260 ? 9 : 10.5}
            fontFamily="var(--font-mono)"
            fill="var(--ink-dim)"
          >
            {AXIS_IT[a]}{showValues ? ` ${series[0].profile[a]}` : ''}
          </text>
        );
      })}
    </svg>
  );
}

/** Barre orizzontali: più leggibili del radar quando i valori vanno confrontati. */
export function ProfileBars({
  profile, compare, compact = false,
}: {
  profile: Profile;
  /** Secondo profilo da mostrare come barra fantasma, per il confronto. */
  compare?: Profile;
  compact?: boolean;
}) {
  return (
    <div className={`pbars ${compact ? 'compact' : ''}`}>
      {AXES.map((a: Axis) => (
        <div className="pbar-row" key={a}>
          <span className="pbar-name">{AXIS_IT[a]}</span>
          <span className="pbar-track">
            {compare && (
              <i className="pbar-ghost" style={{ width: `${(compare[a] / 5) * 100}%` }} />
            )}
            <i className={`pbar-fill lv${profile[a]}`} style={{ width: `${(profile[a] / 5) * 100}%` }} />
          </span>
          <span className="pbar-val">{profile[a]}</span>
        </div>
      ))}
    </div>
  );
}
