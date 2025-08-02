/**
 * CRM Opportunities Page
 * Author: VB Entreprise
 * 
 * Pipeline board with drag-and-drop, forecast table, and deal management
 */

import React, { useState } from 'react';
import { Plus, DollarSign, Calendar, User, TrendingUp, FileText, Phone, Mail } from 'lucide-react';
import CreateOpportunityModal from '../../components/Modals/CreateOpportunityModal';

interface Opportunity {
  id: string;
  title: string;
  company: string;
  contact: string;
  value: number;
  stage: 'qualified' | 'proposal' | 'negotiation' | 'closing' | 'won' | 'lost';
  probability: number;
  expectedCloseDate: Date;
  owner: string;
  description: string;
  decisionMaker: string;
  keyDates: { label: string; date: Date }[];
  proposalPdf?: string;
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Website Redesign Project',
    company: 'TechCorp Solutions',
    contact: 'John Smith',
    value: 45000,
    stage: 'proposal',
    probability: 75,
    expectedCloseDate: new Date('2024-02-15'),
    owner: 'Sarah Johnson',
    description: 'Complete website redesign with modern UI/UX and mobile optimization',
    decisionMaker: 'John Smith (CTO)',
    keyDates: [
      { label: 'Proposal Sent', date: new Date('2024-01-20') },
      { label: 'Follow-up Call', date: new Date('2024-01-25') }
    ],
    proposalPdf: 'proposal-techcorp-2024.pdf'
  },
  {
    id: '2',
    title: 'Mobile App Development',
    company: 'Startup Innovation',
    contact: 'Emily Davis',
    value: 85000,
    stage: 'negotiation',
    probability: 85,
    expectedCloseDate: new Date('2024-02-28'),
    owner: 'Mike Chen',
    description: 'Native iOS and Android app with backend API integration',
    decisionMaker: 'Emily Davis (CEO)',
    keyDates: [
      { label: 'Demo Completed', date: new Date('2024-01-18') },
      { label: 'Contract Review', date: new Date('2024-01-22') }
    ]
  },
  {
    id: '3',
    title: 'E-commerce Platform',
    company: 'Digital Retail Co',
    contact: 'Michael Brown',
    value: 120000,
    stage: 'qualified',
    probability: 60,
    expectedCloseDate: new Date('2024-03-15'),
    owner: 'Sarah Johnson',
    description: 'Custom e-commerce solution with inventory management',
    decisionMaker: 'Michael Brown (VP Technology)',
    keyDates: [
      { label: 'Discovery Call', date: new Date('2024-01-15') }
    ]
  }
];

