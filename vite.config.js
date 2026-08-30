import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages hosts this repository under /UJJWAL-ELECTRICALS-AND-MECHANICAL-ENGINEERS-/.
// Vite must know that public base path so production assets load instead of returning a blank page.
export default defineConfig({
  base: '/UJJWAL-ELECTRICALS-AND-MECHANICAL-ENGINEERS-/',
  plugins: [react()],
  build: {
    sourcemap: false,
  },
});
