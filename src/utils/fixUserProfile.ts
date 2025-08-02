/**
 * Fix User Profile Utility
 * Author: VB Entreprise
 * 
 * Quick fix for missing user profiles - run this in browser console
 */

import { firebaseService } from '../services/firebase';
import { auth } from '../config/firebase';

/**
 * Quick fix for the current user's missing profile
 * Run this in browser console: fixCurrentUserProfile()
 */
export async function fixCurrentUserProfile(): Promise<string> {
  try {
    const firebaseUser = auth.currentUser;
    
    if (!firebaseUser) {
      return '❌ No user is currently authenticated';
    }
    
    console.log('🔧 Fixing profile for user:', firebaseUser.email);
    console.log('🆔 UID:', firebaseUser.uid);
    
    // Check if profile already exists
    const existingProfile = await firebaseService.getUserProfile(firebaseUser.uid);
    
    if (existingProfile) {
      return '✅ User profile already exists';
    }
    
    // Create default profile
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
    
    return '✅ User profile created successfully! You can now refresh the page and log in.';
    
  } catch (error: any) {
    console.error('❌ Error fixing user profile:', error);
    return `❌ Error: ${error.message}`;
  }
}

/**
 * Create a test user with proper profile
 * Run this in browser console: createTestUserWithProfile()
 */
export async function createTestUserWithProfile(): Promise<string> {
  try {
    const email = 'test@example.com';
    const password = 'testpassword123';
    
    console.log('👤 Creating test user with profile...');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    
    // Try to sign in first to see if user exists
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      console.log('✅ User exists in Firebase Auth');
      
      // Check if profile exists
      const existingProfile = await firebaseService.getUserProfile(firebaseUser.uid);
      
      if (existingProfile) {
        return '✅ Test user already exists with profile';
      }
      
      // Create profile for existing user
      const userProfile = {
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
      
      await firebaseService.createUserProfile(userProfile);
      console.log('✅ User profile created for existing user');
      
      return `✅ Test user profile created! You can now log in with:
📧 Email: ${email}
🔑 Password: ${password}`;
      
    } catch (authError: any) {
      if (authError.code === 'auth/user-not-found') {
        // Create new user
        const result = await firebaseService.createTestUser(email, password);
        
        if (result.success) {
          return `✅ Test user created successfully! You can now log in with:
📧 Email: ${email}
🔑 Password: ${password}`;
        } else {
          return `❌ Failed to create test user: ${result.message}`;
        }
      } else {
        return `❌ Authentication error: ${authError.message}`;
      }
    }
    
  } catch (error: any) {
    console.error('❌ Error creating test user:', error);
    return `❌ Error: ${error.message}`;
  }
}

// Make functions available globally for browser console access
if (typeof window !== 'undefined') {
  (window as any).fixCurrentUserProfile = fixCurrentUserProfile;
  (window as any).createTestUserWithProfile = createTestUserWithProfile;
  
  console.log('🔧 User profile fix utilities loaded!');
  console.log('💡 Run: fixCurrentUserProfile() to fix current user profile');
  console.log('💡 Run: createTestUserWithProfile() to create test user with profile');
} 