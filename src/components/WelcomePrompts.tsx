import React from 'react';

interface WelcomePromptsProps {
  onPromptClick: (prompt: string) => void;
}

const prompts = [
  "Where is Sarawak Cultural Village?",
  "What are the must-try foods in Sarawak?",
  "Tell me about Bako National Park",
  "How do I get to Mulu Caves?",
  "What cultural experiences are available?",
  "Best attractions in Kuching city?"
];

export function WelcomePrompts({ onPromptClick }: WelcomePromptsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 px-4">
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
  );
}