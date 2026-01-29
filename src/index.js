import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import logger from './utils/logger';

window.__CONTENTSTACK_CONFIG__ = {
  apiKey: process.env.REACT_APP_CONTENTSTACK_API_KEY,
  environment: process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT || 'development',
};

logger.group('Application Initialization');
logger.info(`API Key: ${window.__CONTENTSTACK_CONFIG__.apiKey ? 'Configured' : 'Missing'}`);
logger.info(`Environment: ${window.__CONTENTSTACK_CONFIG__.environment}`);
logger.groupEnd();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
