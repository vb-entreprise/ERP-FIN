/**
 * ERP Firebase Service
 * Author: VB Entreprise
 * 
 * Specialized Firebase service for ERP-specific operations
 */

import { firebaseService } from './firebase';

// ERP Entity Types
export interface Project {
  id?: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  budget: number;
  clientId: string;
  managerId: string;
  teamMembers: string[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id?: string;
  invoiceNumber: string;
  clientId: string;
  projectId?: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  issueDate: Date;
  paidDate?: Date;
  items: InvoiceItem[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Contact {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  type: 'client' | 'vendor' | 'employee' | 'partner';
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Asset {
  id?: string;
  name: string;
  type: 'hardware' | 'software' | 'furniture' | 'vehicle' | 'other';
  serialNumber?: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  location: string;
  assignedTo?: string;
  status: 'active' | 'maintenance' | 'retired' | 'lost';
  warrantyExpiry?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id?: string;
  title: string;
  description: string;
  projectId?: string;
  assignedTo: string;
  assignedBy: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  dueDate: Date;
  completedDate?: Date;
  estimatedHours: number;
  actualHours?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

class ERPFirebaseService {
  // Project Management
  async getProjects(userId?: string): Promise<any> {
    const whereClause = userId ? { field: 'managerId', operator: '==', value: userId } : undefined;
    return firebaseService.getCollection<Project>('projects', whereClause, { field: 'createdAt', direction: 'desc' });
  }

  async getProject(projectId: string): Promise<any> {
    return firebaseService.getDocument<Project>('projects', projectId);
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return firebaseService.createDocument<Project>('projects', project);
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<any> {
    return firebaseService.updateDocument<Project>('projects', projectId, updates);
  }

  async deleteProject(projectId: string): Promise<any> {
    return firebaseService.deleteDocument('projects', projectId);
  }

  // Invoice Management
  async getInvoices(userId?: string): Promise<any> {
    const whereClause = userId ? { field: 'clientId', operator: '==', value: userId } : undefined;
    return firebaseService.getCollection<Invoice>('invoices', whereClause, { field: 'issueDate', direction: 'desc' });
  }

  async getInvoice(invoiceId: string): Promise<any> {
    return firebaseService.getDocument<Invoice>('invoices', invoiceId);
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return firebaseService.createDocument<Invoice>('invoices', invoice);
  }

  async updateInvoice(invoiceId: string, updates: Partial<Invoice>): Promise<any> {
    return firebaseService.updateDocument<Invoice>('invoices', invoiceId, updates);
  }

  async deleteInvoice(invoiceId: string): Promise<any> {
    return firebaseService.deleteDocument('invoices', invoiceId);
  }

  // Contact Management
  async getContacts(type?: string): Promise<any> {
    const whereClause = type ? { field: 'type', operator: '==', value: type } : undefined;
    return firebaseService.getCollection<Contact>('contacts', whereClause, { field: 'lastName', direction: 'asc' });
  }

  async getContact(contactId: string): Promise<any> {
    return firebaseService.getDocument<Contact>('contacts', contactId);
  }

  async createContact(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return firebaseService.createDocument<Contact>('contacts', contact);
  }

  async updateContact(contactId: string, updates: Partial<Contact>): Promise<any> {
    return firebaseService.updateDocument<Contact>('contacts', contactId, updates);
  }

  async deleteContact(contactId: string): Promise<any> {
    return firebaseService.deleteDocument('contacts', contactId);
  }

  // Asset Management
  async getAssets(status?: string): Promise<any> {
    const whereClause = status ? { field: 'status', operator: '==', value: status } : undefined;
    return firebaseService.getCollection<Asset>('assets', whereClause, { field: 'name', direction: 'asc' });
  }

  async getAsset(assetId: string): Promise<any> {
    return firebaseService.getDocument<Asset>('assets', assetId);
  }

  async createAsset(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return firebaseService.createDocument<Asset>('assets', asset);
  }

  async updateAsset(assetId: string, updates: Partial<Asset>): Promise<any> {
    return firebaseService.updateDocument<Asset>('assets', assetId, updates);
  }

  async deleteAsset(assetId: string): Promise<any> {
    return firebaseService.deleteDocument('assets', assetId);
  }

  // Task Management
  async getTasks(userId?: string, status?: string): Promise<any> {
    let whereClause;
    if (userId && status) {
      // This would need to be implemented with multiple where clauses
      whereClause = { field: 'assignedTo', operator: '==', value: userId };
    } else if (userId) {
      whereClause = { field: 'assignedTo', operator: '==', value: userId };
    } else if (status) {
      whereClause = { field: 'status', operator: '==', value: status };
    }
    
    return firebaseService.getCollection<Task>('tasks', whereClause, { field: 'dueDate', direction: 'asc' });
  }

  async getTask(taskId: string): Promise<any> {
    return firebaseService.getDocument<Task>('tasks', taskId);
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return firebaseService.createDocument<Task>('tasks', task);
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<any> {
    return firebaseService.updateDocument<Task>('tasks', taskId, updates);
  }

  async deleteTask(taskId: string): Promise<any> {
    return firebaseService.deleteDocument('tasks', taskId);
  }

  // Dashboard Analytics
  async getDashboardStats(): Promise<any> {
    try {
      const [projectsResponse, invoicesResponse, tasksResponse, assetsResponse] = await Promise.all([
        this.getProjects(),
        this.getInvoices(),
        this.getTasks(),
        this.getAssets()
      ]);

      const projects = projectsResponse.data || [];
      const invoices = invoicesResponse.data || [];
      const tasks = tasksResponse.data || [];
      const assets = assetsResponse.data || [];

      // Calculate statistics
      const stats = {
        totalProjects: projects.length,
        activeProjects: projects.filter((p: Project) => p.status === 'active').length,
        totalRevenue: invoices
          .filter((i: Invoice) => i.status === 'paid')
          .reduce((sum: number, i: Invoice) => sum + i.total, 0),
        pendingInvoices: invoices.filter((i: Invoice) => i.status === 'sent').length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter((t: Task) => t.status === 'completed').length,
        totalAssets: assets.length,
        activeAssets: assets.filter((a: Asset) => a.status === 'active').length,
        assetValue: assets
          .filter((a: Asset) => a.status === 'active')
          .reduce((sum: number, a: Asset) => sum + a.currentValue, 0)
      };

      return {
        data: stats,
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

  // Search functionality
  async searchProjects(query: string): Promise<any> {
    // Note: This is a simplified search. For production, consider using Algolia or similar
    const response = await this.getProjects();
    if (response.success && response.data) {
      const filtered = response.data.filter((project: Project) =>
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase())
      );
      return {
        data: filtered,
        success: true
      };
    }
    return response;
  }

  async searchContacts(query: string): Promise<any> {
    const response = await this.getContacts();
    if (response.success && response.data) {
      const filtered = response.data.filter((contact: Contact) =>
        contact.firstName.toLowerCase().includes(query.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(query.toLowerCase()) ||
        contact.email.toLowerCase().includes(query.toLowerCase()) ||
        contact.company?.toLowerCase().includes(query.toLowerCase())
      );
      return {
        data: filtered,
        success: true
      };
    }
    return response;
  }

  // File upload for ERP documents
  async uploadDocument(file: File, category: string, entityId: string): Promise<any> {
    const timestamp = Date.now();
    const fileName = `${category}/${entityId}/${timestamp}_${file.name}`;
    return firebaseService.uploadFile(file, fileName);
  }

  async deleteDocument(filePath: string): Promise<any> {
    return firebaseService.deleteFile(filePath);
  }
}

// Export singleton instance
export const erpFirebaseService = new ERPFirebaseService(); 