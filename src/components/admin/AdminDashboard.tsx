import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Settings, BarChart3, ArrowLeft, Crown, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { UserManagement } from './UserManagement';
import { LeadManagement } from './LeadManagement';
import { FAQManagement } from './FAQManagement';
import { SystemSettings } from './SystemSettings';
import { Analytics } from './Analytics';

interface AdminDashboardProps {
  onBack: () => void;
}

type AdminTab = 'overview' | 'users' | 'faqs' | 'leads' | 'analytics' | 'settings';

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFAQs: 8, // From knowledge base
    totalLeads: 0,
    todayLeads: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Simulated lead stats (would come from actual leads table)
      const totalLeads = Math.floor(Math.random() * 150) + 50;
      const todayLeads = Math.floor(Math.random() * 15) + 5;

      setStats({
        totalUsers: userCount || 0,
        totalFAQs: 8,
        totalLeads,
        todayLeads,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'faqs', label: 'FAQs', icon: FileText },
    { id: 'leads', label: 'Leads', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Users</p>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users size={32} className="text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">FAQs</p>
                    <p className="text-3xl font-bold">{stats.totalFAQs}</p>
                  </div>
                  <FileText size={32} className="text-purple-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100">Total Leads</p>
                    <p className="text-3xl font-bold">{stats.totalLeads}</p>
                  </div>
                  <MessageSquare size={32} className="text-emerald-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Today's Leads</p>
                    <p className="text-3xl font-bold">{stats.todayLeads}</p>
                  </div>
                  <BarChart3 size={32} className="text-orange-200" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">New user registration: john@example.com</span>
                  <span className="text-xs text-gray-400 ml-auto">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Lead collected: Cultural Village inquiry</span>
                  <span className="text-xs text-gray-400 ml-auto">4 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">FAQ suggestion submitted</span>
                  <span className="text-xs text-gray-400 ml-auto">6 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'faqs':
        return <FAQManagement />;
      case 'leads':
        return <LeadManagement />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <SystemSettings />;
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
                <div className="bg-purple-500 text-white p-2 rounded-lg">
                  <Crown size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">Welcome back, {profile?.full_name}</p>
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
                      onClick={() => setActiveTab(tab.id as AdminTab)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-emerald-500 text-white shadow-md'
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