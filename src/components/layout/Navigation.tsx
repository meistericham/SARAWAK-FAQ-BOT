import React from 'react';
import { Settings, LogOut, Crown, User, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationProps {
  onChatbotClick: () => void;
  onDashboardClick: () => void;
  userRole: string;
}

export function Navigation({ onChatbotClick, onDashboardClick, userRole }: NavigationProps) {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="hidden md:block text-right">
        <p className="text-sm font-medium text-emerald-600">
          {profile?.full_name}
        </p>
        <p className="text-xs text-gray-500">
          {userRole === 'ADMIN' ? '👑 Administrator' : '👤 Staff User'}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onChatbotClick}
          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center space-x-1"
          title="Tourism Chatbot"
        >
          <MessageCircle size={20} />
          <span className="hidden sm:inline text-sm">Chatbot</span>
        </button>
        
        <button
          onClick={onChatbotClick}
          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center space-x-1"
          title="Tourism Chatbot"
        >
          <MessageCircle size={20} />
          <span className="hidden sm:inline text-sm">Chatbot</span>
        </button>
        
        <button
          onClick={onDashboardClick}
          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center space-x-1"
          title={userRole === 'ADMIN' ? 'Admin Dashboard' : 'User Dashboard'}
        >
          {userRole === 'ADMIN' ? <Crown size={20} /> : <Settings size={20} />}
          <span className="hidden sm:inline text-sm">
            {userRole === 'ADMIN' ? 'Admin' : 'Dashboard'}
          </span>
        </button>
        
        <button
          onClick={handleSignOut}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}