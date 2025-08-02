/**
 * Finance Invoices Page
 * Author: VB Entreprise
 * 
 * Invoice management with list view, detail panels, payment tracking,
 * and automated reminders with PDF generation capabilities
 */

import React, { useState } from 'react';
import { Plus, Download, Eye, Send, DollarSign, Calendar, User, AlertTriangle, CheckCircle, Clock, Filter, Search, Mail } from 'lucide-react';
import CreateInvoiceModal from '../../components/Modals/CreateInvoiceModal';

interface Invoice {
  id: string;
  number: string;
  client: string;
  project?: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  createdAt: Date;
  sentAt?: Date;
  paidAt?: Date;
  items: InvoiceItem[];
  paymentHistory: Payment[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Payment {
  id: string;
  amount: number;
  method: 'bank' | 'card' | 'upi' | 'cash';
  date: Date;
  reference: string;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    client: 'TechCorp Solutions',
    project: 'E-commerce Platform',
    amount: 150000,
    tax: 27000,
    total: 177000,
    status: 'paid',
    dueDate: new Date('2024-01-30'),
    createdAt: new Date('2024-01-15'),
    sentAt: new Date('2024-01-16'),
    paidAt: new Date('2024-01-25'),
    items: [
      { id: '1', description: 'Website Development', quantity: 1, rate: 120000, amount: 120000 },
      { id: '2', description: 'SEO Optimization', quantity: 1, rate: 30000, amount: 30000 }
    ],
    paymentHistory: [
      { id: '1', amount: 177000, method: 'bank', date: new Date('2024-01-25'), reference: 'TXN123456' }
    ]
  },
  {
    id: '2',
    number: 'INV-2024-002',
    client: 'Startup Innovation',
    project: 'Mobile App',
    amount: 200000,
    tax: 36000,
    total: 236000,
    status: 'overdue',
    dueDate: new Date('2024-01-20'),
    createdAt: new Date('2024-01-10'),
    sentAt: new Date('2024-01-11'),
    items: [
      { id: '3', description: 'Mobile App Development', quantity: 1, rate: 180000, amount: 180000 },
      { id: '4', description: 'Testing & QA', quantity: 1, rate: 20000, amount: 20000 }
    ],
    paymentHistory: []
  }
];

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'sent': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDaysOverdue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
  const pendingInvoices = invoices.filter(inv => inv.status === 'sent');

  const handleCreateInvoice = (invoiceData: any) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: invoiceData.id
    };
    
    setInvoices(prev => [newInvoice, ...prev]);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="mt-2 text-gray-600">
            Manage invoices, track payments, and send automated reminders.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Invoice Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Paid Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{paidInvoices.length}</p>
              <p className="text-sm text-gray-500">₹{paidInvoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingInvoices.length}</p>
              <p className="text-sm text-gray-500">₹{pendingInvoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{overdueInvoices.length}</p>
              <p className="text-sm text-gray-500">₹{overdueInvoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invoices List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Invoices Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr 
                      key={invoice.id} 
                      className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                        selectedInvoice?.id === invoice.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(invoice.status)}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{invoice.number}</div>
                            <div className="text-sm text-gray-500">{invoice.project}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">₹{invoice.total.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">₹{invoice.amount.toLocaleString()} + tax</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                        {invoice.status === 'overdue' && (
                          <div className="text-xs text-red-600 mt-1">
                            {getDaysOverdue(invoice.dueDate)} days overdue
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.dueDate.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded" title="View">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1 rounded" title="Send">
                            <Send className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1 rounded" title="Download">
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

        {/* Invoice Detail Panel */}
        <div className="lg:col-span-1">
          {selectedInvoice ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Invoice Details</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Invoice Header */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedInvoice.number}</h4>
                  <p className="text-sm text-gray-600">{selectedInvoice.client}</p>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full capitalize mt-2 ${getStatusColor(selectedInvoice.status)}`}>
                    {getStatusIcon(selectedInvoice.status)}
                    <span className="ml-1">{selectedInvoice.status}</span>
                  </span>
                </div>

                {/* Financial Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">₹{selectedInvoice.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (18%):</span>
                      <span className="font-medium">₹{selectedInvoice.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span>₹{selectedInvoice.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Line Items</h5>
                  <div className="space-y-2">
                    {selectedInvoice.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-gray-900">{item.description}</p>
                          <p className="text-gray-500">{item.quantity} × ₹{item.rate.toLocaleString()}</p>
                        </div>
                        <span className="font-medium text-gray-900">₹{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment History */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Payment History</h5>
                  {selectedInvoice.paymentHistory.length > 0 ? (
                    <div className="space-y-2">
                      {selectedInvoice.paymentHistory.map((payment) => (
                        <div key={payment.id} className="flex justify-between text-sm p-2 bg-green-50 rounded">
                          <div>
                            <p className="font-medium text-gray-900">₹{payment.amount.toLocaleString()}</p>
                            <p className="text-gray-500">{payment.method.toUpperCase()} - {payment.reference}</p>
                          </div>
                          <span className="text-gray-500">{payment.date.toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No payments recorded</p>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <Eye className="h-4 w-4" />
                    View Invoice
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                    <Send className="h-4 w-4" />
                    Send Reminder
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No invoice selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select an invoice to view details.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateInvoice}
      />
    </div>
  );
}