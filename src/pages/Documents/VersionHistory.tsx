/**
 * Documents Version History Page
 * Author: VB Entreprise
 * 
 * Timeline view of document edits and diff viewer for comparing changes
 */

import React, { useState } from 'react';
import { Clock, User, Eye, Download, GitBranch, FileText, Edit, GitCompare as Compare, Undo } from 'lucide-react';

interface DocumentVersion {
  id: string;
  documentId: string;
  documentName: string;
  version: string;
  changeType: 'created' | 'edited' | 'reviewed' | 'approved' | 'published';
  editedBy: string;
  editedAt: Date;
  changes: Change[];
  fileSize: string;
  comment?: string;
  tags: string[];
}

interface Change {
  id: string;
  type: 'addition' | 'deletion' | 'modification';
  section: string;
  description: string;
  lineNumber?: number;
}

interface Document {
  id: string;
  name: string;
  currentVersion: string;
  totalVersions: number;
  lastModified: Date;
  status: 'draft' | 'review' | 'approved' | 'published';
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Service Agreement Template',
    currentVersion: 'v3.2',
    totalVersions: 8,
    lastModified: new Date('2024-01-22'),
    status: 'approved'
  },
  {
    id: '2',
    name: 'Privacy Policy',
    currentVersion: 'v2.1',
    totalVersions: 5,
    lastModified: new Date('2024-01-20'),
    status: 'published'
  },
  {
    id: '3',
    name: 'Employee Handbook',
    currentVersion: 'v1.5',
    totalVersions: 12,
    lastModified: new Date('2024-01-18'),
    status: 'review'
  }
];

const mockVersions: DocumentVersion[] = [
  {
    id: '1',
    documentId: '1',
    documentName: 'Service Agreement Template',
    version: 'v3.2',
    changeType: 'approved',
    editedBy: 'Legal Team',
    editedAt: new Date('2024-01-22'),
    fileSize: '245 KB',
    comment: 'Final approval after legal review',
    tags: ['approved', 'legal-review'],
    changes: [
      {
        id: '1',
        type: 'modification',
        section: 'Payment Terms',
        description: 'Updated payment schedule from Net 15 to Net 30',
        lineNumber: 45
      }
    ]
  },
  {
    id: '2',
    documentId: '1',
    documentName: 'Service Agreement Template',
    version: 'v3.1',
    changeType: 'edited',
    editedBy: 'Sarah Johnson',
    editedAt: new Date('2024-01-20'),
    fileSize: '243 KB',
    comment: 'Updated liability clauses based on client feedback',
    tags: ['client-feedback'],
    changes: [
      {
        id: '2',
        type: 'modification',
        section: 'Liability',
        description: 'Modified limitation of liability clause',
        lineNumber: 78
      },
      {
        id: '3',
        type: 'addition',
        section: 'Termination',
        description: 'Added early termination clause',
        lineNumber: 92
      }
    ]
  },
  {
    id: '3',
    documentId: '1',
    documentName: 'Service Agreement Template',
    version: 'v3.0',
    changeType: 'reviewed',
    editedBy: 'Mike Chen',
    editedAt: new Date('2024-01-18'),
    fileSize: '240 KB',
    comment: 'Major revision for 2024 compliance requirements',
    tags: ['compliance', 'major-revision'],
    changes: [
      {
        id: '4',
        type: 'addition',
        section: 'Data Protection',
        description: 'Added GDPR compliance section',
        lineNumber: 120
      },
      {
        id: '5',
        type: 'modification',
        section: 'Intellectual Property',
        description: 'Updated IP ownership terms',
        lineNumber: 65
      },
      {
        id: '6',
        type: 'deletion',
        section: 'Legacy Terms',
        description: 'Removed outdated warranty clauses',
        lineNumber: 105
      }
    ]
  }
];

