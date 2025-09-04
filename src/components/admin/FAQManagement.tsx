import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Search, Upload, Download, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { FAQ } from '../../types';
import { FAQService } from '../../services/faqService';

export function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '', category: 'general' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reindexing, setReindexing] = useState(false);

  const categories = [
    'general',
    'attractions', 
    'food',
    'accommodation',
    'transport',
    'culture',
    'events'
  ];

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await FAQService.getAllFAQs();
      setFaqs(data);
    } catch (err: any) {
      console.error('Failed to fetch FAQs:', err);
      setError(err.message || 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (faq.category && faq.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const validateFAQ = (question: string, answer: string): string | null => {
    if (!question.trim()) {
      return 'Question is required';
    }
    if (question.trim().length < 10) {
      return 'Question must be at least 10 characters long';
    }
    if (!answer.trim()) {
      return 'Answer is required';
    }
    if (answer.trim().length < 20) {
      return 'Answer must be at least 20 characters long';
    }
    return null;
  };

  const handleAddFAQ = async () => {
    const validationError = validateFAQ(newFAQ.question, newFAQ.answer);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const createdFAQ = await FAQService.createFAQ({
        question: newFAQ.question,
        answer: newFAQ.answer,
        category: newFAQ.category
      });

      setFaqs(prev => [createdFAQ, ...prev]);
      setNewFAQ({ question: '', answer: '', category: 'general' });
      setShowAddModal(false);
      setSuccess('FAQ added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Failed to add FAQ:', err);
      setError(err.message || 'Failed to add FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFAQ = async () => {
    if (!editingFAQ) return;

    const validationError = validateFAQ(editingFAQ.question, editingFAQ.answer);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updatedFAQ = await FAQService.updateFAQ(editingFAQ.id, {
        question: editingFAQ.question,
        answer: editingFAQ.answer,
        category: editingFAQ.category
      });

      setFaqs(prev => prev.map(faq => 
        faq.id === editingFAQ.id ? updatedFAQ : faq
      ));
      setEditingFAQ(null);
      setSuccess('FAQ updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Failed to update FAQ:', err);
      setError(err.message || 'Failed to update FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    setError('');
    setSuccess('');

    try {
      await FAQService.deleteFAQ(id);
      setFaqs(prev => prev.filter(faq => faq.id !== id));
      setSuccess('FAQ deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Failed to delete FAQ:', err);
      setError(err.message || 'Failed to delete FAQ');
    }
  };

  const handleReindex = async () => {
    setReindexing(true);
    setError('');
    setSuccess('');

    try {
      await FAQService.reindexKnowledgeBase();
      setSuccess('Knowledge base reindexed successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Failed to reindex:', err);
      setError(err.message || 'Failed to reindex knowledge base');
    } finally {
      setReindexing(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Question', 'Answer', 'Category', 'Status', 'Created', 'Updated'],
      ...filteredFAQs.map(faq => [
        faq.question,
        faq.answer,
        faq.category || 'general',
        faq.is_active ? 'Active' : 'Inactive',
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <FileText size={24} className="text-white" />
            <h2 className="text-xl font-bold text-white">FAQ Management</h2>
          </div>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-gray-600">Loading FAQs...</span>
        </div>
      </div>
    );
  }

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
              disabled={reindexing}
              className="bg-white bg-opacity-20 text-white px-3 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw size={16} className={reindexing ? 'animate-spin' : ''} />
              <span>{reindexing ? 'Reindexing...' : 'Reindex'}</span>
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
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

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
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-800">{faq.question}</h3>
                    {faq.category && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {faq.category}
                      </span>
                    )}
                    {!faq.is_active && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{faq.answer}</p>
                  <div className="text-xs text-gray-400">
                    Created: {new Date(faq.created_at).toLocaleDateString()} | 
                    Updated: {new Date(faq.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setEditingFAQ(faq)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="Edit FAQ"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteFAQ(faq.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Delete FAQ"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'No FAQs found matching your search' : 'No FAQs found'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors duration-200"
              >
                Add Your First FAQ
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add FAQ Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New FAQ</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newFAQ.category}
                  onChange={(e) => setNewFAQ(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newFAQ.question}
                  onChange={(e) => setNewFAQ(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter the question (minimum 10 characters)..."
                  minLength={10}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {newFAQ.question.length}/10 characters minimum
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newFAQ.answer}
                  onChange={(e) => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                  placeholder="Enter the answer (minimum 20 characters)..."
                  minLength={20}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {newFAQ.answer.length}/20 characters minimum
                </p>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewFAQ({ question: '', answer: '', category: 'general' });
                    setError('');
                  }}
                  disabled={saving}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFAQ}
                  disabled={saving || !newFAQ.question.trim() || !newFAQ.answer.trim()}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <span>Add FAQ</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit FAQ Modal */}
      {editingFAQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Edit FAQ</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={editingFAQ.category || 'general'}
                  onChange={(e) => setEditingFAQ(prev => prev ? { ...prev, category: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingFAQ.question}
                  onChange={(e) => setEditingFAQ(prev => prev ? { ...prev, question: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  minLength={10}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editingFAQ.question.length}/10 characters minimum
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editingFAQ.answer}
                  onChange={(e) => setEditingFAQ(prev => prev ? { ...prev, answer: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                  minLength={20}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editingFAQ.answer.length}/20 characters minimum
                </p>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setEditingFAQ(null);
                    setError('');
                  }}
                  disabled={saving}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateFAQ}
                  disabled={saving || !editingFAQ.question.trim() || !editingFAQ.answer.trim()}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update FAQ</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}