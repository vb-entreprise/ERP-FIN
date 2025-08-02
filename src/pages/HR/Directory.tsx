/**
 * HR Employee Directory & Skills Matrix Page
 * Author: VB Entreprise
 * 
 * Employee profiles with contact info, skills, certifications,
 * and searchable skills matrix for project assignments
 */

import React, { useState } from 'react';
import { Plus, Search, Filter, User, Mail, Phone, MapPin, Star, Award, Calendar } from 'lucide-react';
import CreateEmployeeModal from '../../components/Modals/CreateEmployeeModal';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  manager: string;
  location: string;
  joinDate: Date;
  avatar: string;
  skills: Skill[];
  certifications: Certification[];
  status: 'active' | 'inactive' | 'on-leave';
}

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsExperience: number;
  lastUsed: Date;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@vbenterprise.com',
    phone: '+1-555-0123',
    position: 'Senior Developer',
    department: 'Engineering',
    manager: 'Tech Lead',
    location: 'Mumbai, India',
    joinDate: new Date('2022-03-15'),
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    status: 'active',
    skills: [
      { id: '1', name: 'React', level: 'expert', yearsExperience: 4, lastUsed: new Date('2024-01-22') },
      { id: '2', name: 'Node.js', level: 'advanced', yearsExperience: 3, lastUsed: new Date('2024-01-20') },
      { id: '3', name: 'TypeScript', level: 'advanced', yearsExperience: 3, lastUsed: new Date('2024-01-22') },
      { id: '4', name: 'AWS', level: 'intermediate', yearsExperience: 2, lastUsed: new Date('2024-01-15') }
    ],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Developer',
        issuer: 'Amazon Web Services',
        issueDate: new Date('2023-06-15'),
        expiryDate: new Date('2026-06-15'),
        credentialId: 'AWS-DEV-2023-001'
      }
    ]
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@vbenterprise.com',
    phone: '+1-555-0124',
    position: 'UI/UX Designer',
    department: 'Design',
    manager: 'Design Lead',
    location: 'Delhi, India',
    joinDate: new Date('2021-08-20'),
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    status: 'active',
    skills: [
      { id: '5', name: 'Figma', level: 'expert', yearsExperience: 5, lastUsed: new Date('2024-01-22') },
      { id: '6', name: 'Adobe XD', level: 'advanced', yearsExperience: 4, lastUsed: new Date('2024-01-18') },
      { id: '7', name: 'Prototyping', level: 'expert', yearsExperience: 5, lastUsed: new Date('2024-01-20') },
      { id: '8', name: 'User Research', level: 'intermediate', yearsExperience: 2, lastUsed: new Date('2024-01-10') }
    ],
    certifications: [
      {
        id: '2',
        name: 'Google UX Design Certificate',
        issuer: 'Google',
        issueDate: new Date('2023-03-10'),
        credentialId: 'GOOGLE-UX-2023-002'
      }
    ]
  },
  {
    id: '3',
    name: 'Lisa Wong',
    email: 'lisa@vbenterprise.com',
    phone: '+1-555-0125',
    position: 'Project Manager',
    department: 'Operations',
    manager: 'Operations Director',
    location: 'Bangalore, India',
    joinDate: new Date('2020-11-05'),
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    status: 'on-leave',
    skills: [
      { id: '9', name: 'Agile', level: 'expert', yearsExperience: 6, lastUsed: new Date('2024-01-15') },
      { id: '10', name: 'Scrum', level: 'expert', yearsExperience: 6, lastUsed: new Date('2024-01-15') },
      { id: '11', name: 'Risk Management', level: 'advanced', yearsExperience: 4, lastUsed: new Date('2024-01-12') },
      { id: '12', name: 'Stakeholder Management', level: 'expert', yearsExperience: 5, lastUsed: new Date('2024-01-10') }
    ],
    certifications: [
      {
        id: '3',
        name: 'PMP Certification',
        issuer: 'Project Management Institute',
        issueDate: new Date('2022-09-20'),
        expiryDate: new Date('2025-09-20'),
        credentialId: 'PMP-2022-003'
      },
      {
        id: '4',
        name: 'Certified Scrum Master',
        issuer: 'Scrum Alliance',
        issueDate: new Date('2021-05-15'),
        expiryDate: new Date('2024-05-15'),
        credentialId: 'CSM-2021-004'
      }
    ]
  }
];

