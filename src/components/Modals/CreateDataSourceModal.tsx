import React, { useState } from 'react';
import { X, Database, Globe, FileText, Cloud, Settings } from 'lucide-react';

interface CreateDataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dataSourceData: any) => void;
}

export default function CreateDataSourceModal({ isOpen, onClose, onSubmit }: CreateDataSourceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'database',
    connectionString: '',
    username: '',
    password: '',
    syncFrequency: 'hourly',
    description: '',
    schema: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const dataSourceTypes = [
    { 
      value: 'database', 
      label: 'Database', 
      icon: <Database className="h-4 w-4" />,
      description: 'SQL databases, NoSQL databases'
    },
    { 
      value: 'api', 
      label: 'API', 
      icon: <Globe className="h-4 w-4" />,
      description: 'REST APIs, GraphQL endpoints'
    },
    { 
      value: 'file', 
      label: 'File', 
      icon: <FileText className="h-4 w-4" />,
      description: 'CSV, JSON, Excel files'
    },
    { 
      value: 'cloud', 
      label: 'Cloud Storage', 
      icon: <Cloud className="h-4 w-4" />,
      description: 'AWS S3, Google Cloud Storage'
    }
  ];

  const syncFrequencies = [
    { value: 'realtime', label: 'Real-time' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Data source name is required';
    }

    if (!formData.connectionString.trim()) {
      newErrors.connectionString = 'Connection string is required';
    }

    if (formData.type === 'database' && !formData.username.trim()) {
      newErrors.username = 'Username is required for database connections';
    }

    if (formData.type === 'database' && !formData.password.trim()) {
      newErrors.password = 'Password is required for database connections';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const dataSourceData = {
        id: `datasource-${Date.now()}`,
        ...formData,
        status: 'disconnected',
        lastSync: new Date(),
        recordCount: 0,
        createdAt: new Date()
      };
      
      onSubmit(dataSourceData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: 'database',
      connectionString: '',
      username: '',
      password: '',
      syncFrequency: 'hourly',
      description: '',
      schema: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]" onClick={handleClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add Data Source</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Data Source Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Source Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., CRM Database, Analytics API"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Data Source Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Data Source Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {dataSourceTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <div className="flex items-center mt-0.5">
                        {type.icon}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Connection String */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Connection String *
              </label>
              <input
                type="text"
                name="connectionString"
                value={formData.connectionString}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.connectionString ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., jdbc:mysql://localhost:3306/database"
              />
              {errors.connectionString && <p className="mt-1 text-sm text-red-600">{errors.connectionString}</p>}
            </div>

            {/* Database Credentials (only for database type) */}
            {formData.type === 'database' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.username ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Database username"
                  />
                  {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Database password"
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
              </div>
            )}

            {/* Sync Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sync Frequency
              </label>
              <select
                name="syncFrequency"
                value={formData.syncFrequency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {syncFrequencies.map((frequency) => (
                  <option key={frequency.value} value={frequency.value}>
                    {frequency.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Schema (for database type) */}
            {formData.type === 'database' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schema (Optional)
                </label>
                <textarea
                  name="schema"
                  value={formData.schema}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Specify tables or collections to sync"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the data source and its purpose"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Add Data Source
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 