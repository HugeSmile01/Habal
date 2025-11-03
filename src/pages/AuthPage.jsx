import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import About from '../components/About';
import './AuthPage.css';

const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="brand-section">
          <div className="logo-container">
            <img src="/Habal.svg" alt="Habal Logo" className="brand-logo" />
          </div>
          <h1>Habal</h1>
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
          <button className="about-btn" onClick={() => setShowAbout(true)}>
            About Habal
          </button>
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

      {/* Footer with copyright */}
      <footer className="auth-footer">
        <p>© {new Date().getFullYear()} Habal. All rights reserved.</p>
        <p>Developed by <strong>John Rish Ladica</strong></p>
      </footer>

      {/* About Modal */}
      {showAbout && <About onClose={() => setShowAbout(false)} />}
    </div>
  );
};

export default AuthPage;
