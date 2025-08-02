/**
 * CRM Proposals/Quotes Page
 * Author: VB Entreprise
 * 
 * Template gallery, quote builder, and e-signature tracking
 */

import React, { useState } from 'react';
import { Plus, FileText, Edit, Send, Eye, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import CreateProposalModal from '../../components/Modals/CreateProposalModal';

interface Proposal {
  id: string;
  title: string;
  client: string;
  template: string;
  status: 'draft' | 'sent' | 'viewed' | 'signed' | 'expired';
  amount: number;
  tax: number;
  total: number;
  createdAt: Date;
  sentAt?: Date;
  viewedAt?: Date;
  signedAt?: Date;
  expiresAt: Date;
  items: ProposalItem[];
}

interface ProposalItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Template {
  id: string;
  name: string;
  type: 'standard' | 'customized' | 'service-bundle';
  description: string;
  previewImage: string;
  sections: string[];
}

const mockProposals: Proposal[] = [
  {
    id: '1',
    title: 'Website Development Proposal',
    client: 'TechCorp Solutions',
    template: 'Web Development Standard',
    status: 'viewed',
    amount: 45000,
    tax: 8100,
    total: 53100,
    createdAt: new Date('2024-01-15'),
    sentAt: new Date('2024-01-16'),
    viewedAt: new Date('2024-01-18'),
    expiresAt: new Date('2024-02-15'),
    items: [
      { id: '1', description: 'Website Design & Development', quantity: 1, rate: 35000, amount: 35000 },
      { id: '2', description: 'Content Management System', quantity: 1, rate: 10000, amount: 10000 }
    ]
  },
  {
    id: '2',
    title: 'Mobile App Development Quote',
    client: 'Startup Innovation',
    template: 'Mobile App Bundle',
    status: 'sent',
    amount: 85000,
    tax: 15300,
    total: 100300,
    createdAt: new Date('2024-01-20'),
    sentAt: new Date('2024-01-22'),
    expiresAt: new Date('2024-02-22'),
    items: [
      { id: '3', description: 'iOS App Development', quantity: 1, rate: 40000, amount: 40000 },
      { id: '4', description: 'Android App Development', quantity: 1, rate: 35000, amount: 35000 },
      { id: '5', description: 'Backend API Development', quantity: 1, rate: 10000, amount: 10000 }
    ]
  }
];

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Web Development Standard',
    type: 'standard',
    description: 'Standard template for website development projects',
    previewImage: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=300',
    sections: ['Project Overview', 'Scope of Work', 'Timeline', 'Investment', 'Terms & Conditions']
  },
  {
    id: '2',
    name: 'Mobile App Bundle',
    type: 'service-bundle',
    description: 'Comprehensive mobile app development package',
    previewImage: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=300',
    sections: ['App Concept', 'Technical Specifications', 'Development Phases', 'Pricing', 'Support & Maintenance']
  },
  {
    id: '3',
    name: 'Custom Enterprise Solution',
    type: 'customized',
    description: 'Tailored template for enterprise clients',
    previewImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300',
    sections: ['Executive Summary', 'Solution Architecture', 'Implementation Plan', 'Investment & ROI', 'Partnership Terms']
  }
];

export default function Proposals() {
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [templates] = useState<Template[]>(mockTemplates);
  const [activeTab, setActiveTab] = useState<'proposals' | 'templates'>('proposals');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      viewed: 'bg-yellow-100 text-yellow-800',
      signed: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      case 'viewed': return <Eye className="h-4 w-4" />;
      case 'signed': return <CheckCircle className="h-4 w-4" />;
      case 'expired': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      standard: 'bg-blue-100 text-blue-800',
      customized: 'bg-purple-100 text-purple-800',
      'service-bundle': 'bg-green-100 text-green-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDaysUntilExpiry = (expiryDate: Date) => {
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCreateProposal = (proposalData: any) => {
    const newProposal: Proposal = {
      ...proposalData,
      id: proposalData.id
    };
    
    setProposals(prev => [newProposal, ...prev]);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Proposals & Quotes</h1>
          <p className="mt-2 text-gray-600">
            Create professional proposals, track client engagement, and manage e-signatures.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Proposal
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('proposals')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'proposals'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active Proposals
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Template Gallery
          </button>
        </nav>
      </div>

      {activeTab === 'proposals' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Proposals List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {proposals.map((proposal) => (
                      <tr 
                        key={proposal.id} 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                          selectedProposal?.id === proposal.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedProposal(proposal)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-8 w-8 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{proposal.title}</div>
                              <div className="text-sm text-gray-500">{proposal.template}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {proposal.client}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(proposal.status)}`}>
                            {getStatusIcon(proposal.status)}
                            <span className="ml-1">{proposal.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">₹{proposal.total.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">₹{proposal.amount.toLocaleString()} + tax</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{proposal.expiresAt.toLocaleDateString()}</div>
                          <div className={`text-sm ${getDaysUntilExpiry(proposal.expiresAt) < 7 ? 'text-red-600' : 'text-gray-500'}`}>
                            {getDaysUntilExpiry(proposal.expiresAt)} days left
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded" title="View">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900 p-1 rounded" title="Send">
                              <Send className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 p-1 rounded" title="Download">
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

          {/* Proposal Details */}
          <div className="lg:col-span-1">
            {selectedProposal ? (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Proposal Details</h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Proposal Header */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{selectedProposal.title}</h4>
                    <p className="text-sm text-gray-600">{selectedProposal.client}</p>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full capitalize mt-2 ${getStatusColor(selectedProposal.status)}`}>
                      {getStatusIcon(selectedProposal.status)}
                      <span className="ml-1">{selectedProposal.status}</span>
                    </span>
                  </div>

                  {/* Financial Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">₹{selectedProposal.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax (18%):</span>
                        <span className="font-medium">₹{selectedProposal.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                        <span>Total:</span>
                        <span>₹{selectedProposal.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Timeline</h5>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <div className="text-sm">
                          <span className="text-gray-600">Created:</span>
                          <span className="ml-2 text-gray-900">{selectedProposal.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      {selectedProposal.sentAt && (
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          <div className="text-sm">
                            <span className="text-gray-600">Sent:</span>
                            <span className="ml-2 text-gray-900">{selectedProposal.sentAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}
                      {selectedProposal.viewedAt && (
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                          <div className="text-sm">
                            <span className="text-gray-600">Viewed:</span>
                            <span className="ml-2 text-gray-900">{selectedProposal.viewedAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        <div className="text-sm">
                          <span className="text-gray-600">Expires:</span>
                          <span className="ml-2 text-gray-900">{selectedProposal.expiresAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Line Items</h5>
                    <div className="space-y-2">
                      {selectedProposal.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-gray-900">{item.description}</p>
                            <p className="text-gray-500">{item.quantity} × ₹{item.rate.toLocaleString()}</p>
                          </div>
                          <span className="font-medium text-gray-900">₹{item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <Eye className="h-4 w-4" />
                      View Proposal
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                      <Send className="h-4 w-4" />
                      Send to Client
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Download className="h-4 w-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <div className="text-center text-gray-500">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No proposal selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a proposal to view details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Template Gallery */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src={template.previewImage} 
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(template.type)}`}>
                    {template.type.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Sections Included:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {template.sections.map((section, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                        {section}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                    Use Template
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Proposal Modal */}
      <CreateProposalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProposal}
      />
    </div>
  );
}