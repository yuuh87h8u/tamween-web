import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { 
  BarChart3, 
  CreditCard, 
  ShoppingBag, 
  Users,
  Sun,
  Moon
} from 'lucide-react-native';
import FinancialHealthScore from '@/components/FinancialHealthScore';
import SubsidyCard from '@/components/SubsidyCard';
import AITipCard from '@/components/AITipCard';
import AlertBanner from '@/components/AlertBanner';
import DealCard from '@/components/DealCard';
import { useApp } from '@/hooks/useAppStore';
import { subsidyData, aiTips, deals } from '@/constants/mockData';
import { VoiceAssistantWrapper } from '@/components/VoiceAssistantWrapper';
import { trpc } from '@/lib/trpc';
import AIButtonRTC from '@/src/components/AIButtonRTC';

export default function HomeScreen() {
  const { userData, toggleLanguage, toggleTheme, theme, authUser } = useApp();
  const [showAlert, setShowAlert] = useState(true);
  const isArabic = userData.language === 'ar';
  const isLightMode = userData.theme === 'light';
  const userRole = authUser?.role || 'individual';

  // Test backend connection
  const healthQuery = trpc.example.health.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const electricitySubsidy = subsidyData.find(s => s.type === 'electricity');
  const isNearElectricityLimit = electricitySubsidy && 
    (electricitySubsidy.currentUsage / electricitySubsidy.subsidyLimit) > 0.85;



  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>
              {isArabic ? `مرحباً ${authUser?.name || ''}` : `Welcome back ${authUser?.name || ''}`}
            </Text>
            <Text style={[styles.appName, { color: theme.text }]}>
              {userRole === 'business' 
                ? (isArabic ? 'لوحة الأعمال' : 'Business Dashboard')
                : userRole === 'family'
                ? (isArabic ? 'لوحة العائلة' : 'Family Dashboard')
                : 'Tamween'
              }
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={toggleTheme} style={[styles.themeButton, { backgroundColor: theme.surface }]}>
              {isLightMode ? (
                <Moon size={20} color={theme.text} />
              ) : (
                <Sun size={20} color={theme.text} />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleLanguage} style={[styles.languageButton, { backgroundColor: theme.surface }]}>
              <Text style={[styles.languageText, { color: theme.text }]}>
                {isArabic ? 'EN' : 'عربي'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Backend Status - Development Only */}
        {__DEV__ && (
          <View style={[styles.section, { paddingVertical: 8 }]}>
            <View style={[styles.statusCard, { 
              backgroundColor: healthQuery.isSuccess ? '#10B981' : healthQuery.isError ? '#EF4444' : '#F59E0B'
            }]}>
              <Text style={[styles.statusText, { color: 'white' }]}>
                Backend: {healthQuery.isLoading ? 'Connecting...' : healthQuery.isSuccess ? 'Connected' : 'Offline'}
              </Text>
              {healthQuery.data && (
                <Text style={[styles.statusSubtext, { color: 'white' }]}>
                  {healthQuery.data.message}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Alert Banner */}
        {showAlert && isNearElectricityLimit && (
          <View style={styles.section}>
            <AlertBanner
              message={isArabic ? 
                'أنت تقترب من حد دعم الكهرباء' : 
                "You're nearing your electricity subsidy limit"
              }
              onDismiss={() => setShowAlert(false)}
            />
          </View>
        )}

        {/* Financial Health Score - Only for Individual and Family */}
        {(userRole === 'individual' || userRole === 'family') && (
          <View style={styles.scoreSection}>
            <FinancialHealthScore score={userData.financialHealthScore || 0} size={140} />
          </View>
        )}
        
        {/* Business Stats */}
        {userRole === 'business' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isArabic ? 'إحصائيات الأعمال' : 'Business Overview'}
            </Text>
            <View style={styles.statsContainer}>
              <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  {isArabic ? 'العملاء النشطون' : 'Active Customers'}
                </Text>
                <Text style={[styles.statValue, { color: theme.text }]}>2,847</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  {isArabic ? 'العروض المنشورة' : 'Published Offers'}
                </Text>
                <Text style={[styles.statValue, { color: theme.text }]}>23</Text>
              </View>
            </View>
          </View>
        )}

        {/* Monthly Subsidy Savings - Only for Individual and Family */}
        {(userRole === 'individual' || userRole === 'family') && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isArabic ? 'مدخرات الدعم الشهرية' : 'Monthly Subsidy Savings'}
            </Text>
            {subsidyData.slice(0, 2).map((subsidy, index) => (
              <SubsidyCard 
                key={index} 
                data={subsidy} 
                onPress={() => router.push('/subsidies')}
              />
            ))}
          </View>
        )}

        {/* Quick Stats - Individual */}
        {userRole === 'individual' && (
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                {isArabic ? 'الإنفاق' : 'Spending'}
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>BD {userData.monthlySpending || 0}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                {isArabic ? 'المدخرات' : 'Savings'}
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>BD {userData.monthlySavings || 0}</Text>
            </View>
          </View>
        )}
        
        {/* Family Stats */}
        {userRole === 'family' && (
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                {isArabic ? 'إجمالي الإنفاق' : 'Total Spending'}
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>BD {(userData.monthlySpending || 0) * 1.8}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                {isArabic ? 'إجمالي المدخرات' : 'Total Savings'}
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>BD {(userData.monthlySavings || 0) * 2.2}</Text>
            </View>
          </View>
        )}

        {/* Individual Lifetime Savings */}
        {userRole === 'individual' && (
          <View style={[styles.lifetimeSavingsCard, { backgroundColor: theme.card }]}>
            <View style={styles.lifetimeSavingsHeader}>
              <Text style={[styles.lifetimeSavingsTitle, { color: theme.textSecondary }]}>
                {isArabic ? 'إجمالي المدخرات مدى الحياة' : 'Lifetime Savings'}
              </Text>
              <Text style={[styles.lifetimeSavingsAmount, { color: theme.primary }]}>BD {userData.lifetimeSavings || 0}</Text>
            </View>
            <View style={styles.lifetimeSavingsBreakdown}>
              <View style={styles.savingsBreakdownItem}>
                <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>{isArabic ? 'الدعم' : 'Subsidies'}</Text>
                <Text style={[styles.breakdownValue, { color: theme.text }]}>BD 1,250</Text>
              </View>
              <View style={styles.savingsBreakdownItem}>
                <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>{isArabic ? 'العروض' : 'Deals'}</Text>
                <Text style={[styles.breakdownValue, { color: theme.text }]}>BD 680</Text>
              </View>
              <View style={styles.savingsBreakdownItem}>
                <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>{isArabic ? 'البنوك' : 'Banking'}</Text>
                <Text style={[styles.breakdownValue, { color: theme.text }]}>BD 520</Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Family Combined Savings */}
        {userRole === 'family' && (
          <View style={[styles.lifetimeSavingsCard, { backgroundColor: theme.card }]}>
            <View style={styles.lifetimeSavingsHeader}>
              <Text style={[styles.lifetimeSavingsTitle, { color: theme.textSecondary }]}>
                {isArabic ? 'إجمالي مدخرات العائلة' : 'Family Lifetime Savings'}
              </Text>
              <Text style={[styles.lifetimeSavingsAmount, { color: theme.primary }]}>BD {(userData.lifetimeSavings || 0) * 2.5}</Text>
            </View>
            <View style={styles.lifetimeSavingsBreakdown}>
              <View style={styles.savingsBreakdownItem}>
                <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>{isArabic ? 'الدعم' : 'Subsidies'}</Text>
                <Text style={[styles.breakdownValue, { color: theme.text }]}>BD 3,125</Text>
              </View>
              <View style={styles.savingsBreakdownItem}>
                <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>{isArabic ? 'العروض' : 'Deals'}</Text>
                <Text style={[styles.breakdownValue, { color: theme.text }]}>BD 1,700</Text>
              </View>
              <View style={styles.savingsBreakdownItem}>
                <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>{isArabic ? 'البنوك' : 'Banking'}</Text>
                <Text style={[styles.breakdownValue, { color: theme.text }]}>BD 1,300</Text>
              </View>
            </View>
          </View>
        )}

        {/* Individual Carbon & Health Stats */}
        {userRole === 'individual' && (
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                {isArabic ? 'الكربون المحفوظ' : 'CO₂ Saved'}
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{userData.carbonSaved || 0} kg</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                {isArabic ? 'خطوات اليوم' : 'Steps Today'}
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{(userData.stepsToday || 0).toLocaleString()}</Text>
            </View>
          </View>
        )}
        
        {/* Family Activity Stats */}
        {userRole === 'family' && (
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                {isArabic ? 'أعضاء نشطون' : 'Active Members'}
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>4/4</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                {isArabic ? 'نقاط العائلة' : 'Family Points'}
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>1,250</Text>
            </View>
          </View>
        )}

        {/* AI Tip */}
        <View style={styles.section}>
          <AITipCard tip={aiTips[0]} />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
          </Text>
          <View style={styles.quickActions}>
            {(userRole === 'individual' || userRole === 'family') && (
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: theme.card }]}
                onPress={() => router.push('/subsidies')}
              >
                <BarChart3 size={24} color={theme.primary} />
                <Text style={[styles.actionText, { color: theme.text }]}>
                  {isArabic ? 'الدعم' : 'Subsidies'}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.card }]}
              onPress={() => router.push('/shopping')}
            >
              <ShoppingBag size={24} color={theme.secondary} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                {userRole === 'business' 
                  ? (isArabic ? 'العروض' : 'Offers')
                  : (isArabic ? 'العروض' : 'Deals')
                }
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.card }]}
              onPress={() => router.push('/banking')}
            >
              <CreditCard size={24} color={theme.accent} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                {userRole === 'business'
                  ? (isArabic ? 'الخدمات' : 'Services')
                  : (isArabic ? 'البنوك' : 'Banking')
                }
              </Text>
            </TouchableOpacity>
            {userRole === 'family' && (
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: theme.card }]}
                onPress={() => router.push('/(tabs)/family-management')}
              >
                <Users size={24} color="#EC4899" />
                <Text style={[styles.actionText, { color: theme.text }]}>
                  {isArabic ? 'العائلة' : 'Family'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Featured Deals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {userRole === 'business'
                ? (isArabic ? 'عروضك النشطة' : 'Your Active Offers')
                : (isArabic ? 'عروض مميزة' : 'Featured Deals')
              }
            </Text>
            <TouchableOpacity onPress={() => router.push('/shopping')}>
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
      </ScrollView>

      {Platform.OS === 'web' ? (
        <AIButtonRTC
          addToFamilyNotes={(items: string[]) => {
            console.log('addToFamilyNotes', items)
          }}
          openBills={() => router.push('/bills')}
          openBankDeals={() => router.push('/banking')}
          openHospital={() => router.push('/health')}
        />
      ) : null}

      <VoiceAssistantWrapper />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  greeting: {
    fontSize: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  themeButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scoreSection: {
    alignItems: 'center',
    paddingVertical: 20,
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
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
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    minHeight: 80,
  },
  actionText: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  lifetimeSavingsCard: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  lifetimeSavingsHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  lifetimeSavingsTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  lifetimeSavingsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  lifetimeSavingsBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  savingsBreakdownItem: {
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusCard: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusSubtext: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.9,
  },
});