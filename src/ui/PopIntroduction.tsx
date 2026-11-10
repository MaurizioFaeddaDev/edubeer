import { useState } from 'react';
import logo from '../../output/branding/edubeer-pop.png';
import { STYLES } from '../lib/catalog';
import { styleHref } from '../lib/routes';
import { BeerGlass } from './BeerGlass';
import { CompareButton, StyleNumbers } from './StyleElements';

const featured = ['5D', '21A', '25B'].map(code => STYLES.find(style => style.code === code)!);
export function PopIntroduction({ logoSrc = logo }: { logoSrc?: string }) {
  const [text, setText] = useState('');
  const explore = () => {
    document.getElementById('atlante')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return <>
    <section className="pop-hero" aria-labelledby="pop-title">
      <div className="pop-hero-copy"><p className="pop-kicker">L’atlante per menti curiose</p>
        <h1 id="pop-title">C’è un mondo<br/>dentro uno stile.</h1>
        <p className="pop-intro">Chiara, scura, amara… e poi? Scopri cosa rende diversa ogni birra. Parti da una curiosità, trova uno stile, mettilo a confronto.</p>
        <div className="pop-hero-actions"><button className="pop-primary" onClick={explore}>Esplora l’atlante <span aria-hidden="true">↘</span></button><a href="#/confronta">Confronta gli stili ↗</a></div>
        <p className="pop-small">Zero conoscenze richieste. Solo curiosità.</p>
      </div>
      <div className="pop-art"><span className="pop-sticker">Più curiosità,<br/>meno luoghi comuni.</span><img src={logoSrc} width="1254" height="1254" alt="EduBeer: un calice con schiuma e una scintilla, nei colori della palette selezionata" fetchPriority="high"/><span className="pop-art-note">La birra si conosce, un dettaglio alla volta.</span></div>
    </section>
    <section className="pop-search-section" aria-label="Cerca uno stile">
      <div><h2>Da cosa partiamo?</h2><p>Un nome, una famiglia, una curiosità.</p></div>
      <form className="pop-search-form" onSubmit={event => { event.preventDefault(); location.hash = `/?q=${encodeURIComponent(text.trim())}`; requestAnimationFrame(explore); }}>
        <label className="sr-only" htmlFor="pop-search">Cerca uno stile nell’atlante</label>
        <input id="pop-search" type="search" placeholder="Prova “IPA”, “Pils” o “tostato”…" value={text} onChange={event => setText(event.target.value)}/><button type="submit">Cerca <span aria-hidden="true">↗</span></button>
      </form>
    </section>
    <section className="pop-discover" aria-labelledby="pop-discover-title">
      <div className="pop-section-heading"><div><p className="pop-kicker">Tre modi per iniziare</p><h2 id="pop-discover-title">Stessi ingredienti. Altri mondi.</h2></div><p>Tre stili dell’atlante, tre caratteri diversi.<br/>Apri una scheda e scopri il perché.</p></div>
      <div className="pop-cards">{featured.map((style, index) => <article className={`pop-card pop-card-${index}`} key={style.id}>
        <div className="pop-card-art"><span>{style.family} · {style.code}</span><BeerGlass srm={style.srm ?? 6} size={102} shape={index === 0 ? 'boccale' : 'tulipano'}/><span className="pop-spark" aria-hidden="true">✳</span></div>
        <div className="pop-card-body"><h3><a href={styleHref(style.id)}>{style.name}</a></h3><p>{style.blurb}</p><StyleNumbers style={style}/><div className="pop-card-actions"><a href={styleHref(style.id)}>Scopri lo stile ↗</a><CompareButton styleId={style.id}/></div></div>
      </article>)}</div>
      <p className="pop-data-note">I numeri descrivono lo stile, non una singola birra. IBU indica l’amarezza, SRM il colore. Fonte: linee guida BJCP 2021.</p>
    </section>
  </>;
}
