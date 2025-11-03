import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  getDoc, 
  getDocs,
  query, 
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Ride status constants
export const RIDE_STATUS = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  DRIVER_ARRIVING: 'driver_arriving',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

/**
 * Calculate ride fee based on distance
 * Base fare + per kilometer rate
 */
export const calculateFee = (distance, baseFare = 50, perKmRate = 15) => {
  const fee = baseFare + (distance * perKmRate);
  return Math.round(fee * 100) / 100; // Round to 2 decimal places
};

/**
 * Create a new ride request
 */
export const createRideRequest = async (rideData) => {
  try {
    const distance = calculateDistance(
      rideData.pickupLocation.lat,
      rideData.pickupLocation.lng,
      rideData.destinationLocation.lat,
      rideData.destinationLocation.lng
    );

    const estimatedFee = calculateFee(distance);

    const ride = {
      citizenId: rideData.citizenId,
      citizenName: rideData.citizenName,
      citizenPhone: rideData.citizenPhone,
      pickupLocation: rideData.pickupLocation,
      destinationLocation: rideData.destinationLocation,
      numberOfPassengers: rideData.numberOfPassengers,
      distance: distance,
      estimatedFee: estimatedFee,
      status: RIDE_STATUS.REQUESTED,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      driverId: null,
      driverName: null,
      actualFee: null,
      notes: rideData.notes || ''
    };

    const docRef = await addDoc(collection(db, 'rides'), ride);
    
    return { 
      success: true, 
      rideId: docRef.id,
      distance,
      estimatedFee
    };
  } catch (error) {
    console.error('Create ride request error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Driver accepts a ride request and sets their fee
 */
export const acceptRideRequest = async (rideId, driverData) => {
  try {
    const rideRef = doc(db, 'rides', rideId);
    
    await updateDoc(rideRef, {
      driverId: driverData.driverId,
      driverName: driverData.driverName,
      driverPhone: driverData.driverPhone,
      vehicleInfo: driverData.vehicleInfo,
      actualFee: driverData.proposedFee,
      status: RIDE_STATUS.ACCEPTED,
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Accept ride error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update ride status
 */
export const updateRideStatus = async (rideId, status, additionalData = {}) => {
  try {
    const rideRef = doc(db, 'rides', rideId);
    
    await updateDoc(rideRef, {
      status,
      updatedAt: serverTimestamp(),
      ...additionalData
    });

    return { success: true };
  } catch (error) {
    console.error('Update ride status error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update driver's real-time location
 */
export const updateDriverLocation = async (rideId, location) => {
  try {
    const rideRef = doc(db, 'rides', rideId);
    
    await updateDoc(rideRef, {
      driverCurrentLocation: location,
      locationUpdatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Update location error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get available ride requests (for drivers)
 */
export const getAvailableRides = async () => {
  try {
    const q = query(
      collection(db, 'rides'),
      where('status', '==', RIDE_STATUS.REQUESTED),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const rides = [];
    
    querySnapshot.forEach((doc) => {
      rides.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, rides };
  } catch (error) {
    console.error('Get available rides error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user's rides (citizen or driver)
 */
export const getUserRides = async (userId, userType) => {
  try {
    const field = userType === 'driver' ? 'driverId' : 'citizenId';
    const q = query(
      collection(db, 'rides'),
      where(field, '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const rides = [];
    
    querySnapshot.forEach((doc) => {
      rides.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, rides };
  } catch (error) {
    console.error('Get user rides error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get ride details
 */
export const getRideDetails = async (rideId) => {
  try {
    const rideDoc = await getDoc(doc(db, 'rides', rideId));
    
    if (rideDoc.exists()) {
      return { success: true, ride: { id: rideDoc.id, ...rideDoc.data() } };
    } else {
      return { success: false, error: 'Ride not found' };
    }
  } catch (error) {
    console.error('Get ride details error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Listen to ride updates in real-time
 */
export const subscribeToRideUpdates = (rideId, callback) => {
  const rideRef = doc(db, 'rides', rideId);
  return onSnapshot(rideRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });
};

/**
 * Listen to available rides in real-time (for drivers)
 */
export const subscribeToAvailableRides = (callback) => {
  const q = query(
    collection(db, 'rides'),
    where('status', '==', RIDE_STATUS.REQUESTED),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const rides = [];
    querySnapshot.forEach((doc) => {
      rides.push({ id: doc.id, ...doc.data() });
    });
    callback(rides);
  });
};
