import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2022',
    rollupOptions: {
      input: { main: 'index.html', original: 'original.html' },
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/')) return 'vendor';
          if (/\/src\/data\/bjcp(?:-beers)?\.ts$/.test(id)) return 'bjcp';
        },
      },
    },
  },
});
