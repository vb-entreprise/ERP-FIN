/**
 * Create Asset Modal Component
 * Author: VB Entreprise
 * 
 * Modal form for creating new assets with
 * details, location, and tracking information
 */

import React, { useState } from 'react';
import { X, Package, User, Calendar, DollarSign, MapPin, FileText, Settings } from 'lucide-react';

interface CreateAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assetData: any) => void;
}

export default function CreateAssetModal({ isOpen, onClose, onSubmit }: CreateAssetModalProps) {
  const [formData, setFormData] = useState({
    assetTag: '',
    name: '',
    type: 'laptop',
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    purchasePrice: '',
    assignedTo: '',
    location: '',
    status: 'active',
    warrantyExpiry: '',
    condition: 'excellent',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const assetTypes = [
    {
      value: 'laptop',
      label: 'Laptop',
      icon: '💻',
      description: 'Portable computers'
    },
    {
      value: 'desktop',
      label: 'Desktop',
      icon: '🖥️',
      description: 'Stationary computers'
    },
    {
      value: 'monitor',
      label: 'Monitor',
      icon: '🖥️',
      description: 'Display screens'
    },
    {
      value: 'phone',
      label: 'Phone',
      icon: '📱',
      description: 'Mobile devices'
    },
    {
      value: 'software',
      label: 'Software',
      icon: '💿',
      description: 'Software licenses'
    },
    {
      value: 'furniture',
      label: 'Furniture',
      icon: '🪑',
      description: 'Office furniture'
    },
    {
      value: 'other',
      label: 'Other',
      icon: '📦',
      description: 'Miscellaneous items'
    }
  ];

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent', description: 'Like new condition' },
    { value: 'good', label: 'Good', description: 'Minor wear and tear' },
    { value: 'fair', label: 'Fair', description: 'Some damage or wear' },
    { value: 'poor', label: 'Poor', description: 'Significant damage' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active', description: 'In use' },
    { value: 'maintenance', label: 'Maintenance', description: 'Under repair' },
    { value: 'retired', label: 'Retired', description: 'No longer in use' },
    { value: 'lost', label: 'Lost', description: 'Missing' },
    { value: 'disposed', label: 'Disposed', description: 'Disposed of' }
  ];

  const generateAssetTag = () => {
    const type = formData.type.toUpperCase().substring(0, 3);
    const timestamp = Date.now().toString().slice(-4);
    return `${type}-${timestamp}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-generate asset tag when type changes
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        assetTag: generateAssetTag()
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const calculateCurrentValue = () => {
    if (!formData.purchasePrice || !formData.purchaseDate) return 0;
    
    const purchasePrice = parseFloat(formData.purchasePrice);
    const purchaseDate = new Date(formData.purchaseDate);
    const today = new Date();
    const ageInYears = (today.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    const depreciationRate = 0.2; // 20% per year
    const depreciatedValue = purchasePrice * Math.pow(1 - depreciationRate, ageInYears);
    return Math.max(depreciatedValue, purchasePrice * 0.1); // Minimum 10% of original value
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.assetTag.trim()) {
      newErrors.assetTag = 'Asset tag is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Asset name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Asset name must be at least 3 characters';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required';
    }

    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = 'Purchase price must be greater than 0';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    // Validate warranty expiry date
    if (formData.warrantyExpiry && formData.purchaseDate) {
      const warrantyDate = new Date(formData.warrantyExpiry);
      const purchaseDate = new Date(formData.purchaseDate);
      if (warrantyDate <= purchaseDate) {
        newErrors.warrantyExpiry = 'Warranty expiry must be after purchase date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const purchasePrice = parseFloat(formData.purchasePrice);
      const currentValue = calculateCurrentValue();
      
      const assetData = {
        id: `asset-${Date.now()}`,
        assetTag: formData.assetTag,
        name: formData.name,
        type: formData.type,
        brand: formData.brand,
        model: formData.model,
        serialNumber: formData.serialNumber,
        purchaseDate: new Date(formData.purchaseDate),
        purchasePrice: purchasePrice,
        currentValue: currentValue,
        assignedTo: formData.assignedTo || undefined,
        location: formData.location,
        status: formData.status,
        warrantyExpiry: formData.warrantyExpiry ? new Date(formData.warrantyExpiry) : undefined,
        condition: formData.condition,
        notes: formData.notes,
        createdAt: new Date()
      };
      
      onSubmit(assetData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      assetTag: generateAssetTag(),
      name: '',
      type: 'laptop',
      brand: '',
      model: '',
      serialNumber: '',
      purchaseDate: '',
      purchasePrice: '',
      assignedTo: '',
      location: '',
      status: 'active',
      warrantyExpiry: '',
      condition: 'excellent',
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
            <h2 className="text-xl font-semibold text-gray-900">Add New Asset</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Asset Tag and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Tag *
                </label>
                <input
                  type="text"
                  name="assetTag"
                  value={formData.assetTag}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.assetTag ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="LAP-001"
                />
                {errors.assetTag && <p className="mt-1 text-sm text-red-600">{errors.assetTag}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {assetTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Asset Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., MacBook Pro 16 inch, Dell UltraSharp 27 inch"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Brand and Model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.brand ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Apple, Dell, HP"
                />
                {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.model ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., MacBook Pro 16 inch M2, U2720Q"
                />
                {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
              </div>
            </div>

            {/* Serial Number and Purchase Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number *
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.serialNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., C02YW0XHJGH5"
                />
                {errors.serialNumber && <p className="mt-1 text-sm text-red-600">{errors.serialNumber}</p>}
              </div>

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
                  Purchase Price (₹) *
                </label>
                <input
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.purchasePrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="250000"
                />
                {errors.purchasePrice && <p className="mt-1 text-sm text-red-600">{errors.purchasePrice}</p>}
              </div>
            </div>

            {/* Assignment and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned To (Optional)
                </label>
                <input
                  type="text"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Sarah Johnson"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Mumbai Office, IT Storage"
                />
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>
            </div>

            {/* Status and Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Status
                </label>
                <div className="space-y-2">
                  {statusOptions.map((status) => (
                    <label
                      key={status.value}
                      className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.status === status.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status.value}
                        checked={formData.status === status.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-start">
                        <div className="flex items-center mt-0.5">
                          <Package className="h-4 w-4" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{status.label}</div>
                          <div className="text-xs text-gray-500">{status.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Condition
                </label>
                <div className="space-y-2">
                  {conditionOptions.map((condition) => (
                    <label
                      key={condition.value}
                      className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.condition === condition.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={condition.value}
                        checked={formData.condition === condition.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-start">
                        <div className="flex items-center mt-0.5">
                          <Settings className="h-4 w-4" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{condition.label}</div>
                          <div className="text-xs text-gray-500">{condition.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Warranty Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warranty Expiry (Optional)
              </label>
              <input
                type="date"
                name="warrantyExpiry"
                value={formData.warrantyExpiry}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.warrantyExpiry ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.warrantyExpiry && <p className="mt-1 text-sm text-red-600">{errors.warrantyExpiry}</p>}
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
                placeholder="Additional notes about the asset..."
              />
            </div>

            {/* Current Value Preview */}
            {formData.purchasePrice && formData.purchaseDate && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Estimated Current Value</h4>
                <div className="text-2xl font-bold text-blue-900">
                  ₹{calculateCurrentValue().toLocaleString()}
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Based on 20% annual depreciation rate
                </p>
              </div>
            )}

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
                Add Asset
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 