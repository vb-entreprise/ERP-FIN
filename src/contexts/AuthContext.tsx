/**
 * Authentication Context
 * Author: VB Entreprise
 * 
 * Provides authentication state and role-based access control
 * throughout the ERP application
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, Role, Permission } from '../types';
import { firebaseService } from '../services/firebase';
import { useNotifications } from '../store';
import { User as FirebaseUser } from 'firebase/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const { addNotification } = useNotifications();

  // Firebase login process
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await firebaseService.signIn(email, password);
      
      if (response.success && response.data) {
        const { user: loggedInUser, token } = response.data;
        
        // Store user data and token
        setUser(loggedInUser);
        localStorage.setItem('erp_user', JSON.stringify(loggedInUser));
        localStorage.setItem('erp_token', token);
        
        // Load roles and permissions in background
        loadRolesAndPermissions();
        
        addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Login Successful',
          message: `Welcome back, ${loggedInUser.firstName}!`,
          timestamp: new Date(),
          read: false
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Login Failed',
        message: errorMessage,
        timestamp: new Date(),
        read: false
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseService.signOut();
      setUser(null);
      setRoles([]);
      setPermissions([]);
      localStorage.removeItem('erp_user');
      localStorage.removeItem('erp_token');
      
      addNotification({
        id: Date.now().toString(),
        type: 'info',
        title: 'Logged Out',
        message: 'You have been successfully logged out.',
        timestamp: new Date(),
        read: false
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if Firebase logout fails
      setUser(null);
      setRoles([]);
      setPermissions([]);
      localStorage.removeItem('erp_user');
      localStorage.removeItem('erp_token');
    }
  };

  // Load roles and permissions (simplified)
  const loadRolesAndPermissions = async () => {
    try {
      // For now, use default roles and permissions to speed up loading
      const defaultRoles: Role[] = [
        {
          id: 'admin',
          name: 'Administrator',
          description: 'Full system access',
          isSystem: true,
          permissions: ['*.*'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'user',
          name: 'User',
          description: 'Standard user access',
          isSystem: true,
          permissions: ['dashboard.read', 'crm.read', 'projects.read'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const defaultPermissions: Permission[] = [
        { id: 'dashboard.read', name: 'View Dashboard', resource: 'dashboard', action: 'read', description: 'Access to view dashboard' },
        { id: 'crm.read', name: 'View CRM', resource: 'crm', action: 'read', description: 'Access to view CRM data' },
        { id: 'projects.read', name: 'View Projects', resource: 'projects', action: 'read', description: 'Access to view projects' },
        { id: 'finance.read', name: 'View Finance', resource: 'finance', action: 'read', description: 'Access to view financial data' },
        { id: 'marketing.read', name: 'View Marketing', resource: 'marketing', action: 'read', description: 'Access to view marketing data' },
        { id: 'documents.read', name: 'View Documents', resource: 'documents', action: 'read', description: 'Access to view documents' },
        { id: 'helpdesk.read', name: 'View Helpdesk', resource: 'helpdesk', action: 'read', description: 'Access to view helpdesk' },
        { id: 'assets.read', name: 'View Assets', resource: 'assets', action: 'read', description: 'Access to view assets' },
        { id: 'reports.read', name: 'View Reports', resource: 'reports', action: 'read', description: 'Access to view reports' },
        { id: 'bi.read', name: 'View BI', resource: 'bi', action: 'read', description: 'Access to view business intelligence' },
        { id: 'collaboration.read', name: 'View Collaboration', resource: 'collaboration', action: 'read', description: 'Access to view collaboration tools' },
        { id: 'quality.read', name: 'View Quality', resource: 'quality', action: 'read', description: 'Access to view quality management' },
        { id: 'settings.read', name: 'View Settings', resource: 'settings', action: 'read', description: 'Access to view settings' }
      ];

      setRoles(defaultRoles);
      setPermissions(defaultPermissions);

      // Try to load from Firebase in background (non-blocking)
      try {
        const [rolesResponse, permissionsResponse] = await Promise.all([
          firebaseService.getRoles(),
          firebaseService.getPermissions()
        ]);

        if (rolesResponse.success && rolesResponse.data) {
          setRoles(rolesResponse.data);
        }

        if (permissionsResponse.success && permissionsResponse.data) {
          setPermissions(permissionsResponse.data);
        }
      } catch (error) {
        console.warn('Failed to load roles/permissions from Firebase, using defaults:', error);
      }
    } catch (error) {
      console.error('Failed to load roles and permissions:', error);
    }
  };

  // Check if user has specific permission
  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    
    const userRole = roles.find(role => role.id === user.roleId);
    if (!userRole) return false;
    
    // Admin has all permissions
    if (userRole.permissions.includes('*.*')) return true;
    
    // Check specific permission
    const requiredPermission = `${resource}.${action}`;
    return userRole.permissions.includes(requiredPermission);
  };

  // Check if user has specific role
  const hasRole = (roleName: string): boolean => {
    if (!user) return false;
    
    const userRole = roles.find(role => role.id === user.roleId);
    return userRole?.name.toLowerCase() === roleName.toLowerCase();
  };

  // Get user's role name
  const getUserRoleName = (): string => {
    if (!user) return '';
    const userRole = roles.find(role => role.id === user.roleId);
    return userRole?.name || 'Unknown Role';
  };

  // Initialize auth state from Firebase (simplified)
  useEffect(() => {
    const unsubscribe = firebaseService.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // User is signed in
          const userProfile = await firebaseService.getUserProfile(firebaseUser.uid);
          
          if (userProfile) {
            const user = {
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              firstName: userProfile.firstName,
              lastName: userProfile.lastName,
              roleId: userProfile.roleId || 'user', // Default to user role
              department: userProfile.department,
              position: userProfile.position,
              phoneNumber: userProfile.phoneNumber,
              avatar: userProfile.avatar,
              isActive: userProfile.isActive,
              createdAt: userProfile.createdAt,
              updatedAt: userProfile.updatedAt,
              lastLoginAt: userProfile.lastLoginAt
            };
            
            setUser(user);
            localStorage.setItem('erp_user', JSON.stringify(user));
            
            // Load roles and permissions in background
            loadRolesAndPermissions();
          } else {
            console.error('User profile not found for Firebase user');
            
            // Try to create a default profile for the user
            try {
              const defaultProfile = {
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
              
              await firebaseService.createUserProfile(defaultProfile);
              console.log('✅ Created default user profile');
              
              // Set user with default profile
              const user = {
                id: firebaseUser.uid,
                email: firebaseUser.email!,
                firstName: defaultProfile.firstName,
                lastName: defaultProfile.lastName,
                roleId: defaultProfile.roleId,
                department: defaultProfile.department,
                position: defaultProfile.position,
                isActive: defaultProfile.isActive,
                createdAt: defaultProfile.createdAt,
                updatedAt: defaultProfile.updatedAt
              };
              
              setUser(user);
              localStorage.setItem('erp_user', JSON.stringify(user));
              loadRolesAndPermissions();
              
            } catch (profileError) {
              console.error('Failed to create default profile:', profileError);
              setUser(null);
              localStorage.removeItem('erp_user');
              localStorage.removeItem('erp_token');
            }
          }
        } else {
          // User is signed out
          setUser(null);
          setRoles([]);
          setPermissions([]);
          localStorage.removeItem('erp_user');
          localStorage.removeItem('erp_token');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
        localStorage.removeItem('erp_user');
        localStorage.removeItem('erp_token');
        
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Authentication Error',
          message: 'Failed to initialize authentication. Please log in again.',
          timestamp: new Date(),
          read: false
        });
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    login,
    logout,
    hasPermission,
    hasRole,
    isLoading,
    getUserRoleName,
    roles,
    permissions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 