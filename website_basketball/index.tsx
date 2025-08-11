import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('index.tsx module loaded');

try {
  const rootElement = document.getElementById('root');
  console.log('Root element found:', rootElement);
  
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  const root = ReactDOM.createRoot(rootElement);
  console.log('React root created');
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('React rendering initiated');
} catch (error: any) {
  console.error('Error initializing React application:', error);
  // Add visible error display
  const errorDiv = document.createElement('div');
  errorDiv.style.backgroundColor = '#2D3748';
  errorDiv.style.color = 'white';
  errorDiv.style.padding = '1rem';
  errorDiv.style.margin = '1rem';
  errorDiv.style.borderRadius = '0.5rem';
  errorDiv.style.border = '1px solid #F97316';
  errorDiv.innerHTML = `<h3>React Initialization Error</h3><pre>${error?.message || String(error)}</pre>`;
  document.body.appendChild(errorDiv);
}
