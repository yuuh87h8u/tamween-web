import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useApp } from '@/hooks/useAppStore';
import { Calendar, Package, Trash2, AlertCircle, Plus, X } from 'lucide-react-native';

interface Subscription {
  id: string;
  name: string;
  cost: number;
  nextBilling: string;
  category: string;
}

interface InventoryItem {
  id: string;
  name: string;
  expiryDate: string;
  quantity: number;
  category: string;
}

interface MealPlan {
  id: string;
  name: string;
  ingredients: string[];
  difficulty: string;
  cookTime: string;
}

export default function LifestyleScreen() {
  const { userData, theme } = useApp();
  const isArabic = userData.language === 'ar';
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'meals' | 'inventory'>('subscriptions');
  
  const [subscriptions] = useState<Subscription[]>([
    { id: '1', name: 'Netflix', cost: 5.5, nextBilling: '2024-09-15', category: 'Entertainment' },
    { id: '2', name: 'Gym Membership', cost: 25, nextBilling: '2024-09-01', category: 'Health' },
    { id: '3', name: 'Mobile Data', cost: 8, nextBilling: '2024-08-30', category: 'Utilities' },
    { id: '4', name: 'Spotify', cost: 4, nextBilling: '2024-09-10', category: 'Entertainment' },
  ]);

  const [inventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Milk', expiryDate: '2024-08-28', quantity: 2, category: 'Dairy' },
    { id: '2', name: 'Bread', expiryDate: '2024-08-27', quantity: 1, category: 'Bakery' },
    { id: '3', name: 'Chicken', expiryDate: '2024-08-29', quantity: 1, category: 'Meat' },
    { id: '4', name: 'Tomatoes', expiryDate: '2024-08-26', quantity: 3, category: 'Vegetables' },
  ]);

  const [mealPlans] = useState<MealPlan[]>([
    { id: '1', name: 'Chicken Tomato Pasta', ingredients: ['Chicken', 'Tomatoes', 'Pasta'], difficulty: 'Easy', cookTime: '30 min' },
    { id: '2', name: 'French Toast', ingredients: ['Bread', 'Milk', 'Eggs'], difficulty: 'Easy', cookTime: '15 min' },
    { id: '3', name: 'Tomato Salad', ingredients: ['Tomatoes', 'Cucumber', 'Olive Oil'], difficulty: 'Very Easy', cookTime: '5 min' },
  ]);

  const handleCancelSubscription = (subscription: Subscription) => {
    Alert.alert(
      isArabic ? 'إلغاء الاشتراك' : 'Cancel Subscription',
      isArabic ? `هل تريد إلغاء اشتراك ${subscription.name}؟` : `Cancel ${subscription.name} subscription?`,
      [
        { text: isArabic ? 'لا' : 'No', style: 'cancel' },
        { text: isArabic ? 'نعم' : 'Yes', onPress: () => console.log('Cancelled:', subscription.name) }
      ]
    );
  };

  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  };

  const totalMonthlyCost = subscriptions.reduce((sum, sub) => sum + sub.cost, 0);

  const renderSubscriptions = () => (
    <View style={styles.section}>
      <View style={[styles.summaryCard, { backgroundColor: theme.primary }]}>
        <Text style={styles.summaryTitle}>
          {isArabic ? 'إجمالي الاشتراكات الشهرية' : 'Total Monthly Subscriptions'}
        </Text>
        <Text style={styles.summaryAmount}>BD {totalMonthlyCost.toFixed(1)}</Text>
        <Text style={styles.summarySubtext}>
          {isArabic ? `${subscriptions.length} اشتراكات نشطة` : `${subscriptions.length} active subscriptions`}
        </Text>
      </View>

      {subscriptions.map((subscription) => (
        <View key={subscription.id} style={[styles.subscriptionCard, { backgroundColor: theme.surfaceSecondary }]}>
          <View style={styles.subscriptionInfo}>
            <Text style={[styles.subscriptionName, { color: theme.text }]}>{subscription.name}</Text>
            <Text style={[styles.subscriptionCategory, { color: theme.textSecondary }]}>{subscription.category}</Text>
            <Text style={[styles.subscriptionBilling, { color: theme.textTertiary }]}>
              {isArabic ? 'التجديد التالي:' : 'Next billing:'} {subscription.nextBilling}
            </Text>
          </View>
          <View style={styles.subscriptionActions}>
            <Text style={[styles.subscriptionCost, { color: theme.primary }]}>BD {subscription.cost}</Text>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => handleCancelSubscription(subscription)}
            >
              <X size={16} color="#ff4444" />
              <Text style={styles.cancelButtonText}>
                {isArabic ? 'إلغاء' : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderMealPlanner = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {isArabic ? 'وصفات مقترحة من مخزونك' : 'Suggested Recipes from Your Inventory'}
        </Text>
      </View>

      {mealPlans.map((meal) => (
        <View key={meal.id} style={[styles.mealCard, { backgroundColor: theme.surfaceSecondary }]}>
          <View style={styles.mealInfo}>
            <Text style={[styles.mealName, { color: theme.text }]}>{meal.name}</Text>
            <Text style={[styles.mealDetails, { color: theme.textSecondary }]}>
              {isArabic ? 'المكونات:' : 'Ingredients:'} {meal.ingredients.join(', ')}
            </Text>
            <View style={styles.mealMeta}>
              <Text style={[styles.mealDifficulty, { color: theme.primary, backgroundColor: theme.surface }]}>{meal.difficulty}</Text>
              <Text style={[styles.mealTime, { color: theme.textSecondary, backgroundColor: theme.surface }]}>{meal.cookTime}</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.cookButton, { backgroundColor: theme.primary }]}>
            <Text style={styles.cookButtonText}>
              {isArabic ? 'طبخ' : 'Cook'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={[styles.addMealButton, { backgroundColor: theme.surfaceSecondary, borderColor: theme.primary }]}>
        <Plus size={20} color={theme.primary} />
        <Text style={[styles.addMealText, { color: theme.primary }]}>
          {isArabic ? 'إضافة وصفة جديدة' : 'Add New Recipe'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderInventory = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {isArabic ? 'مخزون المنزل' : 'Home Inventory'}
        </Text>
        <TouchableOpacity style={[styles.scanButton, { backgroundColor: theme.surface }]}>
          <Package size={16} color={theme.primary} />
          <Text style={[styles.scanButtonText, { color: theme.primary }]}>
            {isArabic ? 'مسح باركود' : 'Scan Barcode'}
          </Text>
        </TouchableOpacity>
      </View>

      {inventory.map((item) => (
        <View key={item.id} style={[
          styles.inventoryCard,
          { backgroundColor: theme.surfaceSecondary },
          isExpiringSoon(item.expiryDate) && styles.expiringCard
        ]}>
          <View style={styles.inventoryInfo}>
            <Text style={[styles.inventoryName, { color: theme.text }]}>{item.name}</Text>
            <Text style={[styles.inventoryCategory, { color: theme.textSecondary }]}>{item.category}</Text>
            <Text style={[
              styles.inventoryExpiry,
              { color: theme.textTertiary },
              isExpiringSoon(item.expiryDate) && styles.expiringText
            ]}>
              {isArabic ? 'ينتهي في:' : 'Expires:'} {item.expiryDate}
            </Text>
          </View>
          <View style={styles.inventoryActions}>
            <Text style={[styles.inventoryQuantity, { color: theme.primary }]}>x{item.quantity}</Text>
            {isExpiringSoon(item.expiryDate) && (
              <AlertCircle size={20} color="#ff4444" />
            )}
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: isArabic ? 'نمط الحياة' : 'Lifestyle',
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.text,
        }} 
      />
      
      <View style={[styles.tabContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'subscriptions' && [styles.activeTab, { backgroundColor: theme.primary }]]}
          onPress={() => setActiveTab('subscriptions')}
        >
          <Text style={[styles.tabText, { color: theme.textTertiary }, activeTab === 'subscriptions' && styles.activeTabText]}>
            {isArabic ? 'الاشتراكات' : 'Subscriptions'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'meals' && [styles.activeTab, { backgroundColor: theme.primary }]]}
          onPress={() => setActiveTab('meals')}
        >
          <Text style={[styles.tabText, { color: theme.textTertiary }, activeTab === 'meals' && styles.activeTabText]}>
            {isArabic ? 'الوجبات' : 'Meals'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'inventory' && [styles.activeTab, { backgroundColor: theme.primary }]]}
          onPress={() => setActiveTab('inventory')}
        >
          <Text style={[styles.tabText, { color: theme.textTertiary }, activeTab === 'inventory' && styles.activeTabText]}>
            {isArabic ? 'المخزون' : 'Inventory'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'subscriptions' && renderSubscriptions()}
        {activeTab === 'meals' && renderMealPlanner()}
        {activeTab === 'inventory' && renderInventory()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 8,
  },
  summarySubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  subscriptionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subscriptionCategory: {
    fontSize: 14,
    marginTop: 2,
  },
  subscriptionBilling: {
    fontSize: 12,
    marginTop: 4,
  },
  subscriptionActions: {
    alignItems: 'flex-end',
  },
  subscriptionCost: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#ffe6e6',
  },
  cancelButtonText: {
    fontSize: 12,
    color: '#ff4444',
    marginLeft: 4,
    fontWeight: '600',
  },
  mealCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealDetails: {
    fontSize: 14,
    marginTop: 4,
  },
  mealMeta: {
    flexDirection: 'row',
    marginTop: 8,
  },
  mealDifficulty: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  mealTime: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cookButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cookButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  addMealText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scanButtonText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '600',
  },
  inventoryCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expiringCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
  inventoryInfo: {
    flex: 1,
  },
  inventoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inventoryCategory: {
    fontSize: 14,
    marginTop: 2,
  },
  inventoryExpiry: {
    fontSize: 12,
    marginTop: 4,
  },
  expiringText: {
    color: '#ff4444',
    fontWeight: '600',
  },
  inventoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inventoryQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});