/**
 * Marketing Lead Scoring & Routing Page
 * Author: VB Entreprise
 * 
 * Lead scoring rules configuration, threshold actions,
 * and automated lead routing based on engagement
 */

import React, { useState } from 'react';
import { Plus, Target, TrendingUp, Users, Mail, Phone, Star, Settings, Zap, Filter } from 'lucide-react';
import CreateScoringRuleModal from '../../components/Modals/CreateScoringRuleModal';

interface ScoringRule {
  id: string;
  name: string;
  trigger: string;
  points: number;
  category: 'engagement' | 'demographic' | 'behavioral' | 'firmographic';
  isActive: boolean;
  description: string;
}

interface ThresholdAction {
  id: string;
  name: string;
  threshold: number;
  action: 'assign' | 'notify' | 'email' | 'tag';
  target: string;
  isActive: boolean;
  description: string;
}

interface ScoredLead {
  id: string;
  name: string;
  email: string;
  company: string;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D';
  lastActivity: Date;
  activities: Activity[];
  assignedTo?: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  points: number;
  date: Date;
}

const mockScoringRules: ScoringRule[] = [
  {
    id: '1',
    name: 'Email Open',
    trigger: 'email_opened',
    points: 5,
    category: 'engagement',
    isActive: true,
    description: 'Lead opens marketing email'
  },
  {
    id: '2',
    name: 'Website Visit',
    trigger: 'page_visit',
    points: 10,
    category: 'behavioral',
    isActive: true,
    description: 'Lead visits website pages'
  },
  {
    id: '3',
    name: 'Form Submission',
    trigger: 'form_submit',
    points: 25,
    category: 'engagement',
    isActive: true,
    description: 'Lead submits contact form'
  },
  {
    id: '4',
    name: 'Enterprise Company',
    trigger: 'company_size_large',
    points: 20,
    category: 'firmographic',
    isActive: true,
    description: 'Lead from enterprise company (500+ employees)'
  }
];

const mockThresholdActions: ThresholdAction[] = [
  {
    id: '1',
    name: 'Hot Lead Assignment',
    threshold: 80,
    action: 'assign',
    target: 'Senior Sales Rep',
    isActive: true,
    description: 'Auto-assign hot leads to senior sales representatives'
  },
  {
    id: '2',
    name: 'Warm Lead Notification',
    threshold: 50,
    action: 'notify',
    target: 'Sales Team',
    isActive: true,
    description: 'Notify sales team of warm leads'
  },
  {
    id: '3',
    name: 'Nurture Email Sequence',
    threshold: 25,
    action: 'email',
    target: 'Nurture Campaign',
    isActive: true,
    description: 'Add to automated nurture email sequence'
  }
];

const mockScoredLeads: ScoredLead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@techcorp.com',
    company: 'TechCorp Solutions',
    score: 85,
    grade: 'A',
    lastActivity: new Date('2024-01-22'),
    assignedTo: 'Sarah Johnson',
    activities: [
      { id: '1', type: 'Form Submission', description: 'Downloaded whitepaper', points: 25, date: new Date('2024-01-22') },
      { id: '2', type: 'Website Visit', description: 'Visited pricing page', points: 15, date: new Date('2024-01-21') },
      { id: '3', type: 'Email Open', description: 'Opened newsletter', points: 5, date: new Date('2024-01-20') }
    ]
  },
  {
    id: '2',
    name: 'Emily Davis',
    email: 'emily@startup.io',
    company: 'Startup Innovation',
    score: 65,
    grade: 'B',
    lastActivity: new Date('2024-01-21'),
    activities: [
      { id: '4', type: 'Website Visit', description: 'Visited services page', points: 10, date: new Date('2024-01-21') },
      { id: '5', type: 'Email Open', description: 'Opened promotional email', points: 5, date: new Date('2024-01-19') }
    ]
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@smallbiz.com',
    company: 'Small Business Co',
    score: 35,
    grade: 'C',
    lastActivity: new Date('2024-01-18'),
    activities: [
      { id: '6', type: 'Website Visit', description: 'Visited homepage', points: 10, date: new Date('2024-01-18') },
      { id: '7', type: 'Email Open', description: 'Opened welcome email', points: 5, date: new Date('2024-01-17') }
    ]
  }
];

