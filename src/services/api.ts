/**
 * API Service
 * Author: VB Entreprise
 * 
 * Centralized API service for data fetching, caching, and error handling
 */

import { mockUsers, mockRoles, mockPermissions } from '../data/mockData';
import type { User, Role, Permission } from '../store';

// Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// API Configuration
const API_CONFIG = {
  baseURL: (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001/api',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Cache configuration
const CACHE_CONFIG = {
  maxAge: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
};

// Cache storage
class Cache {
  private cache = new Map<string, { data: any; timestamp: number }>();

  set(key: string, data: any): void {
    if (this.cache.size >= CACHE_CONFIG.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > CACHE_CONFIG.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

const cache = new Cache();

// Utility functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock API functions (replace with real API calls)
class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache: boolean = false
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `${options.method || 'GET'}_${url}`;

    // Check cache for GET requests
    if (useCache && options.method === 'GET') {
      const cached = cache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      // Simulate API delay
      await delay(500 + Math.random() * 1000);

      // Simulate network errors occasionally
      if (Math.random() < 0.1) {
        throw new Error('Network error');
      }

      // Mock response based on endpoint
      const response = await this.mockApiCall(endpoint, options);

      if (useCache && options.method === 'GET') {
        cache.set(cacheKey, response);
      }

      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw this.handleError(error as Error);
    }
  }

  // Mock API call implementation
  private async mockApiCall(endpoint: string, options: RequestInit): Promise<any> {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : {};

    switch (endpoint) {
      case '/users':
        if (method === 'GET') {
          return { data: mockUsers, success: true };
        } else if (method === 'POST') {
          const newUser = { ...body, id: generateId(), createdAt: new Date() };
          return { data: newUser, success: true };
        }
        break;

      case '/roles':
        if (method === 'GET') {
          return { data: mockRoles, success: true };
        }
        break;

      case '/permissions':
        if (method === 'GET') {
          return { data: mockPermissions, success: true };
        }
        break;

      case '/auth/login':
        const { email, password } = body;
        const user = mockUsers.find(u => u.email === email);
        if (user && password === 'password123') {
          return { 
            data: { 
              user, 
              token: 'mock-jwt-token',
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }, 
            success: true 
          };
        } else {
          throw new Error('Invalid credentials');
        }

      default:
        return { data: null, success: true };
    }
  }

  // Error handling
  private handleError(error: Error): ApiError {
    return {
      message: error.message || 'An unexpected error occurred',
      status: 500,
      code: 'INTERNAL_ERROR',
    };
  }

  // Public API methods
  async get<T>(endpoint: string, useCache: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, useCache);
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Specific API methods
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.get<User[]>('/users');
  }

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.post<User>('/users', userData);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.put<User>(`/users/${id}`, userData);
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/users/${id}`);
  }

  async getRoles(): Promise<ApiResponse<Role[]>> {
    return this.get<Role[]>('/roles');
  }

  async getPermissions(): Promise<ApiResponse<Permission[]>> {
    return this.get<Permission[]>('/permissions');
  }

  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string; expiresAt: Date }>> {
    return this.post<{ user: User; token: string; expiresAt: Date }>('/auth/login', { email, password });
  }

  // Cache management
  clearCache(): void {
    cache.clear();
  }

  clearCacheForEndpoint(endpoint: string): void {
    const keys = Array.from(cache['cache'].keys());
    keys.forEach(key => {
      if (key.includes(endpoint)) {
        cache.delete(key);
      }
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export types
export type { User, Role, Permission } from '../store'; 