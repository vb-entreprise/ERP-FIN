import React, { useState } from 'react';
import { X, TrendingUp, Calendar, FileText, Download, Filter } from 'lucide-react';

interface GenerateTaxReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportData: any) => void;
}

export default function GenerateTaxReportModal({ isOpen, onClose, onSubmit }: GenerateTaxReportModalProps) {
  const [formData, setFormData] = useState({
    reportType: 'quarterly',
    period: '',
    startDate: '',
    endDate: '',
    taxTypes: [] as string[],
    includeDetails: true,
    includeSummary: true,
    includeCharts: true,
    format: 'pdf',
    emailReport: false,
    emailAddress: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const reportTypes = [
    { value: 'monthly', label: 'Monthly Report' },
    { value: 'quarterly', label: 'Quarterly Report' },
    { value: 'annual', label: 'Annual Report' },
    { value: 'custom', label: 'Custom Period' }
  ];

  const taxTypes = [
    { value: 'GST', label: 'GST (Goods and Services Tax)' },
    { value: 'VAT', label: 'VAT (Value Added Tax)' },
    { value: 'Sales Tax', label: 'Sales Tax' },
    { value: 'Service Tax', label: 'Service Tax' },
    { value: 'Custom Duty', label: 'Custom Duty' },
    { value: 'Excise Duty', label: 'Excise Duty' }
  ];

  const reportFormats = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV File' },
    { value: 'json', label: 'JSON Data' }
  ];

  const quarters = [
    { value: 'Q1-2024', label: 'Q1 2024 (Jan - Mar)' },
    { value: 'Q2-2024', label: 'Q2 2024 (Apr - Jun)' },
    { value: 'Q3-2024', label: 'Q3 2024 (Jul - Sep)' },
    { value: 'Q4-2024', label: 'Q4 2024 (Oct - Dec)' },
    { value: 'Q1-2023', label: 'Q1 2023 (Jan - Mar)' },
    { value: 'Q2-2023', label: 'Q2 2023 (Apr - Jun)' },
    { value: 'Q3-2023', label: 'Q3 2023 (Jul - Sep)' },
    { value: 'Q4-2023', label: 'Q4 2023 (Oct - Dec)' }
  ];

  const months = [
    { value: '2024-01', label: 'January 2024' },
    { value: '2024-02', label: 'February 2024' },
    { value: '2024-03', label: 'March 2024' },
    { value: '2024-04', label: 'April 2024' },
    { value: '2024-05', label: 'May 2024' },
    { value: '2024-06', label: 'June 2024' },
    { value: '2024-07', label: 'July 2024' },
    { value: '2024-08', label: 'August 2024' },
    { value: '2024-09', label: 'September 2024' },
    { value: '2024-10', label: 'October 2024' },
    { value: '2024-11', label: 'November 2024' },
    { value: '2024-12', label: 'December 2024' }
  ];

  const years = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleTaxTypeChange = (taxType: string) => {
    setFormData(prev => ({
      ...prev,
      taxTypes: prev.taxTypes.includes(taxType)
        ? prev.taxTypes.filter(type => type !== taxType)
        : [...prev.taxTypes, taxType]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.reportType) {
      newErrors.reportType = 'Report type is required';
    }

    if (formData.reportType === 'custom') {
      if (!formData.startDate) {
        newErrors.startDate = 'Start date is required for custom period';
      }
      if (!formData.endDate) {
        newErrors.endDate = 'End date is required for custom period';
      }
      if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    } else {
      if (!formData.period) {
        newErrors.period = 'Period selection is required';
      }
    }

    if (formData.taxTypes.length === 0) {
      newErrors.taxTypes = 'At least one tax type must be selected';
    }

    if (formData.emailReport && !formData.emailAddress) {
      newErrors.emailAddress = 'Email address is required when emailing report';
    }

    if (formData.emailReport && formData.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const reportData = {
        id: `tax-report-${Date.now()}`,
        reportType: formData.reportType,
        period: formData.period,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        taxTypes: formData.taxTypes,
        includeDetails: formData.includeDetails,
        includeSummary: formData.includeSummary,
        includeCharts: formData.includeCharts,
        format: formData.format,
        emailReport: formData.emailReport,
        emailAddress: formData.emailAddress,
        status: 'generating',
        createdAt: new Date(),
        generatedAt: null
      };
      
      onSubmit(reportData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      reportType: 'quarterly',
      period: '',
      startDate: '',
      endDate: '',
      taxTypes: [],
      includeDetails: true,
      includeSummary: true,
      includeCharts: true,
      format: 'pdf',
      emailReport: false,
      emailAddress: ''
    });
    setErrors({});
    onClose();
  };

  const getPeriodOptions = () => {
    switch (formData.reportType) {
      case 'monthly':
        return months;
      case 'quarterly':
        return quarters;
      case 'annual':
        return years;
      default:
        return [];
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Generate Tax Report</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Report Configuration */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Report Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Type *
                </label>
                <select
                  name="reportType"
                  value={formData.reportType}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.reportType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {reportTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {errors.reportType && <p className="mt-1 text-sm text-red-600">{errors.reportType}</p>}
              </div>

              {formData.reportType !== 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Period *
                  </label>
                  <select
                    name="period"
                    value={formData.period}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.period ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select period</option>
                    {getPeriodOptions().map(period => (
                      <option key={period.value} value={period.value}>{period.label}</option>
                    ))}
                  </select>
                  {errors.period && <p className="mt-1 text-sm text-red-600">{errors.period}</p>}
                </div>
              )}
            </div>

            {formData.reportType === 'custom' && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.endDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Tax Types */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Tax Types
            </h3>
            <div className="space-y-2">
              {taxTypes.map(taxType => (
                <div key={taxType.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={taxType.value}
                    checked={formData.taxTypes.includes(taxType.value)}
                    onChange={() => handleTaxTypeChange(taxType.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={taxType.value} className="ml-2 text-sm text-gray-700">
                    {taxType.label}
                  </label>
                </div>
              ))}
              {errors.taxTypes && <p className="mt-1 text-sm text-red-600">{errors.taxTypes}</p>}
            </div>
          </div>

          {/* Report Content */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Report Content
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="includeSummary"
                  checked={formData.includeSummary}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Include Executive Summary
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="includeDetails"
                  checked={formData.includeDetails}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Include Detailed Breakdown
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="includeCharts"
                  checked={formData.includeCharts}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Include Charts & Graphs
                </label>
              </div>
            </div>
          </div>

          {/* Output Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Output Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Format
                </label>
                <select
                  name="format"
                  value={formData.format}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {reportFormats.map(format => (
                    <option key={format.value} value={format.value}>{format.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="emailReport"
                  checked={formData.emailReport}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Email Report
                </label>
              </div>
            </div>

            {formData.emailReport && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.emailAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.emailAddress && <p className="mt-1 text-sm text-red-600">{errors.emailAddress}</p>}
              </div>
            )}
          </div>

          {/* Report Preview */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Report Preview</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Report Type:</span>
                  <span className="font-medium">
                    {reportTypes.find(t => t.value === formData.reportType)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Period:</span>
                  <span className="font-medium">
                    {formData.reportType === 'custom' 
                      ? `${formData.startDate} to ${formData.endDate}`
                      : formData.period || 'Not selected'
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax Types:</span>
                  <span className="font-medium">
                    {formData.taxTypes.length > 0 
                      ? formData.taxTypes.join(', ')
                      : 'None selected'
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-medium">
                    {reportFormats.find(f => f.value === formData.format)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">
                    {formData.emailReport ? formData.emailAddress || 'Not provided' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

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
              Generate Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 