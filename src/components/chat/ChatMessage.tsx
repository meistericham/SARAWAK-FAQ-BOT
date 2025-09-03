import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '../../types';

interface ChatMessageProps {
  message: Message;
  onLeadCollectionClick?: () => void;
}

export function ChatMessage({ message, onLeadCollectionClick }: ChatMessageProps) {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex max-w-xs lg:max-w-md ${isBot ? 'flex-row' : 'flex-row-reverse'} items-start space-x-2`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isBot ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'
        }`}>
          {isBot ? <Bot size={16} /> : <User size={16} />}
        </div>
        
        <div className={`rounded-lg p-3 ${
          isBot 
            ? 'bg-emerald-100 text-emerald-900' 
            : 'bg-orange-500 text-white'
        } shadow-sm`}>
          <p className="text-sm leading-relaxed">{message.text}</p>
          
          {message.showLeadCollection && (
            <div className="mt-3 space-x-2">
              <button
                onClick={onLeadCollectionClick}
                className="bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-600 transition-colors duration-200"
              >
                Yes, please!
              </button>
              <button
                onClick={() => {}}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
              >
                No, thanks
              </button>
            </div>
          )}
          
          <div className="mt-2 text-xs opacity-70">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
}