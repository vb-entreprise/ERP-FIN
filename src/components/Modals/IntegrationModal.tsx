/**
 * Integration Connection Modal Component
 * Author: VB Entreprise
 * 
 * Universal modal for connecting various third-party integrations
 * with service-specific configuration forms
 */

import React, { useState } from 'react';
import { X, Key, Globe, Database, CreditCard, BarChart3, Bot, BookOpen, Eye, EyeOff } from 'lucide-react';

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (integrationData: any) => void;
  integration: {
    id: string;
    name: string;
    type: string;
    status: string;
  } | null;
}

export default function IntegrationModal({ isOpen, onClose, onConnect, integration }: IntegrationModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isConnecting, setIsConnecting] = useState(false);

  const toggleSecretVisibility = (field: string) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    
    // Simulate API connection
    setTimeout(() => {
      onConnect({
        integrationId: integration?.id,
        config: formData,
        connectedAt: new Date()
      });
      setIsConnecting(false);
      onClose();
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setFormData({});
    setErrors({});
    setShowSecrets({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const renderSecretField = (name: string, label: string, placeholder: string, required = true) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && '*'}
      </label>
      <div className="relative">
        <input
          type={showSecrets[name] ? 'text' : 'password'}
          name={name}
          value={formData[name] || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors[name] ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => toggleSecretVisibility(name)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showSecrets[name] ? (
            <EyeOff className="h-4 w-4 text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  const renderStripeForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSecretField('publishableKey', 'Publishable Key', 'pk_live_...')}
        {renderSecretField('secretKey', 'Secret Key', 'sk_live_...')}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSecretField('webhookSecret', 'Webhook Secret', 'whsec_...', false)}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
          <select
            name="environment"
            value={formData.environment || 'live'}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="test">Test Mode</option>
            <option value="live">Live Mode</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderWiseForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSecretField('apiKey', 'API Key', 'Your Wise API key')}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile ID *</label>
          <input
            type="text"
            name="profileId"
            value={formData.profileId || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your Wise profile ID"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
          <select
            name="environment"
            value={formData.environment || 'live'}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="sandbox">Sandbox</option>
            <option value="live">Live</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Base Currency</label>
          <select
            name="baseCurrency"
            value={formData.baseCurrency || 'INR'}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderGoogleAnalyticsForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tracking ID *</label>
          <input
            type="text"
            name="trackingId"
            value={formData.trackingId || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="GA4-XXXXXXXXXX"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property ID *</label>
          <input
            type="text"
            name="propertyId"
            value={formData.propertyId || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="123456789"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Service Account JSON *</label>
        <textarea
          name="serviceAccountJson"
          value={formData.serviceAccountJson || ''}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Paste your service account JSON key here..."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="enableEcommerce"
              checked={formData.enableEcommerce || false}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable E-commerce Tracking</span>
          </label>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="enableConversions"
              checked={formData.enableConversions || false}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable Conversion Tracking</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderAWSS3Form = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSecretField('accessKeyId', 'Access Key ID', 'AKIA...')}
        {renderSecretField('secretAccessKey', 'Secret Access Key', 'Your AWS secret key')}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Region *</label>
          <select
            name="region"
            value={formData.region || 'ap-south-1'}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ap-south-1">Asia Pacific (Mumbai)</option>
            <option value="us-east-1">US East (N. Virginia)</option>
            <option value="us-west-2">US West (Oregon)</option>
            <option value="eu-west-1">Europe (Ireland)</option>
            <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bucket Name *</label>
          <input
            type="text"
            name="bucketName"
            value={formData.bucketName || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="your-bucket-name"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Folder Prefix</label>
          <input
            type="text"
            name="folderPrefix"
            value={formData.folderPrefix || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="documents/"
          />
        </div>
        <div>
          <label className="flex items-center mt-6">
            <input
              type="checkbox"
              name="enablePublicRead"
              checked={formData.enablePublicRead || false}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable Public Read Access</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderChatGPTForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSecretField('apiKey', 'OpenAI API Key', 'sk-...')}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organization ID</label>
          <input
            type="text"
            name="organizationId"
            value={formData.organizationId || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="org-..."
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Default Model</label>
          <select
            name="defaultModel"
            value={formData.defaultModel || 'gpt-4'}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
          <input
            type="number"
            name="maxTokens"
            value={formData.maxTokens || '2000'}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="2000"
          />
        </div>
      </div>
      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="enableContentGeneration"
            checked={formData.enableContentGeneration || false}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Enable Content Generation</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="enableCustomerSupport"
            checked={formData.enableCustomerSupport || false}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Enable Customer Support Chat</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="enableDocumentAnalysis"
            checked={formData.enableDocumentAnalysis || false}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Enable Document Analysis</span>
        </label>
      </div>
    </div>
  );

  const renderZohoBooksForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSecretField('clientId', 'Client ID', 'Your Zoho client ID')}
        {renderSecretField('clientSecret', 'Client Secret', 'Your Zoho client secret')}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organization ID *</label>
          <input
            type="text"
            name="organizationId"
            value={formData.organizationId || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your organization ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Center</label>
          <select
            name="dataCenter"
            value={formData.dataCenter || 'com'}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="com">zoho.com (US)</option>
            <option value="eu">zoho.eu (Europe)</option>
            <option value="in">zoho.in (India)</option>
            <option value="com.au">zoho.com.au (Australia)</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URI</label>
        <input
          type="url"
          name="redirectUri"
          value={formData.redirectUri || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://your-domain.com/oauth/callback"
        />
      </div>
      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="syncInvoices"
            checked={formData.syncInvoices || false}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Sync Invoices</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="syncCustomers"
            checked={formData.syncCustomers || false}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Sync Customers</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="syncExpenses"
            checked={formData.syncExpenses || false}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Sync Expenses</span>
        </label>
      </div>
    </div>
  );

  const renderSendGridForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSecretField('apiKey', 'SendGrid API Key', 'SG...')}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Email *</label>
          <input
            type="email"
            name="fromEmail"
            value={formData.fromEmail || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="noreply@yourdomain.com"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
          <input
            type="text"
            name="fromName"
            value={formData.fromName || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="VB Entreprise"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reply To Email</label>
          <input
            type="email"
            name="replyToEmail"
            value={formData.replyToEmail || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="support@yourdomain.com"
          />
        </div>
      </div>
      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="enableTracking"
            checked={formData.enableTracking || false}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Enable Click Tracking</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="enableOpenTracking"
            checked={formData.enableOpenTracking || false}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Enable Open Tracking</span>
        </label>
      </div>
    </div>
  );

  const renderFormContent = () => {
    if (!integration) return null;

    switch (integration.name) {
      case 'Stripe':
        return renderStripeForm();
      case 'Wise':
        return renderWiseForm();
      case 'Google Analytics':
        return renderGoogleAnalyticsForm();
      case 'AWS S3':
        return renderAWSS3Form();
      case 'ChatGPT':
        return renderChatGPTForm();
      case 'Zoho Books':
        return renderZohoBooksForm();
      case 'SendGrid':
        return renderSendGridForm();
      default:
        return <div>Integration form not available</div>;
    }
  };

  const getIntegrationIcon = () => {
    if (!integration) return <Key className="h-6 w-6" />;
    
    switch (integration.type) {
      case 'payment':
        return <CreditCard className="h-6 w-6" />;
      case 'analytics':
        return <BarChart3 className="h-6 w-6" />;
      case 'storage':
        return <Database className="h-6 w-6" />;
      case 'ai':
        return <Bot className="h-6 w-6" />;
      case 'accounting':
        return <BookOpen className="h-6 w-6" />;
      case 'email':
        return <Globe className="h-6 w-6" />;
      default:
        return <Key className="h-6 w-6" />;
    }
  };

  if (!isOpen || !integration) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              {getIntegrationIcon()}
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Connect {integration.name}
                </h3>
                <p className="text-sm text-gray-500 capitalize">{integration.type} Integration</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {renderFormContent()}

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                disabled={isConnecting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : `Connect ${integration.name}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}