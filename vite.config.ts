import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/HabitsTracker/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        docs: 'docs/index.html',  // ← Osobna strona
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
  plugins: [react()],
});