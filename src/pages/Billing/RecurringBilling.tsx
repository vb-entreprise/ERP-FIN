/**
 * Billing Recurring Billing Page
 * Author: VB Entreprise
 * 
 * Recurring billing plans with auto-invoice generation
 */

import React, { useState } from 'react';
import { Plus, Calendar, DollarSign, Repeat, Play, Pause, CheckCircle, Clock } from 'lucide-react';
import CreateRecurringPlanModal from '../../components/Modals/CreateRecurringPlanModal';

interface RecurringPlan {
  id: string;
  client: string;
  planName: string;
  amount: number;
  interval: 'monthly' | 'quarterly' | 'annually';
  startDate: Date;
  endDate?: Date;
  nextBilling: Date;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  autoInvoice: boolean;
  invoicesGenerated: number;
  totalRevenue: number;
  lastInvoice?: Date;
}

const mockRecurringPlans: RecurringPlan[] = [
  {
    id: '1',
    client: 'TechCorp Solutions',
    planName: 'Website Maintenance',
    amount: 25000,
    interval: 'monthly',
    startDate: new Date('2024-01-01'),
    nextBilling: new Date('2024-02-01'),
    status: 'active',
    autoInvoice: true,
    invoicesGenerated: 1,
    totalRevenue: 25000,
    lastInvoice: new Date('2024-01-01')
  },
  {
    id: '2',
    client: 'Startup Innovation',
    planName: 'App Support Package',
    amount: 75000,
    interval: 'quarterly',
    startDate: new Date('2023-10-01'),
    nextBilling: new Date('2024-04-01'),
    status: 'active',
    autoInvoice: true,
    invoicesGenerated: 2,
    totalRevenue: 150000,
    lastInvoice: new Date('2024-01-01')
  },
  {
    id: '3',
    client: 'Digital Agency',
    planName: 'Consulting Retainer',
    amount: 100000,
    interval: 'monthly',
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-06-01'),
    nextBilling: new Date('2024-02-01'),
    status: 'paused',
    autoInvoice: false,
    invoicesGenerated: 2,
    totalRevenue: 200000,
    lastInvoice: new Date('2024-01-01')
  }
];

export default function RecurringBilling() {
  const [recurringPlans, setRecurringPlans] = useState<RecurringPlan[]>(mockRecurringPlans);
  const [selectedPlan, setSelectedPlan] = useState<RecurringPlan | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getIntervalColor = (interval: string) => {
    const colors = {
      monthly: 'bg-blue-100 text-blue-800',
      quarterly: 'bg-purple-100 text-purple-800',
      annually: 'bg-green-100 text-green-800'
    };
    return colors[interval as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4 text-green-600" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'cancelled': return <CheckCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDaysUntilBilling = (nextBilling: Date) => {
    const today = new Date();
    const diffTime = nextBilling.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredPlans = statusFilter === 'all' 
    ? recurringPlans 
    : recurringPlans.filter(plan => plan.status === statusFilter);

  const totalPlans = recurringPlans.length;
  const activePlans = recurringPlans.filter(p => p.status === 'active').length;
  const monthlyRevenue = recurringPlans
    .filter(p => p.status === 'active')
    .reduce((sum, p) => {
      const multiplier = p.interval === 'monthly' ? 1 : p.interval === 'quarterly' ? 1/3 : 1/12;
      return sum + (p.amount * multiplier);
    }, 0);
  const totalRevenue = recurringPlans.reduce((sum, p) => sum + p.totalRevenue, 0);

  const handleCreatePlan = (planData: any) => {
    const newPlan: RecurringPlan = {
      id: planData.id,
      client: planData.client,
      planName: planData.planName,
      amount: planData.amount,
      interval: planData.interval,
      startDate: planData.startDate,
      endDate: planData.endDate,
      nextBilling: planData.nextBilling,
      status: planData.status,
      autoInvoice: planData.autoInvoice,
      invoicesGenerated: planData.invoicesGenerated,
      totalRevenue: planData.totalRevenue
    };
    
    setRecurringPlans(prev => [...prev, newPlan]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Recurring Billing Plans</h1>
          <p className="mt-2 text-gray-600">
            Manage subscription plans with automated invoice generation.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Billing Plan
          </button>
        </div>
      </div>

      {/* Billing Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Repeat className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900">{totalPlans}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Play className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Plans</p>
              <p className="text-2xl font-bold text-gray-900">{activePlans}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Monthly Recurring Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{Math.round(monthlyRevenue).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Billing Plans List */}
        <div className="lg:col-span-2">
          {/* Filter */}
          <div className="mb-6">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Plans Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interval</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Billing</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPlans.map((plan) => {
                    const daysUntilBilling = getDaysUntilBilling(plan.nextBilling);
                    return (
                      <tr 
                        key={plan.id} 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                          selectedPlan?.id === plan.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedPlan(plan)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{plan.planName}</div>
                            <div className="text-sm text-gray-500">{plan.client}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getIntervalColor(plan.interval)}`}>
                            {plan.interval}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{plan.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(plan.status)}
                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(plan.status)}`}>
                              {plan.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{plan.nextBilling.toLocaleDateString()}</div>
                          {plan.status === 'active' && (
                            <div className={`text-sm ${daysUntilBilling <= 7 ? 'text-orange-600' : 'text-gray-500'}`}>
                              {daysUntilBilling > 0 ? `${daysUntilBilling} days` : 'Due now'}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">₹{plan.totalRevenue.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{plan.invoicesGenerated} invoices</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Plan Detail Panel */}
        <div className="lg:col-span-1">
          {selectedPlan ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Plan Details</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Plan Header */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedPlan.planName}</h4>
                  <p className="text-sm text-gray-600">{selectedPlan.client}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getIntervalColor(selectedPlan.interval)}`}>
                      {selectedPlan.interval}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(selectedPlan.status)}`}>
                      {selectedPlan.status}
                    </span>
                  </div>
                </div>

                {/* Billing Amount */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">₹{selectedPlan.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">per {selectedPlan.interval.replace('ly', '')}</div>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Start Date:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedPlan.startDate.toLocaleDateString()}</span>
                  </div>
                  {selectedPlan.endDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">End Date:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedPlan.endDate.toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Next Billing:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedPlan.nextBilling.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Auto Invoice:</span>
                    <span className={`text-sm font-medium ${selectedPlan.autoInvoice ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedPlan.autoInvoice ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                {/* Revenue Summary */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Revenue Summary</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Invoices Generated:</span>
                      <span className="font-medium">{selectedPlan.invoicesGenerated}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Revenue:</span>
                      <span className="font-medium text-green-600">₹{selectedPlan.totalRevenue.toLocaleString()}</span>
                    </div>
                    {selectedPlan.lastInvoice && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Invoice:</span>
                        <span className="font-medium">{selectedPlan.lastInvoice.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {selectedPlan.status === 'active' && (
                    <button className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200">
                      <Pause className="h-4 w-4" />
                      Pause Plan
                    </button>
                  )}
                  {selectedPlan.status === 'paused' && (
                    <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                      <Play className="h-4 w-4" />
                      Resume Plan
                    </button>
                  )}
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <Calendar className="h-4 w-4" />
                    Generate Invoice Now
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <Repeat className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No plan selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a billing plan to view details.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Recurring Plan Modal */}
      <CreateRecurringPlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlan}
      />
    </div>
  );
}