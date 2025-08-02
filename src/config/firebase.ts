/**
 * Firebase Configuration
 * Author: VB Entreprise
 * 
 * Firebase configuration for the ERP application
 */

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

import { setupFirebaseErrorHandlers } from '../utils/firebaseErrorHandler';

// Setup Firebase error handlers
const setupErrorHandlers = () => {
  return setupFirebaseErrorHandlers();
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN', 
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missingFields = requiredFields.filter(field => !import.meta.env[field]);
  
  if (missingFields.length > 0) {
    console.error('❌ Missing Firebase environment variables:', missingFields);
    console.error('Please check your .env file and ensure all Firebase configuration variables are set.');
    return false;
  }

  console.log('✅ Firebase configuration validated');
  return true;
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configure Firestore for better offline support and debugging
import { enableIndexedDbPersistence, clearPersistence } from 'firebase/firestore';

// Enable offline persistence for Firestore
const enableOfflinePersistence = async () => {
  try {
    await enableIndexedDbPersistence(db, {
      synchronizeTabs: true
    });
    console.log('✅ Firestore offline persistence enabled');
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      console.warn('⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time');
    } else if (error.code === 'unimplemented') {
      console.warn('⚠️ Browser doesn\'t support offline persistence');
    } else {
      console.error('❌ Error enabling offline persistence:', error);
    }
  }
};

// Test Firestore connection
const testFirestoreConnection = async () => {
  try {
    // Try to enable network to test connection
    await enableNetwork(db);
    console.log('✅ Firestore network connection successful');
    return true;
  } catch (error) {
    console.error('❌ Firestore network connection failed:', error);
    return false;
  }
};

// Initialize Firebase services with error handling
const initializeFirebaseServices = async () => {
  console.log('🔧 Initializing Firebase services...');
  
  // Setup Firebase error handlers
  setupErrorHandlers();
  
  // Validate configuration
  if (!validateFirebaseConfig()) {
    throw new Error('Firebase configuration is invalid');
  }

  // Enable offline persistence
  await enableOfflinePersistence();
  
  // Test connection
  const connectionOk = await testFirestoreConnection();
  if (!connectionOk) {
    console.warn('⚠️ Firestore connection test failed, but continuing...');
  }

  console.log('✅ Firebase services initialized successfully');
};

// Export initialization function
export const initializeFirebase = initializeFirebaseServices;

// Development mode emulator connection (uncomment for local development)
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('🔧 Connected to Firebase emulators');
  } catch (error) {
    console.warn('⚠️ Failed to connect to Firebase emulators:', error);
  }
}

export default app; 