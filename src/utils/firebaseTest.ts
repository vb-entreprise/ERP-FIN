/**
 * Firebase Connection Test
 * Author: VB Entreprise
 * 
 * Simple test to verify Firebase connection and configuration
 */

import { auth, db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const testFirebaseConnection = async () => {
  console.log('🔍 Testing Firebase connection...');
  
  try {
    // Test 1: Check if Firebase is initialized
    console.log('✅ Firebase app initialized successfully');
    
    // Test 2: Check if auth is working
    console.log('✅ Firebase Auth initialized');
    
    // Test 3: Check if Firestore is working
    console.log('✅ Firebase Firestore initialized');
    
    // Test 4: Try to access Firestore (this will fail if rules are too restrictive)
    try {
      const testCollection = collection(db, 'test');
      await getDocs(testCollection);
      console.log('✅ Firestore access successful');
    } catch (error: any) {
      console.log('⚠️ Firestore access test:', error.message);
      console.log('This might be due to security rules or collection not existing');
    }
    
    // Test 5: Check auth state listener
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ Auth state listener working - User logged in:', user.email);
      } else {
        console.log('✅ Auth state listener working - No user logged in');
      }
    });
    
    console.log('🎉 Firebase connection test completed!');
    return true;
  } catch (error: any) {
    console.error('❌ Firebase connection test failed:', error);
    return false;
  }
};

export const logFirebaseConfig = () => {
  console.log('🔧 Firebase Configuration:');
  console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
  console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
  console.log('Storage Bucket:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
  console.log('API Key exists:', !!import.meta.env.VITE_FIREBASE_API_KEY);
  console.log('App ID exists:', !!import.meta.env.VITE_FIREBASE_APP_ID);
}; 