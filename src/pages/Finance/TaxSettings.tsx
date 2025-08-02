/**
 * Finance Tax & Currency Settings Page
 * Author: VB Entreprise
 * 
 * Tax rate configuration by region, currency management with exchange rates,
 * and automated tax reporting
 */

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Globe, Calculator, TrendingUp, Download, Settings, RefreshCw } from 'lucide-react';
import CreateTaxRateModal from '../../components/Modals/CreateTaxRateModal';
import CreateCurrencyModal from '../../components/Modals/CreateCurrencyModal';
import GenerateTaxReportModal from '../../components/Modals/GenerateTaxReportModal';

interface TaxRate {
  id: string;
  name: string;
  rate: number;
  region: string;
  type: 'GST' | 'VAT' | 'Sales Tax' | 'Service Tax';
  isDefault: boolean;
  applicableFrom: Date;
  description: string;
}

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isBaseCurrency: boolean;
  lastUpdated: Date;
  roundingRule: 'round' | 'floor' | 'ceil';
  decimalPlaces: number;
}

interface TaxReport {
  id: string;
  period: string;
  totalTaxCollected: number;
  totalTaxPaid: number;
  netTax: number;
  status: 'draft' | 'filed' | 'paid';
  dueDate: Date;
  filedDate?: Date;
}

const mockTaxRates: TaxRate[] = [
  {
    id: '1',
    name: 'Standard GST',
    rate: 18,
    region: 'India',
    type: 'GST',
    isDefault: true,
    applicableFrom: new Date('2024-01-01'),
    description: 'Standard GST rate for most services'
  },
  {
    id: '2',
    name: 'Reduced GST',
    rate: 12,
    region: 'India',
    type: 'GST',
    isDefault: false,
    applicableFrom: new Date('2024-01-01'),
    description: 'Reduced rate for specific services'
  },
  {
    id: '3',
    name: 'US Sales Tax',
    rate: 8.5,
    region: 'California, US',
    type: 'Sales Tax',
    isDefault: false,
    applicableFrom: new Date('2024-01-01'),
    description: 'California state sales tax'
  }
];

const mockCurrencies: Currency[] = [
  {
    id: '1',
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    exchangeRate: 1.0,
    isBaseCurrency: true,
    lastUpdated: new Date('2024-01-22'),
    roundingRule: 'round',
    decimalPlaces: 2
  },
  {
    id: '2',
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    exchangeRate: 0.012,
    isBaseCurrency: false,
    lastUpdated: new Date('2024-01-22'),
    roundingRule: 'round',
    decimalPlaces: 2
  },
  {
    id: '3',
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    exchangeRate: 0.011,
    isBaseCurrency: false,
    lastUpdated: new Date('2024-01-22'),
    roundingRule: 'round',
    decimalPlaces: 2
  }
];

const mockTaxReports: TaxReport[] = [
  {
    id: '1',
    period: 'Q4 2023',
    totalTaxCollected: 125000,
    totalTaxPaid: 15000,
    netTax: 110000,
    status: 'filed',
    dueDate: new Date('2024-01-31'),
    filedDate: new Date('2024-01-25')
  },
  {
    id: '2',
    period: 'Q1 2024',
    totalTaxCollected: 89000,
    totalTaxPaid: 12000,
    netTax: 77000,
    status: 'draft',
    dueDate: new Date('2024-04-30')
  }
];

