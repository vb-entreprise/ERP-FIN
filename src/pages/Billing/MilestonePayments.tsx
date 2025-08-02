/**
 * Billing Milestone Payments Page
 * Author: VB Entreprise
 * 
 * Project milestone tracking with payment scheduling
 */

import React, { useState } from 'react';
import { Plus, CheckCircle, Clock, DollarSign, Calendar, Flag, AlertTriangle } from 'lucide-react';
import CreateMilestoneModal from '../../components/Modals/CreateMilestoneModal';

interface Milestone {
  id: string;
  projectName: string;
  client: string;
  title: string;
  description: string;
  dueDate: Date;
  paymentAmount: number;
  paymentPercentage: number;
  status: 'pending' | 'in-progress' | 'completed' | 'paid' | 'overdue';
  completedDate?: Date;
  paidDate?: Date;
  deliverables: string[];
  dependencies?: string[];
}

const mockMilestones: Milestone[] = [
  {
    id: '1',
    projectName: 'E-commerce Platform',
    client: 'TechCorp Solutions',
    title: 'Design Phase Completion',
    description: 'Complete UI/UX design and get client approval',
    dueDate: new Date('2024-01-25'),
    paymentAmount: 150000,
    paymentPercentage: 30,
    status: 'completed',
    completedDate: new Date('2024-01-24'),
    deliverables: ['Wireframes', 'UI Mockups', 'Design System', 'Prototype'],
    dependencies: []
  },
  {
    id: '2',
    projectName: 'E-commerce Platform',
    client: 'TechCorp Solutions',
    title: 'Frontend Development',
    description: 'Develop responsive frontend with React',
    dueDate: new Date('2024-02-15'),
    paymentAmount: 200000,
    paymentPercentage: 40,
    status: 'in-progress',
    deliverables: ['Responsive UI', 'Shopping Cart', 'User Authentication', 'Product Catalog'],
    dependencies: ['1']
  },
  {
    id: '3',
    projectName: 'Mobile App',
    client: 'Startup Innovation',
    title: 'MVP Release',
    description: 'Launch minimum viable product',
    dueDate: new Date('2024-02-01'),
    paymentAmount: 300000,
    paymentPercentage: 50,
    status: 'overdue',
    deliverables: ['iOS App', 'Android App', 'Backend API', 'Admin Panel'],
    dependencies: []
  },
  {
    id: '4',
    projectName: 'E-commerce Platform',
    client: 'TechCorp Solutions',
    title: 'Final Delivery & Launch',
    description: 'Complete testing and go live',
    dueDate: new Date('2024-03-01'),
    paymentAmount: 150000,
    paymentPercentage: 30,
    status: 'pending',
    deliverables: ['Testing Report', 'Deployment', 'Training', 'Documentation'],
    dependencies: ['2']
  }
];

export default function MilestonePayments() {
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      paid: 'bg-purple-100 text-purple-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'paid': return <DollarSign className="h-4 w-4 text-purple-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Flag className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredMilestones = statusFilter === 'all' 
    ? milestones 
    : milestones.filter(milestone => milestone.status === statusFilter);

  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(m => m.status === 'completed' || m.status === 'paid').length;
  const overdueMilestones = milestones.filter(m => m.status === 'overdue').length;
  const totalValue = milestones.reduce((sum, m) => sum + m.paymentAmount, 0);
  const earnedValue = milestones
    .filter(m => m.status === 'completed' || m.status === 'paid')
    .reduce((sum, m) => sum + m.paymentAmount, 0);

  const handleCreateMilestone = (milestoneData: any) => {
    const newMilestone: Milestone = {
      id: milestoneData.id,
      projectName: milestoneData.projectName,
      client: milestoneData.client,
      title: milestoneData.title,
      description: milestoneData.description,
      dueDate: milestoneData.dueDate,
      paymentAmount: milestoneData.paymentAmount,
      paymentPercentage: milestoneData.paymentPercentage,
      status: milestoneData.status,
      deliverables: milestoneData.deliverables,
      dependencies: milestoneData.dependencies
    };
    
    setMilestones(prev => [...prev, newMilestone]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Milestone Payments</h1>
          <p className="mt-2 text-gray-600">
            Track project milestones with deliverables and payment scheduling.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Milestone
          </button>
        </div>
      </div>

      {/* Milestone Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Flag className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Milestones</p>
              <p className="text-2xl font-bold text-gray-900">{totalMilestones}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedMilestones}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{overdueMilestones}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Earned Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{earnedValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Milestones List */}
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
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Milestones Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Milestone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMilestones.map((milestone) => {
                    const daysUntilDue = getDaysUntilDue(milestone.dueDate);
                    return (
                      <tr 
                        key={milestone.id} 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                          selectedMilestone?.id === milestone.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedMilestone(milestone)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{milestone.title}</div>
                            <div className="text-sm text-gray-500">{milestone.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">{milestone.projectName}</div>
                            <div className="text-sm text-gray-500">{milestone.client}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(milestone.status)}
                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(milestone.status)}`}>
                              {milestone.status.replace('-', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">₹{milestone.paymentAmount.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{milestone.paymentPercentage}% of project</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{milestone.dueDate.toLocaleDateString()}</div>
                          {milestone.status !== 'completed' && milestone.status !== 'paid' && (
                            <div className={`text-sm ${daysUntilDue < 0 ? 'text-red-600' : daysUntilDue <= 7 ? 'text-orange-600' : 'text-gray-500'}`}>
                              {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : 
                               daysUntilDue === 0 ? 'Due today' : 
                               `${daysUntilDue} days left`}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Milestone Detail Panel */}
        <div className="lg:col-span-1">
          {selectedMilestone ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Milestone Details</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Milestone Header */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedMilestone.title}</h4>
                  <p className="text-sm text-gray-600">{selectedMilestone.projectName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusIcon(selectedMilestone.status)}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedMilestone.status)}`}>
                      {selectedMilestone.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">₹{selectedMilestone.paymentAmount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{selectedMilestone.paymentPercentage}% of project value</div>
                  </div>
                </div>

                {/* Milestone Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Client:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedMilestone.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Due Date:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedMilestone.dueDate.toLocaleDateString()}</span>
                  </div>
                  {selectedMilestone.completedDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Completed:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedMilestone.completedDate.toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedMilestone.paidDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Paid:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedMilestone.paidDate.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Description</h5>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedMilestone.description}</p>
                </div>

                {/* Deliverables */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Deliverables</h5>
                  <ul className="space-y-2">
                    {selectedMilestone.deliverables.map((deliverable, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-gray-700">{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dependencies */}
                {selectedMilestone.dependencies && selectedMilestone.dependencies.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Dependencies</h5>
                    <div className="space-y-2">
                      {selectedMilestone.dependencies.map((depId, index) => {
                        const dependency = milestones.find(m => m.id === depId);
                        return dependency ? (
                          <div key={index} className="flex items-center text-sm p-2 bg-blue-50 rounded">
                            <Flag className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="text-blue-900">{dependency.title}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  {selectedMilestone.status === 'in-progress' && (
                    <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                      <CheckCircle className="h-4 w-4" />
                      Mark Complete
                    </button>
                  )}
                  {selectedMilestone.status === 'completed' && (
                    <button className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                      <DollarSign className="h-4 w-4" />
                      Generate Invoice
                    </button>
                  )}
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <Calendar className="h-4 w-4" />
                    Update Timeline
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <Flag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No milestone selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a milestone to view details.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Milestone Modal */}
      <CreateMilestoneModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMilestone}
      />
    </div>
  );
}