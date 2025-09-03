import React, { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Search, Upload, Download, RefreshCw } from 'lucide-react';
import { FAQ } from '../../types';

export function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'Where is Sarawak Cultural Village?',
      answer: 'Sarawak Cultural Village is located at Damai Beach on the Santubong peninsula, about 30-40 minutes drive from Kuching city center.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'admin'
    },
    {
      id: '2',
      question: 'What foods should I try in Kuching?',
      answer: 'Must-try Kuching foods include laksa Sarawak, kolo mee, ayam pansuh, and layer cake. Best found at local kopitiams and food courts.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'admin'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFAQ = () => {
    if (newFAQ.question && newFAQ.answer) {
      const faq: FAQ = {
        id: Date.now().toString(),
        question: newFAQ.question,
        answer: newFAQ.answer,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'admin'
      };
      setFaqs(prev => [...prev, faq]);
      setNewFAQ({ question: '', answer: '' });
      setShowAddModal(false);
    }
  };

  const handleUpdateFAQ = () => {
    if (editingFAQ) {
      setFaqs(prev => prev.map(faq => 
        faq.id === editingFAQ.id 
          ? { ...editingFAQ, updated_at: new Date().toISOString() }
          : faq
      ));
      setEditingFAQ(null);
    }
  };

  const handleDeleteFAQ = (id: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(prev => prev.filter(faq => faq.id !== id));
    }
  };

  const handleReindex = () => {
    // Simulate reindexing
    alert('Knowledge base reindexed successfully!');
  };

  const handleExport = () => {
    const csvContent = [
      ['Question', 'Answer', 'Created', 'Updated'],
      ...faqs.map(faq => [
        faq.question,
        faq.answer,
        new Date(faq.created_at).toLocaleDateString(),
        new Date(faq.updated_at).toLocaleDateString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sarawak-faqs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText size={24} className="text-white" />
            <h2 className="text-xl font-bold text-white">FAQ Management</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReindex}
              className="bg-white bg-opacity-20 text-white px-3 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2"
            >
              <RefreshCw size={16} />
              <span>Reindex</span>
            </button>
            <button
              onClick={handleExport}
              className="bg-white bg-opacity-20 text-white px-3 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white bg-opacity-20 text-white px-3 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add FAQ</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm mb-3">{faq.answer}</p>
                  <div className="text-xs text-gray-400">
                    Updated: {new Date(faq.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setEditingFAQ(faq)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteFAQ(faq.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No FAQs found</p>
          </div>
        )}
      </div>

      {/* Add FAQ Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New FAQ</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                <input
                  type="text"
                  value={newFAQ.question}
                  onChange={(e) => setNewFAQ(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter the question..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                <textarea
                  value={newFAQ.answer}
                  onChange={(e) => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                  placeholder="Enter the answer..."
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
                  onClick={handleAddFAQ}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  Add FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit FAQ Modal */}
      {editingFAQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Edit FAQ</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                <input
                  type="text"
                  value={editingFAQ.question}
                  onChange={(e) => setEditingFAQ(prev => prev ? { ...prev, question: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                <textarea
                  value={editingFAQ.answer}
                  onChange={(e) => setEditingFAQ(prev => prev ? { ...prev, answer: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setEditingFAQ(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateFAQ}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  Update FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}