export default function Directory() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      'on-leave': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSkillLevelColor = (level: string) => {
    const colors = {
      beginner: 'bg-blue-100 text-blue-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getAllSkills = () => {
    const skills = new Set<string>();
    employees.forEach(employee => {
      employee.skills.forEach(skill => skills.add(skill.name));
    });
    return Array.from(skills);
  };

  const getAllDepartments = () => {
    const departments = new Set<string>();
    employees.forEach(employee => departments.add(employee.department));
    return Array.from(departments);
  };

  const handleCreateEmployee = (employeeData: any) => {
    const newEmployee: Employee = {
      id: employeeData.id,
      name: employeeData.name,
      email: employeeData.email,
      phone: employeeData.phone,
      position: employeeData.position,
      department: employeeData.department,
      manager: employeeData.manager,
      location: employeeData.location,
      joinDate: employeeData.joinDate,
      avatar: employeeData.avatar,
      status: employeeData.status,
      skills: employeeData.skills,
      certifications: employeeData.certifications
    };
    
    setEmployees(prev => [...prev, newEmployee]);
    setIsCreateModalOpen(false);
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesSkill = skillFilter === 'all' || employee.skills.some(skill => skill.name === skillFilter);
    return matchesSearch && matchesDepartment && matchesSkill;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Employee Directory & Skills Matrix</h1>
          <p className="mt-2 text-gray-600">
            Browse employee profiles, skills, certifications, and find expertise for projects.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Employee Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <User className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{employees.filter(e => e.status === 'active').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Certifications</p>
              <p className="text-2xl font-bold text-gray-900">
                {employees.reduce((sum, emp) => sum + emp.certifications.length, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">On Leave</p>
              <p className="text-2xl font-bold text-gray-900">{employees.filter(e => e.status === 'on-leave').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Employee List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {getAllDepartments().map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            >
              <option value="all">All Skills</option>
              {getAllSkills().map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          {/* Employee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className={`bg-white p-6 rounded-lg border-2 shadow-sm cursor-pointer transition-all duration-200 ${
                  selectedEmployee?.id === employee.id
                    ? 'border-blue-300 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedEmployee(employee)}
              >
                <div className="flex items-center mb-4">
                  <img
                    className="h-12 w-12 rounded-full mr-4"
                    src={employee.avatar}
                    alt={employee.name}
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.position}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(employee.status)}`}>
                      {employee.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {employee.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {employee.department} • {employee.location}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Top Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {employee.skills.slice(0, 3).map((skill) => (
                      <span key={skill.id} className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSkillLevelColor(skill.level)}`}>
                        {skill.name}
                      </span>
                    ))}
                    {employee.skills.length > 3 && (
                      <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        +{employee.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Detail Panel */}
        <div className="lg:col-span-1">
          {selectedEmployee ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Employee Profile</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Profile Header */}
                <div className="text-center">
                  <img
                    className="mx-auto h-20 w-20 rounded-full"
                    src={selectedEmployee.avatar}
                    alt={selectedEmployee.name}
                  />
                  <h4 className="mt-4 text-lg font-medium text-gray-900">{selectedEmployee.name}</h4>
                  <p className="text-sm text-gray-600">{selectedEmployee.position}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(selectedEmployee.status)}`}>
                    {selectedEmployee.status.replace('-', ' ')}
                  </span>
                </div>

                {/* Contact Information */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{selectedEmployee.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{selectedEmployee.location}</span>
                    </div>
                  </div>
                </div>

                {/* Skills Matrix */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Skills & Expertise</h5>
                  <div className="space-y-2">
                    {selectedEmployee.skills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                          <div className="text-xs text-gray-500">{skill.yearsExperience} years</div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSkillLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Certifications</h5>
                  <div className="space-y-3">
                    {selectedEmployee.certifications.map((cert) => (
                      <div key={cert.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-yellow-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                            <p className="text-xs text-gray-500">{cert.issuer}</p>
                            <p className="text-xs text-gray-400">
                              Issued: {cert.issueDate.toLocaleDateString()}
                              {cert.expiryDate && ` • Expires: ${cert.expiryDate.toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Employment Details */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Employment Details</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Department:</span>
                      <span className="font-medium text-gray-900">{selectedEmployee.department}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Manager:</span>
                      <span className="font-medium text-gray-900">{selectedEmployee.manager}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Join Date:</span>
                      <span className="font-medium text-gray-900">{selectedEmployee.joinDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No employee selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select an employee to view their profile and skills.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Employee Modal */}
      <CreateEmployeeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEmployee}
      />
    </div>
  );
}