/**
 * Documents E-Signatures Page
 * Author: VB Entreprise
 * 
 * Envelope status tracking, signer workflow with sequence and reminders
 */

import React, { useState } from 'react';
import { Plus, Send, Eye, Download, Clock, CheckCircle, AlertCircle, User, Mail, Calendar, FileText } from 'lucide-react';
import CreateEnvelopeModal from '../../components/Modals/CreateEnvelopeModal';

interface Envelope {
  id: string;
  documentName: string;
  status: 'draft' | 'sent' | 'in-progress' | 'completed' | 'declined' | 'expired';
  createdAt: Date;
  sentAt?: Date;
  completedAt?: Date;
  expiresAt: Date;
  signers: Signer[];
  totalSigners: number;
  completedSigners: number;
  createdBy: string;
}

interface Signer {
  id: string;
  name: string;
  email: string;
  role: string;
  order: number;
  status: 'pending' | 'sent' | 'viewed' | 'signed' | 'declined';
  sentAt?: Date;
  viewedAt?: Date;
  signedAt?: Date;
  ipAddress?: string;
  remindersSent: number;
}

const mockEnvelopes: Envelope[] = [
  {
    id: '1',
    documentName: 'Service Agreement - TechCorp Solutions',
    status: 'completed',
    createdAt: new Date('2024-01-15'),
    sentAt: new Date('2024-01-16'),
    completedAt: new Date('2024-01-20'),
    expiresAt: new Date('2024-02-16'),
    totalSigners: 2,
    completedSigners: 2,
    createdBy: 'Sarah Johnson',
    signers: [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@techcorp.com',
        role: 'Client Representative',
        order: 1,
        status: 'signed',
        sentAt: new Date('2024-01-16'),
        viewedAt: new Date('2024-01-17'),
        signedAt: new Date('2024-01-18'),
        ipAddress: '192.168.1.100',
        remindersSent: 0
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@vbenterprise.com',
        role: 'Service Provider',
        order: 2,
        status: 'signed',
        sentAt: new Date('2024-01-18'),
        viewedAt: new Date('2024-01-19'),
        signedAt: new Date('2024-01-20'),
        ipAddress: '192.168.1.101',
        remindersSent: 0
      }
    ]
  },
  {
    id: '2',
    documentName: 'NDA - Startup Innovation',
    status: 'in-progress',
    createdAt: new Date('2024-01-20'),
    sentAt: new Date('2024-01-21'),
    expiresAt: new Date('2024-02-21'),
    totalSigners: 3,
    completedSigners: 1,
    createdBy: 'Legal Team',
    signers: [
      {
        id: '3',
        name: 'Emily Davis',
        email: 'emily@startup.io',
        role: 'CEO',
        order: 1,
        status: 'signed',
        sentAt: new Date('2024-01-21'),
        viewedAt: new Date('2024-01-21'),
        signedAt: new Date('2024-01-22'),
        ipAddress: '192.168.1.102',
        remindersSent: 0
      },
      {
        id: '4',
        name: 'Mike Chen',
        email: 'mike@vbenterprise.com',
        role: 'Project Manager',
        order: 2,
        status: 'viewed',
        sentAt: new Date('2024-01-22'),
        viewedAt: new Date('2024-01-22'),
        remindersSent: 1
      },
      {
        id: '5',
        name: 'Legal Representative',
        email: 'legal@vbenterprise.com',
        role: 'Legal Counsel',
        order: 3,
        status: 'pending',
        remindersSent: 0
      }
    ]
  },
  {
    id: '3',
    documentName: 'Employment Contract - New Hire',
    status: 'sent',
    createdAt: new Date('2024-01-22'),
    sentAt: new Date('2024-01-22'),
    expiresAt: new Date('2024-02-22'),
    totalSigners: 2,
    completedSigners: 0,
    createdBy: 'HR Team',
    signers: [
      {
        id: '6',
        name: 'Alex Johnson',
        email: 'alex.johnson@email.com',
        role: 'New Employee',
        order: 1,
        status: 'sent',
        sentAt: new Date('2024-01-22'),
        remindersSent: 0
      },
      {
        id: '7',
        name: 'HR Manager',
        email: 'hr@vbenterprise.com',
        role: 'HR Representative',
        order: 2,
        status: 'pending',
        remindersSent: 0
      }
    ]
  }
];

