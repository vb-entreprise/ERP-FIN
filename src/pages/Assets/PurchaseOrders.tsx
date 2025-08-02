/**
 * Assets Purchase Orders Page
 * Author: VB Entreprise
 * 
 * Purchase order management with vendor selection, approval workflow,
 * and delivery tracking
 */

import React, { useState } from 'react';
import { Plus, Search, Filter, CheckCircle, Clock, AlertTriangle, User, Calendar, DollarSign, Package, Truck } from 'lucide-react';
import CreatePurchaseOrderModal from '../../components/Modals/CreatePurchaseOrderModal';

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  requestedBy: string;
  approver?: string;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  orderDate: Date;
  expectedDelivery: Date;
  actualDelivery?: Date;
  totalAmount: number;
  items: POItem[];
  notes: string;
}

interface POItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

interface Vendor {
  id: string;
  name: string;
  contact: string;
  email: string;
  rating: number;
  paymentTerms: string;
  deliveryTime: string;
}

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    poNumber: 'PO-2024-001',
    vendor: 'Tech Supplies Inc',
    requestedBy: 'IT Manager',
    approver: 'Finance Manager',
    status: 'approved',
    priority: 'high',
    orderDate: new Date('2024-01-20'),
    expectedDelivery: new Date('2024-01-25'),
    totalAmount: 125000,
    items: [
      { id: '1', description: 'MacBook Pro 16"', quantity: 2, unitPrice: 250000, totalPrice: 500000, category: 'Hardware' },
      { id: '2', description: 'External Monitor', quantity: 4, unitPrice: 45000, totalPrice: 180000, category: 'Hardware' }
    ],
    notes: 'Urgent requirement for new team members'
  },
  {
    id: '2',
    poNumber: 'PO-2024-002',
    vendor: 'Office Depot',
    requestedBy: 'Admin Team',
    status: 'pending',
    priority: 'medium',
    orderDate: new Date('2024-01-22'),
    expectedDelivery: new Date('2024-01-30'),
    totalAmount: 25000,
    items: [
      { id: '3', description: 'Office Chairs', quantity: 10, unitPrice: 15000, totalPrice: 150000, category: 'Furniture' },
      { id: '4', description: 'Desk Accessories', quantity: 20, unitPrice: 2500, totalPrice: 50000, category: 'Supplies' }
    ],
    notes: 'New office setup requirements'
  }
];

const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Tech Supplies Inc',
    contact: 'John Smith',
    email: 'john@techsupplies.com',
    rating: 4.5,
    paymentTerms: 'Net 30',
    deliveryTime: '3-5 days'
  },
  {
    id: '2',
    name: 'Office Depot',
    contact: 'Sarah Wilson',
    email: 'sarah@officedepot.com',
    rating: 4.2,
    paymentTerms: 'Net 15',
    deliveryTime: '5-7 days'
  }
];

export default function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [vendors] = useState<Vendor[]>(mockVendors);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'vendors'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      ordered: 'bg-blue-100 text-blue-800',
      delivered: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'delivered': return <Package className="h-4 w-4 text-purple-600" />;
      case 'ordered': return <Truck className="h-4 w-4 text-blue-600" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const handleCreatePurchaseOrder = (poData: any) => {
    const newPO: PurchaseOrder = {
      id: poData.id,
      poNumber: poData.poNumber,
      vendor: poData.vendor,
      requestedBy: poData.requestedBy,
      approver: poData.approver,
      status: poData.status,
      priority: poData.priority,
      orderDate: poData.orderDate,
      expectedDelivery: poData.expectedDelivery,
      actualDelivery: poData.actualDelivery,
      totalAmount: poData.totalAmount,
      items: poData.items,
      notes: poData.notes
    };
    
    setPurchaseOrders(prev => [...prev, newPO]);
    setIsCreateModalOpen(false);
  };

  const filteredOrders = statusFilter === 'all' 
    ? purchaseOrders 
    : purchaseOrders.filter(po => po.status === statusFilter);

  const totalOrders = purchaseOrders.length;
  const pendingApproval = purchaseOrders.filter(po => po.status === 'pending').length;
  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);

  const tabs = [
    { id: 'orders', name: 'Purchase Orders', icon: Package },
    { id: 'vendors', name: 'Vendor Directory', icon: User }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Purchase Orders & Vendors</h1>
          <p className="mt-2 text-gray-600">
            Manage purchase orders with vendor selection and approval workflows.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Purchase Order
          </button>
        </div>
      </div>

      {/* PO Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{pendingApproval}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <User className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Purchase Orders List */}
          <div className="lg:col-span-2">
            {/* Filter */}
            <div className="mb-6">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="ordered">Ordered</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            {/* PO Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((po) => (
                      <tr 
                        key={po.id} 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                          selectedPO?.id === po.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedPO(po)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(po.status)}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{po.poNumber}</div>
                              <div className="text-sm text-gray-500">by {po.requestedBy}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {po.vendor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(po.status)}`}>
                            {po.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getPriorityColor(po.priority)}`}>
                            {po.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{po.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {po.expectedDelivery.toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* PO Detail Panel */}
          <div className="lg:col-span-1">
            {selectedPO ? (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Purchase Order Details</h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* PO Header */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{selectedPO.poNumber}</h4>
                    <p className="text-sm text-gray-600">{selectedPO.vendor}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(selectedPO.status)}`}>
                        {selectedPO.status}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getPriorityColor(selectedPO.priority)}`}>
                        {selectedPO.priority}
                      </span>
                    </div>
                  </div>

                  {/* PO Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Requested By:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedPO.requestedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Order Date:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedPO.orderDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Expected Delivery:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedPO.expectedDelivery.toLocaleDateString()}</span>
                    </div>
                    {selectedPO.approver && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Approved By:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedPO.approver}</span>
                      </div>
                    )}
                  </div>

                  {/* Items */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Items</h5>
                    <div className="space-y-2">
                      {selectedPO.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-gray-900">{item.description}</p>
                            <p className="text-gray-500">{item.quantity} × ₹{item.unitPrice.toLocaleString()}</p>
                          </div>
                          <span className="font-medium text-gray-900">₹{item.totalPrice.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span>₹{selectedPO.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedPO.notes && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Notes</h5>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedPO.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <div className="text-center text-gray-500">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No PO selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a purchase order to view details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{vendor.name}</h3>
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    ))}
                  </div>
                  <span className="ml-1 text-sm text-gray-600">{vendor.rating}</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Contact:</span>
                  <span className="font-medium text-gray-900">{vendor.contact}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-gray-900">{vendor.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment Terms:</span>
                  <span className="font-medium text-gray-900">{vendor.paymentTerms}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Time:</span>
                  <span className="font-medium text-gray-900">{vendor.deliveryTime}</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Create PO
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Purchase Order Modal */}
      <CreatePurchaseOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePurchaseOrder}
        vendors={vendors}
      />
    </div>
  );
}