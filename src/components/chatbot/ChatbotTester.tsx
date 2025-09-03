import React, { useState } from 'react';
import { TestTube, CheckCircle, XCircle, Clock, Play, RotateCcw } from 'lucide-react';
import { searchKnowledgeBase } from '../../services/vectorSearch';

interface TestResult {
  question: string;
  response: string;
  score: number;
  status: 'pass' | 'fail' | 'pending';
  matchId?: string;
}

export function ChatbotTester() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(-1);

  const testQuestions = [
    "Where is Sarawak Cultural Village?",
    "What foods should I try in Kuching?", 
    "Tell me about Bako National Park",
    "How do I visit Mulu Caves?",
    "What festivals happen in Sarawak?",
    "Can I stay in a longhouse?",
    "What can I see at Cultural Village?",
    "How to get to Bako?",
    "What is the weather like?", // Should get fallback
    "Random nonsense question xyz", // Should get fallback
  ];

  const runTests = async () => {
    setTesting(true);
    setTestResults([]);
    setCurrentTestIndex(0);
    
    for (let i = 0; i < testQuestions.length; i++) {
      const question = testQuestions[i];
      setCurrentTestIndex(i);
      
      try {
        console.log(`🧪 Testing question ${i + 1}/${testQuestions.length}: "${question}"`);
        const result = await searchKnowledgeBase(question, 3);
        
        const hasGoodMatch = result.matches.length > 0 && result.matches[0].score >= 0.4;
        const bestMatch = result.matches[0];
        
        const testResult: TestResult = {
          question,
          response: hasGoodMatch ? bestMatch.text : "I'll need to check further and get back to you 😊",
          score: hasGoodMatch ? bestMatch.score : 0,
          status: hasGoodMatch ? 'pass' : 'fail',
          matchId: hasGoodMatch ? bestMatch.id : undefined
        };
        
        console.log(`📊 Test result: ${testResult.status} (score: ${(testResult.score * 100).toFixed(1)}%)`);
        
        setTestResults(prev => [...prev, testResult]);
        
        // Small delay between tests for visual effect
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error) {
        console.error(`❌ Test failed for "${question}":`, error);
        const testResult: TestResult = {
          question,
          response: "Error occurred during testing",
          score: 0,
          status: 'fail'
        };
        setTestResults(prev => [...prev, testResult]);
      }
    }
    
    setTesting(false);
    setCurrentTestIndex(-1);
    console.log('🏁 All tests completed');
  };

  const clearResults = () => {
    setTestResults([]);
    setCurrentTestIndex(-1);
  };

  const passedTests = testResults.filter(r => r.status === 'pass').length;
  const totalTests = testResults.length;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TestTube size={20} className="text-white" />
            <h3 className="font-bold text-white">Knowledge Base Testing</h3>
          </div>
          <div className="flex items-center space-x-2">
            {testResults.length > 0 && (
              <span className="text-white text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                {passedTests}/{totalTests} passed
              </span>
            )}
            <button
              onClick={clearResults}
              disabled={testing}
              className="bg-white bg-opacity-20 text-white px-2 py-1 rounded text-sm hover:bg-opacity-30 transition-colors duration-200 disabled:opacity-50"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={runTests}
              disabled={testing}
              className="bg-white bg-opacity-20 text-white px-3 py-1 rounded text-sm hover:bg-opacity-30 transition-colors duration-200 disabled:opacity-50 flex items-center space-x-1"
            >
              <Play size={14} />
              <span>{testing ? 'Testing...' : 'Run Tests'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        {testResults.length === 0 && !testing && (
          <div className="text-center py-8">
            <TestTube size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">Click "Run Tests" to test knowledge base</p>
            <p className="text-gray-400 text-xs mt-1">Tests {testQuestions.length} questions including edge cases</p>
          </div>
        )}

        {testing && (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">
              Testing question {currentTestIndex + 1} of {testQuestions.length}
            </p>
            {currentTestIndex >= 0 && (
              <p className="text-xs text-gray-500 mt-1">
                "{testQuestions[currentTestIndex]}"
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          {testResults.map((result, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-gray-800 flex-1">{result.question}</p>
                <div className="flex items-center ml-2">
                  {result.status === 'pass' && <CheckCircle size={16} className="text-green-500" />}
                  {result.status === 'fail' && <XCircle size={16} className="text-red-500" />}
                  {result.status === 'pending' && <Clock size={16} className="text-yellow-500" />}
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mb-2 bg-gray-50 p-2 rounded">
                {result.response}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  result.status === 'pass' ? 'bg-green-100 text-green-700' :
                  result.status === 'fail' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {result.status.toUpperCase()}
                </span>
                <div className="flex items-center space-x-2">
                  {result.matchId && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {result.matchId}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {(result.score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}