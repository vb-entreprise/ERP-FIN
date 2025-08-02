/**
 * Collaboration Activity Feed Page
 * Author: VB Entreprise
 * 
 * Real-time activity feed with notifications and updates
 */

import React, { useState } from 'react';
import { Bell, User, FileText, DollarSign, Calendar, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';

interface Activity {
  id: string;
  type: 'lead' | 'project' | 'invoice' | 'task' | 'comment' | 'approval';
  user: string;
  avatar: string;
  action: string;
  target: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'lead',
    user: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    action: 'created a new lead',
    target: 'TechCorp Solutions - Website Redesign',
    timestamp: new Date('2024-01-22T14:30:00'),
    priority: 'high',
    read: false
  },
  {
    id: '2',
    type: 'project',
    user: 'Mike Chen',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    action: 'completed milestone',
    target: 'Mobile App - Design Phase',
    timestamp: new Date('2024-01-22T13:45:00'),
    priority: 'medium',
    read: true
  },
  {
    id: '3',
    type: 'invoice',
    user: 'Finance Team',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    action: 'sent invoice',
    target: 'INV-2024-003 - ₹125,000',
    timestamp: new Date('2024-01-22T12:20:00'),
    priority: 'medium',
    read: true
  }
];

export default function ActivityFeed() {
  const [activities] = useState<Activity[]>(mockActivities);
  const [filter, setFilter] = useState<string>('all');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lead': return <User className="h-5 w-5 text-blue-600" />;
      case 'project': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'invoice': return <DollarSign className="h-5 w-5 text-purple-600" />;
      case 'task': return <Calendar className="h-5 w-5 text-orange-600" />;
      case 'comment': return <MessageSquare className="h-5 w-5 text-gray-600" />;
      case 'approval': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  const unreadCount = activities.filter(a => !a.read).length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Activity Feed</h1>
          <p className="mt-2 text-gray-600">
            Real-time updates and notifications from across the system.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">{unreadCount} unread</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {['all', 'lead', 'project', 'invoice', 'task'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 capitalize ${
                filter === filterType
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {filterType}
            </button>
          ))}
        </nav>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className={`bg-white p-6 rounded-lg border-l-4 shadow-sm border border-gray-200 ${getPriorityColor(activity.priority)} ${
              !activity.read ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <img
                    className="h-6 w-6 rounded-full"
                    src={activity.avatar}
                    alt={activity.user}
                  />
                  <span className="text-sm font-medium text-gray-900">{activity.user}</span>
                  <span className="text-sm text-gray-600">{activity.action}</span>
                  {!activity.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-1">{activity.target}</p>
                <p className="text-xs text-gray-500 mt-2">{activity.timestamp.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}