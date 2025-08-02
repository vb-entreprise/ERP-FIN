/**
 * Marketing Analytics Page
 * Author: VB Entreprise
 * 
 * Dashboard with traffic sources, conversion funnels, and A/B test results
 * with side-by-side metrics comparison
 */

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, MousePointer, Eye, Target, Calendar, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, FunnelChart } from 'recharts';

// Sample data for analytics
const trafficSourceData = [
  { name: 'Organic Search', visitors: 4500, conversions: 180, color: '#10B981' },
  { name: 'Direct Traffic', visitors: 3200, conversions: 128, color: '#3B82F6' },
  { name: 'Social Media', visitors: 2800, conversions: 84, color: '#8B5CF6' },
  { name: 'Email Marketing', visitors: 1900, conversions: 95, color: '#F59E0B' },
  { name: 'Paid Ads', visitors: 1500, conversions: 75, color: '#EF4444' },
  { name: 'Referrals', visitors: 800, conversions: 32, color: '#6B7280' }
];

const conversionFunnelData = [
  { stage: 'Website Visitors', count: 14700, percentage: 100 },
  { stage: 'Landing Page Views', count: 8820, percentage: 60 },
  { stage: 'Form Starts', count: 2646, percentage: 18 },
  { stage: 'Form Completions', count: 1323, percentage: 9 },
  { stage: 'Qualified Leads', count: 594, percentage: 4 },
  { stage: 'Customers', count: 147, percentage: 1 }
];

const monthlyTrendsData = [
  { month: 'Jan', visitors: 12500, leads: 450, customers: 89 },
  { month: 'Feb', visitors: 13800, leads: 520, customers: 102 },
  { month: 'Mar', visitors: 15200, leads: 580, customers: 118 },
  { month: 'Apr', visitors: 14100, leads: 495, customers: 95 },
  { month: 'May', visitors: 16800, leads: 672, customers: 134 },
  { month: 'Jun', visitors: 18200, leads: 728, customers: 156 }
];

const abTestResults = [
  {
    id: '1',
    name: 'Homepage Hero Section',
    variants: [
      { name: 'Control', traffic: 50, conversions: 3.2, confidence: 95 },
      { name: 'Variant A', traffic: 50, conversions: 4.1, confidence: 98 }
    ],
    winner: 'Variant A',
    improvement: 28.1,
    status: 'completed'
  },
  {
    id: '2',
    name: 'Contact Form CTA',
    variants: [
      { name: 'Control', traffic: 33, conversions: 2.8, confidence: 92 },
      { name: 'Variant B', traffic: 33, conversions: 3.5, confidence: 89 },
      { name: 'Variant C', traffic: 34, conversions: 4.2, confidence: 96 }
    ],
    winner: 'Variant C',
    improvement: 50.0,
    status: 'completed'
  }
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [selectedMetric, setSelectedMetric] = useState('conversions');

  const totalVisitors = trafficSourceData.reduce((sum, source) => sum + source.visitors, 0);
  const totalConversions = trafficSourceData.reduce((sum, source) => sum + source.conversions, 0);
  const overallConversionRate = ((totalConversions / totalVisitors) * 100).toFixed(2);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Marketing Analytics</h1>
          <p className="mt-2 text-gray-600">
            Track traffic sources, conversion funnels, and A/B test performance.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-90-days">Last 90 Days</option>
            <option value="this-year">This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{totalVisitors.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+12.5% vs last period</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Conversions</p>
              <p className="text-2xl font-bold text-gray-900">{totalConversions}</p>
              <p className="text-sm text-green-600 mt-1">+18.3% vs last period</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{overallConversionRate}%</p>
              <p className="text-sm text-green-600 mt-1">+2.1% vs last period</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Tests</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-blue-600 mt-1">2 completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trafficSourceData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="visitors"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {trafficSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value.toLocaleString(), 'Visitors']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="visitors" stroke="#3B82F6" strokeWidth={2} name="Visitors" />
              <Line type="monotone" dataKey="leads" stroke="#10B981" strokeWidth={2} name="Leads" />
              <Line type="monotone" dataKey="customers" stroke="#F59E0B" strokeWidth={2} name="Customers" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
        <div className="space-y-4">
          {conversionFunnelData.map((stage, index) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">{stage.count.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 ml-2">({stage.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${stage.percentage}%` }}
                ></div>
              </div>
              {index < conversionFunnelData.length - 1 && (
                <div className="text-xs text-red-600 mt-1">
                  Drop-off: {((conversionFunnelData[index].count - conversionFunnelData[index + 1].count) / conversionFunnelData[index].count * 100).toFixed(1)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* A/B Test Results */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">A/B Test Results</h3>
        </div>
        <div className="p-6 space-y-6">
          {abTestResults.map((test) => (
            <div key={test.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">{test.name}</h4>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  test.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {test.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {test.variants.map((variant, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 ${
                    variant.name === test.winner ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{variant.name}</h5>
                      {variant.name === test.winner && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Winner</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Traffic:</span>
                        <span className="font-medium">{variant.traffic}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Conversion:</span>
                        <span className="font-medium">{variant.conversions}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="font-medium">{variant.confidence}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {test.status === 'completed' && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>{test.winner}</strong> won with a <strong>{test.improvement}%</strong> improvement in conversion rate.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}