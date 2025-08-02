/**
 * Reports Pre-Built Dashboards Page
 * Author: VB Entreprise
 * 
 * Financial health, resource utilization, and project health dashboards
 * with interactive widgets and real-time data visualization
 */

import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Filter, Download, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Sample data for dashboards
const financialData = [
  { month: 'Jan', revenue: 450000, expenses: 320000, profit: 130000 },
  { month: 'Feb', revenue: 520000, expenses: 350000, profit: 170000 },
  { month: 'Mar', revenue: 480000, expenses: 340000, profit: 140000 },
  { month: 'Apr', revenue: 580000, expenses: 380000, profit: 200000 },
  { month: 'May', revenue: 620000, expenses: 400000, profit: 220000 },
  { month: 'Jun', revenue: 680000, expenses: 420000, profit: 260000 }
];

const utilizationData = [
  { name: 'Billable Hours', value: 75, color: '#10B981' },
  { name: 'Internal Projects', value: 15, color: '#3B82F6' },
  { name: 'Training', value: 5, color: '#F59E0B' },
  { name: 'Bench Time', value: 5, color: '#EF4444' }
];

const projectHealthData = [
  { status: 'On Track', count: 12, percentage: 60, color: '#10B981' },
  { status: 'At Risk', count: 6, percentage: 30, color: '#F59E0B' },
  { status: 'Delayed', count: 2, percentage: 10, color: '#EF4444' }
];

const teamProductivityData = [
  { week: 'Week 1', planned: 320, actual: 315, efficiency: 98 },
  { week: 'Week 2', planned: 340, actual: 350, efficiency: 103 },
  { week: 'Week 3', planned: 330, actual: 325, efficiency: 98 },
  { week: 'Week 4', planned: 360, actual: 375, efficiency: 104 }
];

export default function Dashboards() {
  const [selectedDashboard, setSelectedDashboard] = useState('financial');
  const [dateRange, setDateRange] = useState('last-6-months');

  const dashboards = [
    { id: 'financial', name: 'Financial Health', icon: DollarSign },
    { id: 'utilization', name: 'Resource Utilization', icon: Users },
    { id: 'projects', name: 'Project Health', icon: BarChart3 },
    { id: 'productivity', name: 'Team Productivity', icon: TrendingUp }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Pre-Built Dashboards</h1>
          <p className="mt-2 text-gray-600">
            Financial health, resource utilization, and project performance analytics.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-6-months">Last 6 Months</option>
            <option value="this-year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Dashboard Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {dashboards.map((dashboard) => (
            <button
              key={dashboard.id}
              onClick={() => setSelectedDashboard(dashboard.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                selectedDashboard === dashboard.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <dashboard.icon className="h-5 w-5 mr-2" />
              {dashboard.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Content */}
      {selectedDashboard === 'financial' && (
        <div className="space-y-8">
          {/* Financial KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹33.3L</p>
                  <p className="text-sm text-green-600 mt-1">+15.2% vs last period</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Profit Margin</p>
                  <p className="text-2xl font-bold text-gray-900">38.2%</p>
                  <p className="text-sm text-green-600 mt-1">+2.1% vs last period</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Burn Rate</p>
                  <p className="text-2xl font-bold text-gray-900">₹4.2L</p>
                  <p className="text-sm text-red-600 mt-1">+5.8% vs last month</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Cash Flow</p>
                  <p className="text-2xl font-bold text-gray-900">₹12.8L</p>
                  <p className="text-sm text-green-600 mt-1">Positive trend</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue vs Expenses Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10B981" fill="#10B981" name="Revenue" />
                <Area type="monotone" dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selectedDashboard === 'utilization' && (
        <div className="space-y-8">
          {/* Utilization Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Allocation</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={utilizationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {utilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billable vs Bench Time</h3>
              <div className="space-y-4">
                {utilizationData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.name}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ width: `${item.value}%`, backgroundColor: item.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedDashboard === 'projects' && (
        <div className="space-y-8">
          {/* Project Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectHealthData.map((status, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{status.status}</p>
                    <p className="text-2xl font-bold text-gray-900">{status.count}</p>
                    <p className="text-sm text-gray-500">{status.percentage}% of projects</p>
                  </div>
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: status.color }}
                  >
                    {status.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* On-time vs On-budget Ratios */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">On-Time Delivery</h4>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">85%</div>
                  <div className="text-sm text-gray-500">Projects delivered on time</div>
                </div>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Budget Adherence</h4>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">92%</div>
                  <div className="text-sm text-gray-500">Projects within budget</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedDashboard === 'productivity' && (
        <div className="space-y-8">
          {/* Team Productivity Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Productivity Trends</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={teamProductivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="planned" fill="#94A3B8" name="Planned Hours" />
                <Bar dataKey="actual" fill="#3B82F6" name="Actual Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Efficiency Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">101%</div>
                <div className="text-sm text-gray-500">Average Efficiency</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1,365</div>
                <div className="text-sm text-gray-500">Total Hours</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24</div>
                <div className="text-sm text-gray-500">Active Team Members</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">78%</div>
                <div className="text-sm text-gray-500">Capacity Utilization</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}