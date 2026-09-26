import { CATEGORIES, FAMILIES, STYLES, SORTS, EMPTY_CATALOG, countActiveFilters } from '../lib/catalog';
import type { CatalogQuery, NumRange } from '../lib/catalog';
import { MultiSelect } from './MultiSelect';

// ─────────────────────────────────────────────────────────────────────────────
// Pannello filtri dell'enciclopedia. Niente assi: si filtra per ciò che il
// BJCP sa davvero — categoria, famiglia, stile e i tre numeri che descrivono
// uno stile (ABV, IBU, SRM). Gli intervalli sono quelli dello stile: la birra
// eredita il range, quindi un filtro «ABV ≥ 8» mostra gli stili forti.
// La ricerca testuale vive nella navbar: qui restano i filtri a faccette.
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_BEERS = new Map<string, number>(CATEGORIES.map((c) => [c.name, c.styles.length]));

const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({
  value: c.name,
  label: `${c.id !== 'X' ? `${c.id} · ` : ''}${c.name}`,
  search: c.name,
  count: CATEGORY_BEERS.get(c.name) ?? 0,
}));

export function CatalogFilters({
  query, onChange, resultCount,
}: {
  query: CatalogQuery;
  onChange: (q: CatalogQuery) => void;
  resultCount: number;
}) {
  const active = countActiveFilters(query);
  const toggle = (key: 'categories' | 'families' | 'styles', value: string) => {
    const cur = query[key];
    const next = cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value];
    onChange({ ...query, [key]: next });
  };

  return (
    <div className="filters">
      <div className="filter-block">
        <h3 className="filter-title">Risultati</h3>
        <span className="searchbox-count">
          {resultCount} {resultCount === 1 ? 'birra' : 'birre'} su {STYLES.length} stili BJCP
        </span>
      </div>

      <div className="filter-block">
        <h3 className="filter-title">Ordina</h3>
        <select
          className="select"
          value={query.sort}
          onChange={(e) => onChange({ ...query, sort: e.target.value as CatalogQuery['sort'] })}
          aria-label="Ordinamento"
        >
          {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <div className="filter-block">
        <h3 className="filter-title">Famiglia</h3>
        <div className="chips">
          {FAMILIES.map((f) => (
            <button
              key={f}
              className={`chip ${query.families.includes(f) ? 'on' : ''}`}
              onClick={() => toggle('families', f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <h3 className="filter-title">
          Categoria
          {query.categories.length > 0 && <span className="badge">{query.categories.length}</span>}
        </h3>
        <MultiSelect
          label="categorie"
          placeholder="Tutte le categorie"
          searchPlaceholder="Cerca categoria…"
          options={CATEGORY_OPTIONS}
          selected={query.categories}
          onChange={(next) => onChange({ ...query, categories: next })}
        />
      </div>

      <div className="filter-block">
        <h3 className="filter-title">
          Stile
          {query.styles.length > 0 && <span className="badge">{query.styles.length}</span>}
        </h3>
        <div className="chips scroll">
          {STYLES.map((s) => (
            <button
              key={s.id}
              className={`chip ${query.styles.includes(s.id) ? 'on' : ''}`}
              onClick={() => toggle('styles', s.id)}
              title={`${s.code} ${s.name}`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <h3 className="filter-title">Numeri dello stile</h3>
        <p className="filter-hint">
          Ogni birra eredita l'intervallo ufficiale del suo stile. Un filtro mostra le
          birre il cui stile <em>tocca</em> quell'intervallo.
        </p>
        <DualRange
          label="Gradazione" unit="%" step={0.5}
          min={EMPTY_CATALOG.abv.min} max={EMPTY_CATALOG.abv.max}
          value={query.abv}
          onChange={(v) => onChange({ ...query, abv: v })}
        />
        <DualRange
          label="Amarezza" unit=" IBU" step={1}
          min={EMPTY_CATALOG.ibu.min} max={EMPTY_CATALOG.ibu.max}
          value={query.ibu}
          onChange={(v) => onChange({ ...query, ibu: v })}
        />
        <DualRange
          label="Colore" unit=" SRM" step={1}
          min={EMPTY_CATALOG.srm.min} max={EMPTY_CATALOG.srm.max}
          value={query.srm}
          onChange={(v) => onChange({ ...query, srm: v })}
        />
      </div>

      {active > 0 && (
        <div className="filter-block">
          <h3 className="filter-title">Filtri attivi <span className="badge">{active}</span></h3>
          <button className="mini" onClick={() => onChange({ ...EMPTY_CATALOG })}>azzera tutto</button>
        </div>
      )}
    </div>
  );
}

export function DualRange({
  label, unit, min, max, step, value, onChange,
}: {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: NumRange;
  onChange: (v: NumRange) => void;
}) {
  const span = max - min || 1;
  const lo = Math.min(Math.max(value.min, min), max);
  const hi = Math.min(Math.max(value.max, min), max);
  const left = ((lo - min) / span) * 100;
  const right = 100 - ((hi - min) / span) * 100;
  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));
  return (
    <div className="dual-field">
      <div className="dual-head">
        <span className="dual-label">{label}</span>
        <span className="dual-value">{fmt(lo)}–{fmt(hi)}{unit}</span>
      </div>
      <div className="dual">
        <div className="track" />
        <div className="sel" style={{ left: `${left}%`, right: `${right}%` }} />
        <input
          type="range" min={min} max={max} step={step} value={lo}
          onChange={(e) => onChange({ min: Math.min(Number(e.target.value), value.max), max: value.max })}
          aria-label={`${label} minimo`}
        />
        <input
          type="range" min={min} max={max} step={step} value={hi}
          onChange={(e) => onChange({ min: value.min, max: Math.max(Number(e.target.value), value.min) })}
          aria-label={`${label} massimo`}
        />
      </div>
    </div>
  );
}

/** Riga di chip riutilizzabile: un filtro attivo per chip, con la X. */
export function ActiveFilters({ items }: { items: { label: string; clear: () => void }[] }) {
  if (!items.length) return null;
  return (
    <div className="active-filters">
      <span className="dim">Filtri:</span>
      {items.map((it, i) => (
        <button key={`${it.label}-${i}`} className="chip on" onClick={it.clear} title="Rimuovi">
          {it.label} <em>×</em>
        </button>
      ))}
    </div>
  );
}

/** Riepilogo dei filtri attivi, con la X per toglierli uno a uno. */
export function ActiveCatalogFilters({
  query, onChange,
}: {
  query: CatalogQuery;
  onChange: (q: CatalogQuery) => void;
}) {
  const items: { label: string; clear: () => void }[] = [];
  if (query.text.trim()) {
    items.push({ label: `«${query.text.trim()}»`, clear: () => onChange({ ...query, text: '' }) });
  }
  for (const f of query.families) {
    items.push({ label: f, clear: () => onChange({ ...query, families: query.families.filter((x) => x !== f) }) });
  }
  for (const sid of query.styles) {
    const st = STYLES.find((x) => x.id === sid);
    items.push({
      label: st ? `${st.code} · ${st.name}` : sid,
      clear: () => onChange({ ...query, styles: query.styles.filter((x) => x !== sid) }),
    });
  }
  if (query.abv.min > EMPTY_CATALOG.abv.min || query.abv.max < EMPTY_CATALOG.abv.max) {
    items.push({ label: `ABV ${query.abv.min}–${query.abv.max}%`, clear: () => onChange({ ...query, abv: { ...EMPTY_CATALOG.abv } }) });
  }
  if (query.ibu.min > EMPTY_CATALOG.ibu.min || query.ibu.max < EMPTY_CATALOG.ibu.max) {
    items.push({ label: `IBU ${query.ibu.min}–${query.ibu.max}`, clear: () => onChange({ ...query, ibu: { ...EMPTY_CATALOG.ibu } }) });
  }
  if (query.srm.min > EMPTY_CATALOG.srm.min || query.srm.max < EMPTY_CATALOG.srm.max) {
    items.push({ label: `SRM ${query.srm.min}–${query.srm.max}`, clear: () => onChange({ ...query, srm: { ...EMPTY_CATALOG.srm } }) });
  }
  return <ActiveFilters items={items} />;
}
