/**
 * Finance Expense Reimbursements Page
 * Author: VB Entreprise
 * 
 * Expense submission with receipt upload (OCR), approval workflow,
 * and reimbursement tracking
 */

import React, { useState } from 'react';
import { Plus, Upload, Eye, CheckCircle, XCircle, Clock, DollarSign, Calendar, User, FileText, Camera } from 'lucide-react';
import CreateExpenseModal from '../../components/Modals/CreateExpenseModal';

interface Expense {
  id: string;
  employeeName: string;
  employeeId: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  status: 'submitted' | 'approved' | 'rejected' | 'reimbursed';
  submittedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  receipt?: string;
  ocrData?: {
    vendor: string;
    amount: number;
    date: Date;
    confidence: number;
  };
  comments: Comment[];
}

interface Comment {
  id: string;
  user: string;
  message: string;
  date: Date;
}

const mockExpenses: Expense[] = [
  {
    id: '1',
    employeeName: 'Sarah Johnson',
    employeeId: 'EMP001',
    amount: 2500,
    category: 'Travel',
    description: 'Client meeting travel expenses',
    date: new Date('2024-01-20'),
    status: 'approved',
    submittedAt: new Date('2024-01-21'),
    approvedBy: 'Mike Chen',
    approvedAt: new Date('2024-01-22'),
    receipt: 'receipt-001.jpg',
    ocrData: {
      vendor: 'Uber',
      amount: 2500,
      date: new Date('2024-01-20'),
      confidence: 95
    },
    comments: [
      {
        id: '1',
        user: 'Mike Chen',
        message: 'Approved for client meeting expenses',
        date: new Date('2024-01-22')
      }
    ]
  },
  {
    id: '2',
    employeeName: 'John Doe',
    employeeId: 'EMP002',
    amount: 1200,
    category: 'Office Supplies',
    description: 'Laptop accessories and stationery',
    date: new Date('2024-01-19'),
    status: 'submitted',
    submittedAt: new Date('2024-01-20'),
    receipt: 'receipt-002.jpg',
    ocrData: {
      vendor: 'Office Depot',
      amount: 1200,
      date: new Date('2024-01-19'),
      confidence: 88
    },
    comments: []
  },
  {
    id: '3',
    employeeName: 'Lisa Wong',
    employeeId: 'EMP003',
    amount: 3500,
    category: 'Software',
    description: 'Design software subscription',
    date: new Date('2024-01-18'),
    status: 'rejected',
    submittedAt: new Date('2024-01-19'),
    approvedBy: 'Admin User',
    approvedAt: new Date('2024-01-20'),
    receipt: 'receipt-003.jpg',
    comments: [
      {
        id: '2',
        user: 'Admin User',
        message: 'Please use company account for software purchases',
        date: new Date('2024-01-20')
      }
    ]
  }
];

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreateExpenseModalOpen, setIsCreateExpenseModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      submitted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      reimbursed: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'reimbursed': return <DollarSign className="h-4 w-4 text-purple-600" />;
      default: return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Travel': 'bg-blue-100 text-blue-800',
      'Office Supplies': 'bg-green-100 text-green-800',
      'Software': 'bg-purple-100 text-purple-800',
      'Meals': 'bg-orange-100 text-orange-800',
      'Training': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const approvedExpenses = expenses.filter(e => e.status === 'approved');
  const pendingExpenses = expenses.filter(e => e.status === 'submitted');
  const reimbursedExpenses = expenses.filter(e => e.status === 'reimbursed');

  const categories = ['Travel', 'Office Supplies', 'Software', 'Meals', 'Training'];

  const handleCreateExpense = (expenseData: any) => {
    const newExpense: Expense = {
      ...expenseData,
      id: expenseData.id
    };
    
    setExpenses(prev => [newExpense, ...prev]);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Expense Reimbursements</h1>
          <p className="mt-2 text-gray-600">
            Submit expenses with receipt upload, manage approvals, and track reimbursements.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateExpenseModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Submit Expense
          </button>
        </div>
      </div>

      {/* Expense Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedExpenses.length}</p>
              <p className="text-sm text-gray-500">₹{approvedExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{pendingExpenses.length}</p>
              <p className="text-sm text-gray-500">₹{pendingExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Reimbursed</p>
              <p className="text-2xl font-bold text-gray-900">{reimbursedExpenses.length}</p>
              <p className="text-sm text-gray-500">₹{reimbursedExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expenses List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="reimbursed">Reimbursed</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Expenses Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExpenses.map((expense) => (
                    <tr 
                      key={expense.id} 
                      className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                        selectedExpense?.id === expense.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedExpense(expense)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{expense.employeeName}</div>
                            <div className="text-sm text-gray-500">{expense.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{expense.description}</div>
                        {expense.ocrData && (
                          <div className="text-sm text-gray-500">
                            OCR: {expense.ocrData.vendor} ({expense.ocrData.confidence}% confidence)
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(expense.category)}`}>
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{expense.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(expense.status)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(expense.status)}`}>
                            {expense.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {expense.date.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Expense Detail Panel */}
        <div className="lg:col-span-1">
          {selectedExpense ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Expense Details</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Expense Header */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedExpense.description}</h4>
                  <p className="text-sm text-gray-600">{selectedExpense.employeeName}</p>
                  <div className="flex items-center mt-2">
                    {getStatusIcon(selectedExpense.status)}
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(selectedExpense.status)}`}>
                      {selectedExpense.status}
                    </span>
                  </div>
                </div>

                {/* Amount & Category */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="text-lg font-semibold text-gray-900">₹{selectedExpense.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Category:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(selectedExpense.category)}`}>
                      {selectedExpense.category}
                    </span>
                  </div>
                </div>

                {/* OCR Data */}
                {selectedExpense.ocrData && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Receipt Analysis (OCR)</h5>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Vendor:</span>
                          <span className="font-medium text-gray-900">{selectedExpense.ocrData.vendor}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">OCR Amount:</span>
                          <span className="font-medium text-gray-900">₹{selectedExpense.ocrData.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Confidence:</span>
                          <span className="font-medium text-green-600">{selectedExpense.ocrData.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Timeline</h5>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <div className="text-sm">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="ml-2 text-gray-900">{selectedExpense.submittedAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                    {selectedExpense.approvedAt && (
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${selectedExpense.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div className="text-sm">
                          <span className="text-gray-600">{selectedExpense.status === 'approved' ? 'Approved' : 'Rejected'}:</span>
                          <span className="ml-2 text-gray-900">{selectedExpense.approvedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Comments</h5>
                  {selectedExpense.comments.length > 0 ? (
                    <div className="space-y-3">
                      {selectedExpense.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium text-gray-900">{comment.user}</span>
                            <span className="text-xs text-gray-500">{comment.date.toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-600">{comment.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No comments yet</p>
                  )}
                </div>

                {/* Receipt */}
                {selectedExpense.receipt && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Receipt</h5>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Camera className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedExpense.receipt}</p>
                        <p className="text-xs text-gray-500">Receipt image</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedExpense.status === 'submitted' && (
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No expense selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select an expense to view details.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Expense Modal */}
      <CreateExpenseModal
        isOpen={isCreateExpenseModalOpen}
        onClose={() => setIsCreateExpenseModalOpen(false)}
        onSubmit={handleCreateExpense}
      />
    </div>
  );
}