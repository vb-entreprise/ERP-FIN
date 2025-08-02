/**
 * Create Envelope Modal Component
 * Author: VB Entreprise
 * 
 * Modal form for creating new e-signature envelopes with
 * document selection, signer management, and workflow settings
 */

import React, { useState } from 'react';
import { X, Send, User, Mail, Calendar, FileText, Plus, Trash2 } from 'lucide-react';

interface CreateEnvelopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (envelopeData: any) => void;
}

interface Signer {
  id: string;
  name: string;
  email: string;
  role: string;
  order: number;
}

export default function CreateEnvelopeModal({ isOpen, onClose, onSubmit }: CreateEnvelopeModalProps) {
  const [formData, setFormData] = useState({
    documentName: '',
    description: '',
    expiresIn: '30',
    message: '',
    subject: ''
  });

  const [signers, setSigners] = useState<Signer[]>([
    { id: '1', name: '', email: '', role: 'Signer', order: 1 }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const expirationOptions = [
    { value: '7', label: '7 days' },
    { value: '14', label: '14 days' },
    { value: '30', label: '30 days' },
    { value: '60', label: '60 days' },
    { value: '90', label: '90 days' }
  ];

  const roleOptions = [
    'Signer',
    'Approver',
    'Witness',
    'Notary',
    'Client Representative',
    'Legal Counsel'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleSignerChange = (id: string, field: keyof Signer, value: string) => {
    setSigners(prev => prev.map(signer => 
      signer.id === id ? { ...signer, [field]: value } : signer
    ));
  };

  const addSigner = () => {
    const newSigner: Signer = {
      id: Date.now().toString(),
      name: '',
      email: '',
      role: 'Signer',
      order: signers.length + 1
    };
    setSigners(prev => [...prev, newSigner]);
  };

  const removeSigner = (id: string) => {
    if (signers.length > 1) {
      setSigners(prev => prev.filter(signer => signer.id !== id));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.documentName.trim()) {
      newErrors.documentName = 'Document name is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    // Validate signers
    signers.forEach((signer, index) => {
      if (!signer.name.trim()) {
        newErrors[`signer${index}Name`] = 'Signer name is required';
      }
      if (!signer.email.trim()) {
        newErrors[`signer${index}Email`] = 'Signer email is required';
      } else if (!/\S+@\S+\.\S+/.test(signer.email)) {
        newErrors[`signer${index}Email`] = 'Valid email is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const envelopeData = {
        id: `envelope-${Date.now()}`,
        ...formData,
        status: 'draft',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + Number(formData.expiresIn) * 24 * 60 * 60 * 1000),
        totalSigners: signers.length,
        completedSigners: 0,
        createdBy: 'Current User',
        signers: signers.map(signer => ({
          ...signer,
          status: 'pending',
          remindersSent: 0
        }))
      };
      
      onSubmit(envelopeData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      documentName: '',
      description: '',
      expiresIn: '30',
      message: '',
      subject: ''
    });
    setSigners([{ id: '1', name: '', email: '', role: 'Signer', order: 1 }]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create E-Signature Envelope</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Document Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Document Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Name *
                </label>
                <input
                  type="text"
                  name="documentName"
                  value={formData.documentName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.documentName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter document name"
                />
                {errors.documentName && <p className="mt-1 text-sm text-red-600">{errors.documentName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the document purpose..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expires In
                </label>
                <select
                  name="expiresIn"
                  value={formData.expiresIn}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {expirationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Email Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.subject ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email subject"
                />
                {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter message to signers..."
                />
              </div>
            </div>
          </div>

          {/* Signers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Signers
              </h3>
              <button
                type="button"
                onClick={addSigner}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                Add Signer
              </button>
            </div>
            <div className="space-y-4">
              {signers.map((signer, index) => (
                <div key={signer.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Signer {signer.order}</h4>
                    {signers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSigner(signer.id)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={signer.name}
                        onChange={(e) => handleSignerChange(signer.id, 'name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`signer${index}Name`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter signer name"
                      />
                      {errors[`signer${index}Name`] && <p className="mt-1 text-sm text-red-600">{errors[`signer${index}Name`]}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={signer.email}
                        onChange={(e) => handleSignerChange(signer.id, 'email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`signer${index}Email`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter signer email"
                      />
                      {errors[`signer${index}Email`] && <p className="mt-1 text-sm text-red-600">{errors[`signer${index}Email`]}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        value={signer.role}
                        onChange={(e) => handleSignerChange(signer.id, 'role', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {roleOptions.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Create Envelope
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 