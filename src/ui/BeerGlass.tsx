import { useId } from 'react';
import { srmToHex, lighten, darken } from '../lib/color';

// ─────────────────────────────────────────────────────────────────────────────
// Il bicchiere è disegnato in SVG e riempito con il colore reale dell'SRM.
// Il livello del liquido segue il palato: quando il palato cede, il bicchiere
// si svuota. È la sola lettura di stato che serve durante un duello.
// ─────────────────────────────────────────────────────────────────────────────

export type GlassShape = 'boccale' | 'tulipano' | 'calice' | 'snifter';

interface Shape {
  /** Contorno esterno del bicchiere. */
  outline: string;
  /** Interno: dove scorre la birra. */
  bowl: string;
  /** Y del bordo superiore del liquido quando è pieno. */
  topY: number;
  /** Y del fondo del liquido. */
  bottomY: number;
}

const SHAPES: Record<GlassShape, Shape> = {
  // Pinta: dritta, svasata, senza fronzoli. Il bicchiere che non aiuta nessuno.
  boccale: {
    outline: 'M18 8 L82 8 L74 186 Q73 195 64 195 L36 195 Q27 195 26 186 Z',
    bowl: 'M23 13 L77 13 L70 184 Q69 191 62 191 L38 191 Q31 191 30 184 Z',
    topY: 15,
    bottomY: 190,
  },
  // Tulipano: si allarga e poi stringe il bordo, per raccogliere gli esteri.
  tulipano: {
    outline: 'M26 12 C16 44 14 84 40 118 L60 118 C86 84 84 44 74 12 Z '
      + 'M46 118 L46 166 L54 166 L54 118 Z '
      + 'M28 166 C38 174 62 174 72 166 L72 176 C62 184 38 184 28 176 Z',
    bowl: 'M28 14 C19 45 18 82 41 114 L59 114 C82 82 81 45 72 14 Z',
    topY: 17,
    bottomY: 114,
  },
  // Calice: bocca larga, stelo lungo. Serve a far respirare le birre forti.
  calice: {
    outline: 'M22 12 C12 40 10 82 40 110 L60 110 C90 82 88 40 78 12 Z '
      + 'M46 110 L46 172 L54 172 L54 110 Z '
      + 'M20 172 C34 182 66 182 80 172 L80 184 C66 194 34 194 20 184 Z',
    bowl: 'M25 15 C16 42 15 80 41 106 L59 106 C85 80 84 42 75 15 Z',
    topY: 18,
    bottomY: 106,
  },
  // Snifter: pancia tonda e bocca stretta.
  snifter: {
    outline: 'M34 26 C16 46 10 96 42 138 L58 138 C90 96 84 46 66 26 Z '
      + 'M46 138 L46 176 L54 176 L54 138 Z '
      + 'M28 176 C38 184 62 184 72 176 L72 186 C62 194 38 194 28 186 Z',
    bowl: 'M37 30 C21 49 16 94 43 134 L57 134 C84 94 79 49 63 30 Z',
    topY: 33,
    bottomY: 134,
  },
};

interface Props {
  srm: number;
  /** 0 = bicchiere vuoto (palato a zero), 1 = pieno. */
  level?: number;
  shape?: GlassShape;
  size?: number;
  /** Mostra la schiuma. */
  head?: boolean;
  className?: string;
  label?: string;
}

/** I bicchieri sono disegnati su una griglia 100×200: li schiaccio in verticale
 *  per avvicinarli alle proporzioni reali (una pinta vera è ~1:1,7, non 1:3). */
const VSCALE = 0.74;
const VH = 200 * VSCALE;

export function BeerGlass({
  srm, level = 1, shape = 'boccale', size = 96, head = true, className, label,
}: Props) {
  const uid = useId().replace(/[:]/g, '');
  const s = SHAPES[shape];
  const liquid = srmToHex(srm);
  const clipId = `clip-${uid}`;
  const gradId = `grad-${uid}`;

  const span = s.bottomY - s.topY;
  const top = s.bottomY - span * Math.max(0, Math.min(1, level));
  const foamHeight = head && level > 0.02 ? Math.min(10, span * 0.12) : 0;

  return (
    <div
      className={`glass-wrap ${className ?? ''}`}
      style={{ width: size, height: size * (VH / 100) }}
    >
      <svg
        viewBox={`0 0 100 ${VH}`}
        width={size}
        height={size * (VH / 100)}
        role="img"
        aria-label={label ?? 'Bicchiere di birra'}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={s.bowl} />
          </clipPath>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={darken(liquid, 0.22)} />
            <stop offset="35%" stopColor={lighten(liquid, 0.16)} />
            <stop offset="70%" stopColor={liquid} />
            <stop offset="100%" stopColor={darken(liquid, 0.3)} />
          </linearGradient>
        </defs>

        <g transform={`scale(1, ${VSCALE})`}>
          <g clipPath={`url(#${clipId})`}>
            {/* liquido */}
            <rect x="0" y={top} width="100" height={200 - top} fill={`url(#${gradId})`} />
            {/* schiuma */}
            {foamHeight > 0 && (
              <g>
                <rect x="0" y={top} width="100" height={foamHeight} fill="#fdf8e4" />
                <circle cx="18" cy={top + foamHeight} r="5" fill="#fdf8e4" />
                <circle cx="36" cy={top + foamHeight + 2} r="7" fill="#fdf8e4" />
                <circle cx="55" cy={top + foamHeight} r="6" fill="#fdf8e4" />
                <circle cx="74" cy={top + foamHeight + 2} r="5" fill="#fdf8e4" />
              </g>
            )}
            {/* bollicine */}
            <circle cx="40" cy={s.bottomY - 24} r="1.6" fill="rgba(255,255,255,0.5)" />
            <circle cx="58" cy={s.bottomY - 42} r="1.3" fill="rgba(255,255,255,0.45)" />
            <circle cx="48" cy={s.bottomY - 60} r="1.1" fill="rgba(255,255,255,0.4)" />
          </g>

          {/* vetro */}
          <path
            d={s.outline}
            fill="rgba(255,255,255,0.07)"
            stroke="#e8f0d0"
            strokeWidth="2.2"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* riflesso */}
          <path d={s.bowl} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  );
}

/** Barra del palato, compatta, per liste e HUD. */
export function PalateBar({ value, max, width = 90 }: { value: number; max: number; width?: number }) {
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const tone = pct > 0.5 ? 'ok' : pct > 0.2 ? 'warn' : 'danger';
  return (
    <div className="palate" style={{ width }} title={`Palato ${Math.round(value)}/${max}`}>
      <div className={`palate-fill ${tone}`} style={{ width: `${pct * 100}%` }} />
    </div>
  );
}
