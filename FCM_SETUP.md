# Firebase Cloud Messaging (FCM) Setup Guide

This guide explains how to set up and configure Firebase Cloud Messaging for the Habal platform to enable push notifications.

## Prerequisites

- Firebase project with Cloud Messaging enabled
- VAPID key from Firebase Console
- Service worker support in the browser

## Configuration Steps

### 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your Habal project
3. Navigate to **Project Settings** > **Cloud Messaging**
4. Generate a new Web Push certificate (VAPID key) if you don't have one
5. Copy the key pair values

### 2. Environment Variables

Add the following to your `.env.local` file:

```env
# Firebase Cloud Messaging
VITE_FIREBASE_VAPID_KEY=your_vapid_key_here
```

### 3. Service Worker Configuration

Update the `public/firebase-messaging-sw.js` file with your Firebase config:

```javascript
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
});
```

**Important:** Replace the placeholder values with your actual Firebase configuration.

## Features Implemented

### 1. Notification Permission Request

When a user logs in, the app automatically requests notification permission. The FCM token is saved to the user's profile in Firestore.

### 2. Foreground Notifications

When the app is open and in focus:
- Notifications are displayed using the browser's Notification API
- Important notifications (ride accepted, ride requested) also trigger SweetAlert popups
- Custom notification sound and icon (Habal logo)

### 3. Background Notifications

When the app is in the background or closed:
- Service worker handles incoming messages
- Displays system notifications with actions (View, Dismiss)
- Clicking notification opens/focuses the app

### 4. FCM Token Management

- Token is automatically generated on login
- Token is saved to user profile in Firestore under `fcmToken` field
- Token can be used by backend services to send targeted notifications

## Usage in Code

### Request Permission

```javascript
import { requestNotificationPermission, saveFCMToken } from './services/notificationService';

const result = await requestNotificationPermission();
if (result.success) {
  await saveFCMToken(userId, result.token);
  console.log('Notifications enabled');
}
```

### Listen for Foreground Messages

```javascript
import { onForegroundMessage, showNotification } from './services/notificationService';

const unsubscribe = onForegroundMessage((payload) => {
  const { notification, data } = payload;
  showNotification(notification.title, {
    body: notification.body,
    data: data
  });
});

// Clean up on unmount
return () => unsubscribe();
```

### Show Custom Notification

```javascript
import { showNotification } from './services/notificationService';

showNotification('Ride Accepted', {
  body: 'Your driver is on the way!',
  icon: '/Habal.svg',
  badge: '/Habal.svg',
  data: { rideId: '123', type: 'ride_accepted' }
});
```

## Backend Integration

To send notifications from your backend, use the Firebase Admin SDK:

### Node.js Example

```javascript
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

// Send notification to a specific user
async function sendNotificationToUser(userId, notification) {
  // Get user's FCM token from Firestore
  const userDoc = await admin.firestore()
    .collection('users')
    .doc(userId)
    .get();
  
  const fcmToken = userDoc.data().fcmToken;
  
  if (!fcmToken) {
    console.log('User has no FCM token');
    return;
  }
  
  // Send notification
  const message = {
    token: fcmToken,
    notification: {
      title: notification.title,
      body: notification.body
    },
    data: notification.data || {},
    webpush: {
      fcmOptions: {
        link: 'https://habal.app'
      }
    }
  };
  
  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Example: Notify passenger when driver accepts ride
await sendNotificationToUser(passengerId, {
  title: 'Ride Accepted!',
  body: `Driver ${driverName} has accepted your ride request.`,
  data: {
    rideId: rideId,
    type: 'ride_accepted',
    driverId: driverId
  }
});
```

## Notification Types

The platform supports the following notification types:

### For Passengers:
- **ride_accepted**: Driver has accepted your ride
- **driver_arriving**: Driver is arriving at pickup location
- **ride_started**: Ride has started
- **ride_completed**: Ride has been completed
- **ride_cancelled**: Ride has been cancelled

### For Drivers:
- **ride_requested**: New ride request available
- **ride_cancelled_by_passenger**: Passenger cancelled the ride
- **payment_received**: Payment has been received

## Notification Payload Structure

```javascript
{
  notification: {
    title: 'Notification Title',
    body: 'Notification body text'
  },
  data: {
    type: 'ride_accepted',
    rideId: '123456',
    timestamp: '2025-01-01T00:00:00Z',
    // Additional custom data
  }
}
```

## Testing Notifications

### Manual Testing

1. Use Firebase Console's Cloud Messaging composer:
   - Go to Firebase Console > Cloud Messaging > Send test message
   - Enter FCM token from browser console
   - Send test notification

2. Test with curl:
```bash
curl -X POST https://fcm.googleapis.com/v1/projects/YOUR_PROJECT_ID/messages:send \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "token": "USER_FCM_TOKEN",
      "notification": {
        "title": "Test Notification",
        "body": "This is a test"
      }
    }
  }'
```

### Automated Testing

Create test cases for:
- Permission request flow
- Foreground message handling
- Background message handling
- Token refresh
- Error handling (permission denied, network errors)

## Troubleshooting

### Common Issues

**1. Permission Denied**
- Ensure HTTPS is enabled (required for service workers)
- Check browser settings for notification permissions
- Clear browser cache and request permission again

**2. Service Worker Not Registering**
- Verify `firebase-messaging-sw.js` is in the `public/` directory
- Check browser console for service worker errors
- Ensure service worker scope is correct

**3. Notifications Not Received**
- Verify FCM token is saved correctly
- Check Firebase Console for delivery logs
- Ensure service worker is active in browser
- Verify network connectivity

**4. VAPID Key Issues**
- Ensure VAPID key is correctly set in environment variables
- Key should be in the correct format (not including "key=" prefix)
- Generate a new key pair if necessary

## Security Considerations

1. **Token Security**:
   - FCM tokens should be treated as sensitive data
   - Never expose tokens in client-side logs
   - Implement token refresh mechanism

2. **Backend Validation**:
   - Validate notification content on the backend
   - Implement rate limiting for sending notifications
   - Verify user permissions before sending notifications

3. **Data Privacy**:
   - Don't send sensitive information in notification payload
   - Use notification clicks to fetch secure data
   - Comply with privacy regulations (GDPR, etc.)

## Best Practices

1. **User Experience**:
   - Request permission at appropriate times (after login)
   - Provide clear explanation of notification benefits
   - Allow users to control notification preferences
   - Don't spam users with too many notifications

2. **Performance**:
   - Keep notification payloads small
   - Use data messages for silent updates
   - Implement notification grouping for multiple messages
   - Clean up old notifications

3. **Reliability**:
   - Handle FCM token refresh
   - Implement retry logic for failed sends
   - Monitor notification delivery rates
   - Log errors for debugging

## Additional Resources

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Notifications Guide](https://web.dev/push-notifications-overview/)
- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

## Support

For issues or questions related to FCM setup:
1. Check the [Firebase Status Dashboard](https://status.firebase.google.com/)
2. Review Firebase Console logs
3. Check browser console for errors
4. Contact the development team

---

**Last Updated:** November 2025
**Version:** 1.0.0
