/**
 * Finance Payments Page
 * Author: VB Entreprise
 * 
 * Payment gateway dashboard with Stripe/PayPal reconciliation,
 * payment logs, and refund management
 */

import React, { useState } from 'react';
import { Plus, Download, RefreshCw, CreditCard, Smartphone, Building, DollarSign, TrendingUp, Calendar, Filter, Search } from 'lucide-react';
import RecordPaymentModal from '../../components/Modals/RecordPaymentModal';

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: 'stripe' | 'paypal' | 'bank' | 'upi' | 'cash';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: Date;
  reference: string;
  client: string;
  gateway: string;
  fees: number;
  netAmount: number;
}

interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'completed' | 'failed';
  date: Date;
  processedBy: string;
}

const mockPayments: Payment[] = [
  {
    id: '1',
    invoiceId: 'INV-2024-001',
    amount: 177000,
    method: 'stripe',
    status: 'completed',
    date: new Date('2024-01-25'),
    reference: 'pi_1234567890',
    client: 'TechCorp Solutions',
    gateway: 'Stripe',
    fees: 5310,
    netAmount: 171690
  },
  {
    id: '2',
    invoiceId: 'INV-2024-003',
    amount: 89000,
    method: 'upi',
    status: 'completed',
    date: new Date('2024-01-22'),
    reference: 'UPI123456789',
    client: 'Digital Agency',
    gateway: 'Razorpay',
    fees: 1780,
    netAmount: 87220
  },
  {
    id: '3',
    invoiceId: 'INV-2024-004',
    amount: 125000,
    method: 'bank',
    status: 'pending',
    date: new Date('2024-01-23'),
    reference: 'NEFT789012345',
    client: 'Startup Innovation',
    gateway: 'Bank Transfer',
    fees: 0,
    netAmount: 125000
  }
];

const mockRefunds: Refund[] = [
  {
    id: '1',
    paymentId: '1',
    amount: 25000,
    reason: 'Partial service cancellation',
    status: 'completed',
    date: new Date('2024-01-26'),
    processedBy: 'Admin User'
  }
];

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [refunds] = useState<Refund[]>(mockRefunds);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [activeTab, setActiveTab] = useState<'payments' | 'refunds'>('payments');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'stripe':
      case 'paypal': return <CreditCard className="h-4 w-4" />;
      case 'upi': return <Smartphone className="h-4 w-4" />;
      case 'bank': return <Building className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    return matchesStatus && matchesMethod;
  });

  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalFees = payments.reduce((sum, payment) => sum + payment.fees, 0);
  const completedPayments = payments.filter(p => p.status === 'completed');
  const pendingPayments = payments.filter(p => p.status === 'pending');

  const handleRecordPayment = (paymentData: any) => {
    const newPayment: Payment = {
      ...paymentData,
      id: paymentData.id
    };
    
    setPayments(prev => [newPayment, ...prev]);
  };

  // Mock invoices for the payment modal
  const mockInvoices = [
    { id: '1', number: 'INV-2024-001', client: 'TechCorp Solutions', total: 177000, status: 'sent' },
    { id: '2', number: 'INV-2024-002', client: 'Startup Innovation', total: 236000, status: 'overdue' },
    { id: '3', number: 'INV-2024-003', client: 'Digital Agency', total: 89000, status: 'sent' }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="mt-2 text-gray-600">
            Gateway dashboard with reconciliation, payment logs, and refund management.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" />
            Sync Gateways
          </button>
          <button 
            onClick={() => setIsRecordPaymentModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalPayments.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Gateway Fees</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalFees.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{((totalFees / totalPayments) * 100).toFixed(2)}% of total</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedPayments.length}</p>
              <p className="text-sm text-gray-500">₹{completedPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingPayments.length}</p>
              <p className="text-sm text-gray-500">₹{pendingPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'payments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payment Log
          </button>
          <button
            onClick={() => setActiveTab('refunds')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'refunds'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Refunds & Adjustments
          </button>
        </nav>
      </div>

      {activeTab === 'payments' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payments List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
              >
                <option value="all">All Methods</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="upi">UPI</option>
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            {/* Payments Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr 
                        key={payment.id} 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                          selectedPayment?.id === payment.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{payment.reference}</div>
                            <div className="text-sm text-gray-500">{payment.invoiceId} - {payment.client}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getMethodIcon(payment.method)}
                            <div className="ml-2">
                              <div className="text-sm text-gray-900 capitalize">{payment.method}</div>
                              <div className="text-sm text-gray-500">{payment.gateway}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">₹{payment.amount.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">Fee: ₹{payment.fees.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.date.toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payment Detail Panel */}
          <div className="lg:col-span-1">
            {selectedPayment ? (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Payment Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{selectedPayment.reference}</h4>
                    <p className="text-sm text-gray-600">{selectedPayment.client}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize mt-2 ${getStatusColor(selectedPayment.status)}`}>
                      {selectedPayment.status}
                    </span>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Gross Amount:</span>
                        <span className="font-medium">₹{selectedPayment.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Gateway Fees:</span>
                        <span className="font-medium text-red-600">-₹{selectedPayment.fees.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                        <span>Net Amount:</span>
                        <span className="text-green-600">₹{selectedPayment.netAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Invoice:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedPayment.invoiceId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Method:</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">{selectedPayment.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Gateway:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedPayment.gateway}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedPayment.date.toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <Download className="h-4 w-4" />
                      Download Receipt
                    </button>
                    {selectedPayment.status === 'completed' && (
                      <button className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
                        <RefreshCw className="h-4 w-4" />
                        Process Refund
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <div className="text-center text-gray-500">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No payment selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a payment to view details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Refunds Table */
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Refunds & Adjustments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {refunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      REF-{refund.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {refund.paymentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      -₹{refund.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {refund.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(refund.status)}`}>
                        {refund.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {refund.date.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isRecordPaymentModalOpen}
        onClose={() => setIsRecordPaymentModalOpen(false)}
        onSubmit={handleRecordPayment}
        invoices={mockInvoices}
      />
    </div>
  );
}