/**
 * Helpdesk SLAs & Escalations Page
 * Author: VB Entreprise
 * 
 * SLA policy management with response and resolution targets,
 * escalation rules, and performance monitoring
 */

import React, { useState } from 'react';
import { Plus, Clock, AlertTriangle, TrendingUp, Edit, Trash2, Play, Pause } from 'lucide-react';
import CreateSLAModal from '../../components/Modals/CreateSLAModal';

interface SLAPolicy {
  id: string;
  name: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  responseTime: number; // in hours
  resolutionTime: number; // in hours
  businessHours: boolean;
  isActive: boolean;
  escalationRules: EscalationRule[];
  performance: {
    compliance: number;
    avgResponseTime: number;
    avgResolutionTime: number;
  };
}

interface EscalationRule {
  id: string;
  trigger: 'response_overdue' | 'resolution_overdue' | 'no_update';
  delay: number; // hours after trigger
  action: 'reassign' | 'notify' | 'escalate';
  target: string;
  isActive: boolean;
}

const mockSLAPolicies: SLAPolicy[] = [
  {
    id: '1',
    name: 'Critical Issues',
    priority: 'urgent',
    responseTime: 1,
    resolutionTime: 4,
    businessHours: false,
    isActive: true,
    escalationRules: [
      {
        id: '1',
        trigger: 'response_overdue',
        delay: 0.5,
        action: 'notify',
        target: 'Support Manager',
        isActive: true
      },
      {
        id: '2',
        trigger: 'resolution_overdue',
        delay: 2,
        action: 'escalate',
        target: 'Senior Support',
        isActive: true
      }
    ],
    performance: {
      compliance: 95,
      avgResponseTime: 0.8,
      avgResolutionTime: 3.2
    }
  },
  {
    id: '2',
    name: 'Standard Support',
    priority: 'medium',
    responseTime: 4,
    resolutionTime: 24,
    businessHours: true,
    isActive: true,
    escalationRules: [
      {
        id: '3',
        trigger: 'response_overdue',
        delay: 2,
        action: 'notify',
        target: 'Team Lead',
        isActive: true
      }
    ],
    performance: {
      compliance: 87,
      avgResponseTime: 3.5,
      avgResolutionTime: 18.5
    }
  }
];

export default function SLA() {
  const [slaPolicies, setSlaPolicies] = useState<SLAPolicy[]>(mockSLAPolicies);
  const [selectedPolicy, setSelectedPolicy] = useState<SLAPolicy | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 95) return 'text-green-600';
    if (compliance >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">SLAs & Escalations</h1>
          <p className="mt-2 text-gray-600">
            Manage service level agreements, response targets, and escalation workflows.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New SLA Policy
          </button>
        </div>
      </div>

      {/* SLA Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Overall Compliance</p>
              <p className="text-2xl font-bold text-gray-900">91%</p>
              <p className="text-sm text-green-600 mt-1">+2% this month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">2.1h</p>
              <p className="text-sm text-green-600 mt-1">Within target</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Escalations</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-red-600 mt-1">This week</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Play className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Policies</p>
              <p className="text-2xl font-bold text-gray-900">{slaPolicies.filter(p => p.isActive).length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SLA Policies List */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">SLA Policies</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {slaPolicies.map((policy) => (
                    <tr 
                      key={policy.id} 
                      className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                        selectedPolicy?.id === policy.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedPolicy(policy)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                        <div className="text-sm text-gray-500">{policy.escalationRules.length} escalation rules</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getPriorityColor(policy.priority)}`}>
                          {policy.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {policy.responseTime}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {policy.resolutionTime}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getComplianceColor(policy.performance.compliance)}`}>
                          {policy.performance.compliance}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          policy.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {policy.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1 rounded">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Policy Detail Panel */}
        <div className="lg:col-span-1">
          {selectedPolicy ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Policy Details</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Policy Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedPolicy.name}</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getPriorityColor(selectedPolicy.priority)}`}>
                    {selectedPolicy.priority} Priority
                  </span>
                </div>

                {/* SLA Targets */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Response Target:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedPolicy.responseTime}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Resolution Target:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedPolicy.resolutionTime}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Business Hours Only:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedPolicy.businessHours ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Performance</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Compliance:</span>
                      <span className={`text-sm font-medium ${getComplianceColor(selectedPolicy.performance.compliance)}`}>
                        {selectedPolicy.performance.compliance}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Response:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedPolicy.performance.avgResponseTime}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Resolution:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedPolicy.performance.avgResolutionTime}h</span>
                    </div>
                  </div>
                </div>

                {/* Escalation Rules */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Escalation Rules</h5>
                  <div className="space-y-3">
                    {selectedPolicy.escalationRules.map((rule) => (
                      <div key={rule.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {rule.trigger.replace('_', ' ')}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            rule.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          After {rule.delay}h → {rule.action} {rule.target}
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
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No policy selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select an SLA policy to view details.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create SLA Modal */}
      <CreateSLAModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(slaData) => {
          setSlaPolicies(prev => [...prev, slaData]);
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}