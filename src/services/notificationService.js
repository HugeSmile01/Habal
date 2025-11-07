import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from '../config/firebase';

let messaging = null;

// Initialize messaging only if supported
try {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.warn('Firebase Messaging not supported:', error);
}

/**
 * Request notification permission and get FCM token
 */
export const requestNotificationPermission = async () => {
  try {
    if (!messaging) {
      return {
        success: false,
        error: 'Push notifications are not supported in this browser'
      };
    }

    // Check if permission is already granted
    if (Notification.permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      
      if (token) {
        return { success: true, token };
      }
    }

    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      
      if (token) {
        console.log('FCM Token:', token);
        return { success: true, token };
      } else {
        return {
          success: false,
          error: 'Failed to get FCM token'
        };
      }
    } else if (permission === 'denied') {
      return {
        success: false,
        error: 'Notification permission denied'
      };
    } else {
      return {
        success: false,
        error: 'Notification permission not granted'
      };
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Listen for foreground messages
 */
export const onForegroundMessage = (callback) => {
  if (!messaging) {
    console.warn('Messaging not available');
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    callback(payload);
  });
};

/**
 * Show a browser notification
 */
export const showNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        icon: '/Habal.svg',
        badge: '/Habal.svg',
        ...options
      });

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }
};

/**
 * Send push notification via FCM (server-side operation)
 * This is a placeholder - actual implementation should be done on the backend
 */
export const sendPushNotification = async (token, notification) => {
  // This should be implemented on your backend server
  // Firebase Admin SDK is required for sending notifications
  console.warn('sendPushNotification should be implemented on the backend');
  
  return {
    success: false,
    error: 'This operation should be performed on the backend'
  };
};

/**
 * Subscribe to a topic (requires backend implementation)
 */
export const subscribeToTopic = async (token, topic) => {
  // This requires Firebase Admin SDK on the backend
  console.warn('subscribeToTopic should be implemented on the backend');
  
  return {
    success: false,
    error: 'This operation should be performed on the backend'
  };
};

/**
 * Unsubscribe from a topic (requires backend implementation)
 */
export const unsubscribeFromTopic = async (token, topic) => {
  // This requires Firebase Admin SDK on the backend
  console.warn('unsubscribeFromTopic should be implemented on the backend');
  
  return {
    success: false,
    error: 'This operation should be performed on the backend'
  };
};

/**
 * Save FCM token to user profile
 */
export const saveFCMToken = async (userId, token) => {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    const { db } = await import('../config/firebase');
    
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      fcmToken: token,
      fcmTokenUpdatedAt: new Date()
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving FCM token:', error);
    return { success: false, error: error.message };
  }
};

export default {
  requestNotificationPermission,
  onForegroundMessage,
  showNotification,
  sendPushNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
  saveFCMToken
};
