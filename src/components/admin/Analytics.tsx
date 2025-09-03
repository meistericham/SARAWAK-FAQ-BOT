import React from 'react';
import { BarChart3, TrendingUp, MessageCircle, Users } from 'lucide-react';

export function Analytics() {
  // Simulated analytics data
  const chatVolume = [
    { day: 'Mon', questions: 45 },
    { day: 'Tue', questions: 52 },
    { day: 'Wed', questions: 38 },
    { day: 'Thu', questions: 61 },
    { day: 'Fri', questions: 73 },
    { day: 'Sat', questions: 89 },
    { day: 'Sun', questions: 67 },
  ];

  const topQuestions = [
    { question: 'Where is Sarawak Cultural Village?', count: 23 },
    { question: 'What foods should I try?', count: 18 },
    { question: 'How to get to Bako National Park?', count: 15 },
    { question: 'Tell me about Mulu Caves', count: 12 },
    { question: 'Longhouse experience available?', count: 9 },
  ];

  const leadStats = {
    totalCaptured: 156,
    conversionRate: 34.2,
    topInterest: 'Tours & Attractions',
    avgResponseTime: '2.3s'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <BarChart3 size={24} className="text-white" />
            <h2 className="text-xl font-bold text-white">Analytics Dashboard</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Leads Captured</p>
                  <p className="text-2xl font-bold">{leadStats.totalCaptured}</p>
                </div>
                <Users size={24} className="text-emerald-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Conversion Rate</p>
                  <p className="text-2xl font-bold">{leadStats.conversionRate}%</p>
                </div>
                <TrendingUp size={24} className="text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Avg Response</p>
                  <p className="text-2xl font-bold">{leadStats.avgResponseTime}</p>
                </div>
                <MessageCircle size={24} className="text-purple-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Top Interest</p>
                  <p className="text-lg font-bold">{leadStats.topInterest}</p>
                </div>
                <BarChart3 size={24} className="text-orange-200" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chat Volume Chart */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Chat Volume</h3>
              <div className="space-y-3">
                {chatVolume.map((day, index) => (
                  <div key={day.day} className="flex items-center space-x-3">
                    <span className="w-8 text-sm text-gray-600">{day.day}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-emerald-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${(day.questions / 100) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{day.questions}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Questions */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Asked Questions</h3>
              <div className="space-y-3">
                {topQuestions.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.question}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}