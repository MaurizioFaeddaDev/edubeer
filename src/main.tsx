import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { PopTemplate } from './ui/PopTemplate';
import logo from '../output/branding/edubeer-pop-amarena.png';
import './styles.css';
import './pop.css';
import './pop-palettes.css';
import './amarena.css';

document.documentElement.dataset.popPalette = 'amarena';

createRoot(document.getElementById('root')!).render(
  <>
    <PopTemplate logo={logo} />
    <Analytics />
  </>,
);
