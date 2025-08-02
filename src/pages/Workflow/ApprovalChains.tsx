/**
 * Workflow Approval Chains Page
 * Author: VB Entreprise
 * 
 * Configure multi-step approval processes for various business operations
 */

import React, { useState } from 'react';
import { Plus, Users, CheckCircle, Clock, ArrowRight, Settings } from 'lucide-react';
import CreateApprovalChainModal from '../../components/Modals/CreateApprovalChainModal';

interface ApprovalChain {
  id: string;
  name: string;
  type: 'expense' | 'purchase' | 'leave' | 'contract' | 'custom';
  steps: ApprovalStep[];
  status: 'active' | 'inactive';
  pendingApprovals: number;
}

interface ApprovalStep {
  id: string;
  order: number;
  approver: string;
  role: string;
  condition?: string;
  required: boolean;
}

const mockApprovalChains: ApprovalChain[] = [
  {
    id: '1',
    name: 'Expense Approval',
    type: 'expense',
    steps: [
      { id: '1', order: 1, approver: 'Direct Manager', role: 'Manager', required: true },
      { id: '2', order: 2, approver: 'Finance Manager', role: 'Finance', condition: 'amount > 10000', required: false }
    ],
    status: 'active',
    pendingApprovals: 5
  },
  {
    id: '2',
    name: 'Purchase Order Approval',
    type: 'purchase',
    steps: [
      { id: '3', order: 1, approver: 'Department Head', role: 'Manager', required: true },
      { id: '4', order: 2, approver: 'Finance Director', role: 'Finance', condition: 'amount > 50000', required: true },
      { id: '5', order: 3, approver: 'CEO', role: 'Executive', condition: 'amount > 100000', required: true }
    ],
    status: 'active',
    pendingApprovals: 2
  }
];

export default function ApprovalChains() {
  const [approvalChains, setApprovalChains] = useState<ApprovalChain[]>(mockApprovalChains);
  const [selectedChain, setSelectedChain] = useState<ApprovalChain | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getTypeColor = (type: string) => {
    const colors = {
      expense: 'bg-blue-100 text-blue-800',
      purchase: 'bg-green-100 text-green-800',
      leave: 'bg-yellow-100 text-yellow-800',
      contract: 'bg-purple-100 text-purple-800',
      custom: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleCreateChain = (chainData: any) => {
    const newChain: ApprovalChain = {
      id: chainData.id,
      name: chainData.name,
      type: chainData.type,
      steps: chainData.steps,
      status: chainData.status,
      pendingApprovals: chainData.pendingApprovals
    };
    
    setApprovalChains(prev => [...prev, newChain]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Approval Chains</h1>
          <p className="mt-2 text-gray-600">
            Configure multi-step approval processes for business operations.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            New Approval Chain
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Approval Chains List */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chain</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Steps</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {approvalChains.map((chain) => (
                    <tr 
                      key={chain.id} 
                      className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                        selectedChain?.id === chain.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedChain(chain)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{chain.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getTypeColor(chain.type)}`}>
                          {chain.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {chain.steps.length} steps
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(chain.status)}`}>
                          {chain.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {chain.pendingApprovals}
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
        </div>

        {/* Chain Detail Panel */}
        <div className="lg:col-span-1">
          {selectedChain ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Approval Steps</h3>
              </div>
              <div className="p-6 space-y-4">
                {selectedChain.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{step.order}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-sm font-medium text-gray-900">{step.approver}</div>
                      <div className="text-sm text-gray-500">{step.role}</div>
                      {step.condition && (
                        <div className="text-xs text-orange-600">{step.condition}</div>
                      )}
                    </div>
                    {index < selectedChain.steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-gray-400 ml-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No chain selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select an approval chain to view steps.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Approval Chain Modal */}
      <CreateApprovalChainModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateChain}
      />
    </div>
  );
}