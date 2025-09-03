import React, { useState } from 'react';
import { User, ArrowLeft, MessageSquare, FileText, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile } from './UserProfile';
import { UserLeads } from './UserLeads';
import { FAQSuggestions } from './FAQSuggestions';

interface UserDashboardProps {
  onBack: () => void;
}

type UserTab = 'profile' | 'leads' | 'suggestions';

export function UserDashboard({ onBack }: UserDashboardProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<UserTab>('profile');

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'leads', label: 'My Leads', icon: MessageSquare },
    { id: 'suggestions', label: 'FAQ Suggestions', icon: FileText },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile />;
      case 'leads':
        return <UserLeads />;
      case 'suggestions':
        return <FAQSuggestions />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-orange-50">
      <div className="bg-white shadow-sm border-b border-emerald-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 text-white p-2 rounded-lg">
                  <User size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
                  <p className="text-sm text-gray-600">Welcome, {profile?.full_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as UserTab)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}