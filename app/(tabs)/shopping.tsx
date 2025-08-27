import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert 
} from 'react-native';
import { Stack } from 'expo-router';
import { Search, Filter, MapPin, Heart, Activity, Zap, Scan, Mic } from 'lucide-react-native';
import DealCard from '@/components/DealCard';
import BarcodeScanner from '@/components/BarcodeScanner';
import ProductComparison from '@/components/ProductComparison';
import { deals } from '@/constants/mockData';
import { useApp } from '@/hooks/useAppStore';
import { VoiceAssistantWrapper } from '@/components/VoiceAssistantWrapper';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';

// Mock product data
const mockProducts = {
  '1234567890123': {
    id: '1',
    name: 'Basmati Rice 5kg',
    nameAr: 'أرز بسمتي 5 كيلو',
    brand: 'India Gate',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    barcode: '1234567890123',
    category: 'Groceries',
    stores: [
      {
        id: '1',
        name: 'LuLu Hypermarket',
        price: 4.50,
        originalPrice: 5.00,
        distance: '0.5 km',
        rating: 4.5,
        availability: 'in-stock' as const,
        deliveryTime: '30 min'
      },
      {
        id: '2',
        name: 'Carrefour',
        price: 4.80,
        distance: '1.2 km',
        rating: 4.3,
        availability: 'in-stock' as const,
        deliveryTime: '45 min'
      },
      {
        id: '3',
        name: 'Mega Mart',
        price: 5.20,
        distance: '2.1 km',
        rating: 4.1,
        availability: 'low-stock' as const,
        deliveryTime: '60 min'
      }
    ]
  },
  '9876543210987': {
    id: '2',
    name: 'Olive Oil 500ml',
    nameAr: 'زيت زيتون 500 مل',
    brand: 'Bertolli',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
    barcode: '9876543210987',
    category: 'Groceries',
    stores: [
      {
        id: '1',
        name: 'LuLu Hypermarket',
        price: 8.90,
        distance: '0.5 km',
        rating: 4.5,
        availability: 'in-stock' as const,
        deliveryTime: '30 min'
      },
      {
        id: '2',
        name: 'Carrefour',
        price: 9.50,
        originalPrice: 10.00,
        distance: '1.2 km',
        rating: 4.3,
        availability: 'in-stock' as const,
        deliveryTime: '45 min'
      }
    ]
  }
};

