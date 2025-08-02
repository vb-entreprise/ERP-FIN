import React, { useState } from 'react';
import { X, Hash, Users, MessageSquare, Lock } from 'lucide-react';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (channelData: any) => void;
}

export default function CreateChannelModal({ isOpen, onClose, onSubmit }: CreateChannelModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'public',
    description: '',
    members: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const channelTypes = [
    { 
      value: 'public', 
      label: 'Public Channel', 
      icon: <Hash className="h-4 w-4" />,
      description: 'Anyone can join and see messages'
    },
    { 
      value: 'private', 
      label: 'Private Channel', 
      icon: <Lock className="h-4 w-4" />,
      description: 'Invite-only, hidden from others'
    },
    { 
      value: 'direct', 
      label: 'Direct Message', 
      icon: <MessageSquare className="h-4 w-4" />,
      description: 'One-on-one conversation'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    if (!formData.name.trim()) {
      newErrors.name = 'Channel name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Channel name must be at least 3 characters';
    } else if (!/^[a-z0-9-_]+$/.test(formData.name)) {
      newErrors.name = 'Channel name can only contain lowercase letters, numbers, hyphens, and underscores';
    }

    if (formData.type === 'direct' && !formData.members.trim()) {
      newErrors.members = 'Please select a user for direct message';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const channelData = {
        id: `channel-${Date.now()}`,
        ...formData,
        members: formData.type === 'direct' ? 2 : (formData.members ? formData.members.split(',').length + 1 : 1),
        unread: 0,
        lastMessage: new Date(),
        createdAt: new Date()
      };
      
      onSubmit(channelData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: 'public',
      description: '',
      members: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]" onClick={handleClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create New Channel</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Channel Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Channel Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., general, development, announcements"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              <p className="mt-1 text-xs text-gray-500">Use lowercase letters, numbers, hyphens, and underscores only</p>
            </div>

            {/* Channel Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Channel Type
              </label>
              <div className="space-y-3">
                {channelTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <div className="flex items-center mt-0.5">
                        {type.icon}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What is this channel about?"
              />
            </div>

            {/* Members (for Direct Messages) */}
            {formData.type === 'direct' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select User *
                </label>
                <select
                  name="members"
                  value={formData.members}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.members ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose a user...</option>
                  <option value="sarah-johnson">Sarah Johnson</option>
                  <option value="mike-chen">Mike Chen</option>
                  <option value="lisa-wong">Lisa Wong</option>
                  <option value="john-doe">John Doe</option>
                  <option value="emma-wilson">Emma Wilson</option>
                </select>
                {errors.members && <p className="mt-1 text-sm text-red-600">{errors.members}</p>}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Create Channel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 