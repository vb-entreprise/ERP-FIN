/**
 * HR Timesheets & Attendance Page
 * Author: VB Entreprise
 * 
 * Time tracking with clock-in/out widget, timesheet forms,
 * project/task selection, and approval workflow
 */

import React, { useState } from 'react';
import { Plus, Clock, Play, Pause, Calendar, CheckCircle, XCircle, Edit } from 'lucide-react';
import CreateTimeEntryModal from '../../components/Modals/CreateTimeEntryModal';

interface TimeEntry {
  id: string;
  employee: string;
  date: Date;
  project: string;
  task: string;
  hours: number;
  description: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  clockIn?: Date;
  clockOut?: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

interface ClockStatus {
  isClockedIn: boolean;
  clockInTime?: Date;
  currentSession?: number; // hours
}

const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    employee: 'Sarah Johnson',
    date: new Date('2024-01-22'),
    project: 'E-commerce Platform',
    task: 'Frontend Development',
    hours: 8,
    description: 'Implemented user authentication and dashboard components',
    status: 'approved',
    clockIn: new Date('2024-01-22T09:00:00'),
    clockOut: new Date('2024-01-22T17:00:00'),
    approvedBy: 'Tech Lead',
    approvedAt: new Date('2024-01-23')
  },
  {
    id: '2',
    employee: 'Mike Chen',
    date: new Date('2024-01-22'),
    project: 'Mobile App',
    task: 'UI Design',
    hours: 6,
    description: 'Created wireframes for user onboarding flow',
    status: 'submitted',
    clockIn: new Date('2024-01-22T10:00:00'),
    clockOut: new Date('2024-01-22T16:00:00')
  },
  {
    id: '3',
    employee: 'Lisa Wong',
    date: new Date('2024-01-21'),
    project: 'Brand Identity',
    task: 'Project Management',
    hours: 7.5,
    description: 'Client meetings and project coordination',
    status: 'draft',
    clockIn: new Date('2024-01-21T09:30:00'),
    clockOut: new Date('2024-01-21T17:00:00')
  }
];

export default function Timesheets() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(mockTimeEntries);
  const [clockStatus, setClockStatus] = useState<ClockStatus>({
    isClockedIn: false,
    currentSession: 0
  });
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'submitted': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Edit className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleClockToggle = () => {
    if (clockStatus.isClockedIn) {
      // Clock out
      setClockStatus({
        isClockedIn: false,
        currentSession: 0
      });
    } else {
      // Clock in
      setClockStatus({
        isClockedIn: true,
        clockInTime: new Date(),
        currentSession: 0
      });
    }
  };

  const handleCreateTimeEntry = (timeEntryData: any) => {
    const newTimeEntry: TimeEntry = {
      id: timeEntryData.id,
      employee: timeEntryData.employee,
      date: timeEntryData.date,
      project: timeEntryData.project,
      task: timeEntryData.task,
      hours: timeEntryData.hours,
      description: timeEntryData.description,
      status: timeEntryData.status,
      clockIn: timeEntryData.clockIn,
      clockOut: timeEntryData.clockOut
    };
    
    setTimeEntries(prev => [...prev, newTimeEntry]);
    setIsCreateModalOpen(false);
  };

  const filteredEntries = statusFilter === 'all' 
    ? timeEntries 
    : timeEntries.filter(entry => entry.status === statusFilter);

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const approvedHours = timeEntries.filter(e => e.status === 'approved').reduce((sum, entry) => sum + entry.hours, 0);
  const pendingEntries = timeEntries.filter(e => e.status === 'submitted').length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Timesheets & Attendance</h1>
          <p className="mt-2 text-gray-600">
            Track time with clock-in/out, manage timesheets, and handle approvals.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Add Time Entry
          </button>
        </div>
      </div>

      {/* Time Tracking Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">{totalHours}h</p>
              <p className="text-sm text-gray-500">This week</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Approved Hours</p>
              <p className="text-2xl font-bold text-gray-900">{approvedHours}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{pendingEntries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Play className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Utilization</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
              <p className="text-sm text-green-600 mt-1">Target: 80%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Clock In/Out Widget */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Time Clock</h3>
            </div>
            <div className="p-6 text-center">
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {clockStatus.isClockedIn ? '08:32:15' : '--:--:--'}
                </div>
                <p className="text-sm text-gray-500">
                  {clockStatus.isClockedIn ? 'Currently working' : 'Not clocked in'}
                </p>
              </div>
              
              <button
                onClick={handleClockToggle}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  clockStatus.isClockedIn
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {clockStatus.isClockedIn ? (
                  <>
                    <Pause className="h-5 w-5" />
                    Clock Out
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Clock In
                  </>
                )}
              </button>
              
              {clockStatus.isClockedIn && clockStatus.clockInTime && (
                <p className="text-sm text-gray-500 mt-3">
                  Started at {clockStatus.clockInTime.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monday:</span>
                <span className="text-sm font-medium text-gray-900">8.0h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tuesday:</span>
                <span className="text-sm font-medium text-gray-900">7.5h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Wednesday:</span>
                <span className="text-sm font-medium text-gray-900">8.0h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Thursday:</span>
                <span className="text-sm font-medium text-blue-600">In Progress</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Friday:</span>
                <span className="text-sm font-medium text-gray-400">--</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-900">Total:</span>
                  <span className="text-sm font-bold text-gray-900">23.5h</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timesheet Entries */}
        <div className="lg:col-span-2">
          {/* Filter */}
          <div className="mb-6">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Entries</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Timesheet Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project/Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEntries.map((entry) => (
                    <tr 
                      key={entry.id} 
                      className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                        selectedEntry?.id === entry.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.date.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{entry.project}</div>
                          <div className="text-sm text-gray-500">{entry.task}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entry.hours}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(entry.status)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(entry.status)}`}>
                            {entry.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.clockIn && entry.clockOut && (
                          <>
                            {entry.clockIn.toLocaleTimeString()} - {entry.clockOut.toLocaleTimeString()}
                          </>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                          {entry.status === 'submitted' && (
                            <>
                              <button className="text-green-600 hover:text-green-900 p-1 rounded">
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900 p-1 rounded">
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Entry Detail */}
          {selectedEntry && (
            <div className="mt-6 bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Time Entry Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <p className="text-sm text-gray-900">{selectedEntry.project}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task</label>
                  <p className="text-sm text-gray-900">{selectedEntry.task}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                  <p className="text-sm text-gray-900">{selectedEntry.hours}h</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(selectedEntry.status)}`}>
                    {selectedEntry.status}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-sm text-gray-900">{selectedEntry.description}</p>
              </div>
              {selectedEntry.approvedBy && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Approved By</label>
                  <p className="text-sm text-gray-900">{selectedEntry.approvedBy} on {selectedEntry.approvedAt?.toLocaleDateString()}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Time Entry Modal */}
      <CreateTimeEntryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTimeEntry}
      />
    </div>
  );
}