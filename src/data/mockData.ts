/**
 * Mock Data for ERP System
 * Author: VB Entreprise
 * 
 * Sample data for development and testing
 */

import { Permission, Role, User } from '../types';

// Mock Permissions
export const mockPermissions: Permission[] = [
  // CRM Permissions
  { id: 'crm.leads.read', name: 'View Leads', resource: 'leads', action: 'read', description: 'View lead information' },
  { id: 'crm.leads.create', name: 'Create Leads', resource: 'leads', action: 'create', description: 'Create new leads' },
  { id: 'crm.leads.update', name: 'Edit Leads', resource: 'leads', action: 'update', description: 'Edit lead information' },
  { id: 'crm.leads.delete', name: 'Delete Leads', resource: 'leads', action: 'delete', description: 'Delete leads' },
  { id: 'crm.contacts.read', name: 'View Contacts', resource: 'contacts', action: 'read', description: 'View contact information' },
  { id: 'crm.contacts.create', name: 'Create Contacts', resource: 'contacts', action: 'create', description: 'Create new contacts' },
  { id: 'crm.contacts.update', name: 'Edit Contacts', resource: 'contacts', action: 'update', description: 'Edit contact information' },
  { id: 'crm.contacts.delete', name: 'Delete Contacts', resource: 'contacts', action: 'delete', description: 'Delete contacts' },
  { id: 'crm.opportunities.read', name: 'View Opportunities', resource: 'opportunities', action: 'read', description: 'View opportunity information' },
  { id: 'crm.opportunities.create', name: 'Create Opportunities', resource: 'opportunities', action: 'create', description: 'Create new opportunities' },
  { id: 'crm.opportunities.update', name: 'Edit Opportunities', resource: 'opportunities', action: 'update', description: 'Edit opportunity information' },
  { id: 'crm.opportunities.delete', name: 'Delete Opportunities', resource: 'opportunities', action: 'delete', description: 'Delete opportunities' },
  { id: 'crm.proposals.read', name: 'View Proposals', resource: 'proposals', action: 'read', description: 'View proposal information' },
  { id: 'crm.proposals.create', name: 'Create Proposals', resource: 'proposals', action: 'create', description: 'Create new proposals' },
  { id: 'crm.proposals.update', name: 'Edit Proposals', resource: 'proposals', action: 'update', description: 'Edit proposal information' },
  { id: 'crm.proposals.delete', name: 'Delete Proposals', resource: 'proposals', action: 'delete', description: 'Delete proposals' },

  // Project Permissions
  { id: 'projects.read', name: 'View Projects', resource: 'projects', action: 'read', description: 'View project information' },
  { id: 'projects.create', name: 'Create Projects', resource: 'projects', action: 'create', description: 'Create new projects' },
  { id: 'projects.update', name: 'Edit Projects', resource: 'projects', action: 'update', description: 'Edit project information' },
  { id: 'projects.delete', name: 'Delete Projects', resource: 'projects', action: 'delete', description: 'Delete projects' },
  { id: 'tasks.read', name: 'View Tasks', resource: 'tasks', action: 'read', description: 'View task information' },
  { id: 'tasks.create', name: 'Create Tasks', resource: 'tasks', action: 'create', description: 'Create new tasks' },
  { id: 'tasks.update', name: 'Edit Tasks', resource: 'tasks', action: 'update', description: 'Edit task information' },
  { id: 'tasks.delete', name: 'Delete Tasks', resource: 'tasks', action: 'delete', description: 'Delete tasks' },

  // Finance Permissions
  { id: 'finance.invoices.read', name: 'View Invoices', resource: 'invoices', action: 'read', description: 'View invoice information' },
  { id: 'finance.invoices.create', name: 'Create Invoices', resource: 'invoices', action: 'create', description: 'Create new invoices' },
  { id: 'finance.invoices.update', name: 'Edit Invoices', resource: 'invoices', action: 'update', description: 'Edit invoice information' },
  { id: 'finance.invoices.delete', name: 'Delete Invoices', resource: 'invoices', action: 'delete', description: 'Delete invoices' },
  { id: 'finance.invoices.approve', name: 'Approve Invoices', resource: 'invoices', action: 'approve', description: 'Approve invoices for payment' },
  { id: 'finance.payments.read', name: 'View Payments', resource: 'payments', action: 'read', description: 'View payment information' },
  { id: 'finance.payments.create', name: 'Record Payments', resource: 'payments', action: 'create', description: 'Record new payments' },
  { id: 'finance.expenses.read', name: 'View Expenses', resource: 'expenses', action: 'read', description: 'View expense information' },
  { id: 'finance.expenses.create', name: 'Create Expenses', resource: 'expenses', action: 'create', description: 'Create new expenses' },
  { id: 'finance.expenses.approve', name: 'Approve Expenses', resource: 'expenses', action: 'approve', description: 'Approve expense reimbursements' },

  // HR Permissions
  { id: 'hr.employees.read', name: 'View Employees', resource: 'employees', action: 'read', description: 'View employee information' },
  { id: 'hr.employees.create', name: 'Create Employees', resource: 'employees', action: 'create', description: 'Create new employees' },
  { id: 'hr.employees.update', name: 'Edit Employees', resource: 'employees', action: 'update', description: 'Edit employee information' },
  { id: 'hr.timesheets.read', name: 'View Timesheets', resource: 'timesheets', action: 'read', description: 'View timesheet information' },
  { id: 'hr.timesheets.create', name: 'Create Timesheets', resource: 'timesheets', action: 'create', description: 'Create new timesheets' },
  { id: 'hr.timesheets.approve', name: 'Approve Timesheets', resource: 'timesheets', action: 'approve', description: 'Approve timesheets' },

  // Marketing Permissions
  { id: 'marketing.campaigns.read', name: 'View Campaigns', resource: 'campaigns', action: 'read', description: 'View campaign information' },
  { id: 'marketing.campaigns.create', name: 'Create Campaigns', resource: 'campaigns', action: 'create', description: 'Create new campaigns' },
  { id: 'marketing.campaigns.update', name: 'Edit Campaigns', resource: 'campaigns', action: 'update', description: 'Edit campaign information' },
  { id: 'marketing.campaigns.delete', name: 'Delete Campaigns', resource: 'campaigns', action: 'delete', description: 'Delete campaigns' },

  // Documents Permissions
  { id: 'documents.contracts.read', name: 'View Contracts', resource: 'contracts', action: 'read', description: 'View contract information' },
  { id: 'documents.contracts.create', name: 'Create Contracts', resource: 'contracts', action: 'create', description: 'Create new contracts' },
  { id: 'documents.contracts.update', name: 'Edit Contracts', resource: 'contracts', action: 'update', description: 'Edit contract information' },
  { id: 'documents.contracts.delete', name: 'Delete Contracts', resource: 'contracts', action: 'delete', description: 'Delete contracts' },

  // Reports Permissions
  { id: 'reports.read', name: 'View Reports', resource: 'reports', action: 'read', description: 'View reports and dashboards' },
  { id: 'reports.create', name: 'Create Reports', resource: 'reports', action: 'create', description: 'Create new reports' },
  { id: 'reports.export', name: 'Export Reports', resource: 'reports', action: 'export', description: 'Export reports to various formats' },

  // Helpdesk Permissions
  { id: 'helpdesk.tickets.read', name: 'View Tickets', resource: 'tickets', action: 'read', description: 'View support tickets' },
  { id: 'helpdesk.tickets.create', name: 'Create Tickets', resource: 'tickets', action: 'create', description: 'Create new support tickets' },
  { id: 'helpdesk.tickets.update', name: 'Update Tickets', resource: 'tickets', action: 'update', description: 'Update ticket status and information' },
  { id: 'helpdesk.tickets.delete', name: 'Delete Tickets', resource: 'tickets', action: 'delete', description: 'Delete support tickets' },

  // Asset Permissions
  { id: 'assets.read', name: 'View Assets', resource: 'assets', action: 'read', description: 'View asset information' },
  { id: 'assets.create', name: 'Create Assets', resource: 'assets', action: 'create', description: 'Create new assets' },
  { id: 'assets.update', name: 'Edit Assets', resource: 'assets', action: 'update', description: 'Edit asset information' },
  { id: 'assets.delete', name: 'Delete Assets', resource: 'assets', action: 'delete', description: 'Delete assets' },

  // Workflow Permissions
  { id: 'workflows.read', name: 'View Workflows', resource: 'workflows', action: 'read', description: 'View workflow information' },
  { id: 'workflows.create', name: 'Create Workflows', resource: 'workflows', action: 'create', description: 'Create new workflows' },
  { id: 'workflows.update', name: 'Edit Workflows', resource: 'workflows', action: 'update', description: 'Edit workflow information' },
  { id: 'workflows.delete', name: 'Delete Workflows', resource: 'workflows', action: 'delete', description: 'Delete workflows' },

  // Collaboration Permissions
  { id: 'collaboration.read', name: 'View Collaboration', resource: 'collaboration', action: 'read', description: 'View collaboration features' },
  { id: 'collaboration.create', name: 'Create Collaboration', resource: 'collaboration', action: 'create', description: 'Create collaboration content' },
  { id: 'collaboration.update', name: 'Edit Collaboration', resource: 'collaboration', action: 'update', description: 'Edit collaboration content' },
  { id: 'collaboration.delete', name: 'Delete Collaboration', resource: 'collaboration', action: 'delete', description: 'Delete collaboration content' },

  // Quality & Compliance Permissions
  { id: 'quality.audit.read', name: 'View Audit Logs', resource: 'audit', action: 'read', description: 'View audit log information' },
  { id: 'quality.approvals.read', name: 'View Approvals', resource: 'approvals', action: 'read', description: 'View approval information' },
  { id: 'quality.approvals.create', name: 'Create Approvals', resource: 'approvals', action: 'create', description: 'Create new approvals' },
  { id: 'quality.approvals.update', name: 'Update Approvals', resource: 'approvals', action: 'update', description: 'Update approval status' },

  // Settings Permissions
  { id: 'settings.read', name: 'View Settings', resource: 'settings', action: 'read', description: 'View system settings' },
  { id: 'settings.update', name: 'Update Settings', resource: 'settings', action: 'update', description: 'Update system settings' },
  { id: 'settings.roles.read', name: 'View Roles', resource: 'roles', action: 'read', description: 'View user roles and permissions' },
  { id: 'settings.roles.create', name: 'Create Roles', resource: 'roles', action: 'create', description: 'Create new roles' },
  { id: 'settings.roles.update', name: 'Edit Roles', resource: 'roles', action: 'update', description: 'Edit role permissions' },
  { id: 'settings.roles.delete', name: 'Delete Roles', resource: 'roles', action: 'delete', description: 'Delete roles' },
];

