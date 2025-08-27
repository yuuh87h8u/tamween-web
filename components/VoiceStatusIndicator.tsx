import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Mic, Loader2, Volume2 } from 'lucide-react-native';
import { useRealTimeGeminiVoice } from '@/hooks/useRealTimeGeminiVoice';
import { useApp } from '@/hooks/useAppStore';

export function VoiceStatusIndicator() {
  const { state, currentResponse, sessionActive } = useRealTimeGeminiVoice();
  const { userData, theme } = useApp();
  const isArabic = userData.language === 'ar';
  const waveAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (state === 'speaking') {
      const wave = Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      wave.start();
      return () => wave.stop();
    }
  }, [state, waveAnim]);

  if (state === 'idle') return null;

  const getStatusText = () => {
    switch (state) {
      case 'listening':
        return isArabic ? 'أستمع...' : 'Listening...';
      case 'processing':
        return isArabic ? 'معالجة...' : 'Processing...';
      case 'speaking':
        return isArabic ? 'أتحدث...' : 'Speaking...';
      default:
        return '';
    }
  };

  const getStatusIcon = () => {
    switch (state) {
      case 'listening':
        return <Mic size={16} color={theme.danger} />;
      case 'processing':
        return <Loader2 size={16} color={theme.warning} />;
      case 'speaking':
        return (
          <Animated.View style={{ opacity: waveAnim }}>
            <Volume2 size={16} color={theme.success} />
          </Animated.View>
        );
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (state) {
      case 'listening':
        return theme.danger;
      case 'processing':
        return theme.warning;
      case 'speaking':
        return theme.success;
      default:
        return theme.textTertiary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, { borderColor: getStatusColor(), backgroundColor: theme.surface }]}>
        {getStatusIcon()}
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </View>
      
      {currentResponse && (state === 'speaking' || state === 'processing') && (
        <View style={[styles.responsePreview, { backgroundColor: theme.card }]}>
          <Text style={[styles.responseText, { color: theme.text }]} numberOfLines={2}>
            {(currentResponse && typeof currentResponse === 'string') ? currentResponse.trim() : ''}
          </Text>
          {sessionActive && (
            <View style={[styles.sessionBadge, { backgroundColor: theme.success }]}>
              <Text style={styles.sessionBadgeText}>
                {isArabic ? 'جلسة نشطة' : 'Active Session'}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 998,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  responsePreview: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    maxWidth: '90%',
  },
  responseText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  sessionBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sessionBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
});