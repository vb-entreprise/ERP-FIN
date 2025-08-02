/**
 * Marketing Landing Pages & Form Builder Page
 * Author: VB Entreprise
 * 
 * Drag-and-drop editor for forms, CTAs, embedded assets
 * with CRM integration and A/B testing capabilities
 */

import React, { useState } from 'react';
import { Plus, Edit, Eye, Copy, Trash2, BarChart3, MousePointer, Users, TrendingUp, Layout, Palette, Code, Settings, Play, Pause } from 'lucide-react';
import CreateLandingPageModal from '../../components/Modals/CreateLandingPageModal';

interface LandingPage {
  id: string;
  name: string;
  url: string;
  status: 'draft' | 'published' | 'archived';
  template: string;
  createdAt: Date;
  lastModified: Date;
  views: number;
  conversions: number;
  conversionRate: number;
  isABTest: boolean;
  variants?: LandingPageVariant[];
}

interface LandingPageVariant {
  id: string;
  name: string;
  traffic: number;
  conversions: number;
  conversionRate: number;
}

interface FormBuilder {
  id: string;
  name: string;
  fields: FormField[];
  submissions: number;
  conversionRate: number;
  isActive: boolean;
  integrations: string[];
}

interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'checkbox';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

const mockLandingPages: LandingPage[] = [
  {
    id: '1',
    name: 'Web Development Services',
    url: '/landing/web-development',
    status: 'published',
    template: 'Service Landing',
    createdAt: new Date('2024-01-10'),
    lastModified: new Date('2024-01-20'),
    views: 2450,
    conversions: 89,
    conversionRate: 3.63,
    isABTest: true,
    variants: [
      { id: '1a', name: 'Variant A', traffic: 50, conversions: 45, conversionRate: 3.8 },
      { id: '1b', name: 'Variant B', traffic: 50, conversions: 44, conversionRate: 3.5 }
    ]
  },
  {
    id: '2',
    name: 'Free Consultation Offer',
    url: '/landing/free-consultation',
    status: 'published',
    template: 'Lead Magnet',
    createdAt: new Date('2024-01-15'),
    lastModified: new Date('2024-01-22'),
    views: 1850,
    conversions: 125,
    conversionRate: 6.76,
    isABTest: false
  },
  {
    id: '3',
    name: 'Mobile App Development',
    url: '/landing/mobile-app',
    status: 'draft',
    template: 'Product Showcase',
    createdAt: new Date('2024-01-18'),
    lastModified: new Date('2024-01-22'),
    views: 0,
    conversions: 0,
    conversionRate: 0,
    isABTest: false
  }
];

