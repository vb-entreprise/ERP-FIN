/**
 * Documents Contracts & Templates Page
 * Author: VB Entreprise
 * 
 * Contract library with filtering, editor with merge fields,
 * and clause snippet management
 */

import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Eye, Download, Copy, FileText, Tag, Calendar, User, Building } from 'lucide-react';
import CreateContractModal from '../../components/Modals/CreateContractModal';

interface Contract {
  id: string;
  name: string;
  type: 'service-agreement' | 'nda' | 'employment' | 'vendor' | 'custom';
  status: 'draft' | 'active' | 'expired' | 'terminated';
  client: string;
  startDate: Date;
  endDate: Date;
  value: number;
  renewalDate?: Date;
  autoRenewal: boolean;
  tags: string[];
  lastModified: Date;
  createdBy: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  mergeFields: string[];
  clauses: string[];
  usageCount: number;
  lastUsed: Date;
}

interface ClauseSnippet {
  id: string;
  title: string;
  category: string;
  content: string;
  variables: string[];
  usageCount: number;
}

const mockContracts: Contract[] = [
  {
    id: '1',
    name: 'Web Development Service Agreement - TechCorp',
    type: 'service-agreement',
    status: 'active',
    client: 'TechCorp Solutions',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    value: 500000,
    renewalDate: new Date('2024-11-01'),
    autoRenewal: true,
    tags: ['web-development', 'annual', 'enterprise'],
    lastModified: new Date('2024-01-15'),
    createdBy: 'Sarah Johnson'
  },
  {
    id: '2',
    name: 'Non-Disclosure Agreement - Startup Innovation',
    type: 'nda',
    status: 'active',
    client: 'Startup Innovation',
    startDate: new Date('2024-01-10'),
    endDate: new Date('2026-01-10'),
    value: 0,
    autoRenewal: false,
    tags: ['confidentiality', 'startup'],
    lastModified: new Date('2024-01-10'),
    createdBy: 'Legal Team'
  },
  {
    id: '3',
    name: 'Vendor Agreement - Cloud Services',
    type: 'vendor',
    status: 'expired',
    client: 'CloudTech Provider',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2024-01-01'),
    value: 120000,
    autoRenewal: false,
    tags: ['vendor', 'cloud-services', 'expired'],
    lastModified: new Date('2023-12-15'),
    createdBy: 'Admin User'
  }
];

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Standard Service Agreement',
    category: 'Service Contracts',
    description: 'Comprehensive service agreement template for web development projects',
    mergeFields: ['client_name', 'project_scope', 'timeline', 'payment_terms', 'deliverables'],
    clauses: ['Payment Terms', 'Intellectual Property', 'Termination', 'Liability'],
    usageCount: 15,
    lastUsed: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Mutual NDA Template',
    category: 'Legal Documents',
    description: 'Standard mutual non-disclosure agreement for business discussions',
    mergeFields: ['party_a', 'party_b', 'effective_date', 'term_length'],
    clauses: ['Definition of Confidential Information', 'Obligations', 'Exceptions', 'Term'],
    usageCount: 8,
    lastUsed: new Date('2024-01-18')
  },
  {
    id: '3',
    name: 'Employment Contract',
    category: 'HR Documents',
    description: 'Standard employment agreement for new hires',
    mergeFields: ['employee_name', 'position', 'salary', 'start_date', 'benefits'],
    clauses: ['Job Description', 'Compensation', 'Benefits', 'Termination'],
    usageCount: 12,
    lastUsed: new Date('2024-01-22')
  }
];

