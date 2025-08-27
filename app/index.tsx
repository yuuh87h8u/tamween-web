import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useApp } from '@/hooks/useAppStore';

export default function RootIndex() {
  const { isAuthenticated, isLoading, theme, authUser } = useApp();

  useEffect(() => {
    console.log('RootIndex - Auth state:', { isAuthenticated, isLoading, authUser });
    
    if (!isLoading) {
      try {
        if (isAuthenticated && authUser) {
          console.log('Navigating to home...');
          router.replace('/(tabs)/home');
        } else {
          console.log('Navigating to login selection...');
          router.replace('/login-selection');
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  }, [isAuthenticated, isLoading, authUser]);

  const forceNavigateHome = () => {
    console.log('Force navigating to home...');
    router.replace('/(tabs)/home');
  };

  const forceNavigateLogin = () => {
    console.log('Force navigating to login...');
    router.replace('/login-selection');
  };

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: theme.background 
      }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.text, marginTop: 16 }}>Loading...</Text>
      </View>
    );
  }

  // Temporary debug screen
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: theme.background,
      padding: 20
    }}>
      <Text style={{ color: theme.text, fontSize: 18, marginBottom: 20 }}>Debug Navigation</Text>
      <Text style={{ color: theme.textSecondary, marginBottom: 10 }}>Auth: {isAuthenticated ? 'Yes' : 'No'}</Text>
      <Text style={{ color: theme.textSecondary, marginBottom: 20 }}>User: {authUser?.name || 'None'}</Text>
      
      <TouchableOpacity 
        onPress={forceNavigateHome}
        style={{ backgroundColor: theme.primary, padding: 15, borderRadius: 8, marginBottom: 10 }}
      >
        <Text style={{ color: 'white' }}>Go to Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={forceNavigateLogin}
        style={{ backgroundColor: theme.secondary, padding: 15, borderRadius: 8 }}
      >
        <Text style={{ color: 'white' }}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}