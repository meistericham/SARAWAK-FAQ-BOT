import React, { useState } from 'react';
import { MessageSquare, Calendar, Tag, User, Mail } from 'lucide-react';
import { Lead } from '../../types';

export function UserLeads() {
  // Simulated user's leads data
  const [leads] = useState<Lead[]>([
    {
      id: '1',
      name: 'John Tan',
      emailOrPhone: 'john.tan@email.com',
      interestTag: 'Tours',
      message: 'Where is Sarawak Cultural Village?',
      timestamp: new Date().toISOString(),
      source: 'chat_booth',
      sessionId: 'session_123',
      created_by: 'current_user'
    },
    {
      id: '2',
      name: 'Sarah Lee',
      emailOrPhone: '+60123456789',
      interestTag: 'Food',
      message: 'What are the must-try foods in Sarawak?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      source: 'chat_booth',
      sessionId: 'session_124',
      created_by: 'current_user'
    }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <MessageSquare size={24} className="text-white" />
          <h2 className="text-xl font-bold text-white">My Collected Leads</h2>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Leads you've collected from booth visitors. Total: <span className="font-semibold">{leads.length}</span>
          </p>
        </div>

        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
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
                  
                  <div className="ml-13">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center">
                        <Tag size={12} className="mr-1" />
                        {lead.interestTag}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {new Date(lead.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {lead.message && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <strong>Question:</strong> {lead.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {leads.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No leads collected yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Start chatting with visitors to collect leads!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}