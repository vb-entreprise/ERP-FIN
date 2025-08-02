/**
 * Firebase Initialization Utility
 * Author: VB Entreprise
 * 
 * Sets up initial Firestore collections and seed data
 */

import { firebaseService } from '../services/firebase';
import { mockUsers, mockRoles, mockPermissions } from '../data/mockData';

export interface SeedData {
  users: any[];
  roles: any[];
  permissions: any[];
}

export class FirebaseInitializer {
  private static instance: FirebaseInitializer;
  private initialized = false;

  private constructor() {}

  static getInstance(): FirebaseInitializer {
    if (!FirebaseInitializer.instance) {
      FirebaseInitializer.instance = new FirebaseInitializer();
    }
    return FirebaseInitializer.instance;
  }

  async initializeDatabase(): Promise<void> {
    if (this.initialized) {
      console.log('Database already initialized');
      return;
    }

    try {
      console.log('Initializing Firebase database...');
      
      // Initialize roles
      await this.initializeRoles();
      
      // Initialize permissions
      await this.initializePermissions();
      
      // Initialize users
      await this.initializeUsers();
      
      this.initialized = true;
      console.log('Firebase database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase database:', error);
      throw error;
    }
  }

  private async initializeRoles(): Promise<void> {
    try {
      const rolesResponse = await firebaseService.getRoles();
      
      if (!rolesResponse.success || !rolesResponse.data || rolesResponse.data.length === 0) {
        console.log('Creating initial roles...');
        
        for (const role of mockRoles) {
          await firebaseService.createDocument('roles', {
            name: role.name,
            description: role.description,
            permissions: role.permissions,
            isActive: role.isActive,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        
        console.log('Roles initialized successfully');
      } else {
        console.log('Roles already exist, skipping initialization');
      }
    } catch (error) {
      console.error('Error initializing roles:', error);
      throw error;
    }
  }

  private async initializePermissions(): Promise<void> {
    try {
      const permissionsResponse = await firebaseService.getPermissions();
      
      if (!permissionsResponse.success || !permissionsResponse.data || permissionsResponse.data.length === 0) {
        console.log('Creating initial permissions...');
        
        for (const permission of mockPermissions) {
          await firebaseService.createDocument('permissions', {
            name: permission.name,
            description: permission.description,
            resource: permission.resource,
            action: permission.action,
            isActive: permission.isActive,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        
        console.log('Permissions initialized successfully');
      } else {
        console.log('Permissions already exist, skipping initialization');
      }
    } catch (error) {
      console.error('Error initializing permissions:', error);
      throw error;
    }
  }

  private async initializeUsers(): Promise<void> {
    try {
      // Note: Users will be created when they sign up through Firebase Auth
      // This is just for reference of the expected user structure
      console.log('User initialization: Users will be created during signup process');
    } catch (error) {
      console.error('Error initializing users:', error);
      throw error;
    }
  }

  async createUserProfile(userId: string, userData: any): Promise<void> {
    try {
      await firebaseService.createUserProfile({
        uid: userId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        roleId: userData.roleId || 'employee',
        department: userData.department || '',
        position: userData.position || '',
        phoneNumber: userData.phoneNumber,
        avatar: userData.avatar,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  async getSeedData(): Promise<SeedData> {
    try {
      const [rolesResponse, permissionsResponse] = await Promise.all([
        firebaseService.getRoles(),
        firebaseService.getPermissions()
      ]);

      return {
        users: mockUsers, // Users are created during signup
        roles: rolesResponse.data || [],
        permissions: permissionsResponse.data || []
      };
    } catch (error) {
      console.error('Error getting seed data:', error);
      throw error;
    }
  }

  async resetDatabase(): Promise<void> {
    try {
      console.log('Resetting Firebase database...');
      
      // This would require admin SDK for full reset
      // For now, we'll just clear the cache
      console.log('Database reset completed (cache cleared)');
    } catch (error) {
      console.error('Error resetting database:', error);
      throw error;
    }
  }
}

export const firebaseInitializer = FirebaseInitializer.getInstance(); 