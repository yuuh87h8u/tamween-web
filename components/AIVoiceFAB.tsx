import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { Mic, MicOff, Loader2 } from 'lucide-react-native';
import { useVoiceAssistant, VoiceState } from '@/hooks/useVoiceAssistant';
import { useApp } from '@/hooks/useAppStore';

interface AIVoiceFABProps {
  style?: any;
}

export function AIVoiceFAB({ style }: AIVoiceFABProps) {
  const { state, toggleListening } = useVoiceAssistant();
  const { userData, theme } = useApp();
  const isArabic = userData.language === 'ar';
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (state === 'listening') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [state, pulseAnim]);

  const getButtonColor = () => {
    switch (state) {
      case 'listening':
        return theme.danger; // Red when listening
      case 'processing':
        return theme.warning; // Orange when processing
      case 'speaking':
        return theme.success; // Green when speaking
      default:
        return theme.secondary; // Blue when idle
    }
  };

  const getIcon = () => {
    switch (state) {
      case 'listening':
        return <MicOff size={28} color="white" />;
      case 'processing':
      case 'speaking':
        return <Loader2 size={28} color="white" />;
      default:
        return <Mic size={28} color="white" />;
    }
  };

  const getAccessibilityLabel = () => {
    switch (state) {
      case 'listening':
        return isArabic ? 'إيقاف الاستماع' : 'Stop listening';
      case 'processing':
        return isArabic ? 'معالجة الصوت' : 'Processing audio';
      case 'speaking':
        return isArabic ? 'يتحدث المساعد' : 'Assistant speaking';
      default:
        return isArabic ? 'بدء الاستماع' : 'Start listening';
    }
  };

  return (
    <View style={[styles.container, style]}>
      {state === 'listening' && (
        <Animated.View 
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: pulseAnim }],
              backgroundColor: getButtonColor() + '30',
            }
          ]} 
        />
      )}
      <TouchableOpacity
        style={[
          styles.fab,
          { 
            backgroundColor: getButtonColor(),
            shadowColor: '#000',
          }
        ]}
        onPress={toggleListening}
        disabled={state === 'processing' || state === 'speaking'}
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityRole="button"
        testID="ai-voice-fab"
      >
        {getIcon()}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 90 : 100,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});