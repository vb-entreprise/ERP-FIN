/**
 * Create Employee Modal Component
 * Author: VB Entreprise
 * 
 * Modal form for creating new employees with
 * personal details, skills, and certifications
 */

import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Star, Award, Calendar, Building } from 'lucide-react';

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employeeData: any) => void;
}

export default function CreateEmployeeModal({ isOpen, onClose, onSubmit }: CreateEmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    manager: '',
    location: '',
    joinDate: '',
    status: 'active',
    skills: [{ id: '1', name: '', level: 'beginner', yearsExperience: 1, lastUsed: new Date().toISOString().split('T')[0] }],
    certifications: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const departmentOptions = [
    'Engineering',
    'Design',
    'Operations',
    'Sales',
    'Marketing',
    'Finance',
    'HR',
    'Support',
    'Other'
  ];

  const locationOptions = [
    'Mumbai, India',
    'Delhi, India',
    'Bangalore, India',
    'Chennai, India',
    'Hyderabad, India',
    'Pune, India',
    'Remote',
    'Other'
  ];

  const skillLevelOptions = [
    { value: 'beginner', label: 'Beginner', description: '0-2 years experience' },
    { value: 'intermediate', label: 'Intermediate', description: '2-4 years experience' },
    { value: 'advanced', label: 'Advanced', description: '4-6 years experience' },
    { value: 'expert', label: 'Expert', description: '6+ years experience' }
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

  const handleSkillChange = (index: number, field: string, value: string | number) => {
    const newSkills = [...formData.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => {
    const newSkill = {
      id: `skill-${Date.now()}`,
      name: '',
      level: 'beginner',
      yearsExperience: 1,
      lastUsed: new Date().toISOString().split('T')[0]
    };
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const removeSkill = (index: number) => {
    if (formData.skills.length > 1) {
      const newSkills = formData.skills.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, skills: newSkills }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Employee name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Employee name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.manager.trim()) {
      newErrors.manager = 'Manager is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.joinDate) {
      newErrors.joinDate = 'Join date is required';
    }

    // Validate skills
    const validSkills = formData.skills.filter(skill => skill.name.trim() !== '');
    if (validSkills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }

    // Validate individual skills
    formData.skills.forEach((skill, index) => {
      if (!skill.name.trim()) {
        newErrors[`skill-${index}-name`] = 'Skill name is required';
      }
      if (!skill.yearsExperience || skill.yearsExperience < 0) {
        newErrors[`skill-${index}-experience`] = 'Years of experience must be 0 or greater';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const validSkills = formData.skills.filter(skill => skill.name.trim() !== '');
      
      const employeeData = {
        id: `emp-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
        manager: formData.manager,
        location: formData.location,
        joinDate: new Date(formData.joinDate),
        avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000)}/pexels-photo-${Math.floor(Math.random() * 1000)}.jpeg?auto=compress&cs=tinysrgb&w=150`,
        status: formData.status,
        skills: validSkills.map(skill => ({
          ...skill,
          lastUsed: new Date(skill.lastUsed)
        })),
        certifications: formData.certifications,
        createdAt: new Date()
      };
      
      onSubmit(employeeData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      manager: '',
      location: '',
      joinDate: '',
      status: 'active',
      skills: [{ id: '1', name: '', level: 'beginner', yearsExperience: 1, lastUsed: new Date().toISOString().split('T')[0] }],
      certifications: []
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]" onClick={handleClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add New Employee</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Sarah Johnson"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="sarah@vbenterprise.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+1-555-0123"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Join Date *
                </label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.joinDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.joinDate && <p className="mt-1 text-sm text-red-600">{errors.joinDate}</p>}
              </div>
            </div>

            {/* Position and Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.position ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Senior Developer"
                />
                {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a department</option>
                  {departmentOptions.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
              </div>
            </div>

            {/* Manager and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manager *
                </label>
                <input
                  type="text"
                  name="manager"
                  value={formData.manager}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.manager ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Tech Lead"
                />
                {errors.manager && <p className="mt-1 text-sm text-red-600">{errors.manager}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a location</option>
                  {locationOptions.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>

            {/* Skills Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Skills & Expertise</h3>
                <button
                  type="button"
                  onClick={addSkill}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Star className="h-4 w-4" />
                  Add Skill
                </button>
              </div>
              {errors.skills && <p className="mt-1 text-sm text-red-600 mb-4">{errors.skills}</p>}

              <div className="space-y-4">
                {formData.skills.map((skill, index) => (
                  <div key={skill.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">Skill {index + 1}</h4>
                      {formData.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Skill Name *
                        </label>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`skill-${index}-name`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="e.g., React, Project Management"
                        />
                        {errors[`skill-${index}-name`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`skill-${index}-name`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Level
                        </label>
                        <select
                          value={skill.level}
                          onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {skillLevelOptions.map(level => (
                            <option key={level.value} value={level.value}>{level.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Years Experience *
                        </label>
                        <input
                          type="number"
                          value={skill.yearsExperience}
                          onChange={(e) => handleSkillChange(index, 'yearsExperience', parseInt(e.target.value))}
                          min="0"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`skill-${index}-experience`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`skill-${index}-experience`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`skill-${index}-experience`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                Add Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}