/**
 * Reports Scheduled Exports Page
 * Author: VB Entreprise
 * 
 * Setup scheduled reports with format selection, frequency configuration,
 * and destination management (email, cloud storage, SFTP)
 */

import React, { useState } from 'react';
import { Plus, Calendar, Mail, Cloud, Server, Download, Play, Pause, Edit, Trash2 } from 'lucide-react';

interface ScheduledExport {
  id: string;
  name: string;
  reportType: string;
  format: 'CSV' | 'PDF' | 'Excel';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  destination: 'email' | 'cloud' | 'sftp';
  destinationConfig: any;
  lastRun?: Date;
  nextRun: Date;
  status: 'active' | 'paused' | 'failed';
  recipients?: string[];
}

const mockScheduledExports: ScheduledExport[] = [
  {
    id: '1',
    name: 'Monthly Financial Report',
    reportType: 'Financial Dashboard',
    format: 'PDF',
    frequency: 'monthly',
    destination: 'email',
    destinationConfig: { subject: 'Monthly Financial Report' },
    lastRun: new Date('2024-01-01'),
    nextRun: new Date('2024-02-01'),
    status: 'active',
    recipients: ['ceo@vbenterprise.com', 'cfo@vbenterprise.com']
  },
  {
    id: '2',
    name: 'Weekly Project Status',
    reportType: 'Project Health',
    format: 'Excel',
    frequency: 'weekly',
    destination: 'cloud',
    destinationConfig: { folder: '/reports/weekly' },
    lastRun: new Date('2024-01-22'),
    nextRun: new Date('2024-01-29'),
    status: 'active'
  },
  {
    id: '3',
    name: 'Daily Lead Report',
    reportType: 'CRM Leads',
    format: 'CSV',
    frequency: 'daily',
    destination: 'sftp',
    destinationConfig: { server: 'reports.company.com', path: '/daily' },
    lastRun: new Date('2024-01-22'),
    nextRun: new Date('2024-01-23'),
    status: 'paused'
  }
];

export default function Exports() {
  const [scheduledExports] = useState<ScheduledExport[]>(mockScheduledExports);
  const [selectedExport, setSelectedExport] = useState<ScheduledExport | null>(null);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getFormatColor = (format: string) => {
    const colors = {
      CSV: 'bg-blue-100 text-blue-800',
      PDF: 'bg-red-100 text-red-800',
      Excel: 'bg-green-100 text-green-800'
    };
    return colors[format as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDestinationIcon = (destination: string) => {
    switch (destination) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'cloud': return <Cloud className="h-4 w-4" />;
      case 'sftp': return <Server className="h-4 w-4" />;
      default: return <Download className="h-4 w-4" />;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Scheduled Exports</h1>
          <p className="mt-2 text-gray-600">
            Automate report delivery with scheduled exports to email, cloud storage, or SFTP.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200">
            <Plus className="h-4 w-4" />
            New Scheduled Export
          </button>
        </div>
      </div>

      {/* Export Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Exports</p>
              <p className="text-2xl font-bold text-gray-900">{scheduledExports.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Play className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {scheduledExports.filter(e => e.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Pause className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Paused</p>
              <p className="text-2xl font-bold text-gray-900">
                {scheduledExports.filter(e => e.status === 'paused').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Download className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
              <p className="text-sm text-gray-500">Reports delivered</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scheduled Exports List */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Export</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Run</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scheduledExports.map((exportItem) => (
                    <tr 
                      key={exportItem.id} 
                      className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                        selectedExport?.id === exportItem.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedExport(exportItem)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{exportItem.name}</div>
                          <div className="text-sm text-gray-500">{exportItem.reportType}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFormatColor(exportItem.format)}`}>
                          {exportItem.format}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {exportItem.frequency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getDestinationIcon(exportItem.destination)}
                          <span className="ml-2 text-sm text-gray-900 capitalize">{exportItem.destination}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(exportItem.status)}`}>
                          {exportItem.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {exportItem.nextRun.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-green-600 hover:text-green-900 p-1 rounded">
                            <Play className="h-4 w-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1 rounded">
                            <Trash2 className="h-4 w-4" />
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

        {/* Export Detail Panel */}
        <div className="lg:col-span-1">
          {selectedExport ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Export Details</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Export Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedExport.name}</h4>
                  <p className="text-sm text-gray-600">{selectedExport.reportType}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFormatColor(selectedExport.format)}`}>
                      {selectedExport.format}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(selectedExport.status)}`}>
                      {selectedExport.status}
                    </span>
                  </div>
                </div>

                {/* Schedule Info */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Frequency:</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{selectedExport.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Last Run:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedExport.lastRun ? selectedExport.lastRun.toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Next Run:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedExport.nextRun.toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Destination Config */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Destination</h5>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    {getDestinationIcon(selectedExport.destination)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 capitalize">{selectedExport.destination}</p>
                      {selectedExport.destination === 'email' && selectedExport.recipients && (
                        <p className="text-xs text-gray-500">{selectedExport.recipients.length} recipients</p>
                      )}
                      {selectedExport.destination === 'cloud' && (
                        <p className="text-xs text-gray-500">{selectedExport.destinationConfig.folder}</p>
                      )}
                      {selectedExport.destination === 'sftp' && (
                        <p className="text-xs text-gray-500">{selectedExport.destinationConfig.server}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recipients (for email) */}
                {selectedExport.destination === 'email' && selectedExport.recipients && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Recipients</h5>
                    <div className="space-y-2">
                      {selectedExport.recipients.map((recipient, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{recipient}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                    <Play className="h-4 w-4" />
                    Run Now
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <Edit className="h-4 w-4" />
                    Edit Schedule
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <Download className="h-4 w-4" />
                    Download Last
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No export selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a scheduled export to view details.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}