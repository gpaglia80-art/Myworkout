import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './WorkoutApp';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registra il service worker (public/sw.js → servito come /sw.js)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(r => console.log('SW registered', r.scope))
      .catch(e => console.warn('SW error', e));
  });
}
