/**
 * Marketing Campaigns Page
 * Author: VB Entreprise
 * 
 * Campaign management with list/calendar view, campaign builder,
 * performance tracking, and automated scheduling
 */

import React, { useState } from 'react';
import { Plus, Calendar, BarChart3, Play, Pause, Edit, Trash2, Mail, Share2, Target, TrendingUp, Users, Eye, MousePointer } from 'lucide-react';
import CreateCampaignModal from '../../components/Modals/CreateCampaignModal';
import TestModal from '../../components/Modals/TestModal';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'content' | 'ppc' | 'seo';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  audience: string;
  template: string;
  metrics: {
    impressions: number;
    clicks: number;
    opens: number;
    conversions: number;
    ctr: number;
    openRate: number;
    conversionRate: number;
  };
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Q1 Lead Generation Campaign',
    type: 'email',
    status: 'active',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-15'),
    budget: 50000,
    spent: 22500,
    audience: 'Prospects',
    template: 'Lead Nurture Series',
    metrics: {
      impressions: 45000,
      clicks: 1200,
      opens: 15300,
      conversions: 85,
      ctr: 2.67,
      openRate: 34.0,
      conversionRate: 7.08
    }
  },
  {
    id: '2',
    name: 'Social Media Brand Awareness',
    type: 'social',
    status: 'active',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-02-29'),
    budget: 75000,
    spent: 45000,
    audience: 'Website Visitors',
    template: 'Brand Awareness',
    metrics: {
      impressions: 125000,
      clicks: 3200,
      opens: 0,
      conversions: 45,
      ctr: 2.56,
      openRate: 0,
      conversionRate: 1.41
    }
  },
  {
    id: '3',
    name: 'Content Marketing Blog Series',
    type: 'content',
    status: 'scheduled',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-04-30'),
    budget: 30000,
    spent: 0,
    audience: 'Industry Professionals',
    template: 'Educational Content',
    metrics: {
      impressions: 0,
      clicks: 0,
      opens: 0,
      conversions: 0,
      ctr: 0,
      openRate: 0,
      conversionRate: 0
    }
  }
];

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      email: 'bg-blue-100 text-blue-800',
      social: 'bg-purple-100 text-purple-800',
      content: 'bg-green-100 text-green-800',
      ppc: 'bg-orange-100 text-orange-800',
      seo: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'social': return <Share2 className="h-4 w-4" />;
      case 'content': return <Edit className="h-4 w-4" />;
      case 'ppc': return <Target className="h-4 w-4" />;
      case 'seo': return <TrendingUp className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.metrics.conversions, 0);

  const handleCreateCampaign = (campaignData: any) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: campaignData.id
    };
    
    setCampaigns(prev => [newCampaign, ...prev]);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Marketing Campaigns</h1>
          <p className="mt-2 text-gray-600">
            Create, schedule, and track email, social media, and content marketing campaigns.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'list' 
                  ? 'bg-blue-50 text-blue-700 border-r border-gray-300' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'calendar' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Calendar
            </button>
          </div>
          <button 
            onClick={() => {
              console.log('Opening modal, current state:', isCreateModalOpen);
              setIsCreateModalOpen(true);
              console.log('Modal state after set:', true);
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </button>
          <button 
            onClick={() => setIsTestModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors duration-200"
          >
            Test Modal
          </button>
        </div>
      </div>

      {/* Campaign Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalBudget.toLocaleString()}</p>
              <p className="text-sm text-gray-500">₹{totalSpent.toLocaleString()} spent</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Play className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{activeCampaigns.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Conversions</p>
              <p className="text-2xl font-bold text-gray-900">{totalConversions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg. ROI</p>
              <p className="text-2xl font-bold text-gray-900">285%</p>
              <p className="text-sm text-green-600">+12% vs last quarter</p>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaigns List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="email">Email</option>
                <option value="social">Social Media</option>
                <option value="content">Content</option>
                <option value="ppc">PPC</option>
                <option value="seo">SEO</option>
              </select>
            </div>

            {/* Campaigns Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCampaigns.map((campaign) => (
                      <tr 
                        key={campaign.id} 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                          selectedCampaign?.id === campaign.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedCampaign(campaign)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getTypeIcon(campaign.type)}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                              <div className="text-sm text-gray-500">{campaign.audience}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getTypeColor(campaign.type)}`}>
                            {campaign.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {campaign.type === 'email' ? (
                              <>
                                <div>Opens: {campaign.metrics.openRate}%</div>
                                <div>CTR: {campaign.metrics.ctr}%</div>
                              </>
                            ) : (
                              <>
                                <div>CTR: {campaign.metrics.ctr}%</div>
                                <div>Conv: {campaign.metrics.conversionRate}%</div>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₹{campaign.spent.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">of ₹{campaign.budget.toLocaleString()}</div>
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                            <div 
                              className="bg-blue-600 h-1 rounded-full" 
                              style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                            ></div>
                          </div>
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

          {/* Campaign Detail Panel */}
          <div className="lg:col-span-1">
            {selectedCampaign ? (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Campaign Performance</h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Campaign Header */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{selectedCampaign.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getTypeColor(selectedCampaign.type)}`}>
                        {selectedCampaign.type}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(selectedCampaign.status)}`}>
                        {selectedCampaign.status}
                      </span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Eye className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                      <div className="text-lg font-semibold text-gray-900">
                        {selectedCampaign.metrics.impressions.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Impressions</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <MousePointer className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <div className="text-lg font-semibold text-gray-900">
                        {selectedCampaign.metrics.clicks.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Clicks</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Target className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                      <div className="text-lg font-semibold text-gray-900">
                        {selectedCampaign.metrics.conversions}
                      </div>
                      <div className="text-xs text-gray-500">Conversions</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                      <div className="text-lg font-semibold text-gray-900">
                        {selectedCampaign.metrics.ctr}%
                      </div>
                      <div className="text-xs text-gray-500">CTR</div>
                    </div>
                  </div>

                  {/* Budget Progress */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Budget Usage</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Spent:</span>
                        <span className="font-medium">₹{selectedCampaign.spent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-medium">₹{selectedCampaign.budget.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(selectedCampaign.spent / selectedCampaign.budget) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((selectedCampaign.spent / selectedCampaign.budget) * 100)}% used
                      </div>
                    </div>
                  </div>

                  {/* Campaign Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Audience:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedCampaign.audience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Template:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedCampaign.template}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Duration:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedCampaign.startDate.toLocaleDateString()} - {selectedCampaign.endDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <BarChart3 className="h-4 w-4" />
                      View Analytics
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                      <Edit className="h-4 w-4" />
                      Edit Campaign
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <div className="text-center text-gray-500">
                  <Target className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No campaign selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a campaign to view performance details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Campaign Calendar</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Calendar View</h3>
              <p className="mt-1 text-sm text-gray-500">Campaign calendar view will be implemented here.</p>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCampaign}
      />
      
      {/* Test Modal */}
      <TestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
    </div>
  );
}