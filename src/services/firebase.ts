/**
 * Firebase Service
 * Author: VB Entreprise
 * 
 * Firebase service for authentication, database operations, and file storage
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  enableNetwork,
  disableNetwork,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';
import { auth, db, storage, initializeFirebase } from '../config/firebase';
import type { User, Role, Permission } from '../types';

// Types
export interface FirebaseApiResponse<T> {
  data: T | null;
  success: boolean;
  message?: string;
  error?: any;
}

export interface FirebaseError {
  code: string;
  message: string;
}

// User profile interface for Firestore
export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  department: string;
  position: string;
  phoneNumber?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

class FirebaseService {
  private isInitialized = false;
  private connectionRetries = 0;
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  constructor() {
    // Enable console logging for debugging
    console.log('🔧 Firebase Service initialized');
    this.initialize();
  }

  private async initialize() {
    try {
      await initializeFirebase();
      this.isInitialized = true;
      console.log('✅ Firebase Service fully initialized');
    } catch (error) {
      console.error('❌ Firebase Service initialization failed:', error);
      this.isInitialized = false;
    }
  }

  // Retry wrapper for Firestore operations
  private async withRetry<T>(operation: () => Promise<T>, maxRetries = this.maxRetries): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Ensure network is enabled before each attempt
        await enableNetwork(db);
        
        if (attempt > 0) {
          console.log(`🔄 Retrying operation (attempt ${attempt + 1}/${maxRetries + 1})`);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        }
        
        return await operation();
      } catch (error: any) {
        lastError = error;
        console.warn(`⚠️ Operation failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error.message);
        
        // If it's a network error, try to re-enable network
        if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
          try {
            await disableNetwork(db);
            await new Promise(resolve => setTimeout(resolve, 500));
            await enableNetwork(db);
          } catch (networkError) {
            console.warn('⚠️ Network reset failed:', networkError);
          }
        }
        
        if (attempt === maxRetries) {
          break;
        }
      }
    }
    
    throw lastError;
  }

  // Enhanced authentication methods with detailed error handling
  async signIn(email: string, password: string): Promise<FirebaseApiResponse<{ user: User; token: string }>> {
    try {
      console.log('🔐 Attempting sign in for:', email);
      console.log('🔍 Firebase Auth instance:', auth);
      console.log('🔍 Current auth state:', auth.currentUser);
      
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      console.log('🔍 Calling signInWithEmailAndPassword...');
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      console.log('✅ Firebase authentication successful for:', firebaseUser.email);
      console.log('🔍 User UID:', firebaseUser.uid);
      
      // Get user profile from Firestore
      const userProfile = await this.getUserProfile(firebaseUser.uid);
      
      if (!userProfile) {
        throw new Error('User profile not found in database');
      }

      // Get ID token for API calls
      const token = await firebaseUser.getIdToken();
      
      // Map to our User type
      const user: User = this.mapFirebaseUserToUser(firebaseUser, userProfile);
      
      // Update last login
      await this.updateUserLastLogin(firebaseUser.uid);
      
      return {
        data: { user, token },
        success: true,
        message: 'Login successful'
      };
    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      
      let message = 'Authentication failed';
      if (error.code === 'auth/user-not-found') {
        message = 'User not found';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Invalid password';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later';
      } else if (error.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your connection';
      }
      
      return {
        data: null,
        success: false,
        message,
        error
      };
    }
  }

  async signUp(email: string, password: string, userData: Partial<UserProfile>): Promise<FirebaseApiResponse<User>> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        roleId: userData.roleId || 'user',
        department: userData.department || '',
        position: userData.position || '',
        phoneNumber: userData.phoneNumber,
        avatar: userData.avatar,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.createUserProfile(userProfile);

      // Update Firebase user profile
      await updateProfile(firebaseUser, {
        displayName: `${userProfile.firstName} ${userProfile.lastName}`
      });

      return {
        data: this.mapFirebaseUserToUser(firebaseUser, userProfile),
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        message: error.message,
        error
      };
    }
  }

  async signOut(): Promise<FirebaseApiResponse<void>> {
    try {
      await signOut(auth);
      return {
        data: null,
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        message: error.message,
        error
      };
    }
  }

  async resetPassword(email: string): Promise<FirebaseApiResponse<void>> {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        data: null,
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        message: error.message,
        error
      };
    }
  }

  // User profile methods
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      return await this.withRetry(async () => {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          return userDoc.data() as UserProfile;
        }
        return null;
      });
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  async createUserProfile(userProfile: UserProfile): Promise<void> {
    await this.withRetry(async () => {
      await setDoc(doc(db, 'users', userProfile.uid), userProfile);
    });
  }

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    await this.withRetry(async () => {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      });
    });
  }

  async updateUserLastLogin(uid: string): Promise<void> {
    await this.withRetry(async () => {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        lastLoginAt: new Date()
      });
    });
  }

  // Roles and permissions methods
  async getRoles(): Promise<FirebaseApiResponse<Role[]>> {
    try {
      const roles = await this.withRetry(async () => {
        const rolesSnapshot = await getDocs(collection(db, 'roles'));
        const roles: Role[] = [];
        
        rolesSnapshot.forEach((doc) => {
          roles.push({ id: doc.id, ...doc.data() } as Role);
        });
        
        return roles;
      });

      return {
        data: roles,
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        message: error.message,
        error
      };
    }
  }

  async getPermissions(): Promise<FirebaseApiResponse<Permission[]>> {
    try {
      const permissions = await this.withRetry(async () => {
        const permissionsSnapshot = await getDocs(collection(db, 'permissions'));
        const permissions: Permission[] = [];
        
        permissionsSnapshot.forEach((doc) => {
          permissions.push({ id: doc.id, ...doc.data() } as Permission);
        });
        
        return permissions;
      });

      return {
        data: permissions,
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        message: error.message,
        error
      };
    }
  }

  // Generic Firestore methods
  async getDocument<T>(collectionName: string, docId: string): Promise<FirebaseApiResponse<T>> {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          data: { id: docSnap.id, ...docSnap.data() } as T,
          success: true
        };
      } else {
        return {
          data: null,
          success: false,
          message: 'Document not found'
        };
      }
    } catch (error: any) {
      return {
        data: null,
        success: false,
        message: error.message,
        error
      };
    }
  }

  async getCollection<T>(collectionName: string, whereClause?: any, orderByClause?: any): Promise<FirebaseApiResponse<T[]>> {
    try {
      let q = collection(db, collectionName);
      
      if (whereClause) {
        q = query(q, where(whereClause.field, whereClause.operator, whereClause.value));
      }
      
      if (orderByClause) {
        q = query(q, orderBy(orderByClause.field, orderByClause.direction));
      }

      const querySnapshot = await getDocs(q);
      const documents: T[] = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() } as T);
      });

      return {
        data: documents,
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        message: error.message,
        error
      };
    }
  }

  async createDocument<T>(collectionName: string, data: any): Promise<FirebaseApiResponse<T>> {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const newDoc = await getDoc(docRef);
      return {
        data: { id: newDoc.id, ...newDoc.data() } as T,
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        message: error.message,
        error
      };
    }
  }

  async updateDocument<T>(collectionName: string, docId: string, data: any): Promise<FirebaseApiResponse<T>> {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });

      const updatedDoc = await getDoc(docRef);
      return {
        data: { id: updatedDoc.id, ...updatedDoc.data() } as T,
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        message: error.message,
        error
      };
    }
  }

  async deleteDocument(collectionName: string, docId: string): Promise<FirebaseApiResponse<void>> {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      return {
        data: null,
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        message: error.message,
        error
      };
    }
  }

  // File storage methods
  async uploadFile(file: File, path: string): Promise<FirebaseApiResponse<string>> {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        data: downloadURL,
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        message: error.message,
        error
      };
    }
  }

  async deleteFile(path: string): Promise<FirebaseApiResponse<void>> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      
      return {
        data: null,
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        message: error.message,
        error
      };
    }
  }

  async getFileURL(path: string): Promise<FirebaseApiResponse<string>> {
    try {
      const storageRef = ref(storage, path);
      const downloadURL = await getDownloadURL(storageRef);
      
      return {
        data: downloadURL,
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        message: error.message,
        error
      };
    }
  }

  // Auth state listener
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Diagnostic methods
  async testAuthConnection(email: string, password: string): Promise<FirebaseApiResponse<any>> {
    try {
      console.log('🔍 Testing authentication connection...');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Authentication test successful');
      
      // Sign out after test
      await signOut(auth);
      
      return {
        data: {
          success: true,
          user: userCredential.user.email,
          message: 'Authentication test passed'
        },
        success: true
      };
    } catch (error: any) {
      console.error('❌ Authentication test failed:', error);
      return {
        data: null,
        success: false,
        message: `Authentication test failed: ${error.message}`,
        error: {
          code: error.code,
          message: error.message,
          details: error
        }
      };
    }
  }

  async createTestUser(email: string, password: string): Promise<FirebaseApiResponse<any>> {
    try {
      console.log('👤 Creating test user:', email);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create user profile
      const userProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        firstName: 'Test',
        lastName: 'User',
        roleId: 'admin',
        department: 'IT',
        position: 'Developer',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await this.createUserProfile(userProfile);
      
      console.log('✅ Test user created successfully');
      
      return {
        data: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          message: 'Test user created successfully'
        },
        success: true
      };
    } catch (error: any) {
      console.error('❌ Failed to create test user:', error);
      return {
        data: null,
        success: false,
        message: `Failed to create test user: ${error.message}`,
        error: {
          code: error.code,
          message: error.message,
          details: error
        }
      };
    }
  }

  async checkFirebaseConfig(): Promise<FirebaseApiResponse<any>> {
    try {
      console.log('🔍 Checking Firebase configuration...');
      console.log('🔍 Auth instance:', auth);
      console.log('🔍 DB instance:', db);
      
      const config = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
      };
      
      console.log('🔍 Environment variables:', {
        apiKey: config.apiKey ? 'Set' : 'Missing',
        authDomain: config.authDomain ? 'Set' : 'Missing',
        projectId: config.projectId ? 'Set' : 'Missing',
        storageBucket: config.storageBucket ? 'Set' : 'Missing',
        messagingSenderId: config.messagingSenderId ? 'Set' : 'Missing',
        appId: config.appId ? 'Set' : 'Missing',
        measurementId: config.measurementId ? 'Set' : 'Missing'
      });
      
      const missingVars = [];
      for (const [key, value] of Object.entries(config)) {
        if (!value) {
          missingVars.push(key);
        }
      }
      
      if (missingVars.length > 0) {
        return {
          data: null,
          success: false,
          message: `Missing environment variables: ${missingVars.join(', ')}`,
          error: { missingVars }
        };
      }
      
      return {
        data: {
          config: config,
          message: 'Firebase configuration appears valid'
        },
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        message: `Configuration check failed: ${error.message}`,
        error
      };
    }
  }

  // Utility methods
  private mapFirebaseUserToUser(firebaseUser: FirebaseUser, userProfile: UserProfile): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      roleId: userProfile.roleId,
      department: userProfile.department,
      position: userProfile.position,
      phoneNumber: userProfile.phoneNumber,
      avatar: userProfile.avatar,
      isActive: userProfile.isActive,
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt,
      lastLoginAt: userProfile.lastLoginAt
    };
  }
}

// Export singleton instance
export const firebaseService = new FirebaseService(); 