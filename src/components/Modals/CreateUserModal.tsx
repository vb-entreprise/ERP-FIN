/**
 * Create User Modal Component
 * Author: VB Entreprise
 * 
 * Modal form for creating new user accounts with role assignment,
 * permissions, and access control settings
 */

import React, { useState } from 'react';
import { X, User, Mail, Shield, Key } from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => void;
}

export default function CreateUserModal({ isOpen, onClose, onSubmit }: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    department: '',
    phone: '',
    sendInvite: true,
    permissions: {
      crm: false,
      projects: false,
      finance: false,
      marketing: false,
      documents: false,
      reports: false,
      settings: false
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = [
    { value: 'admin', label: 'Administrator', description: 'Full system access' },
    { value: 'manager', label: 'Manager', description: 'Department management access' },
    { value: 'user', label: 'User', description: 'Limited access to assigned modules' }
  ];

  const departments = [
    'Development',
    'Design',
    'Marketing',
    'Sales',
    'Finance',
    'HR',
    'Operations'
  ];

  const handlePermissionChange = (module: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: checked
      }
    }));
  };

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({ ...prev, role }));
    
    // Auto-set permissions based on role
    if (role === 'admin') {
      setFormData(prev => ({
        ...prev,
        permissions: {
          crm: true,
          projects: true,
          finance: true,
          marketing: true,
          documents: true,
          reports: true,
          settings: true
        }
      }));
    } else if (role === 'manager') {
      setFormData(prev => ({
        ...prev,
        permissions: {
          crm: true,
          projects: true,
          finance: false,
          marketing: true,
          documents: true,
          reports: true,
          settings: false
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: {
          crm: false,
          projects: false,
          finance: false,
          marketing: false,
          documents: false,
          reports: false,
          settings: false
        }
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the form
    onSubmit({
      ...formData,
      id: Date.now().toString(),
      status: 'active',
      lastLogin: null,
      createdAt: new Date()
    });

    // Reset form and close modal
    setFormData({
      name: '',
      email: '',
      role: 'user',
      department: '',
      phone: '',
      sendInvite: true,
      permissions: {
        crm: false,
        projects: false,
        finance: false,
        marketing: false,
        documents: false,
        reports: false,
        settings: false
      }
    });
    setErrors({});
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'role') {
      handleRoleChange(value);
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="inline h-4 w-4 mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Shield className="inline h-4 w-4 mr-1" />
                User Role
              </label>
              <div className="space-y-2">
                {roles.map(role => (
                  <label key={role.value} className="flex items-start">
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleChange}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-900">{role.label}</div>
                      <div className="text-xs text-gray-500">{role.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Key className="inline h-4 w-4 mr-1" />
                Module Permissions
              </label>
                {Object.entries(formData.permissions).map(([module, hasAccess]) => (
                  <label key={module} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={hasAccess}
                      onChange={(e) => handlePermissionChange(module, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={formData.role === 'admin'}
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {module === 'crm' ? 'CRM' : module}
                    </span>
                  </label>
                ))}
              </div>
              {formData.role === 'admin' && (
                <p className="text-xs text-gray-500 mt-1">
                  Administrators have access to all modules by default
                </p>
              )}

            {/* Invitation Settings */}
            <div className="border-t border-gray-200 pt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="sendInvite"
                  checked={formData.sendInvite}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Send invitation email to user
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                User will receive an email with login instructions and temporary password
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}