const mockForms: FormBuilder[] = [
  {
    id: '1',
    name: 'Contact Form',
    fields: [
      { id: '1', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your name' },
      { id: '2', type: 'email', label: 'Email Address', required: true, placeholder: 'your@email.com' },
      { id: '3', type: 'phone', label: 'Phone Number', required: false, placeholder: '+1 (555) 000-0000' },
      { id: '4', type: 'select', label: 'Service Interest', required: true, options: ['Web Development', 'Mobile App', 'Consulting'] },
      { id: '5', type: 'textarea', label: 'Project Details', required: false, placeholder: 'Tell us about your project...' }
    ],
    submissions: 156,
    conversionRate: 4.2,
    isActive: true,
    integrations: ['CRM', 'Email Marketing']
  },
  {
    id: '2',
    name: 'Newsletter Signup',
    fields: [
      { id: '6', type: 'email', label: 'Email Address', required: true, placeholder: 'Subscribe to our newsletter' },
      { id: '7', type: 'checkbox', label: 'I agree to receive marketing emails', required: true }
    ],
    submissions: 89,
    conversionRate: 8.5,
    isActive: true,
    integrations: ['Email Marketing']
  }
];

const templates = [
  { id: '1', name: 'Service Landing', category: 'Business', preview: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: '2', name: 'Lead Magnet', category: 'Marketing', preview: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: '3', name: 'Product Showcase', category: 'Product', preview: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: '4', name: 'Event Registration', category: 'Events', preview: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300' }
];

export default function LandingPages() {
  const [landingPages, setLandingPages] = useState<LandingPage[]>(mockLandingPages);
  const [forms] = useState<FormBuilder[]>(mockForms);
  const [activeTab, setActiveTab] = useState<'pages' | 'forms' | 'templates'>('pages');
  const [selectedPage, setSelectedPage] = useState<LandingPage | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return '📧';
      case 'phone': return '📞';
      case 'select': return '📋';
      case 'textarea': return '📝';
      case 'checkbox': return '☑️';
      default: return '📄';
    }
  };

  const tabs = [
    { id: 'pages', name: 'Landing Pages', icon: Layout },
    { id: 'forms', name: 'Form Builder', icon: Edit },
    { id: 'templates', name: 'Templates', icon: Palette }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Landing Pages & Form Builder</h1>
          <p className="mt-2 text-gray-600">
            Create high-converting landing pages with drag-and-drop editor and integrated forms.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            {activeTab === 'pages' ? 'New Landing Page' : activeTab === 'forms' ? 'New Form' : 'Browse Templates'}
          </button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {landingPages.reduce((sum, page) => sum + page.views, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <MousePointer className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Conversions</p>
              <p className="text-2xl font-bold text-gray-900">
                {landingPages.reduce((sum, page) => sum + page.conversions, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg. Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {(landingPages.reduce((sum, page) => sum + page.conversionRate, 0) / landingPages.length).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Layout className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Pages</p>
              <p className="text-2xl font-bold text-gray-900">
                {landingPages.filter(page => page.status === 'published').length}
              </p>
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
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Landing Pages List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">A/B Test</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {landingPages.map((page) => (
                      <tr 
                        key={page.id} 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                          selectedPage?.id === page.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedPage(page)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{page.name}</div>
                            <div className="text-sm text-gray-500">{page.url}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(page.status)}`}>
                            {page.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{page.views.toLocaleString()} views</div>
                          <div className="text-sm text-gray-500">{page.conversions} conversions ({page.conversionRate}%)</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {page.isABTest ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              A/B Testing
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">Single Version</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900 p-1 rounded">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-purple-600 hover:text-purple-900 p-1 rounded">
                              <BarChart3 className="h-4 w-4" />
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

          {/* Page Detail Panel */}
          <div className="lg:col-span-1">
            {selectedPage ? (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Page Analytics</h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Page Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{selectedPage.name}</h4>
                    <p className="text-sm text-gray-600">{selectedPage.template}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize mt-2 ${getStatusColor(selectedPage.status)}`}>
                      {selectedPage.status}
                    </span>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">{selectedPage.views.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Views</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">{selectedPage.conversions}</div>
                      <div className="text-xs text-gray-500">Conversions</div>
                    </div>
                  </div>

                  {/* Conversion Rate */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Conversion Rate</span>
                      <span className="font-medium">{selectedPage.conversionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(selectedPage.conversionRate * 10, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* A/B Test Results */}
                  {selectedPage.isABTest && selectedPage.variants && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-3">A/B Test Results</h5>
                      <div className="space-y-2">
                        {selectedPage.variants.map((variant) => (
                          <div key={variant.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium text-gray-900">{variant.name}</span>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">{variant.conversionRate}%</div>
                              <div className="text-xs text-gray-500">{variant.traffic}% traffic</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <Edit className="h-4 w-4" />
                      Edit Page
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                      <Eye className="h-4 w-4" />
                      Preview
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Copy className="h-4 w-4" />
                      Duplicate
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <div className="text-center text-gray-500">
                  <Layout className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No page selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a landing page to view analytics.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'forms' && (
        <div className="space-y-6">
          {/* Forms List */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Form Builder</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fields</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Integrations</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {forms.map((form) => (
                    <tr key={form.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{form.name}</div>
                        <div className={`text-sm ${form.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {form.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-1">
                          {form.fields.slice(0, 3).map((field) => (
                            <span key={field.id} className="text-sm" title={field.label}>
                              {getFieldTypeIcon(field.type)}
                            </span>
                          ))}
                          {form.fields.length > 3 && (
                            <span className="text-xs text-gray-500">+{form.fields.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.submissions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {form.conversionRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {form.integrations.map((integration, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {integration}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1 rounded">
                            <Code className="h-4 w-4" />
                          </button>
                          <button className="text-purple-600 hover:text-purple-900 p-1 rounded">
                            <BarChart3 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Builder Interface */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Drag & Drop Form Builder</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Field Library */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Field Library</h4>
                  <div className="space-y-2">
                    {[
                      { type: 'text', label: 'Text Input', icon: '📄' },
                      { type: 'email', label: 'Email Field', icon: '📧' },
                      { type: 'phone', label: 'Phone Number', icon: '📞' },
                      { type: 'select', label: 'Dropdown', icon: '📋' },
                      { type: 'textarea', label: 'Text Area', icon: '📝' },
                      { type: 'checkbox', label: 'Checkbox', icon: '☑️' }
                    ].map((fieldType) => (
                      <div key={fieldType.type} className="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <span className="text-lg mr-2">{fieldType.icon}</span>
                        <span className="text-sm text-gray-900">{fieldType.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Canvas */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Form Canvas</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-96">
                    <div className="text-center text-gray-500">
                      <Layout className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Drag fields here</h3>
                      <p className="mt-1 text-sm text-gray-500">Build your form by dragging fields from the library.</p>
                    </div>
                  </div>
                </div>

                {/* Settings Panel */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Field Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Field Label</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter field label" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter placeholder text" />
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700">Required field</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src={template.preview} 
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1">{template.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{template.category}</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                    Use Template
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Landing Page Modal */}
      <CreateLandingPageModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(pageData) => {
          setLandingPages(prev => [...prev, pageData]);
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}