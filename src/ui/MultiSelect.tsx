import { useEffect, useId, useMemo, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Filtro a selezione multipla, con ricerca integrata. Usato per le categorie:
// sono 34 e una lista di chip sempre aperta costringeva a scorrere. Il pannello
// è in-flow (non assoluto) perché il pannello filtri vive in un contenitore che
// scrolla e ritaglierebbe un dropdown posizionato. Il trigger mostra solo il
// numero di voci selezionate: l'elenco completo compare nel tooltip (title).
// ─────────────────────────────────────────────────────────────────────────────

export type MultiSelectOption = {
  /** Valore salvato nella query (es. il nome della categoria). */
  value: string;
  /** Testo mostrato: già comprensivo del codice, es. «3 · Czech Lager». */
  label: string;
  /** Testo su cui cercare, se diverso dalla label. */
  search?: string;
  /** Contatore opzionale mostrato a destra. */
  count?: number;
};

const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

export function MultiSelect({
  label, options, selected, onChange,
  placeholder = 'Tutte', searchPlaceholder = 'Cerca…',
}: {
  /** Nome al plurale, per le etichette di accessibilità (es. «categorie»). */
  label: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const wrap = useRef<HTMLDivElement>(null);
  const listId = useId();

  const filtered = useMemo(() => {
    const q = norm(term.trim());
    if (!q) return options;
    return options.filter((o) => norm(o.search ?? o.label).includes(q));
  }, [options, term]);

  // Chiudi cliccando fuori.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // Il pannello può aprirsi in fondo alla sidebar: portalo in vista.
  useEffect(() => {
    if (open) wrap.current?.scrollIntoView({ block: 'nearest' });
  }, [open]);

  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };
  const selectVisible = () => onChange([...new Set([...selected, ...filtered.map((o) => o.value)])]);
  // Riepilogo testuale delle selezioni, mostrato al passaggio del mouse.
  const selectedLabels = useMemo(
    () => selected.map((v) => options.find((o) => o.value === v)?.label ?? v),
    [selected, options],
  );

  return (
    <div className="ms" ref={wrap}>
      <button
        type="button"
        className={`ms-trigger ${open ? 'open' : ''}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        title={selected.length ? selectedLabels.join(' · ') : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`ms-value ${selected.length ? '' : 'dim'}`}>
          {selected.length
            ? `${selected.length} ${selected.length === 1 ? 'selezionata' : 'selezionate'}`
            : placeholder}
        </span>
        <span className="ms-caret" aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className="ms-panel">
          <div className="searchbox ms-search">
            <input
              type="search"
              value={term}
              placeholder={searchPlaceholder}
              aria-label={`Cerca tra le ${label}`}
              autoFocus
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
              }}
            />
          </div>

          <div className="ms-actions">
            <button type="button" className="mini" onClick={selectVisible} disabled={filtered.length === 0}>
              Seleziona tutti
            </button>
            <button type="button" className="mini" onClick={() => onChange([])} disabled={selected.length === 0}>
              Azzera
            </button>
            <span className="ms-count dim">{filtered.length} su {options.length}</span>
          </div>

          <div className="ms-list" id={listId} role="listbox" aria-multiselectable="true" aria-label={label}>
            {filtered.map((o) => {
              const on = selected.includes(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={on}
                  className={`ms-option ${on ? 'on' : ''}`}
                  onClick={() => toggle(o.value)}
                >
                  <span className="ms-check" aria-hidden="true">{on ? '✓' : ''}</span>
                  <span className="ms-label">{o.label}</span>
                  {o.count != null && <em className="ms-badge">{o.count}</em>}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="ms-empty dim">Nessuna voce per «{term}».</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
