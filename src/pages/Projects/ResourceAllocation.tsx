/**
 * Resource Allocation Page
 * Author: VB Entreprise
 * 
 * Heatmap calendar, skills matching, and drag-and-drop assignments
 */

import React, { useState } from 'react';
import { Users, Calendar, Filter, User, Clock, Star, AlertTriangle } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  role: string;
  skills: string[];
  capacity: number; // hours per week
  utilization: number; // percentage
  avatar: string;
  assignments: Assignment[];
}

interface Assignment {
  id: string;
  project: string;
  task: string;
  hours: number;
  startDate: Date;
  endDate: Date;
}

const mockResources: Resource[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Senior Developer',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    capacity: 40,
    utilization: 85,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    assignments: [
      {
        id: '1',
        project: 'E-commerce Platform',
        task: 'Frontend Development',
        hours: 20,
        startDate: new Date('2024-01-22'),
        endDate: new Date('2024-01-26')
      },
      {
        id: '2',
        project: 'Mobile App',
        task: 'API Integration',
        hours: 14,
        startDate: new Date('2024-01-29'),
        endDate: new Date('2024-02-02')
      }
    ]
  },
  {
    id: '2',
    name: 'Mike Chen',
    role: 'UI/UX Designer',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    capacity: 40,
    utilization: 70,
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    assignments: [
      {
        id: '3',
        project: 'Brand Identity',
        task: 'Logo Design',
        hours: 16,
        startDate: new Date('2024-01-22'),
        endDate: new Date('2024-01-26')
      }
    ]
  },
  {
    id: '3',
    name: 'Lisa Wong',
    role: 'Project Manager',
    skills: ['Agile', 'Scrum', 'Risk Management', 'Stakeholder Management'],
    capacity: 40,
    utilization: 95,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    assignments: [
      {
        id: '4',
        project: 'E-commerce Platform',
        task: 'Project Coordination',
        hours: 25,
        startDate: new Date('2024-01-22'),
        endDate: new Date('2024-01-26')
      },
      {
        id: '5',
        project: 'Mobile App',
        task: 'Sprint Planning',
        hours: 13,
        startDate: new Date('2024-01-29'),
        endDate: new Date('2024-02-02')
      }
    ]
  }
];

