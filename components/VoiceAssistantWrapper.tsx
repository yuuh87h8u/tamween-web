import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RealTimeVoiceFAB } from './RealTimeVoiceFAB';
import { VoiceStatusIndicator } from './VoiceStatusIndicator';

export function VoiceAssistantWrapper() {
  return (
    <View style={styles.container}>
      <VoiceStatusIndicator />
      <RealTimeVoiceFAB />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  },
});