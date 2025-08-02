/**
 * Assets License & Warranty Tracking Page
 * Author: VB Entreprise
 * 
 * Software license management with expiry alerts,
 * warranty tracking, and cost amortization reports
 */

import React, { useState } from 'react';
import { Plus, AlertTriangle, Calendar, DollarSign, Key, Shield, Download, Bell } from 'lucide-react';
import CreateLicenseModal from '../../components/Modals/CreateLicenseModal';

interface License {
  id: string;
  name: string;
  vendor: string;
  type: 'subscription' | 'perpetual' | 'volume' | 'enterprise';
  seats: number;
  usedSeats: number;
  cost: number;
  purchaseDate: Date;
  expiryDate?: Date;
  renewalDate?: Date;
  autoRenewal: boolean;
  status: 'active' | 'expired' | 'expiring' | 'cancelled';
  assignedUsers: string[];
  licenseKey?: string;
}

interface Warranty {
  id: string;
  assetName: string;
  assetTag: string;
  vendor: string;
  warrantyType: 'standard' | 'extended' | 'premium';
  startDate: Date;
  endDate: Date;
  cost: number;
  coverage: string[];
  status: 'active' | 'expired' | 'expiring';
  claimsCount: number;
}

const mockLicenses: License[] = [
  {
    id: '1',
    name: 'Microsoft Office 365',
    vendor: 'Microsoft',
    type: 'subscription',
    seats: 50,
    usedSeats: 42,
    cost: 150000,
    purchaseDate: new Date('2023-01-01'),
    expiryDate: new Date('2024-12-31'),
    renewalDate: new Date('2024-11-01'),
    autoRenewal: true,
    status: 'active',
    assignedUsers: ['Sarah Johnson', 'Mike Chen', 'Lisa Wong'],
    licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX'
  },
  {
    id: '2',
    name: 'Adobe Creative Suite',
    vendor: 'Adobe',
    type: 'subscription',
    seats: 10,
    usedSeats: 8,
    cost: 240000,
    purchaseDate: new Date('2023-06-15'),
    expiryDate: new Date('2024-06-15'),
    renewalDate: new Date('2024-05-01'),
    autoRenewal: false,
    status: 'expiring',
    assignedUsers: ['Mike Chen', 'Design Team'],
    licenseKey: 'YYYYY-YYYYY-YYYYY-YYYYY'
  },
  {
    id: '3',
    name: 'Slack Pro',
    vendor: 'Slack',
    type: 'subscription',
    seats: 100,
    usedSeats: 75,
    cost: 80000,
    purchaseDate: new Date('2023-03-01'),
    expiryDate: new Date('2024-03-01'),
    renewalDate: new Date('2024-02-01'),
    autoRenewal: true,
    status: 'expiring',
    assignedUsers: ['All Employees'],
    licenseKey: 'ZZZZZ-ZZZZZ-ZZZZZ-ZZZZZ'
  }
];

const mockWarranties: Warranty[] = [
  {
    id: '1',
    assetName: 'MacBook Pro 16"',
    assetTag: 'LAP-001',
    vendor: 'Apple',
    warrantyType: 'standard',
    startDate: new Date('2023-06-15'),
    endDate: new Date('2026-06-15'),
    cost: 0,
    coverage: ['Hardware defects', 'Manufacturing issues'],
    status: 'active',
    claimsCount: 0
  },
  {
    id: '2',
    assetName: 'Dell UltraSharp Monitor',
    assetTag: 'MON-002',
    vendor: 'Dell',
    warrantyType: 'extended',
    startDate: new Date('2023-03-10'),
    endDate: new Date('2025-03-10'),
    cost: 5000,
    coverage: ['Hardware defects', 'Accidental damage', 'On-site service'],
    status: 'active',
    claimsCount: 1
  }
];

