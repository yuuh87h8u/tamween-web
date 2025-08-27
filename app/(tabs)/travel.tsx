import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useApp } from '@/hooks/useAppStore';
import { Plane, DollarSign, MapPin, Calculator, Calendar, CreditCard } from 'lucide-react-native';

interface CurrencyRate {
  currency: string;
  rate: number;
  flag: string;
}

interface TravelBudget {
  destination: string;
  estimatedCost: number;
  savedAmount: number;
  targetDate: string;
}

export default function TravelScreen() {
  const { userData, theme } = useApp();
  const isArabic = userData.language === 'ar';
  const [activeTab, setActiveTab] = useState<'mode' | 'currency' | 'budget'>('mode');
  const [amount, setAmount] = useState<string>('100');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

  const [currencyRates] = useState<CurrencyRate[]>([
    { currency: 'USD', rate: 0.377, flag: '🇺🇸' },
    { currency: 'EUR', rate: 0.355, flag: '🇪🇺' },
    { currency: 'GBP', rate: 0.305, flag: '🇬🇧' },
    { currency: 'SAR', rate: 1.413, flag: '🇸🇦' },
    { currency: 'AED', rate: 1.385, flag: '🇦🇪' },
    { currency: 'KWD', rate: 0.116, flag: '🇰🇼' },
  ]);

  const [travelBudgets] = useState<TravelBudget[]>([
    { destination: 'Dubai', estimatedCost: 500, savedAmount: 320, targetDate: '2024-12-15' },
    { destination: 'London', estimatedCost: 1200, savedAmount: 450, targetDate: '2025-03-20' },
    { destination: 'Mecca (Hajj)', estimatedCost: 800, savedAmount: 600, targetDate: '2025-06-10' },
  ]);

  const convertCurrency = (bdAmount: number, targetCurrency: string): number => {
    const rate = currencyRates.find(r => r.currency === targetCurrency)?.rate || 1;
    return bdAmount / rate;
  };

  const renderTravelMode = () => (
    <View style={styles.section}>
      <View style={[styles.statusCard, { backgroundColor: theme.surfaceSecondary }]}>
        <View style={styles.statusHeader}>
          <Plane size={24} color="#10B981" />
          <Text style={[styles.statusTitle, { color: theme.text }]}>
            {isArabic ? 'حالة السفر' : 'Travel Status'}
          </Text>
        </View>
        <Text style={styles.statusText}>
          {isArabic ? 'أنت حاليًا في البحرين' : 'Currently in Bahrain'}
        </Text>
        <Text style={[styles.statusSubtext, { color: theme.textSecondary }]}>
          {isArabic ? 'الدعم الحكومي نشط' : 'Government subsidies active'}
        </Text>
      </View>

      <View style={[styles.infoCard, { backgroundColor: theme.surfaceSecondary }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>
          {isArabic ? 'معلومات مهمة للسفر' : 'Important Travel Information'}
        </Text>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
            {isArabic ? '• الدعم على الوقود:' : '• Fuel subsidy:'}
          </Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>
            {isArabic ? 'متوقف أثناء السفر' : 'Paused while traveling'}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
            {isArabic ? '• دعم الكهرباء:' : '• Electricity subsidy:'}
          </Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>
            {isArabic ? 'يستمر للمنزل' : 'Continues for home'}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
            {isArabic ? '• دعم المياه:' : '• Water subsidy:'}
          </Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>
            {isArabic ? 'يستمر للمنزل' : 'Continues for home'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <MapPin size={20} color="#FFFFFF" />
        <Text style={styles.actionButtonText}>
          {isArabic ? 'تفعيل وضع السفر' : 'Activate Travel Mode'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCurrencyConverter = () => (
    <View style={styles.section}>
      <View style={[styles.converterCard, { backgroundColor: theme.surfaceSecondary }]}>
        <Text style={[styles.converterTitle, { color: theme.text }]}>
          {isArabic ? 'محول العملات' : 'Currency Converter'}
        </Text>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
            {isArabic ? 'المبلغ بالدينار البحريني' : 'Amount in BHD'}
          </Text>
          <TextInput
            style={[styles.amountInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="100"
            placeholderTextColor={theme.textTertiary}
          />
        </View>

        <View style={styles.currencyGrid}>
          {currencyRates.map((currency) => (
            <TouchableOpacity
              key={currency.currency}
              style={[
                styles.currencyCard,
                { backgroundColor: theme.surface },
                selectedCurrency === currency.currency && [styles.selectedCurrency, { backgroundColor: theme.surfaceSecondary }]
              ]}
              onPress={() => setSelectedCurrency(currency.currency)}
            >
              <Text style={styles.currencyFlag}>{currency.flag}</Text>
              <Text style={[styles.currencyCode, { color: theme.text }]}>{currency.currency}</Text>
              <Text style={styles.currencyAmount}>
                {convertCurrency(parseFloat(amount) || 0, currency.currency).toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.exchangeCard, { backgroundColor: theme.surfaceSecondary }]}>
        <Text style={[styles.exchangeTitle, { color: theme.text }]}>
          {isArabic ? 'أفضل أسعار الصرف' : 'Best Exchange Rates'}
        </Text>
        <View style={[styles.exchangeItem, { borderBottomColor: theme.border }]}>
          <Text style={[styles.exchangeBank, { color: theme.text }]}>NBB Exchange</Text>
          <Text style={styles.exchangeRate}>USD: 0.376</Text>
          <Text style={[styles.exchangeFee, { color: theme.textSecondary }]}>
            {isArabic ? 'رسوم: 2 د.ب' : 'Fee: 2 BD'}
          </Text>
        </View>
        <View style={[styles.exchangeItem, { borderBottomColor: theme.border }]}>
          <Text style={[styles.exchangeBank, { color: theme.text }]}>BBK Exchange</Text>
          <Text style={styles.exchangeRate}>USD: 0.375</Text>
          <Text style={[styles.exchangeFee, { color: theme.textSecondary }]}>
            {isArabic ? 'رسوم: 1.5 د.ب' : 'Fee: 1.5 BD'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderBudgetPlanner = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {isArabic ? 'خطط السفر' : 'Travel Plans'}
      </Text>

      {travelBudgets.map((budget, index) => {
        const progress = (budget.savedAmount / budget.estimatedCost) * 100;
        const remaining = budget.estimatedCost - budget.savedAmount;
        
        return (
          <View key={index} style={[styles.budgetCard, { backgroundColor: theme.surfaceSecondary }]}>
            <View style={styles.budgetHeader}>
              <Text style={[styles.budgetDestination, { color: theme.text }]}>{budget.destination}</Text>
              <Text style={[styles.budgetDate, { color: theme.textSecondary }]}>{budget.targetDate}</Text>
            </View>
            
            <View style={styles.budgetProgress}>
              <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
              </View>
              <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
            </View>
            
            <View style={styles.budgetDetails}>
              <View style={styles.budgetItem}>
                <Text style={[styles.budgetLabel, { color: theme.textSecondary }]}>
                  {isArabic ? 'محفوظ:' : 'Saved:'}
                </Text>
                <Text style={[styles.budgetValue, { color: theme.text }]}>BD {budget.savedAmount}</Text>
              </View>
              <View style={styles.budgetItem}>
                <Text style={[styles.budgetLabel, { color: theme.textSecondary }]}>
                  {isArabic ? 'المطلوب:' : 'Target:'}
                </Text>
                <Text style={[styles.budgetValue, { color: theme.text }]}>BD {budget.estimatedCost}</Text>
              </View>
              <View style={styles.budgetItem}>
                <Text style={[styles.budgetLabel, { color: theme.textSecondary }]}>
                  {isArabic ? 'المتبقي:' : 'Remaining:'}
                </Text>
                <Text style={[styles.budgetValue, { color: '#ff4444' }]}>
                  BD {remaining}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.addSavingsButton}>
              <Text style={styles.addSavingsText}>
                {isArabic ? 'إضافة مدخرات' : 'Add Savings'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <TouchableOpacity style={[styles.newPlanButton, { backgroundColor: theme.surfaceSecondary, borderColor: theme.primary }]}>
        <Calendar size={20} color="#10B981" />
        <Text style={styles.newPlanText}>
          {isArabic ? 'خطة سفر جديدة' : 'New Travel Plan'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: isArabic ? 'السفر والتنقل' : 'Travel & Mobility',
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.text,
        }} 
      />
      
      <View style={[styles.tabContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'mode' && [styles.activeTab, { backgroundColor: theme.primary }]]}
          onPress={() => setActiveTab('mode')}
        >
          <Text style={[styles.tabText, { color: theme.textTertiary }, activeTab === 'mode' && styles.activeTabText]}>
            {isArabic ? 'وضع السفر' : 'Travel Mode'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'currency' && [styles.activeTab, { backgroundColor: theme.primary }]]}
          onPress={() => setActiveTab('currency')}
        >
          <Text style={[styles.tabText, { color: theme.textTertiary }, activeTab === 'currency' && styles.activeTabText]}>
            {isArabic ? 'العملات' : 'Currency'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'budget' && [styles.activeTab, { backgroundColor: theme.primary }]]}
          onPress={() => setActiveTab('budget')}
        >
          <Text style={[styles.tabText, { color: theme.textTertiary }, activeTab === 'budget' && styles.activeTabText]}>
            {isArabic ? 'الميزانية' : 'Budget'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'mode' && renderTravelMode()}
        {activeTab === 'currency' && renderCurrencyConverter()}
        {activeTab === 'budget' && renderBudgetPlanner()}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  converterCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  converterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  amountInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  currencyCard: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCurrency: {
    borderColor: '#10B981',
  },
  currencyFlag: {
    fontSize: 24,
    marginBottom: 4,
  },
  currencyCode: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  currencyAmount: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  exchangeCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exchangeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  exchangeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  exchangeBank: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  exchangeRate: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  exchangeFee: {
    fontSize: 12,
    color: '#9CA3AF',
    flex: 1,
    textAlign: 'right',
  },
  budgetCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetDestination: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  budgetDate: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  budgetProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  budgetDetails: {
    marginBottom: 16,
  },
  budgetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  budgetValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  addSavingsButton: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addSavingsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  newPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
  },
  newPlanText: {
    fontSize: 16,
    color: '#10B981',
    marginLeft: 8,
    fontWeight: '600',
  },
});