/**
 * Assets Asset Register Page
 * Author: VB Entreprise
 * 
 * Asset management with tracking, assignment, warranty monitoring,
 * and depreciation calculations
 */

import React, { useState } from 'react';
import { Plus, Search, Filter, Package, User, Calendar, DollarSign, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import CreateAssetModal from '../../components/Modals/CreateAssetModal';

interface Asset {
  id: string;
  assetTag: string;
  name: string;
  type: 'laptop' | 'desktop' | 'monitor' | 'phone' | 'software' | 'furniture' | 'other';
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  assignedTo?: string;
  location: string;
  status: 'active' | 'maintenance' | 'retired' | 'lost' | 'disposed';
  warrantyExpiry?: Date;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  notes: string;
}

const mockAssets: Asset[] = [
  {
    id: '1',
    assetTag: 'LAP-001',
    name: 'MacBook Pro 16"',
    type: 'laptop',
    brand: 'Apple',
    model: 'MacBook Pro 16" M2',
    serialNumber: 'C02YW0XHJGH5',
    purchaseDate: new Date('2023-06-15'),
    purchasePrice: 250000,
    currentValue: 200000,
    assignedTo: 'Sarah Johnson',
    location: 'Mumbai Office',
    status: 'active',
    warrantyExpiry: new Date('2026-06-15'),
    condition: 'excellent',
    notes: 'Primary development machine'
  },
  {
    id: '2',
    assetTag: 'MON-002',
    name: 'Dell UltraSharp 27"',
    type: 'monitor',
    brand: 'Dell',
    model: 'U2720Q',
    serialNumber: 'CN-0P2415-74180-25A-02GU',
    purchaseDate: new Date('2023-03-10'),
    purchasePrice: 45000,
    currentValue: 35000,
    assignedTo: 'Mike Chen',
    location: 'Delhi Office',
    status: 'active',
    warrantyExpiry: new Date('2026-03-10'),
    condition: 'good',
    notes: 'Design workstation monitor'
  },
  {
    id: '3',
    assetTag: 'PHN-003',
    name: 'iPhone 14 Pro',
    type: 'phone',
    brand: 'Apple',
    model: 'iPhone 14 Pro 256GB',
    serialNumber: 'F2LN8QXNJK',
    purchaseDate: new Date('2023-01-20'),
    purchasePrice: 130000,
    currentValue: 90000,
    location: 'IT Storage',
    status: 'maintenance',
    warrantyExpiry: new Date('2024-01-20'),
    lastMaintenance: new Date('2024-01-15'),
    nextMaintenance: new Date('2024-01-25'),
    condition: 'fair',
    notes: 'Screen replacement needed'
  }
];

export default function Register() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      retired: 'bg-gray-100 text-gray-800',
      lost: 'bg-red-100 text-red-800',
      disposed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800'
    };
    return colors[condition as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'laptop':
      case 'desktop': return '💻';
      case 'monitor': return '🖥️';
      case 'phone': return '📱';
      case 'software': return '💿';
      case 'furniture': return '🪑';
      default: return '📦';
    }
  };

  const getWarrantyStatus = (warrantyExpiry?: Date) => {
    if (!warrantyExpiry) return { status: 'No Warranty', color: 'text-gray-500' };
    
    const today = new Date();
    const daysUntilExpiry = Math.ceil((warrantyExpiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: 'Expired', color: 'text-red-600' };
    if (daysUntilExpiry < 30) return { status: 'Expiring Soon', color: 'text-orange-600' };
    if (daysUntilExpiry < 90) return { status: 'Expires Soon', color: 'text-yellow-600' };
    return { status: 'Active', color: 'text-green-600' };
  };

  const calculateDepreciation = (purchasePrice: number, purchaseDate: Date) => {
    const today = new Date();
    const ageInYears = (today.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    const depreciationRate = 0.2; // 20% per year
    const depreciatedValue = purchasePrice * Math.pow(1 - depreciationRate, ageInYears);
    return Math.max(depreciatedValue, purchasePrice * 0.1); // Minimum 10% of original value
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalAssets = assets.length;
  const activeAssets = assets.filter(a => a.status === 'active').length;
  const maintenanceAssets = assets.filter(a => a.status === 'maintenance').length;
  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);

  const handleCreateAsset = (assetData: any) => {
    const newAsset: Asset = {
      id: assetData.id,
      assetTag: assetData.assetTag,
      name: assetData.name,
      type: assetData.type,
      brand: assetData.brand,
      model: assetData.model,
      serialNumber: assetData.serialNumber,
      purchaseDate: assetData.purchaseDate,
      purchasePrice: assetData.purchasePrice,
      currentValue: assetData.currentValue,
      assignedTo: assetData.assignedTo,
      location: assetData.location,
      status: assetData.status,
      warrantyExpiry: assetData.warrantyExpiry,
      condition: assetData.condition,
      notes: assetData.notes
    };
    
    setAssets(prev => [...prev, newAsset]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Asset Register</h1>
          <p className="mt-2 text-gray-600">
            Track assets, assignments, warranties, and depreciation across the organization.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Add Asset
          </button>
        </div>
      </div>

      {/* Asset Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">{totalAssets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activeAssets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">In Maintenance</p>
              <p className="text-2xl font-bold text-gray-900">{maintenanceAssets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assets List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="monitor">Monitor</option>
              <option value="phone">Phone</option>
              <option value="software">Software</option>
              <option value="furniture">Furniture</option>
              <option value="other">Other</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
              <option value="lost">Lost</option>
              <option value="disposed">Disposed</option>
            </select>
          </div>

          {/* Assets Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warranty</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssets.map((asset) => {
                    const warrantyStatus = getWarrantyStatus(asset.warrantyExpiry);
                    return (
                      <tr 
                        key={asset.id} 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                          selectedAsset?.id === asset.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedAsset(asset)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{getTypeIcon(asset.type)}</span>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                              <div className="text-sm text-gray-500">{asset.assetTag} • {asset.brand} {asset.model}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {asset.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {asset.assignedTo || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(asset.status)}`}>
                            {asset.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">₹{asset.currentValue.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">₹{asset.purchasePrice.toLocaleString()} original</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${warrantyStatus.color}`}>
                            {warrantyStatus.status}
                          </div>
                          {asset.warrantyExpiry && (
                            <div className="text-sm text-gray-500">{asset.warrantyExpiry.toLocaleDateString()}</div>
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

        {/* Asset Detail Panel */}
        <div className="lg:col-span-1">
          {selectedAsset ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Asset Details</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Asset Header */}
                <div className="text-center">
                  <span className="text-4xl">{getTypeIcon(selectedAsset.type)}</span>
                  <h4 className="mt-2 text-lg font-medium text-gray-900">{selectedAsset.name}</h4>
                  <p className="text-sm text-gray-600">{selectedAsset.assetTag}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(selectedAsset.status)}`}>
                      {selectedAsset.status}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getConditionColor(selectedAsset.condition)}`}>
                      {selectedAsset.condition}
                    </span>
                  </div>
                </div>

                {/* Asset Information */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Brand:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedAsset.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Model:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedAsset.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Serial Number:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedAsset.serialNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Purchase Date:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedAsset.purchaseDate.toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Assignment */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Assignment</h5>
                  {selectedAsset.assignedTo ? (
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <User className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <span className="text-sm font-medium text-green-900">{selectedAsset.assignedTo}</span>
                        <div className="flex items-center text-xs text-green-700">
                          <MapPin className="h-3 w-3 mr-1" />
                          {selectedAsset.location}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Package className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <span className="text-sm text-gray-600">Unassigned</span>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {selectedAsset.location}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Financial Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Financial Information</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Purchase Price:</span>
                      <span className="font-medium text-gray-900">₹{selectedAsset.purchasePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current Value:</span>
                      <span className="font-medium text-gray-900">₹{selectedAsset.currentValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Depreciation:</span>
                      <span className="font-medium text-red-600">
                        ₹{(selectedAsset.purchasePrice - selectedAsset.currentValue).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Warranty Information */}
                {selectedAsset.warrantyExpiry && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Warranty</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Expires:</span>
                        <span className="font-medium text-gray-900">{selectedAsset.warrantyExpiry.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${getWarrantyStatus(selectedAsset.warrantyExpiry).color}`}>
                          {getWarrantyStatus(selectedAsset.warrantyExpiry).status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Maintenance */}
                {selectedAsset.lastMaintenance && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Maintenance</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Service:</span>
                        <span className="font-medium text-gray-900">{selectedAsset.lastMaintenance.toLocaleDateString()}</span>
                      </div>
                      {selectedAsset.nextMaintenance && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Next Service:</span>
                          <span className="font-medium text-gray-900">{selectedAsset.nextMaintenance.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedAsset.notes && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Notes</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedAsset.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No asset selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select an asset to view detailed information.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Asset Modal */}
      <CreateAssetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAsset}
      />
    </div>
  );
}