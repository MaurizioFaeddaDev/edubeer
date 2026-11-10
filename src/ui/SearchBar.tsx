import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { suggestBeers, styleOfBeer } from '../lib/catalog';
import { suggestStyles } from '../lib/styleFilter';
import { beerHref, styleHref } from '../lib/routes';

export function SearchBar({ value, onChange, onSubmit, onOpenBeer, onOpenStyle }: { value: string; onChange: (v: string) => void; onSubmit: (v: string) => void; onOpenBeer: (id: string) => void; onOpenStyle: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(!!value);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(-1);
  const wrap = useRef<HTMLDivElement>(null);
  const listId = useId();
  const term = value.trim();
  const items = useMemo(() => !term || !open ? [] : [
    ...suggestStyles(term, 5).map(s => ({ id: s.id, name: s.name, sub: s.code, kind: 'style' as const, href: styleHref(s.id) })),
    ...suggestBeers(term, 6).map(b => ({ id: b.id, name: b.name, sub: styleOfBeer(b)?.name ?? '', kind: 'beer' as const, href: beerHref(b.id) })),
  ], [term, open]);
  const visible = open && term.length > 0;
  const expand = () => { setExpanded(true); setOpen(true); requestAnimationFrame(() => input.current?.focus()); };
  const collapse = () => { setOpen(false); setExpanded(false); setActive(-1); trigger.current?.focus(); };
  const activeItem = items[active];
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);
  const choose = (index: number) => {
    const item = items[index]; if (!item) return;
    setOpen(false); setActive(-1);
    if (item.kind === 'style') onOpenStyle(item.id); else onOpenBeer(item.id);
  };
  return <div className={`topsearch ${expanded ? 'search-expanded' : ''}`} ref={wrap} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) { setOpen(false); if (!value) setExpanded(false); } }}>
    <div className="searchbox">
      <button ref={trigger} type="button" className="search-trigger" aria-label={expanded ? 'Chiudi ricerca' : 'Apri ricerca'} aria-expanded={expanded} aria-controls={`${listId}-input`} title="Cerca (/)" onClick={() => expanded ? collapse() : expand()}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>
      </button>
      <div className="search-field"><input ref={input} id={`${listId}-input`} tabIndex={expanded ? 0 : -1} type="search" placeholder="Cerca birre o stili…" value={value} onChange={e => { onChange(e.target.value); setOpen(true); setActive(-1); }} onFocus={() => { setExpanded(true); setOpen(true); }}
      onKeyDown={e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive(i => items.length ? Math.min(i + 1, items.length - 1) : -1); }
        if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, -1)); }
        if (e.key === 'Enter') { e.preventDefault(); if (visible && activeItem) choose(active); else { setOpen(false); onSubmit(value); } }
        if (e.key === 'Escape') { e.preventDefault(); collapse(); }
      }} aria-label="Cerca nella guida e nel catalogo" role="combobox" aria-expanded={visible} aria-autocomplete="list" aria-controls={visible ? listId : undefined} aria-activedescendant={visible && activeItem ? `${listId}-${active}` : undefined} autoComplete="off" /></div></div>
    {visible && <div className="search-pop"><div id={listId} role="listbox" aria-label="Risultati della ricerca" className="search-results">{items.length ? items.map((item, index) => <a className={`search-hit ${active === index ? 'active' : ''}`} key={`${item.kind}-${item.id}`} id={`${listId}-${index}`} href={item.href} role="option" tabIndex={-1} aria-selected={active === index} onClick={e => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); choose(index); } }}>
      <span className="hit-name">{item.name}</span><span className="hit-sub">{item.kind === 'style' ? `Stile ${item.sub}` : `Birra · ${item.sub}`}</span></a>) : <p className="search-empty dim" role="status">Nessuna birra o stile trovato.</p>}</div><button className="search-all" onClick={() => { setOpen(false); onSubmit(value); }}>Cerca «{term}» nel catalogo birre</button></div>}
  </div>;
}
