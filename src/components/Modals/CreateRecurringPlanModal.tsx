import React, { useState } from 'react';
import { X, DollarSign, Calendar, Repeat, Play, Settings, Clock, CheckCircle } from 'lucide-react';

interface CreateRecurringPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (planData: any) => void;
}

export default function CreateRecurringPlanModal({ isOpen, onClose, onSubmit }: CreateRecurringPlanModalProps) {
  const [formData, setFormData] = useState({
    client: '',
    planName: '',
    amount: '',
    interval: 'monthly',
    startDate: '',
    endDate: '',
    autoInvoice: true,
    status: 'active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const intervalOptions = [
    {
      value: 'monthly',
      label: 'Monthly',
      icon: <Calendar className="h-4 w-4" />,
      description: 'Billed every month'
    },
    {
      value: 'quarterly',
      label: 'Quarterly',
      icon: <Repeat className="h-4 w-4" />,
      description: 'Billed every 3 months'
    },
    {
      value: 'annually',
      label: 'Annually',
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'Billed once per year'
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

  const calculateNextBilling = () => {
    if (!formData.startDate) return null;
    
    const startDate = new Date(formData.startDate);
    const nextBilling = new Date(startDate);
    
    switch (formData.interval) {
      case 'monthly':
        nextBilling.setMonth(nextBilling.getMonth() + 1);
        break;
      case 'quarterly':
        nextBilling.setMonth(nextBilling.getMonth() + 3);
        break;
      case 'annually':
        nextBilling.setFullYear(nextBilling.getFullYear() + 1);
        break;
    }
    
    return nextBilling;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.client.trim()) {
      newErrors.client = 'Client name is required';
    }

    if (!formData.planName.trim()) {
      newErrors.planName = 'Plan name is required';
    } else if (formData.planName.length < 3) {
      newErrors.planName = 'Plan name must be at least 3 characters';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    // Validate dates
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const amount = parseFloat(formData.amount);
      const nextBilling = calculateNextBilling();
      
      const planData = {
        id: `plan-${Date.now()}`,
        client: formData.client,
        planName: formData.planName,
        amount: amount,
        interval: formData.interval,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        nextBilling: nextBilling,
        status: formData.status,
        autoInvoice: formData.autoInvoice,
        invoicesGenerated: 0,
        totalRevenue: 0,
        createdAt: new Date()
      };
      
      onSubmit(planData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      client: '',
      planName: '',
      amount: '',
      interval: 'monthly',
      startDate: '',
      endDate: '',
      autoInvoice: true,
      status: 'active'
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
            <h2 className="text-xl font-semibold text-gray-900">Create New Billing Plan</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Plan Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Name *
              </label>
              <input
                type="text"
                name="planName"
                value={formData.planName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.planName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Website Maintenance, App Support Package"
              />
              {errors.planName && <p className="mt-1 text-sm text-red-600">{errors.planName}</p>}
            </div>

            {/* Billing Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Amount (₹) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="25000"
              />
              {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
            </div>

            {/* Billing Interval */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Billing Interval *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {intervalOptions.map((interval) => (
                  <label
                    key={interval.value}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.interval === interval.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="interval"
                      value={interval.value}
                      checked={formData.interval === interval.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <div className="flex items-center mt-0.5">
                        {interval.icon}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{interval.label}</div>
                        <div className="text-xs text-gray-500">{interval.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
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
                  End Date (Optional)
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

            {/* Next Billing Preview */}
            {formData.startDate && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Billing Schedule Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Next Billing Date:</span>
                    <span className="font-medium text-blue-900">
                      {calculateNextBilling()?.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Billing Frequency:</span>
                    <span className="font-medium text-blue-900 capitalize">
                      {formData.interval}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Auto Invoice Setting */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="autoInvoice"
                  checked={formData.autoInvoice}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Automatically generate invoices</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">
                When enabled, invoices will be automatically generated on the billing date
              </p>
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
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
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
                Create Billing Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 