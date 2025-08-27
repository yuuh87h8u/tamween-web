import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, Navigation, ShoppingCart, MapPin, Clock } from 'lucide-react-native';
import { VoiceResponse, Store, PriceComparison } from '@/hooks/useVoiceAssistant';
import { useApp } from '@/hooks/useAppStore';
import { router } from 'expo-router';

interface VoiceResponseModalProps {
  visible: boolean;
  onClose: () => void;
  response: VoiceResponse | null;
}

export function VoiceResponseModal({ visible, onClose, response }: VoiceResponseModalProps) {
  const { userData, theme } = useApp();
  const isArabic = userData.language === 'ar';

  if (!response) return null;

  const renderStoreList = (stores: Store[]) => (
    <View style={styles.storeList}>
      {stores.map((store, index) => (
        <View key={index} style={[styles.storeItem, { backgroundColor: theme.card }]}>
          <View style={styles.storeInfo}>
            <Text style={[styles.storeName, { color: theme.text }]}>{store.name}</Text>
            <View style={styles.storeDetails}>
              <MapPin size={14} color={theme.textTertiary} />
              <Text style={[styles.storeDistance, { color: theme.textSecondary }]}>{store.distance}km</Text>
              <Clock size={14} color={theme.textTertiary} />
              <Text style={[styles.storeHours, { color: theme.textSecondary }]}>{store.hours}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.navigateButton, { backgroundColor: theme.success }]}
            onPress={() => {
              // In a real app, this would open maps
              console.log('Navigate to', store.name);
            }}
          >
            <Navigation size={16} color="white" />
            <Text style={styles.navigateText}>
              {isArabic ? 'توجه' : 'Navigate'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderPriceComparison = (comparison: PriceComparison) => (
    <View style={styles.priceComparison}>
      <Text style={[styles.itemName, { color: theme.text }]}>{comparison.item}</Text>
      <View style={styles.priceList}>
        {comparison.stores.map((store, index) => (
          <View key={index} style={[styles.priceItem, { backgroundColor: theme.card }]}>
            <View style={styles.priceInfo}>
              <Text style={[styles.priceStoreName, { color: theme.text }]}>{store.name}</Text>
              <Text style={[styles.price, { color: theme.success }]}>BD {store.price}</Text>
            </View>
            <View style={styles.priceActions}>
              <TouchableOpacity 
                style={[styles.addToCartButton, { backgroundColor: theme.secondary }]}
                onPress={() => {
                  console.log('Add to cart from', store.name);
                }}
              >
                <ShoppingCart size={14} color="white" />
                <Text style={styles.addToCartText}>
                  {isArabic ? 'أضف' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderFeatureAction = (data: any) => (
    <View style={styles.featureAction}>
      <TouchableOpacity 
        style={[styles.openFeatureButton, { backgroundColor: theme.success }]}
        onPress={() => {
          if (data.feature === 'banking') {
            router.push('/banking');
          }
          onClose();
        }}
      >
        <Text style={styles.openFeatureText}>
          {isArabic ? 'افتح الميزة الآن' : 'Open Feature Now'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (response.intent) {
      case 'NearbyStore':
        return response.data?.stores ? renderStoreList(response.data.stores) : null;
      case 'PriceCompare':
        return response.data ? renderPriceComparison(response.data) : null;
      case 'BestThing':
        return response.data ? renderFeatureAction(response.data) : null;
      case 'AddToNotes':
        return (
          <View style={[styles.notesList, { backgroundColor: theme.card }]}>
            <Text style={[styles.notesTitle, { color: theme.text }]}>
              {isArabic ? 'تم إضافة العناصر:' : 'Items Added:'}
            </Text>
            {response.data?.items?.map((item: string, index: number) => (
              <Text key={index} style={[styles.noteItem, { color: theme.textSecondary }]}>• {item}</Text>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.surface }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>
              {isArabic ? 'مساعد تمين الصوتي' : 'Tamween Voice Assistant'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.textTertiary} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.content}>
            <View style={[styles.responseText, { backgroundColor: theme.card }]}>
              <Text style={[styles.responseTextContent, { color: theme.text }]}>
                {response.text}
              </Text>
            </View>
            {renderContent()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  responseText: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  responseTextContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  storeList: {
    gap: 12,
  },
  storeItem: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  storeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storeDistance: {
    fontSize: 14,
    marginRight: 12,
  },
  storeHours: {
    fontSize: 14,
  },
  navigateButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navigateText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  priceComparison: {
    gap: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  priceList: {
    gap: 8,
  },
  priceItem: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceInfo: {
    flex: 1,
  },
  priceStoreName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  priceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addToCartButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addToCartText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  featureAction: {
    alignItems: 'center',
  },
  openFeatureButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  openFeatureText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  notesList: {
    padding: 16,
    borderRadius: 12,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  noteItem: {
    fontSize: 14,
    marginBottom: 4,
  },
});