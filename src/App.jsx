import React, { useState, useEffect } from 'react';
import { onAuthChange } from './services/authService';
import { signOut } from './services/authService';
import { requestNotificationPermission, onForegroundMessage, showNotification, saveFCMToken } from './services/notificationService';
import { showInfo } from './utils/sweetAlert';
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
          
          // Request notification permission after login
          setupNotifications(authUser.uid);
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Setup push notifications
  const setupNotifications = async (userId) => {
    try {
      const result = await requestNotificationPermission();
      
      if (result.success) {
        // Save FCM token to user profile
        await saveFCMToken(userId, result.token);
        console.log('Notifications enabled');
      } else {
        console.warn('Notifications not enabled:', result.error);
      }
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  };

  useEffect(() => {
    // Listen for foreground messages
    const unsubscribe = onForegroundMessage((payload) => {
      const { notification, data } = payload;
      
      if (notification) {
        // Show notification
        showNotification(notification.title, {
          body: notification.body,
          data: data
        });
        
        // Also show SweetAlert for important notifications
        if (data?.type === 'ride_accepted' || data?.type === 'ride_requested') {
          showInfo(notification.body, notification.title);
        }
      }
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
