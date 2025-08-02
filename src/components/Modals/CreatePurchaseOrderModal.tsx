/**
 * Create Purchase Order Modal Component
 * Author: VB Entreprise
 * 
 * Modal form for creating new purchase orders with
 * vendor selection, item details, and approval workflow
 */

import React, { useState } from 'react';
import { X, Package, User, Calendar, DollarSign, Truck, AlertTriangle, Plus, Minus } from 'lucide-react';

interface CreatePurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (poData: any) => void;
  vendors: any[];
}

export default function CreatePurchaseOrderModal({ isOpen, onClose, onSubmit, vendors }: CreatePurchaseOrderModalProps) {
  const [formData, setFormData] = useState({
    vendor: '',
    requestedBy: '',
    priority: 'medium',
    expectedDelivery: '',
    notes: '',
    items: [{ id: '1', description: '', quantity: 1, unitPrice: '', category: 'Hardware' }]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const priorityOptions = [
    { value: 'low', label: 'Low', description: 'Standard priority' },
    { value: 'medium', label: 'Medium', description: 'Normal priority' },
    { value: 'high', label: 'High', description: 'Urgent requirement' },
    { value: 'urgent', label: 'Urgent', description: 'Critical need' }
  ];

  const categoryOptions = [
    'Hardware',
    'Software',
    'Furniture',
    'Supplies',
    'Services',
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

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate total price for the item
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? Number(value) : newItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? Number(value) : newItems[index].unitPrice;
      newItems[index].totalPrice = quantity * unitPrice;
    }
    
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: '',
      totalPrice: 0,
      category: 'Hardware'
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: newItems }));
    }
  };

  const calculateTotalAmount = () => {
    return formData.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.vendor.trim()) {
      newErrors.vendor = 'Vendor is required';
    }

    if (!formData.requestedBy.trim()) {
      newErrors.requestedBy = 'Requested by is required';
    }

    if (!formData.expectedDelivery) {
      newErrors.expectedDelivery = 'Expected delivery date is required';
    }

    // Validate items
    const validItems = formData.items.filter(item => 
      item.description.trim() !== '' && 
      item.quantity > 0 && 
      item.unitPrice > 0
    );

    if (validItems.length === 0) {
      newErrors.items = 'At least one valid item is required';
    }

    // Validate individual items
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item-${index}-description`] = 'Item description is required';
      }
      if (!item.quantity || item.quantity <= 0) {
        newErrors[`item-${index}-quantity`] = 'Quantity must be greater than 0';
      }
      if (!item.unitPrice || item.unitPrice <= 0) {
        newErrors[`item-${index}-unitPrice`] = 'Unit price must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const validItems = formData.items.filter(item => 
        item.description.trim() !== '' && 
        item.quantity > 0 && 
        item.unitPrice > 0
      );
      
      const poData = {
        id: `po-${Date.now()}`,
        poNumber: `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
        vendor: formData.vendor,
        requestedBy: formData.requestedBy,
        status: 'draft',
        priority: formData.priority,
        orderDate: new Date(),
        expectedDelivery: new Date(formData.expectedDelivery),
        totalAmount: calculateTotalAmount(),
        items: validItems,
        notes: formData.notes,
        createdAt: new Date()
      };
      
      onSubmit(poData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      vendor: '',
      requestedBy: '',
      priority: 'medium',
      expectedDelivery: '',
      notes: '',
      items: [{ id: '1', description: '', quantity: 1, unitPrice: '', category: 'Hardware' }]
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]" onClick={handleClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create New Purchase Order</h2>
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
                  Vendor *
                </label>
                <select
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.vendor ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.name}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
                {errors.vendor && <p className="mt-1 text-sm text-red-600">{errors.vendor}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requested By *
                </label>
                <input
                  type="text"
                  name="requestedBy"
                  value={formData.requestedBy}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.requestedBy ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., IT Manager, Admin Team"
                />
                {errors.requestedBy && <p className="mt-1 text-sm text-red-600">{errors.requestedBy}</p>}
              </div>
            </div>

            {/* Priority and Delivery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Priority
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {priorityOptions.map((priority) => (
                    <label
                      key={priority.value}
                      className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.priority === priority.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={priority.value}
                        checked={formData.priority === priority.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-start">
                        <div className="flex items-center mt-0.5">
                          {priority.value === 'urgent' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                          {priority.value === 'high' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                          {priority.value === 'medium' && <Package className="h-4 w-4 text-yellow-600" />}
                          {priority.value === 'low' && <Package className="h-4 w-4 text-green-600" />}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{priority.label}</div>
                          <div className="text-xs text-gray-500">{priority.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Delivery Date *
                </label>
                <input
                  type="date"
                  name="expectedDelivery"
                  value={formData.expectedDelivery}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.expectedDelivery ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.expectedDelivery && <p className="mt-1 text-sm text-red-600">{errors.expectedDelivery}</p>}
              </div>
            </div>

            {/* Items Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
              </div>
              {errors.items && <p className="mt-1 text-sm text-red-600 mb-4">{errors.items}</p>}

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">Item {index + 1}</h4>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`item-${index}-description`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="e.g., MacBook Pro 16 inch, Office Chair"
                        />
                        {errors[`item-${index}-description`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`item-${index}-description`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={item.category}
                          onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {categoryOptions.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                          min="1"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`item-${index}-quantity`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`item-${index}-quantity`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`item-${index}-quantity`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit Price (₹) *
                        </label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                          min="0"
                          step="0.01"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`item-${index}-unitPrice`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0.00"
                        />
                        {errors[`item-${index}-unitPrice`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`item-${index}-unitPrice`]}</p>
                        )}
                      </div>
                    </div>

                    {item.totalPrice > 0 && (
                      <div className="mt-3 text-right">
                        <span className="text-sm font-medium text-gray-900">
                          Total: ₹{item.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Total Amount */}
            {calculateTotalAmount() > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-blue-900">Total Order Amount:</span>
                  <span className="text-2xl font-bold text-blue-900">₹{calculateTotalAmount().toLocaleString()}</span>
                </div>
              </div>
            )}

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
                placeholder="Additional notes about the purchase order..."
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
                Create Purchase Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 