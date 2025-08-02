/**
 * Create Scoring Rule Modal Component
 * Author: VB Entreprise
 * 
 * Modal form for creating new lead scoring rules with
 * trigger conditions, point values, and categorization
 */

import React, { useState } from 'react';
import { X, Target, Star, Zap, Users, Mail, Calendar } from 'lucide-react';

interface CreateScoringRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ruleData: any) => void;
}

export default function CreateScoringRuleModal({ isOpen, onClose, onSubmit }: CreateScoringRuleModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    trigger: '',
    points: '',
    category: 'engagement',
    description: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'engagement', label: 'Engagement', icon: Users },
    { value: 'demographic', label: 'Demographic', icon: Target },
    { value: 'behavioral', label: 'Behavioral', icon: Zap },
    { value: 'firmographic', label: 'Firmographic', icon: Star }
  ];

  const triggers = [
    'email_opened',
    'email_clicked',
    'page_visit',
    'form_submit',
    'download',
    'video_watch',
    'social_share',
    'company_size_large',
    'job_title_decision_maker',
    'industry_tech',
    'custom_event'
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
      newErrors.name = 'Rule name is required';
    }

    if (!formData.trigger.trim()) {
      newErrors.trigger = 'Trigger condition is required';
    }

    if (!formData.points || isNaN(Number(formData.points))) {
      newErrors.points = 'Points must be a valid number';
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
      const ruleData = {
        id: `rule-${Date.now()}`,
        ...formData,
        points: Number(formData.points),
        createdAt: new Date()
      };
      
      onSubmit(ruleData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      trigger: '',
      points: '',
      category: 'engagement',
      description: '',
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
          <h2 className="text-xl font-semibold text-gray-900">Create Scoring Rule</h2>
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
              <Star className="h-5 w-5 mr-2" />
              Rule Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rule Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter rule name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trigger Condition *
                </label>
                <select
                  name="trigger"
                  value={formData.trigger}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.trigger ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select trigger condition</option>
                  {triggers.map(trigger => (
                    <option key={trigger} value={trigger}>{trigger.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                  ))}
                </select>
                {errors.trigger && <p className="mt-1 text-sm text-red-600">{errors.trigger}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points *
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.points ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter point value"
                  min="1"
                />
                {errors.points && <p className="mt-1 text-sm text-red-600">{errors.points}</p>}
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
                  placeholder="Describe what this rule does..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Active Rule</label>
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
              Create Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 