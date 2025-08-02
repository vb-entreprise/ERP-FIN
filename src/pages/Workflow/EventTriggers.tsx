/**
 * Workflow Event Triggers Page
 * Author: VB Entreprise
 * 
 * Configure event-based triggers for workflow automation
 */

import React, { useState } from 'react';
import { Plus, Zap, Calendar, User, Mail, DollarSign, FileText, Settings } from 'lucide-react';
import CreateTriggerModal from '../../components/Modals/CreateTriggerModal';

interface EventTrigger {
  id: string;
  name: string;
  event: string;
  conditions: TriggerCondition[];
  actions: TriggerAction[];
  status: 'active' | 'inactive';
  executions: number;
  lastTriggered?: Date;
}

interface TriggerCondition {
  field: string;
  operator: string;
  value: string;
}

interface TriggerAction {
  type: 'email' | 'assign' | 'update' | 'create';
  target: string;
  config: any;
}

const mockTriggers: EventTrigger[] = [
  {
    id: '1',
    name: 'High Value Lead Alert',
    event: 'lead_created',
    conditions: [{ field: 'value', operator: 'greater_than', value: '100000' }],
    actions: [{ type: 'email', target: 'sales_manager@company.com', config: {} }],
    status: 'active',
    executions: 12,
    lastTriggered: new Date('2024-01-22')
  },
  {
    id: '2',
    name: 'Project Deadline Alert',
    event: 'project_due_soon',
    conditions: [{ field: 'days_until_due', operator: 'equals', value: '7' }],
    actions: [{ type: 'email', target: 'project_manager', config: {} }],
    status: 'active',
    executions: 8,
    lastTriggered: new Date('2024-01-20')
  }
];

export default function EventTriggers() {
  const [triggers, setTriggers] = useState<EventTrigger[]>(mockTriggers);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleCreateTrigger = (triggerData: any) => {
    const newTrigger: EventTrigger = {
      id: triggerData.id,
      name: triggerData.name,
      event: triggerData.event,
      conditions: triggerData.conditions,
      actions: triggerData.actions,
      status: triggerData.status,
      executions: triggerData.executions,
      lastTriggered: undefined
    };
    
    setTriggers(prev => [...prev, newTrigger]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Event Triggers</h1>
          <p className="mt-2 text-gray-600">
            Configure automated triggers based on system events.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            New Trigger
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trigger</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Executions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Triggered</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {triggers.map((trigger) => (
                <tr key={trigger.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{trigger.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {trigger.event.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(trigger.status)}`}>
                      {trigger.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {trigger.executions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {trigger.lastTriggered?.toLocaleDateString() || 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Settings className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Trigger Modal */}
      <CreateTriggerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTrigger}
      />
    </div>
  );
}