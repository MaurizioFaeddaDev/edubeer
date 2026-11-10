import { useLayoutEffect, useRef } from 'react';
import { BeerGlass } from './BeerGlass';
import { rangeLabel, srmOf, styleOfBeer } from '../lib/catalog';
import type { BjcpBeer } from '../lib/catalog';
import { beerHref } from '../lib/routes';

// ─────────────────────────────────────────────────────────────────────────────
// La griglia dell'enciclopedia. Una card per birra citata dal BJCP: nome,
// stile di appartenenza e i numeri ufficiali di quello stile. Il bicchiere è
// riempito col colore medio dello stile — non con un dato inventato.
// ─────────────────────────────────────────────────────────────────────────────

export function CatalogView({ beers, limit, onMore }: { beers: BjcpBeer[]; limit: number; onMore: () => void }) {
  const grid = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (pendingFocus.current == null) return;
    grid.current?.querySelectorAll<HTMLAnchorElement>('.bcard-main')[pendingFocus.current]?.focus();
    pendingFocus.current = null;
  }, [limit]);
  if (!beers.length) {
    return (
      <div className="empty">
        <h2>Nessuna birra con questi filtri</h2>
        <p className="dim">
          Il BJCP cita ~600 birre: se il filtro non trova niente, è il filtro a essere
          troppo stretto, non l'enciclopedia a essere vuota.
        </p>
      </div>
    );
  }
  return (
    <>
    <div className="grid" ref={grid}>
      {beers.slice(0, limit).map((b) => {
        const s = styleOfBeer(b);
        if (!s) return null;
        return (
          <article className="bcard" data-family={s.family} key={b.id}>
            <a className="bcard-main" href={beerHref(b.id)}>
              <BeerGlass srm={srmOf(b) ?? 6} level={srmOf(b) == null ? 0 : 1} label={srmOf(b) == null ? 'Colore dello stile non dichiarato' : 'Colore medio dello stile, non della singola birra'} shape="tulipano" size={40} />
              <div className="bcard-text">
                <h3>{b.name}</h3>
                <p className="bcard-style">
                  <span className="bjcp-code">{s.code}</span> {s.name}
                </p>
                <p className="bcard-meta">
                  {s.abv == null && s.ibu == null && s.srm == null
                    ? 'numeri non dichiarati dal BJCP'
                    : (
                      <>
                        <span>{rangeLabel(s.abv, '%')}</span>
                        <span>{rangeLabel(s.ibu, ' IBU')}</span>
                        <span>{s.color ? `SRM ${s.color[0]}–${s.color[1]}` : 'SRM —'}</span>
                      </>
                    )}
                </p>
                <p className="bcard-cat">Intervalli dello stile · {s.category}</p>
              </div>
            </a>
          </article>
        );
      })}
    </div>
    <div className="catalog-pagination"><p className="caption" role="status">Mostrate {Math.min(limit, beers.length)} di {beers.length} birre</p>
      {limit < beers.length && <button className="mini" onClick={() => { pendingFocus.current = limit; onMore(); }}>Mostra altre {Math.min(60, beers.length - limit)} birre</button>}
    </div>
    </>
  );
}
