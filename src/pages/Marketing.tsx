/**
 * Marketing Automation Page
 * Author: VB Entreprise
 * 
 * Email campaigns, lead scoring, ROI tracking, and automated workflows
 * for nurturing leads and measuring marketing effectiveness
 */

import React, { useState } from 'react';
import { Plus, Play, Pause, Edit, Trash2, Mail, Target, TrendingUp, Users, BarChart3, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockCampaigns } from '../data/mockData';
import CreateCampaignModal from '../components/Modals/CreateCampaignModal';

// Sample data for marketing analytics
const campaignPerformanceData = [
  { month: 'Jan', emailCampaigns: 12, socialCampaigns: 8, contentCampaigns: 5 },
  { month: 'Feb', emailCampaigns: 15, socialCampaigns: 12, contentCampaigns: 7 },
  { month: 'Mar', emailCampaigns: 18, socialCampaigns: 15, contentCampaigns: 9 },
  { month: 'Apr', emailCampaigns: 22, socialCampaigns: 18, contentCampaigns: 12 },
  { month: 'May', emailCampaigns: 25, socialCampaigns: 20, contentCampaigns: 15 },
  { month: 'Jun', emailCampaigns: 28, socialCampaigns: 22, contentCampaigns: 18 },
];

const leadSourceData = [
  { name: 'Email Campaigns', value: 45, color: '#2563EB' },
  { name: 'Social Media', value: 30, color: '#10B981' },
  { name: 'Content Marketing', value: 15, color: '#F59E0B' },
  { name: 'Direct Traffic', value: 10, color: '#EF4444' },
];

const emailTemplates = [
  { id: '1', name: 'Welcome Series', type: 'Onboarding', opens: '68%', clicks: '12%' },
  { id: '2', name: 'Product Demo Follow-up', type: 'Nurture', opens: '45%', clicks: '8%' },
  { id: '3', name: 'Proposal Reminder', type: 'Sales', opens: '72%', clicks: '15%' },
  { id: '4', name: 'Monthly Newsletter', type: 'Engagement', opens: '38%', clicks: '6%' },
];

export default function Marketing() {
  const [campaigns] = useState(mockCampaigns);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateCampaign = (campaignData: any) => {
    console.log('New campaign created:', campaignData);
    // In a real app, this would update the campaigns state
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { id: 'campaigns', name: 'Campaigns', icon: Target },
    { id: 'emails', name: 'Email Templates', icon: Mail },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'automation', name: 'Workflows', icon: TrendingUp },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Marketing Automation</h1>
          <p className="mt-2 text-gray-600">
            Create campaigns, track performance, and automate lead nurturing workflows.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Marketing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-green-600 mt-1">+3 this month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-green-600 mt-1">+18% this month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Mail className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Email Open Rate</p>
              <p className="text-2xl font-bold text-gray-900">42.5%</p>
              <p className="text-sm text-green-600 mt-1">+2.3% vs avg</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Campaign ROI</p>
              <p className="text-2xl font-bold text-gray-900">285%</p>
              <p className="text-sm text-green-600 mt-1">+12% this quarter</p>
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
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaigns List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Active Campaigns</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{campaign.name}</h4>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center capitalize">
                            <Target className="mr-1 h-4 w-4" />
                            {campaign.type}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            {campaign.startDate.toLocaleDateString()} - {campaign.endDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1 rounded">
                            <Play className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1 rounded">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Campaign Metrics */}
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Budget</p>
                        <p className="text-sm font-medium text-gray-900">₹{campaign.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Spent</p>
                        <p className="text-sm font-medium text-gray-900">₹{campaign.spent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Impressions</p>
                        <p className="text-sm font-medium text-gray-900">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">ROI</p>
                        <p className="text-sm font-medium text-green-600">{campaign.roi}x</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Budget Usage</span>
                        <span className="text-gray-900 font-medium">
                          {Math.round((campaign.spent / campaign.budget) * 100)}%
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lead Sources Chart */}
          <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Lead Sources</h3>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={leadSourceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${value}%`}
                    >
                      {leadSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {leadSourceData.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: source.color }}
                        ></div>
                        <span className="text-sm text-gray-600">{source.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{source.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                  <div className="text-sm font-medium text-blue-900">Create Email Campaign</div>
                  <div className="text-xs text-blue-700">Design and send newsletters</div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
                  <div className="text-sm font-medium text-green-900">Set Up Automation</div>
                  <div className="text-xs text-green-700">Create drip campaigns</div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
                  <div className="text-sm font-medium text-purple-900">Lead Scoring</div>
                  <div className="text-xs text-purple-700">Configure scoring rules</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'emails' && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Email Templates</h3>
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
              <Plus className="h-4 w-4" />
              New Template
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Click Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emailTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{template.opens}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{template.clicks}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
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
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance Trends</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={campaignPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="emailCampaigns" stroke="#2563EB" strokeWidth={2} name="Email" />
                <Line type="monotone" dataKey="socialCampaigns" stroke="#10B981" strokeWidth={2} name="Social" />
                <Line type="monotone" dataKey="contentCampaigns" stroke="#F59E0B" strokeWidth={2} name="Content" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'automation' && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Automation Workflows</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No workflows yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first automation workflow.</p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Create Workflow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCampaign}
      />
    </div>
  );
}