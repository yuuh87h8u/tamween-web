import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Lightbulb } from 'lucide-react-native';
import { AITip } from '@/types';
import { useApp } from '@/hooks/useAppStore';

interface AITipCardProps {
  tip: AITip;
  onPress?: () => void;
}

export default function AITipCard({ tip, onPress }: AITipCardProps) {
  const { userData, theme } = useApp();
  const isArabic = userData.language === 'ar';

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: theme.card }]} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: theme.surfaceSecondary }]}>
        <Lightbulb size={24} color={theme.accent} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.label, { color: theme.accent }]}>
          {isArabic ? 'نصيحة ذكية لليوم' : 'AI TIP OF THE DAY'}
        </Text>
        <Text style={[styles.title, { color: theme.text }]}>
          {isArabic ? tip.titleAr : tip.title}
        </Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {isArabic ? tip.descriptionAr : tip.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});