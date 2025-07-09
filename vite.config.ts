import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: 3173,
    allowedHosts: ['wedding.infoportal.news', 'www.wedding.infoportal.news'],
  },
  resolve: {
    alias: {
      '@': '/src',
      '@contracts': '/src/api',
    },
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
