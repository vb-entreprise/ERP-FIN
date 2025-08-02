/**
 * Create Stock Item Modal Component
 * Author: VB Entreprise
 * 
 * Modal form for creating new stock items with
 * inventory details, pricing, and supplier information
 */

import React, { useState } from 'react';
import { X, Package, DollarSign, AlertTriangle, MapPin, Calendar, Building } from 'lucide-react';

interface CreateStockItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (stockItemData: any) => void;
}

export default function CreateStockItemModal({ isOpen, onClose, onSubmit }: CreateStockItemModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    currentStock: '',
    minStock: '',
    maxStock: '',
    unitPrice: '',
    supplier: '',
    location: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = [
    'Electronics',
    'Furniture',
    'Supplies',
    'Hardware',
    'Software',
    'Office Equipment',
    'Safety Equipment',
    'Other'
  ];

  const locationOptions = [
    'IT Storage',
    'Warehouse',
    'Supply Room',
    'Office Storage',
    'Server Room',
    'Maintenance Room',
    'Other'
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

  const generateSKU = () => {
    if (formData.name && formData.category) {
      const categoryPrefix = formData.category.substring(0, 3).toUpperCase();
      const namePrefix = formData.name.substring(0, 3).toUpperCase();
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `${categoryPrefix}-${namePrefix}-${randomNum}`;
    }
    return '';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Item name must be at least 3 characters';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.currentStock || parseInt(formData.currentStock) < 0) {
      newErrors.currentStock = 'Current stock must be 0 or greater';
    }

    if (!formData.minStock || parseInt(formData.minStock) < 0) {
      newErrors.minStock = 'Minimum stock must be 0 or greater';
    }

    if (!formData.maxStock || parseInt(formData.maxStock) <= 0) {
      newErrors.maxStock = 'Maximum stock must be greater than 0';
    }

    if (formData.minStock && formData.maxStock) {
      const minStock = parseInt(formData.minStock);
      const maxStock = parseInt(formData.maxStock);
      if (minStock >= maxStock) {
        newErrors.maxStock = 'Maximum stock must be greater than minimum stock';
      }
    }

    if (!formData.unitPrice || parseFloat(formData.unitPrice) < 0) {
      newErrors.unitPrice = 'Unit price must be 0 or greater';
    }

    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const currentStock = parseInt(formData.currentStock);
      const minStock = parseInt(formData.minStock);
      const maxStock = parseInt(formData.maxStock);
      const unitPrice = parseFloat(formData.unitPrice);
      
      // Determine status based on stock levels
      let status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstocked';
      if (currentStock === 0) {
        status = 'out-of-stock';
      } else if (currentStock <= minStock) {
        status = 'low-stock';
      } else if (currentStock >= maxStock) {
        status = 'overstocked';
      } else {
        status = 'in-stock';
      }
      
      const stockItemData = {
        id: `stock-${Date.now()}`,
        name: formData.name,
        sku: formData.sku || generateSKU(),
        category: formData.category,
        currentStock: currentStock,
        minStock: minStock,
        maxStock: maxStock,
        unitPrice: unitPrice,
        supplier: formData.supplier,
        location: formData.location,
        description: formData.description,
        lastRestocked: new Date(),
        status: status,
        createdAt: new Date()
      };
      
      onSubmit(stockItemData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      sku: '',
      category: '',
      currentStock: '',
      minStock: '',
      maxStock: '',
      unitPrice: '',
      supplier: '',
      location: '',
      description: ''
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
            <h2 className="text-xl font-semibold text-gray-900">Add New Stock Item</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Laptop Chargers, Office Chairs"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU (Optional)
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Auto-generated if empty"
                />
                {!formData.sku && formData.name && formData.category && (
                  <p className="mt-1 text-xs text-gray-500">
                    Suggested: {generateSKU()}
                  </p>
                )}
              </div>
            </div>

            {/* Category and Supplier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier *
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.supplier ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Tech Supplies Inc, Office Depot"
                />
                {errors.supplier && <p className="mt-1 text-sm text-red-600">{errors.supplier}</p>}
              </div>
            </div>

            {/* Stock Levels */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Levels</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    name="currentStock"
                    value={formData.currentStock}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.currentStock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.currentStock && <p className="mt-1 text-sm text-red-600">{errors.currentStock}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Stock *
                  </label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.minStock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="5"
                  />
                  {errors.minStock && <p className="mt-1 text-sm text-red-600">{errors.minStock}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Stock *
                  </label>
                  <input
                    type="number"
                    name="maxStock"
                    value={formData.maxStock}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.maxStock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="50"
                  />
                  {errors.maxStock && <p className="mt-1 text-sm text-red-600">{errors.maxStock}</p>}
                </div>
              </div>
            </div>

            {/* Pricing and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Price (₹) *
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.unitPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="2500"
                />
                {errors.unitPrice && <p className="mt-1 text-sm text-red-600">{errors.unitPrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage Location *
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a location</option>
                  {locationOptions.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional details about the stock item..."
              />
            </div>

            {/* Stock Status Preview */}
            {formData.currentStock && formData.minStock && formData.maxStock && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Stock Status Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Current Stock:</span>
                    <span className="font-medium text-blue-900">{formData.currentStock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Stock Level:</span>
                    <span className="font-medium text-blue-900">
                      {parseInt(formData.currentStock) === 0 ? 'Out of Stock' :
                       parseInt(formData.currentStock) <= parseInt(formData.minStock) ? 'Low Stock' :
                       parseInt(formData.currentStock) >= parseInt(formData.maxStock) ? 'Overstocked' : 'In Stock'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Value:</span>
                    <span className="font-medium text-blue-900">
                      ₹{formData.unitPrice ? (parseInt(formData.currentStock) * parseFloat(formData.unitPrice)).toLocaleString() : '0'}
                    </span>
                  </div>
                </div>
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
                Add Stock Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 