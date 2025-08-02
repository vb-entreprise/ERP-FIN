import React, { useState } from 'react';
import { X, Zap, Calendar, User, Mail, DollarSign, FileText, Settings } from 'lucide-react';

interface CreateTriggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (triggerData: any) => void;
}

export default function CreateTriggerModal({ isOpen, onClose, onSubmit }: CreateTriggerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    event: 'lead_created',
    status: 'active',
    conditions: [{ field: '', operator: 'equals', value: '' }],
    actions: [{ type: 'email', target: '', config: {} }]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const eventTypes = [
    { 
      value: 'lead_created', 
      label: 'Lead Created', 
      icon: <User className="h-4 w-4" />,
      description: 'When a new lead is created'
    },
    { 
      value: 'invoice_overdue', 
      label: 'Invoice Overdue', 
      icon: <DollarSign className="h-4 w-4" />,
      description: 'When an invoice becomes overdue'
    },
    { 
      value: 'project_due_soon', 
      label: 'Project Due Soon', 
      icon: <Calendar className="h-4 w-4" />,
      description: 'When a project deadline approaches'
    },
    { 
      value: 'task_completed', 
      label: 'Task Completed', 
      icon: <FileText className="h-4 w-4" />,
      description: 'When a task is marked as complete'
    },
    { 
      value: 'email_received', 
      label: 'Email Received', 
      icon: <Mail className="h-4 w-4" />,
      description: 'When a new email is received'
    }
  ];

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Not Contains' }
  ];

  const actionTypes = [
    { value: 'email', label: 'Send Email' },
    { value: 'assign', label: 'Assign Task' },
    { value: 'update', label: 'Update Record' },
    { value: 'create', label: 'Create Record' }
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

  const handleConditionChange = (index: number, field: string, value: string) => {
    const newConditions = [...formData.conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setFormData(prev => ({ ...prev, conditions: newConditions }));
  };

  const handleActionChange = (index: number, field: string, value: string) => {
    const newActions = [...formData.actions];
    newActions[index] = { ...newActions[index], [field]: value };
    setFormData(prev => ({ ...prev, actions: newActions }));
  };

  const addCondition = () => {
    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, { field: '', operator: 'equals', value: '' }]
    }));
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, { type: 'email', target: '', config: {} }]
    }));
  };

  const removeAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Trigger name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Trigger name must be at least 3 characters';
    }

    if (formData.conditions.length === 0) {
      newErrors.conditions = 'At least one condition is required';
    }

    if (formData.actions.length === 0) {
      newErrors.actions = 'At least one action is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const triggerData = {
        id: `trigger-${Date.now()}`,
        ...formData,
        executions: 0,
        createdAt: new Date()
      };
      
      onSubmit(triggerData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      event: 'lead_created',
      status: 'active',
      conditions: [{ field: '', operator: 'equals', value: '' }],
      actions: [{ type: 'email', target: '', config: {} }]
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
            <h2 className="text-xl font-semibold text-gray-900">Create New Trigger</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Trigger Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trigger Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., High Value Lead Alert, Project Deadline Alert"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Event Type
              </label>
              <div className="space-y-3">
                {eventTypes.map((event) => (
                  <label
                    key={event.value}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.event === event.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="event"
                      value={event.value}
                      checked={formData.event === event.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <div className="flex items-center mt-0.5">
                        {event.icon}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{event.label}</div>
                        <div className="text-xs text-gray-500">{event.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Conditions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Conditions *
                </label>
                <button
                  type="button"
                  onClick={addCondition}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Condition
                </button>
              </div>
              {errors.conditions && <p className="mt-1 text-sm text-red-600">{errors.conditions}</p>}
              
              <div className="space-y-3">
                {formData.conditions.map((condition, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="text"
                      placeholder="Field name"
                      value={condition.field}
                      onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={condition.operator}
                      onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {operators.map(op => (
                        <option key={op.value} value={op.value}>{op.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Value"
                      value={condition.value}
                      onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.conditions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCondition(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Actions *
                </label>
                <button
                  type="button"
                  onClick={addAction}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Action
                </button>
              </div>
              {errors.actions && <p className="mt-1 text-sm text-red-600">{errors.actions}</p>}
              
              <div className="space-y-3">
                {formData.actions.map((action, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <select
                      value={action.type}
                      onChange={(e) => handleActionChange(index, 'type', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {actionTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Target (email, user, etc.)"
                      value={action.target}
                      onChange={(e) => handleActionChange(index, 'target', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.actions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAction(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
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
                Create Trigger
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 