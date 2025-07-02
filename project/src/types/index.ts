export interface FoundItem {
  id: string;
  photo: string;
  location: string;
  date: string;
  time: string;
  category: string;
  securityQuestion: string;
  securityAnswer: string;
  createdAt: number;
  finderEmail: string;
  finderName: string;
  status: 'available' | 'claimed' | 'contacted';
  claimedBy?: string;
  claimedAt?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: number;
}

export interface Notification {
  id: string;
  type: 'item_claimed' | 'item_found' | 'contact_request';
  title: string;
  message: string;
  itemId: string;
  fromUser: string;
  toUser: string;
  read: boolean;
  createdAt: number;
}

export type ViewMode = 'home' | 'found-form' | 'lost-items' | 'login' | 'register' | 'dashboard' | 'notifications';

export type Theme = 'light' | 'dark';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}