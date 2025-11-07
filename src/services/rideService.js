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
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Constants
const EARTH_RADIUS_KM = 6371; // Radius of the Earth in kilometers
const DEFAULT_BASE_FARE = 50; // Base fare in local currency
const DEFAULT_PER_KM_RATE = 15; // Rate per kilometer in local currency

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
  const R = EARTH_RADIUS_KM;
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
export const calculateFee = (distance, baseFare = DEFAULT_BASE_FARE, perKmRate = DEFAULT_PER_KM_RATE) => {
  const fee = baseFare + (distance * perKmRate);
  return Math.round(fee * 100) / 100; // Round to 2 decimal places
};

/**
 * Create a new ride request
 */
export const createRideRequest = async (rideData) => {
  try {
    // Validate input data
    if (!rideData.passengerId || !rideData.passengerName || !rideData.passengerPhone) {
      return { 
        success: false, 
        error: 'Missing required passenger information' 
      };
    }

    if (!rideData.pickupLocation?.lat || !rideData.pickupLocation?.lng) {
      return { 
        success: false, 
        error: 'Invalid pickup location' 
      };
    }

    if (!rideData.destinationLocation?.lat || !rideData.destinationLocation?.lng) {
      return { 
        success: false, 
        error: 'Invalid destination location' 
      };
    }

    if (!rideData.numberOfPassengers || rideData.numberOfPassengers < 1) {
      return { 
        success: false, 
        error: 'Invalid number of passengers' 
      };
    }

    const distance = calculateDistance(
      rideData.pickupLocation.lat,
      rideData.pickupLocation.lng,
      rideData.destinationLocation.lat,
      rideData.destinationLocation.lng
    );

    // Validate distance
    if (distance <= 0 || !isFinite(distance)) {
      return { 
        success: false, 
        error: 'Invalid distance calculated. Please check your locations.' 
      };
    }

    // Check if distance is too short (less than 100 meters)
    if (distance < 0.1) {
      return { 
        success: false, 
        error: 'Pickup and destination are too close. Minimum distance is 100 meters.' 
      };
    }

    const estimatedFee = calculateFee(distance);

    const ride = {
      passengerId: rideData.passengerId,
      passengerName: rideData.passengerName,
      passengerPhone: rideData.passengerPhone,
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
    
    // Provide user-friendly error messages
    let errorMessage = 'Failed to create ride request. Please try again.';
    
    if (error.code === 'permission-denied') {
      errorMessage = 'You do not have permission to create a ride request. Please check your account.';
    } else if (error.code === 'unavailable') {
      errorMessage = 'Service temporarily unavailable. Please check your internet connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Driver accepts a ride request and sets their fee
 */
export const acceptRideRequest = async (rideId, driverData) => {
  try {
    // Validate input
    if (!rideId) {
      return { success: false, error: 'Invalid ride ID' };
    }

    if (!driverData.driverId || !driverData.driverName || !driverData.driverPhone) {
      return { success: false, error: 'Missing required driver information' };
    }

    if (!driverData.proposedFee || driverData.proposedFee <= 0) {
      return { success: false, error: 'Invalid fee amount' };
    }

    // Check if ride exists and is still available
    const rideRef = doc(db, 'rides', rideId);
    const rideDoc = await getDoc(rideRef);
    
    if (!rideDoc.exists()) {
      return { success: false, error: 'Ride not found' };
    }

    const rideData = rideDoc.data();
    
    if (rideData.status !== RIDE_STATUS.REQUESTED) {
      return { 
        success: false, 
        error: 'This ride has already been accepted by another driver' 
      };
    }
    
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
    
    let errorMessage = 'Failed to accept ride. Please try again.';
    
    if (error.code === 'permission-denied') {
      errorMessage = 'You do not have permission to accept this ride.';
    } else if (error.code === 'unavailable') {
      errorMessage = 'Service temporarily unavailable. Please check your internet connection.';
    } else if (error.code === 'not-found') {
      errorMessage = 'This ride no longer exists.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
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
 * Get user's rides (passenger or driver)
 */
export const getUserRides = async (userId, userType) => {
  try {
    const field = userType === 'driver' ? 'driverId' : 'passengerId';
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

/**
 * Soft delete a ride - move it to history collection instead of deleting permanently
 * This preserves data for record-keeping and analytics
 */
export const softDeleteRide = async (rideId) => {
  try {
    // Get the ride data first
    const rideDoc = await getDoc(doc(db, 'rides', rideId));
    
    if (!rideDoc.exists()) {
      return { success: false, error: 'Ride not found' };
    }

    const rideData = { id: rideDoc.id, ...rideDoc.data() };

    // Add to history collection with deleted metadata
    await addDoc(collection(db, 'rides_history'), {
      ...rideData,
      deletedAt: serverTimestamp(),
      originalId: rideId
    });

    // Delete from active rides collection
    await deleteDoc(doc(db, 'rides', rideId));

    return { success: true };
  } catch (error) {
    console.error('Soft delete ride error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get ride history for a user
 */
export const getRideHistory = async (userId, userType) => {
  try {
    const field = userType === 'driver' ? 'driverId' : 'passengerId';
    const q = query(
      collection(db, 'rides_history'),
      where(field, '==', userId),
      orderBy('deletedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const rides = [];
    
    querySnapshot.forEach((doc) => {
      rides.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, rides };
  } catch (error) {
    console.error('Get ride history error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Cancel a ride (soft delete with cancellation reason)
 */
export const cancelRide = async (rideId, cancelledBy, reason = '') => {
  try {
    // Update ride status to cancelled
    await updateRideStatus(rideId, RIDE_STATUS.CANCELLED, {
      cancelledBy,
      cancellationReason: reason,
      cancelledAt: serverTimestamp()
    });

    // Move to history after a delay (optional - can be done by a scheduled function)
    // For now, we just mark as cancelled but keep it in active collection
    // The soft delete can be triggered manually or by a cleanup job

    return { success: true };
  } catch (error) {
    console.error('Cancel ride error:', error);
    return { success: false, error: error.message };
  }
};
