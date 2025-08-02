import React, { useState } from 'react';
import { X, Layout, Eye, EyeOff, Users, Lock } from 'lucide-react';

interface CreateDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dashboardData: any) => void;
}

export default function CreateDashboardModal({ isOpen, onClose, onSubmit }: CreateDashboardModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
    template: 'blank'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const dashboardTemplates = [
    { 
      value: 'blank', 
      label: 'Blank Dashboard', 
      icon: <Layout className="h-4 w-4" />,
      description: 'Start with an empty canvas'
    },
    { 
      value: 'executive', 
      label: 'Executive Overview', 
      icon: <Eye className="h-4 w-4" />,
      description: 'High-level KPIs and metrics'
    },
    { 
      value: 'sales', 
      label: 'Sales Performance', 
      icon: <Users className="h-4 w-4" />,
      description: 'Sales metrics and pipeline analysis'
    },
    { 
      value: 'analytics', 
      label: 'Analytics Dashboard', 
      icon: <Layout className="h-4 w-4" />,
      description: 'Data visualization and charts'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      newErrors.name = 'Dashboard name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Dashboard name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const dashboardData = {
        id: `dashboard-${Date.now()}`,
        ...formData,
        widgets: [],
        createdBy: 'Current User',
        lastModified: new Date(),
        createdAt: new Date()
      };
      
      onSubmit(dashboardData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      isPublic: false,
      template: 'blank'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]" onClick={handleClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create New Dashboard</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dashboard Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dashboard Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Executive Overview, Sales Dashboard"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the purpose and content of this dashboard"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Template
              </label>
              <div className="space-y-3">
                {dashboardTemplates.map((template) => (
                  <label
                    key={template.value}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.template === template.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="template"
                      value={template.value}
                      checked={formData.template === template.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <div className="flex items-center mt-0.5">
                        {template.icon}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{template.label}</div>
                        <div className="text-xs text-gray-500">{template.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Visibility Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Visibility
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPublic"
                    value="true"
                    checked={formData.isPublic === true}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3 flex items-center">
                    <Eye className="h-4 w-4 text-green-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Public</div>
                      <div className="text-xs text-gray-500">Visible to all users</div>
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPublic"
                    value="false"
                    checked={formData.isPublic === false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3 flex items-center">
                    <Lock className="h-4 w-4 text-gray-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Private</div>
                      <div className="text-xs text-gray-500">Only visible to you</div>
                    </div>
                  </div>
                </label>
              </div>
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
                Create Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 