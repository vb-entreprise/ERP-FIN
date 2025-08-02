/**
 * Task Boards Page (Kanban/Scrum)
 * Author: VB Entreprise
 * 
 * Kanban board with drag-and-drop, card details, and team collaboration
 */

import React, { useState } from 'react';
import { Plus, Filter, User, Calendar, Tag, MessageSquare, Paperclip, Flag } from 'lucide-react';
import CreateTaskModal from '../../components/Modals/CreateTaskModal';

interface Task {
  id: string;
  title: string;
  description: string;
  assignees: string[];
  dueDate: Date;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  comments: number;
  attachments: number;
  project: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design Homepage Layout',
    description: 'Create wireframes and mockups for the new homepage design',
    assignees: ['Sarah Johnson', 'Mike Chen'],
    dueDate: new Date('2024-01-28'),
    tags: ['design', 'frontend'],
    priority: 'high',
    comments: 3,
    attachments: 2,
    project: 'E-commerce Platform'
  },
  {
    id: '2',
    title: 'API Integration',
    description: 'Integrate payment gateway API with checkout flow',
    assignees: ['John Doe'],
    dueDate: new Date('2024-01-30'),
    tags: ['backend', 'api'],
    priority: 'urgent',
    comments: 1,
    attachments: 0,
    project: 'E-commerce Platform'
  },
  {
    id: '3',
    title: 'User Testing',
    description: 'Conduct usability testing with 10 users',
    assignees: ['Lisa Wong'],
    dueDate: new Date('2024-02-05'),
    tags: ['testing', 'ux'],
    priority: 'medium',
    comments: 0,
    attachments: 1,
    project: 'Mobile App'
  }
];

const initialColumns: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    tasks: [mockTasks[0]],
    color: 'bg-gray-100'
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [mockTasks[1]],
    color: 'bg-blue-100'
  },
  {
    id: 'review',
    title: 'Review',
    tasks: [mockTasks[2]],
    color: 'bg-yellow-100'
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [],
    color: 'bg-green-100'
  }
];

export default function TaskBoards() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityIcon = (priority: string) => {
    const colors = {
      low: 'text-green-500',
      medium: 'text-yellow-500',
      high: 'text-orange-500',
      urgent: 'text-red-500'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-500';
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCreateTask = (taskData: any) => {
    const newTask: Task = {
      ...taskData,
      id: taskData.id,
      assignees: [taskData.assignee],
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : new Date(),
      comments: 0,
      attachments: 0
    };
    
    // Add the new task to the "To Do" column
    setColumns(prev => prev.map(column => {
      if (column.title === 'To Do') {
        return {
          ...column,
          tasks: [...column.tasks, newTask]
        };
      }
      return column;
    }));
  };

  // Mock projects for the task modal
  const mockProjects = [
    { id: '1', name: 'E-commerce Platform', status: 'active' },
    { id: '2', name: 'Mobile App Development', status: 'active' },
    { id: '3', name: 'Website Redesign', status: 'planning' }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Task Boards</h1>
          <p className="mt-2 text-gray-600">
            Kanban-style project management with drag-and-drop task organization.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button 
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className={`rounded-lg p-4 ${column.color} min-h-96`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-full">
                {column.tasks.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => setSelectedTask(task)}
                >
                  {/* Priority Flag */}
                  <div className="flex items-center justify-between mb-2">
                    <Flag className={`h-4 w-4 ${getPriorityIcon(task.priority)}`} />
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  {/* Task Title */}
                  <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                  
                  {/* Task Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center mb-3">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className={`text-sm ${getDaysUntilDue(task.dueDate) < 3 ? 'text-red-600' : 'text-gray-600'}`}>
                      {task.dueDate.toLocaleDateString()}
                    </span>
                  </div>

                  {/* Assignees */}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {task.assignees.slice(0, 3).map((assignee, index) => (
                        <div key={index} className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white border-2 border-white">
                          {assignee.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                      {task.assignees.length > 3 && (
                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white border-2 border-white">
                          +{task.assignees.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-400">
                      {task.comments > 0 && (
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span className="text-xs">{task.comments}</span>
                        </div>
                      )}
                      {task.attachments > 0 && (
                        <div className="flex items-center">
                          <Paperclip className="h-4 w-4 mr-1" />
                          <span className="text-xs">{task.attachments}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add Task Button */}
              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors duration-200">
                <Plus className="h-5 w-5 mx-auto mb-1" />
                <span className="text-sm">Add Task</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedTask(null)}></div>
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{selectedTask.title}</h3>
                <p className="text-sm text-gray-500">{selectedTask.project}</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{selectedTask.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Assignees</h4>
                    <div className="space-y-2">
                      {selectedTask.assignees.map((assignee, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white mr-2">
                            {assignee.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm text-gray-900">{assignee}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Priority:</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(selectedTask.priority)}`}>
                          {selectedTask.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Due Date:</span>
                        <span className="text-sm text-gray-900">{selectedTask.dueDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Comments:</span>
                        <span className="text-sm text-gray-900">{selectedTask.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Edit Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        projects={mockProjects}
      />
    </div>
  );
}