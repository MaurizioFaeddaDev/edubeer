import { useEffect, useState } from 'react';

type Theme = 'system' | 'light' | 'dark';
const key = 'edubeer-theme';
const valid = (value: string | null): Theme => value === 'light' || value === 'dark' ? value : 'system';

export function ThemeSelect() {
  const [theme, setTheme] = useState<Theme>(() => {
    try { return valid(localStorage.getItem(key)); } catch { return 'system'; }
  });
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const resolved = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
      document.documentElement.dataset.theme = resolved;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#151c1e' : '#fafcfc');
    };
    const sync = (event: StorageEvent) => {
      if (event.key === key || event.key === null) setTheme(valid(event.newValue));
    };
    apply();
    media.addEventListener('change', apply);
    window.addEventListener('storage', sync);
    return () => { media.removeEventListener('change', apply); window.removeEventListener('storage', sync); };
  }, [theme]);
  return <div className="theme-control" role="group" aria-label="Tema">
    {(['system', 'light', 'dark'] as const).map(value => {
      const label = { system: 'Sistema', light: 'Chiaro', dark: 'Scuro' }[value];
      return <button key={value} type="button" className="theme-button" aria-label={`Tema ${label.toLowerCase()}`} aria-pressed={theme === value} title={label} onClick={() => {
        setTheme(value);
        try { localStorage.setItem(key, value); } catch { /* Keep the choice for this session. */ }
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {value === 'system' && <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></>}
          {value === 'light' && <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42m0-14.14-1.42 1.42m-11.3 11.3-1.42 1.42" /></>}
          {value === 'dark' && <path d="M20.9 13.2A9 9 0 0 1 10.8 3.1 9 9 0 1 0 20.9 13.2Z" />}
        </svg>
      </button>;
    })}
  </div>;
}
