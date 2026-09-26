import { BeerGlass } from './BeerGlass';
import { rangeLabel, srmOf, styleOfBeer } from '../lib/catalog';
import type { BjcpBeer } from '../lib/catalog';

// ─────────────────────────────────────────────────────────────────────────────
// La griglia dell'enciclopedia. Una card per birra citata dal BJCP: nome,
// stile di appartenenza e i numeri ufficiali di quello stile. Il bicchiere è
// riempito col colore medio dello stile — non con un dato inventato.
// ─────────────────────────────────────────────────────────────────────────────

export function CatalogView({ beers, onOpen }: { beers: BjcpBeer[]; onOpen: (id: string) => void }) {
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
    <div className="grid">
      {beers.map((b) => {
        const s = styleOfBeer(b);
        if (!s) return null;
        return (
          <article className="bcard" key={b.id}>
            <button className="bcard-main" onClick={() => onOpen(b.id)}>
              <BeerGlass srm={srmOf(b) ?? 6} level={1} shape="tulipano" size={40} />
              <div className="bcard-text">
                <h3>{b.name}</h3>
                <p className="bcard-style">
                  <span className="bjcp-code">{s.code}</span> {s.name}
                </p>
                <p className="bcard-meta">
                  {s.abv == null && s.ibu == null && s.srm == null
                    ? 'numeri non dichiarati dal BJCP'
                    : `${rangeLabel(s.abv, '%')} · ${rangeLabel(s.ibu, ' IBU')} · ${s.color ? `SRM ${s.color[0]}–${s.color[1]}` : 'SRM —'}`}
                </p>
                <p className="bcard-cat">{s.category}</p>
              </div>
            </button>
          </article>
        );
      })}
    </div>
  );
}