const stages = [
  { id: 'qualified', name: 'Qualified', color: 'bg-blue-100 border-blue-300' },
  { id: 'proposal', name: 'Proposal', color: 'bg-yellow-100 border-yellow-300' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 border-orange-300' },
  { id: 'closing', name: 'Closing', color: 'bg-purple-100 border-purple-300' },
  { id: 'won', name: 'Won', color: 'bg-green-100 border-green-300' },
  { id: 'lost', name: 'Lost', color: 'bg-red-100 border-red-300' }
];

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [viewMode, setViewMode] = useState<'board' | 'forecast'>('board');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStageOpportunities = (stageId: string) => {
    return opportunities.filter(opp => opp.stage === stageId);
  };

  const getTotalValue = (stageId: string) => {
    return getStageOpportunities(stageId).reduce((sum, opp) => sum + opp.value, 0);
  };

  const getWeightedValue = (opportunity: Opportunity) => {
    return (opportunity.value * opportunity.probability) / 100;
  };

  const moveOpportunity = (opportunityId: string, newStage: string) => {
    setOpportunities(prev => prev.map(opp => 
      opp.id === opportunityId ? { ...opp, stage: newStage as any } : opp
    ));
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const handleCreateOpportunity = (opportunityData: any) => {
    const newOpportunity: Opportunity = {
      ...opportunityData,
      id: opportunityData.id,
      stage: 'qualified',
      keyDates: [
        { label: 'Created', date: new Date() }
      ]
    };
    
    setOpportunities(prev => [newOpportunity, ...prev]);
  };

  const getDaysUntilClose = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Opportunities</h1>
          <p className="mt-2 text-gray-600">
            Manage your sales pipeline with drag-and-drop boards and forecast tracking.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('board')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'board' 
                  ? 'bg-blue-50 text-blue-700 border-r border-gray-300' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pipeline Board
            </button>
            <button
              onClick={() => setViewMode('forecast')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'forecast' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Forecast Table
            </button>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Opportunity
          </button>
        </div>
      </div>

      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Pipeline Board */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stages.filter(stage => stage.id !== 'won' && stage.id !== 'lost').map((stage) => (
                <div key={stage.id} className={`rounded-lg border-2 border-dashed p-4 ${stage.color}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(getTotalValue(stage.id))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {getStageOpportunities(stage.id).map((opportunity) => (
                      <div
                        key={opportunity.id}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
                        onClick={() => setSelectedOpportunity(opportunity)}
                      >
                        <h4 className="font-medium text-gray-900 mb-2">{opportunity.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{opportunity.company}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-green-600">
                            {formatCurrency(opportunity.value)}
                          </span>
                          <span className="text-gray-500">
                            {opportunity.probability}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <span>{opportunity.owner}</span>
                          <span>{getDaysUntilClose(opportunity.expectedCloseDate)} days</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deal Details Panel */}
          <div className="lg:col-span-1">
            {selectedOpportunity ? (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Deal Details</h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Deal Header */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{selectedOpportunity.title}</h4>
                    <p className="text-sm text-gray-600">{selectedOpportunity.company}</p>
                  </div>

                  {/* Deal Value */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Deal Value</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(selectedOpportunity.value)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Weighted Value</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {formatCurrency(getWeightedValue(selectedOpportunity))}
                      </p>
                    </div>
                  </div>

                  {/* Probability */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Win Probability</span>
                      <span className="font-medium">{selectedOpportunity.probability}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${selectedOpportunity.probability}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Key Information */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="text-sm font-medium text-gray-900">{selectedOpportunity.contact}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Expected Close</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedOpportunity.expectedCloseDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Owner</p>
                        <p className="text-sm font-medium text-gray-900">{selectedOpportunity.owner}</p>
                      </div>
                    </div>
                  </div>

                  {/* Decision Maker */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Decision Maker</p>
                    <p className="text-sm font-medium text-gray-900">{selectedOpportunity.decisionMaker}</p>
                  </div>

                  {/* Key Dates */}
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Key Dates</p>
                    <div className="space-y-2">
                      {selectedOpportunity.keyDates.map((keyDate, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{keyDate.label}</span>
                          <span className="text-gray-900">{keyDate.date.toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Proposal PDF */}
                  {selectedOpportunity.proposalPdf && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Proposal</p>
                      <div className="flex items-center p-2 bg-gray-50 rounded border">
                        <FileText className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{selectedOpportunity.proposalPdf}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <Phone className="h-4 w-4" />
                      Schedule Call
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                      <Mail className="h-4 w-4" />
                      Send Follow-up
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <div className="text-center text-gray-500">
                  <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No opportunity selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Click on a deal card to view details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Forecast Table */
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Sales Forecast</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opportunity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deal Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weighted Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Close</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {opportunities.map((opportunity) => (
                  <tr key={opportunity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{opportunity.title}</div>
                        <div className="text-sm text-gray-500">{opportunity.company}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {opportunity.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(opportunity.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${opportunity.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{opportunity.probability}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(getWeightedValue(opportunity))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {opportunity.expectedCloseDate.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {opportunity.owner}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Opportunity Modal */}
      <CreateOpportunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateOpportunity}
      />
    </div>
  );
}