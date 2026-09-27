import { defineConfig } from 'vitest/config';

// T-003 — test dev-only sulla logica pura di `src/lib/`.
// Ambiente `node`: le funzioni sotto test non toccano il DOM (le dipendenze
// browser, come localStorage, vengono stubate nei singoli test). Nessun impatto
// sul bundle di produzione: vitest non entra mai in `vite build`.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/lib/**/*.test.ts'],
  },
});