export default function ResourceAllocation() {
  const [resources] = useState<Resource[]>(mockResources);
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'bg-red-500';
    if (utilization >= 75) return 'bg-yellow-500';
    if (utilization >= 50) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getUtilizationStatus = (utilization: number) => {
    if (utilization >= 90) return { status: 'Overbooked', color: 'text-red-600', icon: AlertTriangle };
    if (utilization >= 75) return { status: 'Fully Booked', color: 'text-yellow-600', icon: Clock };
    if (utilization >= 50) return { status: 'Available', color: 'text-green-600', icon: User };
    return { status: 'Under-utilized', color: 'text-blue-600', icon: User };
  };

  const getAllSkills = () => {
    const skills = new Set<string>();
    resources.forEach(resource => {
      resource.skills.forEach(skill => skills.add(skill));
    });
    return Array.from(skills);
  };

  const filteredResources = selectedSkill === 'all' 
    ? resources 
    : resources.filter(resource => resource.skills.includes(selectedSkill));

  const generateWeekDays = () => {
    const days = [];
    const startDate = new Date('2024-01-22'); // Monday
    for (let i = 0; i < 14; i++) { // 2 weeks
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = generateWeekDays();

  const getAssignmentForDay = (resource: Resource, date: Date) => {
    return resource.assignments.find(assignment => {
      const assignmentStart = new Date(assignment.startDate);
      const assignmentEnd = new Date(assignment.endDate);
      return date >= assignmentStart && date <= assignmentEnd;
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Resource Allocation</h1>
          <p className="mt-2 text-gray-600">
            Manage team capacity, match skills to tasks, and optimize resource utilization.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            <option value="all">All Skills</option>
            {getAllSkills().map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Resource Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {filteredResources.map((resource) => {
          const status = getUtilizationStatus(resource.utilization);
          const StatusIcon = status.icon;
          
          return (
            <div
              key={resource.id}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => setSelectedResource(resource)}
            >
              <div className="flex items-center mb-4">
                <img
                  className="h-12 w-12 rounded-full mr-4"
                  src={resource.avatar}
                  alt={resource.name}
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{resource.name}</h3>
                  <p className="text-sm text-gray-500">{resource.role}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Utilization</span>
                  <div className="flex items-center">
                    <StatusIcon className={`h-4 w-4 mr-1 ${status.color}`} />
                    <span className={`text-sm font-medium ${status.color}`}>
                      {resource.utilization}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getUtilizationColor(resource.utilization)}`}
                    style={{ width: `${Math.min(resource.utilization, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {resource.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      <Star className="h-3 w-3 mr-1" />
                      {skill}
                    </span>
                  ))}
                  {resource.skills.length > 4 && (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      +{resource.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium text-gray-900">{resource.capacity}h/week</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Assignments:</span>
                  <span className="font-medium text-gray-900">{resource.assignments.length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap Calendar */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Resource Heatmap Calendar</h3>
          <p className="text-sm text-gray-600">2-week view showing team allocation and availability</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Resource
                </th>
                {weekDays.map((day, index) => (
                  <th key={index} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div>{day.getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-8 w-8 rounded-full mr-3"
                        src={resource.avatar}
                        alt={resource.name}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                        <div className="text-sm text-gray-500">{resource.role}</div>
                      </div>
                    </div>
                  </td>
                  {weekDays.map((day, dayIndex) => {
                    const assignment = getAssignmentForDay(resource, day);
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                    
                    return (
                      <td key={dayIndex} className="px-3 py-4 text-center">
                        <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center text-xs font-medium ${
                          isWeekend 
                            ? 'bg-gray-100 text-gray-400' 
                            : assignment 
                              ? `${getUtilizationColor(resource.utilization)} text-white`
                              : 'bg-green-100 text-green-800 border-2 border-dashed border-green-300'
                        }`}>
                          {isWeekend ? 'OFF' : assignment ? assignment.hours + 'h' : 'FREE'}
                        </div>
                        {assignment && (
                          <div className="text-xs text-gray-600 mt-1 truncate">
                            {assignment.project}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedResource(null)}></div>
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full mr-4"
                    src={selectedResource.avatar}
                    alt={selectedResource.name}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedResource.name}</h3>
                    <p className="text-sm text-gray-500">{selectedResource.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Capacity & Utilization</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Weekly Capacity:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedResource.capacity}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current Utilization:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedResource.utilization}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Available Hours:</span>
                        <span className="text-sm font-medium text-green-600">
                          {Math.max(0, selectedResource.capacity - (selectedResource.capacity * selectedResource.utilization / 100))}h
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Skills & Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedResource.skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          <Star className="h-3 w-3 mr-1" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Current Assignments</h4>
                  <div className="space-y-3">
                    {selectedResource.assignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{assignment.project}</p>
                          <p className="text-sm text-gray-600">{assignment.task}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{assignment.hours}h</p>
                          <p className="text-xs text-gray-500">
                            {assignment.startDate.toLocaleDateString()} - {assignment.endDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedResource(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Assign Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Calendar Legend</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border-2 border-dashed border-green-300 rounded mr-2" />
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2" />
            <span className="text-sm text-gray-600">Under-utilized (&lt;50%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2" />
            <span className="text-sm text-gray-600">Optimal (50-75%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2" />
            <span className="text-sm text-gray-600">Fully Booked (75-90%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2" />
            <span className="text-sm text-gray-600">Overbooked (90%+)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100 rounded mr-2" />
            <span className="text-sm text-gray-600">Weekend</span>
          </div>
        </div>
      </div>
    </div>
  );
}