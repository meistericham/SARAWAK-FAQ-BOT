import React, { useState } from 'react';
import { ArrowLeft, TestTube, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ChatInterface } from '../chat/ChatInterface';
import { ChatbotTester } from './ChatbotTester';

interface ChatbotPageProps {
  onBack: () => void;
}

interface TestResult {
  question: string;
  response: string;
  score: number;
  status: 'pass' | 'fail' | 'pending';
}

export function ChatbotPage({ onBack }: ChatbotPageProps) {
  const [showTesting, setShowTesting] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-orange-50">
      <div className="bg-white shadow-sm border-b border-emerald-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center space-x-2"
              >
                <ArrowLeft size={20} />
                <span>Back to Home</span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-500 text-white p-2 rounded-lg">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Tourism Chatbot</h1>
                  <p className="text-sm text-gray-600">Interactive assistant for booth visitors</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowTesting(!showTesting)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
            >
              <TestTube size={18} />
              <span>{showTesting ? 'Hide Testing' : 'Test Questions'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>

          {/* Testing Panel */}
          {showTesting && (
            <div className="lg:col-span-1">
              <ChatbotTester />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}