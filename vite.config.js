import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Niente vite-plugin-pwa: manifest e sw gestiti manualmente in public/
// Più semplice, più prevedibile, nessun conflitto di registrazione SW
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Cloudflare Pages si aspetta dist/
    sourcemap: false,
  }
});
