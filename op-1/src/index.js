import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App.js';
import API_BASE_URL from './apiConfig.js';

// Helper function to rewrite URLs to point to the Django backend
function resolveBackendUrl(url) {
  if (typeof url !== 'string') return url;

  // 1. Replace http://localhost:8000 or http://127.0.0.1:8000
  if (url.startsWith('http://localhost:8000') || url.startsWith('http://127.0.0.1:8000')) {
    return url.replace(/^http:\/\/(localhost|127\.0\.0\.1):8000/, API_BASE_URL);
  }

  // 2. Route relative backend endpoints (/api/..., /start_interview/, etc.) to backend
  if (
    url.startsWith('/api/') ||
    url.startsWith('/start_interview/') ||
    url.startsWith('/submit_answer/') ||
    url.startsWith('/get_results/') ||
    url.startsWith('/media/')
  ) {
    return `${API_BASE_URL}${url}`;
  }

  return url;
}

// Automatically route all fetch calls
const originalFetch = window.fetch;
window.fetch = function (resource, init) {
  if (typeof resource === 'string') {
    resource = resolveBackendUrl(resource);
  } else if (resource && typeof resource.url === 'string') {
    try {
      resource = new Request(resolveBackendUrl(resource.url), resource);
    } catch {
      // fallback
    }
  }
  return originalFetch.call(this, resource, init);
};

// Automatically route all axios calls
axios.interceptors.request.use((config) => {
  if (config.url) {
    config.url = resolveBackendUrl(config.url);
  }
  return config;
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
