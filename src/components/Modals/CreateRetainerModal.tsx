import React, { useState } from 'react';
import { X, DollarSign, Clock, Calendar, User, Settings, BarChart3, AlertTriangle } from 'lucide-react';

interface CreateRetainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (retainerData: any) => void;
}

export default function CreateRetainerModal({ isOpen, onClose, onSubmit }: CreateRetainerModalProps) {
  const [formData, setFormData] = useState({
    client: '',
    amount: '',
    hourlyRate: '',
    totalHours: '',
    startDate: '',
    endDate: '',
    burnRate: '',
    status: 'active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const calculateProjectedDepletion = () => {
    if (!formData.amount || !formData.burnRate || !formData.hourlyRate) return null;
    
    const amount = parseFloat(formData.amount);
    const burnRate = parseFloat(formData.burnRate);
    const hourlyRate = parseFloat(formData.hourlyRate);
    
    if (burnRate <= 0 || hourlyRate <= 0) return null;
    
    const monthlyBurnAmount = burnRate * hourlyRate;
    const monthsToDepletion = amount / monthlyBurnAmount;
    
    const startDate = formData.startDate ? new Date(formData.startDate) : new Date();
    const projectedDate = new Date(startDate);
    projectedDate.setMonth(projectedDate.getMonth() + monthsToDepletion);
    
    return projectedDate;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.client.trim()) {
      newErrors.client = 'Client name is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Retainer amount must be greater than 0';
    }

    if (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0) {
      newErrors.hourlyRate = 'Hourly rate must be greater than 0';
    }

    if (!formData.totalHours || parseFloat(formData.totalHours) <= 0) {
      newErrors.totalHours = 'Total hours must be greater than 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.burnRate || parseFloat(formData.burnRate) <= 0) {
      newErrors.burnRate = 'Burn rate must be greater than 0';
    }

    // Validate dates
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    // Validate that total hours aligns with amount and hourly rate
    if (formData.amount && formData.hourlyRate && formData.totalHours) {
      const amount = parseFloat(formData.amount);
      const hourlyRate = parseFloat(formData.hourlyRate);
      const totalHours = parseFloat(formData.totalHours);
      
      if (amount !== hourlyRate * totalHours) {
        newErrors.totalHours = `Total hours should be ${Math.round(amount / hourlyRate)} based on amount and hourly rate`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const amount = parseFloat(formData.amount);
      const hourlyRate = parseFloat(formData.hourlyRate);
      const totalHours = parseFloat(formData.totalHours);
      const burnRate = parseFloat(formData.burnRate);
      
      const retainerData = {
        id: `retainer-${Date.now()}`,
        client: formData.client,
        amount: amount,
        balance: amount, // Initial balance equals amount
        hourlyRate: hourlyRate,
        hoursUsed: 0, // Start with 0 hours used
        totalHours: totalHours,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        status: formData.status,
        burnRate: burnRate,
        projectedDepletion: calculateProjectedDepletion(),
        createdAt: new Date()
      };
      
      onSubmit(retainerData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      client: '',
      amount: '',
      hourlyRate: '',
      totalHours: '',
      startDate: '',
      endDate: '',
      burnRate: '',
      status: 'active'
    });
    setErrors({});
    onClose();
  };

  const calculateTotalHours = () => {
    if (formData.amount && formData.hourlyRate) {
      const amount = parseFloat(formData.amount);
      const hourlyRate = parseFloat(formData.hourlyRate);
      if (hourlyRate > 0) {
        return Math.round(amount / hourlyRate);
      }
    }
    return '';
  };

  const calculateMonthlyBurnAmount = () => {
    if (formData.burnRate && formData.hourlyRate) {
      const burnRate = parseFloat(formData.burnRate);
      const hourlyRate = parseFloat(formData.hourlyRate);
      return (burnRate * hourlyRate).toLocaleString();
    }
    return '';
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]" onClick={handleClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create New Retainer</h2>
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

            {/* Financial Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retainer Amount (₹) *
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
                  placeholder="500000"
                />
                {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate (₹) *
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.hourlyRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="5000"
                />
                {errors.hourlyRate && <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Hours *
                </label>
                <input
                  type="number"
                  name="totalHours"
                  value={formData.totalHours}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.totalHours ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="100"
                />
                {errors.totalHours && <p className="mt-1 text-sm text-red-600">{errors.totalHours}</p>}
                {formData.amount && formData.hourlyRate && (
                  <p className="mt-1 text-xs text-gray-500">
                    Suggested: {calculateTotalHours()} hours
                  </p>
                )}
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

            {/* Burn Rate Analysis */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Burn Rate Analysis</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Burn Rate (hours) *
                  </label>
                  <input
                    type="number"
                    name="burnRate"
                    value={formData.burnRate}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.burnRate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="12"
                  />
                  {errors.burnRate && <p className="mt-1 text-sm text-red-600">{errors.burnRate}</p>}
                </div>

                {/* Burn Rate Insights */}
                {formData.burnRate && formData.hourlyRate && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Burn Rate Insights</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Monthly Burn Amount:</span>
                        <span className="font-medium text-blue-900">₹{calculateMonthlyBurnAmount()}</span>
                      </div>
                      {calculateProjectedDepletion() && (
                        <div className="flex justify-between">
                          <span className="text-blue-700">Projected Depletion:</span>
                          <span className="font-medium text-blue-900">
                            {calculateProjectedDepletion()?.toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                <option value="depleted">Depleted</option>
                <option value="expired">Expired</option>
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
                Create Retainer
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 