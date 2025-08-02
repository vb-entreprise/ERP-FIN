/**
 * Admin User Creation Utility
 * 
 * This utility helps create an admin user and remove current users
 * for development and testing purposes
 */

import { firebaseService } from '../services/firebase';
import type { User, Role, Permission } from '../types';

// Admin user configuration
const ADMIN_USER_CONFIG = {
  email: 'admin@vbenterprise.com',
  password: 'Admin@123456',
  firstName: 'System',
  lastName: 'Administrator',
  roleId: 'admin',
  department: 'IT',
  position: 'System Administrator',
  phoneNumber: '+1234567890',
  isActive: true
};

// Admin role configuration
const ADMIN_ROLE: Role = {
  id: 'admin',
  name: 'Administrator',
  description: 'Full system access with all permissions',
  permissions: [
    'crm:create', 'crm:read', 'crm:update', 'crm:delete',
    'projects:create', 'projects:read', 'projects:update', 'projects:delete',
    'finance:create', 'finance:read', 'finance:update', 'finance:delete',
    'marketing:create', 'marketing:read', 'marketing:update', 'marketing:delete',
    'documents:create', 'documents:read', 'documents:update', 'documents:delete',
    'reports:create', 'reports:read', 'reports:update', 'reports:delete',
    'settings:create', 'settings:read', 'settings:update', 'settings:delete',
    'collaboration:create', 'collaboration:read', 'collaboration:update', 'collaboration:delete',
    'audit:create', 'audit:read', 'audit:update', 'audit:delete',
    'approvals:create', 'approvals:read', 'approvals:update', 'approvals:delete',
    'workflows:create', 'workflows:read', 'workflows:update', 'workflows:delete',
    'contracts:create', 'contracts:read', 'contracts:update', 'contracts:delete'
  ],
  isSystem: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Admin permissions
const ADMIN_PERMISSIONS: Permission[] = [
  // CRM Permissions
  { id: 'crm:create', name: 'Create CRM Records', resource: 'crm', action: 'create', description: 'Create leads, contacts, opportunities' },
  { id: 'crm:read', name: 'Read CRM Records', resource: 'crm', action: 'read', description: 'View all CRM data' },
  { id: 'crm:update', name: 'Update CRM Records', resource: 'crm', action: 'update', description: 'Modify CRM records' },
  { id: 'crm:delete', name: 'Delete CRM Records', resource: 'crm', action: 'delete', description: 'Delete CRM records' },
  
  // Project Permissions
  { id: 'projects:create', name: 'Create Projects', resource: 'projects', action: 'create', description: 'Create new projects' },
  { id: 'projects:read', name: 'Read Projects', resource: 'projects', action: 'read', description: 'View all projects' },
  { id: 'projects:update', name: 'Update Projects', resource: 'projects', action: 'update', description: 'Modify projects' },
  { id: 'projects:delete', name: 'Delete Projects', resource: 'projects', action: 'delete', description: 'Delete projects' },
  
  // Finance Permissions
  { id: 'finance:create', name: 'Create Financial Records', resource: 'finance', action: 'create', description: 'Create invoices, payments, expenses' },
  { id: 'finance:read', name: 'Read Financial Records', resource: 'finance', action: 'read', description: 'View all financial data' },
  { id: 'finance:update', name: 'Update Financial Records', resource: 'finance', action: 'update', description: 'Modify financial records' },
  { id: 'finance:delete', name: 'Delete Financial Records', resource: 'finance', action: 'delete', description: 'Delete financial records' },
  
  // Marketing Permissions
  { id: 'marketing:create', name: 'Create Marketing Campaigns', resource: 'marketing', action: 'create', description: 'Create marketing campaigns' },
  { id: 'marketing:read', name: 'Read Marketing Data', resource: 'marketing', action: 'read', description: 'View marketing data' },
  { id: 'marketing:update', name: 'Update Marketing Data', resource: 'marketing', action: 'update', description: 'Modify marketing data' },
  { id: 'marketing:delete', name: 'Delete Marketing Data', resource: 'marketing', action: 'delete', description: 'Delete marketing data' },
  
  // Document Permissions
  { id: 'documents:create', name: 'Create Documents', resource: 'documents', action: 'create', description: 'Create documents and contracts' },
  { id: 'documents:read', name: 'Read Documents', resource: 'documents', action: 'read', description: 'View all documents' },
  { id: 'documents:update', name: 'Update Documents', resource: 'documents', action: 'update', description: 'Modify documents' },
  { id: 'documents:delete', name: 'Delete Documents', resource: 'documents', action: 'delete', description: 'Delete documents' },
  
  // Report Permissions
  { id: 'reports:create', name: 'Create Reports', resource: 'reports', action: 'create', description: 'Create custom reports' },
  { id: 'reports:read', name: 'Read Reports', resource: 'reports', action: 'read', description: 'View all reports' },
  { id: 'reports:update', name: 'Update Reports', resource: 'reports', action: 'update', description: 'Modify reports' },
  { id: 'reports:delete', name: 'Delete Reports', resource: 'reports', action: 'delete', description: 'Delete reports' },
  
  // Settings Permissions
  { id: 'settings:create', name: 'Create Settings', resource: 'settings', action: 'create', description: 'Create system settings' },
  { id: 'settings:read', name: 'Read Settings', resource: 'settings', action: 'read', description: 'View system settings' },
  { id: 'settings:update', name: 'Update Settings', resource: 'settings', action: 'update', description: 'Modify system settings' },
  { id: 'settings:delete', name: 'Delete Settings', resource: 'settings', action: 'delete', description: 'Delete system settings' },
  
  // Collaboration Permissions
  { id: 'collaboration:create', name: 'Create Collaboration Items', resource: 'collaboration', action: 'create', description: 'Create chat messages, activities' },
  { id: 'collaboration:read', name: 'Read Collaboration Data', resource: 'collaboration', action: 'read', description: 'View collaboration data' },
  { id: 'collaboration:update', name: 'Update Collaboration Data', resource: 'collaboration', action: 'update', description: 'Modify collaboration data' },
  { id: 'collaboration:delete', name: 'Delete Collaboration Data', resource: 'collaboration', action: 'delete', description: 'Delete collaboration data' },
  
  // Audit Permissions
  { id: 'audit:create', name: 'Create Audit Records', resource: 'audit', action: 'create', description: 'Create audit logs' },
  { id: 'audit:read', name: 'Read Audit Records', resource: 'audit', action: 'read', description: 'View audit logs' },
  { id: 'audit:update', name: 'Update Audit Records', resource: 'audit', action: 'update', description: 'Modify audit logs' },
  { id: 'audit:delete', name: 'Delete Audit Records', resource: 'audit', action: 'delete', description: 'Delete audit logs' },
  
  // Approval Permissions
  { id: 'approvals:create', name: 'Create Approvals', resource: 'approvals', action: 'create', description: 'Create approval workflows' },
  { id: 'approvals:read', name: 'Read Approvals', resource: 'approvals', action: 'read', description: 'View approval workflows' },
  { id: 'approvals:update', name: 'Update Approvals', resource: 'approvals', action: 'update', description: 'Modify approval workflows' },
  { id: 'approvals:delete', name: 'Delete Approvals', resource: 'approvals', action: 'delete', description: 'Delete approval workflows' },
  
  // Workflow Permissions
  { id: 'workflows:create', name: 'Create Workflows', resource: 'workflows', action: 'create', description: 'Create automation workflows' },
  { id: 'workflows:read', name: 'Read Workflows', resource: 'workflows', action: 'read', description: 'View workflows' },
  { id: 'workflows:update', name: 'Update Workflows', resource: 'workflows', action: 'update', description: 'Modify workflows' },
  { id: 'workflows:delete', name: 'Delete Workflows', resource: 'workflows', action: 'delete', description: 'Delete workflows' },
  
  // Contract Permissions
  { id: 'contracts:create', name: 'Create Contracts', resource: 'contracts', action: 'create', description: 'Create contracts and agreements' },
  { id: 'contracts:read', name: 'Read Contracts', resource: 'contracts', action: 'read', description: 'View all contracts' },
  { id: 'contracts:update', name: 'Update Contracts', resource: 'contracts', action: 'update', description: 'Modify contracts' },
  { id: 'contracts:delete', name: 'Delete Contracts', resource: 'contracts', action: 'delete', description: 'Delete contracts' }
];

/**
 * Create admin user and role in the system
 */
export const createAdminUser = async (): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    console.log('🔧 Creating admin user...');
    
    // Step 1: Create admin role
    console.log('📝 Creating admin role...');
    await firebaseService.createDocument('roles', ADMIN_ROLE);
    console.log('✅ Admin role created');
    
    // Step 2: Create admin permissions
    console.log('🔑 Creating admin permissions...');
    for (const permission of ADMIN_PERMISSIONS) {
      await firebaseService.createDocument('permissions', permission);
    }
    console.log('✅ Admin permissions created');
    
    // Step 3: Create admin user
    console.log('👤 Creating admin user...');
    const userResponse = await firebaseService.signUp(
      ADMIN_USER_CONFIG.email,
      ADMIN_USER_CONFIG.password,
      {
        firstName: ADMIN_USER_CONFIG.firstName,
        lastName: ADMIN_USER_CONFIG.lastName,
        roleId: ADMIN_USER_CONFIG.roleId,
        department: ADMIN_USER_CONFIG.department,
        position: ADMIN_USER_CONFIG.position,
        phoneNumber: ADMIN_USER_CONFIG.phoneNumber,
        isActive: ADMIN_USER_CONFIG.isActive
      }
    );
    
    if (userResponse.success && userResponse.data) {
      console.log('✅ Admin user created successfully');
      return {
        success: true,
        message: 'Admin user created successfully',
        user: userResponse.data
      };
    } else {
      throw new Error(userResponse.message || 'Failed to create admin user');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Remove current user from local storage and Firebase
 */
export const removeCurrentUser = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('🗑️ Removing current user...');
    
    // Clear local storage
    localStorage.removeItem('erp_user');
    localStorage.removeItem('erp_token');
    
    // Sign out from Firebase
    await firebaseService.signOut();
    
    console.log('✅ Current user removed successfully');
    return {
      success: true,
      message: 'Current user removed successfully'
    };
  } catch (error) {
    console.error('❌ Error removing current user:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Complete admin setup process
 */
export const setupAdminUser = async (): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    console.log('🚀 Starting admin user setup...');
    
    // Step 1: Remove current user
    const removeResult = await removeCurrentUser();
    if (!removeResult.success) {
      return removeResult;
    }
    
    // Step 2: Create admin user
    const createResult = await createAdminUser();
    if (!createResult.success) {
      return createResult;
    }
    
    console.log('🎉 Admin user setup completed successfully!');
    console.log('📧 Email:', ADMIN_USER_CONFIG.email);
    console.log('🔑 Password:', ADMIN_USER_CONFIG.password);
    
    return {
      success: true,
      message: 'Admin user setup completed successfully',
      user: createResult.user
    };
  } catch (error) {
    console.error('❌ Error in admin setup:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Get admin user credentials
 */
export const getAdminCredentials = () => {
  return {
    email: ADMIN_USER_CONFIG.email,
    password: ADMIN_USER_CONFIG.password
  };
}; 