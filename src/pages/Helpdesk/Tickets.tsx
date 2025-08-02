/**
 * Helpdesk Ticketing Queue Page
 * Author: VB Entreprise
 * 
 * Support ticket management with priority views, SLA tracking,
 * conversation threads, and assignment workflows
 */

import React, { useState } from 'react';
import { Plus, Filter, Search, MessageSquare, Clock, User, AlertTriangle, CheckCircle, Paperclip, Send } from 'lucide-react';
import CreateTicketModal from '../../components/Modals/CreateTicketModal';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed';
  assignee?: string;
  requester: string;
  requesterEmail: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  slaStatus: 'on-track' | 'at-risk' | 'breached';
  tags: string[];
  attachments: number;
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  author: string;
  message: string;
  timestamp: Date;
  isInternal: boolean;
  attachments?: string[];
}

const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'Website loading slowly',
    description: 'The website has been loading very slowly for the past few days. Pages take 10+ seconds to load.',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Sarah Johnson',
    requester: 'John Smith',
    requesterEmail: 'john@techcorp.com',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
    dueDate: new Date('2024-01-24'),
    slaStatus: 'on-track',
    tags: ['website', 'performance'],
    attachments: 2,
    responses: [
      {
        id: '1',
        author: 'John Smith',
        message: 'The website has been loading very slowly for the past few days. Pages take 10+ seconds to load.',
        timestamp: new Date('2024-01-20'),
        isInternal: false
      },
      {
        id: '2',
        author: 'Sarah Johnson',
        message: 'Thank you for reporting this. I\'ve started investigating the performance issues. Can you please share which specific pages are affected?',
        timestamp: new Date('2024-01-21'),
        isInternal: false
      },
      {
        id: '3',
        author: 'Sarah Johnson',
        message: 'Internal note: Checked server logs, seeing high database query times. Need to optimize queries.',
        timestamp: new Date('2024-01-22'),
        isInternal: true
      }
    ]
  },
  {
    id: 'TKT-002',
    subject: 'Cannot access admin panel',
    description: 'Getting 403 error when trying to access the admin panel.',
    priority: 'urgent',
    status: 'open',
    requester: 'Emily Davis',
    requesterEmail: 'emily@startup.io',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    dueDate: new Date('2024-01-22'),
    slaStatus: 'at-risk',
    tags: ['access', 'admin'],
    attachments: 1,
    responses: [
      {
        id: '4',
        author: 'Emily Davis',
        message: 'Getting 403 error when trying to access the admin panel. This is urgent as I need to update content.',
        timestamp: new Date('2024-01-22'),
        isInternal: false
      }
    ]
  }
];

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newResponse, setNewResponse] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      pending: 'bg-purple-100 text-purple-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSlaStatusColor = (slaStatus: string) => {
    const colors = {
      'on-track': 'text-green-600',
      'at-risk': 'text-yellow-600',
      'breached': 'text-red-600'
    };
    return colors[slaStatus as keyof typeof colors] || 'text-gray-600';
  };

  const getSlaIcon = (slaStatus: string) => {
    switch (slaStatus) {
      case 'on-track': return <CheckCircle className="h-4 w-4" />;
      case 'at-risk': return <Clock className="h-4 w-4" />;
      case 'breached': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.requester.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPriority && matchesStatus && matchesSearch;
  });

  const handleSendResponse = () => {
    if (newResponse.trim() && selectedTicket) {
      // In a real app, this would send the response
      console.log('Sending response:', newResponse);
      setNewResponse('');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Ticketing Queue</h1>
          <p className="mt-2 text-gray-600">
            Manage support tickets with priority views, SLA tracking, and conversation threads.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Ticket
          </button>
        </div>
      </div>

      {/* Ticket Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{tickets.filter(t => t.status === 'open').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{tickets.filter(t => t.status === 'in-progress').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">SLA Breached</p>
              <p className="text-2xl font-bold text-gray-900">{tickets.filter(t => t.slaStatus === 'breached').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">2.4h</p>
              <p className="text-sm text-green-600 mt-1">Within SLA</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tickets List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Tickets Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTickets.map((ticket) => (
                    <tr 
                      key={ticket.id} 
                      className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                        selectedTicket?.id === ticket.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{ticket.id}</div>
                          <div className="text-sm text-gray-500">{ticket.subject}</div>
                          <div className="text-xs text-gray-400">{ticket.requester}</div>
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
                        {ticket.assignee || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center ${getSlaStatusColor(ticket.slaStatus)}`}>
                          {getSlaIcon(ticket.slaStatus)}
                          <span className="ml-1 text-xs capitalize">{ticket.slaStatus.replace('-', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ticket.updatedAt.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Ticket Detail Panel */}
        <div className="lg:col-span-1">
          {selectedTicket ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{selectedTicket.id}</h3>
                <p className="text-sm text-gray-600">{selectedTicket.subject}</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Ticket Info */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Priority:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Assignee:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedTicket.assignee || 'Unassigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Due Date:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedTicket.dueDate.toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Conversation Thread */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Conversation</h5>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedTicket.responses.map((response) => (
                      <div key={response.id} className={`p-3 rounded-lg ${response.isInternal ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{response.author}</span>
                          <span className="text-xs text-gray-500">{response.timestamp.toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-700">{response.message}</p>
                        {response.isInternal && (
                          <span className="inline-flex px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full mt-2">
                            Internal Note
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Response Form */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Add Response</h5>
                  <div className="space-y-3">
                    <textarea
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Type your response..."
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={handleSendResponse}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        <Send className="h-4 w-4" />
                        Send
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <Paperclip className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No ticket selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a ticket to view conversation thread.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(ticketData) => {
          setTickets(prev => [...prev, ticketData]);
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}