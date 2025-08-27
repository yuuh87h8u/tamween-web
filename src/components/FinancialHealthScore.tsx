import React from 'react';
import { useApp } from '../hooks/useAppStore';

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
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.border}
          strokeWidth="8"
          fill="transparent"
        />
        <circle
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
      </svg>
      <div className="text-center">
        <div className="text-3xl font-bold" style={{ color: theme.text }}>{score}</div>
        <div className="text-xs" style={{ color: theme.textSecondary }}>
          {isArabic ? 'الصحة المالية' : 'Financial Health'}
        </div>
        <div className="text-xs" style={{ color: theme.textSecondary }}>
          {isArabic ? 'النقاط' : 'Score'}
        </div>
      </div>
    </div>
  );
}