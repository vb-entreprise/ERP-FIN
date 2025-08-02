/**
 * Create License Modal Component
 * Author: VB Entreprise
 * 
 * Modal form for creating new software licenses with
 * details, user assignments, and renewal tracking
 */

import React, { useState } from 'react';
import { X, Key, Calendar, DollarSign, Users, Shield, Settings, AlertTriangle } from 'lucide-react';

interface CreateLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (licenseData: any) => void;
}

export default function CreateLicenseModal({ isOpen, onClose, onSubmit }: CreateLicenseModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    vendor: '',
    type: 'subscription',
    seats: '',
    cost: '',
    purchaseDate: '',
    expiryDate: '',
    renewalDate: '',
    autoRenewal: true,
    licenseKey: '',
    assignedUsers: [''],
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const licenseTypes = [
    {
      value: 'subscription',
      label: 'Subscription',
      icon: <Key className="h-4 w-4" />,
      description: 'Annual or monthly subscription'
    },
    {
      value: 'perpetual',
      label: 'Perpetual',
      icon: <Shield className="h-4 w-4" />,
      description: 'One-time purchase'
    },
    {
      value: 'volume',
      label: 'Volume',
      icon: <Users className="h-4 w-4" />,
      description: 'Bulk licensing'
    },
    {
      value: 'enterprise',
      label: 'Enterprise',
      icon: <Settings className="h-4 w-4" />,
      description: 'Enterprise-wide license'
    }
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

  const handleUserChange = (index: number, value: string) => {
    const newUsers = [...formData.assignedUsers];
    newUsers[index] = value;
    setFormData(prev => ({ ...prev, assignedUsers: newUsers }));
  };

  const addUser = () => {
    setFormData(prev => ({
      ...prev,
      assignedUsers: [...prev.assignedUsers, '']
    }));
  };

  const removeUser = (index: number) => {
    if (formData.assignedUsers.length > 1) {
      const newUsers = formData.assignedUsers.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, assignedUsers: newUsers }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'License name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'License name must be at least 3 characters';
    }

    if (!formData.vendor.trim()) {
      newErrors.vendor = 'Vendor name is required';
    }

    if (!formData.seats || parseInt(formData.seats) <= 0) {
      newErrors.seats = 'Number of seats must be greater than 0';
    }

    if (!formData.cost || parseFloat(formData.cost) < 0) {
      newErrors.cost = 'Cost must be 0 or greater';
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required';
    }

    if (formData.expiryDate && formData.purchaseDate) {
      const expiryDate = new Date(formData.expiryDate);
      const purchaseDate = new Date(formData.purchaseDate);
      if (expiryDate <= purchaseDate) {
        newErrors.expiryDate = 'Expiry date must be after purchase date';
      }
    }

    if (formData.renewalDate && formData.expiryDate) {
      const renewalDate = new Date(formData.renewalDate);
      const expiryDate = new Date(formData.expiryDate);
      if (renewalDate >= expiryDate) {
        newErrors.renewalDate = 'Renewal date must be before expiry date';
      }
    }

    // Validate assigned users
    const validUsers = formData.assignedUsers.filter(user => user.trim() !== '');
    if (validUsers.length === 0) {
      newErrors.assignedUsers = 'At least one assigned user is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const seats = parseInt(formData.seats);
      const cost = parseFloat(formData.cost);
      const validUsers = formData.assignedUsers.filter(user => user.trim() !== '');
      
      const licenseData = {
        id: `license-${Date.now()}`,
        name: formData.name,
        vendor: formData.vendor,
        type: formData.type,
        seats: seats,
        usedSeats: 0, // Start with 0 used seats
        cost: cost,
        purchaseDate: new Date(formData.purchaseDate),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
        renewalDate: formData.renewalDate ? new Date(formData.renewalDate) : undefined,
        autoRenewal: formData.autoRenewal,
        status: 'active',
        assignedUsers: validUsers,
        licenseKey: formData.licenseKey || undefined,
        notes: formData.notes,
        createdAt: new Date()
      };
      
      onSubmit(licenseData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      vendor: '',
      type: 'subscription',
      seats: '',
      cost: '',
      purchaseDate: '',
      expiryDate: '',
      renewalDate: '',
      autoRenewal: true,
      licenseKey: '',
      assignedUsers: [''],
      notes: ''
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
            <h2 className="text-xl font-semibold text-gray-900">Add New License</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* License Name and Vendor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Microsoft Office 365, Adobe Creative Suite"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor *
                </label>
                <input
                  type="text"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.vendor ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Microsoft, Adobe, Slack"
                />
                {errors.vendor && <p className="mt-1 text-sm text-red-600">{errors.vendor}</p>}
              </div>
            </div>

            {/* License Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                License Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {licenseTypes.map((type) => (
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

            {/* Seats and Cost */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Seats *
                </label>
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.seats ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="50"
                />
                {errors.seats && <p className="mt-1 text-sm text-red-600">{errors.seats}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Cost (₹) *
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cost ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="150000"
                />
                {errors.cost && <p className="mt-1 text-sm text-red-600">{errors.cost}</p>}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.purchaseDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.purchaseDate && <p className="mt-1 text-sm text-red-600">{errors.purchaseDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renewal Date
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
            </div>

            {/* License Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Key (Optional)
              </label>
              <input
                type="text"
                name="licenseKey"
                value={formData.licenseKey}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
              />
            </div>

            {/* Auto Renewal */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="autoRenewal"
                  checked={formData.autoRenewal}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Auto-renewal enabled</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Automatically renew the license when it expires
              </p>
            </div>

            {/* Assigned Users */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Assigned Users *
                </label>
                <button
                  type="button"
                  onClick={addUser}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add User
                </button>
              </div>
              {errors.assignedUsers && <p className="mt-1 text-sm text-red-600">{errors.assignedUsers}</p>}

              <div className="space-y-3">
                {formData.assignedUsers.map((user, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={user}
                      onChange={(e) => handleUserChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Sarah Johnson, Mike Chen"
                    />
                    {formData.assignedUsers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeUser(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes about the license..."
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
                Add License
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 