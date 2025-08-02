/**
 * BI & Reporting Page
 * Author: VB Entreprise
 * 
 * Business intelligence dashboard with custom report builder,
 * real-time analytics, and comprehensive performance metrics
 */

import React, { useState } from 'react';
import { Plus, Download, Filter, Calendar, TrendingUp, BarChart3, PieChart, LineChart, Users, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import CreateReportModal from '../components/Modals/CreateReportModal';

// Sample data for various reports
const revenueData = [
  { month: 'Jan', revenue: 180000, target: 200000, expenses: 120000 },
  { month: 'Feb', revenue: 220000, target: 210000, expenses: 140000 },
  { month: 'Mar', revenue: 245000, target: 220000, expenses: 155000 },
  { month: 'Apr', revenue: 280000, target: 250000, expenses: 170000 },
  { month: 'May', revenue: 320000, target: 280000, expenses: 185000 },
  { month: 'Jun', revenue: 285000, target: 300000, expenses: 175000 },
];

const clientAcquisitionData = [
  { month: 'Jan', newClients: 12, churnedClients: 2 },
  { month: 'Feb', newClients: 18, churnedClients: 3 },
  { month: 'Mar', newClients: 15, churnedClients: 1 },
  { month: 'Apr', newClients: 22, churnedClients: 4 },
  { month: 'May', newClients: 28, churnedClients: 2 },
  { month: 'Jun', newClients: 25, churnedClients: 3 },
];

const projectMarginData = [
  { name: 'Web Development', margin: 45, color: '#2563EB' },
  { name: 'Mobile Apps', margin: 38, color: '#10B981' },
  { name: 'Design Services', margin: 52, color: '#F59E0B' },
  { name: 'Consulting', margin: 65, color: '#EF4444' },
  { name: 'Maintenance', margin: 72, color: '#8B5CF6' },
];

const teamProductivityData = [
  { week: 'Week 1', hours: 320, billable: 280 },
  { week: 'Week 2', hours: 340, billable: 295 },
  { week: 'Week 3', hours: 315, billable: 275 },
  { week: 'Week 4', hours: 360, billable: 315 },
];

const savedReports = [
  { id: '1', name: 'Monthly Revenue Report', type: 'Financial', lastRun: '2024-01-22', frequency: 'Monthly' },
  { id: '2', name: 'Client Acquisition Analysis', type: 'Sales', lastRun: '2024-01-21', frequency: 'Weekly' },
  { id: '3', name: 'Project Profitability', type: 'Operations', lastRun: '2024-01-20', frequency: 'Quarterly' },
  { id: '4', name: 'Team Performance Dashboard', type: 'HR', lastRun: '2024-01-22', frequency: 'Daily' },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDateRange, setSelectedDateRange] = useState('last-30-days');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateReport = (reportData: any) => {
    console.log('New report created:', reportData);
    // In a real app, this would update the reports state
  };

  const tabs = [
    { id: 'dashboard', name: 'Executive Dashboard', icon: BarChart3 },
    { id: 'financial', name: 'Financial Reports', icon: DollarSign },
    { id: 'operational', name: 'Operational Metrics', icon: TrendingUp },
    { id: 'custom', name: 'Custom Reports', icon: PieChart },
  ];

  const dateRanges = [
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
    { value: 'this-year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Business Intelligence & Reporting</h1>
          <p className="mt-2 text-gray-600">
            Real-time dashboards, custom reports, and advanced analytics for data-driven decisions.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
          >
            {dateRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Report
          </button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹15.2L</p>
              <p className="text-sm text-green-600 mt-1">+18.5% vs last period</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">127</p>
              <p className="text-sm text-green-600 mt-1">+12 new this month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg Project Margin</p>
              <p className="text-2xl font-bold text-gray-900">54.2%</p>
              <p className="text-sm text-green-600 mt-1">+3.1% improvement</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Team Utilization</p>
              <p className="text-2xl font-bold text-gray-900">87.5%</p>
              <p className="text-sm text-green-600 mt-1">Optimal range</p>
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
              onClick={() => setActiveTab(tab.id)}
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
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Revenue & Financial Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Target</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                  <Bar dataKey="revenue" fill="#2563EB" name="Revenue" />
                  <Bar dataKey="target" fill="#E5E7EB" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Margins by Service</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={projectMarginData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="margin"
                    label={({ name, margin }) => `${name}: ${margin}%`}
                  >
                    {projectMarginData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Client Acquisition & Team Productivity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Acquisition Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={clientAcquisitionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="newClients" stroke="#10B981" strokeWidth={2} name="New Clients" />
                  <Line type="monotone" dataKey="churnedClients" stroke="#EF4444" strokeWidth={2} name="Churned" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Productivity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={teamProductivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="hours" stackId="1" stroke="#8884d8" fill="#8884d8" name="Total Hours" />
                  <Area type="monotone" dataKey="billable" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Billable Hours" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'financial' && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Performance</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#2563EB" fill="#2563EB" name="Revenue" />
                <Area type="monotone" dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Profit Margin</h4>
              <p className="text-3xl font-bold text-green-600">42.3%</p>
              <p className="text-sm text-gray-500 mt-1">+5.2% vs last quarter</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Cash Flow</h4>
              <p className="text-3xl font-bold text-blue-600">₹8.7L</p>
              <p className="text-sm text-gray-500 mt-1">Positive trend</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Outstanding AR</h4>
              <p className="text-3xl font-bold text-orange-600">₹2.1L</p>
              <p className="text-sm text-gray-500 mt-1">15 days avg collection</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'operational' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Delivery Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">On Time</span>
                  <span className="text-sm font-medium text-green-600">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Delayed</span>
                  <span className="text-sm font-medium text-yellow-600">15%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overdue</span>
                  <span className="text-sm font-medium text-red-600">7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '7%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Utilization</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Developers</span>
                  <span className="text-sm font-medium text-blue-600">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Designers</span>
                  <span className="text-sm font-medium text-purple-600">72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Marketers</span>
                  <span className="text-sm font-medium text-green-600">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="space-y-8">
          {/* Saved Reports */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Saved Reports</h3>
              <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                <Plus className="h-4 w-4" />
                Create Report
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Run</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {savedReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.lastRun}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.frequency}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                            <BarChart3 className="h-4 w-4" />
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

          {/* Report Builder */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Report Builder</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Source</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Projects</option>
                  <option>Clients</option>
                  <option>Finance</option>
                  <option>Team</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metrics</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Revenue</option>
                  <option>Profit Margin</option>
                  <option>Utilization</option>
                  <option>Client Satisfaction</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Last 30 Days</option>
                  <option>Last Quarter</option>
                  <option>Last Year</option>
                  <option>Custom Range</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Generate Report
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateReportModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateReport}
      />
    </div>
  );
}