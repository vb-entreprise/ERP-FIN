/**
 * Reports Ad-Hoc Report Builder Page
 * Author: VB Entreprise
 * 
 * Drag-and-drop report builder with data sources, metrics selection,
 * filters, grouping, and export capabilities
 */

import React, { useState } from 'react';
import { Plus, Database, BarChart3, Filter, Download, Play, Save, Settings } from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: 'table' | 'view' | 'api';
  description: string;
  fields: Field[];
}

interface Field {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  description: string;
}

interface ReportConfig {
  dataSources: string[];
  metrics: string[];
  dimensions: string[];
  filters: FilterConfig[];
  groupBy: string[];
  sortBy: string[];
  limit?: number;
}

interface FilterConfig {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: string | number | Date;
}

const mockDataSources: DataSource[] = [
  {
    id: 'leads',
    name: 'Leads',
    type: 'table',
    description: 'Customer leads and prospects',
    fields: [
      { id: 'name', name: 'Lead Name', type: 'string', description: 'Full name of the lead' },
      { id: 'company', name: 'Company', type: 'string', description: 'Company name' },
      { id: 'value', name: 'Deal Value', type: 'number', description: 'Potential deal value' },
      { id: 'created_at', name: 'Created Date', type: 'date', description: 'When lead was created' },
      { id: 'status', name: 'Status', type: 'string', description: 'Lead status' }
    ]
  },
  {
    id: 'projects',
    name: 'Projects',
    type: 'table',
    description: 'Project management data',
    fields: [
      { id: 'name', name: 'Project Name', type: 'string', description: 'Project title' },
      { id: 'client', name: 'Client', type: 'string', description: 'Client name' },
      { id: 'budget', name: 'Budget', type: 'number', description: 'Project budget' },
      { id: 'actual', name: 'Actual Cost', type: 'number', description: 'Actual spent amount' },
      { id: 'start_date', name: 'Start Date', type: 'date', description: 'Project start date' },
      { id: 'status', name: 'Status', type: 'string', description: 'Project status' }
    ]
  },
  {
    id: 'invoices',
    name: 'Invoices',
    type: 'table',
    description: 'Billing and invoice data',
    fields: [
      { id: 'number', name: 'Invoice Number', type: 'string', description: 'Invoice identifier' },
      { id: 'client', name: 'Client', type: 'string', description: 'Client name' },
      { id: 'amount', name: 'Amount', type: 'number', description: 'Invoice amount' },
      { id: 'due_date', name: 'Due Date', type: 'date', description: 'Payment due date' },
      { id: 'status', name: 'Status', type: 'string', description: 'Payment status' }
    ]
  }
];

export default function Builder() {
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    dataSources: [],
    metrics: [],
    dimensions: [],
    filters: [],
    groupBy: [],
    sortBy: []
  });
  const [reportName, setReportName] = useState('');

  const addMetric = (fieldId: string) => {
    if (!reportConfig.metrics.includes(fieldId)) {
      setReportConfig(prev => ({
        ...prev,
        metrics: [...prev.metrics, fieldId]
      }));
    }
  };

  const addDimension = (fieldId: string) => {
    if (!reportConfig.dimensions.includes(fieldId)) {
      setReportConfig(prev => ({
        ...prev,
        dimensions: [...prev.dimensions, fieldId]
      }));
    }
  };

  const removeMetric = (fieldId: string) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics.filter(m => m !== fieldId)
    }));
  };

  const removeDimension = (fieldId: string) => {
    setReportConfig(prev => ({
      ...prev,
      dimensions: prev.dimensions.filter(d => d !== fieldId)
    }));
  };

  const getFieldName = (fieldId: string) => {
    if (!selectedDataSource) return fieldId;
    const field = selectedDataSource.fields.find(f => f.id === fieldId);
    return field ? field.name : fieldId;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Ad-Hoc Report Builder</h1>
          <p className="mt-2 text-gray-600">
            Create custom reports with drag-and-drop fields, filters, and grouping.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Save className="h-4 w-4" />
            Save Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Play className="h-4 w-4" />
            Run Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Data Sources Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Data Sources</h3>
            </div>
            <div className="p-4 space-y-3">
              {mockDataSources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => setSelectedDataSource(source)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors duration-200 ${
                    selectedDataSource?.id === source.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <Database className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{source.name}</div>
                      <div className="text-xs text-gray-500">{source.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Available Fields */}
          {selectedDataSource && (
            <div className="mt-6 bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Available Fields</h3>
              </div>
              <div className="p-4 space-y-2">
                {selectedDataSource.fields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900">{field.name}</div>
                      <div className="text-xs text-gray-500">{field.type}</div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => addMetric(field.id)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                      >
                        Metric
                      </button>
                      <button
                        onClick={() => addDimension(field.id)}
                        className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                      >
                        Dimension
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Report Builder Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Report Configuration</h3>
                <input
                  type="text"
                  placeholder="Report Name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Metrics Section */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Metrics (What to measure)</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-24">
                  {reportConfig.metrics.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {reportConfig.metrics.map((metric) => (
                        <span
                          key={metric}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {getFieldName(metric)}
                          <button
                            onClick={() => removeMetric(metric)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <BarChart3 className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm">Drag metrics here or click "Metric" on fields</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Dimensions Section */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Dimensions (How to group)</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-24">
                  {reportConfig.dimensions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {reportConfig.dimensions.map((dimension) => (
                        <span
                          key={dimension}
                          className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {getFieldName(dimension)}
                          <button
                            onClick={() => removeDimension(dimension)}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Filter className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm">Drag dimensions here or click "Dimension" on fields</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Filters Section */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Filters</h4>
                <div className="border border-gray-300 rounded-lg p-4">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Plus className="h-4 w-4" />
                    Add Filter
                  </button>
                </div>
              </div>

              {/* Report Preview */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Preview</h4>
                <div className="border border-gray-300 rounded-lg p-8">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Report Preview</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Configure metrics and dimensions, then click "Run Report" to see results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}