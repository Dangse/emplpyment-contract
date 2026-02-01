import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Map process.env.API_KEY to window.env.API_KEY for runtime injection support
    'process.env.API_KEY': 'window.env.API_KEY'
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});