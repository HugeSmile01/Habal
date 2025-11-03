import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// User types
export const USER_TYPES = {
  PASSENGER: 'passenger',
  DRIVER: 'driver'
};

/**
 * Register a new user (Passenger or Driver)
 */
export const registerUser = async (email, password, userData) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    const userProfile = {
      uid: user.uid,
      email: user.email,
      userType: userData.userType,
      fullName: userData.fullName,
      phoneNumber: userData.phoneNumber,
      createdAt: new Date().toISOString(),
      isActive: true,
      // Device and consent information
      deviceInfo: userData.deviceInfo || null,
      consents: userData.consents || null,
      registrationTimestamp: userData.registrationTimestamp,
      // Driver-specific fields
      ...(userData.userType === USER_TYPES.DRIVER && {
        vehicleType: userData.vehicleType,
        vehicleModel: userData.vehicleModel,
        licensePlate: userData.licensePlate,
        licenseNumber: userData.licenseNumber,
        isAvailable: false,
        rating: 0,
        totalRides: 0
      }),
      // Passenger-specific fields
      ...(userData.userType === USER_TYPES.PASSENGER && {
        homeAddress: userData.homeAddress || '',
        rating: 0,
        totalRides: 0
      })
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return { success: true, user: userProfile };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign in existing user
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user profile
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      return { success: true, user: userDoc.data() };
    } else {
      return { success: false, error: 'User profile not found' };
    }
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get current user profile
 */
export const getCurrentUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, user: userDoc.data() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Get user error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (uid, updates) => {
  try {
    await updateDoc(doc(db, 'users', uid), updates);
    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
