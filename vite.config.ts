import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/admin',
  plugins: [react()],
  preview: {
    host: true,
    port: 4173,
    allowedHosts: ['tm-cargo.com.tm', 'www.tm-cargo.com.tm'],
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
