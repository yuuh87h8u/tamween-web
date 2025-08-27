import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Image 
} from 'react-native';
import { Stack } from 'expo-router';
import { CreditCard, TrendingUp, Shield, Gift, AlertTriangle } from 'lucide-react-native';
import { bankCards } from '@/constants/mockData';
import { useApp } from '@/hooks/useAppStore';
import { VoiceAssistantWrapper } from '@/components/VoiceAssistantWrapper';

export default function BankingScreen() {
  const { userData, theme } = useApp();
  const [selectedTab, setSelectedTab] = useState<'cards' | 'loans' | 'investments' | 'security'>('cards');
  const isArabic = userData.language === 'ar';

  const tabs = [
    { key: 'cards', label: isArabic ? 'البطاقات' : 'Cards', icon: CreditCard },
    { key: 'loans', label: isArabic ? 'القروض' : 'Loans', icon: TrendingUp },
    { key: 'investments', label: isArabic ? 'الاستثمار' : 'Investments', icon: Gift },
    { key: 'security', label: isArabic ? 'الأمان' : 'Security', icon: Shield },
  ];

  const cashbackOffers = [
    { bank: 'NBB', category: 'Groceries', rate: '5%', color: '#10B981' },
    { bank: 'BBK', category: 'Fuel', rate: '3%', color: '#3B82F6' },
    { bank: 'HSBC', category: 'Dining', rate: '4%', color: '#8B5CF6' },
  ];

  const loanOffers = [
    { bank: 'NBB', type: 'Personal Loan', rate: '5.5%', amount: 'Up to BD 50,000' },
    { bank: 'BBK', type: 'Car Loan', rate: '4.2%', amount: 'Up to BD 30,000' },
    { bank: 'HSBC', type: 'Home Loan', rate: '3.8%', amount: 'Up to BD 200,000' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{ 
          title: isArabic ? 'البنوك والتمويل' : 'Banking & Finance',
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }} 
      />

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                { backgroundColor: theme.surface },
                selectedTab === tab.key && { backgroundColor: theme.primary }
              ]}
              onPress={() => setSelectedTab(tab.key as any)}
            >
              <IconComponent 
                size={16} 
                color={selectedTab === tab.key ? '#FFFFFF' : theme.textSecondary} 
              />
              <Text style={[
                styles.tabText,
                { color: theme.textSecondary },
                selectedTab === tab.key && { color: '#FFFFFF' }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'cards' && (
          <>
            {/* Smart Card Advisor */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {isArabic ? 'مستشار البطاقات الذكي' : 'Smart Card Advisor'}
              </Text>
              <View style={[styles.advisorCard, { backgroundColor: theme.card }]}>
                <View style={[styles.recommendedCard, { backgroundColor: theme.surface }]}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.bankLogo, { backgroundColor: '#10B981' }]}>
                      <Text style={styles.bankInitial}>N</Text>
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={[styles.cardName, { color: theme.text }]}>NBB Cashback Card</Text>
                      <Text style={[styles.cardBank, { color: theme.textSecondary }]}>National Bank of Bahrain</Text>
                    </View>
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedText}>
                        {isArabic ? 'موصى' : 'Recommended'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.cardBenefit, { color: theme.text }]}>
                    {isArabic ? 
                      '5% استرداد نقدي على البقالة - يوفر لك BD 15 شهرياً' :
                      '5% cashback on groceries - saves you BD 15 monthly'
                    }
                  </Text>
                </View>
              </View>
            </View>

            {/* Cashback Offers */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {isArabic ? 'عروض الاسترداد النقدي' : 'Cashback Offers'}
              </Text>
              {cashbackOffers.map((offer, index) => (
                <View key={index} style={[styles.offerCard, { backgroundColor: theme.card }]}>
                  <View style={[styles.offerIcon, { backgroundColor: offer.color }]}>
                    <Text style={styles.offerRate}>{offer.rate}</Text>
                  </View>
                  <View style={styles.offerInfo}>
                    <Text style={[styles.offerBank, { color: theme.text }]}>{offer.bank}</Text>
                    <Text style={[styles.offerCategory, { color: theme.textSecondary }]}>{offer.category}</Text>
                  </View>
                  <TouchableOpacity style={styles.applyButton}>
                    <Text style={styles.applyText}>
                      {isArabic ? 'تقدم' : 'Apply'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* All Cards */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {isArabic ? 'جميع البطاقات' : 'All Cards'}
              </Text>
              {bankCards.map((card) => (
                <View key={card.id} style={[styles.cardItem, { backgroundColor: theme.card }]}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.bankLogo, { backgroundColor: card.color }]}>
                      <Text style={styles.bankInitial}>
                        {card.bank.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={[styles.cardName, { color: theme.text }]}>{card.name}</Text>
                      <Text style={[styles.cardBank, { color: theme.textSecondary }]}>{card.bank}</Text>
                    </View>
                  </View>
                  <View style={styles.cardDetails}>
                    <Text style={[styles.cardDetail, { color: theme.textSecondary }]}>
                      {isArabic ? 'استرداد نقدي:' : 'Cashback:'} {card.cashbackRate}%
                    </Text>
                    <Text style={[styles.cardDetail, { color: theme.textSecondary }]}>
                      {isArabic ? 'رسوم سنوية:' : 'Annual Fee:'} BD {card.annualFee}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {selectedTab === 'loans' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isArabic ? 'عروض القروض' : 'Loan Offers'}
            </Text>
            {loanOffers.map((loan, index) => (
              <View key={index} style={[styles.loanCard, { backgroundColor: theme.card }]}>
                <View style={styles.loanHeader}>
                  <Text style={[styles.loanBank, { color: theme.text }]}>{loan.bank}</Text>
                  <Text style={[styles.loanRate, { color: theme.primary }]}>{loan.rate}</Text>
                </View>
                <Text style={[styles.loanType, { color: theme.textSecondary }]}>{loan.type}</Text>
                <Text style={[styles.loanAmount, { color: theme.text }]}>{loan.amount}</Text>
                <TouchableOpacity style={styles.applyButton}>
                  <Text style={styles.applyText}>
                    {isArabic ? 'تقدم الآن' : 'Apply Now'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'investments' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isArabic ? 'الاستثمارات الصغيرة' : 'Micro Investments'}
            </Text>
            <View style={[styles.investmentCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.investmentTitle, { color: theme.text }]}>
                {isArabic ? 'تقريب المشتريات' : 'Round-up Savings'}
              </Text>
              <Text style={[styles.investmentDescription, { color: theme.textSecondary }]}>
                {isArabic ? 
                  'قرب مشترياتك لأقرب دينار واستثمر الفرق' :
                  'Round up your purchases and invest the difference'
                }
              </Text>
              <View style={styles.investmentStats}>
                <Text style={[styles.investmentAmount, { color: theme.primary }]}>BD 23.50</Text>
                <Text style={[styles.investmentLabel, { color: theme.textSecondary }]}>
                  {isArabic ? 'هذا الشهر' : 'This month'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {selectedTab === 'security' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isArabic ? 'تحذيرات الأمان' : 'Security Alerts'}
            </Text>
            <View style={[styles.securityCard, { backgroundColor: theme.card }]}>
              <AlertTriangle size={24} color="#F59E0B" />
              <View style={styles.securityInfo}>
                <Text style={[styles.securityTitle, { color: theme.text }]}>
                  {isArabic ? 'تحذير من الاحتيال' : 'Fraud Alert'}
                </Text>
                <Text style={[styles.securityDescription, { color: theme.textSecondary }]}>
                  {isArabic ? 
                    'احذر من الرسائل المشبوهة التي تطلب معلومات البنك' :
                    'Beware of suspicious messages asking for bank details'
                  }
                </Text>
              </View>
            </View>
            
            <View style={[styles.tipCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.tipTitle, { color: theme.text }]}>
                {isArabic ? 'نصائح الأمان' : 'Security Tips'}
              </Text>
              <Text style={[styles.tipText, { color: theme.textSecondary }]}>
                • {isArabic ? 'لا تشارك رقم البطاقة أبداً' : 'Never share your card PIN'}
              </Text>
              <Text style={[styles.tipText, { color: theme.textSecondary }]}>
                • {isArabic ? 'تحقق من كشف الحساب بانتظام' : 'Check statements regularly'}
              </Text>
              <Text style={[styles.tipText, { color: theme.textSecondary }]}>
                • {isArabic ? 'استخدم التطبيقات الرسمية فقط' : 'Use official banking apps only'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
      <VoiceAssistantWrapper />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    maxHeight: 60,
  },
  tabsContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  advisorCard: {
    borderRadius: 16,
    padding: 16,
  },
  recommendedCard: {
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bankLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bankInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardBank: {
    fontSize: 12,
  },
  recommendedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recommendedText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cardBenefit: {
    fontSize: 14,
    lineHeight: 20,
  },
  offerCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  offerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  offerRate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  offerInfo: {
    flex: 1,
  },
  offerBank: {
    fontSize: 16,
    fontWeight: '600',
  },
  offerCategory: {
    fontSize: 14,
  },
  applyButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  cardItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardDetails: {
    marginTop: 12,
    gap: 4,
  },
  cardDetail: {
    fontSize: 14,
  },
  loanCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  loanBank: {
    fontSize: 16,
    fontWeight: '600',
  },
  loanRate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loanType: {
    fontSize: 14,
    marginBottom: 4,
  },
  loanAmount: {
    fontSize: 14,
    marginBottom: 12,
  },
  investmentCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  investmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  investmentDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  investmentStats: {
    alignItems: 'center',
  },
  investmentAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  investmentLabel: {
    fontSize: 12,
  },
  securityCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  securityInfo: {
    flex: 1,
    marginLeft: 16,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  securityDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  tipCard: {
    borderRadius: 12,
    padding: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});