export default function ShoppingScreen() {
  const { userData, theme, authUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showScanner, setShowScanner] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [barcodeData, setBarcodeData] = useState<string | undefined>(undefined);
  const { toggleListening, state } = useVoiceAssistant();
  const isArabic = userData.language === 'ar';
  const userRole = authUser?.role || 'individual';

  const handleBarcodeScanned = (barcodeResult: string) => {
    console.log('Barcode scanned:', barcodeResult);
    setShowScanner(false);
    
    try {
      // Try to parse as JSON (real barcode data from API)
      const parsedData = JSON.parse(barcodeResult);
      
      if (parsedData.name && parsedData.name !== 'Product Not Found') {
        setBarcodeData(barcodeResult);
        setSelectedProduct(null); // Let ProductComparison handle the data
        setShowComparison(true);
        
        Alert.alert(
          isArabic ? 'تم العثور على المنتج!' : 'Product Found!',
          isArabic 
            ? `${parsedData.name} - ${parsedData.brand || 'Unknown Brand'}`
            : `${parsedData.name} - ${parsedData.brand || 'Unknown Brand'}`,
          [{ text: isArabic ? 'موافق' : 'OK' }]
        );
      } else {
        Alert.alert(
          isArabic ? 'المنتج غير موجود' : 'Product Not Found',
          parsedData.message || (isArabic 
            ? 'عذراً، هذا المنتج غير متوفر في قاعدة البيانات'
            : 'Sorry, this product is not available in our database'),
          [{ text: isArabic ? 'موافق' : 'OK' }]
        );
      }
    } catch (error) {
      // Fallback: treat as simple barcode string
      const product = mockProducts[barcodeResult as keyof typeof mockProducts];
      
      if (product) {
        setSelectedProduct(product);
        setBarcodeData(undefined);
        setShowComparison(true);
        
        Alert.alert(
          isArabic ? 'تم العثور على المنتج!' : 'Product Found!',
          isArabic 
            ? `${product.nameAr} - ${product.brand}`
            : `${product.name} - ${product.brand}`,
          [{ text: isArabic ? 'موافق' : 'OK' }]
        );
      } else {
        Alert.alert(
          isArabic ? 'المنتج غير موجود' : 'Product Not Found',
          isArabic 
            ? 'عذراً، هذا المنتج غير متوفر في قاعدة البيانات'
            : 'Sorry, this product is not available in our database',
          [{ text: isArabic ? 'موافق' : 'OK' }]
        );
      }
    }
  };

  const categories = [
    { key: 'all', label: isArabic ? 'الكل' : 'All' },
    { key: 'groceries', label: isArabic ? 'بقالة' : 'Groceries' },
    { key: 'electronics', label: isArabic ? 'إلكترونيات' : 'Electronics' },
    { key: 'clothing', label: isArabic ? 'ملابس' : 'Clothing' },
    { key: 'home', label: isArabic ? 'منزل' : 'Home' },
  ];

  const stores = [
    { name: 'LuLu Hypermarket', discount: '25%', category: 'Groceries', color: '#10B981' },
    { name: 'Carrefour', discount: '30%', category: 'Electronics', color: '#3B82F6' },
    { name: 'City Centre', discount: '20%', category: 'Fashion', color: '#8B5CF6' },
    { name: 'Mega Mart', discount: '15%', category: 'Home', color: '#F59E0B' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{ 
          title: userRole === 'business' 
            ? (isArabic ? 'إدارة العروض' : 'Manage Offers')
            : (isArabic ? 'التسوق والعروض' : 'Shopping & Deals'),
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }} 
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Business Dashboard or Consumer Shopping */}
        {userRole === 'business' ? (
          // Business Offers Management
          <>
            {/* Business Stats */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {isArabic ? 'إحصائيات العروض' : 'Offers Analytics'}
              </Text>
              <View style={styles.statsContainer}>
                <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                    {isArabic ? 'العروض النشطة' : 'Active Offers'}
                  </Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>23</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                    {isArabic ? 'المشاهدات' : 'Views'}
                  </Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>1,847</Text>
                </View>
              </View>
            </View>
            
            {/* Create New Offer */}
            <View style={styles.section}>
              <TouchableOpacity style={[styles.createOfferButton, { backgroundColor: theme.primary }]}>
                <Text style={styles.createOfferText}>
                  {isArabic ? '+ إنشاء عرض جديد' : '+ Create New Offer'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Your Active Offers */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {isArabic ? 'عروضك النشطة' : 'Your Active Offers'}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {deals.slice(0, 3).map((deal) => (
                  <View key={deal.id} style={styles.businessOfferCard}>
                    <DealCard deal={deal} />
                    <View style={styles.offerActions}>
                      <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.surface }]}>
                        <Text style={[styles.actionButtonText, { color: theme.text }]}>
                          {isArabic ? 'تعديل' : 'Edit'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.pauseButton, { backgroundColor: theme.warning }]}>
                        <Text style={[styles.actionButtonText, { color: 'white' }]}>
                          {isArabic ? 'إيقاف' : 'Pause'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        ) : (
          // Consumer Shopping Interface
          <>
            {/* Search Bar with Voice & Barcode Scanner */}
            <View style={styles.searchContainer}>
              <View style={[styles.searchBar, { backgroundColor: theme.surface }]}>
                <Search size={20} color={theme.textTertiary} />
                <TextInput
                  style={[styles.searchInput, { color: theme.text }]}
                  placeholder={isArabic ? 'ابحث عن المنتجات أو المتاجر أو تحدث' : 'Search products, stores, or speak'}
                  placeholderTextColor={theme.textTertiary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity 
                style={[styles.voiceButton, { 
                  backgroundColor: state === 'listening' ? theme.danger : 
                                  state === 'processing' ? theme.warning : 
                                  state === 'speaking' ? theme.success : theme.secondary 
                }]}
                onPress={toggleListening}
              >
                <Mic size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.scanButton, { backgroundColor: theme.primary }]}
                onPress={() => setShowScanner(true)}
              >
                <Scan size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.surface }]}>
                <Filter size={20} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            {/* Voice Assistant Demo */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {isArabic ? 'المساعد الصوتي' : 'Voice Assistant'}
              </Text>
              <View style={[styles.voiceDemo, { backgroundColor: theme.card }]}>
                <View style={styles.voiceDemoHeader}>
                  <Mic size={24} color={theme.primary} />
                  <Text style={[styles.voiceDemoTitle, { color: theme.text }]}>
                    {isArabic ? 'جرب المساعد الصوتي' : 'Try Voice Assistant'}
                  </Text>
                </View>
                <Text style={[styles.voiceDemoText, { color: theme.textSecondary }]}>
                  {isArabic 
                    ? 'قل "أقرب متجر" أو "أريد أشتري حليب" أو "خذني إلى الصحة"'
                    : 'Say "nearest store" or "I want to buy milk" or "take me to health"'
                  }
                </Text>
                <TouchableOpacity 
                  style={[styles.voiceDemoButton, { 
                    backgroundColor: state === 'listening' ? theme.danger : 
                                    state === 'processing' ? theme.warning : 
                                    state === 'speaking' ? theme.success : theme.primary 
                  }]}
                  onPress={toggleListening}
                >
                  <Mic size={20} color="#FFFFFF" />
                  <Text style={styles.voiceDemoButtonText}>
                    {state === 'listening' ? (isArabic ? 'يستمع...' : 'Listening...') :
                     state === 'processing' ? (isArabic ? 'معالجة...' : 'Processing...') :
                     state === 'speaking' ? (isArabic ? 'يتحدث...' : 'Speaking...') :
                     (isArabic ? 'اضغط للتحدث' : 'Tap to Speak')
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* Categories - Only for consumers */}
        {userRole !== 'business' && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  { backgroundColor: theme.surface },
                  selectedCategory === category.key && { backgroundColor: theme.primary }
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Text style={[
                  styles.categoryText,
                  { color: theme.textTertiary },
                  selectedCategory === category.key && { color: '#FFFFFF' }
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Featured Stores - Only for consumers */}
        {userRole !== 'business' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isArabic ? 'متاجر مميزة' : 'Featured Stores'}
            </Text>
            <View style={styles.storesGrid}>
              {stores.map((store, index) => (
                <TouchableOpacity key={index} style={[styles.storeCard, { backgroundColor: theme.card }]}>
                  <View style={[styles.storeIcon, { backgroundColor: store.color }]}>
                    <Text style={styles.storeInitial}>
                      {store.name.charAt(0)}
                    </Text>
                  </View>
                  <Text style={[styles.storeName, { color: theme.text }]}>{store.name}</Text>
                  <Text style={[styles.storeDiscount, { color: theme.primary }]}>{store.discount} OFF</Text>
                  <Text style={[styles.storeCategory, { color: theme.textSecondary }]}>{store.category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Best Deals - Only for consumers */}
        {userRole !== 'business' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {isArabic ? 'أفضل العروض' : 'Best Deals'}
              </Text>
              <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: theme.primary }]}>
                  {isArabic ? 'عرض الكل' : 'See All'}
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Price Comparison - Only for consumers */}
        {userRole !== 'business' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isArabic ? 'مقارنة الأسعار' : 'Price Comparison'}
            </Text>
            <View style={[styles.comparisonCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.comparisonTitle, { color: theme.text }]}>
                {isArabic ? 'أرز بسمتي - 5 كيلو' : 'Basmati Rice - 5kg'}
              </Text>
              <View style={styles.priceComparison}>
                <View style={styles.priceItem}>
                  <Text style={[styles.storeName, { color: theme.text }]}>LuLu</Text>
                  <Text style={[styles.price, { color: theme.text }]}>BD 4.50</Text>
                  <Text style={[styles.bestPrice, { color: theme.primary }]}>
                    {isArabic ? 'أفضل سعر' : 'Best Price'}
                  </Text>
                </View>
                <View style={styles.priceItem}>
                  <Text style={[styles.storeName, { color: theme.text }]}>Carrefour</Text>
                  <Text style={[styles.price, { color: theme.text }]}>BD 4.80</Text>
                </View>
                <View style={styles.priceItem}>
                  <Text style={[styles.storeName, { color: theme.text }]}>Mega Mart</Text>
                  <Text style={[styles.price, { color: theme.text }]}>BD 5.20</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Healthy Swaps - Only for consumers */}
        {userRole !== 'business' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isArabic ? 'بدائل صحية' : 'Healthy Swaps'}
            </Text>
            <View style={styles.swapsContainer}>
              <View style={[styles.swapCard, { backgroundColor: theme.card }]}>
                <View style={styles.swapHeader}>
                  <Heart size={20} color="#EF4444" />
                  <Text style={[styles.swapTitle, { color: theme.text }]}>
                    {isArabic ? 'بديل صحي' : 'Healthier Choice'}
                  </Text>
                </View>
                <View style={styles.swapComparison}>
                  <View style={styles.swapItem}>
                    <Text style={[styles.swapProduct, { color: theme.text }]}>
                      {isArabic ? 'زيت عباد الشمس' : 'Sunflower Oil'}
                    </Text>
                    <Text style={[styles.swapCalories, { color: theme.textSecondary }]}>450 cal</Text>
                  </View>
                  <Text style={[styles.swapArrow, { color: theme.primary }]}>→</Text>
                  <View style={styles.swapItem}>
                    <Text style={[styles.swapProduct, { color: theme.text }]}>
                      {isArabic ? 'زيت زيتون' : 'Olive Oil'}
                    </Text>
                    <Text style={[styles.swapCalories, { color: theme.textSecondary }]}>400 cal</Text>
                    <Text style={[styles.swapBenefit, { color: theme.primary }]}>-50 cal</Text>
                  </View>
                </View>
                <Text style={[styles.swapDescription, { color: theme.textSecondary }]}>
                  {isArabic ? 'أعلى في مضادات الأكسدة' : 'Higher in antioxidants'}
                </Text>
              </View>
              
              <View style={[styles.swapCard, { backgroundColor: theme.card }]}>
                <View style={styles.swapHeader}>
                  <Activity size={20} color="#10B981" />
                  <Text style={[styles.swapTitle, { color: theme.text }]}>
                    {isArabic ? 'بديل نشط' : 'Active Choice'}
                  </Text>
                </View>
                <View style={styles.swapComparison}>
                  <View style={styles.swapItem}>
                    <Text style={[styles.swapProduct, { color: theme.text }]}>
                      {isArabic ? 'أرز أبيض' : 'White Rice'}
                    </Text>
                    <Text style={[styles.swapCalories, { color: theme.textSecondary }]}>130 cal</Text>
                  </View>
                  <Text style={[styles.swapArrow, { color: theme.primary }]}>→</Text>
                  <View style={styles.swapItem}>
                    <Text style={[styles.swapProduct, { color: theme.text }]}>
                      {isArabic ? 'أرز بني' : 'Brown Rice'}
                    </Text>
                    <Text style={[styles.swapCalories, { color: theme.textSecondary }]}>110 cal</Text>
                    <Text style={[styles.swapBenefit, { color: theme.primary }]}>+3g fiber</Text>
                  </View>
                </View>
                <Text style={[styles.swapDescription, { color: theme.textSecondary }]}>
                  {isArabic ? 'أعلى في الألياف' : 'Higher in fiber'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Activity Rewards - Only for consumers */}
        {userRole !== 'business' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isArabic ? 'مكافآت النشاط' : 'Activity Rewards'}
            </Text>
            <View style={[styles.rewardsCard, { backgroundColor: theme.card }]}>
              <View style={styles.rewardHeader}>
                <Zap size={24} color="#F59E0B" />
                <View style={styles.rewardInfo}>
                  <Text style={[styles.rewardTitle, { color: theme.text }]}>
                    {isArabic ? 'خطوات اليوم' : 'Today\'s Steps'}
                  </Text>
                  <Text style={[styles.rewardSteps, { color: theme.textSecondary }]}>7,842 / 10,000</Text>
                </View>
              </View>
              <View style={styles.rewardProgress}>
                <View style={[styles.progressBar, { backgroundColor: theme.surface }]}>
                  <View style={[styles.progressFill, { width: '78%' }]} />
                </View>
                <Text style={[styles.progressText, { color: theme.textSecondary }]}>78% complete</Text>
              </View>
              <View style={[styles.rewardBenefit, { backgroundColor: theme.surface }]}>
                <Text style={[styles.rewardBenefitText, { color: theme.text }]}>
                  {isArabic ? 'اكمل 2,158 خطوة للحصول على خصم BD 5' : 'Complete 2,158 more steps for BD 5 grocery credit'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Medicine Subsidy Checker - Only for consumers */}
        {userRole !== 'business' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isArabic ? 'فاحص دعم الأدوية' : 'Medicine Subsidy Checker'}
            </Text>
            <TouchableOpacity style={[styles.medicineCard, { backgroundColor: theme.card }]}>
              <View style={styles.medicineHeader}>
                <View style={styles.medicineIcon}>
                  <Text style={styles.medicineIconText}>+</Text>
                </View>
                <View style={styles.medicineInfo}>
                  <Text style={[styles.medicineTitle, { color: theme.text }]}>
                    {isArabic ? 'تحقق من دعم الأدوية' : 'Check Medicine Subsidies'}
                  </Text>
                  <Text style={[styles.medicineSubtitle, { color: theme.textSecondary }]}>
                    {isArabic ? 'اعرف الأدوية المدعومة' : 'Find subsidized medications'}
                  </Text>
                </View>
              </View>
              <View style={[styles.medicineExample, { backgroundColor: theme.surface }]}>
                <Text style={[styles.medicineExampleText, { color: theme.primary }]}>
                  {isArabic ? 'مثال: باراسيتامول - خصم 60%' : 'Example: Paracetamol - 60% off'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Nearby Stores - Only for consumers */}
        {userRole !== 'business' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isArabic ? 'متاجر قريبة' : 'Nearby Stores'}
            </Text>
            <TouchableOpacity style={[styles.locationCard, { backgroundColor: theme.card }]}>
              <MapPin size={20} color={theme.primary} />
              <View style={styles.locationInfo}>
                <Text style={[styles.locationTitle, { color: theme.text }]}>
                  {isArabic ? 'العثور على متاجر قريبة' : 'Find stores near you'}
                </Text>
                <Text style={[styles.locationSubtitle, { color: theme.textSecondary }]}>
                  {isArabic ? 'اكتشف أفضل العروض في منطقتك' : 'Discover best deals in your area'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        onBarcodeScanned={handleBarcodeScanned}
      />
      
      {/* Product Comparison Modal */}
      <ProductComparison
        visible={showComparison}
        onClose={() => {
          setShowComparison(false);
          setBarcodeData(undefined);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        barcodeData={barcodeData}
      />
      
      <VoiceAssistantWrapper />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  scanButton: {
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  voiceButton: {
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  filterButton: {
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceDemo: {
    borderRadius: 16,
    padding: 20,
  },
  voiceDemoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  voiceDemoTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  voiceDemoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  voiceDemoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  voiceDemoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesContainer: {
    maxHeight: 50,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  storesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  storeCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '48%',
  },
  storeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  storeInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  storeName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  storeDiscount: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  storeCategory: {
    fontSize: 12,
  },
  comparisonCard: {
    borderRadius: 16,
    padding: 16,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  priceComparison: {
    gap: 12,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bestPrice: {
    fontSize: 12,
    fontWeight: '500',
  },
  locationCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationSubtitle: {
    fontSize: 14,
  },
  swapsContainer: {
    gap: 16,
  },
  swapCard: {
    borderRadius: 16,
    padding: 16,
  },
  swapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  swapTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  swapComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  swapItem: {
    flex: 1,
    alignItems: 'center',
  },
  swapProduct: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  swapCalories: {
    fontSize: 12,
  },
  swapBenefit: {
    fontSize: 12,
    fontWeight: '600',
  },
  swapArrow: {
    fontSize: 18,
    marginHorizontal: 16,
  },
  swapDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  rewardsCard: {
    borderRadius: 16,
    padding: 16,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  rewardSteps: {
    fontSize: 14,
  },
  rewardProgress: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  rewardBenefit: {
    borderRadius: 8,
    padding: 12,
  },
  rewardBenefitText: {
    fontSize: 14,
    textAlign: 'center',
  },
  medicineCard: {
    borderRadius: 16,
    padding: 16,
  },
  medicineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  medicineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicineIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  medicineInfo: {
    flex: 1,
  },
  medicineTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  medicineSubtitle: {
    fontSize: 14,
  },
  medicineExample: {
    borderRadius: 8,
    padding: 12,
  },
  medicineExampleText: {
    fontSize: 12,
    textAlign: 'center',
  },
  // Business-specific styles
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  createOfferButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  createOfferText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  businessOfferCard: {
    marginRight: 16,
  },
  offerActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  pauseButton: {
    flex: 1,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
});