// Mock Roles
export const mockRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: [
      // CRM Permissions
      'crm.leads.read', 'crm.leads.create', 'crm.leads.update', 'crm.leads.delete',
      'crm.contacts.read', 'crm.contacts.create', 'crm.contacts.update', 'crm.contacts.delete',
      'crm.opportunities.read', 'crm.opportunities.create', 'crm.opportunities.update', 'crm.opportunities.delete',
      'crm.proposals.read', 'crm.proposals.create', 'crm.proposals.update', 'crm.proposals.delete',
      
      // Project Permissions
      'projects.read', 'projects.create', 'projects.update', 'projects.delete',
      'tasks.read', 'tasks.create', 'tasks.update', 'tasks.delete',
      
      // Finance Permissions
      'finance.invoices.read', 'finance.invoices.create', 'finance.invoices.update', 'finance.invoices.delete', 'finance.invoices.approve',
      'finance.payments.read', 'finance.payments.create',
      'finance.expenses.read', 'finance.expenses.create', 'finance.expenses.approve',
      
      // HR Permissions
      'hr.employees.read', 'hr.employees.create', 'hr.employees.update',
      'hr.timesheets.read', 'hr.timesheets.create', 'hr.timesheets.approve',
      
      // Marketing Permissions
      'marketing.campaigns.read', 'marketing.campaigns.create', 'marketing.campaigns.update', 'marketing.campaigns.delete',
      
      // Documents Permissions
      'documents.contracts.read', 'documents.contracts.create', 'documents.contracts.update', 'documents.contracts.delete',
      
      // Reports Permissions
      'reports.read', 'reports.create', 'reports.export',
      
      // Helpdesk Permissions
      'helpdesk.tickets.read', 'helpdesk.tickets.create', 'helpdesk.tickets.update', 'helpdesk.tickets.delete',
      
      // Asset Permissions
      'assets.read', 'assets.create', 'assets.update', 'assets.delete',
      
      // Workflow Permissions
      'workflows.read', 'workflows.create', 'workflows.update', 'workflows.delete',
      
      // Collaboration Permissions
      'collaboration.read', 'collaboration.create', 'collaboration.update', 'collaboration.delete',
      
      // Quality & Compliance Permissions
      'quality.audit.read',
      'quality.approvals.read', 'quality.approvals.create', 'quality.approvals.update',
      
      // Settings Permissions
      'settings.read', 'settings.update',
      'settings.roles.read', 'settings.roles.create', 'settings.roles.update', 'settings.roles.delete',
    ],
    isSystem: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Department manager with oversight permissions',
    permissions: [
      'crm.leads.read', 'crm.leads.create', 'crm.leads.update',
      'crm.contacts.read', 'crm.contacts.create', 'crm.contacts.update',
      'crm.opportunities.read', 'crm.opportunities.create', 'crm.opportunities.update',
      'crm.proposals.read', 'crm.proposals.create', 'crm.proposals.update',
      'projects.read', 'projects.create', 'projects.update',
      'tasks.read', 'tasks.create', 'tasks.update',
      'finance.invoices.read', 'finance.invoices.create', 'finance.invoices.update',
      'finance.payments.read', 'finance.payments.create',
      'finance.expenses.read', 'finance.expenses.approve',
      'hr.employees.read', 'hr.timesheets.read', 'hr.timesheets.approve',
      'marketing.campaigns.read', 'marketing.campaigns.create', 'marketing.campaigns.update',
      'documents.contracts.read', 'documents.contracts.create', 'documents.contracts.update',
      'reports.read', 'reports.export',
      'helpdesk.tickets.read', 'helpdesk.tickets.create', 'helpdesk.tickets.update',
      'assets.read', 'assets.create', 'assets.update',
      'workflows.read', 'workflows.create', 'workflows.update',
      'collaboration.read', 'collaboration.create', 'collaboration.update',
      'quality.audit.read', 'quality.approvals.read', 'quality.approvals.create',
      'settings.read', 'settings.roles.read'
    ],
    isSystem: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'employee',
    name: 'Employee',
    description: 'Standard employee with limited permissions',
    permissions: [
      'crm.leads.read', 'crm.leads.create',
      'crm.contacts.read', 'crm.contacts.create',
      'crm.opportunities.read', 'crm.opportunities.create',
      'crm.proposals.read', 'crm.proposals.create',
      'projects.read',
      'tasks.read', 'tasks.create', 'tasks.update',
      'finance.invoices.read',
      'finance.expenses.read', 'finance.expenses.create',
      'hr.timesheets.read', 'hr.timesheets.create',
      'marketing.campaigns.read',
      'documents.contracts.read',
      'reports.read',
      'helpdesk.tickets.read', 'helpdesk.tickets.create',
      'assets.read',
      'workflows.read',
      'collaboration.read', 'collaboration.create',
      'quality.approvals.read'
    ],
    isSystem: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to most modules',
    permissions: [
      'crm.leads.read',
      'crm.contacts.read',
      'crm.opportunities.read',
      'crm.proposals.read',
      'projects.read',
      'tasks.read',
      'finance.invoices.read',
      'finance.payments.read',
      'finance.expenses.read',
      'hr.employees.read',
      'hr.timesheets.read',
      'marketing.campaigns.read',
      'documents.contracts.read',
      'reports.read',
      'helpdesk.tickets.read',
      'assets.read',
      'workflows.read',
      'collaboration.read',
      'quality.audit.read',
      'quality.approvals.read'
    ],
    isSystem: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@vberp.com',
    firstName: 'Admin',
    lastName: 'User',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150',
    roleId: 'admin',
    isActive: true,
    lastLogin: new Date('2024-01-15T10:30:00Z'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    email: 'manager@vberp.com',
    firstName: 'John',
    lastName: 'Manager',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    roleId: 'manager',
    isActive: true,
    lastLogin: new Date('2024-01-14T14:20:00Z'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '3',
    email: 'employee@vberp.com',
    firstName: 'Jane',
    lastName: 'Employee',
    avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=150',
    roleId: 'employee',
    isActive: true,
    lastLogin: new Date('2024-01-13T09:15:00Z'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-13')
  },
  {
    id: '4',
    email: 'viewer@vberp.com',
    firstName: 'Bob',
    lastName: 'Viewer',
    avatar: 'https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg?auto=compress&cs=tinysrgb&w=150',
    roleId: 'viewer',
    isActive: true,
    lastLogin: new Date('2024-01-12T16:45:00Z'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-12')
  }
];

/**
 * Mock Data for ERP System
 * Author: VB Entreprise
 * 
 * Sample data for demonstrating the ERP system functionality
 * In production, this would be replaced with API calls
 */

import { Lead, Project, TeamMember, Invoice, Campaign, DashboardMetric } from '../types';

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1-555-0123',
    company: 'TechCorp Solutions',
    source: 'website',
    stage: 'proposal',
    value: 15000,
    probability: 75,
    createdAt: new Date('2024-01-15'),
    lastContact: new Date('2024-01-20'),
    assignedTo: 'Sarah Johnson',
    notes: ['Initial consultation completed', 'Sent proposal for web development']
  },
  {
    id: '2',
    name: 'Emily Davis',
    email: 'emily@startup.io',
    phone: '+1-555-0124',
    company: 'Startup Innovation',
    source: 'referral',
    stage: 'negotiation',
    value: 25000,
    probability: 85,
    createdAt: new Date('2024-01-10'),
    lastContact: new Date('2024-01-22'),
    assignedTo: 'Mike Chen',
    notes: ['Needs mobile app development', 'Budget approved by board']
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    clientId: '1',
    status: 'active',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-31'),
    budget: 50000,
    spent: 22500,
    progress: 45,
    team: [],
    tasks: []
  },
  {
    id: '2',
    name: 'Mobile App Development',
    clientId: '2',
    status: 'planning',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-05-31'),
    budget: 75000,
    spent: 5000,
    progress: 10,
    team: [],
    tasks: []
  }
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'developer',
    email: 'sarah@vbenterprise.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    capacity: 40,
    utilization: 85
  },
  {
    id: '2',
    name: 'Mike Chen',
    role: 'designer',
    email: 'mike@vbenterprise.com',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    capacity: 40,
    utilization: 70
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    clientId: '1',
    projectId: '1',
    amount: 15000,
    tax: 2700,
    total: 17700,
    status: 'sent',
    dueDate: new Date('2024-02-15'),
    createdAt: new Date('2024-01-15'),
    items: [
      {
        id: '1',
        description: 'Web Development - Phase 1',
        quantity: 1,
        rate: 15000,
        amount: 15000
      }
    ]
  }
];

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Google Ads - Web Development',
    type: 'social',
    status: 'active',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-02-29'),
    budget: 5000,
    spent: 2250,
    impressions: 45000,
    clicks: 1200,
    conversions: 35,
    roi: 2.8
  }
];

export const mockDashboardMetrics: DashboardMetric[] = [
  {
    label: 'Monthly Recurring Revenue',
    value: '₹2,45,000',
    change: 12.5,
    trend: 'up',
    icon: 'TrendingUp'
  },
  {
    label: 'Active Projects',
    value: 8,
    change: 2,
    trend: 'up',
    icon: 'Briefcase'
  },
  {
    label: 'Pipeline Value',
    value: '₹8,50,000',
    change: -5.2,
    trend: 'down',
    icon: 'Target'
  },
  {
    label: 'Team Utilization',
    value: '78%',
    change: 3.1,
    trend: 'up',
    icon: 'Users'
  }
];