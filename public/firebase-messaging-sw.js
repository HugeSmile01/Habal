// Firebase Cloud Messaging Service Worker
// This file handles background notifications

// ⚠️ IMPORTANT: Replace the Firebase config below with your actual project values!
// ⚠️ DO NOT deploy to production with these placeholder values!
// ⚠️ Get your config from: Firebase Console > Project Settings > General > Your apps

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
// TODO: Replace these placeholder values with your actual Firebase configuration
firebase.initializeApp({
  apiKey: "YOUR_API_KEY", // ⚠️ REPLACE THIS
  authDomain: "YOUR_AUTH_DOMAIN", // ⚠️ REPLACE THIS
  projectId: "YOUR_PROJECT_ID", // ⚠️ REPLACE THIS
  storageBucket: "YOUR_STORAGE_BUCKET", // ⚠️ REPLACE THIS
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // ⚠️ REPLACE THIS
  appId: "YOUR_APP_ID" // ⚠️ REPLACE THIS
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Habal Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/Habal.svg',
    badge: '/Habal.svg',
    tag: payload.data?.tag || 'habal-notification',
    data: payload.data || {},
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'View'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if there's already a window open
          for (let client of clientList) {
            if (client.url.includes(self.registration.scope) && 'focus' in client) {
              return client.focus();
            }
          }
          // If no window is open, open a new one
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});
