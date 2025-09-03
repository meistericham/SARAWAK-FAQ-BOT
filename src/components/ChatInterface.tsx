import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { MessageInput } from './MessageInput';
import { WelcomePrompts } from './WelcomePrompts';
import { LeadCollectionModal } from './LeadCollectionModal';
import { searchKnowledgeBase } from '../services/vectorSearch';
import { saveLeadToN8n } from '../services/leadService';
import { Message, LeadData } from '../types';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Selamat datang! I'm Sam, your Sarawak tourism guide! Ask me about attractions, cultural villages, food, or anything about beautiful Sarawak! 🏞️",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setCurrentQuery(text);

    try {
      // Search knowledge base
      const searchResults = await searchKnowledgeBase(text);
      
      let botResponse = '';
      let shouldCollectLead = false;

      if (searchResults.matches.length > 0 && searchResults.matches[0].score > 0.6) {
        // Use top results with good confidence
        const topResult = searchResults.matches[0];
        botResponse = generateResponseFromResult(topResult, text);
        shouldCollectLead = true;
      } else {
        // Fallback response
        botResponse = "I'll need to check further and get back to you 😊";
        shouldCollectLead = true;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

      // Ask for lead collection after a delay
      if (shouldCollectLead) {
        setTimeout(() => {
          const leadCollectionMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: "Would you like me to note your contact for updates?",
            sender: 'bot',
            timestamp: new Date(),
            showLeadCollection: true,
          };
          setMessages(prev => [...prev, leadCollectionMessage]);
        }, 2000);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'll need to check further and get back to you 😊",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadCollection = async (leadData: LeadData) => {
    try {
      await saveLeadToN8n({
        ...leadData,
        message: currentQuery,
        timestamp: new Date().toISOString(),
      });

      const confirmationMessage: Message = {
        id: Date.now().toString(),
        text: "Noted—terima kasih! We'll keep you updated with the latest information about Sarawak! 🙏",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, confirmationMessage]);
      setShowLeadModal(false);
    } catch (error) {
      console.error('Failed to save lead:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Sorry, there was an issue saving your contact. Please try again later!",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const generateResponseFromResult = (result: any, query: string): string => {
    // Generate contextual responses based on the search result
    const baseResponse = result.text;
    
    // Add friendly tourism language
    if (result.sourceId.includes('cultural')) {
      return `${baseResponse} It's definitely a must-visit for understanding Sarawak's rich cultural heritage! 🏛️`;
    } else if (result.sourceId.includes('food')) {
      return `${baseResponse} Trust me, your taste buds will thank you—Sarawak food is absolutely delicious! 😋`;
    } else if (result.sourceId.includes('park') || result.sourceId.includes('nature')) {
      return `${baseResponse} Perfect for nature lovers and adventure seekers! 🌿`;
    } else if (result.sourceId.includes('kuching')) {
      return `${baseResponse} Kuching is such a charming city with a perfect blend of history and modernity! 🏙️`;
    }
    
    return `${baseResponse} Hope this helps with your Sarawak adventure planning! ✨`;
  };

  const showWelcomePrompts = messages.length === 1;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="h-96 md:h-[500px] overflow-y-auto bg-gradient-to-b from-white to-emerald-5">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onLeadCollectionClick={() => setShowLeadModal(true)}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-emerald-100 rounded-lg p-3 max-w-xs">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
        
        {showWelcomePrompts && (
          <div className="border-t border-gray-100">
            <WelcomePrompts onPromptClick={handleSendMessage} />
          </div>
        )}
        
        <div className="border-t border-gray-200">
          <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </div>

      <LeadCollectionModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        onSubmit={handleLeadCollection}
      />
    </div>
  );
}