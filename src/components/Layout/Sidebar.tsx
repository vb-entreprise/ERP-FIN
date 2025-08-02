/**
 * Sidebar Navigation Component
 * Author: VB Entreprise
 * 
 * Comprehensive ERP system navigation sidebar with expandable sections
 * and hierarchical module organization with role-based access control
 */

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, DollarSign, TrendingUp, FileText, BarChart3, Settings, Building2, ChevronDown, ChevronRight, Target, UserCheck, Zap, FileSignature, Clock, Calendar, PieChart, MessageSquare, UserPlus, Package, Contact as FileContract, Workflow, Database, Users2, Shield, HeadphonesIcon, Ticket, BookOpen, Globe, UserCog, ClipboardList, UserX, Archive, ShoppingCart, CreditCard, Repeat, Milestone, Bot, TrendingDown, LineChart, MessageCircle, Bell, Video, CheckSquare, FileCheck, Lock, Flag, Key, Server } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ComponentType<any>;
  children?: NavigationItem[];
  requiredPermission?: {
    resource: string;
    action: string;
  };
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  {
    name: 'CRM',
    icon: Users,
    children: [
      { name: 'Leads', href: '/crm/leads', icon: Target, requiredPermission: { resource: 'leads', action: 'read' } },
      { name: 'Contacts', href: '/crm/contacts', icon: UserCheck, requiredPermission: { resource: 'contacts', action: 'read' } },
      { name: 'Opportunities', href: '/crm/opportunities', icon: Zap, requiredPermission: { resource: 'opportunities', action: 'read' } },
      { name: 'Proposals/Quotes', href: '/crm/proposals', icon: FileSignature, requiredPermission: { resource: 'proposals', action: 'read' } }
    ]
  },
  {
    name: 'Projects',
    icon: Briefcase,
    children: [
      { name: 'All Projects', href: '/projects', icon: Briefcase, requiredPermission: { resource: 'projects', action: 'read' } },
      { name: 'Task Boards', href: '/projects/boards', icon: ClipboardList, requiredPermission: { resource: 'tasks', action: 'read' } },
      { name: 'Gantt Charts', href: '/projects/gantt', icon: Calendar, requiredPermission: { resource: 'projects', action: 'read' } },
      { name: 'Resource Allocation', href: '/projects/resources', icon: Users2, requiredPermission: { resource: 'projects', action: 'read' } }
    ]
  },
  {
    name: 'Finance',
    icon: DollarSign,
    children: [
      { name: 'Invoices', href: '/finance/invoices', icon: FileText, requiredPermission: { resource: 'invoices', action: 'read' } },
      { name: 'Payments', href: '/finance/payments', icon: CreditCard, requiredPermission: { resource: 'payments', action: 'read' } },
      { name: 'Expense Reimbursements', href: '/finance/expenses', icon: TrendingDown, requiredPermission: { resource: 'expenses', action: 'read' } },
      { name: 'Tax & Currency Settings', href: '/finance/settings', icon: Settings, requiredPermission: { resource: 'settings', action: 'read' } }
    ]
  },
  {
    name: 'Marketing',
    icon: TrendingUp,
    children: [
      { name: 'Campaigns', href: '/marketing/campaigns', icon: Target, requiredPermission: { resource: 'campaigns', action: 'read' } },
      { name: 'Lead Scoring', href: '/marketing/scoring', icon: BarChart3, requiredPermission: { resource: 'leads', action: 'read' } },
      { name: 'Landing Pages', href: '/marketing/pages', icon: Globe, requiredPermission: { resource: 'campaigns', action: 'read' } },
      { name: 'Analytics', href: '/marketing/analytics', icon: LineChart, requiredPermission: { resource: 'campaigns', action: 'read' } }
    ]
  },
  {
    name: 'Documents',
    icon: FileText,
    children: [
      { name: 'Contracts & Templates', href: '/documents/contracts', icon: FileContract, requiredPermission: { resource: 'contracts', action: 'read' } },
      { name: 'E-Signatures', href: '/documents/signatures', icon: FileSignature, requiredPermission: { resource: 'contracts', action: 'read' } },
      { name: 'Version History', href: '/documents/versions', icon: Clock, requiredPermission: { resource: 'contracts', action: 'read' } }
    ]
  },
  {
    name: 'Reports',
    icon: BarChart3,
    children: [
      { name: 'Pre-Built Dashboards', href: '/reports/dashboards', icon: PieChart, requiredPermission: { resource: 'reports', action: 'read' } },
      { name: 'Report Builder', href: '/reports/builder', icon: Database, requiredPermission: { resource: 'reports', action: 'create' } },
      { name: 'Scheduled Exports', href: '/reports/exports', icon: Calendar, requiredPermission: { resource: 'reports', action: 'export' } }
    ]
  },
  {
    name: 'Helpdesk & Support',
    icon: HeadphonesIcon,
    children: [
      { name: 'Ticketing Queue', href: '/helpdesk/tickets', icon: Ticket, requiredPermission: { resource: 'tickets', action: 'read' } },
      { name: 'SLAs & Escalations', href: '/helpdesk/sla', icon: Bell, requiredPermission: { resource: 'tickets', action: 'read' } },
      { name: 'Knowledge Base', href: '/helpdesk/kb', icon: BookOpen, requiredPermission: { resource: 'tickets', action: 'read' } },
      { name: 'Client Portal', href: '/helpdesk/portal', icon: Globe, requiredPermission: { resource: 'tickets', action: 'read' } }
    ]
  },
  {
    name: 'Resource & HR',
    icon: UserCog,
    children: [
      { name: 'Employee Directory', href: '/hr/directory', icon: Users, requiredPermission: { resource: 'employees', action: 'read' } },
      { name: 'Timesheets', href: '/hr/timesheets', icon: Clock, requiredPermission: { resource: 'timesheets', action: 'read' } },
      { name: 'Leave Management', href: '/hr/leave', icon: Calendar, requiredPermission: { resource: 'employees', action: 'read' } },
      { name: 'Onboarding', href: '/hr/onboarding', icon: UserPlus, requiredPermission: { resource: 'employees', action: 'read' } }
    ]
  },
  {
    name: 'Asset & Inventory',
    icon: Package,
    children: [
      { name: 'Asset Register', href: '/assets/register', icon: Archive, requiredPermission: { resource: 'assets', action: 'read' } },
      { name: 'VPS Servers', href: '/assets/vps-servers', icon: Server, requiredPermission: { resource: 'assets', action: 'read' } },
      { name: 'License Tracking', href: '/assets/licenses', icon: Key, requiredPermission: { resource: 'assets', action: 'read' } },
      { name: 'Purchase Orders', href: '/assets/orders', icon: ShoppingCart, requiredPermission: { resource: 'assets', action: 'read' } },
      { name: 'Stock Levels', href: '/assets/stock', icon: Package, requiredPermission: { resource: 'assets', action: 'read' } }
    ]
  },
  {
    name: 'Billing & Contracts',
    icon: FileContract,
    children: [
      { name: 'Contract Library', href: '/billing/contracts', icon: FileContract, requiredPermission: { resource: 'contracts', action: 'read' } },
      { name: 'Retainers', href: '/billing/retainers', icon: CreditCard, requiredPermission: { resource: 'contracts', action: 'read' } },
      { name: 'Recurring Billing', href: '/billing/recurring', icon: Repeat, requiredPermission: { resource: 'contracts', action: 'read' } },
      { name: 'Milestone Payments', href: '/billing/milestones', icon: Milestone, requiredPermission: { resource: 'contracts', action: 'read' } }
    ]
  },
  {
    name: 'Workflow & Automation',
    icon: Workflow,
    children: [
      { name: 'Workflow Builder', href: '/workflow/builder', icon: Bot, requiredPermission: { resource: 'workflows', action: 'read' } },
      { name: 'Event Triggers', href: '/workflow/triggers', icon: Zap, requiredPermission: { resource: 'workflows', action: 'read' } },
      { name: 'Scheduled Tasks', href: '/workflow/tasks', icon: Calendar, requiredPermission: { resource: 'workflows', action: 'read' } },
      { name: 'Approval Chains', href: '/workflow/approvals', icon: CheckSquare, requiredPermission: { resource: 'workflows', action: 'read' } }
    ]
  },
  {
    name: 'Advanced BI',
    icon: Database,
    children: [
      { name: 'Dashboard Designer', href: '/bi/designer', icon: PieChart, requiredPermission: { resource: 'reports', action: 'create' } },
      { name: 'Data Warehouse', href: '/bi/warehouse', icon: Database, requiredPermission: { resource: 'reports', action: 'read' } },
      { name: 'Predictive Forecasts', href: '/bi/forecasts', icon: TrendingUp, requiredPermission: { resource: 'reports', action: 'read' } }
    ]
  },
  {
    name: 'Collaboration',
    icon: MessageSquare,
    children: [
      { name: 'Chat & Comments', href: '/collaboration/chat', icon: MessageCircle, requiredPermission: { resource: 'collaboration', action: 'read' } },
      { name: 'Activity Feed', href: '/collaboration/feed', icon: Bell, requiredPermission: { resource: 'collaboration', action: 'read' } },
      { name: 'Meeting Scheduler', href: '/collaboration/meetings', icon: Video, requiredPermission: { resource: 'collaboration', action: 'read' } }
    ]
  },
  {
    name: 'Quality & Compliance',
    icon: Shield,
    children: [
      { name: 'Audit Logs', href: '/quality/audit', icon: ClipboardList, requiredPermission: { resource: 'audit', action: 'read' } },
      { name: 'Document Approvals', href: '/quality/approvals', icon: FileCheck, requiredPermission: { resource: 'approvals', action: 'read' } },
      { name: 'GDPR Settings', href: '/quality/gdpr', icon: Lock, requiredPermission: { resource: 'settings', action: 'read' } }
    ]
  },
  {
    name: 'Settings',
    icon: Settings,
    children: [
      { name: 'Global Settings', href: '/settings', icon: Settings, requiredPermission: { resource: 'settings', action: 'read' } },
      { name: 'Feature Flags', href: '/settings/features', icon: Flag, requiredPermission: { resource: 'settings', action: 'read' } },
      { name: 'Integrations', href: '/settings/integrations', icon: Zap, requiredPermission: { resource: 'settings', action: 'read' } },
      { name: 'User Roles', href: '/settings/roles', icon: UserCog, requiredPermission: { resource: 'roles', action: 'read' } }
    ]
  }
];

