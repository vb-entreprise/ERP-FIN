/**
 * Settings Page
 * Author: VB Entreprise
 * 
 * System configuration, user management, integrations,
 * and security settings for the ERP system
 */

import React, { useState } from 'react';
import { Save, Plus, Edit, Trash2, Key, Shield, Bell, Globe, Users, Zap, Database, Mail, UserCog } from 'lucide-react';
import CreateUserModal from '../components/Modals/CreateUserModal';
import IntegrationModal from '../components/Modals/IntegrationModal';
import RoleManagement from './Settings/RoleManagement';
import PermissionGate from '../components/Auth/PermissionGate';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive';
  lastLogin: Date;
}

interface Integration {
  id: string;
  name: string;
  type: 'payment' | 'email' | 'storage' | 'analytics' | 'ai' | 'accounting';
  status: 'connected' | 'disconnected';
  description: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@vbenterprise.com',
    role: 'admin',
    status: 'active',
    lastLogin: new Date('2024-01-22T10:30:00')
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@vbenterprise.com',
    role: 'manager',
    status: 'active',
    lastLogin: new Date('2024-01-22T09:15:00')
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@vbenterprise.com',
    role: 'user',
    status: 'active',
    lastLogin: new Date('2024-01-21T16:45:00')
  }
];

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Stripe',
    type: 'payment',
    status: 'connected',
    description: 'Payment processing and subscription management'
  },
  {
    id: '2',
    name: 'Wise',
    type: 'payment',
    status: 'disconnected',
    description: 'International payments and multi-currency transfers'
  },
  {
    id: '3',
    name: 'SendGrid',
    type: 'email',
    status: 'connected',
    description: 'Email delivery and marketing automation'
  },
  {
    id: '4',
    name: 'Google Analytics',
    type: 'analytics',
    status: 'connected',
    description: 'Website and application analytics'
  },
  {
    id: '5',
    name: 'AWS S3',
    type: 'storage',
    status: 'connected',
    description: 'Cloud storage for documents and files'
  },
  {
    id: '6',
    name: 'ChatGPT',
    type: 'ai',
    status: 'disconnected',
    description: 'AI-powered content generation and customer support'
  },
  {
    id: '7',
    name: 'Zoho Books',
    type: 'accounting',
    status: 'disconnected',
    description: 'Accounting software integration for financial management'
  }
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [users] = useState<User[]>(mockUsers);
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const handleCreateUser = (userData: any) => {
    console.log('New user created:', userData);
    // In a real app, this would update the users state
  };

  const handleConnectIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsIntegrationModalOpen(true);
  };

  const handleIntegrationConnect = (integrationData: any) => {
    console.log('Integration connected:', integrationData);
    // Update integration status
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationData.integrationId
          ? { ...integration, status: 'connected' as const }
          : integration
      )
    );
  };

  const handleDisconnectIntegration = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId
          ? { ...integration, status: 'disconnected' as const }
          : integration
      )
    );
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'roles', name: 'Role Management', icon: UserCog },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'integrations', name: 'Integrations', icon: Zap },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'backup', name: 'Backup & Data', icon: Database },
  ];

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      user: 'bg-green-100 text-green-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      connected: 'bg-green-100 text-green-800',
      disconnected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getIntegrationIcon = (type: string) => {
    const icons = {
      payment: '💳',
      email: '📧',
      storage: '☁️',
      analytics: '📊',
      ai: '🤖',
      accounting: '📚'
    };
    return icons[type as keyof typeof icons] || '🔧';
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Configure system settings, manage users, and integrate with external services.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue="VB Entreprise"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue="27AABCU9603R1ZR"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      defaultValue="123 Business District, Tech City, Mumbai 400001"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue="contact@vbenterprise.com"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">System Preferences</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Asia/Kolkata (IST)</option>
                        <option>UTC</option>
                        <option>America/New_York</option>
                        <option>Europe/London</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>DD/MM/YYYY</option>
                        <option>MM/DD/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                    onClick={() => setIsCreateUserModalOpen(true)}
                    <Plus className="h-4 w-4" />
                    Add User
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.lastLogin.toLocaleDateString()} {user.lastLogin.toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900 p-1 rounded">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <PermissionGate resource="roles" action="read">
              <RoleManagement />
            </PermissionGate>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200">
                      Enable 2FA
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Session Timeout</h4>
                      <p className="text-sm text-gray-500">Automatically log out inactive users</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>8 hours</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Password Policy</h4>
                      <p className="text-sm text-gray-500">Enforce strong password requirements</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      Configure
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">API Keys</h4>
                      <p className="text-sm text-gray-500">Manage API access keys</p>
                    </div>
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-900 text-sm font-medium">
                      <Key className="h-4 w-4" />
                      Manage Keys
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Third-Party Integrations</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {integrations.map((integration) => (
                      <div key={integration.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{getIntegrationIcon(integration.type)}</span>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{integration.name}</h4>
                              <p className="text-xs text-gray-500 capitalize">{integration.type}</p>
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(integration.status)}`}>
                            {integration.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                        <button className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          integration.status === 'connected'
                            ? 'bg-red-50 text-red-700 hover:bg-red-100'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                        onClick={() => 
                          integration.status === 'connected' 
                            ? handleDisconnectIntegration(integration.id)
                            : handleConnectIntegration(integration)
                        }>
                          {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">New lead notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Project deadline reminders</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700">Invoice payment confirmations</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Weekly performance reports</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Task assignments</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700">System maintenance alerts</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Security notifications</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Backup & Data Management</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Automatic Backups</h4>
                      <p className="text-sm text-gray-500">Daily automated backups of all system data</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-green-600 mr-3">Enabled</span>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200">
                        Configure
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Last Backup</h4>
                      <p className="text-sm text-gray-500">January 22, 2024 at 3:00 AM</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      Download Backup
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Data Export</h4>
                      <p className="text-sm text-gray-500">Export your data in various formats</p>
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors duration-200">
                      Export Data
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Data Retention</h4>
                      <p className="text-sm text-gray-500">Configure how long to keep archived data</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>1 year</option>
                      <option>2 years</option>
                      <option>5 years</option>
                      <option>Indefinite</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <CreateUserModal
          isOpen={isCreateUserModalOpen}
          onClose={() => setIsCreateUserModalOpen(false)}
          onSubmit={handleCreateUser}
        />

        <IntegrationModal
          isOpen={isIntegrationModalOpen}
          onClose={() => {
            setIsIntegrationModalOpen(false);
            setSelectedIntegration(null);
          }}
          onConnect={handleIntegrationConnect}
          integration={selectedIntegration}
        />
      </div>
    </div>
  );
}