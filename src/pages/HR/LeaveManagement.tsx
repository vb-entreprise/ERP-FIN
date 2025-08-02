/**
 * HR Leave & Shift Scheduling Page
 * Author: VB Entreprise
 * 
 * Calendar view for leave requests, approval workflow,
 * and shift scheduling with backup coverage
 */

import React, { useState } from 'react';
import { Plus, Calendar, CheckCircle, XCircle, Clock, User, AlertTriangle } from 'lucide-react';
import CreateLeaveRequestModal from '../../components/Modals/CreateLeaveRequestModal';

interface LeaveRequest {
  id: string;
  employee: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'emergency';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approver?: string;
  approvedAt?: Date;
  backupCoverage?: string;
  comments?: string;
}

interface ShiftSchedule {
  id: string;
  employee: string;
  date: Date;
  shift: 'morning' | 'afternoon' | 'night';
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'absent';
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employee: 'Sarah Johnson',
    type: 'vacation',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-02-19'),
    days: 5,
    reason: 'Family vacation',
    status: 'pending',
    backupCoverage: 'Mike Chen'
  },
  {
    id: '2',
    employee: 'Lisa Wong',
    type: 'sick',
    startDate: new Date('2024-01-22'),
    endDate: new Date('2024-01-22'),
    days: 1,
    reason: 'Medical appointment',
    status: 'approved',
    approver: 'HR Manager',
    approvedAt: new Date('2024-01-21')
  },
  {
    id: '3',
    employee: 'Mike Chen',
    type: 'personal',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-02'),
    days: 2,
    reason: 'Personal matters',
    status: 'rejected',
    approver: 'HR Manager',
    approvedAt: new Date('2024-01-20'),
    comments: 'Insufficient notice period'
  }
];

const mockShiftSchedules: ShiftSchedule[] = [
  {
    id: '1',
    employee: 'John Doe',
    date: new Date('2024-01-22'),
    shift: 'morning',
    startTime: '09:00',
    endTime: '17:00',
    status: 'confirmed'
  },
  {
    id: '2',
    employee: 'Jane Smith',
    date: new Date('2024-01-22'),
    shift: 'afternoon',
    startTime: '13:00',
    endTime: '21:00',
    status: 'scheduled'
  }
];

export default function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [shiftSchedules] = useState<ShiftSchedule[]>(mockShiftSchedules);
  const [activeTab, setActiveTab] = useState<'requests' | 'calendar' | 'shifts'>('requests');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      vacation: 'bg-blue-100 text-blue-800',
      sick: 'bg-red-100 text-red-800',
      personal: 'bg-purple-100 text-purple-800',
      maternity: 'bg-pink-100 text-pink-800',
      emergency: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const handleCreateLeaveRequest = (leaveRequestData: any) => {
    const newLeaveRequest: LeaveRequest = {
      id: leaveRequestData.id,
      employee: leaveRequestData.employee,
      type: leaveRequestData.type,
      startDate: leaveRequestData.startDate,
      endDate: leaveRequestData.endDate,
      days: leaveRequestData.days,
      reason: leaveRequestData.reason,
      status: leaveRequestData.status,
      backupCoverage: leaveRequestData.backupCoverage,
      comments: leaveRequestData.comments
    };
    
    setLeaveRequests(prev => [...prev, newLeaveRequest]);
    setIsCreateModalOpen(false);
  };

  const pendingRequests = leaveRequests.filter(r => r.status === 'pending');
  const approvedRequests = leaveRequests.filter(r => r.status === 'approved');
  const totalDaysRequested = leaveRequests.reduce((sum, req) => sum + req.days, 0);

  const tabs = [
    { id: 'requests', name: 'Leave Requests', icon: Calendar },
    { id: 'calendar', name: 'Calendar View', icon: Calendar },
    { id: 'shifts', name: 'Shift Scheduling', icon: Clock }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Leave & Shift Scheduling</h1>
          <p className="mt-2 text-gray-600">
            Manage leave requests, approvals, and shift schedules with backup coverage.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Leave Request
          </button>
        </div>
      </div>

      {/* Leave Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedRequests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Days</p>
              <p className="text-2xl font-bold text-gray-900">{totalDaysRequested}</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <User className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Coverage Needed</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-orange-600 mt-1">Assignments pending</p>
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
      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Requests List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveRequests.map((request) => (
                      <tr 
                        key={request.id} 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                          selectedRequest?.id === request.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedRequest(request)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.employee}</div>
                          {request.backupCoverage && (
                            <div className="text-sm text-gray-500">Coverage: {request.backupCoverage}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getTypeColor(request.type)}`}>
                            {request.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.startDate.toLocaleDateString()} - {request.endDate.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.days}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(request.status)}
                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button className="text-green-600 hover:text-green-900 p-1 rounded">
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900 p-1 rounded">
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Request Detail Panel */}
          <div className="lg:col-span-1">
            {selectedRequest ? (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Request Details</h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Request Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{selectedRequest.employee}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getTypeColor(selectedRequest.type)}`}>
                        {selectedRequest.type}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </div>
                  </div>

                  {/* Leave Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Start Date:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedRequest.startDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">End Date:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedRequest.endDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Days:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedRequest.days}</span>
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Reason</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedRequest.reason}</p>
                  </div>

                  {/* Backup Coverage */}
                  {selectedRequest.backupCoverage && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Backup Coverage</h5>
                      <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <User className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm text-blue-900">{selectedRequest.backupCoverage}</span>
                      </div>
                    </div>
                  )}

                  {/* Approval Info */}
                  {selectedRequest.approver && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Approval</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Approved by:</span>
                          <span className="font-medium text-gray-900">{selectedRequest.approver}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium text-gray-900">{selectedRequest.approvedAt?.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Comments */}
                  {selectedRequest.comments && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Comments</h5>
                      <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg">{selectedRequest.comments}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {selectedRequest.status === 'pending' && (
                    <div className="space-y-2">
                      <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <div className="text-center text-gray-500">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No request selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a leave request to view details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Leave Calendar</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Calendar View</h3>
              <p className="mt-1 text-sm text-gray-500">Interactive calendar showing all leave requests and approvals.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'shifts' && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Shift Scheduling</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Shift Management</h3>
              <p className="mt-1 text-sm text-gray-500">Schedule and manage employee shifts with coverage tracking.</p>
            </div>
          </div>
        </div>
      )}

      {/* Create Leave Request Modal */}
      <CreateLeaveRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLeaveRequest}
      />
    </div>
  );
}