/**
 * Create Time Entry Modal Component
 * Author: VB Entreprise
 * 
 * Modal form for creating new time entries with
 * project selection, task details, and time tracking
 */

import React, { useState } from 'react';
import { X, Clock, Calendar, Play, Pause, FileText, User } from 'lucide-react';

interface CreateTimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (timeEntryData: any) => void;
}

export default function CreateTimeEntryModal({ isOpen, onClose, onSubmit }: CreateTimeEntryModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    project: '',
    task: '',
    hours: '',
    description: '',
    clockIn: '',
    clockOut: '',
    status: 'draft'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const projectOptions = [
    'E-commerce Platform',
    'Mobile App',
    'Brand Identity',
    'Website Redesign',
    'API Development',
    'Database Migration',
    'Security Audit',
    'Training Program',
    'Other'
  ];

  const taskOptions = [
    'Frontend Development',
    'Backend Development',
    'UI Design',
    'UX Research',
    'Project Management',
    'Testing & QA',
    'Documentation',
    'Client Meeting',
    'Code Review',
    'Deployment',
    'Other'
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

  const calculateHours = () => {
    if (formData.clockIn && formData.clockOut) {
      const startTime = new Date(`2000-01-01T${formData.clockIn}`);
      const endTime = new Date(`2000-01-01T${formData.clockOut}`);
      const diffMs = endTime.getTime() - startTime.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return Math.round(diffHours * 100) / 100; // Round to 2 decimal places
    }
    return 0;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.project.trim()) {
      newErrors.project = 'Project is required';
    }

    if (!formData.task.trim()) {
      newErrors.task = 'Task is required';
    }

    if (!formData.hours || parseFloat(formData.hours) <= 0) {
      newErrors.hours = 'Hours must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Validate time entries if provided
    if (formData.clockIn && formData.clockOut) {
      const startTime = new Date(`2000-01-01T${formData.clockIn}`);
      const endTime = new Date(`2000-01-01T${formData.clockOut}`);
      
      if (endTime <= startTime) {
        newErrors.clockOut = 'End time must be after start time';
      }
    }

    // Validate that hours match clock in/out times if both are provided
    if (formData.clockIn && formData.clockOut && formData.hours) {
      const calculatedHours = calculateHours();
      const enteredHours = parseFloat(formData.hours);
      
      if (Math.abs(calculatedHours - enteredHours) > 0.1) {
        newErrors.hours = `Hours should be ${calculatedHours} based on clock in/out times`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const hours = parseFloat(formData.hours);
      
      const timeEntryData = {
        id: `entry-${Date.now()}`,
        employee: 'Current User', // This would come from auth context
        date: new Date(formData.date),
        project: formData.project,
        task: formData.task,
        hours: hours,
        description: formData.description,
        status: formData.status,
        clockIn: formData.clockIn ? new Date(`2000-01-01T${formData.clockIn}`) : undefined,
        clockOut: formData.clockOut ? new Date(`2000-01-01T${formData.clockOut}`) : undefined,
        createdAt: new Date()
      };
      
      onSubmit(timeEntryData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      project: '',
      task: '',
      hours: '',
      description: '',
      clockIn: '',
      clockOut: '',
      status: 'draft'
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
            <h2 className="text-xl font-semibold text-gray-900">Add Time Entry</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                </select>
              </div>
            </div>

            {/* Project and Task */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project *
                </label>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.project ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a project</option>
                  {projectOptions.map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
                {errors.project && <p className="mt-1 text-sm text-red-600">{errors.project}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task *
                </label>
                <select
                  name="task"
                  value={formData.task}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.task ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a task</option>
                  {taskOptions.map(task => (
                    <option key={task} value={task}>{task}</option>
                  ))}
                </select>
                {errors.task && <p className="mt-1 text-sm text-red-600">{errors.task}</p>}
              </div>
            </div>

            {/* Hours and Time Tracking */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours *
                </label>
                <input
                  type="number"
                  name="hours"
                  value={formData.hours}
                  onChange={handleInputChange}
                  min="0"
                  step="0.25"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.hours ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="8.0"
                />
                {errors.hours && <p className="mt-1 text-sm text-red-600">{errors.hours}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clock In (Optional)
                </label>
                <input
                  type="time"
                  name="clockIn"
                  value={formData.clockIn}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clock Out (Optional)
                </label>
                <input
                  type="time"
                  name="clockOut"
                  value={formData.clockOut}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.clockOut ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.clockOut && <p className="mt-1 text-sm text-red-600">{errors.clockOut}</p>}
              </div>
            </div>

            {/* Time Calculation Preview */}
            {formData.clockIn && formData.clockOut && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Time Calculation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Start Time:</span>
                    <span className="font-medium text-blue-900">{formData.clockIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">End Time:</span>
                    <span className="font-medium text-blue-900">{formData.clockOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Calculated Hours:</span>
                    <span className="font-medium text-blue-900">{calculateHours()}h</span>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the work completed, tasks performed, or activities undertaken during this time period..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
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
                Add Time Entry
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 