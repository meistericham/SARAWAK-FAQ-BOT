import React from 'react';

interface WelcomePromptsProps {
  onPromptClick: (prompt: string) => void;
}

const prompts = [
  "Where is Sarawak Cultural Village?",
  "What foods should I try in Kuching?",
  "Tell me about Bako National Park",
  "How do I visit Mulu Caves?",
  "What festivals happen in Sarawak?",
  "Can I stay in a longhouse?"
];

export function WelcomePrompts({ onPromptClick }: WelcomePromptsProps) {
  return (
    <div className="p-4">
      <p className="text-sm text-gray-600 mb-3 text-center">Try asking about:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="text-left p-3 bg-gradient-to-r from-emerald-50 to-orange-50 border border-emerald-200 rounded-lg hover:from-emerald-100 hover:to-orange-100 hover:border-emerald-300 transition-all duration-200 text-sm"
          >
            <span className="text-emerald-700 font-medium">{prompt}</span>
          </button>
        ))}
      </div>
    </div>
  );
}