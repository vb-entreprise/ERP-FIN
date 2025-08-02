/**
 * All Projects Page
 * Author: VB Entreprise
 * 
 * Table view with filters, bulk actions, and project health monitoring
 */

import React, { useState } from 'react';
import { Plus, Filter, Download, Archive, Edit, Eye, Calendar, DollarSign, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import CreateProjectModal from '../../components/Modals/CreateProjectModal';

interface Project {
  id: string;
  name: string;
  client: string;
  manager: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  health: 'green' | 'amber' | 'red';
  startDate: Date;
  endDate: Date;
  budget: number;
  actual: number;
  progress: number;
  team: number;
  lastUpdate: Date;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform Redesign',
    client: 'TechCorp Solutions',
    manager: 'Sarah Johnson',
    status: 'active',
    health: 'green',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-31'),
    budget: 150000,
    actual: 67500,
    progress: 45,
    team: 5,
    lastUpdate: new Date('2024-01-22')
  },
  {
    id: '2',
    name: 'Mobile App Development',
    client: 'Startup Innovation',
    manager: 'Mike Chen',
    status: 'active',
    health: 'amber',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-04-15'),
    budget: 200000,
    actual: 85000,
    progress: 35,
    team: 7,
    lastUpdate: new Date('2024-01-21')
  },
  {
    id: '3',
    name: 'Brand Identity Package',
    client: 'Creative Agency',
    manager: 'Lisa Wong',
    status: 'completed',
    health: 'green',
    startDate: new Date('2023-11-01'),
    endDate: new Date('2024-01-15'),
    budget: 75000,
    actual: 72000,
    progress: 100,
    team: 3,
    lastUpdate: new Date('2024-01-15')
  }
];

export default function AllProjects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [healthFilter, setHealthFilter] = useState<string>('all');
  const [managerFilter, setManagerFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      'on-hold': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getHealthColor = (health: string) => {
    const colors = {
      green: 'bg-green-500',
      amber: 'bg-yellow-500',
      red: 'bg-red-500'
    };
    return colors[health as keyof typeof colors] || 'bg-gray-500';
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'green': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'amber': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'red': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesHealth = healthFilter === 'all' || project.health === healthFilter;
    const matchesManager = managerFilter === 'all' || project.manager === managerFilter;
    return matchesStatus && matchesHealth && matchesManager;
  });

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProjects(
      selectedProjects.length === filteredProjects.length 
        ? [] 
        : filteredProjects.map(project => project.id)
    );
  };

  const handleCreateProject = (projectData: any) => {
    const newProject: Project = {
      ...projectData,
      id: projectData.id,
      team: projectData.teamSize,
      lastUpdate: new Date()
    };
    
    setProjects(prev => [newProject, ...prev]);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">All Projects</h1>
          <p className="mt-2 text-gray-600">
            Monitor project health, track budgets, and manage your portfolio.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Filters and Bulk Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value)}
          >
            <option value="all">All Health</option>
            <option value="green">Green</option>
            <option value="amber">Amber</option>
            <option value="red">Red</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={managerFilter}
            onChange={(e) => setManagerFilter(e.target.value)}
          >
            <option value="all">All Managers</option>
            <option value="Sarah Johnson">Sarah Johnson</option>
            <option value="Mike Chen">Mike Chen</option>
            <option value="Lisa Wong">Lisa Wong</option>
          </select>
        </div>

        {selectedProjects.length > 0 && (
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4" />
              Export ({selectedProjects.length})
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Archive className="h-4 w-4" />
              Archive
            </button>
          </div>
        )}
      </div>

      {/* Projects Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget vs Actual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => handleSelectProject(project.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      <div className="text-sm text-gray-500">{project.manager}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getHealthIcon(project.health)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">{project.health}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{project.actual.toLocaleString()} / ₹{project.budget.toLocaleString()}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full ${(project.actual / project.budget) > 0.9 ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min((project.actual / project.budget) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{project.team}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900 p-1 rounded">
                        <Calendar className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}