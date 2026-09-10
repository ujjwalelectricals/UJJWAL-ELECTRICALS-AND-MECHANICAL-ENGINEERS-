import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const nodeGlobal = globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
};
const isVercel = nodeGlobal.process?.env?.VERCEL === '1';

export default defineConfig({
  plugins: [react()],
  base: isVercel ? '/' : '/UJJWAL-ELECTRICALS-AND-MECHANICAL-ENGINEERS-/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/')) return 'three-vendor';
        },
      },
    },
  },
});
