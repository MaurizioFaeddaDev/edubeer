import App from '../App';
import { PopGlassContext } from './BeerGlass';
import { PopIntroduction } from './PopIntroduction';

function chooseMotion(target: EventTarget, related: EventTarget | null) {
  if (!(target instanceof Element)) return;
  const card = target.closest<HTMLElement>('.style-entry, .bcard, .pop-card');
  if (!card || (related instanceof Node && card.contains(related))) return;
  const previous = Number(card.dataset.glassMotion ?? -1);
  card.dataset.glassMotion = String((previous + 1 + Math.floor(Math.random() * 4)) % 5);
}

export function PopTemplate({ logo, preview = false }: { logo: string; preview?: boolean }) {
  return <PopGlassContext.Provider value={true}><div onPointerOver={event => chooseMotion(event.target, event.relatedTarget)} onFocusCapture={event => chooseMotion(event.target, event.relatedTarget)}>
    <App preview={preview} brandGraphic={<span className="pop-brand-lockup" aria-hidden="true"><span className="pop-brand-icon"><img src={logo} alt="" /></span><span className="pop-brand-wordmark"><img src={logo} alt="" /></span></span>} introduction={<PopIntroduction logoSrc={logo} />} />
  </div></PopGlassContext.Provider>;
}
