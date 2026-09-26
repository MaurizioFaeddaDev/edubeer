import { useEffect, useMemo, useRef, useState } from 'react';
import { suggestBeers, styleOfBeer } from '../lib/catalog';
import { suggestStyles } from '../lib/styleFilter';

// ─────────────────────────────────────────────────────────────────────────────
// La ricerca dell'app, in navbar. Un solo campo per tutto: mentre scrivi filtra
// la lista che hai davanti (birre o stili) e apre un elenco di scorciatoie
// raggruppate — uno stile, una birra — da cui saltare subito alla scheda.
// Invio cerca la parola nel catalogo delle birre.
// ─────────────────────────────────────────────────────────────────────────────

export function SearchBar({
  value, onChange, onSubmit, onOpenBeer, onOpenStyle,
}: {
  value: string;
  onChange: (v: string) => void;
  /** Invio: cerca il testo nel catalogo delle birre. */
  onSubmit: (v: string) => void;
  onOpenBeer: (id: string) => void;
  onOpenStyle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const term = value.trim();

  const styles = useMemo(() => (open ? suggestStyles(term, 5) : []), [term, open]);
  const beers = useMemo(() => (open ? suggestBeers(term, 6) : []), [term, open]);
  const empty = styles.length === 0 && beers.length === 0;

  // Chiudi cliccando fuori.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div className="topsearch" ref={wrap}>
      <div className="searchbox">
        <input
          type="search"
          placeholder="Cerca birre, stili, categorie…"
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); setOpen(false); onSubmit(value); }
            if (e.key === 'Escape') { setOpen(false); (e.target as HTMLInputElement).blur(); }
          }}
          aria-label="Cerca nella guida e nel catalogo"
          aria-expanded={open && term.length > 0}
          role="combobox"
          aria-controls="search-suggestions"
          autoComplete="off"
        />
        <kbd>/</kbd>
      </div>

      {open && term.length > 0 && (
        <div className="search-pop" id="search-suggestions" role="listbox">
          <div className="search-results">
            {styles.length > 0 && (
              <div className="search-group">
                <span className="search-group-title">Stili</span>
                {styles.map((s) => (
                  <button
                    key={s.id}
                    className="search-hit"
                    role="option"
                    aria-selected={false}
                    onClick={() => { setOpen(false); onOpenStyle(s.id); }}
                  >
                    <code className="bjcp-code">{s.code}</code>
                    <span className="hit-name">{s.name}</span>
                    <span className="hit-sub">{s.category}</span>
                  </button>
                ))}
              </div>
            )}

            {beers.length > 0 && (
              <div className="search-group">
                <span className="search-group-title">Birre citate dal BJCP</span>
                {beers.map((b) => {
                  const s = styleOfBeer(b);
                  return (
                    <button
                      key={b.id}
                      className="search-hit"
                      role="option"
                      aria-selected={false}
                      onClick={() => { setOpen(false); onOpenBeer(b.id); }}
                    >
                      <span className="hit-name">{b.name}</span>
                      <span className="hit-sub">{s ? `${s.code} · ${s.name}` : ''}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {empty && <p className="search-empty dim">Nessuna birra o stile con «{term}».</p>}
          </div>

          <button className="search-all" onClick={() => { setOpen(false); onSubmit(value); }}>
            Cerca «{term}» tra tutte le birre →
          </button>
        </div>
      )}
    </div>
  );
}
