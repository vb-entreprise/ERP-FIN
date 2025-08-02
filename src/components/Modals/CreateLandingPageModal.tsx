/**
 * Create Landing Page Modal Component
 * Author: VB Entreprise
 * 
 * Modal form for creating new landing pages with
 * templates, settings, and A/B testing options
 */

import React, { useState } from 'react';
import { X, Layout, Palette, Code, Settings, Play, Eye, Target } from 'lucide-react';

interface CreateLandingPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pageData: any) => void;
}

export default function CreateLandingPageModal({ isOpen, onClose, onSubmit }: CreateLandingPageModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    template: '',
    status: 'draft',
    description: '',
    isABTest: false,
    abTestTraffic: 50
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const templates = [
    'Service Landing',
    'Lead Magnet',
    'Product Showcase',
    'Event Registration',
    'Consultation Booking',
    'Portfolio Gallery',
    'Testimonial Page',
    'Custom Template'
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
      newErrors.name = 'Page name is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    }

    if (!formData.template.trim()) {
      newErrors.template = 'Template is required';
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
      const pageData = {
        id: `page-${Date.now()}`,
        ...formData,
        createdAt: new Date(),
        lastModified: new Date(),
        views: 0,
        conversions: 0,
        conversionRate: 0,
        variants: formData.isABTest ? [
          { id: 'a', name: 'Variant A', traffic: formData.abTestTraffic, conversions: 0, conversionRate: 0 },
          { id: 'b', name: 'Variant B', traffic: 100 - formData.abTestTraffic, conversions: 0, conversionRate: 0 }
        ] : undefined
      };
      
      onSubmit(pageData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      url: '',
      template: '',
      status: 'draft',
      description: '',
      isABTest: false,
      abTestTraffic: 50
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
          <h2 className="text-xl font-semibold text-gray-900">Create Landing Page</h2>
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
              <Layout className="h-5 w-5 mr-2" />
              Page Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter page name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.url ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="/landing/page-name"
                />
                {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template *
                </label>
                <select
                  name="template"
                  value={formData.template}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.template ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a template</option>
                  {templates.map(template => (
                    <option key={template} value={template}>{template}</option>
                  ))}
                </select>
                {errors.template && <p className="mt-1 text-sm text-red-600">{errors.template}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
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
                  placeholder="Describe the page purpose and goals..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* A/B Testing */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              A/B Testing
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isABTest"
                  checked={formData.isABTest}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Enable A/B Testing</label>
              </div>

              {formData.isABTest && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variant A Traffic Split (%)
                  </label>
                  <input
                    type="number"
                    name="abTestTraffic"
                    value={formData.abTestTraffic}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="10"
                    max="90"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Variant B will receive {100 - formData.abTestTraffic}% of traffic
                  </p>
                </div>
              )}
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
              Create Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 