export default function Sidebar() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['CRM', 'Projects', 'Finance']);
  const { user, hasPermission, getUserRoleName } = useAuth();

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName)
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  // Filter navigation items based on permissions
  const filterNavigationItems = (items: NavigationItem[]): NavigationItem[] => {
    return items.filter(item => {
      // Check if item has required permission
      if (item.requiredPermission) {
        const hasAccess = hasPermission(item.requiredPermission.resource, item.requiredPermission.action);
        console.log(`Checking permission for ${item.name}: ${item.requiredPermission.resource}.${item.requiredPermission.action} = ${hasAccess}`);
        return hasAccess;
      }
      
      // If item has children, check if any children are accessible
      if (item.children) {
        const filteredChildren = filterNavigationItems(item.children);
        return filteredChildren.length > 0;
      }
      
      // If no permission requirement, show the item
      return true;
    }).map(item => ({
      ...item,
      children: item.children ? filterNavigationItems(item.children) : undefined
    }));
  };

  const filteredNavigation = filterNavigationItems(navigation);

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.includes(item.name);

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleSection(item.name)}
            className={`w-full group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              level === 0 
                ? 'text-gray-700 hover:bg-gray-50 hover:text-gray-900' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 ml-4'
            }`}
          >
            <div className="flex items-center">
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {isExpanded && item.children && (
            <div className="mt-1 space-y-1">
              {item.children.map(child => renderNavigationItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.name}
        to={item.href!}
        className={({ isActive }) =>
          `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            level === 0 
              ? (isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')
              : (isActive
                  ? 'bg-blue-50 text-blue-700 ml-4'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 ml-4')
          }`
        }
      >
        <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
        {item.name}
      </NavLink>
    );
  };

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
        {/* Logo and Company */}
        <div className="flex h-16 flex-shrink-0 items-center px-6 border-b border-gray-200">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div className="ml-3">
            <h1 className="text-xl font-bold text-gray-900">ERP System</h1>
            <p className="text-xs text-gray-500">by VB Entreprise</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {filteredNavigation.map(item => renderNavigationItem(item))}
        </nav>

        {/* User Profile */}
        {user && (
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <img
                className="h-10 w-10 rounded-full"
                src={user.avatar || 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150'}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{getUserRoleName()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}