/**
 * Create Onboarding Modal Component
 * Author: VB Entreprise
 * 
 * Modal form for creating new onboarding processes with
 * employee details, tasks, and buddy assignment
 */

import React, { useState } from 'react';
import { X, User, Calendar, FileText, Monitor, GraduationCap, Shield, CheckCircle, Plus, Minus } from 'lucide-react';

interface CreateOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (onboardingData: any) => void;
}

export default function CreateOnboardingModal({ isOpen, onClose, onSubmit }: CreateOnboardingModalProps) {
  const [formData, setFormData] = useState({
    employeeName: '',
    position: '',
    department: '',
    startDate: '',
    assignedBuddy: '',
    tasks: [
      {
        id: '1',
        title: 'Complete Employment Forms',
        description: 'Fill out tax forms, emergency contacts, and bank details',
        category: 'hr',
        assignedTo: 'HR Team',
        dueDate: '',
        priority: 'high'
      }
    ]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const departmentOptions = [
    'Engineering',
    'Design',
    'Marketing',
    'Sales',
    'Operations',
    'Finance',
    'HR',
    'Support',
    'Other'
  ];

  const buddyOptions = [
    'Sarah Johnson',
    'Mike Chen',
    'Lisa Wong',
    'John Doe',
    'Jane Smith',
    'Alex Rodriguez',
    'Emily Davis',
    'David Wilson',
    'Not Assigned'
  ];

  const taskCategories = [
    { value: 'hr', label: 'HR', icon: <User className="h-4 w-4" />, description: 'Employment forms and HR processes' },
    { value: 'it', label: 'IT', icon: <Monitor className="h-4 w-4" />, description: 'Equipment and system setup' },
    { value: 'training', label: 'Training', icon: <GraduationCap className="h-4 w-4" />, description: 'Learning and development' },
    { value: 'security', label: 'Security', icon: <Shield className="h-4 w-4" />, description: 'Security training and access' },
    { value: 'admin', label: 'Admin', icon: <FileText className="h-4 w-4" />, description: 'Administrative tasks' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', description: 'Can be completed later' },
    { value: 'medium', label: 'Medium', description: 'Standard priority' },
    { value: 'high', label: 'High', description: 'Must be completed first' }
  ];

  const assignedToOptions = [
    'HR Team',
    'IT Team',
    'Security Team',
    'Team Lead',
    'Manager',
    'Buddy',
    'Employee'
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

  const handleTaskChange = (index: number, field: string, value: string) => {
    const newTasks = [...formData.tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setFormData(prev => ({ ...prev, tasks: newTasks }));
  };

  const addTask = () => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: '',
      description: '',
      category: 'hr',
      assignedTo: 'HR Team',
      dueDate: '',
      priority: 'medium'
    };
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
  };

  const removeTask = (index: number) => {
    if (formData.tasks.length > 1) {
      const newTasks = formData.tasks.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, tasks: newTasks }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeName.trim()) {
      newErrors.employeeName = 'Employee name is required';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    // Validate tasks
    const validTasks = formData.tasks.filter(task => 
      task.title.trim() !== '' && 
      task.description.trim() !== '' && 
      task.dueDate !== ''
    );

    if (validTasks.length === 0) {
      newErrors.tasks = 'At least one valid task is required';
    }

    // Validate individual tasks
    formData.tasks.forEach((task, index) => {
      if (!task.title.trim()) {
        newErrors[`task-${index}-title`] = 'Task title is required';
      }
      if (!task.description.trim()) {
        newErrors[`task-${index}-description`] = 'Task description is required';
      }
      if (!task.dueDate) {
        newErrors[`task-${index}-dueDate`] = 'Task due date is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const validTasks = formData.tasks.filter(task => 
        task.title.trim() !== '' && 
        task.description.trim() !== '' && 
        task.dueDate !== ''
      );
      
      const onboardingData = {
        id: `onboarding-${Date.now()}`,
        employeeName: formData.employeeName,
        position: formData.position,
        department: formData.department,
        startDate: new Date(formData.startDate),
        status: 'not-started',
        progress: 0,
        assignedBuddy: formData.assignedBuddy === 'Not Assigned' ? undefined : formData.assignedBuddy,
        tasks: validTasks.map(task => ({
          ...task,
          dueDate: new Date(task.dueDate),
          status: 'pending'
        })),
        createdAt: new Date()
      };
      
      onSubmit(onboardingData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      employeeName: '',
      position: '',
      department: '',
      startDate: '',
      assignedBuddy: '',
      tasks: [
        {
          id: '1',
          title: 'Complete Employment Forms',
          description: 'Fill out tax forms, emergency contacts, and bank details',
          category: 'hr',
          assignedTo: 'HR Team',
          dueDate: '',
          priority: 'high'
        }
      ]
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]" onClick={handleClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">New Onboarding Process</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Name *
                </label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.employeeName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Alex Johnson"
                />
                {errors.employeeName && <p className="mt-1 text-sm text-red-600">{errors.employeeName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.position ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Frontend Developer"
                />
                {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
              </div>
            </div>

            {/* Department and Start Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a department</option>
                  {departmentOptions.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>
            </div>

            {/* Buddy Assignment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Buddy
              </label>
              <select
                name="assignedBuddy"
                value={formData.assignedBuddy}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a buddy</option>
                {buddyOptions.map(buddy => (
                  <option key={buddy} value={buddy}>{buddy}</option>
                ))}
              </select>
            </div>

            {/* Tasks Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Onboarding Tasks</h3>
                <button
                  type="button"
                  onClick={addTask}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Task
                </button>
              </div>
              {errors.tasks && <p className="mt-1 text-sm text-red-600 mb-4">{errors.tasks}</p>}

              <div className="space-y-4">
                {formData.tasks.map((task, index) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">Task {index + 1}</h4>
                      {formData.tasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTask(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Task Title *
                        </label>
                        <input
                          type="text"
                          value={task.title}
                          onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`task-${index}-title`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="e.g., Complete Employment Forms"
                        />
                        {errors[`task-${index}-title`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`task-${index}-title`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={task.category}
                          onChange={(e) => handleTaskChange(index, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {taskCategories.map(category => (
                            <option key={category.value} value={category.value}>{category.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={task.description}
                        onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                        rows={2}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`task-${index}-description`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Describe what needs to be done..."
                      />
                      {errors[`task-${index}-description`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`task-${index}-description`]}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assigned To
                        </label>
                        <select
                          value={task.assignedTo}
                          onChange={(e) => handleTaskChange(index, 'assignedTo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {assignedToOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Due Date *
                        </label>
                        <input
                          type="date"
                          value={task.dueDate}
                          onChange={(e) => handleTaskChange(index, 'dueDate', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`task-${index}-dueDate`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`task-${index}-dueDate`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`task-${index}-dueDate`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority
                        </label>
                        <select
                          value={task.priority}
                          onChange={(e) => handleTaskChange(index, 'priority', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {priorityOptions.map(priority => (
                            <option key={priority.value} value={priority.value}>{priority.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                Create Onboarding
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 