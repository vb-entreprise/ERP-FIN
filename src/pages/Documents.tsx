/**
 * Document Management Page
 * Author: VB Entreprise
 * 
 * Central document library with version control, client access permissions,
 * and organized storage for proposals, contracts, and design briefs
 */

import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Eye, Share2, Lock, Unlock, FileText, Image, Video, Archive, Calendar, User } from 'lucide-react';
import CreateDocumentModal from '../components/Modals/CreateDocumentModal';

interface Document {
  id: string;
  name: string;
  type: 'proposal' | 'contract' | 'design' | 'report' | 'other';
  size: string;
  lastModified: Date;
  version: string;
  author: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  clientAccess: boolean;
  tags: string[];
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'TechCorp Website Proposal.pdf',
    type: 'proposal',
    size: '2.4 MB',
    lastModified: new Date('2024-01-20'),
    version: 'v2.1',
    author: 'Sarah Johnson',
    status: 'approved',
    clientAccess: true,
    tags: ['website', 'proposal', 'techcorp']
  },
  {
    id: '2',
    name: 'Brand Guidelines - Startup Innovation.pdf',
    type: 'design',
    size: '8.7 MB',
    lastModified: new Date('2024-01-18'),
    version: 'v1.0',
    author: 'Mike Chen',
    status: 'review',
    clientAccess: false,
    tags: ['branding', 'guidelines', 'design']
  },
  {
    id: '3',
    name: 'Service Agreement Template.docx',
    type: 'contract',
    size: '156 KB',
    lastModified: new Date('2024-01-15'),
    version: 'v3.2',
    author: 'Legal Team',
    status: 'approved',
    clientAccess: false,
    tags: ['legal', 'template', 'contract']
  },
  {
    id: '4',
    name: 'Q1 Performance Report.xlsx',
    type: 'report',
    size: '1.2 MB',
    lastModified: new Date('2024-01-22'),
    version: 'v1.5',
    author: 'Analytics Team',
    status: 'draft',
    clientAccess: false,
    tags: ['analytics', 'quarterly', 'performance']
  }
];

const documentCategories = [
  { id: 'all', name: 'All Documents', count: 24 },
  { id: 'proposal', name: 'Proposals', count: 8 },
  { id: 'contract', name: 'Contracts', count: 6 },
  { id: 'design', name: 'Design Files', count: 5 },
  { id: 'report', name: 'Reports', count: 3 },
  { id: 'other', name: 'Other', count: 2 }
];

export default function Documents() {
  const [documents] = useState<Document[]>(mockDocuments);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateDocument = (documentData: any) => {
    console.log('New document uploaded:', documentData);
    // In a real app, this would update the documents state
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'proposal':
      case 'contract':
      case 'report':
        return FileText;
      case 'design':
        return Image;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      archived: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      proposal: 'bg-blue-100 text-blue-800',
      contract: 'bg-purple-100 text-purple-800',
      design: 'bg-pink-100 text-pink-800',
      report: 'bg-green-100 text-green-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
          <p className="mt-2 text-gray-600">
            Centralized document library with version control and client access permissions.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">247</p>
              <p className="text-sm text-green-600 mt-1">+12 this month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Share2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Shared with Clients</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-sm text-gray-500 mt-1">36% of total</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Archive className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">2.4 GB</p>
              <p className="text-sm text-gray-500 mt-1">of 10 GB plan</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Eye className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Views This Month</p>
              <p className="text-2xl font-bold text-gray-900">1,456</p>
              <p className="text-sm text-green-600 mt-1">+23% vs last month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Document Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
            </div>
            <div className="p-4">
              <nav className="space-y-2">
                {documentCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-4 space-y-3">
              <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                <div className="text-sm font-medium text-blue-900">Create Folder</div>
                <div className="text-xs text-blue-700">Organize documents</div>
              </button>
              <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
                <div className="text-sm font-medium text-green-900">Bulk Upload</div>
                <div className="text-xs text-green-700">Upload multiple files</div>
              </button>
              <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
                <div className="text-sm font-medium text-purple-900">Share Link</div>
                <div className="text-xs text-purple-700">Generate sharing links</div>
              </button>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="lg:col-span-3">
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                Filter
              </button>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm border-l border-gray-300 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>

          {/* Documents Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Access
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((document) => {
                    const FileIcon = getFileIcon(document.type);
                    return (
                      <tr key={document.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileIcon className="h-8 w-8 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{document.name}</div>
                              <div className="text-sm text-gray-500">{document.size} • {document.author}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getTypeColor(document.type)}`}>
                            {document.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(document.status)}`}>
                            {document.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {document.version}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{document.lastModified.toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">{document.lastModified.toLocaleTimeString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {document.clientAccess ? (
                            <div className="flex items-center text-green-600">
                              <Unlock className="h-4 w-4 mr-1" />
                              <span className="text-xs">Client Access</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-gray-400">
                              <Lock className="h-4 w-4 mr-1" />
                              <span className="text-xs">Internal Only</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                              <Download className="h-4 w-4" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CreateDocumentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDocument}
      />
    </div>
  );
}