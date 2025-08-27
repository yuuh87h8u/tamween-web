import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Deal } from '@/types';
import { useApp } from '@/hooks/useAppStore';

interface DealCardProps {
  deal: Deal;
  onPress?: () => void;
}

export default function DealCard({ deal, onPress }: DealCardProps) {
  const { theme, userData } = useApp();
  const isArabic = userData.language === 'ar';
  
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: theme.card }]} onPress={onPress}>
      <Image source={{ uri: deal.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.store, { color: theme.textSecondary }]}>{deal.store}</Text>
          <View style={[styles.discountBadge, { backgroundColor: theme.success }]}>
            <Text style={styles.discountText}>
              {deal.discount}% {isArabic ? 'خصم' : 'OFF'}
            </Text>
          </View>
        </View>
        <Text style={[styles.title, { color: theme.text }]}>{deal.title}</Text>
        <View style={styles.priceContainer}>
          <Text style={[styles.originalPrice, { color: theme.textTertiary }]}>BD {deal.originalPrice}</Text>
          <Text style={[styles.discountedPrice, { color: theme.success }]}>BD {deal.discountedPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    width: 280,
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  store: {
    fontSize: 12,
    fontWeight: '500',
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});