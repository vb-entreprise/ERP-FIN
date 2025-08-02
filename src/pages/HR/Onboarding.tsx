/**
 * HR Onboarding/Offboarding Page
 * Author: VB Entreprise
 * 
 * Checklist management for new hires with IT setup, training,
 * HR forms, and automated triggers for notifications
 */

import React, { useState } from 'react';
import { Plus, CheckCircle, Clock, User, AlertTriangle, FileText, Monitor, GraduationCap, Shield } from 'lucide-react';
import CreateOnboardingModal from '../../components/Modals/CreateOnboardingModal';

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  category: 'hr' | 'it' | 'training' | 'security' | 'admin';
  assignedTo: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dependencies?: string[];
}

interface OnboardingProcess {
  id: string;
  employeeName: string;
  position: string;
  department: string;
  startDate: Date;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  tasks: OnboardingTask[];
  assignedBuddy?: string;
}

const mockOnboardingProcesses: OnboardingProcess[] = [
  {
    id: '1',
    employeeName: 'Alex Johnson',
    position: 'Frontend Developer',
    department: 'Engineering',
    startDate: new Date('2024-02-01'),
    status: 'in-progress',
    progress: 65,
    assignedBuddy: 'Sarah Johnson',
    tasks: [
      {
        id: '1',
        title: 'Complete Employment Forms',
        description: 'Fill out tax forms, emergency contacts, and bank details',
        category: 'hr',
        assignedTo: 'HR Team',
        dueDate: new Date('2024-01-30'),
        status: 'completed',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Setup Laptop and Accounts',
        description: 'Provision laptop, create email account, and setup development environment',
        category: 'it',
        assignedTo: 'IT Team',
        dueDate: new Date('2024-02-01'),
        status: 'completed',
        priority: 'high',
        dependencies: ['1']
      },
      {
        id: '3',
        title: 'Security Training',
        description: 'Complete mandatory security awareness training',
        category: 'security',
        assignedTo: 'Security Team',
        dueDate: new Date('2024-02-05'),
        status: 'in-progress',
        priority: 'medium'
      },
      {
        id: '4',
        title: 'Team Introduction',
        description: 'Meet team members and understand project structure',
        category: 'training',
        assignedTo: 'Team Lead',
        dueDate: new Date('2024-02-03'),
        status: 'pending',
        priority: 'medium'
      }
    ]
  },
  {
    id: '2',
    employeeName: 'Maria Garcia',
    position: 'UX Designer',
    department: 'Design',
    startDate: new Date('2024-02-15'),
    status: 'not-started',
    progress: 0,
    tasks: [
      {
        id: '5',
        title: 'Complete Employment Forms',
        description: 'Fill out tax forms, emergency contacts, and bank details',
        category: 'hr',
        assignedTo: 'HR Team',
        dueDate: new Date('2024-02-10'),
        status: 'pending',
        priority: 'high'
      },
      {
        id: '6',
        title: 'Design Tools Setup',
        description: 'Install Figma, Adobe Creative Suite, and design system access',
        category: 'it',
        assignedTo: 'IT Team',
        dueDate: new Date('2024-02-15'),
        status: 'pending',
        priority: 'high'
      }
    ]
  }
];

export default function Onboarding() {
  const [processes, setProcesses] = useState<OnboardingProcess[]>(mockOnboardingProcesses);
  const [selectedProcess, setSelectedProcess] = useState<OnboardingProcess | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      'not-started': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hr': return <User className="h-5 w-5" />;
      case 'it': return <Monitor className="h-5 w-5" />;
      case 'training': return <GraduationCap className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      case 'admin': return <FileText className="h-5 w-5" />;
      default: return <CheckCircle className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      hr: 'text-blue-600',
      it: 'text-green-600',
      training: 'text-purple-600',
      security: 'text-red-600',
      admin: 'text-orange-600'
    };
    return colors[category as keyof typeof colors] || 'text-gray-600';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleCreateOnboarding = (onboardingData: any) => {
    const newOnboardingProcess: OnboardingProcess = {
      id: onboardingData.id,
      employeeName: onboardingData.employeeName,
      position: onboardingData.position,
      department: onboardingData.department,
      startDate: onboardingData.startDate,
      status: onboardingData.status,
      progress: onboardingData.progress,
      assignedBuddy: onboardingData.assignedBuddy,
      tasks: onboardingData.tasks
    };
    
    setProcesses(prev => [...prev, newOnboardingProcess]);
    setIsCreateModalOpen(false);
  };

  const totalProcesses = processes.length;
  const inProgressProcesses = processes.filter(p => p.status === 'in-progress').length;
  const completedProcesses = processes.filter(p => p.status === 'completed').length;
  const avgProgress = Math.round(processes.reduce((sum, p) => sum + p.progress, 0) / processes.length);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Onboarding & Offboarding</h1>
          <p className="mt-2 text-gray-600">
            Manage employee onboarding checklists with IT setup, training, and automated workflows.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Onboarding
          </button>
        </div>
      </div>

      {/* Onboarding Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <User className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Processes</p>
              <p className="text-2xl font-bold text-gray-900">{totalProcesses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressProcesses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedProcesses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900">{avgProgress}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Onboarding Processes List */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Onboarding Processes</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {processes.map((process) => (
                <div 
                  key={process.id} 
                  className={`px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                    selectedProcess?.id === process.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedProcess(process)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">{process.employeeName}</h4>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{process.position}</span>
                        <span>{process.department}</span>
                        <span>Starts: {process.startDate.toLocaleDateString()}</span>
                      </div>
                      {process.assignedBuddy && (
                        <div className="mt-1 text-sm text-blue-600">
                          Buddy: {process.assignedBuddy}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(process.status)}`}>
                        {process.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-900 font-medium">{process.progress}%</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${process.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Task Summary */}
                  <div className="mt-3 flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">
                      {process.tasks.filter(t => t.status === 'completed').length}/{process.tasks.length} tasks completed
                    </span>
                    <span className="text-gray-600">
                      {process.tasks.filter(t => t.status === 'overdue').length} overdue
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Process Detail Panel */}
        <div className="lg:col-span-1">
          {selectedProcess ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Onboarding Checklist</h3>
                <p className="text-sm text-gray-600">{selectedProcess.employeeName}</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Process Info */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Position:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedProcess.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Department:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedProcess.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Start Date:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedProcess.startDate.toLocaleDateString()}</span>
                  </div>
                  {selectedProcess.assignedBuddy && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Buddy:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedProcess.assignedBuddy}</span>
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="font-medium">{selectedProcess.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${selectedProcess.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Tasks</h5>
                  <div className="space-y-3">
                    {selectedProcess.tasks.map((task) => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            {getTaskStatusIcon(task.status)}
                            <div className="ml-2">
                              <h6 className="text-sm font-medium text-gray-900">{task.title}</h6>
                              <p className="text-xs text-gray-500">{task.description}</p>
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <div className={`mr-2 ${getCategoryColor(task.category)}`}>
                              {getCategoryIcon(task.category)}
                            </div>
                            <span className="capitalize">{task.category}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>{task.assignedTo}</span>
                            <span>Due: {task.dueDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No process selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select an onboarding process to view checklist.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Onboarding Modal */}
      <CreateOnboardingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateOnboarding}
      />
    </div>
  );
}