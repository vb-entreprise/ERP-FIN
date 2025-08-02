/**
 * Quality Document Approvals Page
 * Author: VB Entreprise
 * 
 * Document approval workflow with version control and sign-off tracking
 */

import React, { useState } from 'react';
import { Plus, FileText, CheckCircle, XCircle, Clock, User, Calendar, MessageSquare } from 'lucide-react';
import CreateApprovalModal from '../../components/Modals/CreateApprovalModal';

interface DocumentApproval {
  id: string;
  documentName: string;
  version: string;
  submittedBy: string;
  submittedAt: Date;
  approvers: Approver[];
  status: 'pending' | 'approved' | 'rejected' | 'revision-required';
  dueDate: Date;
  comments: Comment[];
}

interface Approver {
  id: string;
  name: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: Date;
  comments?: string;
}

interface Comment {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  type: 'comment' | 'approval' | 'rejection';
}

const mockApprovals: DocumentApproval[] = [
  {
    id: '1',
    documentName: 'Privacy Policy Update',
    version: 'v2.1',
    submittedBy: 'Legal Team',
    submittedAt: new Date('2024-01-20'),
    status: 'pending',
    dueDate: new Date('2024-01-25'),
    approvers: [
      { id: '1', name: 'Legal Director', role: 'Legal', status: 'approved', approvedAt: new Date('2024-01-21') },
      { id: '2', name: 'Compliance Officer', role: 'Compliance', status: 'pending' },
      { id: '3', name: 'CEO', role: 'Executive', status: 'pending' }
    ],
    comments: [
      {
        id: '1',
        user: 'Legal Director',
        message: 'GDPR compliance sections look good. Approved.',
        timestamp: new Date('2024-01-21'),
        type: 'approval'
      }
    ]
  },
  {
    id: '2',
    documentName: 'Employee Handbook',
    version: 'v3.0',
    submittedBy: 'HR Team',
    submittedAt: new Date('2024-01-18'),
    status: 'revision-required',
    dueDate: new Date('2024-01-23'),
    approvers: [
      { id: '4', name: 'HR Director', role: 'HR', status: 'approved', approvedAt: new Date('2024-01-19') },
      { id: '5', name: 'Legal Director', role: 'Legal', status: 'rejected', approvedAt: new Date('2024-01-20'), comments: 'Remote work policy needs clarification' }
    ],
    comments: [
      {
        id: '2',
        user: 'Legal Director',
        message: 'Remote work policy section needs more specific guidelines.',
        timestamp: new Date('2024-01-20'),
        type: 'rejection'
      }
    ]
  }
];

const mockApprovers = [
  { id: '1', name: 'Legal Director', role: 'Legal' },
  { id: '2', name: 'Compliance Officer', role: 'Compliance' },
  { id: '3', name: 'CEO', role: 'Executive' },
  { id: '4', name: 'HR Director', role: 'HR' },
  { id: '5', name: 'Finance Director', role: 'Finance' }
];

export default function DocumentApprovals() {
  const [approvals] = useState<DocumentApproval[]>(mockApprovals);
  const [selectedApproval, setSelectedApproval] = useState<DocumentApproval | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      'revision-required': 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getApproverStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getCommentTypeColor = (type: string) => {
    const colors = {
      comment: 'bg-blue-50 border-blue-200',
      approval: 'bg-green-50 border-green-200',
      rejection: 'bg-red-50 border-red-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-50 border-gray-200';
  };

  const filteredApprovals = statusFilter === 'all' 
    ? approvals 
    : approvals.filter(approval => approval.status === statusFilter);

  const pendingApprovals = approvals.filter(a => a.status === 'pending').length;
  const overdueApprovals = approvals.filter(a => {
    const today = new Date();
    return a.dueDate < today && a.status === 'pending';
  }).length;

  const handleCreateApproval = (data: any) => {
    // In a real application, this would submit to an API
    console.log('Creating new approval:', data);
    
    // Add the new approval to the list
    const newApproval: DocumentApproval = {
      id: `approval-${Date.now()}`,
      documentName: data.documentName,
      version: data.version,
      submittedBy: 'Current User',
      submittedAt: new Date(),
      status: 'pending',
      dueDate: data.dueDate,
      approvers: data.approvers.map((approverId: string) => {
        const approver = mockApprovers.find(a => a.id === approverId);
        return {
          id: approverId,
          name: approver?.name || 'Unknown',
          role: approver?.role || 'Unknown',
          status: 'pending'
        };
      }),
      comments: []
    };
    
    // In a real app, you would update the state here
    console.log('New approval created:', newApproval);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Document Approvals</h1>
          <p className="mt-2 text-gray-600">
            Manage document approval workflows with version control and sign-off tracking.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Submit for Approval
          </button>
        </div>
      </div>

      {/* Approval Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Approvals</p>
              <p className="text-2xl font-bold text-gray-900">{approvals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingApprovals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvals.filter(a => a.status === 'approved').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{overdueApprovals}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Approvals List */}
        <div className="lg:col-span-2">
          {/* Filter */}
          <div className="mb-6">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="revision-required">Revision Required</option>
            </select>
          </div>

          {/* Approvals Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApprovals.map((approval) => (
                    <tr 
                      key={approval.id} 
                      className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                        selectedApproval?.id === approval.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedApproval(approval)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{approval.documentName}</div>
                          <div className="text-sm text-gray-500">{approval.version}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {approval.submittedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(approval.status)}`}>
                          {approval.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {approval.approvers.filter(a => a.status === 'approved').length}/{approval.approvers.length} approved
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(approval.approvers.filter(a => a.status === 'approved').length / approval.approvers.length) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {approval.dueDate.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Approval Detail Panel */}
        <div className="lg:col-span-1">
          {selectedApproval ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Approval Details</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Document Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedApproval.documentName}</h4>
                  <p className="text-sm text-gray-600">{selectedApproval.version}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(selectedApproval.status)}`}>
                    {selectedApproval.status.replace('-', ' ')}
                  </span>
                </div>

                {/* Submission Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Submitted by:</span>
                    <span className="font-medium text-gray-900">{selectedApproval.submittedBy}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Submitted:</span>
                    <span className="font-medium text-gray-900">{selectedApproval.submittedAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Due:</span>
                    <span className="font-medium text-gray-900">{selectedApproval.dueDate.toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Approvers */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Approvers</h5>
                  <div className="space-y-3">
                    {selectedApproval.approvers.map((approver) => (
                      <div key={approver.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          {getApproverStatusIcon(approver.status)}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{approver.name}</div>
                            <div className="text-sm text-gray-500">{approver.role}</div>
                          </div>
                        </div>
                        {approver.approvedAt && (
                          <div className="text-xs text-gray-500">
                            {approver.approvedAt.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Comments</h5>
                  <div className="space-y-3">
                    {selectedApproval.comments.map((comment) => (
                      <div key={comment.id} className={`p-3 rounded-lg border ${getCommentTypeColor(comment.type)}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{comment.user}</span>
                          <span className="text-xs text-gray-500">{comment.timestamp.toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No approval selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a document approval to view details.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Approval Modal */}
      <CreateApprovalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateApproval}
      />
    </div>
  );
}