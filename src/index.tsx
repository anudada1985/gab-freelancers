import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill process.env for browser compatibility if it doesn't exist
// This prevents "ReferenceError: process is not defined" in some libraries or code paths
if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = { env: {} };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
