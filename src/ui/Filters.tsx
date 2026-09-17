import { AXES, AXIS_IT, AXIS_DESC } from '../data/types';
import type { Axis, BeerStyleId } from '../data/types';
import { STYLES } from '../data/styles';
import { COUNTRIES, FAMILIES, ABV_RANGE, IBU_RANGE, SRM_RANGE, STYLE_LIST, ALL, axisDistribution } from '../lib/beer';
import { PRESETS, EMPTY_QUERY, countAxisConstraints, toParams, type Query, type SortKey } from '../lib/query';

// ─────────────────────────────────────────────────────────────────────────────
// Pannello dei filtri. Tre livelli, dal più usato al più preciso:
//   1. ricerca testuale e ricerche pronte
//   2. facet (famiglia, paese, stile)
//   3. vincoli numerici: ABV/IBU/SRM e i nove assi del profilo
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  query: Query;
  onChange: (q: Query) => void;
  resultCount: number;
}

export function Filters({ query, onChange, resultCount }: Props) {
  const set = <K extends keyof Query>(key: K, value: Query[K]) => onChange({ ...query, [key]: value });

  const toggleIn = (key: 'families' | 'countries' | 'styles', value: string) => {
    const cur = query[key];
    set(key, cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]);
  };

  const setAxis = (axis: Axis, patch: Partial<{ min: number; max: number }>) => {
    const next = { ...query.axes[axis], ...patch };
    if (next.min > next.max) {
      if (patch.min !== undefined) next.max = next.min;
      else next.min = next.max;
    }
    onChange({ ...query, axes: { ...query.axes, [axis]: next } });
  };

  return (
    <aside className="filters">
      <div className="filter-block">
        <SearchBox value={query.text} onChange={(t) => set('text', t)} count={resultCount} />
      </div>

      <div className="filter-block">
        <h3 className="filter-title">Ricerche pronte</h3>
        <div className="preset-list">
          {PRESETS.map((p) => (
            <button key={p.id} className="preset" onClick={() => onChange(p.apply(query))} title={p.hint}>
              <b>{p.label}</b>
              <span>{p.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <h3 className="filter-title">Famiglia di stile</h3>
        <div className="chips">
          {FAMILIES.map((f) => (
            <button
              key={f}
              className={`chip ${query.families.includes(f) ? 'on' : ''}`}
              onClick={() => toggleIn('families', f)}
            >
              {f}
              <em>{ALL.filter((s) => s.style && styleFamily(s.style) === f).length}</em>
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <h3 className="filter-title">Paese</h3>
        <div className="chips">
          {COUNTRIES.map((c) => (
            <button
              key={c}
              className={`chip ${query.countries.includes(c) ? 'on' : ''}`}
              onClick={() => toggleIn('countries', c)}
            >
              {c}
              <em>{ALL.filter((s) => s.country === c).length}</em>
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <h3 className="filter-title">Stile preciso</h3>
        <div className="chips scroll">
          {STYLE_LIST.map((st) => {
            const n = ALL.filter((s) => s.style === st.id).length;
            if (!n) return null;
            return (
              <button
                key={st.id}
                className={`chip ${query.styles.includes(st.id) ? 'on' : ''}`}
                onClick={() => toggleIn('styles', st.id)}
              >
                {st.name}<em>{n}</em>
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-block">
        <h3 className="filter-title">Parametri</h3>
        <DualRange
          label="ABV" unit="%" min={ABV_RANGE.min} max={ABV_RANGE.max} step={0.1}
          value={query.abv} onChange={(v) => set('abv', v)}
        />
        <DualRange
          label="IBU" unit="" min={IBU_RANGE.min} max={IBU_RANGE.max} step={1}
          value={query.ibu} onChange={(v) => set('ibu', v)}
        />
        <DualRange
          label="SRM" unit="" min={SRM_RANGE.min} max={SRM_RANGE.max} step={1}
          value={query.srm} onChange={(v) => set('srm', v)}
        />
      </div>

      <div className="filter-block">
        <h3 className="filter-title">
          Profilo sensoriale
          {countAxisConstraints(query) > 0 && <span className="badge">{countAxisConstraints(query)}</span>}
          <button className="mini" onClick={() => onChange(resetAxes(query))}>azzera</button>
        </h3>
        <p className="filter-hint">
          Imposta un minimo (<b>≥</b>) o un massimo (<b>≤</b>) su ciascun asse. Clicca il valore attivo per
          toglierlo. L'istogramma mostra quante birre hanno quel valore.
        </p>
        <div className="axis-matrix">
          {AXES.map((a) => (
            <AxisRow
              key={a}
              axis={a}
              value={query.axes[a]}
              onChange={(patch) => setAxis(a, patch)}
            />
          ))}
        </div>
      </div>

      <div className="filter-block">
        <h3 className="filter-title">Ordinamento</h3>
        <select className="select" value={query.sort} onChange={(e) => set('sort', e.target.value as SortKey)}>
          <option value="dex">Numero di scheda</option>
          <option value="name">Nome (A–Z)</option>
          <option value="rilevanza">Aderenza al profilo cercato</option>
          <option value="abv-asc">Gradazione crescente</option>
          <option value="abv-desc">Gradazione decrescente</option>
          <option value="ibu-desc">Amaro (IBU) decrescente</option>
          <option value="srm-desc">Colore (SRM) decrescente</option>
          {AXES.map((a) => (
            <option key={a} value={`axis-${a}`}>{AXIS_IT[a]} decrescente</option>
          ))}
        </select>
      </div>
    </aside>
  );
}

const styleFamily = (id: BeerStyleId) => STYLES[id].family;

function resetAxes(q: Query): Query {
  return { ...q, axes: EMPTY_QUERY.axes, sort: q.sort === 'rilevanza' ? 'dex' : q.sort };
}

// ── Ricerca testuale ────────────────────────────────────────────────────────

function SearchBox({ value, onChange, count }: { value: string; onChange: (v: string) => void; count: number }) {
  return (
    <div className="searchbox">
      <input
        type="search"
        placeholder="Cerca: nome, stile, paese, storia, abbinamento…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Escape') onChange(''); }}
        aria-label="Cerca nel BirraDex"
      />
      <kbd>/</kbd>
      <span className="searchbox-count">{count} {count === 1 ? 'risultato' : 'risultati'}</span>
    </div>
  );
}

// ── Intervallo doppio ───────────────────────────────────────────────────────

function DualRange({
  label, unit, min, max, step, value, onChange,
}: {
  label: string; unit: string; min: number; max: number; step: number;
  value: { min: number; max: number };
  onChange: (v: { min: number; max: number }) => void;
}) {
  const span = max - min || 1;
  const left = ((value.min - min) / span) * 100;
  const right = 100 - ((value.max - min) / span) * 100;
  return (
    <div className="dual-field">
      <div className="dual-head">
        <span className="dual-label">{label}</span>
        <span className="dual-value">
          {value.min}{unit} – {value.max}{unit}
        </span>
      </div>
      <div className="dual">
        <div className="track" />
        <div className="sel" style={{ left: `${left}%`, right: `${right}%` }} />
        <input
          type="range" min={min} max={max} step={step} value={value.min}
          onChange={(e) => onChange({ min: Number(e.target.value), max: Math.max(Number(e.target.value), value.max) })}
          aria-label={`${label} minimo`}
        />
        <input
          type="range" min={min} max={max} step={step} value={value.max}
          onChange={(e) => onChange({ min: Math.min(value.min, Number(e.target.value)), max: Number(e.target.value) })}
          aria-label={`${label} massimo`}
        />
      </div>
    </div>
  );
}

// ── Riga di un asse: due selettori a 6 valori ───────────────────────────────

function AxisRow({
  axis, value, onChange,
}: {
  axis: Axis;
  value: { min: number; max: number };
  onChange: (patch: Partial<{ min: number; max: number }>) => void;
}) {
  const dist = axisDistribution(axis);
  const peak = Math.max(1, ...dist);
  return (
    <div className="axis-row" title={AXIS_DESC[axis]}>
      <span className="axis-row-name">{AXIS_IT[axis]}</span>
      <div className="axis-hist" aria-hidden="true">
        {dist.map((n, v) => (
          <i key={v} style={{ height: `${(n / peak) * 100}%` }} className={v >= value.min && v <= value.max ? 'in' : ''} />
        ))}
      </div>
      <div className="axis-select">
        <span className="axis-op">≥</span>
        {[0, 1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            className={`dot ${value.min === v && v > 0 ? 'on' : ''}`}
            onClick={() => onChange({ min: value.min === v ? 0 : v })}
            aria-label={`${AXIS_IT[axis]} almeno ${v}`}
            disabled={v > value.max}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="axis-select">
        <span className="axis-op">≤</span>
        {[0, 1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            className={`dot ${value.max === v && v < 5 ? 'on' : ''}`}
            onClick={() => onChange({ max: value.max === v ? 5 : v })}
            aria-label={`${AXIS_IT[axis]} al massimo ${v}`}
            disabled={v < value.min}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Riepilogo dei filtri attivi, con rimozione puntuale. */
export function ActiveFilters({ query, onChange }: { query: Query; onChange: (q: Query) => void }) {
  const items: { label: string; clear: () => void }[] = [];
  if (query.text.trim()) items.push({ label: `“${query.text.trim()}”`, clear: () => onChange({ ...query, text: '' }) });
  query.families.forEach((f) => items.push({ label: `famiglia: ${f}`, clear: () => onChange({ ...query, families: query.families.filter((x) => x !== f) }) }));
  query.countries.forEach((c) => items.push({ label: `paese: ${c}`, clear: () => onChange({ ...query, countries: query.countries.filter((x) => x !== c) }) }));
  query.styles.forEach((s) => items.push({ label: `stile: ${STYLES[s as BeerStyleId]?.name ?? s}`, clear: () => onChange({ ...query, styles: query.styles.filter((x) => x !== s) }) }));
  AXES.forEach((a) => {
    const r = query.axes[a];
    if (r.min > 0) items.push({ label: `${AXIS_IT[a]} ≥ ${r.min}`, clear: () => onChange({ ...query, axes: { ...query.axes, [a]: { ...r, min: 0 } } }) });
    if (r.max < 5) items.push({ label: `${AXIS_IT[a]} ≤ ${r.max}`, clear: () => onChange({ ...query, axes: { ...query.axes, [a]: { ...r, max: 5 } } }) });
  });
  if (query.abv.min > 0 || query.abv.max < 20) items.push({ label: `ABV ${query.abv.min}–${query.abv.max}%`, clear: () => onChange({ ...query, abv: { ...EMPTY_QUERY.abv } }) });
  if (query.ibu.min > 0 || query.ibu.max < 120) items.push({ label: `IBU ${query.ibu.min}–${query.ibu.max}`, clear: () => onChange({ ...query, ibu: { ...EMPTY_QUERY.ibu } }) });
  if (query.srm.min > 0 || query.srm.max < 50) items.push({ label: `SRM ${query.srm.min}–${query.srm.max}`, clear: () => onChange({ ...query, srm: { ...EMPTY_QUERY.srm } }) });

  if (!items.length) return null;
  return (
    <div className="active-filters">
      <span className="dim">Filtri attivi:</span>
      {items.map((it, i) => (
        <button key={i} className="chip on" onClick={it.clear} title="Rimuovi">
          {it.label}<em>×</em>
        </button>
      ))}
      <button className="chip ghost" onClick={() => onChange({ ...EMPTY_QUERY })}>azzera tutto</button>
      <ShareLink query={query} />
    </div>
  );
}

function ShareLink({ query }: { query: Query }) {
  const path = `#/${toParams(query)}`;
  return (
    <button
      className="chip ghost"
      onClick={() => { navigator.clipboard?.writeText(`${location.origin}${location.pathname}${path}`); }}
      title="Copia il link di questa ricerca"
    >
      copia link
    </button>
  );
}
