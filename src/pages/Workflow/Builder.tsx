/**
 * Workflow Builder Page
 * Author: VB Entreprise
 * 
 * Visual workflow builder with drag-and-drop nodes, triggers,
 * and automated business process management
 */

import React, { useState, useRef } from 'react';
import { Plus, Play, Pause, Edit, Trash2, Zap, GitBranch, Clock, Mail, User, CheckCircle } from 'lucide-react';
import CreateWorkflowModal from '../../components/Modals/CreateWorkflowModal';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  title: string;
  description: string;
  config: any;
  position: { x: number; y: number };
  connections: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  trigger: string;
  nodes: WorkflowNode[];
  executions: number;
  lastRun?: Date;
  createdBy: string;
  createdAt: Date;
}

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'New Lead Assignment',
    description: 'Automatically assign new leads to sales reps based on territory',
    status: 'active',
    trigger: 'lead_created',
    nodes: [],
    executions: 156,
    lastRun: new Date('2024-01-22'),
    createdBy: 'Admin User',
    createdAt: new Date('2024-01-10')
  },
  {
    id: '2',
    name: 'Invoice Overdue Reminder',
    description: 'Send reminder emails for overdue invoices',
    status: 'active',
    trigger: 'invoice_overdue',
    nodes: [],
    executions: 23,
    lastRun: new Date('2024-01-21'),
    createdBy: 'Finance Team',
    createdAt: new Date('2024-01-05')
  }
];

const nodeTypes = [
  { type: 'trigger', name: 'Trigger', icon: Zap, color: 'bg-blue-100 text-blue-800' },
  { type: 'condition', name: 'Condition', icon: GitBranch, color: 'bg-yellow-100 text-yellow-800' },
  { type: 'action', name: 'Action', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  { type: 'delay', name: 'Delay', icon: Clock, color: 'bg-purple-100 text-purple-800' }
];

export default function Builder() {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'builder'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleCreateWorkflow = (workflowData: any) => {
    const newWorkflow: Workflow = {
      id: workflowData.id,
      name: workflowData.name,
      description: workflowData.description,
      status: workflowData.status,
      trigger: workflowData.trigger,
      nodes: workflowData.nodes,
      executions: workflowData.executions,
      createdBy: workflowData.createdBy,
      createdAt: workflowData.createdAt
    };
    
    setWorkflows(prev => [...prev, newWorkflow]);
    setIsCreateModalOpen(false);
  };

  const handleDragStart = (e: React.DragEvent, nodeType: typeof nodeTypes[0]) => {
    e.dataTransfer.setData('application/json', JSON.stringify(nodeType));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const nodeTypeData = e.dataTransfer.getData('application/json');
    if (nodeTypeData) {
      const nodeType = JSON.parse(nodeTypeData);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newNode: WorkflowNode = {
          id: `node-${Date.now()}`,
          type: nodeType.type,
          title: nodeType.name,
          description: `New ${nodeType.name} node`,
          config: {},
          position: { x, y },
          connections: []
        };
        
        setNodes(prev => [...prev, newNode]);
      }
    }
  };

  const handleNodeDrag = (nodeId: string, newPosition: { x: number; y: number }) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, position: newPosition }
        : node
    ));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Workflow Builder</h1>
          <p className="mt-2 text-gray-600">
            Create automated workflows with visual drag-and-drop builder.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'list' 
                  ? 'bg-blue-50 text-blue-700 border-r border-gray-300' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Workflow List
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'builder' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Visual Builder
            </button>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Workflow
          </button>
        </div>
      </div>

      {/* Workflow Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Workflows</p>
              <p className="text-2xl font-bold text-gray-900">{workflows.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Play className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{workflows.filter(w => w.status === 'active').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Executions</p>
              <p className="text-2xl font-bold text-gray-900">{workflows.reduce((sum, w) => sum + w.executions, 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">94%</p>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'list' ? (
        /* Workflow List */
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workflow</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trigger</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Executions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Run</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workflows.map((workflow) => (
                  <tr key={workflow.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                        <div className="text-sm text-gray-500">{workflow.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {workflow.trigger.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(workflow.status)}`}>
                        {workflow.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {workflow.executions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {workflow.lastRun?.toLocaleDateString() || 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1 rounded">
                          <Play className="h-4 w-4" />
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
      ) : (
        /* Visual Builder */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Node Palette */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Node Palette</h3>
              </div>
              <div className="p-4 space-y-3">
                {nodeTypes.map((nodeType) => (
                  <div
                    key={nodeType.type}
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    draggable
                    onDragStart={(e) => handleDragStart(e, nodeType)}
                  >
                    <nodeType.icon className="h-5 w-5 mr-3 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{nodeType.name}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${nodeType.color}`}>
                        {nodeType.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Workflow Canvas</h3>
              </div>
              <div 
                className="p-6 relative"
                ref={canvasRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {nodes.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center min-h-96">
                    <Zap className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Build Your Workflow</h3>
                    <p className="mt-1 text-sm text-gray-500">Drag nodes from the palette to create automated workflows.</p>
                  </div>
                ) : (
                  <div className="relative min-h-96">
                    {nodes.map((node) => (
                      <div
                        key={node.id}
                        className="absolute bg-white border border-gray-300 rounded-lg p-3 shadow-sm cursor-move"
                        style={{
                          left: node.position.x,
                          top: node.position.y,
                          minWidth: '120px'
                        }}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', node.id);
                        }}
                        onDragEnd={(e) => {
                          const rect = canvasRef.current?.getBoundingClientRect();
                          if (rect) {
                            const newX = e.clientX - rect.left;
                            const newY = e.clientY - rect.top;
                            handleNodeDrag(node.id, { x: newX, y: newY });
                          }
                        }}
                      >
                        <div className="flex items-center mb-2">
                          {node.type === 'trigger' && <Zap className="h-4 w-4 text-blue-600 mr-2" />}
                          {node.type === 'condition' && <GitBranch className="h-4 w-4 text-yellow-600 mr-2" />}
                          {node.type === 'action' && <CheckCircle className="h-4 w-4 text-green-600 mr-2" />}
                          {node.type === 'delay' && <Clock className="h-4 w-4 text-purple-600 mr-2" />}
                          <span className="text-sm font-medium text-gray-900">{node.title}</span>
                        </div>
                        <div className="text-xs text-gray-500">{node.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Workflow Modal */}
      <CreateWorkflowModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateWorkflow}
      />
    </div>
  );
}