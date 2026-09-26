import { useEffect, useRef, useState } from 'react';

// Larghezza reale del contenitore, osservata via ResizeObserver. Serve per
// disegnare gli SVG responsive senza dipendere da librerie di charting.

export function useSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, width };
}
