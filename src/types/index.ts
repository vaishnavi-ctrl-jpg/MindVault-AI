export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isGuest?: boolean;
}

export interface SentimentScores {
  positivity: number;
  clarity: number;
  energy: number;
  anxiety: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  date: string;
  summary: string;
  keyTakeaways: string[];
  sentiment: SentimentScores;
  tags: string[];
  emotionalTone: string;
  chatHistory: ChatMessage[];
  personaUsed: string;
  createdAt: number;
}

export type AIPersona = 'Empathetic Reflector' | 'Strategic Planner' | 'Creative Ideator' | 'Stoic Mindset Coach';

export interface SecurityStatus {
  secretManagerActive: boolean;
  secretSource: string;
  databaseIsolated: boolean;
  authProvider: string;
}
