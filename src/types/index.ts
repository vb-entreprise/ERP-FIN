/**
 * ERP System Types
 * Author: VB Entreprise
 * 
 * Core type definitions for the ERP system including
 * CRM, project management, finance, and reporting types
 */

// Role-Based Access Control Types
export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export';
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Permission IDs
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
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

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (roleName: string) => boolean;
  isLoading: boolean;
  getUserRoleName: () => string;
  roles: Role[];
  permissions: Permission[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: 'website' | 'referral' | 'social' | 'manual';
  stage: 'prospect' | 'proposal' | 'negotiation' | 'won' | 'lost';
  value: number;
  probability: number;
  createdAt: Date;
  lastContact: Date;
  assignedTo: string;
  notes: string[];
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  progress: number;
  team: TeamMember[];
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date;
  timeSpent: number;
  estimatedHours: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'developer' | 'designer' | 'marketer' | 'manager';
  email: string;
  avatar: string;
  capacity: number; // hours per week
  utilization: number; // percentage
}

export interface Invoice {
  id: string;
  clientId: string;
  projectId?: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: Date;
  createdAt: Date;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'content';
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roi: number;
}

export interface DashboardMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}