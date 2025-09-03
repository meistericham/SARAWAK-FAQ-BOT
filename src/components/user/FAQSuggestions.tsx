import React, { useState } from 'react';
import { FileText, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { FAQSuggestion } from '../../types';

export function FAQSuggestions() {
  const [suggestions, setSuggestions] = useState<FAQSuggestion[]>([
    {
      id: '1',
      question: 'What are the opening hours for Sarawak Museum?',
      answer: 'Sarawak Museum is open Tuesday to Sunday, 9:00 AM to 4:45 PM. Closed on Mondays and public holidays.',
      suggested_by: 'current_user',
      status: 'pending',
      created_at: new Date().toISOString()
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState({ question: '', answer: '' });

  const handleAddSuggestion = () => {
    if (newSuggestion.question && newSuggestion.answer) {
      const suggestion: FAQSuggestion = {
        id: Date.now().toString(),
        question: newSuggestion.question,
        answer: newSuggestion.answer,
        suggested_by: 'current_user',
        status: 'pending',
        created_at: new Date().toISOString()
      };
      setSuggestions(prev => [...prev, suggestion]);
      setNewSuggestion({ question: '', answer: '' });
      setShowAddModal(false);
    }
  };

  const getStatusIcon = (status: FAQSuggestion['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'approved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-500" />;
    }
  };

  const getStatusColor = (status: FAQSuggestion['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText size={24} className="text-white" />
            <h2 className="text-xl font-bold text-white">FAQ Suggestions</h2>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Suggest FAQ</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Suggest new FAQs for admin review. Total suggestions: <span className="font-semibold">{suggestions.length}</span>
          </p>
        </div>

        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{suggestion.question}</h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(suggestion.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(suggestion.status)}`}>
                    {suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">{suggestion.answer}</p>
              <div className="text-xs text-gray-400">
                Suggested on: {new Date(suggestion.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {suggestions.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No FAQ suggestions yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Help improve the knowledge base by suggesting new FAQs!
            </p>
          </div>
        )}
      </div>

      {/* Add Suggestion Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Suggest New FAQ</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                <input
                  type="text"
                  value={newSuggestion.question}
                  onChange={(e) => setNewSuggestion(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="What question should be added?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Suggested Answer</label>
                <textarea
                  value={newSuggestion.answer}
                  onChange={(e) => setNewSuggestion(prev => ({ ...prev, answer: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32"
                  placeholder="What should the answer be?"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSuggestion}
                  className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >
                  Submit Suggestion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}