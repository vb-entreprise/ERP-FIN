import React, { useState } from 'react';
import { X, Users, CheckCircle, Clock, ArrowRight, Settings, DollarSign, FileText, Calendar, UserCheck } from 'lucide-react';

interface CreateApprovalChainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (chainData: any) => void;
}

interface ApprovalStep {
  id: string;
  order: number;
  approver: string;
  role: string;
  condition?: string;
  required: boolean;
}

export default function CreateApprovalChainModal({ isOpen, onClose, onSubmit }: CreateApprovalChainModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    status: 'active',
    steps: [
      { id: '1', order: 1, approver: '', role: '', condition: '', required: true }
    ]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const chainTypes = [
    { 
      value: 'expense', 
      label: 'Expense Approval', 
      icon: <DollarSign className="h-4 w-4" />,
      description: 'For expense reimbursements and claims'
    },
    { 
      value: 'purchase', 
      label: 'Purchase Order', 
      icon: <FileText className="h-4 w-4" />,
      description: 'For purchase orders and procurement'
    },
    { 
      value: 'leave', 
      label: 'Leave Request', 
      icon: <Calendar className="h-4 w-4" />,
      description: 'For vacation and leave requests'
    },
    { 
      value: 'contract', 
      label: 'Contract Approval', 
      icon: <UserCheck className="h-4 w-4" />,
      description: 'For contract and agreement approvals'
    },
    { 
      value: 'custom', 
      label: 'Custom Process', 
      icon: <Settings className="h-4 w-4" />,
      description: 'For custom approval workflows'
    }
  ];

  const roleOptions = [
    'Manager',
    'Director',
    'Finance',
    'HR',
    'Legal',
    'Executive',
    'Department Head',
    'Project Manager'
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

  const handleStepChange = (index: number, field: string, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    const newStep: ApprovalStep = {
      id: `step-${Date.now()}`,
      order: formData.steps.length + 1,
      approver: '',
      role: '',
      condition: '',
      required: true
    };
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      const newSteps = formData.steps.filter((_, i) => i !== index);
      // Reorder steps
      const reorderedSteps = newSteps.map((step, i) => ({
        ...step,
        order: i + 1
      }));
      setFormData(prev => ({ ...prev, steps: reorderedSteps }));
    }
  };

  const moveStepUp = (index: number) => {
    if (index > 0) {
      const newSteps = [...formData.steps];
      [newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]];
      // Update order numbers
      const reorderedSteps = newSteps.map((step, i) => ({
        ...step,
        order: i + 1
      }));
      setFormData(prev => ({ ...prev, steps: reorderedSteps }));
    }
  };

  const moveStepDown = (index: number) => {
    if (index < formData.steps.length - 1) {
      const newSteps = [...formData.steps];
      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
      // Update order numbers
      const reorderedSteps = newSteps.map((step, i) => ({
        ...step,
        order: i + 1
      }));
      setFormData(prev => ({ ...prev, steps: reorderedSteps }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Chain name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Chain name must be at least 3 characters';
    }

    // Validate steps
    formData.steps.forEach((step, index) => {
      if (!step.approver.trim()) {
        newErrors[`step${index}Approver`] = 'Approver is required';
      }
      if (!step.role.trim()) {
        newErrors[`step${index}Role`] = 'Role is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const chainData = {
        id: `chain-${Date.now()}`,
        ...formData,
        pendingApprovals: 0,
        createdAt: new Date()
      };
      
      onSubmit(chainData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: 'expense',
      status: 'active',
      steps: [
        { id: '1', order: 1, approver: '', role: '', condition: '', required: true }
      ]
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
            <h2 className="text-xl font-semibold text-gray-900">Create New Approval Chain</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Chain Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chain Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Expense Approval, Purchase Order Approval"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Chain Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Chain Type
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {chainTypes.map((type) => (
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

            {/* Approval Steps */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Approval Steps *
                </label>
                <button
                  type="button"
                  onClick={addStep}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Step
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.steps.map((step, index) => (
                  <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-blue-600">{step.order}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">Step {step.order}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => moveStepUp(index)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            ↑
                          </button>
                        )}
                        {index < formData.steps.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveStepDown(index)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            ↓
                          </button>
                        )}
                        {formData.steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeStep(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Approver *
                        </label>
                        <input
                          type="text"
                          value={step.approver}
                          onChange={(e) => handleStepChange(index, 'approver', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`step${index}Approver`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="e.g., Direct Manager, Finance Manager"
                        />
                        {errors[`step${index}Approver`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`step${index}Approver`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role *
                        </label>
                        <select
                          value={step.role}
                          onChange={(e) => handleStepChange(index, 'role', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`step${index}Role`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select role</option>
                          {roleOptions.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                        {errors[`step${index}Role`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`step${index}Role`]}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Condition (Optional)
                      </label>
                      <input
                        type="text"
                        value={step.condition}
                        onChange={(e) => handleStepChange(index, 'condition', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., amount > 10000, days > 5"
                      />
                    </div>
                    
                    <div className="mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={step.required}
                          onChange={(e) => handleStepChange(index, 'required', e.target.checked.toString())}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Required step</span>
                      </label>
                    </div>
                  </div>
                ))}
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
                Create Approval Chain
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 