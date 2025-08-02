/**
 * Billing Contract Library Page
 * Author: VB Entreprise
 * 
 * Contract management with search, filtering, and renewal tracking
 */

import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, DollarSign, AlertTriangle, CheckCircle, FileText, User } from 'lucide-react';
import CreateContractModal from '../../components/Modals/CreateContractModal';

interface Contract {
  id: string;
  title: string;
  client: string;
  type: 'service' | 'maintenance' | 'license' | 'consulting' | 'retainer';
  status: 'active' | 'expired' | 'pending-renewal' | 'terminated';
  startDate: Date;
  endDate: Date;
  value: number;
  renewalDate?: Date;
  autoRenewal: boolean;
  paymentTerms: string;
  nextPayment?: Date;
}

const mockContracts: Contract[] = [
  {
    id: '1',
    title: 'Website Development & Maintenance',
    client: 'TechCorp Solutions',
    type: 'service',
    status: 'active',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    value: 500000,
    renewalDate: new Date('2024-11-01'),
    autoRenewal: true,
    paymentTerms: 'Monthly',
    nextPayment: new Date('2024-02-01')
  },
  {
    id: '2',
    title: 'Mobile App Support Contract',
    client: 'Startup Innovation',
    type: 'maintenance',
    status: 'pending-renewal',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2024-05-31'),
    value: 240000,
    renewalDate: new Date('2024-04-01'),
    autoRenewal: false,
    paymentTerms: 'Quarterly'
  }
];

export default function ContractLibrary() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      'pending-renewal': 'bg-yellow-100 text-yellow-800',
      terminated: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      service: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-green-100 text-green-800',
      license: 'bg-purple-100 text-purple-800',
      consulting: 'bg-orange-100 text-orange-800',
      retainer: 'bg-pink-100 text-pink-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDaysUntilRenewal = (renewalDate?: Date) => {
    if (!renewalDate) return null;
    const today = new Date();
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const handleCreateContract = (contractData: any) => {
    const newContract: Contract = {
      id: contractData.id,
      title: contractData.title,
      client: contractData.client,
      type: contractData.type,
      status: contractData.status,
      startDate: contractData.startDate,
      endDate: contractData.endDate,
      value: contractData.value,
      renewalDate: contractData.renewalDate,
      autoRenewal: contractData.autoRenewal,
      paymentTerms: contractData.paymentTerms,
      nextPayment: contractData.nextPayment
    };
    
    setContracts(prev => [...prev, newContract]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Contract Library</h1>
          <p className="mt-2 text-gray-600">
            Manage contracts with renewal tracking and automated reminders.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Contract
          </button>
        </div>
      </div>

      {/* Contract Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{contracts.filter(c => c.status === 'active').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Renewal</p>
              <p className="text-2xl font-bold text-gray-900">{contracts.filter(c => c.status === 'pending-renewal').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{contracts.reduce((sum, c) => sum + c.value, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contracts List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending-renewal">Pending Renewal</option>
              <option value="expired">Expired</option>
              <option value="terminated">Terminated</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="service">Service</option>
              <option value="maintenance">Maintenance</option>
              <option value="license">License</option>
              <option value="consulting">Consulting</option>
              <option value="retainer">Retainer</option>
            </select>
          </div>

          {/* Contracts Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContracts.map((contract) => {
                    const daysUntilRenewal = getDaysUntilRenewal(contract.renewalDate);
                    return (
                      <tr 
                        key={contract.id} 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                          selectedContract?.id === contract.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedContract(contract)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                            <div className="text-sm text-gray-500">{contract.client}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getTypeColor(contract.type)}`}>
                            {contract.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                            {contract.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{contract.value.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contract.endDate.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contract.renewalDate && daysUntilRenewal !== null && (
                            <div className={`text-sm ${daysUntilRenewal < 30 ? 'text-red-600' : 'text-gray-500'}`}>
                              {daysUntilRenewal > 0 ? `${daysUntilRenewal} days` : 'Overdue'}
                            </div>
                          )}
                          {contract.autoRenewal && (
                            <div className="text-xs text-green-600">Auto-renewal</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Contract Detail Panel */}
        <div className="lg:col-span-1">
          {selectedContract ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Contract Details</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Contract Header */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedContract.title}</h4>
                  <p className="text-sm text-gray-600">{selectedContract.client}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getTypeColor(selectedContract.type)}`}>
                      {selectedContract.type}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedContract.status)}`}>
                      {selectedContract.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {/* Contract Value */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">₹{selectedContract.value.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Contract Value</div>
                    <div className="text-xs text-gray-400 mt-1">{selectedContract.paymentTerms} payments</div>
                  </div>
                </div>

                {/* Contract Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Start Date:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedContract.startDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">End Date:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedContract.endDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Payment Terms:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedContract.paymentTerms}</span>
                  </div>
                  {selectedContract.nextPayment && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Next Payment:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedContract.nextPayment.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Renewal Information */}
                {selectedContract.renewalDate && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Renewal Information</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Renewal Date:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedContract.renewalDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Auto-Renewal:</span>
                        <span className={`text-sm font-medium ${selectedContract.autoRenewal ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedContract.autoRenewal ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {getDaysUntilRenewal(selectedContract.renewalDate) !== null && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Days Until Renewal:</span>
                          <span className={`text-sm font-medium ${getDaysUntilRenewal(selectedContract.renewalDate)! < 30 ? 'text-red-600' : 'text-gray-900'}`}>
                            {getDaysUntilRenewal(selectedContract.renewalDate)! > 0 
                              ? `${getDaysUntilRenewal(selectedContract.renewalDate)} days`
                              : 'Overdue'
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <FileText className="h-4 w-4" />
                    View Contract
                  </button>
                  {selectedContract.status === 'pending-renewal' && (
                    <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                      <Calendar className="h-4 w-4" />
                      Renew Contract
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No contract selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a contract to view details.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Contract Modal */}
      <CreateContractModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateContract}
      />
    </div>
  );
}