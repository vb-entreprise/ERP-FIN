/**
 * CRM Contacts Page
 * Author: VB Entreprise
 * 
 * Contact directory with search, profiles, and bulk actions
 */

import React, { useState } from 'react';
import { Plus, Search, Download, Upload, Mail, Phone, Building, User, MapPin, Calendar } from 'lucide-react';
import CreateContactModal from '../../components/Modals/CreateContactModal';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  avatar?: string;
  address: string;
  linkedLeads: number;
  linkedOpportunities: number;
  lastContact: Date;
  tags: string[];
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1-555-0123',
    company: 'TechCorp Solutions',
    role: 'CTO',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150',
    address: '123 Tech Street, San Francisco, CA',
    linkedLeads: 2,
    linkedOpportunities: 1,
    lastContact: new Date('2024-01-20'),
    tags: ['decision-maker', 'technical']
  },
  {
    id: '2',
    name: 'Emily Davis',
    email: 'emily@startup.io',
    phone: '+1-555-0124',
    company: 'Startup Innovation',
    role: 'CEO',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    address: '456 Innovation Ave, Austin, TX',
    linkedLeads: 1,
    linkedOpportunities: 2,
    lastContact: new Date('2024-01-22'),
    tags: ['decision-maker', 'startup']
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@digitalagency.com',
    phone: '+1-555-0125',
    company: 'Digital Creative Agency',
    role: 'Marketing Director',
    address: '789 Creative Blvd, New York, NY',
    linkedLeads: 0,
    linkedOpportunities: 1,
    lastContact: new Date('2024-01-18'),
    tags: ['marketing', 'creative']
  }
];

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    setSelectedContacts(
      selectedContacts.length === filteredContacts.length 
        ? [] 
        : filteredContacts.map(contact => contact.id)
    );
  };

  const exportContacts = () => {
    console.log('Exporting contacts:', selectedContacts);
  };

  const sendGroupEmail = () => {
    console.log('Sending group email to:', selectedContacts);
  };

  const handleCreateContact = (contactData: any) => {
    const newContact: Contact = {
      ...contactData,
      id: contactData.id,
      linkedLeads: 0,
      linkedOpportunities: 0,
      lastContact: new Date(),
      tags: contactData.tags || []
    };
    
    setContacts(prev => [newContact, ...prev]);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="mt-2 text-gray-600">
            Manage your contact directory with search, profiles, and bulk actions.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 transition-colors duration-200">
            <Upload className="h-4 w-4" />
            Import CSV
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Contact
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contacts Directory */}
        <div className="lg:col-span-2">
          {/* Search and Bulk Actions */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, company, role..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {selectedContacts.length > 0 && (
              <div className="flex gap-2">
                <button 
                  onClick={exportContacts}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  Export ({selectedContacts.length})
                </button>
                <button 
                  onClick={sendGroupEmail}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Mail className="h-4 w-4" />
                  Email Group
                </button>
              </div>
            )}
          </div>

          {/* Contacts Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company & Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Linked Records</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContacts.map((contact) => (
                    <tr 
                      key={contact.id} 
                      className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                        selectedContact?.id === contact.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedContacts.includes(contact.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectContact(contact.id);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {contact.avatar ? (
                              <img className="h-10 w-10 rounded-full" src={contact.avatar} alt={contact.name} />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {contact.tags.map((tag, index) => (
                                <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{contact.company}</div>
                        <div className="text-sm text-gray-500">{contact.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{contact.email}</div>
                        <div className="text-sm text-gray-500">{contact.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{contact.linkedLeads} leads</div>
                        <div className="text-sm text-gray-500">{contact.linkedOpportunities} opportunities</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contact.lastContact.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Contact Profile */}
        <div className="lg:col-span-1">
          {selectedContact ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Contact Profile</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Profile Header */}
                <div className="text-center">
                  {selectedContact.avatar ? (
                    <img className="mx-auto h-20 w-20 rounded-full" src={selectedContact.avatar} alt={selectedContact.name} />
                  ) : (
                    <div className="mx-auto h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-10 w-10 text-gray-500" />
                    </div>
                  )}
                  <h4 className="mt-4 text-lg font-medium text-gray-900">{selectedContact.name}</h4>
                  <p className="text-sm text-gray-500">{selectedContact.role} at {selectedContact.company}</p>
                </div>

                {/* Contact Information */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h5>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900">{selectedContact.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900">{selectedContact.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900">{selectedContact.company}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-400 mr-3 mt-0.5" />
                      <span className="text-sm text-gray-900">{selectedContact.address}</span>
                    </div>
                  </div>
                </div>

                {/* Linked Records */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Linked Records</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Leads</span>
                      <span className="text-sm font-medium text-gray-900">{selectedContact.linkedLeads}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Opportunities</span>
                      <span className="text-sm font-medium text-gray-900">{selectedContact.linkedOpportunities}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedContact.tags.map((tag, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Last Contact */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Last Contact</h5>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{selectedContact.lastContact.toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <Mail className="h-4 w-4" />
                    Send Email
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                    <Phone className="h-4 w-4" />
                    Call Contact
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No contact selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a contact from the directory to view their profile.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Contact Modal */}
      <CreateContactModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateContact}
      />
    </div>
  );
}