export default function ESignatures() {
  const [envelopes, setEnvelopes] = useState<Envelope[]>(mockEnvelopes);
  const [selectedEnvelope, setSelectedEnvelope] = useState<Envelope | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
      expired: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'declined': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'expired': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Send className="h-4 w-4 text-blue-600" />;
    }
  };

  const getSignerStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      viewed: 'bg-yellow-100 text-yellow-800',
      signed: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredEnvelopes = statusFilter === 'all' 
    ? envelopes 
    : envelopes.filter(envelope => envelope.status === statusFilter);

  const getDaysUntilExpiry = (expiryDate: Date) => {
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">E-Signatures</h1>
          <p className="mt-2 text-gray-600">
            Track envelope status, manage signer workflows, and send automated reminders.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Envelope
          </button>
        </div>
      </div>

      {/* E-Signature Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Envelopes</p>
              <p className="text-2xl font-bold text-gray-900">{envelopes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{envelopes.filter(e => e.status === 'completed').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{envelopes.filter(e => e.status === 'in-progress').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Send className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((envelopes.filter(e => e.status === 'completed').length / envelopes.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Envelopes List */}
        <div className="lg:col-span-2">
          {/* Filter */}
          <div className="mb-6">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="declined">Declined</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Envelopes Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEnvelopes.map((envelope) => (
                    <tr 
                      key={envelope.id} 
                      className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                        selectedEnvelope?.id === envelope.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedEnvelope(envelope)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(envelope.status)}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{envelope.documentName}</div>
                            <div className="text-sm text-gray-500">Created by {envelope.createdBy}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(envelope.status)}`}>
                          {envelope.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{envelope.completedSigners}/{envelope.totalSigners} signed</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(envelope.completedSigners / envelope.totalSigners) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{envelope.expiresAt.toLocaleDateString()}</div>
                        <div className={`text-sm ${getDaysUntilExpiry(envelope.expiresAt) < 7 ? 'text-red-600' : 'text-gray-500'}`}>
                          {getDaysUntilExpiry(envelope.expiresAt)} days left
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1 rounded">
                            <Send className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Envelope Detail Panel */}
        <div className="lg:col-span-1">
          {selectedEnvelope ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Signer Workflow</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Envelope Header */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedEnvelope.documentName}</h4>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedEnvelope.status)}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(selectedEnvelope.status)}`}>
                      {selectedEnvelope.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {/* Progress Overview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Signing Progress</span>
                    <span className="font-medium">{selectedEnvelope.completedSigners}/{selectedEnvelope.totalSigners}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(selectedEnvelope.completedSigners / selectedEnvelope.totalSigners) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Signer List */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Signers</h5>
                  <div className="space-y-3">
                    {selectedEnvelope.signers.map((signer) => (
                      <div key={signer.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                              <span className="text-xs font-medium text-gray-600">{signer.order}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{signer.name}</p>
                              <p className="text-xs text-gray-500">{signer.role}</p>
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getSignerStatusColor(signer.status)}`}>
                            {signer.status}
                          </span>
                        </div>
                        
                        <div className="text-xs text-gray-500 space-y-1">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {signer.email}
                          </div>
                          {signer.sentAt && (
                            <div className="flex items-center">
                              <Send className="h-3 w-3 mr-1" />
                              Sent: {signer.sentAt.toLocaleDateString()}
                            </div>
                          )}
                          {signer.viewedAt && (
                            <div className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              Viewed: {signer.viewedAt.toLocaleDateString()}
                            </div>
                          )}
                          {signer.signedAt && (
                            <div className="flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Signed: {signer.signedAt.toLocaleDateString()}
                            </div>
                          )}
                          {signer.remindersSent > 0 && (
                            <div className="text-orange-600">
                              {signer.remindersSent} reminder(s) sent
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Timeline</h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">Created:</span>
                      <span className="ml-2 text-gray-900">{selectedEnvelope.createdAt.toLocaleDateString()}</span>
                    </div>
                    {selectedEnvelope.sentAt && (
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-600">Sent:</span>
                        <span className="ml-2 text-gray-900">{selectedEnvelope.sentAt.toLocaleDateString()}</span>
                      </div>
                    )}
                    {selectedEnvelope.completedAt && (
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-gray-600">Completed:</span>
                        <span className="ml-2 text-gray-900">{selectedEnvelope.completedAt.toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">Expires:</span>
                      <span className="ml-2 text-gray-900">{selectedEnvelope.expiresAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <Eye className="h-4 w-4" />
                    View Document
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200">
                    <Send className="h-4 w-4" />
                    Send Reminder
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <Download className="h-4 w-4" />
                    Download Signed
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No envelope selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select an envelope to view signer workflow.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Envelope Modal */}
      <CreateEnvelopeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(envelopeData) => {
          setEnvelopes(prev => [...prev, envelopeData]);
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}