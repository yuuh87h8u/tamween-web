import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { UserData, AuthUser, UserRole, IndividualProfile, FamilyProfile, BusinessProfile } from '@/types';
import { lightTheme, darkTheme } from '@/constants/mockData';

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
  cprId: undefined,
  role: undefined,
  profile: undefined
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadUserData();
    loadAuthData();
  }, []);

  const loadUserData = async () => {
    try {
      const stored = await AsyncStorage.getItem('tamween_user_data');
      if (stored) {
        setUserData(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const loadAuthData = async () => {
    try {
      const authStored = await AsyncStorage.getItem('tamween_auth_user');
      if (authStored) {
        const auth = JSON.parse(authStored);
        setAuthUser(auth);
        setIsAuthenticated(true);
        
        const userDataStored = await AsyncStorage.getItem(`tamween_user_${auth.id}`);
        if (userDataStored) {
          const userData = JSON.parse(userDataStored);
          setUserData({ ...defaultUserData, ...userData, role: auth.role });
        } else {
          setUserData({ ...defaultUserData, role: auth.role, name: auth.name, email: auth.email });
        }
      }
    } catch (error) {
      console.log('Error loading auth data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserData = useCallback(async (updates: Partial<UserData>) => {
    const newData = { ...userData, ...updates };
    setUserData(newData);
    try {
      if (authUser) {
        await AsyncStorage.setItem(`tamween_user_${authUser.id}`, JSON.stringify(newData));
      } else {
        await AsyncStorage.setItem('tamween_user_data', JSON.stringify(newData));
      }
    } catch (error) {
      console.log('Error saving user data:', error);
    }
  }, [userData, authUser]);

  const toggleLanguage = useCallback(() => {
    const newLanguage = userData.language === 'en' ? 'ar' : 'en';
    updateUserData({ language: newLanguage });
  }, [userData.language, updateUserData]);

  const toggleTheme = useCallback(() => {
    const newTheme = userData.theme === 'light' ? 'dark' : 'light';
    updateUserData({ theme: newTheme });
  }, [userData.theme, updateUserData]);

  const currentTheme = useMemo(() => {
    return userData.theme === 'light' ? lightTheme : darkTheme;
  }, [userData.theme]);

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    try {
      console.log('Attempting login:', { email, role });
      
      const mockAuth: AuthUser = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0],
        role,
        isVerified: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      await AsyncStorage.setItem('tamween_auth_user', JSON.stringify(mockAuth));
      setAuthUser(mockAuth);
      setIsAuthenticated(true);
      
      const newUserData = {
        ...defaultUserData,
        role,
        name: mockAuth.name,
        email: mockAuth.email
      };
      
      setUserData(newUserData);
      await AsyncStorage.setItem(`tamween_user_${mockAuth.id}`, JSON.stringify(newUserData));
      
      return { success: true };
    } catch (error) {
      console.log('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }, []);
  
  const register = useCallback(async (email: string, password: string, name: string, role: UserRole, profile?: any) => {
    try {
      console.log('Attempting registration:', { email, name, role });
      
      const mockAuth: AuthUser = {
        id: `user_${Date.now()}`,
        email,
        name,
        role,
        isVerified: role !== 'business',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      await AsyncStorage.setItem('tamween_auth_user', JSON.stringify(mockAuth));
      setAuthUser(mockAuth);
      setIsAuthenticated(true);
      
      const newUserData = {
        ...defaultUserData,
        role,
        name,
        email,
        profile
      };
      
      setUserData(newUserData);
      await AsyncStorage.setItem(`tamween_user_${mockAuth.id}`, JSON.stringify(newUserData));
      
      return { success: true };
    } catch (error) {
      console.log('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }, []);
  
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('tamween_auth_user');
      setAuthUser(null);
      setIsAuthenticated(false);
      setUserData(defaultUserData);
    } catch (error) {
      console.log('Logout error:', error);
    }
  }, []);

  return useMemo(() => ({
    userData,
    authUser,
    isAuthenticated,
    updateUserData,
    toggleLanguage,
    toggleTheme,
    theme: currentTheme,
    isLoading,
    login,
    register,
    logout
  }), [userData, authUser, isAuthenticated, updateUserData, toggleLanguage, toggleTheme, currentTheme, isLoading, login, register, logout]);
});