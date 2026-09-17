import { useState } from 'react';
import { AXES, AXIS_IT } from '../data/types';
import type { BeerSpecies } from '../data/types';
import { BeerGlass } from './BeerGlass';
import { axisColor, axisTextColor, srmToHex, intensityWord } from '../lib/color';
import { styleOf, signatureAxis, findSnippet, ALL } from '../lib/beer';
import type { Query } from '../lib/query';

// ─────────────────────────────────────────────────────────────────────────────
// Due letture dello stesso corpus:
//   · griglia — per esplorare, ogni birra con il suo bicchiere del colore reale
//   · tabella — per confrontare: i nove assi in colonna, tutte le birre in riga
// La tabella è la vista che serve davvero a chi studia.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  species: BeerSpecies[];
  snippetFor: string;
  onOpen: (id: string) => void;
  onCompare: (id: string) => void;
  compareIds: string[];
  /** Suggerimenti di allargamento quando la ricerca è vuota. */
  relaxations: { label: string; query: Query; count: number }[];
  onRelax: (q: Query) => void;
  onReset: () => void;
}

export function IndexView({
  species, snippetFor, onOpen, onCompare, compareIds, relaxations, onRelax, onReset,
}: Props) {
  const [view, setView] = useState<'griglia' | 'tabella'>(() => {
    const v = new URLSearchParams(location.hash.split('?')[1] ?? '').get('vista');
    return v === 'tabella' ? 'tabella' : 'griglia';
  });

  if (!species.length) {
    return (
      <div className="empty">
        <h2>Nessuna birra soddisfa questi criteri</h2>
        <p className="dim">
          Il BirraDex contiene trenta birre: non tutte le combinazioni di nove assi esistono davvero. Ecco
          da dove puoi allargare, con il numero di risultati che otterresti.
        </p>
        <div className="relax-list">
          {relaxations.map((r, i) => (
            <button key={i} className="relax" onClick={() => onRelax(r.query)}>
              <b>{r.label}</b>
              <span>{r.count} {r.count === 1 ? 'risultato' : 'risultati'}</span>
            </button>
          ))}
          <button className="relax wide" onClick={onReset}>
            <b>azzera tutti i filtri</b>
            <span>{ALL.length} risultati</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="index">
      <div className="view-switch">
        <span className="dim">{species.length} birre</span>
        <div className="segmented">
          <button className={view === 'griglia' ? 'on' : ''} onClick={() => setView('griglia')}>Griglia</button>
          <button className={view === 'tabella' ? 'on' : ''} onClick={() => setView('tabella')}>Tabella assi</button>
        </div>
      </div>

      {view === 'griglia'
        ? (
          <div className="grid">
            {species.map((s) => (
              <GridCard
                key={s.id} species={s} snippet={findSnippet(s, snippetFor)}
                onOpen={onOpen} onCompare={onCompare} selected={compareIds.includes(s.id)}
              />
            ))}
          </div>
        )
        : <AxisTable species={species} onOpen={onOpen} />}
    </div>
  );
}

function GridCard({
  species, snippet, onOpen, onCompare, selected,
}: {
  species: BeerSpecies; snippet: string | null;
  onOpen: (id: string) => void; onCompare: (id: string) => void; selected: boolean;
}) {
  const style = styleOf(species);
  const sig = signatureAxis(species);
  return (
    <article className={`gcard ${selected ? 'selected' : ''}`}>
      <button className="gcard-main" onClick={() => onOpen(species.id)}>
        <header>
          <BeerGlass srm={species.srm} level={1} shape="tulipano" size={46} />
          <div className="gcard-head-text">
            <span className="gcard-num">#{String(species.dexNumber).padStart(3, '0')}</span>
            <h3>{species.name}</h3>
            <p className="gcard-style">{style.name} · {style.family}</p>
            <p className="gcard-origin">{species.country} · {species.origin}</p>
          </div>
        </header>

        <div className="gcard-specs">
          <span>{species.abv}% ABV</span>
          <span>{species.ibu} IBU</span>
          <span>{species.srm} SRM</span>
        </div>

        <div className="gcard-axis">
          <span className="gcard-axis-label">firma</span>
          <span className="gcard-axis-name">{AXIS_IT[sig]}</span>
          <span className="gcard-axis-word">{intensityWord(species.profile[sig])} ({species.profile[sig]}/5)</span>
        </div>

        <div className="gcard-pips">
          {AXES.map((a) => (
            <i
              key={a}
              title={`${AXIS_IT[a]}: ${species.profile[a]}/5`}
              style={{ background: axisColor(species.profile[a]), color: axisTextColor(species.profile[a]) }}
            >
              {species.profile[a] || ''}
            </i>
          ))}
        </div>

        {snippet && <p className="gcard-snippet">{snippet}</p>}
      </button>

      <footer className="gcard-foot">
        <button className="mini" onClick={() => onOpen(species.id)}>scheda completa</button>
        <button className={`mini ${selected ? 'on' : ''}`} onClick={() => onCompare(species.id)}>
          {selected ? 'in confronto ✓' : 'confronta'}
        </button>
      </footer>
    </article>
  );
}

function AxisTable({ species, onOpen }: { species: BeerSpecies[]; onOpen: (id: string) => void }) {
  return (
    <div className="table-wrap">
      <table className="axis-table">
        <thead>
          <tr>
            <th className="col-num">#</th>
            <th className="col-name">Birra</th>
            <th className="col-stile">Stile</th>
            <th className="col-paese">Paese</th>
            <th className="col-num2">ABV</th>
            <th className="col-num2">IBU</th>
            <th className="col-num2">SRM</th>
            {AXES.map((a) => <th key={a} className="col-axis" title={AXIS_IT[a]}>{AXIS_IT[a].slice(0, 4)}</th>)}
          </tr>
        </thead>
        <tbody>
          {species.map((s) => (
            <tr key={s.id} onClick={() => onOpen(s.id)} tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onOpen(s.id)}>
              <td className="col-num dim">{String(s.dexNumber).padStart(3, '0')}</td>
              <td className="col-name">
                <span className="swatch" style={{ background: srmToHex(s.srm) }} />
                <b>{s.name}</b>
              </td>
              <td className="col-stile dim">{styleOf(s).name}</td>
              <td className="col-paese dim">{s.country}</td>
              <td className="col-num2">{s.abv}%</td>
              <td className="col-num2">{s.ibu}</td>
              <td className="col-num2">{s.srm}</td>
              {AXES.map((a) => (
                <td key={a} className="col-axis">
                  <span
                    className="cell"
                    style={{ background: axisColor(s.profile[a]), color: axisTextColor(s.profile[a]) }}
                    title={`${s.name} · ${AXIS_IT[a]}: ${s.profile[a]}/5 (${intensityWord(s.profile[a])})`}
                  >
                    {s.profile[a] || '·'}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="table-note dim">
        Ogni cella è l'intensità di un asse da 0 a 5. Scorri in orizzontale per confrontare le trenta birre
        su un asse solo: è il modo più rapido per vedere che «scuro» e «amaro» non sono la stessa cosa.
      </p>
    </div>
  );
}
