import { AXES, AXIS_IT } from '../data/types';
import type { BeerSpecies } from '../data/types';
import { BeerGlass } from './BeerGlass';
import { RadarChart, ProfileBars } from './RadarChart';
import { srmToHex, intensityWord, darken } from '../lib/color';
import { styleOf, similarTo, ALL, ABV_RANGE, IBU_RANGE, SRM_RANGE, speciesOf } from '../lib/beer';
import { getDescriptor } from '../data/descriptors';

// ─────────────────────────────────────────────────────────────────────────────
// La scheda completa. È lo stesso contenuto del BirraDex di gioco, ma qui non
// c'è niente da sbloccare: un'enciclopedia che nasconde le voci è un gioco.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  species: BeerSpecies;
  onOpen: (id: string) => void;
  onCompare: (id: string) => void;
  onSameProfile: (id: string) => void;
}

/** Percentile di un valore rispetto al corpus: "più amara dell'85% dell'archivio". */
function percentile(pick: (s: BeerSpecies) => number, value: number): number {
  const sorted = ALL.map(pick).sort((a, b) => a - b);
  return sorted.filter((v) => v <= value).length / sorted.length;
}

export function DetailView({ species, onOpen, onCompare, onSameProfile }: Props) {
  const style = styleOf(species);
  const color = srmToHex(species.srm);
  const highAxis = AXES.reduce((b, a) => (species.profile[a] > species.profile[b] ? a : b), AXES[0]);
  const lowAxis = AXES.reduce((b, a) => (species.profile[a] < species.profile[b] ? a : b), AXES[0]);
  const similar = similarTo(species, 5);

  // I descrittori della specie, deduplicati, in ordine di livello di apprendimento.
  const descriptors = species.learnset
    .filter((l, i, arr) => arr.findIndex((x) => x.descriptor === l.descriptor) === i)
    .sort((a, b) => a.level - b.level);

  return (
    <article className="detail">
      <header className="detail-head" style={{ borderTopColor: color }}>
        <div className="detail-glass">
          <BeerGlass srm={species.srm} level={1} shape="calice" size={78} />
        </div>
        <div className="detail-title">
          <span className="detail-num">Scheda #{String(species.dexNumber).padStart(3, '0')}</span>
          <h1>{species.name}</h1>
          <p className="detail-style">
            <b>{style.name}</b> · famiglia {style.family}
          </p>
          <p className="detail-origin">
            {species.country} — {species.origin}{species.year ? ` · ${species.year}` : ''}
          </p>
          <div className="detail-actions">
            <button className="mini" onClick={() => onCompare(species.id)}>aggiungi al confronto</button>
            <button className="mini" onClick={() => onSameProfile(species.id)}>cerca profili simili</button>
          </div>
        </div>
      </header>

      <section className="detail-specs">
        <BigSpec label="Gradazione" value={`${species.abv}%`} sub="ABV" pct={percentile((s) => s.abv, species.abv)} range={ABV_RANGE} />
        <BigSpec label="Amaro" value={String(species.ibu)} sub="IBU" pct={percentile((s) => s.ibu, species.ibu)} range={IBU_RANGE} />
        <BigSpec label="Colore" value={String(species.srm)} sub="SRM" pct={percentile((s) => s.srm, species.srm)} range={SRM_RANGE} swatch={color} />
      </section>

      <section className="detail-cols">
        <div className="detail-col">
          <h2>Profilo sensoriale</h2>
          <RadarChart series={[{ profile: species.profile, color, label: species.name }]} showValues size={300} />
          <p className="caption">
            Nove assi da 0 a 5. La firma di questa birra è <b>{AXIS_IT[highAxis]}</b> ({intensityWord(species.profile[highAxis])}),
            mentre <b>{AXIS_IT[lowAxis]}</b> è {intensityWord(species.profile[lowAxis])}. Quando in degustazione
            descrivi una birra, sono i due assi su cui è più facile sbagliare.
          </p>
        </div>
        <div className="detail-col">
          <h2>Valori</h2>
          <ProfileBars profile={species.profile} />
          <h2 style={{ marginTop: 'var(--s5)' }}>Il profilo dello stile</h2>
          <p className="blurb">{style.blurb}</p>
        </div>
      </section>

      <section className="prose">
        <h2>Storia</h2>
        <p>{species.history}</p>

        <div className="prose-grid">
          <div>
            <h3>Abbinamento</h3>
            <p>{species.pairing}</p>
          </div>
          <div>
            <h3>Nota da esperto</h3>
            <p className="fact">{species.fact}</p>
          </div>
        </div>
      </section>

      <section className="detail-descriptors">
        <h2>Descrittori che la descrivono</h2>
        <p className="dim">
          Ogni descrittore è un'affermazione che un degustatore può fare davanti al bicchiere. La spiegazione
          è la parte che conta: dice da dove viene quella nota.
        </p>
        <ul className="desc-list">
          {descriptors.map((l) => {
            const d = getDescriptor(l.descriptor);
            const present = d.axis ? species.profile[d.axis] : null;
            return (
              <li key={l.descriptor} className={present === 0 ? 'absent' : ''}>
                <div className="desc-head">
                  <b>{d.name}</b>
                  {d.axis && (
                    <span className={`desc-axis lvl${present}`}>
                      {AXIS_IT[d.axis]} {present}/5 — {intensityWord(present ?? 0)}
                    </span>
                  )}
                  {d.kind === 'attack' && <span className="desc-pow">potenza {d.power} · precisione {d.accuracy}%</span>}
                </div>
                <p className="desc-why">{d.why}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="detail-similar">
        <h2>Birre dal profilo simile</h2>
        <p className="dim">
          Distanza calcolata sui nove assi, corretta dalla differenza di gradazione. Serve a rispondere alla
          domanda vera: «questa mi piace, cos'altro assomiglia?».
        </p>
        <div className="similar-list">
          {similar.map(({ species: s, score }) => (
            <button key={s.id} className="similar-card" onClick={() => onOpen(s.id)}>
              <BeerGlass srm={s.srm} level={1} shape="tulipano" size={34} />
              <div className="similar-text">
                <b>{s.name}</b>
                <span className="dim">{styleOf(s).name} · {s.country}</span>
              </div>
              <span className="similar-score" title="Somiglianza di profilo">{Math.round(score * 100)}%</span>
              <span className="similar-bar" aria-hidden="true">
                <i style={{ width: `${score * 100}%`, background: darken(color, 0.1) }} />
              </span>
            </button>
          ))}
        </div>
      </section>
    </article>
  );
}

function BigSpec({
  label, value, sub, pct, range, swatch,
}: {
  label: string; value: string; sub: string; pct: number;
  range: { min: number; max: number }; swatch?: string;
}) {
  return (
    <div className="bigspec">
      <div className="bigspec-head">
        <span className="bigspec-label">{label}</span>
        <span className="bigspec-value">
          {swatch && <i className="swatch" style={{ background: swatch }} />}
          {value} <em>{sub}</em>
        </span>
      </div>
      <div className="bigspec-track">
        <i style={{ width: `${Math.max(4, pct * 100)}%` }} />
      </div>
      <p className="bigspec-note">
        {pct >= 0.95 ? 'il valore più alto dell\'archivio'
          : pct >= 0.75 ? `più alto del ${Math.round(pct * 100)}% delle birre in archivio`
            : pct <= 0.1 ? 'fra i valori più bassi dell\'archivio'
              : `al ${Math.round(pct * 100)}° percentile dell'archivio`}
        {' '}(intervallo {range.min}–{range.max})
      </p>
    </div>
  );
}

/** Collega un id del birramon alla scheda, se esiste. */
export function speciesOrNull(id: string) {
  return speciesOf(id) ?? null;
}
