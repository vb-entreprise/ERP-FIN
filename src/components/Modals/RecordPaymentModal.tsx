import React, { useState } from 'react';
import { X, DollarSign, CreditCard, Building, Smartphone, Calendar, FileText, User } from 'lucide-react';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentData: any) => void;
  invoices?: Array<{
    id: string;
    number: string;
    client: string;
    total: number;
    status: string;
  }>;
}

export default function RecordPaymentModal({ isOpen, onClose, onSubmit, invoices = [] }: RecordPaymentModalProps) {
  const [formData, setFormData] = useState({
    invoiceId: '',
    amount: '',
    method: 'bank',
    reference: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    gateway: '',
    fees: '0'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentMethods = [
    { value: 'bank', label: 'Bank Transfer', icon: Building },
    { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
    { value: 'upi', label: 'UPI', icon: Smartphone },
    { value: 'cash', label: 'Cash', icon: DollarSign }
  ];

  const gateways = [
    'Stripe',
    'PayPal',
    'Razorpay',
    'PayU',
    'Bank Transfer',
    'Cash'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.invoiceId.trim()) {
      newErrors.invoiceId = 'Invoice selection is required';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Payment amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Payment amount must be a positive number';
    }

    if (!formData.reference.trim()) {
      newErrors.reference = 'Payment reference is required';
    }

    if (!formData.date) {
      newErrors.date = 'Payment date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const selectedInvoice = invoices.find(inv => inv.id === formData.invoiceId);
      
      const paymentData = {
        id: `payment-${Date.now()}`,
        invoiceId: formData.invoiceId,
        amount: Number(formData.amount),
        method: formData.method,
        status: 'completed',
        date: new Date(formData.date),
        reference: formData.reference,
        client: selectedInvoice?.client || '',
        gateway: formData.gateway || 'Manual Entry',
        fees: Number(formData.fees),
        netAmount: Number(formData.amount) - Number(formData.fees),
        notes: formData.notes
      };
      
      onSubmit(paymentData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      invoiceId: '',
      amount: '',
      method: 'bank',
      reference: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      gateway: '',
      fees: '0'
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
          <h2 className="text-xl font-semibold text-gray-900">Record Payment</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Invoice Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Invoice Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Invoice *
              </label>
              <select
                name="invoiceId"
                value={formData.invoiceId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.invoiceId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select an invoice</option>
                {invoices.map(invoice => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.number} - {invoice.client} (₹{invoice.total.toLocaleString()})
                  </option>
                ))}
              </select>
              {errors.invoiceId && <p className="mt-1 text-sm text-red-600">{errors.invoiceId}</p>}
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Payment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Amount (₹) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter payment amount"
                  min="0"
                  step="0.01"
                />
                {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  name="method"
                  value={formData.method}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {paymentMethods.map(method => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Reference *
                </label>
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.reference ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Transaction ID, UPI reference, etc."
                />
                {errors.reference && <p className="mt-1 text-sm text-red-600">{errors.reference}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Gateway
                </label>
                <select
                  name="gateway"
                  value={formData.gateway}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select gateway</option>
                  {gateways.map(gateway => (
                    <option key={gateway} value={gateway}>{gateway}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gateway Fees (₹)
                </label>
                <input
                  type="number"
                  name="fees"
                  value={formData.fees}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any additional notes about this payment..."
              />
            </div>
          </div>

          {/* Payment Summary */}
          {formData.amount && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gross Amount:</span>
                    <span className="font-medium">₹{Number(formData.amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gateway Fees:</span>
                    <span className="font-medium text-red-600">-₹{Number(formData.fees).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                    <span>Net Amount:</span>
                    <span className="text-green-600">₹{(Number(formData.amount) - Number(formData.fees)).toLocaleString()}</span>
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 