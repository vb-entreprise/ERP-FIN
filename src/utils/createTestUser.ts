/**
 * Create Test User Utility
 * Author: VB Entreprise
 * 
 * Utility for creating test users and fixing missing user profiles
 */

import { firebaseService } from '../services/firebase';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export interface TestUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: string;
  department: string;
  position: string;
}

/**
 * Create a test user with full profile
 */
export async function createTestUser(
  email: string = 'test@example.com',
  password: string = 'testpassword123',
  userData?: Partial<TestUserData>
): Promise<{ success: boolean; message: string; user?: any }> {
  try {
    console.log('🔧 Test user utility loaded!');
    console.log('💡 Run: createTestUser("your-email@example.com", "YourPassword123!")');
    
    const defaultUserData: TestUserData = {
      email,
      password,
      firstName: userData?.firstName || 'Test',
      lastName: userData?.lastName || 'User',
      roleId: userData?.roleId || 'admin',
      department: userData?.department || 'IT',
      position: userData?.position || 'Developer'
    };

    // Check if user already exists in Firebase Auth
    try {
      // Try to sign in to see if user exists
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      console.log('✅ User already exists in Firebase Auth:', firebaseUser.email);
      
      // Check if user profile exists in Firestore
      const existingProfile = await firebaseService.getUserProfile(firebaseUser.uid);
      
      if (existingProfile) {
        console.log('✅ User profile already exists in Firestore');
        return {
          success: true,
          message: 'User already exists with profile',
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            profile: existingProfile
          }
        };
      } else {
        console.log('⚠️ User exists in Auth but no profile in Firestore - creating profile...');
        
        // Create user profile in Firestore
        const userProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          firstName: defaultUserData.firstName,
          lastName: defaultUserData.lastName,
          roleId: defaultUserData.roleId,
          department: defaultUserData.department,
          position: defaultUserData.position,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await firebaseService.createUserProfile(userProfile);
        console.log('✅ User profile created successfully');
        
        return {
          success: true,
          message: 'User profile created for existing Auth user',
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            profile: userProfile
          }
        };
      }
      
    } catch (authError: any) {
      // User doesn't exist in Auth, create new user
      if (authError.code === 'auth/user-not-found') {
        console.log('👤 Creating new test user...');
        
        const result = await firebaseService.createTestUser(email, password);
        
        if (result.success) {
          console.log('✅ Test user created successfully');
          return {
            success: true,
            message: 'Test user created successfully',
            user: result.data
          };
        } else {
          console.error('❌ Failed to create test user:', result.message);
          return {
            success: false,
            message: result.message || 'Failed to create test user'
          };
        }
      } else {
        console.error('❌ Authentication error:', authError.message);
        return {
          success: false,
          message: `Authentication error: ${authError.message}`
        };
      }
    }
    
  } catch (error: any) {
    console.error('❌ Error in createTestUser:', error);
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}

/**
 * Fix missing user profile for existing Firebase Auth user
 */
export async function fixMissingUserProfile(uid: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🔧 Fixing missing user profile for UID:', uid);
    
    // Get the Firebase user
    const firebaseUser = auth.currentUser;
    if (!firebaseUser || firebaseUser.uid !== uid) {
      return {
        success: false,
        message: 'User not authenticated or UID mismatch'
      };
    }
    
    // Check if profile already exists
    const existingProfile = await firebaseService.getUserProfile(uid);
    if (existingProfile) {
      return {
        success: true,
        message: 'User profile already exists'
      };
    }
    
    // Create user profile
    const userProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
      lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || 'Name',
      roleId: 'user',
      department: 'General',
      position: 'User',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await firebaseService.createUserProfile(userProfile);
    console.log('✅ User profile created successfully');
    
    return {
      success: true,
      message: 'User profile created successfully'
    };
    
  } catch (error: any) {
    console.error('❌ Error fixing user profile:', error);
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}

/**
 * Get or create user profile for current authenticated user
 */
export async function ensureUserProfile(): Promise<{ success: boolean; message: string; profile?: any }> {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      return {
        success: false,
        message: 'No user is currently authenticated'
      };
    }
    
    // Try to get existing profile
    let userProfile = await firebaseService.getUserProfile(firebaseUser.uid);
    
    if (!userProfile) {
      console.log('⚠️ No user profile found, creating one...');
      
      // Create default profile
      userProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
        lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || 'Name',
        roleId: 'user',
        department: 'General',
        position: 'User',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await firebaseService.createUserProfile(userProfile);
      console.log('✅ User profile created');
    }
    
    return {
      success: true,
      message: 'User profile ensured',
      profile: userProfile
    };
    
  } catch (error: any) {
    console.error('❌ Error ensuring user profile:', error);
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).createTestUser = createTestUser;
  (window as any).fixMissingUserProfile = fixMissingUserProfile;
  (window as any).ensureUserProfile = ensureUserProfile;
} 