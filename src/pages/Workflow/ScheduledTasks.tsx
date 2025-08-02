/**
 * Workflow Scheduled Tasks Page
 * Author: VB Entreprise
 * 
 * Manage scheduled and recurring automated tasks
 */

import React, { useState } from 'react';
import { Plus, Calendar, Clock, Play, Pause, CheckCircle, AlertTriangle } from 'lucide-react';
import CreateScheduledTaskModal from '../../components/Modals/CreateScheduledTaskModal';

interface ScheduledTask {
  id: string;
  name: string;
  description: string;
  schedule: string;
  nextRun: Date;
  lastRun?: Date;
  status: 'active' | 'paused' | 'failed';
  executions: number;
  successRate: number;
}

const mockTasks: ScheduledTask[] = [
  {
    id: '1',
    name: 'Daily Backup',
    description: 'Backup database and files',
    schedule: '0 2 * * *',
    nextRun: new Date('2024-01-23T02:00:00'),
    lastRun: new Date('2024-01-22T02:00:00'),
    status: 'active',
    executions: 365,
    successRate: 99.7
  },
  {
    id: '2',
    name: 'Weekly Reports',
    description: 'Generate and send weekly reports',
    schedule: '0 9 * * 1',
    nextRun: new Date('2024-01-29T09:00:00'),
    lastRun: new Date('2024-01-22T09:00:00'),
    status: 'active',
    executions: 52,
    successRate: 96.2
  }
];

export default function ScheduledTasks() {
  const [tasks, setTasks] = useState<ScheduledTask[]>(mockTasks);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleCreateTask = (taskData: any) => {
    const newTask: ScheduledTask = {
      id: taskData.id,
      name: taskData.name,
      description: taskData.description,
      schedule: taskData.cronExpression,
      nextRun: taskData.nextRun,
      status: taskData.status,
      executions: taskData.executions,
      successRate: taskData.successRate
    };
    
    setTasks(prev => [...prev, newTask]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Scheduled Tasks</h1>
          <p className="mt-2 text-gray-600">
            Manage recurring automated tasks and schedules.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Run</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{task.name}</div>
                      <div className="text-sm text-gray-500">{task.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.schedule}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(task.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.nextRun.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.successRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900 p-1 rounded">
                      <Play className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Scheduled Task Modal */}
      <CreateScheduledTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}