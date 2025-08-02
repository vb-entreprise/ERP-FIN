/**
 * Assets Stock Levels Page
 * Author: VB Entreprise
 * 
 * Inventory management with low-stock alerts and reorder workflows
 */

import React, { useState } from 'react';
import { Plus, AlertTriangle, Package, TrendingDown, BarChart3, RefreshCw, ShoppingCart } from 'lucide-react';
import CreateStockItemModal from '../../components/Modals/CreateStockItemModal';

interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  location: string;
  lastRestocked: Date;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstocked';
}

const mockStockItems: StockItem[] = [
  {
    id: '1',
    name: 'Laptop Chargers',
    sku: 'CHG-LAP-001',
    category: 'Electronics',
    currentStock: 5,
    minStock: 10,
    maxStock: 50,
    unitPrice: 2500,
    supplier: 'Tech Supplies Inc',
    location: 'IT Storage',
    lastRestocked: new Date('2024-01-15'),
    status: 'low-stock'
  },
  {
    id: '2',
    name: 'Office Chairs',
    sku: 'FUR-CHR-001',
    category: 'Furniture',
    currentStock: 25,
    minStock: 5,
    maxStock: 30,
    unitPrice: 15000,
    supplier: 'Office Depot',
    location: 'Warehouse',
    lastRestocked: new Date('2024-01-10'),
    status: 'in-stock'
  },
  {
    id: '3',
    name: 'Printer Paper',
    sku: 'SUP-PAP-001',
    category: 'Supplies',
    currentStock: 0,
    minStock: 20,
    maxStock: 100,
    unitPrice: 500,
    supplier: 'Office Supplies Co',
    location: 'Supply Room',
    lastRestocked: new Date('2024-01-05'),
    status: 'out-of-stock'
  },
  {
    id: '4',
    name: 'USB Cables',
    sku: 'CBL-USB-001',
    category: 'Electronics',
    currentStock: 75,
    minStock: 20,
    maxStock: 50,
    unitPrice: 800,
    supplier: 'Tech Supplies Inc',
    location: 'IT Storage',
    lastRestocked: new Date('2024-01-20'),
    status: 'overstocked'
  }
];

export default function StockLevels() {
  const [stockItems, setStockItems] = useState<StockItem[]>(mockStockItems);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      'in-stock': 'bg-green-100 text-green-800',
      'low-stock': 'bg-yellow-100 text-yellow-800',
      'out-of-stock': 'bg-red-100 text-red-800',
      'overstocked': 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock': return <Package className="h-4 w-4 text-green-600" />;
      case 'low-stock': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'out-of-stock': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'overstocked': return <TrendingDown className="h-4 w-4 text-blue-600" />;
      default: return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStockPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  const getCategories = () => {
    const categories = new Set(stockItems.map(item => item.category));
    return Array.from(categories);
  };

  const filteredItems = stockItems.filter(item => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  const handleCreateStockItem = (stockItemData: any) => {
    const newStockItem: StockItem = {
      id: stockItemData.id,
      name: stockItemData.name,
      sku: stockItemData.sku,
      category: stockItemData.category,
      currentStock: stockItemData.currentStock,
      minStock: stockItemData.minStock,
      maxStock: stockItemData.maxStock,
      unitPrice: stockItemData.unitPrice,
      supplier: stockItemData.supplier,
      location: stockItemData.location,
      lastRestocked: stockItemData.lastRestocked,
      status: stockItemData.status
    };
    
    setStockItems(prev => [...prev, newStockItem]);
    setIsCreateModalOpen(false);
  };

  const totalItems = stockItems.length;
  const lowStockItems = stockItems.filter(item => item.status === 'low-stock').length;
  const outOfStockItems = stockItems.filter(item => item.status === 'out-of-stock').length;
  const totalValue = stockItems.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Stock Levels</h1>
          <p className="mt-2 text-gray-600">
            Monitor inventory levels with low-stock alerts and automated reorder workflows.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" />
            Sync Inventory
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Add Stock Item
          </button>
        </div>
      </div>

      {/* Stock Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
              <p className="text-sm text-yellow-600 mt-1">Needs reorder</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockItems}</p>
              <p className="text-sm text-red-600 mt-1">Urgent action</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stock Items List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="overstocked">Overstocked</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {getCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Stock Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                        selectedItem?.id === item.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.sku}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.currentStock} / {item.maxStock}</div>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              item.status === 'out-of-stock' ? 'bg-red-500' :
                              item.status === 'low-stock' ? 'bg-yellow-500' :
                              item.status === 'overstocked' ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${getStockPercentage(item.currentStock, item.maxStock)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(item.status)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                            {item.status.replace('-', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{(item.currentStock * item.unitPrice).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {(item.status === 'low-stock' || item.status === 'out-of-stock') && (
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Item Detail Panel */}
        <div className="lg:col-span-1">
          {selectedItem ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Stock Item Details</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Item Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedItem.name}</h4>
                  <p className="text-sm text-gray-600">{selectedItem.sku}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusIcon(selectedItem.status)}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedItem.status)}`}>
                      {selectedItem.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {/* Stock Levels */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Stock Levels</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current:</span>
                      <span className="font-medium">{selectedItem.currentStock}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Minimum:</span>
                      <span className="font-medium">{selectedItem.minStock}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Maximum:</span>
                      <span className="font-medium">{selectedItem.maxStock}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          selectedItem.status === 'out-of-stock' ? 'bg-red-500' :
                          selectedItem.status === 'low-stock' ? 'bg-yellow-500' :
                          selectedItem.status === 'overstocked' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${getStockPercentage(selectedItem.currentStock, selectedItem.maxStock)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Item Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Category:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedItem.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Unit Price:</span>
                    <span className="text-sm font-medium text-gray-900">₹{selectedItem.unitPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Value:</span>
                    <span className="text-sm font-medium text-gray-900">₹{(selectedItem.currentStock * selectedItem.unitPrice).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Supplier:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedItem.supplier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Location:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedItem.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Last Restocked:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedItem.lastRestocked.toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {(selectedItem.status === 'low-stock' || selectedItem.status === 'out-of-stock') && (
                    <button className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200">
                      <ShoppingCart className="h-4 w-4" />
                      Create Reorder
                    </button>
                  )}
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <Package className="h-4 w-4" />
                    Update Stock
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No item selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a stock item to view details.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Stock Item Modal */}
      <CreateStockItemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateStockItem}
      />
    </div>
  );
}