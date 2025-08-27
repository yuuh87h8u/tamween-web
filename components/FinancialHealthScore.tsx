import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useApp } from '@/hooks/useAppStore';

interface FinancialHealthScoreProps {
  score: number;
  size?: number;
}

export default function FinancialHealthScore({ score, size = 120 }: FinancialHealthScoreProps) {
  const { theme, userData } = useApp();
  const isArabic = userData.language === 'ar';
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.border}
          strokeWidth="8"
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getScoreColor(score)}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.scoreContainer}>
        <Text style={[styles.score, { color: theme.text }]}>{score}</Text>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {isArabic ? 'الصحة المالية' : 'Financial Health'}
        </Text>
        <Text style={[styles.sublabel, { color: theme.textSecondary }]}>
          {isArabic ? 'النقاط' : 'Score'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  sublabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});