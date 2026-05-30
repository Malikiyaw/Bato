import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './',
  base: './',
  server: {
    port: 5173,
    open: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'js'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
});