export default function LicenseTracking() {
  const [licenses, setLicenses] = useState<License[]>(mockLicenses);
  const [warranties] = useState<Warranty[]>(mockWarranties);
  const [activeTab, setActiveTab] = useState<'licenses' | 'warranties'>('licenses');
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      expiring: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      subscription: 'bg-blue-100 text-blue-800',
      perpetual: 'bg-green-100 text-green-800',
      volume: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDaysUntilExpiry = (expiryDate?: Date) => {
    if (!expiryDate) return null;
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUtilizationPercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const handleCreateLicense = (licenseData: any) => {
    const newLicense: License = {
      id: licenseData.id,
      name: licenseData.name,
      vendor: licenseData.vendor,
      type: licenseData.type,
      seats: licenseData.seats,
      usedSeats: licenseData.usedSeats,
      cost: licenseData.cost,
      purchaseDate: licenseData.purchaseDate,
      expiryDate: licenseData.expiryDate,
      renewalDate: licenseData.renewalDate,
      autoRenewal: licenseData.autoRenewal,
      status: licenseData.status,
      assignedUsers: licenseData.assignedUsers,
      licenseKey: licenseData.licenseKey
    };
    
    setLicenses(prev => [...prev, newLicense]);
    setIsCreateModalOpen(false);
  };

  const totalLicenseCost = licenses.reduce((sum, license) => sum + license.cost, 0);
  const expiringLicenses = licenses.filter(l => l.status === 'expiring').length;
  const totalSeats = licenses.reduce((sum, license) => sum + license.seats, 0);
  const usedSeats = licenses.reduce((sum, license) => sum + license.usedSeats, 0);

  const tabs = [
    { id: 'licenses', name: 'Software Licenses', icon: Key },
    { id: 'warranties', name: 'Warranties', icon: Shield }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">License & Warranty Tracking</h1>
          <p className="mt-2 text-gray-600">
            Manage software licenses, track warranties, and monitor expiry dates with automated alerts.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Add License
          </button>
        </div>
      </div>

      {/* License Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total License Cost</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalLicenseCost.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Annual</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">{expiringLicenses}</p>
              <p className="text-sm text-orange-600 mt-1">Needs attention</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Key className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Seat Utilization</p>
              <p className="text-2xl font-bold text-gray-900">{getUtilizationPercentage(usedSeats, totalSeats)}%</p>
              <p className="text-sm text-gray-500">{usedSeats}/{totalSeats} seats</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Warranties</p>
              <p className="text-2xl font-bold text-gray-900">{warranties.filter(w => w.status === 'active').length}</p>
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
      {activeTab === 'licenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Licenses List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {licenses.map((license) => {
                      const daysUntilExpiry = getDaysUntilExpiry(license.expiryDate);
                      return (
                        <tr 
                          key={license.id} 
                          className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                            selectedLicense?.id === license.id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => setSelectedLicense(license)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{license.name}</div>
                              <div className="text-sm text-gray-500">{license.vendor}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getTypeColor(license.type)}`}>
                              {license.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{license.usedSeats}/{license.seats}</div>
                            <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${getUtilizationPercentage(license.usedSeats, license.seats)}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(license.status)}`}>
                              {license.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {license.expiryDate && (
                              <div>
                                <div className="text-sm text-gray-900">{license.expiryDate.toLocaleDateString()}</div>
                                {daysUntilExpiry !== null && (
                                  <div className={`text-sm ${daysUntilExpiry < 30 ? 'text-red-600' : 'text-gray-500'}`}>
                                    {daysUntilExpiry > 0 ? `${daysUntilExpiry} days left` : 'Expired'}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{license.cost.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* License Detail Panel */}
          <div className="lg:col-span-1">
            {selectedLicense ? (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">License Details</h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* License Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{selectedLicense.name}</h4>
                    <p className="text-sm text-gray-600">{selectedLicense.vendor}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getTypeColor(selectedLicense.type)}`}>
                        {selectedLicense.type}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(selectedLicense.status)}`}>
                        {selectedLicense.status}
                      </span>
                    </div>
                  </div>

                  {/* Seat Utilization */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Seat Utilization</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Used:</span>
                        <span className="font-medium">{selectedLicense.usedSeats}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-medium">{selectedLicense.seats}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${getUtilizationPercentage(selectedLicense.usedSeats, selectedLicense.seats)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {getUtilizationPercentage(selectedLicense.usedSeats, selectedLicense.seats)}% utilized
                      </div>
                    </div>
                  </div>

                  {/* License Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Purchase Date:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedLicense.purchaseDate.toLocaleDateString()}</span>
                    </div>
                    {selectedLicense.expiryDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Expiry Date:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedLicense.expiryDate.toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Annual Cost:</span>
                      <span className="text-sm font-medium text-gray-900">₹{selectedLicense.cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Auto Renewal:</span>
                      <span className={`text-sm font-medium ${selectedLicense.autoRenewal ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedLicense.autoRenewal ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  {/* Assigned Users */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Assigned Users</h5>
                    <div className="space-y-2">
                      {selectedLicense.assignedUsers.slice(0, 5).map((user, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white mr-2">
                            {user.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm text-gray-900">{user}</span>
                        </div>
                      ))}
                      {selectedLicense.assignedUsers.length > 5 && (
                        <div className="text-sm text-gray-500">
                          +{selectedLicense.assignedUsers.length - 5} more users
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <Bell className="h-4 w-4" />
                      Set Renewal Reminder
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Download className="h-4 w-4" />
                      Export Report
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <div className="text-center text-gray-500">
                  <Key className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No license selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a license to view details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'warranties' && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Warranty Tracking</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claims</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {warranties.map((warranty) => {
                  const daysUntilExpiry = getDaysUntilExpiry(warranty.endDate);
                  return (
                    <tr key={warranty.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{warranty.assetName}</div>
                          <div className="text-sm text-gray-500">{warranty.assetTag}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {warranty.vendor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {warranty.warrantyType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(warranty.status)}`}>
                          {warranty.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{warranty.endDate.toLocaleDateString()}</div>
                        {daysUntilExpiry !== null && (
                          <div className={`text-sm ${daysUntilExpiry < 30 ? 'text-red-600' : 'text-gray-500'}`}>
                            {daysUntilExpiry > 0 ? `${daysUntilExpiry} days left` : 'Expired'}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {warranty.claimsCount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create License Modal */}
      <CreateLicenseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLicense}
      />
    </div>
  );
}