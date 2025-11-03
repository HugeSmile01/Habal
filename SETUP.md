# Habal - Local Ride-Hailing Platform

A local-based ride-hailing platform that connects citizens who need rides with drivers. Built with React and Firebase.

## Features

### For Citizens (Passengers)
- **User Registration**: Register as a citizen/passenger with email authentication
- **Ride Requests**: Request rides by specifying pickup and destination locations
- **Real-time Tracking**: Track your ride status and driver location
- **Passenger Count**: Specify the number of passengers for the ride
- **Transparent Pricing**: View estimated and actual ride fees
- **Ride History**: View all your past and current rides
- **Security**: Unique user tracking with Firebase authentication

### For Drivers
- **Driver Registration**: Register as a driver with vehicle and license information
- **Available Rides Dashboard**: View all available ride requests in real-time
- **Custom Pricing**: Set your own fee for each ride based on distance
- **Passenger Information**: See number of passengers and destination details
- **Location Tracking**: Automatic real-time location tracking during active rides
- **Ride Management**: Track active and completed rides
- **Distance Calculation**: Automatic distance calculation between pickup and destination

### Security Features
- **Firebase Authentication**: Secure email/password authentication
- **Unique User IDs**: Each user has a unique identifier (UID) for tracking
- **Data Validation**: Input validation for all user data
- **Secure Data Storage**: All data stored in Firebase Firestore with proper security rules

## Technology Stack

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 7.1.12
- **Backend/Database**: Firebase
  - Authentication
  - Firestore Database
  - Storage
- **Routing**: React Router DOM 7.9.5

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/HugeSmile01/Habal.git
   cd Habal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   
   a. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   
   b. Enable Authentication:
      - Go to Authentication > Sign-in method
      - Enable Email/Password authentication
   
   c. Create Firestore Database:
      - Go to Firestore Database
      - Create database in production mode
      - Start with these security rules:
      ```
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /users/{userId} {
            allow read: if request.auth != null;
            allow write: if request.auth != null && request.auth.uid == userId;
          }
          match /rides/{rideId} {
            allow read: if request.auth != null;
            allow create: if request.auth != null;
            allow update: if request.auth != null && 
              (resource.data.citizenId == request.auth.uid || 
               resource.data.driverId == request.auth.uid);
          }
        }
      }
      ```
   
   d. Get Firebase configuration:
      - Go to Project Settings > General
      - Scroll to "Your apps" section
      - Copy the Firebase configuration object

4. **Configure Firebase**
   
   Edit `src/config/firebase.config.js` and replace the placeholder values with your Firebase configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID"
   };
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

## Usage

### For Citizens (Passengers)

1. **Register**
   - Click on "Register here"
   - Select "Citizen (Need a ride)"
   - Fill in your personal information
   - Submit the form

2. **Login**
   - Enter your email and password
   - Click "Login"

3. **Request a Ride**
   - Click "+ Request a New Ride"
   - Use "Use My Current Location" for pickup (or enter manually)
   - Enter destination address and coordinates
   - Select number of passengers
   - Add any special notes
   - Click "Request Ride"

4. **Track Your Ride**
   - View ride status in your dashboard
   - See driver information once accepted
   - Track estimated and actual fees

### For Drivers

1. **Register**
   - Click on "Register here"
   - Select "Driver (Provide rides)"
   - Fill in personal and vehicle information
   - Submit the form

2. **Login**
   - Enter your email and password
   - Click "Login"

3. **Accept Rides**
   - View available ride requests in the "Available Rides" tab
   - Review passenger count, destination, and distance
   - Set your fee for the ride
   - Click "Accept Ride"

4. **Manage Active Rides**
   - Switch to "My Rides" tab
   - View active rides with passenger details
   - Location tracking activates automatically
   - View completed rides history

## Project Structure

