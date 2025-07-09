import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/gokderek',
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
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
