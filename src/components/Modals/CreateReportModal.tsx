/**
 * Create Report Modal Component
 * Author: VB Entreprise
 * 
 * Modal form for creating custom reports with data source selection,
 * metrics configuration, and scheduling options
 */

import React, { useState } from 'react';
import { X, BarChart3, Calendar, Filter, Mail } from 'lucide-react';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportData: any) => void;
}

export default function CreateReportModal({ isOpen, onClose, onSubmit }: CreateReportModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Financial',
    dataSource: '',
    metrics: [],
    dateRange: 'last-30-days',
    frequency: 'manual',
    format: 'pdf',
    recipients: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const reportTypes = [
    'Financial',
    'Sales',
    'Operations',
    'Marketing',
    'HR',
    'Custom'
  ];

  const dataSources = [
    { value: 'crm', label: 'CRM Data' },
    { value: 'projects', label: 'Project Data' },
    { value: 'finance', label: 'Financial Data' },
    { value: 'marketing', label: 'Marketing Data' },
    { value: 'hr', label: 'HR Data' },
    { value: 'all', label: 'All Data Sources' }
  ];

  const availableMetrics = [
    'Revenue',
    'Profit Margin',
    'Lead Conversion Rate',
    'Project Completion Rate',
    'Team Utilization',
    'Client Satisfaction',
    'Marketing ROI',
    'Cash Flow',
    'Outstanding Invoices',
    'New Clients Acquired'
  ];

  const handleMetricChange = (metric: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      metrics: checked 
        ? [...prev.metrics, metric]
        : prev.metrics.filter(m => m !== metric)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Report name is required';
    if (!formData.dataSource) newErrors.dataSource = 'Data source is required';
    if (formData.metrics.length === 0) newErrors.metrics = 'At least one metric is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the form
    onSubmit({
      ...formData,
      recipients: formData.recipients.split(',').map(email => email.trim()).filter(email => email),
      id: Date.now().toString(),
      lastRun: formData.frequency === 'manual' ? null : new Date(),
      createdAt: new Date()
    });

    // Reset form and close modal
    setFormData({
      name: '',
      type: 'Financial',
      dataSource: '',
      metrics: [],
      dateRange: 'last-30-days',
      frequency: 'manual',
      format: 'pdf',
      recipients: '',
      description: ''
    });
    setErrors({});
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Create Custom Report</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Basic Information</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <BarChart3 className="inline h-4 w-4 mr-1" />
                  Report Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter report name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {reportTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Source *</label>
                  <select
                    name="dataSource"
                    value={formData.dataSource}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.dataSource ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select data source</option>
                    {dataSources.map(source => (
                      <option key={source.value} value={source.value}>{source.label}</option>
                    ))}
                  </select>
                  {errors.dataSource && <p className="text-red-500 text-xs mt-1">{errors.dataSource}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe what this report will show..."
                />
              </div>
            </div>

            {/* Metrics Selection */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Metrics to Include *</h4>
              {errors.metrics && <p className="text-red-500 text-xs">{errors.metrics}</p>}
              
              <div className="grid grid-cols-2 gap-3">
                {availableMetrics.map(metric => (
                  <label key={metric} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.metrics.includes(metric)}
                      onChange={(e) => handleMetricChange(metric, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{metric}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filters and Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Filters & Settings</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Filter className="inline h-4 w-4 mr-1" />
                    Date Range
                  </label>
                  <select
                    name="dateRange"
                    value={formData.dateRange}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="last-7-days">Last 7 Days</option>
                    <option value="last-30-days">Last 30 Days</option>
                    <option value="last-90-days">Last 90 Days</option>
                    <option value="this-month">This Month</option>
                    <option value="last-month">Last Month</option>
                    <option value="this-quarter">This Quarter</option>
                    <option value="this-year">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                    <option value="dashboard">Interactive Dashboard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Scheduling */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Scheduling & Distribution</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Frequency
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="manual">Manual (Run on demand)</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              {formData.frequency !== 'manual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email Recipients
                  </label>
                  <input
                    type="text"
                    name="recipients"
                    value={formData.recipients}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email addresses separated by commas"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Reports will be automatically sent to these email addresses
                  </p>
                </div>
              )}
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
                Create Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}