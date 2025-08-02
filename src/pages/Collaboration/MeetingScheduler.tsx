/**
 * Collaboration Meeting Scheduler Page
 * Author: VB Entreprise
 * 
 * Meeting scheduling with calendar integration and availability
 */

import React, { useState } from 'react';
import { Plus, Calendar, Clock, Users, Video, MapPin, Bell } from 'lucide-react';
import CreateMeetingModal from '../../components/Modals/CreateMeetingModal';

interface Meeting {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  attendees: string[];
  location: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  organizer: string;
}

const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Project Kickoff - TechCorp',
    description: 'Initial project planning and requirements gathering',
    startTime: new Date('2024-01-23T10:00:00'),
    endTime: new Date('2024-01-23T11:00:00'),
    attendees: ['Sarah Johnson', 'Mike Chen', 'Client Team'],
    location: 'Conference Room A',
    type: 'in-person',
    status: 'scheduled',
    organizer: 'Sarah Johnson'
  },
  {
    id: '2',
    title: 'Weekly Team Standup',
    description: 'Weekly progress update and planning',
    startTime: new Date('2024-01-22T09:00:00'),
    endTime: new Date('2024-01-22T09:30:00'),
    attendees: ['Development Team'],
    location: 'Zoom Meeting',
    type: 'video',
    status: 'completed',
    organizer: 'Tech Lead'
  }
];

export default function MeetingScheduler() {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Clock className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const todaysMeetings = meetings.filter(meeting => {
    const today = new Date();
    return meeting.startTime.toDateString() === today.toDateString();
  });

  const upcomingMeetings = meetings.filter(meeting => {
    const today = new Date();
    return meeting.startTime > today && meeting.status === 'scheduled';
  });

  const handleCreateMeeting = (meetingData: any) => {
    const newMeeting: Meeting = {
      id: meetingData.id,
      title: meetingData.title,
      description: meetingData.description,
      startTime: meetingData.startTime,
      endTime: meetingData.endTime,
      attendees: meetingData.attendees,
      location: meetingData.location,
      type: meetingData.type,
      status: meetingData.status,
      organizer: meetingData.organizer
    };
    
    setMeetings(prev => [...prev, newMeeting]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Meeting Scheduler</h1>
          <p className="mt-2 text-gray-600">
            Schedule meetings with calendar integration and availability checking.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Schedule Meeting
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Today's Meetings</p>
              <p className="text-2xl font-bold text-gray-900">{todaysMeetings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingMeetings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Attendees</p>
              <p className="text-2xl font-bold text-gray-900">
                {meetings.reduce((sum, meeting) => sum + meeting.attendees.length, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Meeting Calendar</h3>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Calendar Integration</h3>
                <p className="mt-1 text-sm text-gray-500">Interactive calendar view with meeting scheduling.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h3>
            </div>
            <div className="p-6 space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{meeting.title}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(meeting.status)}`}>
                      {meeting.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {meeting.startTime.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      {getTypeIcon(meeting.type)}
                      <span className="ml-2">{meeting.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {meeting.attendees.length} attendees
                    </div>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                      Join
                    </button>
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50">
                      <Bell className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Meeting Modal */}
      <CreateMeetingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMeeting}
      />
    </div>
  );
}