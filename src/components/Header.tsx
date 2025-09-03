import React from 'react';
import { MapPin } from 'lucide-react';

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-emerald-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500 text-white p-2 rounded-lg">
              <MapPin size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Sam Tourism Assistant</h1>
              <p className="text-sm text-gray-600">Your friendly guide to Sarawak 🌺</p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </header>
  );
}