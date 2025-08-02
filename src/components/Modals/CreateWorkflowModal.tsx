import React, { useState } from 'react';
import { X, Zap, GitBranch, Clock, Mail, User, CheckCircle } from 'lucide-react';

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workflowData: any) => void;
}

export default function CreateWorkflowModal({ isOpen, onClose, onSubmit }: CreateWorkflowModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: 'lead_created',
    status: 'draft'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const triggerTypes = [
    { 
      value: 'lead_created', 
      label: 'Lead Created', 
      icon: <User className="h-4 w-4" />,
      description: 'When a new lead is created'
    },
    { 
      value: 'invoice_overdue', 
      label: 'Invoice Overdue', 
      icon: <Mail className="h-4 w-4" />,
      description: 'When an invoice becomes overdue'
    },
    { 
      value: 'task_completed', 
      label: 'Task Completed', 
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'When a task is marked as complete'
    },
    { 
      value: 'scheduled', 
      label: 'Scheduled', 
      icon: <Clock className="h-4 w-4" />,
      description: 'Runs on a schedule'
    }
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Workflow name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Workflow name must be at least 3 characters';
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
      const workflowData = {
        id: `workflow-${Date.now()}`,
        ...formData,
        nodes: [],
        executions: 0,
        createdBy: 'Current User',
        createdAt: new Date()
      };
      
      onSubmit(workflowData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      trigger: 'lead_created',
      status: 'draft'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]" onClick={handleClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create New Workflow</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Workflow Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workflow Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., New Lead Assignment, Invoice Reminder"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe what this workflow does"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Trigger Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Trigger Type
              </label>
              <div className="space-y-3">
                {triggerTypes.map((trigger) => (
                  <label
                    key={trigger.value}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.trigger === trigger.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="trigger"
                      value={trigger.value}
                      checked={formData.trigger === trigger.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <div className="flex items-center mt-0.5">
                        {trigger.icon}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{trigger.label}</div>
                        <div className="text-xs text-gray-500">{trigger.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Initial Status */}
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
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
                Create Workflow
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 