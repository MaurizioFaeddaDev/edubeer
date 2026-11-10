import { srmToHex } from '../lib/color';
import { rangeLabel } from '../lib/catalog';
import { MAX_COMPARE, toggleCompare, useCompare } from '../lib/compare';
import type { BjcpStyle } from '../data/bjcp';

export function CompareButton({ styleId }: { styleId: string }) {
  const ids = useCompare();
  const selected = ids.includes(styleId);
  const full = ids.length >= MAX_COMPARE;
  return <button className={`compare-toggle ${selected ? 'on' : ''}`} onClick={() => toggleCompare(styleId)}
    disabled={!selected && full} aria-pressed={selected}
    aria-label={`${selected ? 'Rimuovi dal confronto' : 'Confronta'} ${styleId}`}
    title={!selected && full ? `Massimo ${MAX_COMPARE} stili: rimuovine uno dal confronto` : undefined}>
    {selected ? 'Nel confronto' : 'Confronta'}
  </button>;
}

export function StyleNumbers({ style: s }: { style: BjcpStyle }) {
  return <dl className="style-numbers">
    <div><dt>Gradazione</dt><dd>{rangeLabel(s.abv, '% vol')}</dd></div>
    <div><dt>Amarezza</dt><dd>{rangeLabel(s.ibu, ' IBU')}</dd></div>
    <div><dt>Colore</dt><dd>{rangeLabel(s.color, ' SRM')}</dd></div>
  </dl>;
}

export function ColorScale({ range }: { range: [number, number] | null }) {
  const samples = [2, 3, 4, 5, 6, 8, 10, 14, 18, 22, 30, 40];
  return <div className="color-scale">
    <div className="color-scale-head"><span>Colore nel bicchiere</span><span>{rangeLabel(range, ' SRM')}</span></div>
    <div className="color-samples" aria-hidden="true">{samples.map((n) => <span key={n}
      className={range && n >= range[0] && n <= range[1] ? 'in-range' : ''}
      style={{ background: srmToHex(n) }} />)}</div>
    <div className="color-scale-labels"><span>Chiaro</span><span>Scuro</span></div>
    {!range && <p className="caption">Il BJCP non dichiara un intervallo di colore per questo stile.</p>}
  </div>;
}