export default function LeadScoring() {
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>(mockScoringRules);
  const [thresholdActions] = useState<ThresholdAction[]>(mockThresholdActions);
  const [scoredLeads] = useState<ScoredLead[]>(mockScoredLeads);
  const [activeTab, setActiveTab] = useState<'rules' | 'thresholds' | 'leads'>('rules');
  const [selectedLead, setSelectedLead] = useState<ScoredLead | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors = {
      engagement: 'bg-blue-100 text-blue-800',
      demographic: 'bg-green-100 text-green-800',
      behavioral: 'bg-purple-100 text-purple-800',
      firmographic: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getGradeColor = (grade: string) => {
    const colors = {
      A: 'bg-green-100 text-green-800',
      B: 'bg-blue-100 text-blue-800',
      C: 'bg-yellow-100 text-yellow-800',
      D: 'bg-red-100 text-red-800'
    };
    return colors[grade as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'assign': return <Users className="h-4 w-4" />;
      case 'notify': return <Zap className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'tag': return <Target className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const tabs = [
    { id: 'rules', name: 'Scoring Rules', icon: Star },
    { id: 'thresholds', name: 'Threshold Actions', icon: Zap },
    { id: 'leads', name: 'Scored Leads', icon: Users }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Lead Scoring & Routing</h1>
          <p className="mt-2 text-gray-600">
            Configure scoring rules, set threshold actions, and automatically route qualified leads.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            {activeTab === 'rules' ? 'Add Rule' : activeTab === 'thresholds' ? 'Add Action' : 'Import Leads'}
          </button>
        </div>
      </div>

      {/* Lead Scoring Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Rules</p>
              <p className="text-2xl font-bold text-gray-900">{scoringRules.filter(r => r.isActive).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Hot Leads (A)</p>
              <p className="text-2xl font-bold text-gray-900">{scoredLeads.filter(l => l.grade === 'A').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg. Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(scoredLeads.reduce((sum, lead) => sum + lead.score, 0) / scoredLeads.length)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Auto-Assigned</p>
              <p className="text-2xl font-bold text-gray-900">{scoredLeads.filter(l => l.assignedTo).length}</p>
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
      {activeTab === 'rules' && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Scoring Rules Configuration</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trigger</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scoringRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                        <div className="text-sm text-gray-500">{rule.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rule.trigger}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">+{rule.points}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getCategoryColor(rule.category)}`}>
                        {rule.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        rule.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                          <Settings className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded">
                          <Target className="h-4 w-4" />
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

      {activeTab === 'thresholds' && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Threshold Actions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {thresholdActions.map((action) => (
                  <tr key={action.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{action.name}</div>
                        <div className="text-sm text-gray-500">{action.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-purple-600">{action.threshold}+ points</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getActionIcon(action.action)}
                        <span className="ml-2 text-sm text-gray-900 capitalize">{action.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {action.target}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        action.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {action.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                          <Settings className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded">
                          <Target className="h-4 w-4" />
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

      {activeTab === 'leads' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scored Leads List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Scored Leads</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {scoredLeads.map((lead) => (
                      <tr 
                        key={lead.id} 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                          selectedLead?.id === lead.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedLead(lead)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.company}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium text-gray-900">{lead.score}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(lead.grade)}`}>
                            Grade {lead.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lead.assignedTo || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.lastActivity.toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Lead Detail Panel */}
          <div className="lg:col-span-1">
            {selectedLead ? (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Lead Score Breakdown</h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Lead Header */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{selectedLead.name}</h4>
                    <p className="text-sm text-gray-600">{selectedLead.company}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(selectedLead.grade)}`}>
                        Grade {selectedLead.grade}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{selectedLead.score} points</span>
                      </div>
                    </div>
                  </div>

                  {/* Score Progress */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Score Progress</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current Score:</span>
                        <span className="font-medium">{selectedLead.score} points</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedLead.score >= 80 ? 'bg-green-500' :
                            selectedLead.score >= 50 ? 'bg-blue-500' :
                            selectedLead.score >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(selectedLead.score, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Next threshold: {selectedLead.score >= 80 ? 'Maximum' : selectedLead.score >= 50 ? '80 (Hot Lead)' : '50 (Warm Lead)'}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activities */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Recent Activities</h5>
                    <div className="space-y-3">
                      {selectedLead.activities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Star className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                            <p className="text-sm text-gray-500">{activity.description}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-400">{activity.date.toLocaleDateString()}</span>
                              <span className="text-xs font-medium text-blue-600">+{activity.points} points</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assignment */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Assignment</h5>
                    {selectedLead.assignedTo ? (
                      <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <Users className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm text-green-900">Assigned to {selectedLead.assignedTo}</span>
                      </div>
                    ) : (
                      <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                        <Target className="h-5 w-5 text-yellow-600 mr-2" />
                        <span className="text-sm text-yellow-900">Unassigned - awaiting threshold</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <Users className="h-4 w-4" />
                      Assign Lead
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                      <Mail className="h-4 w-4" />
                      Send Email
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <div className="text-center text-gray-500">
                  <Star className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No lead selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a lead to view score breakdown.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Scoring Rule Modal */}
      <CreateScoringRuleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(ruleData) => {
          setScoringRules(prev => [...prev, ruleData]);
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}