import React, { useState } from 'react';
import { X, Calculator, Globe, Settings, Calendar } from 'lucide-react';

interface CreateTaxRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taxRateData: any) => void;
}

export default function CreateTaxRateModal({ isOpen, onClose, onSubmit }: CreateTaxRateModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    rate: '',
    region: '',
    type: 'GST',
    description: '',
    applicableFrom: new Date().toISOString().split('T')[0],
    isDefault: false,
    autoApply: false,
    conditions: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const taxTypes = [
    { value: 'GST', label: 'GST (Goods and Services Tax)' },
    { value: 'VAT', label: 'VAT (Value Added Tax)' },
    { value: 'Sales Tax', label: 'Sales Tax' },
    { value: 'Service Tax', label: 'Service Tax' },
    { value: 'Custom Duty', label: 'Custom Duty' },
    { value: 'Excise Duty', label: 'Excise Duty' }
  ];

  const regions = [
    'India',
    'Maharashtra',
    'Delhi',
    'Karnataka',
    'Tamil Nadu',
    'Gujarat',
    'Rajasthan',
    'Punjab',
    'Haryana',
    'Uttar Pradesh',
    'West Bengal',
    'Kerala',
    'Andhra Pradesh',
    'Telangana',
    'Madhya Pradesh',
    'Bihar',
    'Odisha',
    'Jharkhand',
    'Chhattisgarh',
    'Himachal Pradesh',
    'Uttarakhand',
    'Assam',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Tripura',
    'Arunachal Pradesh',
    'Sikkim',
    'Goa',
    'Jammu & Kashmir',
    'Ladakh',
    'Chandigarh',
    'Dadra & Nagar Haveli',
    'Daman & Diu',
    'Lakshadweep',
    'Puducherry',
    'Andaman & Nicobar Islands'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tax rate name is required';
    }

    if (!formData.rate.trim()) {
      newErrors.rate = 'Tax rate percentage is required';
    } else if (isNaN(Number(formData.rate)) || Number(formData.rate) < 0 || Number(formData.rate) > 100) {
      newErrors.rate = 'Tax rate must be a valid percentage between 0 and 100';
    }

    if (!formData.region.trim()) {
      newErrors.region = 'Region is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.applicableFrom) {
      newErrors.applicableFrom = 'Applicable from date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const taxRateData = {
        id: `tax-rate-${Date.now()}`,
        name: formData.name,
        rate: Number(formData.rate),
        region: formData.region,
        type: formData.type,
        description: formData.description,
        applicableFrom: new Date(formData.applicableFrom),
        isDefault: formData.isDefault,
        autoApply: formData.autoApply,
        conditions: formData.conditions,
        createdAt: new Date(),
        lastModified: new Date()
      };
      
      onSubmit(taxRateData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      rate: '',
      region: '',
      type: 'GST',
      description: '',
      applicableFrom: new Date().toISOString().split('T')[0],
      isDefault: false,
      autoApply: false,
      conditions: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Tax Rate</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Tax Rate Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Standard GST, Reduced VAT"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate (%) *
                </label>
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.rate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 18"
                  min="0"
                  max="100"
                  step="0.01"
                />
                {errors.rate && <p className="mt-1 text-sm text-red-600">{errors.rate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {taxTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region *
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.region ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select region</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                {errors.region && <p className="mt-1 text-sm text-red-600">{errors.region}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe when and how this tax rate should be applied..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>

          {/* Applicability Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Applicability Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Applicable From *
                </label>
                <input
                  type="date"
                  name="applicableFrom"
                  value={formData.applicableFrom}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.applicableFrom ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.applicableFrom && <p className="mt-1 text-sm text-red-600">{errors.applicableFrom}</p>}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Set as Default Rate
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="autoApply"
                    checked={formData.autoApply}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Auto-Apply
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Application Conditions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Application Conditions
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conditions (Optional)
              </label>
              <textarea
                name="conditions"
                value={formData.conditions}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Specify any conditions for applying this tax rate (e.g., minimum order value, specific product categories, etc.)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave blank if this tax rate should be applied universally within the selected region.
              </p>
            </div>
          </div>

          {/* Tax Rate Preview */}
          {formData.rate && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Rate Preview</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax Rate:</span>
                    <span className="font-medium">{formData.rate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{formData.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Region:</span>
                    <span className="font-medium">{formData.region}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">
                      {formData.isDefault ? 'Default Rate' : 'Active Rate'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Auto-Apply:</span>
                    <span className="font-medium">
                      {formData.autoApply ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add Tax Rate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 