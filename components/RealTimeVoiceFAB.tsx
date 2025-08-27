import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { Mic, MicOff, Loader2, MessageCircle, Camera, X, Zap } from 'lucide-react-native';
import { useRealTimeGeminiVoice } from '@/hooks/useRealTimeGeminiVoice';
import { useApp } from '@/hooks/useAppStore';
import * as ImagePicker from 'expo-image-picker';

interface RealTimeVoiceFABProps {
  style?: any;
}

export function RealTimeVoiceFAB({ style }: RealTimeVoiceFABProps) {
  const { 
    state, 
    isConnected, 
    sessionActive, 
    currentResponse, 
    toggleListening, 
 
    sendImageMessage, 
    endSession 
  } = useRealTimeGeminiVoice();
  
  const { userData, theme } = useApp();
  const isArabic = userData.language === 'ar';
  
  const [showResponse, setShowResponse] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  // Animate based on state
  useEffect(() => {
    if (state === 'listening') {
      // Pulsing animation for listening
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.4,
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
      
      // Glow effect
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      glow.start();
      
      return () => {
        pulse.stop();
        glow.stop();
      };
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [state, pulseAnim, glowAnim]);

  // Show response when available
  useEffect(() => {
    if (currentResponse && currentResponse.length > 0) {
      setShowResponse(true);
    }
  }, [currentResponse]);

  const getButtonColor = () => {
    if (!isConnected) return theme.textTertiary;
    
    switch (state) {
      case 'connecting':
        return theme.warning;
      case 'listening':
        return '#FF4444'; // Bright red when actively listening
      case 'processing':
        return theme.warning; // Orange when processing
      case 'speaking':
        return '#00AA44'; // Green when speaking
      default:
        return theme.secondary; // Blue when idle
    }
  };

  const getIcon = () => {
    if (!isConnected) {
      return <MessageCircle size={32} color="white" />;
    }
    
    switch (state) {
      case 'connecting':
        return <Loader2 size={32} color="white" />;
      case 'listening':
        return <MicOff size={32} color="white" />; // Mic off icon when actively listening
      case 'processing':
        return <Zap size={32} color="white" />; // Lightning bolt for processing
      case 'speaking':
        return <MessageCircle size={32} color="white" />; // Message icon when speaking
      default:
        return <Mic size={32} color="white" />; // Mic icon when idle
    }
  };

  const getStatusText = () => {
    if (!isConnected) {
      return isArabic ? 'جاري الاتصال...' : 'Connecting...';
    }
    
    switch (state) {
      case 'connecting':
        return isArabic ? 'جاري الاتصال...' : 'Connecting...';
      case 'listening':
        return sessionActive 
          ? (isArabic ? '🎤 أستمع... (قل "توقف" للإنهاء)' : '🎤 Listening... (say "stop" to end)')
          : (isArabic ? '🎤 أستمع... (قل "مرحبا ميزون" للبدء)' : '🎤 Listening... (say "Hey Mizon" to start)');
      case 'processing':
        return isArabic ? '⚡ معالجة فورية...' : '⚡ Processing instantly...';
      case 'speaking':
        return isArabic ? '🗣️ أتحدث معك...' : '🗣️ Speaking to you...';
      default:
        return isArabic ? 'اضغط للتحدث مع ميزون الفوري' : 'Tap to talk to Mizon instantly';
    }
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        await sendImageMessage(imageUri, isArabic ? 'ما هذا؟' : 'What is this?');
        setShowControls(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        await sendImageMessage(imageUri, isArabic ? 'هذه فاتورتي' : 'This is my bill');
        setShowControls(false);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const handleLongPress = () => {
    setShowControls(true);
  };

  const handleEndSession = () => {
    endSession();
    setShowResponse(false);
    setShowControls(false);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Response Modal */}
      {showResponse && currentResponse && (
        <View style={[styles.responseContainer, { backgroundColor: theme.surface }]}>
          <View style={[styles.responseHeader, { borderBottomColor: theme.border }]}>
            <View style={styles.responseHeaderLeft}>
              <Zap size={16} color={theme.secondary} />
              <Text style={[styles.responseTitle, { color: theme.text }]}>
                {isArabic ? 'ميزون الفوري' : 'Mizon Realtime'}
              </Text>
              {state === 'processing' && (
                <View style={[styles.processingIndicator, { backgroundColor: theme.warning }]} />
              )}
              {state === 'speaking' && (
                <View style={[styles.speakingIndicator, { backgroundColor: theme.success }]} />
              )}
            </View>
            <TouchableOpacity onPress={() => setShowResponse(false)}>
              <X size={20} color={theme.textTertiary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.responseText, { color: theme.text }]}>
            {(currentResponse && typeof currentResponse === 'string') ? currentResponse.trim() : ''}{state === 'processing' ? '...' : ''}
          </Text>
        </View>
      )}

      {/* Controls Panel */}
      {showControls && (
        <View style={[styles.controlsContainer, { backgroundColor: theme.surface }]}>
          <TouchableOpacity 
            style={[styles.controlButton, { backgroundColor: theme.secondary }]}
            onPress={handleImagePicker}
          >
            <MessageCircle size={20} color="white" />
            <Text style={styles.controlButtonText}>
              {isArabic ? 'صورة' : 'Image'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, { backgroundColor: theme.success }]}
            onPress={handleCameraCapture}
          >
            <Camera size={20} color="white" />
            <Text style={styles.controlButtonText}>
              {isArabic ? 'كاميرا' : 'Camera'}
            </Text>
          </TouchableOpacity>
          
          {sessionActive && (
            <TouchableOpacity 
              style={[styles.controlButton, { backgroundColor: theme.danger }]}
              onPress={handleEndSession}
            >
              <X size={20} color="white" />
              <Text style={styles.controlButtonText}>
                {isArabic ? 'إنهاء' : 'End'}
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.controlButton, { backgroundColor: theme.textTertiary }]}
            onPress={() => setShowControls(false)}
          >
            <X size={20} color="white" />
            <Text style={styles.controlButtonText}>
              {isArabic ? 'إغلاق' : 'Close'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Status Text */}
      <View style={[styles.statusContainer, { backgroundColor: theme.surface }]}>
        <Text style={[styles.statusText, { color: theme.text }]}>
          {getStatusText()}
        </Text>
        {sessionActive && (
          <View style={[styles.sessionIndicator, { backgroundColor: theme.success }]} />
        )}
      </View>

      {/* Pulse Ring for Listening */}
      {state === 'listening' && (
        <>
          <Animated.View 
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulseAnim }],
                backgroundColor: getButtonColor() + '20',
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.glowRing,
              {
                opacity: glowAnim,
                backgroundColor: getButtonColor() + '40',
              }
            ]} 
          />
        </>
      )}

      {/* Main FAB */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.fab,
            { 
              backgroundColor: getButtonColor(),
              shadowColor: getButtonColor(),
              elevation: state === 'listening' ? 12 : 8,
            }
          ]}
          onPress={toggleListening}
          onLongPress={handleLongPress}
          disabled={state === 'connecting'}
          accessibilityLabel={getStatusText()}
          accessibilityRole="button"
          testID="realtime-voice-fab"
        >
          {getIcon()}
        </TouchableOpacity>
      </Animated.View>

      {/* Connection Status Indicator */}
      <View style={[
        styles.connectionIndicator, 
        { backgroundColor: isConnected ? '#00AA44' : '#FF4444' }
      ]} />
      
      {/* Realtime Indicator */}
      {isConnected && (
        <View style={[styles.realtimeIndicator, { backgroundColor: theme.secondary }]}>
          <Zap size={8} color="white" />
        </View>
      )}
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
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  glowRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  connectionIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
  },
  realtimeIndicator: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusContainer: {
    position: 'absolute',
    bottom: 90,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 200,
  },
  sessionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  responseContainer: {
    position: 'absolute',
    bottom: 90,
    right: -20,
    width: 300,
    maxHeight: 250,
    borderRadius: 20,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  responseHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  responseText: {
    padding: 16,
    fontSize: 15,
    lineHeight: 22,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 90,
    right: -20,
    width: 220,
    borderRadius: 20,
    padding: 16,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    gap: 12,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  processingIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 4,
  },
  speakingIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 4,
  },
});