import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SubsidyData } from '@/types';
import { useApp } from '@/hooks/useAppStore';

interface SubsidyCardProps {
  data: SubsidyData;
  onPress?: () => void;
}

export default function SubsidyCard({ data, onPress }: SubsidyCardProps) {
  const { theme, userData } = useApp();
  const isArabic = userData.language === 'ar';
  const usagePercentage = (data.currentUsage / data.subsidyLimit) * 100;
  const isNearLimit = usagePercentage > 85;

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: theme.card }]} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: theme.surfaceSecondary }]}>
          <Text style={styles.icon}>{data.icon}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.title, { color: theme.text }]}>
            {isArabic ? getArabicSubsidyName(data.type) : data.type.charAt(0).toUpperCase() + data.type.slice(1)}
          </Text>
          <Text style={[styles.savings, { color: theme.success }]}>BD {data.savings}</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: theme.surfaceSecondary }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(usagePercentage, 100)}%`,
                backgroundColor: isNearLimit ? theme.danger : data.color
              }
            ]} 
          />
        </View>
        <Text style={[styles.usage, { color: theme.textTertiary }]}>
          {data.currentUsage}/{data.subsidyLimit}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const getArabicSubsidyName = (type: string) => {
  const names: { [key: string]: string } = {
    fuel: 'الوقود',
    electricity: 'الكهرباء',
    water: 'الماء',
    food: 'الطعام'
  };
  return names[type] || type;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  savings: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  usage: {
    fontSize: 12,
    minWidth: 50,
    textAlign: 'right',
  },
});