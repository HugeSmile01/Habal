import React, { useState, useEffect } from 'react';
import { onAuthChange } from './services/authService';
import { signOut } from './services/authService';
import AuthPage from './pages/AuthPage';
import PassengerPage from './pages/PassengerPage';
import DriverPage from './pages/DriverPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthChange(async (authUser) => {
      if (authUser) {
        // User is signed in, get their profile
        const { getCurrentUserProfile } = await import('./services/authService');
        const result = await getCurrentUserProfile(authUser.uid);
        if (result.success) {
          setUser(result.user);
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading Habal...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Route to appropriate dashboard based on user type
  if (user.userType === 'driver') {
    return <DriverPage user={user} onLogout={handleLogout} />;
  } else {
    return <PassengerPage user={user} onLogout={handleLogout} />;
  }
}

export default App;
