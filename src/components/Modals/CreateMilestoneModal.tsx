import React, { useState } from 'react';
import { X, Flag, Calendar, DollarSign, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';

interface CreateMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (milestoneData: any) => void;
}

export default function CreateMilestoneModal({ isOpen, onClose, onSubmit }: CreateMilestoneModalProps) {
  const [formData, setFormData] = useState({
    projectName: '',
    client: '',
    title: '',
    description: '',
    dueDate: '',
    paymentAmount: '',
    paymentPercentage: '',
    status: 'pending',
    deliverables: [''],
    dependencies: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions = [
    {
      value: 'pending',
      label: 'Pending',
      icon: <Flag className="h-4 w-4" />,
      description: 'Not yet started'
    },
    {
      value: 'in-progress',
      label: 'In Progress',
      icon: <Clock className="h-4 w-4" />,
      description: 'Currently being worked on'
    },
    {
      value: 'completed',
      label: 'Completed',
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'Work finished, awaiting payment'
    },
    {
      value: 'paid',
      label: 'Paid',
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Payment received'
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

  const handleDeliverableChange = (index: number, value: string) => {
    const newDeliverables = [...formData.deliverables];
    newDeliverables[index] = value;
    setFormData(prev => ({ ...prev, deliverables: newDeliverables }));
  };

  const addDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, '']
    }));
  };

  const removeDeliverable = (index: number) => {
    if (formData.deliverables.length > 1) {
      const newDeliverables = formData.deliverables.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, deliverables: newDeliverables }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }

    if (!formData.client.trim()) {
      newErrors.client = 'Client name is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Milestone title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Milestone title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (!formData.paymentAmount || parseFloat(formData.paymentAmount) <= 0) {
      newErrors.paymentAmount = 'Payment amount must be greater than 0';
    }

    if (!formData.paymentPercentage || parseFloat(formData.paymentPercentage) <= 0 || parseFloat(formData.paymentPercentage) > 100) {
      newErrors.paymentPercentage = 'Payment percentage must be between 1 and 100';
    }

    // Validate deliverables
    const validDeliverables = formData.deliverables.filter(d => d.trim() !== '');
    if (validDeliverables.length === 0) {
      newErrors.deliverables = 'At least one deliverable is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const amount = parseFloat(formData.paymentAmount);
      const percentage = parseFloat(formData.paymentPercentage);
      const validDeliverables = formData.deliverables.filter(d => d.trim() !== '');
      
      const milestoneData = {
        id: `milestone-${Date.now()}`,
        projectName: formData.projectName,
        client: formData.client,
        title: formData.title,
        description: formData.description,
        dueDate: new Date(formData.dueDate),
        paymentAmount: amount,
        paymentPercentage: percentage,
        status: formData.status,
        deliverables: validDeliverables,
        dependencies: formData.dependencies,
        createdAt: new Date()
      };
      
      onSubmit(milestoneData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      projectName: '',
      client: '',
      title: '',
      description: '',
      dueDate: '',
      paymentAmount: '',
      paymentPercentage: '',
      status: 'pending',
      deliverables: [''],
      dependencies: []
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
            <h2 className="text-xl font-semibold text-gray-900">Create New Milestone</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project and Client */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.projectName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., E-commerce Platform"
                />
                {errors.projectName && <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>}
              </div>

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
            </div>

            {/* Milestone Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Milestone Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Design Phase Completion, Frontend Development"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
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
                placeholder="Describe what this milestone involves and what needs to be accomplished"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount (₹) *
                </label>
                <input
                  type="number"
                  name="paymentAmount"
                  value={formData.paymentAmount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.paymentAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="150000"
                />
                {errors.paymentAmount && <p className="mt-1 text-sm text-red-600">{errors.paymentAmount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Percentage (%) *
                </label>
                <input
                  type="number"
                  name="paymentPercentage"
                  value={formData.paymentPercentage}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.paymentPercentage ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="30"
                />
                {errors.paymentPercentage && <p className="mt-1 text-sm text-red-600">{errors.paymentPercentage}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dueDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Initial Status
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        {status.icon}
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

            {/* Deliverables */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Deliverables *
                </label>
                <button
                  type="button"
                  onClick={addDeliverable}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Deliverable
                </button>
              </div>
              {errors.deliverables && <p className="mt-1 text-sm text-red-600">{errors.deliverables}</p>}

              <div className="space-y-3">
                {formData.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={deliverable}
                      onChange={(e) => handleDeliverableChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Wireframes, UI Mockups, Prototype"
                    />
                    {formData.deliverables.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDeliverable(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
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
                Create Milestone
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 