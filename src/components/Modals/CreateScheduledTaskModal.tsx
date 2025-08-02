import React, { useState } from 'react';
import { X, Calendar, Clock, Play, Pause, CheckCircle, AlertTriangle, Database, FileText, Mail, Users } from 'lucide-react';

interface CreateScheduledTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: any) => void;
}

export default function CreateScheduledTaskModal({ isOpen, onClose, onSubmit }: CreateScheduledTaskModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schedule: 'daily',
    cronExpression: '0 2 * * *',
    status: 'active',
    taskType: 'backup'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const scheduleTypes = [
    { 
      value: 'daily', 
      label: 'Daily', 
      description: 'Run once every day',
      example: '0 2 * * * (2:00 AM daily)'
    },
    { 
      value: 'weekly', 
      label: 'Weekly', 
      description: 'Run once every week',
      example: '0 9 * * 1 (9:00 AM Mondays)'
    },
    { 
      value: 'monthly', 
      label: 'Monthly', 
      description: 'Run once every month',
      example: '0 3 1 * * (3:00 AM 1st of month)'
    },
    { 
      value: 'custom', 
      label: 'Custom Cron', 
      description: 'Use custom cron expression',
      example: '0 */6 * * * (every 6 hours)'
    }
  ];

  const taskTypes = [
    { 
      value: 'backup', 
      label: 'Database Backup', 
      icon: <Database className="h-4 w-4" />,
      description: 'Backup database and files'
    },
    { 
      value: 'report', 
      label: 'Generate Report', 
      icon: <FileText className="h-4 w-4" />,
      description: 'Generate and send reports'
    },
    { 
      value: 'email', 
      label: 'Send Email', 
      icon: <Mail className="h-4 w-4" />,
      description: 'Send automated emails'
    },
    { 
      value: 'cleanup', 
      label: 'Data Cleanup', 
      icon: <Users className="h-4 w-4" />,
      description: 'Clean up old data and logs'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleScheduleChange = (scheduleType: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: scheduleType,
      cronExpression: scheduleType === 'daily' ? '0 2 * * *' :
                     scheduleType === 'weekly' ? '0 9 * * 1' :
                     scheduleType === 'monthly' ? '0 3 1 * *' :
                     prev.cronExpression
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Task name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Task name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.schedule === 'custom' && !formData.cronExpression.trim()) {
      newErrors.cronExpression = 'Cron expression is required for custom schedule';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const taskData = {
        id: `task-${Date.now()}`,
        ...formData,
        executions: 0,
        successRate: 100,
        nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        createdAt: new Date()
      };
      
      onSubmit(taskData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      schedule: 'daily',
      cronExpression: '0 2 * * *',
      status: 'active',
      taskType: 'backup'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]" onClick={handleClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create New Scheduled Task</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Daily Backup, Weekly Reports"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe what this task does"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Task Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Task Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {taskTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.taskType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="taskType"
                      value={type.value}
                      checked={formData.taskType === type.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <div className="flex items-center mt-0.5">
                        {type.icon}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Schedule Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Schedule Type
              </label>
              <div className="space-y-3">
                {scheduleTypes.map((schedule) => (
                  <label
                    key={schedule.value}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.schedule === schedule.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="schedule"
                      value={schedule.value}
                      checked={formData.schedule === schedule.value}
                      onChange={() => handleScheduleChange(schedule.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <div className="flex items-center mt-0.5">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{schedule.label}</div>
                        <div className="text-xs text-gray-500">{schedule.description}</div>
                        <div className="text-xs text-blue-600 font-mono">{schedule.example}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Cron Expression */}
            {formData.schedule === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cron Expression *
                </label>
                <input
                  type="text"
                  name="cronExpression"
                  value={formData.cronExpression}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${
                    errors.cronExpression ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0 2 * * *"
                />
                {errors.cronExpression && <p className="mt-1 text-sm text-red-600">{errors.cronExpression}</p>}
                <p className="mt-1 text-xs text-gray-500">
                  Format: minute hour day month day-of-week (e.g., 0 2 * * * for 2:00 AM daily)
                </p>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 