/**
 * Role Management Page
 * Author: VB Entreprise
 * 
 * Administrative interface for managing user roles and permissions
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockRoles, mockPermissions, mockUsers } from '../../data/mockData';
import { Shield, Users, Lock, CheckCircle, XCircle, Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import PermissionGate from '../../components/Auth/PermissionGate';

const RoleManagement: React.FC = () => {
  const { hasPermission } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoles = mockRoles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (roleId: string) => {
    switch (roleId) {
      case 'admin':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'manager':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'employee':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPermissionCount = (roleId: string) => {
    const role = mockRoles.find(r => r.id === roleId);
    return role?.permissions.length || 0;
  };

  const getUserCount = (roleId: string) => {
    return mockUsers.filter(user => user.roleId === roleId).length;
  };

  const getRolePermissions = (roleId: string) => {
    const role = mockRoles.find(r => r.id === roleId);
    if (!role) return [];
    
    return role.permissions.map(permissionId => {
      const permission = mockPermissions.find(p => p.id === permissionId);
      return permission || { id: permissionId, name: 'Unknown Permission', resource: 'unknown', action: 'unknown', description: 'Permission not found' };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>
        
        <PermissionGate resource="roles" action="create">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </button>
        </PermissionGate>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedRole === role.id ? 'border-blue-500 shadow-md' : 'border-gray-200'
            }`}
            onClick={() => setSelectedRole(role.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Shield className={`h-8 w-8 mr-3 ${role.isSystem ? 'text-blue-600' : 'text-gray-600'}`} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
              </div>
              
              <PermissionGate resource="roles" action="update">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRole(role.id);
                    setShowEditModal(true);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </PermissionGate>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Permissions:</span>
                <span className="font-medium">{getPermissionCount(role.id)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Users:</span>
                <span className="font-medium">{getUserCount(role.id)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role.id)}`}>
                  {role.isSystem ? 'System' : 'Custom'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex space-x-2">
              <PermissionGate resource="roles" action="read">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRole(role.id);
                  }}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
              </PermissionGate>
              
              {!role.isSystem && (
                <PermissionGate resource="roles" action="delete">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete
                    }}
                    className="inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </PermissionGate>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Role Details */}
      {selectedRole && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {mockRoles.find(r => r.id === selectedRole)?.name} - Permissions
            </h2>
            <button
              onClick={() => setSelectedRole(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getRolePermissions(selectedRole).map((permission) => (
              <div
                key={permission.id}
                className="flex items-center p-3 border border-gray-200 rounded-lg"
              >
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">{permission.name}</div>
                  <div className="text-sm text-gray-600">{permission.description}</div>
                  <div className="text-xs text-gray-500">
                    {permission.resource}.{permission.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Role</h3>
              <p className="text-sm text-gray-600 mb-4">
                This feature is not implemented in the demo. In a real application, this would allow you to create custom roles with specific permissions.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditModal && selectedRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Role</h3>
              <p className="text-sm text-gray-600 mb-4">
                This feature is not implemented in the demo. In a real application, this would allow you to modify role permissions.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement; 