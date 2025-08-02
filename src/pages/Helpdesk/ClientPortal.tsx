/**
 * Helpdesk Client Portal Page
 * Author: VB Entreprise
 * 
 * Client-facing portal for viewing tickets, project updates,
 * and self-service support with knowledge base search
 */

import React, { useState } from 'react';
import { Plus, Search, MessageSquare, FileText, User, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import CreatePortalModal from '../../components/Modals/CreatePortalModal';

interface ClientTicket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  lastUpdate: Date;
  assignee: string;
  responses: number;
}

interface ProjectUpdate {
  id: string;
  projectName: string;
  updateType: 'milestone' | 'progress' | 'issue' | 'completion';
  title: string;
  description: string;
  date: Date;
  progress: number;
}

const mockClientTickets: ClientTicket[] = [
  {
    id: 'TKT-001',
    subject: 'Website loading slowly',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date('2024-01-20'),
    lastUpdate: new Date('2024-01-22'),
    assignee: 'Sarah Johnson',
    responses: 3
  },
  {
    id: 'TKT-005',
    subject: 'Feature request: Dark mode',
    status: 'open',
    priority: 'medium',
    createdAt: new Date('2024-01-18'),
    lastUpdate: new Date('2024-01-19'),
    assignee: 'Mike Chen',
    responses: 1
  }
];

const mockProjectUpdates: ProjectUpdate[] = [
  {
    id: '1',
    projectName: 'Website Redesign',
    updateType: 'milestone',
    title: 'Design Phase Completed',
    description: 'All wireframes and mockups have been approved and we\'re moving to development.',
    date: new Date('2024-01-22'),
    progress: 45
  },
  {
    id: '2',
    projectName: 'Mobile App Development',
    updateType: 'progress',
    title: 'Backend API Development',
    description: 'Core API endpoints are 80% complete. Authentication and user management modules finished.',
    date: new Date('2024-01-20'),
    progress: 65
  },
  {
    id: '3',
    projectName: 'Website Redesign',
    updateType: 'issue',
    title: 'Third-party Integration Delay',
    description: 'Payment gateway integration is delayed by 3 days due to API changes.',
    date: new Date('2024-01-18'),
    progress: 45
  }
];

export default function ClientPortal() {
  const [tickets, setTickets] = useState<ClientTicket[]>(mockClientTickets);
  const [projectUpdates] = useState<ProjectUpdate[]>(mockProjectUpdates);
  const [activeTab, setActiveTab] = useState<'tickets' | 'projects' | 'knowledge'>('tickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getUpdateTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'progress': return <Clock className="h-5 w-5 text-blue-600" />;
      case 'issue': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'completion': return <CheckCircle className="h-5 w-5 text-purple-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const tabs = [
    { id: 'tickets', name: 'My Tickets', icon: MessageSquare },
    { id: 'projects', name: 'Project Updates', icon: FileText },
    { id: 'knowledge', name: 'Help Center', icon: Search }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Client Portal</h1>
          <p className="mt-2 text-gray-600">
            View your tickets, project updates, and access self-service support.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Support Request
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{tickets.filter(t => t.status !== 'closed').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">2.4h</p>
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
      {activeTab === 'tickets' && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">My Support Tickets</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Update</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responses</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ticket.id}</div>
                        <div className="text-sm text-gray-500">{ticket.subject}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.assignee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.lastUpdate.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.responses}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-6">
          {projectUpdates.map((update) => (
            <div key={update.id} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getUpdateTypeIcon(update.updateType)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{update.title}</h3>
                    <span className="text-sm text-gray-500">{update.date.toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{update.projectName}</p>
                  <p className="text-gray-700 mb-4">{update.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Progress:</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${update.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{update.progress}%</span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                      update.updateType === 'milestone' ? 'bg-green-100 text-green-800' :
                      update.updateType === 'progress' ? 'bg-blue-100 text-blue-800' :
                      update.updateType === 'issue' ? 'bg-orange-100 text-orange-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {update.updateType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'knowledge' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Help Articles</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="What can we help you with?"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Popular Categories */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockCategories.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors duration-200">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{category.icon}</span>
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                  <p className="text-xs text-gray-500">{category.articleCount} articles</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200">
                <MessageSquare className="h-6 w-6 text-blue-600 mb-2" />
                <h4 className="font-medium text-gray-900">Contact Support</h4>
                <p className="text-sm text-gray-600">Can't find what you're looking for? Get in touch.</p>
              </button>
              <button className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200">
                <Calendar className="h-6 w-6 text-green-600 mb-2" />
                <h4 className="font-medium text-gray-900">Schedule a Call</h4>
                <p className="text-sm text-gray-600">Book a consultation with our team.</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Portal Modal */}
      <CreatePortalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(portalData) => {
          // Handle portal creation
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}