export default function TaxSettings() {
  const [taxRates, setTaxRates] = useState<TaxRate[]>(mockTaxRates);
  const [currencies, setCurrencies] = useState<Currency[]>(mockCurrencies);
  const [taxReports, setTaxReports] = useState<TaxReport[]>(mockTaxReports);
  const [activeTab, setActiveTab] = useState<'rates' | 'currencies' | 'reports'>('rates');
  const [isCreateTaxRateModalOpen, setIsCreateTaxRateModalOpen] = useState(false);
  const [isCreateCurrencyModalOpen, setIsCreateCurrencyModalOpen] = useState(false);
  const [isGenerateTaxReportModalOpen, setIsGenerateTaxReportModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-yellow-100 text-yellow-800',
      filed: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTaxTypeColor = (type: string) => {
    const colors = {
      'GST': 'bg-blue-100 text-blue-800',
      'VAT': 'bg-green-100 text-green-800',
      'Sales Tax': 'bg-purple-100 text-purple-800',
      'Service Tax': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { id: 'rates', name: 'Tax Rates', icon: Calculator },
    { id: 'currencies', name: 'Currencies', icon: Globe },
    { id: 'reports', name: 'Tax Reports', icon: TrendingUp }
  ];

  const handleCreateTaxRate = (taxRateData: any) => {
    const newTaxRate: TaxRate = {
      ...taxRateData,
      id: taxRateData.id
    };
    
    setTaxRates(prev => [newTaxRate, ...prev]);
  };

  const handleCreateCurrency = (currencyData: any) => {
    const newCurrency: Currency = {
      ...currencyData,
      id: currencyData.id
    };
    
    setCurrencies(prev => [newCurrency, ...prev]);
  };

  const handleGenerateTaxReport = (reportData: any) => {
    const newTaxReport: TaxReport = {
      ...reportData,
      id: reportData.id,
      totalTaxCollected: 0,
      totalTaxPaid: 0,
      netTax: 0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };
    
    setTaxReports(prev => [newTaxReport, ...prev]);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Tax & Currency Settings</h1>
          <p className="mt-2 text-gray-600">
            Configure tax rates by region, manage currencies, and generate tax reports.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => {
              if (activeTab === 'rates') {
                setIsCreateTaxRateModalOpen(true);
              } else if (activeTab === 'currencies') {
                setIsCreateCurrencyModalOpen(true);
              } else if (activeTab === 'reports') {
                setIsGenerateTaxReportModalOpen(true);
              }
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            {activeTab === 'rates' ? 'Add Tax Rate' : activeTab === 'currencies' ? 'Add Currency' : 'Generate Report'}
          </button>
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
      {activeTab === 'rates' && (
        <div className="space-y-6">
          {/* Tax Rates Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Tax Rates Configuration</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {taxRates.map((taxRate) => (
                    <tr key={taxRate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{taxRate.name}</div>
                          <div className="text-sm text-gray-500">{taxRate.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{taxRate.rate}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTaxTypeColor(taxRate.type)}`}>
                          {taxRate.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {taxRate.region}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {taxRate.isDefault ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Default
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Active
                          </span>
                        )}
                      </td>
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

          {/* Auto-Apply Rules */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Auto-Apply Rules</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Apply GST 18% for Indian clients</h4>
                    <p className="text-sm text-gray-500">Automatically apply standard GST rate for clients in India</p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Zero tax for international clients</h4>
                    <p className="text-sm text-gray-500">Apply 0% tax rate for clients outside India</p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'currencies' && (
        <div className="space-y-6">
          {/* Currencies Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Currency Management</h3>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <RefreshCw className="h-4 w-4" />
                Update Rates
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exchange Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rounding</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currencies.map((currency) => (
                    <tr key={currency.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Globe className="h-8 w-8 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {currency.symbol} {currency.code}
                            </div>
                            <div className="text-sm text-gray-500">{currency.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {currency.isBaseCurrency ? 'Base Currency' : `1 INR = ${currency.exchangeRate.toFixed(4)} ${currency.code}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{currency.roundingRule}</div>
                        <div className="text-sm text-gray-500">{currency.decimalPlaces} decimal places</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {currency.lastUpdated.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {currency.isBaseCurrency ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Base Currency
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                          {!currency.isBaseCurrency && (
                            <button className="text-red-600 hover:text-red-900 p-1 rounded">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Exchange Rate Settings */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Exchange Rate Settings</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rate Source</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Reserve Bank of India</option>
                    <option>European Central Bank</option>
                    <option>Federal Reserve</option>
                    <option>Manual Entry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Frequency</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Manual</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Tax Reports Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Tax Summary Reports</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Collected</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Paid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Tax</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {taxReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{report.totalTaxCollected.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{report.totalTaxPaid.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ₹{report.netTax.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.dueDate.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1 rounded">
                            <Settings className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Tax Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Current Quarter</h4>
              <p className="text-3xl font-bold text-green-600">₹89,000</p>
              <p className="text-sm text-gray-500 mt-1">Tax collected</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Tax Liability</h4>
              <p className="text-3xl font-bold text-orange-600">₹77,000</p>
              <p className="text-sm text-gray-500 mt-1">Net tax payable</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Next Filing</h4>
              <p className="text-3xl font-bold text-blue-600">68</p>
              <p className="text-sm text-gray-500 mt-1">Days remaining</p>
            </div>
          </div>
        </div>
      )}

      {/* Create Tax Rate Modal */}
      <CreateTaxRateModal
        isOpen={isCreateTaxRateModalOpen}
        onClose={() => setIsCreateTaxRateModalOpen(false)}
        onSubmit={handleCreateTaxRate}
      />

      {/* Create Currency Modal */}
      <CreateCurrencyModal
        isOpen={isCreateCurrencyModalOpen}
        onClose={() => setIsCreateCurrencyModalOpen(false)}
        onSubmit={handleCreateCurrency}
      />

      {/* Generate Tax Report Modal */}
      <GenerateTaxReportModal
        isOpen={isGenerateTaxReportModalOpen}
        onClose={() => setIsGenerateTaxReportModalOpen(false)}
        onSubmit={handleGenerateTaxReport}
      />
    </div>
  );
}