export default function VersionHistory() {
  const [documents] = useState<Document[]>(mockDocuments);
  const [versions] = useState<DocumentVersion[]>(mockVersions);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(documents[0]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [showDiff, setShowDiff] = useState(false);

  const getChangeTypeColor = (type: string) => {
    const colors = {
      created: 'bg-blue-100 text-blue-800',
      edited: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      published: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'created': return <FileText className="h-4 w-4" />;
      case 'edited': return <Edit className="h-4 w-4" />;
      case 'reviewed': return <Eye className="h-4 w-4" />;
      case 'approved': return <GitBranch className="h-4 w-4" />;
      case 'published': return <Download className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      published: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'addition': return <span className="text-green-600">+</span>;
      case 'deletion': return <span className="text-red-600">-</span>;
      case 'modification': return <span className="text-blue-600">~</span>;
      default: return <span className="text-gray-600">•</span>;
    }
  };

  const filteredVersions = selectedDocument 
    ? versions.filter(version => version.documentId === selectedDocument.id)
    : [];

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      } else if (prev.length < 2) {
        return [...prev, versionId];
      } else {
        return [prev[1], versionId];
      }
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Version History</h1>
          <p className="mt-2 text-gray-600">
            Track document changes over time and compare different versions.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          {selectedVersions.length === 2 && (
            <button 
              onClick={() => setShowDiff(!showDiff)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Compare className="h-4 w-4" />
              {showDiff ? 'Hide Diff' : 'Compare Versions'}
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Document List */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {documents.map((document) => (
                  <button
                    key={document.id}
                    onClick={() => setSelectedDocument(document)}
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                      selectedDocument?.id === document.id
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">{document.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {document.currentVersion} • {document.totalVersions} versions
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(document.status)}`}>
                      {document.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Version Timeline */}
        <div className="lg:col-span-3">
          {selectedDocument ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Version History - {selectedDocument.name}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {selectedVersions.length}/2 versions selected for comparison
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {showDiff && selectedVersions.length === 2 ? (
                  /* Diff Viewer */
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-lg font-medium text-blue-900 mb-2">Version Comparison</h4>
                      <p className="text-sm text-blue-700">
                        Comparing {versions.find(v => v.id === selectedVersions[0])?.version} with {versions.find(v => v.id === selectedVersions[1])?.version}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedVersions.map((versionId, index) => {
                        const version = versions.find(v => v.id === versionId);
                        if (!version) return null;
                        
                        return (
                          <div key={versionId} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-3">
                              {version.version} - {version.editedBy}
                            </h5>
                            <div className="space-y-2">
                              {version.changes.map((change) => (
                                <div key={change.id} className="flex items-start space-x-2 text-sm">
                                  {getChangeIcon(change.type)}
                                  <div>
                                    <span className="font-medium">{change.section}:</span>
                                    <span className="ml-1 text-gray-600">{change.description}</span>
                                    {change.lineNumber && (
                                      <span className="ml-2 text-xs text-gray-400">Line {change.lineNumber}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Timeline View */
                  <div className="space-y-6">
                    {filteredVersions.map((version, index) => (
                      <div key={version.id} className="relative">
                        {/* Timeline Line */}
                        {index < filteredVersions.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                        )}
                        
                        <div className="flex items-start space-x-4">
                          {/* Timeline Dot */}
                          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            {getChangeTypeIcon(version.changeType)}
                          </div>
                          
                          {/* Version Card */}
                          <div className={`flex-1 border-2 rounded-lg p-4 transition-colors duration-200 ${
                            selectedVersions.includes(version.id)
                              ? 'border-blue-300 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <h4 className="text-lg font-medium text-gray-900">{version.version}</h4>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getChangeTypeColor(version.changeType)}`}>
                                  {version.changeType}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={selectedVersions.includes(version.id)}
                                  onChange={() => handleVersionSelect(version.id)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  disabled={!selectedVersions.includes(version.id) && selectedVersions.length >= 2}
                                />
                                <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-900 p-1 rounded">
                                  <Download className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div className="flex items-center text-sm text-gray-600">
                                <User className="h-4 w-4 mr-2" />
                                {version.editedBy}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-2" />
                                {version.editedAt.toLocaleDateString()} {version.editedAt.toLocaleTimeString()}
                              </div>
                            </div>
                            
                            {version.comment && (
                              <p className="text-sm text-gray-700 mb-3 italic">"{version.comment}"</p>
                            )}
                            
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-900">Changes:</h5>
                              {version.changes.map((change) => (
                                <div key={change.id} className="flex items-start space-x-2 text-sm">
                                  {getChangeIcon(change.type)}
                                  <div>
                                    <span className="font-medium">{change.section}:</span>
                                    <span className="ml-1 text-gray-600">{change.description}</span>
                                    {change.lineNumber && (
                                      <span className="ml-2 text-xs text-gray-400">Line {change.lineNumber}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {version.tags.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                {version.tags.map((tag, tagIndex) => (
                                  <span key={tagIndex} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <div className="mt-3 text-xs text-gray-500">
                              File size: {version.fileSize}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No document selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a document to view its version history.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}