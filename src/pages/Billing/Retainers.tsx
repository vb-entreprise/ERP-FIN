/**
 * Billing Retainers Page
 * Author: VB Entreprise
 * 
 * Retainer management with burn rate tracking and balance alerts
 */

import React, { useState } from 'react';
import { Plus, DollarSign, TrendingDown, AlertTriangle, Clock, BarChart3 } from 'lucide-react';
import CreateRetainerModal from '../../components/Modals/CreateRetainerModal';

interface Retainer {
  id: string;
  client: string;
  amount: number;
  balance: number;
  hourlyRate: number;
  hoursUsed: number;
  totalHours: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'depleted' | 'expired';
  burnRate: number; // hours per month
  projectedDepletion: Date;
}

const mockRetainers: Retainer[] = [
  {
    id: '1',
    client: 'TechCorp Solutions',
    amount: 500000,
    balance: 325000,
    hourlyRate: 5000,
    hoursUsed: 35,
    totalHours: 100,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    status: 'active',
    burnRate: 12,
    projectedDepletion: new Date('2024-06-15')
  },
  {
    id: '2',
    client: 'Startup Innovation',
    amount: 300000,
    balance: 75000,
    hourlyRate: 4500,
    hoursUsed: 50,
    totalHours: 67,
    startDate: new Date('2023-10-01'),
    endDate: new Date('2024-09-30'),
    status: 'active',
    burnRate: 18,
    projectedDepletion: new Date('2024-03-20')
  }
];

export default function Retainers() {
  const [retainers, setRetainers] = useState<Retainer[]>(mockRetainers);
  const [selectedRetainer, setSelectedRetainer] = useState<Retainer | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      depleted: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getBalancePercentage = (balance: number, total: number) => {
    return (balance / total) * 100;
  };

  const getBalanceStatus = (percentage: number) => {
    if (percentage <= 25) return { color: 'bg-red-500', status: 'Critical' };
    if (percentage <= 50) return { color: 'bg-yellow-500', status: 'Low' };
    return { color: 'bg-green-500', status: 'Good' };
  };

  const totalRetainerValue = retainers.reduce((sum, r) => sum + r.amount, 0);
  const totalBalance = retainers.reduce((sum, r) => sum + r.balance, 0);
  const activeRetainers = retainers.filter(r => r.status === 'active').length;

  const handleCreateRetainer = (retainerData: any) => {
    const newRetainer: Retainer = {
      id: retainerData.id,
      client: retainerData.client,
      amount: retainerData.amount,
      balance: retainerData.balance,
      hourlyRate: retainerData.hourlyRate,
      hoursUsed: retainerData.hoursUsed,
      totalHours: retainerData.totalHours,
      startDate: retainerData.startDate,
      endDate: retainerData.endDate,
      status: retainerData.status,
      burnRate: retainerData.burnRate,
      projectedDepletion: retainerData.projectedDepletion
    };
    
    setRetainers(prev => [...prev, newRetainer]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Retainers & Burn Rate</h1>
          <p className="mt-2 text-gray-600">
            Track retainer balances with burn rate analysis and depletion alerts.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Retainer
          </button>
        </div>
      </div>

      {/* Retainer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Retainer Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRetainerValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Remaining Balance</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalBalance.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{Math.round((totalBalance / totalRetainerValue) * 100)}% remaining</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Retainers</p>
              <p className="text-2xl font-bold text-gray-900">{activeRetainers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Low Balance Alerts</p>
              <p className="text-2xl font-bold text-gray-900">
                {retainers.filter(r => getBalancePercentage(r.balance, r.amount) <= 25).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Retainers List */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Retainer Accounts</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {retainers.map((retainer) => {
                const balancePercentage = getBalancePercentage(retainer.balance, retainer.amount);
                const balanceStatus = getBalanceStatus(balancePercentage);
                
                return (
                  <div 
                    key={retainer.id} 
                    className={`px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                      selectedRetainer?.id === retainer.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedRetainer(retainer)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{retainer.client}</h4>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>₹{retainer.hourlyRate.toLocaleString()}/hour</span>
                          <span>{retainer.hoursUsed}/{retainer.totalHours} hours used</span>
                          <span>Burn rate: {retainer.burnRate}h/month</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(retainer.status)}`}>
                          {retainer.status}
                        </span>
                      </div>
                    </div>
                    
                    {/* Balance Progress */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Balance: ₹{retainer.balance.toLocaleString()}</span>
                        <span className={`font-medium ${balancePercentage <= 25 ? 'text-red-600' : 'text-gray-900'}`}>
                          {balancePercentage.toFixed(1)}% remaining
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${balanceStatus.color}`}
                          style={{ width: `${balancePercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹0</span>
                        <span>₹{retainer.amount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Projected Depletion */}
                    <div className="mt-3 text-sm">
                      <span className="text-gray-600">Projected depletion: </span>
                      <span className={`font-medium ${
                        new Date(retainer.projectedDepletion).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000 
                          ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {retainer.projectedDepletion.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Retainer Detail Panel */}
        <div className="lg:col-span-1">
          {selectedRetainer ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Retainer Details</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Client Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedRetainer.client}</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(selectedRetainer.status)}`}>
                    {selectedRetainer.status}
                  </span>
                </div>

                {/* Financial Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Original Amount:</span>
                      <span className="font-medium">₹{selectedRetainer.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current Balance:</span>
                      <span className="font-medium text-green-600">₹{selectedRetainer.balance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount Used:</span>
                      <span className="font-medium">₹{(selectedRetainer.amount - selectedRetainer.balance).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Hourly Rate:</span>
                      <span className="font-medium">₹{selectedRetainer.hourlyRate.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Usage Details */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Usage Details</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Hours Used:</span>
                      <span className="font-medium">{selectedRetainer.hoursUsed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Hours:</span>
                      <span className="font-medium">{selectedRetainer.totalHours}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining Hours:</span>
                      <span className="font-medium">{selectedRetainer.totalHours - selectedRetainer.hoursUsed}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(selectedRetainer.hoursUsed / selectedRetainer.totalHours) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Burn Rate Analysis */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Burn Rate Analysis</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Monthly Burn Rate:</span>
                      <span className="font-medium">{selectedRetainer.burnRate} hours</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Projected Depletion:</span>
                      <span className="font-medium text-orange-600">{selectedRetainer.projectedDepletion.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Contract Period */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Contract Period</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{selectedRetainer.startDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">{selectedRetainer.endDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <Clock className="h-4 w-4" />
                    Log Hours
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                    <DollarSign className="h-4 w-4" />
                    Top Up Balance
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No retainer selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a retainer to view details.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Retainer Modal */}
      <CreateRetainerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRetainer}
      />
    </div>
  );
}