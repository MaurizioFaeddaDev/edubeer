export interface NumericRange { min: number; max: number }

/** Accept partial ranges, clamp to the domain, then order the endpoints. */
export function parseRange(raw: string | null, domain: NumericRange): NumericRange {
  if (!raw) return { ...domain };
  const match = raw.match(/^\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))?\s*(?:-\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))?\s*)?$/);
  if (!match) return { ...domain };
  const clamp = (value: string | undefined, fallback: number) => {
    const number = value === undefined ? fallback : Number(value);
    return Number.isFinite(number) ? Math.max(domain.min, Math.min(domain.max, number)) : fallback;
  };
  const a = clamp(match[1], domain.min), b = clamp(match[2], domain.max);
  return { min: Math.min(a, b), max: Math.max(a, b) };
}
