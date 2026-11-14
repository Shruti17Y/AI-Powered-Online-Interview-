import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App.js';
import API_BASE_URL from './apiConfig.js';

// Automatically route all fetch calls to the live backend URL
const originalFetch = window.fetch;
window.fetch = function (url, options) {
  if (typeof url === 'string') {
    url = url.replace(/^http:\/\/(localhost|127\.0\.0\.1):8000/, API_BASE_URL);
  }
  return originalFetch.call(this, url, options);
};

// Automatically route all axios calls to the live backend URL
axios.interceptors.request.use((config) => {
  if (config.url) {
    config.url = config.url.replace(/^http:\/\/(localhost|127\.0\.0\.1):8000/, API_BASE_URL);
  }
  return config;
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
