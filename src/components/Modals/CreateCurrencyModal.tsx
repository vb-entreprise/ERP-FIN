import React, { useState } from 'react';
import { X, Globe, DollarSign, Settings, RefreshCw } from 'lucide-react';

interface CreateCurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (currencyData: any) => void;
}

export default function CreateCurrencyModal({ isOpen, onClose, onSubmit }: CreateCurrencyModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    symbol: '',
    exchangeRate: '',
    isBaseCurrency: false,
    roundingRule: 'round',
    decimalPlaces: '2',
    autoUpdate: false,
    updateFrequency: 'daily',
    rateSource: 'manual'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const commonCurrencies = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'PLN', name: 'Polish Złoty', symbol: 'zł' },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
    { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
    { code: 'ILS', name: 'Israeli Shekel', symbol: '₪' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' }
  ];

  const roundingRules = [
    { value: 'round', label: 'Round to nearest' },
    { value: 'floor', label: 'Round down (floor)' },
    { value: 'ceil', label: 'Round up (ceiling)' }
  ];

  const updateFrequencies = [
    { value: 'manual', label: 'Manual Update' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const rateSources = [
    { value: 'manual', label: 'Manual Entry' },
    { value: 'rbi', label: 'Reserve Bank of India' },
    { value: 'ecb', label: 'European Central Bank' },
    { value: 'fed', label: 'Federal Reserve' },
    { value: 'yahoo', label: 'Yahoo Finance' },
    { value: 'fixer', label: 'Fixer.io API' },
    { value: 'exchangerate', label: 'ExchangeRate-API' }
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

  const handleCurrencySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = commonCurrencies.find(curr => curr.code === e.target.value);
    if (selectedCurrency) {
      setFormData(prev => ({
        ...prev,
        code: selectedCurrency.code,
        name: selectedCurrency.name,
        symbol: selectedCurrency.symbol
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Currency code is required';
    } else if (formData.code.length !== 3) {
      newErrors.code = 'Currency code must be exactly 3 characters';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Currency name is required';
    }

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Currency symbol is required';
    }

    if (!formData.exchangeRate.trim()) {
      newErrors.exchangeRate = 'Exchange rate is required';
    } else if (isNaN(Number(formData.exchangeRate)) || Number(formData.exchangeRate) <= 0) {
      newErrors.exchangeRate = 'Exchange rate must be a positive number';
    }

    if (isNaN(Number(formData.decimalPlaces)) || Number(formData.decimalPlaces) < 0 || Number(formData.decimalPlaces) > 4) {
      newErrors.decimalPlaces = 'Decimal places must be between 0 and 4';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const currencyData = {
        id: `currency-${Date.now()}`,
        code: formData.code.toUpperCase(),
        name: formData.name,
        symbol: formData.symbol,
        exchangeRate: Number(formData.exchangeRate),
        isBaseCurrency: formData.isBaseCurrency,
        roundingRule: formData.roundingRule,
        decimalPlaces: Number(formData.decimalPlaces),
        autoUpdate: formData.autoUpdate,
        updateFrequency: formData.updateFrequency,
        rateSource: formData.rateSource,
        lastUpdated: new Date(),
        createdAt: new Date()
      };
      
      onSubmit(currencyData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      code: '',
      name: '',
      symbol: '',
      exchangeRate: '',
      isBaseCurrency: false,
      roundingRule: 'round',
      decimalPlaces: '2',
      autoUpdate: false,
      updateFrequency: 'daily',
      rateSource: 'manual'
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
          <h2 className="text-xl font-semibold text-gray-900">Add Currency</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Currency Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Currency Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Currency *
                </label>
                <select
                  onChange={handleCurrencySelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose from common currencies</option>
                  {commonCurrencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.code ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., USD"
                  maxLength={3}
                />
                {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., US Dollar"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency Symbol *
                </label>
                <input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.symbol ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., $"
                  maxLength={5}
                />
                {errors.symbol && <p className="mt-1 text-sm text-red-600">{errors.symbol}</p>}
              </div>
            </div>
          </div>

          {/* Exchange Rate Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Exchange Rate Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exchange Rate (1 INR = ?) *
                </label>
                <input
                  type="number"
                  name="exchangeRate"
                  value={formData.exchangeRate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.exchangeRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 0.012"
                  min="0"
                  step="0.0001"
                />
                {errors.exchangeRate && <p className="mt-1 text-sm text-red-600">{errors.exchangeRate}</p>}
                <p className="mt-1 text-xs text-gray-500">
                  Enter the exchange rate relative to INR (Indian Rupee)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate Source
                </label>
                <select
                  name="rateSource"
                  value={formData.rateSource}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {rateSources.map(source => (
                    <option key={source.value} value={source.value}>{source.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isBaseCurrency"
                  checked={formData.isBaseCurrency}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Set as Base Currency
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="autoUpdate"
                  checked={formData.autoUpdate}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Auto-Update Rates
                </label>
              </div>
            </div>

            {formData.autoUpdate && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Update Frequency
                </label>
                <select
                  name="updateFrequency"
                  value={formData.updateFrequency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {updateFrequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>{freq.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Formatting Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Formatting Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rounding Rule
                </label>
                <select
                  name="roundingRule"
                  value={formData.roundingRule}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {roundingRules.map(rule => (
                    <option key={rule.value} value={rule.value}>{rule.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Decimal Places *
                </label>
                <input
                  type="number"
                  name="decimalPlaces"
                  value={formData.decimalPlaces}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.decimalPlaces ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="2"
                  min="0"
                  max="4"
                />
                {errors.decimalPlaces && <p className="mt-1 text-sm text-red-600">{errors.decimalPlaces}</p>}
              </div>
            </div>
          </div>

          {/* Currency Preview */}
          {formData.code && formData.symbol && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Currency Preview</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Currency:</span>
                    <span className="font-medium">{formData.code} - {formData.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Symbol:</span>
                    <span className="font-medium">{formData.symbol}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Exchange Rate:</span>
                    <span className="font-medium">1 INR = {formData.exchangeRate} {formData.code}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">
                      {formData.isBaseCurrency ? 'Base Currency' : 'Active Currency'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Auto-Update:</span>
                    <span className="font-medium">
                      {formData.autoUpdate ? `${formData.updateFrequency} updates` : 'Manual updates'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium">
                      {formData.symbol}1,234.{'0'.repeat(Number(formData.decimalPlaces))} ({formData.roundingRule})
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
              Add Currency
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 