import { CATEGORIES, FAMILIES, STYLES } from '../lib/catalog';
import {
  EMPTY_STYLE_QUERY, STYLE_SORTS, countStyleFilters,
} from '../lib/styleFilter';
import type { StyleQuery } from '../lib/styleFilter';
import { ActiveFilters, DualRange } from './CatalogFilters';
import { MultiSelect } from './MultiSelect';

// ─────────────────────────────────────────────────────────────────────────────
// Pannello filtri della sezione Stili. Stesse faccette del catalogo — famiglia,
// categoria, ABV/IBU/SRM — ma qui il soggetto è lo stile: i numeri sono quelli
// che lo stile dichiara, non quelli di una bottiglia.
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_COUNT = new Map<string, number>(
  CATEGORIES.map((c) => [c.name, c.styles.length]),
);

const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({
  value: c.name,
  label: `${c.id !== 'X' ? `${c.id} · ` : ''}${c.name}`,
  search: c.name,
  count: CATEGORY_COUNT.get(c.name) ?? 0,
}));

export function StyleFilters({
  query, onChange, resultCount,
}: {
  query: StyleQuery;
  onChange: (q: StyleQuery) => void;
  resultCount: number;
}) {
  const active = countStyleFilters(query);
  const toggle = (key: 'categories' | 'families', value: string) => {
    const cur = query[key];
    const next = cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value];
    onChange({ ...query, [key]: next });
  };

  return (
    <div className="filters">
      <div className="filter-block">
        <h3 className="filter-title">Risultati</h3>
        <span className="searchbox-count">
          {resultCount} {resultCount === 1 ? 'stile' : 'stili'} su {STYLES.length}
        </span>
      </div>

      <div className="filter-block">
        <h3 className="filter-title">Ordina</h3>
        <select
          className="select"
          value={query.sort}
          onChange={(e) => onChange({ ...query, sort: e.target.value as StyleQuery['sort'] })}
          aria-label="Ordinamento degli stili"
        >
          {STYLE_SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
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
        <h3 className="filter-title">Numeri dello stile</h3>
        <p className="filter-hint">
          Ogni intervallo è quello ufficiale dichiarato dallo stile. Un filtro mostra
          gli stili che <em>toccano</em> quell'intervallo.
        </p>
        <DualRange
          label="Gradazione" unit="%" step={0.5}
          min={EMPTY_STYLE_QUERY.abv.min} max={EMPTY_STYLE_QUERY.abv.max}
          value={query.abv}
          onChange={(v) => onChange({ ...query, abv: v })}
        />
        <DualRange
          label="Amarezza" unit=" IBU" step={1}
          min={EMPTY_STYLE_QUERY.ibu.min} max={EMPTY_STYLE_QUERY.ibu.max}
          value={query.ibu}
          onChange={(v) => onChange({ ...query, ibu: v })}
        />
        <DualRange
          label="Colore" unit=" SRM" step={1}
          min={EMPTY_STYLE_QUERY.srm.min} max={EMPTY_STYLE_QUERY.srm.max}
          value={query.srm}
          onChange={(v) => onChange({ ...query, srm: v })}
        />
      </div>

      {active > 0 && (
        <div className="filter-block">
          <h3 className="filter-title">Filtri attivi <span className="badge">{active}</span></h3>
          <button className="mini" onClick={() => onChange({ ...EMPTY_STYLE_QUERY })}>azzera tutto</button>
        </div>
      )}
    </div>
  );
}

/** Riepilogo dei filtri attivi sugli stili, con la X per toglierli uno a uno. */
export function ActiveStyleFilters({
  query, onChange,
}: {
  query: StyleQuery;
  onChange: (q: StyleQuery) => void;
}) {
  const items: { label: string; clear: () => void }[] = [];
  if (query.text.trim()) {
    items.push({ label: `«${query.text.trim()}»`, clear: () => onChange({ ...query, text: '' }) });
  }
  for (const f of query.families) {
    items.push({ label: f, clear: () => onChange({ ...query, families: query.families.filter((x) => x !== f) }) });
  }
  if (query.abv.min > EMPTY_STYLE_QUERY.abv.min || query.abv.max < EMPTY_STYLE_QUERY.abv.max) {
    items.push({ label: `ABV ${query.abv.min}–${query.abv.max}%`, clear: () => onChange({ ...query, abv: { ...EMPTY_STYLE_QUERY.abv } }) });
  }
  if (query.ibu.min > EMPTY_STYLE_QUERY.ibu.min || query.ibu.max < EMPTY_STYLE_QUERY.ibu.max) {
    items.push({ label: `IBU ${query.ibu.min}–${query.ibu.max}`, clear: () => onChange({ ...query, ibu: { ...EMPTY_STYLE_QUERY.ibu } }) });
  }
  if (query.srm.min > EMPTY_STYLE_QUERY.srm.min || query.srm.max < EMPTY_STYLE_QUERY.srm.max) {
    items.push({ label: `SRM ${query.srm.min}–${query.srm.max}`, clear: () => onChange({ ...query, srm: { ...EMPTY_STYLE_QUERY.srm } }) });
  }
  return <ActiveFilters items={items} />;
}
