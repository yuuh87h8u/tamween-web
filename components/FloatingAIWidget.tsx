import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
import { Bot, Mic } from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';

interface FloatingAIWidgetProps {
  onExpand: () => void;
  style?: any;
}

export function FloatingAIWidget({ onExpand, style }: FloatingAIWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { userData } = useApp();
  const isArabic = userData.language === 'ar';
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (isExpanded) {
      onExpand();
    } else {
      setIsExpanded(true);
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Auto-collapse after 3 seconds
      setTimeout(() => {
        setIsExpanded(false);
      }, 3000);
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        style,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.widget,
          isExpanded && styles.widgetExpanded
        ]}
        onPress={handlePress}
        accessibilityLabel={isArabic ? 'مساعد تموين الصوتي' : 'Tamween Voice Assistant'}
        accessibilityRole="button"
        testID="floating-ai-widget"
      >
        {isExpanded ? (
          <View style={styles.expandedContent}>
            <Mic size={16} color="white" />
            <Text style={styles.expandedText}>
              {isArabic ? 'اضغط للتحدث' : 'Tap to speak'}
            </Text>
          </View>
        ) : (
          <Bot size={20} color="white" />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 20,
    zIndex: 999,
  },
  widget: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  widgetExpanded: {
    width: 120,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  expandedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expandedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});