import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';

interface AlertBannerProps {
  message: string;
  type?: 'warning' | 'error' | 'info';
  onDismiss?: () => void;
}

export default function AlertBanner({ message, type = 'warning', onDismiss }: AlertBannerProps) {
  const { theme } = useApp();
  
  const getColors = () => {
    switch (type) {
      case 'error':
        return { bg: theme.danger + '20', text: theme.text, icon: theme.danger };
      case 'info':
        return { bg: theme.secondary + '20', text: theme.text, icon: theme.secondary };
      default:
        return { bg: theme.warning + '20', text: theme.text, icon: theme.warning };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <AlertTriangle size={20} color={colors.icon} />
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <X size={20} color={colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
  },
  dismissButton: {
    marginLeft: 12,
  },
});