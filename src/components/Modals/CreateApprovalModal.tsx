/**
 * Create Approval Modal Component
 * Author: VB Entreprise
 * 
 * Modal for submitting documents for approval
 */

import React, { useState } from 'react';
import { X, Upload, FileText, Users, Calendar } from 'lucide-react';

interface CreateApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApprovalFormData) => void;
}

interface ApprovalFormData {
  documentName: string;
  version: string;
  description: string;
  approvers: string[];
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  attachments: File[];
}

const mockApprovers = [
  { id: '1', name: 'Legal Director', role: 'Legal' },
  { id: '2', name: 'Compliance Officer', role: 'Compliance' },
  { id: '3', name: 'CEO', role: 'Executive' },
  { id: '4', name: 'HR Director', role: 'HR' },
  { id: '5', name: 'Finance Director', role: 'Finance' }
];

export default function CreateApprovalModal({ isOpen, onClose, onSubmit }: CreateApprovalModalProps) {
  const [formData, setFormData] = useState<ApprovalFormData>({
    documentName: '',
    version: '',
    description: '',
    approvers: [],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    priority: 'medium',
    attachments: []
  });

  const [errors, setErrors] = useState<Partial<ApprovalFormData>>({});

  const handleInputChange = (field: keyof ApprovalFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleApproverToggle = (approverId: string) => {
    const newApprovers = formData.approvers.includes(approverId)
      ? formData.approvers.filter(id => id !== approverId)
      : [...formData.approvers, approverId];
    handleInputChange('approvers', newApprovers);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleInputChange('attachments', [...formData.attachments, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    handleInputChange('attachments', newAttachments);
  };

  const validateForm = () => {
    const newErrors: Partial<ApprovalFormData> = {};

    if (!formData.documentName.trim()) {
      newErrors.documentName = 'Document name is required';
    }

    if (!formData.version.trim()) {
      newErrors.version = 'Version is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.approvers.length === 0) {
      newErrors.approvers = 'At least one approver is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        documentName: '',
        version: '',
        description: '',
        approvers: [],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        attachments: []
      });
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Submit Document for Approval</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Name *
              </label>
              <input
                type="text"
                value={formData.documentName}
                onChange={(e) => handleInputChange('documentName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.documentName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter document name"
              />
              {errors.documentName && (
                <p className="mt-1 text-sm text-red-600">{errors.documentName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Version *
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => handleInputChange('version', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.version ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., v1.0"
              />
              {errors.version && (
                <p className="mt-1 text-sm text-red-600">{errors.version}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the document and changes made"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate.toISOString().split('T')[0]}
                onChange={(e) => handleInputChange('dueDate', new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Approvers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approvers *
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {mockApprovers.map((approver) => (
                <label key={approver.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.approvers.includes(approver.id)}
                    onChange={() => handleApproverToggle(approver.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{approver.name}</div>
                    <div className="text-sm text-gray-500">{approver.role}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.approvers && (
              <p className="mt-1 text-sm text-red-600">{errors.approvers}</p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500 font-medium">
                    Upload files
                  </span>
                  <span className="text-gray-500"> or drag and drop</span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                PDF, DOC, DOCX up to 10MB each
              </p>
            </div>

            {/* File List */}
            {formData.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Submit for Approval
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 