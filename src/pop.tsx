import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import App from './App';
import { PopIntroduction } from './ui/PopIntroduction';
import './styles.css';
import './pop.css';
import './pop-palettes.css';
import './amarena.css';
import originalLogo from '../output/branding/edubeer-pop.png';
import pistacchioLogo from '../output/branding/edubeer-pop-pistacchio.png';
import elettricaLogo from '../output/branding/edubeer-pop-elettrica.png';
import pomodoroLogo from '../output/branding/edubeer-pop-pomodoro.png';
import maltoLogo from '../output/branding/edubeer-pop-malto.png';
import amarenaLogo from '../output/branding/edubeer-pop-amarena.png';
import cacaoLogo from '../output/branding/edubeer-pop-cacao.png';
import lavandaLogo from '../output/branding/edubeer-pop-lavanda.png';
import fanzineLogo from '../output/branding/edubeer-pop-fanzine.png';

const logos: Record<string, string> = { original: originalLogo, pistacchio: pistacchioLogo, elettrica: elettricaLogo, pomodoro: pomodoroLogo, malto: maltoLogo, amarena: amarenaLogo, cacao: cacaoLogo, lavanda: lavandaLogo, fanzine: fanzineLogo };

const palettes = [
  { id: 'original', name: 'Originale', colors: ['#fff7e3', '#591477', '#ffd13c', '#ff785f'] },
  { id: 'pistacchio', name: 'Pistacchio & inchiostro', colors: ['#f3f5df', '#243b36', '#d6ee58', '#fba783'] },
  { id: 'elettrica', name: 'Rosa elettrico', colors: ['#fff0f4', '#2534a5', '#e5f85b', '#ff99bc'] },
  { id: 'pomodoro', name: 'Azzurro & pomodoro', colors: ['#edf7fa', '#a52d25', '#ffcf63', '#a8dce5'] },
  { id: 'malto', name: 'Malto & petrolio', colors: ['#fff2d5', '#00545b', '#ffbc47', '#f8a08f'] },
  { id: 'amarena', name: 'Amarena & burro', colors: ['#fff5d6', '#7b193d', '#f5ba42', '#e4aed0'] },
  { id: 'cacao', name: 'Cacao & menta', colors: ['#fff0e5', '#4e2b25', '#f8a657', '#acdcca'] },
  { id: 'lavanda', name: 'Lavanda & oliva', colors: ['#f0eafa', '#444d23', '#dbdf71', '#f5ad91'] },
  { id: 'fanzine', name: 'Fanzine agrumata', colors: ['#f5f1e9', '#252839', '#ffab63', '#a6c9f5'] },
];
const paletteNotes: Record<string, string> = {
  original: 'Il punto di partenza: crema, viola, giallo birra e corallo. Il più vicino al primo logo Instagram.',
  pistacchio: 'Verde inchiostro, lime e pesca: naturale e contemporanea, con accenti vivaci.',
  elettrica: 'Blu intenso, rosa e lime: la direzione più elettrica e pop.',
  pomodoro: 'Rosso pomodoro su azzurro: un contrasto caldo/freddo dal carattere rétro.',
  malto: 'Petrolio e ambra su crema: il richiamo più diretto alla birra, con un contrasto fresco.',
  amarena: 'Template scelto: Amarena & burro. Apertura pop, schede chiare e accenti amarena per esplorare.',
  cacao: 'Cacao, menta e albicocca: richiama tostature e ingredienti, con un tono morbido.',
  lavanda: 'Oliva scuro su lavanda, cedro e albicocca: botanica e inattesa. La più sperimentale.',
  fanzine: 'Carta, inchiostro, mandarino e azzurro: un’impronta da magazine indipendente, con dati in primo piano.',
};
const initial = new URLSearchParams(location.search).get('palette');
const initialPalette = palettes.some(palette => palette.id === initial) ? initial! : 'amarena';
document.documentElement.dataset.popPalette = initialPalette;
document.querySelector('meta[name="theme-color"]')?.setAttribute('content', palettes.find(palette => palette.id === initialPalette)!.colors[0]);

function PopPreview() {
  const [selected, setSelected] = useState(initialPalette);
  return <>
    <details className="palette-workbench">
      <summary>Template: Amarena & burro <span>Confronta le palette</span></summary>
      <div className="palette-picker" role="group" aria-label="Palette della proposta">
      <div className="palette-options">{palettes.map(palette => <button key={palette.id} aria-pressed={selected === palette.id} onClick={() => {
        setSelected(palette.id);
        document.documentElement.dataset.popPalette = palette.id;
        const url = new URL(location.href);
        url.searchParams.set('palette', palette.id);
        history.replaceState(null, '', url);
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', palette.colors[0]);
      }}><span className="palette-swatches" aria-hidden="true">{palette.colors.map(color => <i key={color} style={{ background: color }} />)}</span>{palette.name}</button>)}</div>
      <p className="palette-note" aria-live="polite">{paletteNotes[selected]} Anche il logo segue la palette.</p>
      </div>
    </details>
    <App preview introduction={<PopIntroduction logoSrc={logos[selected]} />} />
  </>;
}
createRoot(document.getElementById('root')!).render(<PopPreview />);
