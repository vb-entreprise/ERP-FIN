/**
 * Create SLA Modal Component
 * Author: VB Entreprise
 * 
 * Modal form for creating new SLA policies with
 * response times, resolution targets, and escalation rules
 */

import React, { useState } from 'react';
import { X, Clock, AlertTriangle, Target, Users, FileText } from 'lucide-react';

interface CreateSLAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (slaData: any) => void;
}

export default function CreateSLAModal({ isOpen, onClose, onSubmit }: CreateSLAModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    priority: 'medium',
    responseTime: '',
    resolutionTime: '',
    businessHours: '24/7',
    escalationLevels: 2,
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Technical Support',
    'Billing & Payments',
    'Feature Request',
    'Bug Report',
    'Account Management',
    'General Inquiry',
    'Training & Onboarding',
    'Integration Support'
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ];

  const businessHoursOptions = [
    { value: '24/7', label: '24/7 Support' },
    { value: 'business', label: 'Business Hours (9 AM - 6 PM)' },
    { value: 'extended', label: 'Extended Hours (8 AM - 8 PM)' },
    { value: 'custom', label: 'Custom Hours' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      newErrors.name = 'SLA name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.responseTime || isNaN(Number(formData.responseTime))) {
      newErrors.responseTime = 'Response time must be a valid number';
    }

    if (!formData.resolutionTime || isNaN(Number(formData.resolutionTime))) {
      newErrors.resolutionTime = 'Resolution time must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const slaData = {
        id: `sla-${Date.now()}`,
        ...formData,
        responseTime: Number(formData.responseTime),
        resolutionTime: Number(formData.resolutionTime),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'Current User'
      };
      
      onSubmit(slaData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      priority: 'medium',
      responseTime: '',
      resolutionTime: '',
      businessHours: '24/7',
      escalationLevels: 2,
      isActive: true
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create SLA Policy</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              SLA Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SLA Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter SLA name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe the SLA policy..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Time Targets */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Time Targets
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Response Time (hours) *
                </label>
                <input
                  type="number"
                  name="responseTime"
                  value={formData.responseTime}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.responseTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter response time in hours"
                  min="1"
                />
                {errors.responseTime && <p className="mt-1 text-sm text-red-600">{errors.responseTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resolution Time (hours) *
                </label>
                <input
                  type="number"
                  name="resolutionTime"
                  value={formData.resolutionTime}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.resolutionTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter resolution time in hours"
                  min="1"
                />
                {errors.resolutionTime && <p className="mt-1 text-sm text-red-600">{errors.resolutionTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Hours
                </label>
                <select
                  name="businessHours"
                  value={formData.businessHours}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {businessHoursOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Escalation Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Escalation Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Escalation Levels
                </label>
                <select
                  name="escalationLevels"
                  value={formData.escalationLevels}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>1 Level</option>
                  <option value={2}>2 Levels</option>
                  <option value={3}>3 Levels</option>
                  <option value={4}>4 Levels</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Active SLA</label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Create SLA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 