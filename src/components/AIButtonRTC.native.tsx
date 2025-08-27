import React, { useMemo } from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'

export type AIButtonRTCProps = {
  addToFamilyNotes: (items: string[]) => void
  openBills: () => void
  openBankDeals: () => void
  openHospital: () => void
  className?: string
}

export default function AIButtonRTC(_props: AIButtonRTCProps) {
  const [on, setOn] = React.useState<boolean>(false)
  const label = useMemo(() => (on ? 'Stop AI' : 'Talk to AI'), [on])

  const onPress = () => {
    setOn((v) => !v)
  }

  return (
    <View style={styles.root} testID="ai-button-rtc-native">
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[styles.btn, on ? styles.btnOn : styles.btnOff]} testID="ai-button-rtc">
        <Text style={styles.btnText}>{label}</Text>
      </TouchableOpacity>
      <Text style={styles.helper} testID="ai-button-rtc-helper">Realtime WebRTC mic is available on web preview. Mobile support requires a native module not available in Expo Go.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 50,
  },
  btn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  btnOn: {
    backgroundColor: '#DC2626',
  },
  btnOff: {
    backgroundColor: '#2563EB',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  helper: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
    paddingHorizontal: 16,
    textAlign: 'center',
  },
})
