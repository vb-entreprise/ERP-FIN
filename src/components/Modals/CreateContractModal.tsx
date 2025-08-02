/**
 * Create Contract Modal Component
 * Author: VB Entreprise
 * 
 * Modal form for creating new contracts with
 * client information, terms, and template selection
 */

import React, { useState } from 'react';
import { X, FileText, DollarSign, Calendar, User, Settings, CheckCircle, AlertTriangle } from 'lucide-react';

interface CreateContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contractData: any) => void;
}

export default function CreateContractModal({ isOpen, onClose, onSubmit }: CreateContractModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    type: 'service',
    status: 'active',
    startDate: '',
    endDate: '',
    value: '',
    renewalDate: '',
    autoRenewal: false,
    paymentTerms: 'monthly',
    nextPayment: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const contractTypes = [
    { 
      value: 'service', 
      label: 'Service Contract', 
      icon: <FileText className="h-4 w-4" />,
      description: 'For ongoing services and support'
    },
    { 
      value: 'maintenance', 
      label: 'Maintenance Contract', 
      icon: <Settings className="h-4 w-4" />,
      description: 'For system maintenance and updates'
    },
    { 
      value: 'license', 
      label: 'License Agreement', 
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'For software licenses and usage rights'
    },
    { 
      value: 'consulting', 
      label: 'Consulting Contract', 
      icon: <User className="h-4 w-4" />,
      description: 'For professional consulting services'
    },
    { 
      value: 'retainer', 
      label: 'Retainer Agreement', 
      icon: <DollarSign className="h-4 w-4" />,
      description: 'For ongoing retainer services'
    }
  ];

  const paymentTermsOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' },
    { value: 'one-time', label: 'One-time' },
    { value: 'custom', label: 'Custom' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
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

    if (!formData.title.trim()) {
      newErrors.title = 'Contract title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Contract title must be at least 3 characters';
    }

    if (!formData.client.trim()) {
      newErrors.client = 'Client name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.value || parseFloat(formData.value) <= 0) {
      newErrors.value = 'Contract value must be greater than 0';
    }

    // Validate dates
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    // Validate renewal date
    if (formData.renewalDate && formData.endDate) {
      const renewalDate = new Date(formData.renewalDate);
      const endDate = new Date(formData.endDate);
      if (renewalDate <= endDate) {
        newErrors.renewalDate = 'Renewal date must be after end date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const contractData = {
        id: `contract-${Date.now()}`,
        ...formData,
        value: parseFloat(formData.value),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        renewalDate: formData.renewalDate ? new Date(formData.renewalDate) : undefined,
        nextPayment: formData.nextPayment ? new Date(formData.nextPayment) : undefined,
        createdAt: new Date()
      };
      
      onSubmit(contractData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      client: '',
      type: 'service',
      status: 'active',
      startDate: '',
      endDate: '',
      value: '',
      renewalDate: '',
      autoRenewal: false,
      paymentTerms: 'monthly',
      nextPayment: ''
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
            <h2 className="text-xl font-semibold text-gray-900">Create New Contract</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contract Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Website Development & Maintenance"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.client ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., TechCorp Solutions"
              />
              {errors.client && <p className="mt-1 text-sm text-red-600">{errors.client}</p>}
            </div>

            {/* Contract Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Contract Type
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {contractTypes.map((type) => (
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

            {/* Contract Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Value (₹) *
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.value ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="500000"
              />
              {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Terms
              </label>
              <select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {paymentTermsOptions.map(term => (
                  <option key={term.value} value={term.value}>{term.label}</option>
                ))}
              </select>
            </div>

            {/* Next Payment Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Payment Date (Optional)
              </label>
              <input
                type="date"
                name="nextPayment"
                value={formData.nextPayment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Renewal Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Renewal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Renewal Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="renewalDate"
                    value={formData.renewalDate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.renewalDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.renewalDate && <p className="mt-1 text-sm text-red-600">{errors.renewalDate}</p>}
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="autoRenewal"
                      checked={formData.autoRenewal}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable auto-renewal</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="pending-renewal">Pending Renewal</option>
                <option value="expired">Expired</option>
                <option value="terminated">Terminated</option>
              </select>
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
                Create Contract
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 