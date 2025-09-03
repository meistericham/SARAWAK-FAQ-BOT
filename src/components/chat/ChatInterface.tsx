import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { MessageInput } from './MessageInput';
import { WelcomePrompts } from './WelcomePrompts';
import { LeadCollectionModal } from './LeadCollectionModal';
import { searchKnowledgeBase } from '../../services/vectorSearch';
import { saveLeadToN8n } from '../../services/leadService';
import { Message, LeadData } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export function ChatInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Selamat datang! I'm your AskSarawak assistant! Ask me about attractions, food, culture, or anything about beautiful Sarawak! 🏞️",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
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
      const searchResults = await searchKnowledgeBase(text, 3);
      
      let botResponse = '';
      let shouldCollectLead = false;

      console.log('🎯 Search results:', searchResults.matches);
      
      if (searchResults.matches.length > 0 && searchResults.matches[0].score >= 0.4) {
        // Use top result with good confidence
        const topMatch = searchResults.matches[0];
        console.log('✅ Using match:', topMatch.id, 'with score:', topMatch.score);
        botResponse = generateResponseFromMatch(topMatch, text);
        shouldCollectLead = true;
      } else {
        console.log('❌ No good matches found, using fallback');
        // Fallback response as specified
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
        }, 1500);
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
        timestamp: new Date().toISOString(),
        source: 'chat_booth',
        sessionId,
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

  const generateResponseFromMatch = (match: any, query: string): string => {
    let response = match.text;
    
    // Keep responses concise but complete
    if (response.length > 200) {
      // Find a good breaking point
      const sentences = response.split('. ');
      if (sentences.length > 1) {
        response = sentences[0] + '. ' + sentences[1] + '.';
      } else {
        response = response.substring(0, 200) + '...';
      }
    }
    
    // Add tourism-style warmth based on content
    if (match.sourceId.includes('cultural')) {
      response += ' Perfect for experiencing Sarawak\'s rich heritage! 🏛️';
    } else if (match.sourceId.includes('food')) {
      response += ' Your taste buds are in for a treat! 😋';
    } else if (match.sourceId.includes('park') || match.sourceId.includes('bako') || match.sourceId.includes('mulu')) {
      response += ' Great for nature lovers! 🌿';
    } else if (match.sourceId.includes('festival')) {
      response += ' Such vibrant celebrations! 🎉';
    } else if (match.sourceId.includes('longhouse')) {
      response += ' An unforgettable cultural experience! 🏘️';
    } else {
      response += ' Hope this helps with your Sarawak adventure! ✨';
    }
    
    return response;
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