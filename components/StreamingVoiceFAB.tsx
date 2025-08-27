import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { Mic, MicOff, Loader2, MessageCircle, Camera, X, Volume2 } from 'lucide-react-native';
import { useStreamingVoiceAssistant } from '@/hooks/useStreamingVoiceAssistant';
import { useApp } from '@/hooks/useAppStore';
import * as ImagePicker from 'expo-image-picker';

interface StreamingVoiceFABProps {
  style?: any;
}

export function StreamingVoiceFAB({ style }: StreamingVoiceFABProps) {
  const { 
    state, 
    sessionActive, 
    currentResponse, 
    config,
    toggleListening, 
    sendTextMessage, 
    sendImageMessage, 
    endSession 
  } = useStreamingVoiceAssistant();
  
  const { userData, theme } = useApp();
  const isArabic = userData.language === 'ar';
  
  const [showResponse, setShowResponse] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Animate based on state
  useEffect(() => {
    if (state === 'listening') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.4,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
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

  // Show response when available
  useEffect(() => {
    if (currentResponse && currentResponse.length > 0) {
      setShowResponse(true);
    }
  }, [currentResponse]);

  // Auto-hide response after speaking
  useEffect(() => {
    if (state === 'idle' && showResponse) {
      const timer = setTimeout(() => {
        setShowResponse(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state, showResponse]);

  const getButtonColor = () => {
    switch (state) {
      case 'listening':
        return sessionActive ? theme.danger : theme.warning; // Red when active session, orange when waiting for wake phrase
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
        return sessionActive ? <MicOff size={28} color="white" /> : <Mic size={28} color="white" />;
      case 'processing':
        return <Loader2 size={28} color="white" />;
      case 'speaking':
        return <Volume2 size={28} color="white" />;
      default:
        return <Mic size={28} color="white" />;
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'listening':
        return sessionActive 
          ? (isArabic ? 'أستمع...' : 'Listening...') 
          : (isArabic ? 'قل "مرحبا ميزون"' : 'Say "Hey Mizon"');
      case 'processing':
        return isArabic ? 'معالجة...' : 'Processing...';
      case 'speaking':
        return isArabic ? 'أتحدث...' : 'Speaking...';
      default:
        return isArabic ? 'اضغط للتحدث' : 'Tap to speak';
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

  const handleTextInput = async () => {
    // For demo purposes, send a sample text
    const sampleText = isArabic ? 'أضف البيض والخبز لملاحظاتي' : 'Add eggs and bread to my notes';
    await sendTextMessage(sampleText);
    setShowControls(false);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Response Modal */}
      {showResponse && currentResponse && (
        <View style={[styles.responseContainer, { backgroundColor: theme.surface }]}>
          <View style={[styles.responseHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.responseTitle, { color: theme.text }]}>
              {isArabic ? 'ميزون' : 'Mizon'}
            </Text>
            <View style={styles.responseIndicators}>
              {state === 'speaking' && (
                <View style={[styles.speakingIndicator, { backgroundColor: theme.success }]} />
              )}
              <TouchableOpacity onPress={() => setShowResponse(false)}>
                <X size={20} color={theme.textTertiary} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.responseText, { color: theme.text }]}>
            {currentResponse}
          </Text>
          {state === 'processing' && (
            <View style={styles.typingIndicator}>
              <View style={[styles.typingDot, { backgroundColor: theme.textTertiary }]} />
              <View style={[styles.typingDot, { backgroundColor: theme.textTertiary }]} />
              <View style={[styles.typingDot, { backgroundColor: theme.textTertiary }]} />
            </View>
          )}
        </View>
      )}

      {/* Controls Panel */}
      {showControls && (
        <View style={[styles.controlsContainer, { backgroundColor: theme.surface }]}>
          <TouchableOpacity 
            style={[styles.controlButton, { backgroundColor: theme.secondary }]}
            onPress={handleTextInput}
          >
            <MessageCircle size={20} color="white" />
            <Text style={styles.controlButtonText}>
              {isArabic ? 'نص تجريبي' : 'Sample Text'}
            </Text>
          </TouchableOpacity>
          
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
                {isArabic ? 'إنهاء الجلسة' : 'End Session'}
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

      {/* Main FAB */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.fab,
            { 
              backgroundColor: getButtonColor(),
              shadowColor: '#000',
            }
          ]}
          onPress={toggleListening}
          onLongPress={handleLongPress}
          accessibilityLabel={getStatusText()}
          accessibilityRole="button"
          testID="streaming-voice-fab"
        >
          {getIcon()}
        </TouchableOpacity>
      </Animated.View>

      {/* Continuous Mode Indicator */}
      {config.continuousMode && (
        <View style={[styles.continuousModeIndicator, { backgroundColor: theme.success }]}>
          <Text style={styles.continuousModeText}>
            {isArabic ? 'مستمر' : 'LIVE'}
          </Text>
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
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  statusContainer: {
    position: 'absolute',
    bottom: 80,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
    fontWeight: '500',
    textAlign: 'center',
  },
  sessionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  continuousModeIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    elevation: 4,
  },
  continuousModeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  responseContainer: {
    position: 'absolute',
    bottom: 80,
    right: -20,
    width: 300,
    maxHeight: 250,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  responseTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  responseIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  speakingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  responseText: {
    padding: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  typingIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 80,
    right: -20,
    width: 220,
    borderRadius: 16,
    padding: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    gap: 8,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});