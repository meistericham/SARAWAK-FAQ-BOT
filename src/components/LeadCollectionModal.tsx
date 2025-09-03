import React, { useState } from 'react';
import { X, User, Mail, Phone, Tag } from 'lucide-react';
import { LeadData } from '../types';

interface LeadCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: LeadData) => void;
}

const interestOptions = [
  { value: 'Tours', label: 'Tours & Attractions', icon: '🗺️' },
  { value: 'Events', label: 'Events & Festivals', icon: '🎉' },
  { value: 'Homestay', label: 'Homestay & Accommodation', icon: '🏡' },
  { value: 'Food', label: 'Food & Dining', icon: '🍜' },
  { value: 'Transport', label: 'Transport & Travel', icon: '🚗' },
  { value: 'General', label: 'General Information', icon: '💬' },
];

export function LeadCollectionModal({ isOpen, onClose, onSubmit }: LeadCollectionModalProps) {
  const [formData, setFormData] = useState<LeadData>({
    name: '',
    emailOrPhone: '',
    interestTag: 'General',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.emailOrPhone) {
      onSubmit(formData);
      setFormData({ name: '', emailOrPhone: '', interestTag: 'General' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Stay Connected!</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Let us keep you updated with the latest Sarawak tourism information!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-1" />
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline w-4 h-4 mr-1" />
              Email or Phone
            </label>
            <input
              type="text"
              id="contact"
              value={formData.emailOrPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, emailOrPhone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="your@email.com or +60123456789"
              required
            />
          </div>

          <div>
            <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline w-4 h-4 mr-1" />
              Main Interest
            </label>
            <select
              id="interest"
              value={formData.interestTag}
              onChange={(e) => setFormData(prev => ({ ...prev, interestTag: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {interestOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Maybe Later
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200 font-medium"
            >
              Yes, Keep Me Updated!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}