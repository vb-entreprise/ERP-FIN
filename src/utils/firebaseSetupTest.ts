/**
 * Firebase Setup Test
 * Author: VB Entreprise
 * 
 * Tool to verify Firebase setup and create test users
 */

import { auth, db } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

export const testFirebaseSetup = async () => {
  console.log('🔧 Testing Firebase Setup...');
  
  try {
    // Test 1: Check if Firebase is properly initialized
    console.log('✅ Firebase initialized');
    
    // Test 2: Check if Authentication is enabled
    console.log('✅ Firebase Auth service available');
    
    // Test 3: Check authentication state
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log('✅ User is authenticated:', currentUser.email);
    } else {
      console.log('⚠️ No user is currently authenticated');
    }
    
    // Test 4: Check if Firestore is accessible (read-only test first)
    try {
      console.log('🔍 Testing Firestore read access...');
      const testCollection = collection(db, 'test');
      const testSnapshot = await getDocs(testCollection);
      console.log('✅ Firestore read test successful');
    } catch (error: any) {
      console.log('❌ Firestore read test failed:', error.message);
      console.log('Error code:', error.code);
      console.log('Error details:', error);
    }
    
    // Test 5: Check if Firestore write is accessible (only if authenticated)
    if (currentUser) {
      try {
        console.log('🔍 Testing Firestore write access...');
        const testDoc = doc(db, 'test', 'setup');
        await setDoc(testDoc, { 
          timestamp: new Date(),
          userId: currentUser.uid,
          test: true
        });
        console.log('✅ Firestore write test successful');
        
        // Clean up test document
        try {
          const testDocRef = doc(db, 'test', 'setup');
          await setDoc(testDocRef, { deleted: true });
        } catch (cleanupError) {
          console.log('⚠️ Could not clean up test document:', cleanupError);
        }
      } catch (error: any) {
        console.log('❌ Firestore write test failed:', error.message);
        console.log('Error code:', error.code);
        console.log('Error details:', error);
        
        // Check if it's a permissions error
        if (error.code === 'permission-denied') {
          console.log('🔧 This appears to be a Firestore security rules issue');
          console.log('Please check your Firestore security rules in the Firebase Console');
        }
      }
    } else {
      console.log('⚠️ Skipping Firestore write test - user not authenticated');
    }
    
    return true;
  } catch (error: any) {
    console.error('❌ Firebase setup test failed:', error);
    return false;
  }
};

export const createTestUser = async (email: string, password: string) => {
  console.log(`👤 Creating test user: ${email}`);
  
  try {
    // First, sign out any existing user
    await signOut(auth);
    console.log('✅ Signed out existing user');
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ User created in Firebase Auth:', user.uid);
    
    // Wait a moment for the auth state to update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create user profile in Firestore
    const userProfile = {
      uid: user.uid,
      email: user.email,
      firstName: 'Test',
      lastName: 'User',
      roleId: 'admin',
      department: 'IT',
      position: 'Developer',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    try {
      await setDoc(doc(db, 'users', user.uid), userProfile);
      console.log('✅ User profile created in Firestore');
    } catch (firestoreError: any) {
      console.error('❌ Failed to create user profile in Firestore:', firestoreError.message);
      console.log('Error code:', firestoreError.code);
      
      if (firestoreError.code === 'permission-denied') {
        console.log('🔧 This is likely a Firestore security rules issue');
        console.log('Please ensure your Firestore rules allow authenticated users to write to the users collection');
      }
    }
    
    return { success: true, user };
  } catch (error: any) {
    console.error('❌ Failed to create test user:', error.message);
    console.log('Error code:', error.code);
    return { success: false, error: error.message };
  }
};

export const testUserLogin = async (email: string, password: string) => {
  console.log(`🔐 Testing login for: ${email}`);
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Login successful:', user.email);
    
    // Wait a moment for the auth state to update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test getting user profile from Firestore
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        console.log('✅ User profile found in Firestore:', userDoc.data());
      } else {
        console.log('⚠️ User profile not found in Firestore');
      }
    } catch (firestoreError: any) {
      console.error('❌ Failed to read user profile from Firestore:', firestoreError.message);
      console.log('Error code:', firestoreError.code);
    }
    
    return { success: true, user };
  } catch (error: any) {
    console.error('❌ Login failed:', error.message);
    console.log('Error code:', error.code);
    return { success: false, error: error.message };
  }
};

export const checkFirebaseServices = () => {
  console.log('🔍 Checking Firebase Services Status...');
  
  // Check if services are available
  const services = {
    auth: !!auth,
    firestore: !!db,
    config: {
      apiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      appId: !!import.meta.env.VITE_FIREBASE_APP_ID
    }
  };
  
  console.log('📊 Services Status:', services);
  
  if (!services.auth) console.log('❌ Firebase Auth not available');
  if (!services.firestore) console.log('❌ Firestore not available');
  if (!services.config.apiKey) console.log('❌ API Key missing');
  if (!services.config.authDomain) console.log('❌ Auth Domain missing');
  if (!services.config.projectId) console.log('❌ Project ID missing');
  
  // Check current authentication state
  const currentUser = auth.currentUser;
  if (currentUser) {
    console.log('✅ User is authenticated:', currentUser.email);
  } else {
    console.log('⚠️ No user is currently authenticated');
  }
  
  return services;
};

export const diagnoseFirebaseIssues = async () => {
  console.log('🔍 Diagnosing Firebase Issues...');
  
  const issues = [];
  
  // Check environment variables
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN', 
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_APP_ID'
  ];
  
  for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
      issues.push(`Missing environment variable: ${envVar}`);
    }
  }
  
  // Check authentication state
  const currentUser = auth.currentUser;
  if (!currentUser) {
    issues.push('No user is authenticated - this will cause Firestore write failures');
  }
  
  // Test Firestore connection
  try {
    const testCollection = collection(db, 'test');
    await getDocs(testCollection);
  } catch (error: any) {
    issues.push(`Firestore connection failed: ${error.message}`);
  }
  
  if (issues.length === 0) {
    console.log('✅ No obvious issues detected');
  } else {
    console.log('❌ Issues detected:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  }
  
  return issues;
}; 