// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { store } from './redux/store'; // Импортируем Redux store

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>  {/* Оборачиваем приложение в Provider */}
      <App />
    </Provider>
  </StrictMode>,
);

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/DIA_2024_Front/serviceWorker.js')
      .then((registration) => {
        console.log('Service Worker зарегистрирован: ', registration);
      })
      .catch((error) => {
        console.error('Service Worker не зарегистрирован: ', error);
      });
  });
}
