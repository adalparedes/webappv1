// Existing types...
export type MembershipLevel = 'FREE' | 'MEDIUM' | 'PREMIUM' | 'free' | 'medium' | 'premium';

export type NotificationType = 'payment' | 'membership' | 'promo' | 'system';

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body?: string | null;
  is_read: boolean;
  created_at: string;
  metadata?: any;
}

export interface User {
  fullName: string;
  email: string;
  username: string;
  gender: string;
  ageRange: string;
  membership: string;
  balance: number;
}

export interface Profile {
  id: string;
  full_name: string | null;
  username: string;
  gender: string | null;
  age_range: string | null;
  plan: string | null;
  credits: number | null;
  is_admin: boolean | null;
}

export enum AppState {
  LOADING = 'LOADING',
  PUZZLE = 'PUZZLE',
  GRANTED = 'GRANTED',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD'
}

export interface PuzzleTile {
  id: number;
  rotation: number;
  correctRotation: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  model?: string;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
}