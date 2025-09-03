import React, { useState } from 'react';
import { MessageSquare, Search, Download, Calendar, Tag, User, Mail } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  emailOrPhone: string;
  interestTag: string;
  message: string;
  timestamp: string;
}

export function LeadManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('All');

  // Simulated leads data
  const leads: Lead[] = [
    {
      id: '1',
      name: 'John Tan',
      emailOrPhone: 'john.tan@email.com',
      interestTag: 'Tours',
      message: 'Where is Sarawak Cultural Village?',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Sarah Lee',
      emailOrPhone: '+60123456789',
      interestTag: 'Food',
      message: 'What are the must-try foods in Sarawak?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      name: 'Ahmad Rahman',
      emailOrPhone: 'ahmad.r@gmail.com',
      interestTag: 'Events',
      message: 'Tell me about upcoming festivals',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  const interestTags = ['All', 'Tours', 'Events', 'Homestay', 'Food', 'Transport', 'General'];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.emailOrPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag === 'All' || lead.interestTag === filterTag;
    return matchesSearch && matchesTag;
  });

  const exportLeads = () => {
    const csvContent = [
      ['Name', 'Contact', 'Interest', 'Message', 'Date'],
      ...filteredLeads.map(lead => [
        lead.name,
        lead.emailOrPhone,
        lead.interestTag,
        lead.message,
        new Date(lead.timestamp).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sarawak-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare size={24} className="text-white" />
            <h2 className="text-xl font-bold text-white">Lead Management</h2>
          </div>
          <button
            onClick={exportLeads}
            className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {interestTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Interest</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Message</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{lead.name}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Mail size={12} className="mr-1" />
                          {lead.emailOrPhone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center w-fit">
                      <Tag size={12} className="mr-1" />
                      {lead.interestTag}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-600 max-w-xs truncate" title={lead.message}>
                      {lead.message}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={12} className="mr-1" />
                      {new Date(lead.timestamp).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No leads found</p>
          </div>
        )}
      </div>
    </div>
  );
}