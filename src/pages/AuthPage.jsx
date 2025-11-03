import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import './AuthPage.css';

const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="brand-section">
          <h1>🚗 Habal</h1>
          <p className="tagline">Your Local Ride-Hailing Platform</p>
          <div className="features">
            <div className="feature-item">
              <span className="icon">📍</span>
              <span>Real-time Tracking</span>
            </div>
            <div className="feature-item">
              <span className="icon">💰</span>
              <span>Transparent Pricing</span>
            </div>
            <div className="feature-item">
              <span className="icon">🔒</span>
              <span>Safe & Secure</span>
            </div>
          </div>
        </div>

        {isLogin ? (
          <LoginForm 
            onSuccess={onLoginSuccess}
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm 
            onSuccess={onLoginSuccess}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
