/**
 * Finance & Billing Page
 * Author: VB Entreprise
 * 
 * Financial management with automated invoicing, GST compliance,
 * payment tracking, and comprehensive financial reporting
 */

import React, { useState } from 'react';
import { Plus, Download, Eye, Send, DollarSign, CreditCard, TrendingUp, FileText } from 'lucide-react';
import { mockInvoices } from '../data/mockData';
import CreateInvoiceModal from '../components/Modals/CreateInvoiceModal';
import RecordPaymentModal from '../components/Modals/RecordPaymentModal';

export default function Finance() {
  const [invoices] = useState(mockInvoices);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);

  const handleCreateInvoice = (invoiceData: any) => {
    console.log('New invoice created:', invoiceData);
    // In a real app, this would update the invoices state
  };

  const handleRecordPayment = (paymentData: any) => {
    console.log('Payment recorded:', paymentData);
    // In a real app, this would update the payments state
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Calculate financial metrics
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidInvoices = invoices.filter(invoice => invoice.status === 'paid');
  const pendingInvoices = invoices.filter(invoice => invoice.status === 'sent');
  const overdueInvoices = invoices.filter(invoice => invoice.status === 'overdue');

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Finance & Billing</h1>
          <p className="mt-2 text-gray-600">
            Manage invoices, track payments, and monitor financial performance with GST compliance.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+12.5% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Paid Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{paidInvoices.length}</p>
              <p className="text-sm text-gray-500 mt-1">₹{paidInvoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingInvoices.length}</p>
              <p className="text-sm text-gray-500 mt-1">₹{pendingInvoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{overdueInvoices.length}</p>
              <p className="text-sm text-gray-500 mt-1">₹{overdueInvoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invoices Table */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{invoice.id}</div>
                        <div className="text-sm text-gray-500">Client #{invoice.clientId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{invoice.total.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          (Tax: ₹{invoice.tax.toLocaleString()})
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.dueDate.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                            <Send className="h-4 w-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                            <Download className="h-4 w-4" />
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

        {/* Payment Methods & Tax Info */}
        <div className="space-y-6">
          {/* Payment Methods */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-green-900">UPI Payments</span>
                </div>
                <span className="text-sm text-green-700">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-blue-900">NEFT/RTGS</span>
                </div>
                <span className="text-sm text-blue-700">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-purple-900">Credit Cards</span>
                </div>
                <span className="text-sm text-purple-700">Active</span>
              </div>
            </div>
          </div>

          {/* GST Information */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">GST Compliance</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">GST Number</span>
                  <span className="text-sm font-medium text-gray-900">27AABCU9603R1ZR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Period</span>
                  <span className="text-sm font-medium text-gray-900">Jan 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tax Collected</span>
                  <span className="text-sm font-medium text-gray-900">₹45,230</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Filing Status</span>
                  <span className="text-sm font-medium text-green-600">Current</span>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                Generate GST Report
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <button 
                onClick={() => setIsRecordPaymentModalOpen(true)}
                className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
              >
                <div className="text-sm font-medium text-green-900">Record Payment</div>
                <div className="text-xs text-green-700">Mark invoice as paid</div>
              </button>
              <button className="w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200">
                <div className="text-sm font-medium text-orange-900">Send Reminder</div>
                <div className="text-xs text-orange-700">Follow up on overdue payments</div>
              </button>
              <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                <div className="text-sm font-medium text-blue-900">Expense Tracker</div>
                <div className="text-xs text-blue-700">Record business expenses</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateInvoice}
      />

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isRecordPaymentModalOpen}
        onClose={() => setIsRecordPaymentModalOpen(false)}
        onSubmit={handleRecordPayment}
        invoices={invoices}
      />
    </div>
  );
}