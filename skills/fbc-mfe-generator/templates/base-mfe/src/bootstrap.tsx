import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const appElement = document.getElementById('app');
if (appElement) {
  const root = createRoot(appElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('[MF Template Bootstrap] ❌ No se encontró elemento #app');
}
