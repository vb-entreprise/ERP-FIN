/**
 * Quality GDPR Settings Page
 * Author: VB Entreprise
 * 
 * GDPR compliance management with data protection settings
 */

import React, { useState } from 'react';
import { Shield, Download, Trash2, Eye, Lock, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

interface DataRequest {
  id: string;
  type: 'access' | 'deletion' | 'portability' | 'rectification';
  requester: string;
  email: string;
  submittedAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  dueDate: Date;
  assignedTo?: string;
}

interface DataCategory {
  id: string;
  name: string;
  description: string;
  retention: number; // days
  purpose: string;
  lawfulBasis: string;
  dataSubjects: number;
}

const mockDataRequests: DataRequest[] = [
  {
    id: '1',
    type: 'access',
    requester: 'John Smith',
    email: 'john@example.com',
    submittedAt: new Date('2024-01-20'),
    status: 'pending',
    dueDate: new Date('2024-02-19'),
    assignedTo: 'Data Protection Officer'
  },
  {
    id: '2',
    type: 'deletion',
    requester: 'Jane Doe',
    email: 'jane@example.com',
    submittedAt: new Date('2024-01-18'),
    status: 'completed',
    dueDate: new Date('2024-02-17'),
    assignedTo: 'Data Protection Officer'
  }
];

const mockDataCategories: DataCategory[] = [
  {
    id: '1',
    name: 'Customer Data',
    description: 'Personal information of customers and prospects',
    retention: 2555, // 7 years
    purpose: 'Customer relationship management and service delivery',
    lawfulBasis: 'Legitimate Interest',
    dataSubjects: 1250
  },
  {
    id: '2',
    name: 'Employee Data',
    description: 'Personal information of current and former employees',
    retention: 2555, // 7 years
    purpose: 'Employment management and legal compliance',
    lawfulBasis: 'Contract',
    dataSubjects: 45
  }
];

export default function GDPRSettings() {
  const [dataRequests] = useState<DataRequest[]>(mockDataRequests);
  const [dataCategories] = useState<DataCategory[]>(mockDataCategories);
  const [activeTab, setActiveTab] = useState<'requests' | 'categories' | 'settings'>('requests');

  const getRequestStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'access': return <Eye className="h-4 w-4" />;
      case 'deletion': return <Trash2 className="h-4 w-4" />;
      case 'portability': return <Download className="h-4 w-4" />;
      case 'rectification': return <FileText className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getDaysRemaining = (dueDate: Date) => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const tabs = [
    { id: 'requests', name: 'Data Requests', icon: Shield },
    { id: 'categories', name: 'Data Categories', icon: FileText },
    { id: 'settings', name: 'GDPR Settings', icon: Lock }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">GDPR Compliance</h1>
          <p className="mt-2 text-gray-600">
            Manage data protection compliance and privacy settings.
          </p>
        </div>
      </div>

      {/* GDPR Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Data Requests</p>
              <p className="text-2xl font-bold text-gray-900">{dataRequests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{dataRequests.filter(r => r.status === 'pending').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Data Categories</p>
              <p className="text-2xl font-bold text-gray-900">{dataCategories.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-gray-900">94%</p>
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
      {activeTab === 'requests' && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Data Subject Requests</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dataRequests.map((request) => {
                  const daysLeft = getDaysRemaining(request.dueDate);
                  return (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{request.requester}</div>
                          <div className="text-sm text-gray-500">{request.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getRequestTypeIcon(request.type)}
                          <span className="ml-2 text-sm text-gray-900 capitalize">{request.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRequestStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.assignedTo || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.dueDate.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${daysLeft < 7 ? 'text-red-600' : 'text-gray-900'}`}>
                          {daysLeft} days
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-6">
          {dataCategories.map((category) => (
            <div key={category.id} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                <span className="text-sm text-gray-500">{category.dataSubjects} data subjects</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Retention Period</p>
                  <p className="text-sm font-medium text-gray-900">{Math.round(category.retention / 365)} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Purpose</p>
                  <p className="text-sm font-medium text-gray-900">{category.purpose}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lawful Basis</p>
                  <p className="text-sm font-medium text-gray-900">{category.lawfulBasis}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">GDPR Configuration</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Data Protection Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Enable automatic data retention policies</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Log all data access and modifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Require explicit consent for data processing</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Send breach notifications within 72 hours</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Data Subject Rights</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request Response Time</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>30 days (GDPR Standard)</option>
                    <option>15 days</option>
                    <option>7 days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Protection Officer</label>
                  <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" defaultValue="dpo@vbenterprise.com" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}