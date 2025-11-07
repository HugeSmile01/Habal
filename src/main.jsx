import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';
import { logEnvironmentStatus } from './config/env.validation.js';

// Validate environment configuration on startup
logEnvironmentStatus();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
