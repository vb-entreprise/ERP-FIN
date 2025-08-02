/**
 * State Management Store
 * Author: VB Entreprise
 * 
 * Global state management using Zustand for the ERP system
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockUsers, mockRoles, mockPermissions } from '../data/mockData';

// Types
export interface AppState {
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  
  // Data State
  users: User[];
  roles: Role[];
  permissions: Permission[];
  
  // Loading States
  isLoading: boolean;
  loadingStates: Record<string, boolean>;
  
  // Error States
  errors: Error[];
  
  // Actions
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  setLoading: (key: string, loading: boolean) => void;
  addError: (error: Error) => void;
  clearError: (id: string) => void;
  updateUsers: (users: User[]) => void;
  updateRoles: (roles: Role[]) => void;
  updatePermissions: (permissions: Permission[]) => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface Error {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  context?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  roleId: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export';
  description: string;
}

// Custom serializer/deserializer for Date objects
const serializeDate = (obj: any): any => {
  if (obj instanceof Date) {
    return { __type: 'Date', value: obj.toISOString() };
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeDate);
  }
  if (obj && typeof obj === 'object') {
    const serialized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        serialized[key] = serializeDate(obj[key]);
      }
    }
    return serialized;
  }
  return obj;
};

const deserializeDate = (obj: any): any => {
  if (obj && typeof obj === 'object' && obj.__type === 'Date') {
    return new Date(obj.value);
  }
  if (Array.isArray(obj)) {
    return obj.map(deserializeDate);
  }
  if (obj && typeof obj === 'object') {
    const deserialized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        deserialized[key] = deserializeDate(obj[key]);
      }
    }
    return deserialized;
  }
  return obj;
};

// Create store
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarOpen: false,
      theme: 'light',
      notifications: [],
      users: mockUsers,
      roles: mockRoles,
      permissions: mockPermissions,
      isLoading: false,
      loadingStates: {},
      errors: [],

      // Actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setTheme: (theme) => set({ theme }),

      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, notification]
      })),

      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),

      setLoading: (key, loading) => set((state) => ({
        loadingStates: { ...state.loadingStates, [key]: loading }
      })),

      addError: (error) => set((state) => ({
        errors: [...state.errors, error]
      })),

      clearError: (id) => set((state) => ({
        errors: state.errors.filter(e => e.id !== id)
      })),

      updateUsers: (users) => set({ users }),

      updateRoles: (roles) => set({ roles }),

      updatePermissions: (permissions) => set({ permissions }),
    }),
    {
      name: 'erp-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        notifications: serializeDate(state.notifications),
        users: serializeDate(state.users),
        roles: serializeDate(state.roles),
        permissions: state.permissions,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Deserialize Date objects when restoring from storage
          state.notifications = deserializeDate(state.notifications);
          state.users = deserializeDate(state.users);
          state.roles = deserializeDate(state.roles);
        }
      },
    }
  )
);

// Selector hooks for better performance
export const useSidebar = () => useAppStore((state) => ({
  sidebarOpen: state.sidebarOpen,
  toggleSidebar: state.toggleSidebar,
}));

export const useTheme = () => useAppStore((state) => ({
  theme: state.theme,
  setTheme: state.setTheme,
}));

export const useNotifications = () => useAppStore((state) => ({
  notifications: state.notifications,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
}));

export const useLoading = () => useAppStore((state) => ({
  isLoading: state.isLoading,
  loadingStates: state.loadingStates,
  setLoading: state.setLoading,
}));

export const useErrors = () => useAppStore((state) => ({
  errors: state.errors,
  addError: state.addError,
  clearError: state.clearError,
}));

export const useUsers = () => useAppStore((state) => ({
  users: state.users,
  updateUsers: state.updateUsers,
}));

export const useRoles = () => useAppStore((state) => ({
  roles: state.roles,
  updateRoles: state.updateRoles,
}));

export const usePermissions = () => useAppStore((state) => ({
  permissions: state.permissions,
  updatePermissions: state.updatePermissions,
})); 