```
Habal/
├── src/
│   ├── components/
│   │   ├── AuthForm.css          # Styles for authentication forms
│   │   ├── LoginForm.jsx         # Login component
│   │   ├── RegisterForm.jsx      # Registration component
│   │   ├── RideRequestForm.jsx   # Ride request component
│   │   ├── RideRequestForm.css   # Ride request styles
│   │   ├── DriverDashboard.jsx   # Driver dashboard component
│   │   └── DriverDashboard.css   # Driver dashboard styles
│   ├── config/
│   │   ├── firebase.config.js    # Firebase configuration
│   │   └── firebase.js           # Firebase initialization
│   ├── pages/
│   │   ├── AuthPage.jsx          # Authentication page
│   │   ├── AuthPage.css          # Auth page styles
│   │   ├── CitizenPage.jsx       # Citizen dashboard
│   │   ├── CitizenPage.css       # Citizen dashboard styles
│   │   ├── DriverPage.jsx        # Driver page
│   │   └── DriverPage.css        # Driver page styles
│   ├── services/
│   │   ├── authService.js        # Authentication services
│   │   └── rideService.js        # Ride management services
│   ├── utils/
│   │   └── helpers.js            # Helper functions
│   ├── App.jsx                   # Main App component
│   ├── App.css                   # App styles
│   └── main.jsx                  # Entry point
├── public/                       # Public assets
├── index.html                    # HTML template
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## Key Features Explained

### Distance Calculation
The platform uses the Haversine formula to calculate the distance between two geographic coordinates (pickup and destination). This provides accurate distance measurements for fee calculation.

### Real-time Location Tracking
When a driver has active rides, the application automatically:
- Requests geolocation permissions
- Tracks the driver's location using the Geolocation API
- Updates the location in Firebase Firestore in real-time
- Passengers can view this information

### Fee Management
- **Estimated Fee**: Automatically calculated based on distance (Base fare + distance × per km rate)
- **Driver's Fee**: Drivers can set their own fee when accepting a ride
- **Transparency**: Both parties can see the fee before and during the ride

### Security & Data Tracking
- Each user has a unique Firebase UID
- All rides are tracked with unique IDs
- Timestamps for all actions
- User type verification (citizen vs driver)
- Secure authentication with Firebase

## Database Schema

### Users Collection
```javascript
{
  uid: string,              // Firebase Auth UID
  email: string,
  userType: string,         // 'citizen' or 'driver'
  fullName: string,
  phoneNumber: string,
  createdAt: timestamp,
  isActive: boolean,
  rating: number,
  totalRides: number,
  
  // Driver-specific fields
  vehicleType: string,
  vehicleModel: string,
  licensePlate: string,
  licenseNumber: string,
  isAvailable: boolean,
  
  // Citizen-specific fields
  homeAddress: string
}
```

### Rides Collection
```javascript
{
  citizenId: string,
  citizenName: string,
  citizenPhone: string,
  pickupLocation: {
    lat: number,
    lng: number,
    address: string
  },
  destinationLocation: {
    lat: number,
    lng: number,
    address: string
  },
  numberOfPassengers: number,
  distance: number,
  estimatedFee: number,
  actualFee: number,
  status: string,           // 'requested', 'accepted', 'driver_arriving', 'in_progress', 'completed', 'cancelled'
  createdAt: timestamp,
  updatedAt: timestamp,
  driverId: string,
  driverName: string,
  driverPhone: string,
  vehicleInfo: string,
  driverCurrentLocation: {
    lat: number,
    lng: number,
    accuracy: number,
    timestamp: number
  },
  notes: string
}
```

## API/Services

### Authentication Service (`authService.js`)
- `registerUser(email, password, userData)` - Register new user
- `signIn(email, password)` - Sign in user
- `signOut()` - Sign out current user
- `getCurrentUserProfile(uid)` - Get user profile
- `updateUserProfile(uid, updates)` - Update user profile
- `onAuthChange(callback)` - Listen to auth state changes

### Ride Service (`rideService.js`)
- `createRideRequest(rideData)` - Create new ride request
- `acceptRideRequest(rideId, driverData)` - Accept ride as driver
- `updateRideStatus(rideId, status)` - Update ride status
- `updateDriverLocation(rideId, location)` - Update driver location
- `getAvailableRides()` - Get all available rides
- `getUserRides(userId, userType)` - Get user's rides
- `getRideDetails(rideId)` - Get specific ride details
- `subscribeToRideUpdates(rideId, callback)` - Real-time ride updates
- `subscribeToAvailableRides(callback)` - Real-time available rides

### Helper Functions (`helpers.js`)
- `formatCurrency(amount)` - Format currency display
- `formatDistance(distance)` - Format distance display
- `formatDateTime(timestamp)` - Format date/time
- `getUserLocation()` - Get current geolocation
- `watchUserLocation(callback)` - Watch location changes
- `calculateDistance(lat1, lon1, lat2, lon2)` - Calculate distance between coordinates

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment.

## Deployment

The application can be deployed to various platforms:

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Other Platforms
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## Future Enhancements

Potential features for future versions:
- Map integration (Google Maps, Mapbox)
- Push notifications
- In-app messaging between driver and passenger
- Payment integration
- Rating and review system
- Driver verification system
- Multiple language support
- Trip history analytics
- Favorite locations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Acknowledgments

- Firebase for backend infrastructure
- React team for the amazing framework
- Vite for the fast build tool
