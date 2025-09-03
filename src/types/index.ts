export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  showLeadCollection?: boolean;
}

export interface LeadData {
  name: string;
  emailOrPhone: string;
  interestTag: 'Tours' | 'Events' | 'Homestay' | 'Food' | 'Transport' | 'General';
  message?: string;
}

export interface SearchMatch {
  id: string;
  text: string;
  score: number;
  sourceId: string;
}

export interface SearchResult {
  matches: SearchMatch[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Lead {
  id: string;
  name: string;
  emailOrPhone: string;
  interestTag: string;
  message?: string;
  timestamp: string;
  source: string;
  sessionId: string;
  created_by?: string;
}

export interface FAQSuggestion {
  id: string;
  question: string;
  answer: string;
  suggested_by: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}