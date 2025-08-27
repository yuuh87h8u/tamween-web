import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'individual' | 'family' | 'business';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface UserData {
  financialHealthScore: number;
  monthlyIncome: number;
  monthlySpending: number;
  monthlySavings: number;
  subsidySavings: number;
  emergencyFund: number;
  language: 'en' | 'ar';
  theme: 'light' | 'dark';
  lifetimeSavings: number;
  carbonSaved: number;
  stepsToday: number;
  biometricEnabled: boolean;
  cprId?: string;
  name?: string;
  email?: string;
  role?: UserRole;
}

interface AppState {
  userData: UserData;
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: any;
  
  // Actions
  updateUserData: (updates: Partial<UserData>) => void;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const lightTheme = {
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceSecondary: '#F1F5F9',
  text: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  border: '#E2E8F0',
  primary: '#10B981',
  primaryDark: '#059669',
  secondary: '#3B82F6',
  accent: '#F59E0B',
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  card: '#FFFFFF',
  cardSecondary: '#F8FAFC',
};

const darkTheme = {
  background: '#111827',
  surface: '#1F2937',
  surfaceSecondary: '#374151',
  text: '#FFFFFF',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  border: '#374151',
  primary: '#10B981',
  primaryDark: '#059669',
  secondary: '#3B82F6',
  accent: '#F59E0B',
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  card: '#1F2937',
  cardSecondary: '#374151',
};

const defaultUserData: UserData = {
  financialHealthScore: 78,
  monthlyIncome: 800,
  monthlySpending: 450,
  monthlySavings: 200,
  subsidySavings: 87,
  emergencyFund: 1200,
  language: 'en',
  theme: 'dark',
  lifetimeSavings: 2450,
  carbonSaved: 125.5,
  stepsToday: 7842,
  biometricEnabled: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userData: defaultUserData,
      authUser: null,
      isAuthenticated: false,
      isLoading: false,
      theme: darkTheme,

      updateUserData: (updates) => {
        set((state) => ({
          userData: { ...state.userData, ...updates }
        }));
      },

      toggleLanguage: () => {
        set((state) => ({
          userData: {
            ...state.userData,
            language: state.userData.language === 'en' ? 'ar' : 'en'
          }
        }));
      },

      toggleTheme: () => {
        set((state) => {
          const newTheme = state.userData.theme === 'light' ? 'dark' : 'light';
          return {
            userData: { ...state.userData, theme: newTheme },
            theme: newTheme === 'light' ? lightTheme : darkTheme
          };
        });
      },

      login: async (email, password, role) => {
        try {
          const mockAuth: AuthUser = {
            id: `user_${Date.now()}`,
            email,
            name: email.split('@')[0],
            role,
            isVerified: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          
          set({
            authUser: mockAuth,
            isAuthenticated: true,
            userData: { ...get().userData, role, name: mockAuth.name, email: mockAuth.email }
          });
          
          return { success: true };
        } catch (error) {
          return { success: false, error: 'Login failed' };
        }
      },

      register: async (email, password, name, role) => {
        try {
          const mockAuth: AuthUser = {
            id: `user_${Date.now()}`,
            email,
            name,
            role,
            isVerified: role !== 'business',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          
          set({
            authUser: mockAuth,
            isAuthenticated: true,
            userData: { ...get().userData, role, name, email }
          });
          
          return { success: true };
        } catch (error) {
          return { success: false, error: 'Registration failed' };
        }
      },

      logout: () => {
        set({
          authUser: null,
          isAuthenticated: false,
          userData: defaultUserData
        });
      },
    }),
    {
      name: 'tamween-app-storage',
    }
  )
);

// Create a hook that matches the original API
export function useApp() {
  return useAppStore();
}

// Create a provider component for compatibility
export function AppProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}