const mockClauseSnippets: ClauseSnippet[] = [
  {
    id: '1',
    title: 'Payment Terms - Net 30',
    category: 'Payment',
    content: 'Payment is due within thirty (30) days of invoice date. Late payments may incur a service charge of 1.5% per month.',
    variables: ['invoice_date', 'payment_due_date'],
    usageCount: 25
  },
  {
    id: '2',
    title: 'Intellectual Property Rights',
    category: 'IP',
    content: 'All intellectual property created during the course of this agreement shall remain the property of {{client_name}} upon full payment.',
    variables: ['client_name'],
    usageCount: 18
  },
  {
    id: '3',
    title: 'Limitation of Liability',
    category: 'Legal',
    content: 'In no event shall the total liability exceed the total amount paid under this agreement.',
    variables: ['total_amount'],
    usageCount: 22
  }
];

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [templates] = useState<Template[]>(mockTemplates);
  const [clauseSnippets] = useState<ClauseSnippet[]>(mockClauseSnippets);
  const [activeTab, setActiveTab] = useState<'contracts' | 'templates' | 'clauses'>('contracts');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      terminated: 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'service-agreement': 'bg-blue-100 text-blue-800',
      'nda': 'bg-purple-100 text-purple-800',
      'employment': 'bg-green-100 text-green-800',
      'vendor': 'bg-orange-100 text-orange-800',
      'custom': 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getDaysUntilExpiry = (endDate: Date) => {
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const tabs = [
    { id: 'contracts', name: 'Contract Library', icon: FileText },
    { id: 'templates', name: 'Templates', icon: Copy },
    { id: 'clauses', name: 'Clause Snippets', icon: Edit }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Contracts & Templates</h1>
          <p className="mt-2 text-gray-600">
            Manage contract library, create templates with merge fields, and organize clause snippets.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            {activeTab === 'contracts' ? 'New Contract' : activeTab === 'templates' ? 'New Template' : 'New Clause'}
          </button>
        </div>
      </div>

      {/* Contract Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{contracts.filter(c => c.status === 'active').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Copy className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Templates</p>
              <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Edit className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Clause Snippets</p>
              <p className="text-2xl font-bold text-gray-900">{clauseSnippets.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'contracts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contracts List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contracts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="terminated">Terminated</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="service-agreement">Service Agreement</option>
                <option value="nda">NDA</option>
                <option value="employment">Employment</option>
                <option value="vendor">Vendor</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Contracts Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredContracts.map((contract) => (
                      <tr 
                        key={contract.id} 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                          selectedContract?.id === contract.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedContract(contract)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{contract.name}</div>
                            <div className="text-sm text-gray-500">{contract.client}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(contract.type)}`}>
                            {contract.type.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(contract.status)}`}>
                            {contract.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contract.value > 0 ? `₹${contract.value.toLocaleString()}` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{contract.endDate.toLocaleDateString()}</div>
                          {contract.status === 'active' && (
                            <div className={`text-sm ${getDaysUntilExpiry(contract.endDate) < 30 ? 'text-red-600' : 'text-gray-500'}`}>
                              {getDaysUntilExpiry(contract.endDate)} days left
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900 p-1 rounded">
                              <Edit className="h-4 w-4" />
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

          {/* Contract Detail Panel */}
          <div className="lg:col-span-1">
            {selectedContract ? (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Contract Details</h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Contract Header */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{selectedContract.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedContract.type)}`}>
                        {selectedContract.type.replace('-', ' ')}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(selectedContract.status)}`}>
                        {selectedContract.status}
                      </span>
                    </div>
                  </div>

                  {/* Contract Details */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Client</p>
                        <p className="text-sm font-medium text-gray-900">{selectedContract.client}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Term</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedContract.startDate.toLocaleDateString()} - {selectedContract.endDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Created By</p>
                        <p className="text-sm font-medium text-gray-900">{selectedContract.createdBy}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contract Value */}
                  {selectedContract.value > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Contract Value</p>
                      <p className="text-2xl font-bold text-green-600">₹{selectedContract.value.toLocaleString()}</p>
                    </div>
                  )}

                  {/* Renewal Info */}
                  {selectedContract.renewalDate && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Renewal Information</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Renewal Date:</span>
                          <span className="font-medium text-gray-900">{selectedContract.renewalDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Auto-Renewal:</span>
                          <span className={`font-medium ${selectedContract.autoRenewal ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedContract.autoRenewal ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedContract.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <Eye className="h-4 w-4" />
                      View Contract
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                      <Edit className="h-4 w-4" />
                      Edit Contract
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No contract selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a contract to view details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {template.category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Merge Fields:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.mergeFields.slice(0, 3).map((field, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {field}
                      </span>
                    ))}
                    {template.mergeFields.length > 3 && (
                      <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                        +{template.mergeFields.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Standard Clauses:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {template.clauses.slice(0, 3).map((clause, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                        {clause}
                      </li>
                    ))}
                    {template.clauses.length > 3 && (
                      <li className="text-gray-500">+{template.clauses.length - 3} more clauses</li>
                    )}
                  </ul>
                </div>

                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>Used {template.usageCount} times</span>
                  <span>Last used {template.lastUsed.toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                    Use Template
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'clauses' && (
        <div className="space-y-6">
          {clauseSnippets.map((clause) => (
            <div key={clause.id} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{clause.title}</h3>
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    {clause.category}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Used {clause.usageCount} times</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">{clause.content}</p>
              </div>
              
              {clause.variables.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Variables:</h4>
                  <div className="flex flex-wrap gap-2">
                    {clause.variables.map((variable, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                  Insert into Document
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                  Edit Clause
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Contract Modal */}
      <CreateContractModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(contractData) => {
          setContracts(prev => [...prev, contractData]);
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}