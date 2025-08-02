/**
 * Create Leave Request Modal Component
 * Author: VB Entreprise
 * 
 * Modal form for creating new leave requests with
 * date selection, reason, and backup coverage
 */

import React, { useState } from 'react';
import { X, Calendar, User, FileText, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface CreateLeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leaveRequestData: any) => void;
}

export default function CreateLeaveRequestModal({ isOpen, onClose, onSubmit }: CreateLeaveRequestModalProps) {
  const [formData, setFormData] = useState({
    employee: '',
    type: 'vacation',
    startDate: '',
    endDate: '',
    reason: '',
    backupCoverage: '',
    comments: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const leaveTypes = [
    {
      value: 'vacation',
      label: 'Vacation',
      icon: <Calendar className="h-4 w-4" />,
      description: 'Annual leave or holiday'
    },
    {
      value: 'sick',
      label: 'Sick Leave',
      icon: <AlertTriangle className="h-4 w-4" />,
      description: 'Medical or health-related'
    },
    {
      value: 'personal',
      label: 'Personal',
      icon: <User className="h-4 w-4" />,
      description: 'Personal matters or appointments'
    },
    {
      value: 'maternity',
      label: 'Maternity',
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'Maternity or paternity leave'
    },
    {
      value: 'emergency',
      label: 'Emergency',
      icon: <AlertTriangle className="h-4 w-4" />,
      description: 'Urgent or emergency situations'
    }
  ];

  const employeeOptions = [
    'Sarah Johnson',
    'Mike Chen',
    'Lisa Wong',
    'John Doe',
    'Jane Smith',
    'Alex Rodriguez',
    'Emily Davis',
    'David Wilson',
    'Other'
  ];

  const backupOptions = [
    'Mike Chen',
    'Sarah Johnson',
    'Lisa Wong',
    'John Doe',
    'Jane Smith',
    'Alex Rodriguez',
    'Emily Davis',
    'David Wilson',
    'Not Required'
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

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
      return diffDays;
    }
    return 0;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employee.trim()) {
      newErrors.employee = 'Employee is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    } else if (formData.reason.length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    }

    // Validate dates
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        newErrors.endDate = 'End date must be after start date';
      }

      // Check if dates are in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }

    // Validate backup coverage for certain leave types
    if (formData.type === 'vacation' || formData.type === 'personal') {
      if (!formData.backupCoverage || formData.backupCoverage === 'Not Required') {
        newErrors.backupCoverage = 'Backup coverage is required for this leave type';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const days = calculateDays();
      
      const leaveRequestData = {
        id: `leave-${Date.now()}`,
        employee: formData.employee,
        type: formData.type,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        days: days,
        reason: formData.reason,
        status: 'pending',
        backupCoverage: formData.backupCoverage === 'Not Required' ? undefined : formData.backupCoverage,
        comments: formData.comments || undefined,
        createdAt: new Date()
      };
      
      onSubmit(leaveRequestData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      employee: '',
      type: 'vacation',
      startDate: '',
      endDate: '',
      reason: '',
      backupCoverage: '',
      comments: ''
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
            <h2 className="text-xl font-semibold text-gray-900">New Leave Request</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee and Leave Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee *
                </label>
                <select
                  name="employee"
                  value={formData.employee}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.employee ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select an employee</option>
                  {employeeOptions.map(employee => (
                    <option key={employee} value={employee}>{employee}</option>
                  ))}
                </select>
                {errors.employee && <p className="mt-1 text-sm text-red-600">{errors.employee}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {leaveTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
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

            {/* Days Calculation Preview */}
            {formData.startDate && formData.endDate && calculateDays() > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Leave Duration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Start Date:</span>
                    <span className="font-medium text-blue-900">{formData.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">End Date:</span>
                    <span className="font-medium text-blue-900">{formData.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Days:</span>
                    <span className="font-medium text-blue-900">{calculateDays()} days</span>
                  </div>
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.reason ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Please provide a detailed reason for the leave request..."
              />
              {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
            </div>

            {/* Backup Coverage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backup Coverage
              </label>
              <select
                name="backupCoverage"
                value={formData.backupCoverage}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.backupCoverage ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select backup coverage</option>
                {backupOptions.map(backup => (
                  <option key={backup} value={backup}>{backup}</option>
                ))}
              </select>
              {errors.backupCoverage && <p className="mt-1 text-sm text-red-600">{errors.backupCoverage}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Required for vacation and personal leave types
              </p>
            </div>

            {/* Additional Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any additional information or special requests..."
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
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 