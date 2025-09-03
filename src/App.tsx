import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { ChatbotPage } from './components/chatbot/ChatbotPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserDashboard } from './components/user/UserDashboard';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';

type AppView = 'home' | 'chatbot' | 'dashboard';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('home');

  console.log('🎯 App State:', { 
    hasUser: !!user, 
    hasProfile: !!profile, 
    loading,
    profileRole: profile?.role,
    currentView 
  });

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading AskSarawak...</p>
          <p className="text-gray-400 text-sm mt-2">Initializing your session</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!user) {
    console.log('👤 No user - showing auth page');
    return <AuthPage />;
  }

  // Show loading if user exists but no profile yet
  if (!profile) {
    console.log('⏳ User exists but no profile - still loading');
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Setting up your profile...</p>
          <p className="text-gray-400 text-sm mt-2">Almost ready!</p>
        </div>
      </div>
    );
  }

  console.log('✅ Fully authenticated - rendering main app');

  const renderContent = () => {
    switch (currentView) {
      case 'chatbot':
        return <ChatbotPage onBack={() => setCurrentView('home')} />;
      case 'dashboard':
        return profile.role === 'ADMIN' ? (
          <AdminDashboard onBack={() => setCurrentView('home')} />
        ) : (
          <UserDashboard onBack={() => setCurrentView('home')} />
        );
      default:
        return (
          <>
            <Header>
              <Navigation
                onChatbotClick={() => setCurrentView('chatbot')}
                onDashboardClick={() => setCurrentView('dashboard')}
                userRole={profile.role}
              />
            </Header>
            <main className="container mx-auto px-4 py-8">
              <div className="max-w-4xl mx-auto text-center">
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                  <div className="bg-emerald-500 text-white p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <span className="text-3xl">🦜</span>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to AskSarawak</h1>
                  <p className="text-xl text-gray-600 mb-8">Tourism Assistant for Booth Staff</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                      onClick={() => setCurrentView('chatbot')}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
                    >
                      <div className="text-3xl mb-3">🤖</div>
                      <h3 className="text-xl font-bold mb-2">Tourism Chatbot</h3>
                      <p className="text-emerald-100">Interactive assistant for booth visitors</p>
                    </button>
                    
                    <button
                      onClick={() => setCurrentView('dashboard')}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                    >
                      <div className="text-3xl mb-3">{profile.role === 'ADMIN' ? '👑' : '⚙️'}</div>
                      <h3 className="text-xl font-bold mb-2">
                        {profile.role === 'ADMIN' ? 'Admin Dashboard' : 'User Dashboard'}
                      </h3>
                      <p className="text-blue-100">
                        {profile.role === 'ADMIN' ? 'Manage system and users' : 'Manage your profile'}
                      </p>
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Stats</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600">8</div>
                      <div className="text-sm text-emerald-700">Knowledge Base FAQs</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">156</div>
                      <div className="text-sm text-blue-700">Total Leads Collected</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">2.3s</div>
                      <div className="text-sm text-orange-700">Avg Response Time</div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-orange-50">
      {renderContent()}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;