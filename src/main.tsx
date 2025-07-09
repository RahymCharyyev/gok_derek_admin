import App from '@/App.tsx';
import '@/i18n.ts';
import '@/index.css';
import { Providers } from '@/Providers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
