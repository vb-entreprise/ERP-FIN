/**
 * Create VPS Server Modal Component
 * Author: VB Entreprise
 * 
 * Modal form for adding new VPS servers with provider selection,
 * plan configuration, and monitoring setup
 */

import React, { useState } from 'react';
import { X, Server, Building, MapPin, Cpu, HardDrive, Wifi, DollarSign, Tag, Database } from 'lucide-react';

interface CreateVPSServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (serverData: any) => void;
}

export default function CreateVPSServerModal({ isOpen, onClose, onSubmit }: CreateVPSServerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    hostname: '',
    ipAddress: '',
    provider: '',
    location: '',
    plan: '',
    ram: '',
    cpu: '',
    storage: '',
    bandwidth: '',
    monthlyCost: '',
    tags: '',
    notes: '',
    monitoringEnabled: true,
    backupEnabled: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const providers = [
    { value: 'DigitalOcean', label: 'DigitalOcean' },
    { value: 'AWS', label: 'Amazon Web Services' },
    { value: 'Linode', label: 'Linode' },
    { value: 'Vultr', label: 'Vultr' },
    { value: 'Google Cloud', label: 'Google Cloud Platform' },
    { value: 'Azure', label: 'Microsoft Azure' }
  ];

  const locations = [
    { value: 'Mumbai', label: 'Mumbai, India' },
    { value: 'Bangalore', label: 'Bangalore, India' },
    { value: 'Delhi', label: 'Delhi, India' },
    { value: 'Singapore', label: 'Singapore' },
    { value: 'Tokyo', label: 'Tokyo, Japan' },
    { value: 'Frankfurt', label: 'Frankfurt, Germany' },
    { value: 'New York', label: 'New York, USA' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Server name is required';
    if (!formData.hostname.trim()) newErrors.hostname = 'Hostname is required';
    if (!formData.provider) newErrors.provider = 'Provider selection is required';
    if (!formData.location) newErrors.location = 'Location selection is required';
    if (!formData.monthlyCost.trim()) newErrors.monthlyCost = 'Monthly cost is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the form
    onSubmit({
      ...formData,
      monthlyCost: parseFloat(formData.monthlyCost),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      id: Date.now().toString(),
      status: 'online',
      uptime: 100,
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      networkIn: 0,
      networkOut: 0,
      createdAt: new Date()
    });

    // Reset form and close modal
    setFormData({
      name: '',
      hostname: '',
      ipAddress: '',
      provider: '',
      location: '',
      plan: '',
      ram: '',
      cpu: '',
      storage: '',
      bandwidth: '',
      monthlyCost: '',
      tags: '',
      notes: '',
      monitoringEnabled: true,
      backupEnabled: true
    });
    setErrors({});
    onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Add New VPS Server</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <Server className="h-5 w-5 mr-2" />
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Server Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Web Server - Production"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hostname *
                  </label>
                  <input
                    type="text"
                    name="hostname"
                    value={formData.hostname}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.hostname ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., web-prod-01"
                  />
                  {errors.hostname && <p className="text-red-500 text-xs mt-1">{errors.hostname}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IP Address
                  </label>
                  <input
                    type="text"
                    name="ipAddress"
                    value={formData.ipAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 192.168.1.100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan/Specification
                  </label>
                  <input
                    type="text"
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 4GB RAM, 2 vCPU, 80GB SSD"
                  />
                </div>
              </div>
            </div>

            {/* Provider & Location */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Provider & Location
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provider *
                  </label>
                  <select
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.provider ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a provider</option>
                    {providers.map(provider => (
                      <option key={provider.value} value={provider.value}>
                        {provider.label}
                      </option>
                    ))}
                  </select>
                  {errors.provider && <p className="text-red-500 text-xs mt-1">{errors.provider}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.location ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a location</option>
                    {locations.map(location => (
                      <option key={location.value} value={location.value}>
                        {location.label}
                      </option>
                    ))}
                  </select>
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <Cpu className="h-5 w-5 mr-2" />
                Specifications
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">
                     <Database className="inline h-4 w-4 mr-1" />
                     RAM
                   </label>
                  <input
                    type="text"
                    name="ram"
                    value={formData.ram}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 4GB"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Cpu className="inline h-4 w-4 mr-1" />
                    CPU Cores
                  </label>
                  <input
                    type="text"
                    name="cpu"
                    value={formData.cpu}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 2 vCPU"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <HardDrive className="inline h-4 w-4 mr-1" />
                    Storage
                  </label>
                  <input
                    type="text"
                    name="storage"
                    value={formData.storage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 80GB SSD"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Wifi className="inline h-4 w-4 mr-1" />
                    Bandwidth
                  </label>
                  <input
                    type="text"
                    name="bandwidth"
                    value={formData.bandwidth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 1TB/month"
                  />
                </div>
              </div>
            </div>

            {/* Cost & Tags */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Cost & Organization
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Cost (₹) *
                  </label>
                  <input
                    type="number"
                    name="monthlyCost"
                    value={formData.monthlyCost}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.monthlyCost ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                  />
                  {errors.monthlyCost && <p className="text-red-500 text-xs mt-1">{errors.monthlyCost}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Tag className="inline h-4 w-4 mr-1" />
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="production, web-server, critical"
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="monitoringEnabled"
                    checked={formData.monitoringEnabled}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Enable monitoring and alerts
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="backupEnabled"
                    checked={formData.backupEnabled}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Enable automated backups
                  </label>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any additional notes about this server..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Add Server
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 