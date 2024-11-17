import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { en } from '../i18n/en';
import { ar } from '../i18n/ar';
import type { User, Document, Notification, Event, Message } from '../lib/types';

// Mock data store to replace SQLite in production
interface AppState {
  user: User | null;
  language: 'ar' | 'en';
  direction: 'rtl' | 'ltr';
  translations: typeof ar | typeof en;
  darkMode: boolean;
  notifications: Notification[];
  documents: Document[];
  events: Event[];
  messages: Message[];
  pendingRegistrations: any[];
  signatureDocuments: any[];
  setLanguage: (lang: 'ar' | 'en') => void;
  login: (credentials: { username: string; password: string }) => Promise<boolean>;
  logout: () => void;
  toggleDarkMode: () => void;
  addDocument: (document: Document) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addEvent: (event: Event) => void;
  addMessage: (message: Message) => void;
  addSignatureDocument: (document: any) => void;
}

// Mock user data
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: '123456',
    name: 'م. تامر الجوهري',
    email: 'tamer@example.com',
    role: 'مدير تقنية المعلومات - المنطقة الشمالية',
    avatar: 'https://www.gulfupp.com/do.php?img=77482',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      language: 'ar',
      direction: 'rtl',
      translations: ar,
      darkMode: false,
      notifications: [],
      documents: [],
      events: [],
      messages: [],
      pendingRegistrations: [],
      signatureDocuments: [],

      setLanguage: (lang) => set({
        language: lang,
        direction: lang === 'ar' ? 'rtl' : 'ltr',
        translations: lang === 'ar' ? ar : en,
      }),

      login: async (credentials) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = mockUsers.find(u => 
          u.username === credentials.username && 
          u.password === credentials.password
        );

        if (user) {
          const { password, username, ...userData } = user;
          set({ user: userData as User });
          return true;
        }
        
        return false;
      },

      logout: () => set({ user: null }),
      
      toggleDarkMode: () => set((state) => ({ 
        darkMode: !state.darkMode 
      })),

      addDocument: (document) => set((state) => ({
        documents: [document, ...state.documents]
      })),

      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications]
      })),

      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      })),

      markAllNotificationsAsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true }))
      })),

      addEvent: (event) => set((state) => ({
        events: [event, ...state.events]
      })),

      addMessage: (message) => set((state) => ({
        messages: [message, ...state.messages]
      })),

      addSignatureDocument: (document) => set((state) => ({
        signatureDocuments: [document, ...state.signatureDocuments]
      })),
    }),
    {
      name: 'app-storage',
    }
  )
);