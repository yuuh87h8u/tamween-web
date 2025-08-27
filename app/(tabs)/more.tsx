import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import {
  User,
  Users,
  Leaf,
  Briefcase,
  Zap,
  Receipt,
  Car,
  GraduationCap,
  Heart,
  Building,
  Coffee,
  Plane,
  TrendingUp,
  Laptop,
  Trophy,
  Sparkles,
  Settings,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';
import { VoiceAssistantWrapper } from '@/components/VoiceAssistantWrapper';

interface FeatureItem {
  id: string;
  title: string;
  titleAr: string;
  icon: React.ComponentType<any>;
  color: string;
  route: string;
  description?: string;
  descriptionAr?: string;
}

interface FeatureCategory {
  id: string;
  title: string;
  titleAr: string;
  items: FeatureItem[];
}

const featureCategories: FeatureCategory[] = [
  {
    id: 'personal',
    title: 'Personal & Family',
    titleAr: 'الشخصية والعائلة',
    items: [
      {
        id: 'profile',
        title: 'Profile',
        titleAr: 'الملف الشخصي',
        icon: User,
        color: '#8B5CF6',
        route: '/profile',
        description: 'Manage your account settings',
        descriptionAr: 'إدارة إعدادات حسابك',
      },
      {
        id: 'family',
        title: 'Family',
        titleAr: 'العائلة',
        icon: Users,
        color: '#EC4899',
        route: '/family',
        description: 'Family sharing and management',
        descriptionAr: 'مشاركة وإدارة العائلة',
      },
    ],
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle & Daily Living',
    titleAr: 'نمط الحياة والمعيشة',
    items: [
      {
        id: 'lifestyle',
        title: 'Lifestyle Hub',
        titleAr: 'مركز نمط الحياة',
        icon: Coffee,
        color: '#F59E0B',
        route: '/lifestyle',
        description: 'Subscriptions, meal planning, inventory',
        descriptionAr: 'الاشتراكات، تخطيط الوجبات، المخزون',
      },
      {
        id: 'travel',
        title: 'Travel & Cross-Border',
        titleAr: 'السفر وعبر الحدود',
        icon: Plane,
        color: '#06B6D4',
        route: '/travel',
        description: 'Travel mode, currency, budget planning',
        descriptionAr: 'وضع السفر، العملة، تخطيط الميزانية',
      },
    ],
  },
  {
    id: 'finance',
    title: 'Advanced Finance',
    titleAr: 'التمويل المتقدم',
    items: [
      {
        id: 'advanced-finance',
        title: 'Advanced Finance',
        titleAr: 'التمويل المتقدم',
        icon: TrendingUp,
        color: '#8B5CF6',
        route: '/advanced-finance',
        description: 'Credit score, tax helper, micro-loans',
        descriptionAr: 'النقاط الائتمانية، مساعد الضرائب، القروض الصغيرة',
      },
    ],
  },
  {
    id: 'work',
    title: 'Work & Productivity',
    titleAr: 'العمل والإنتاجية',
    items: [
      {
        id: 'jobs-income',
        title: 'Jobs & Income',
        titleAr: 'الوظائف والدخل',
        icon: Briefcase,
        color: '#3B82F6',
        route: '/jobs-income',
        description: 'Job opportunities and income tracking',
        descriptionAr: 'الفرص الوظيفية وتتبع الدخل',
      },
      {
        id: 'work-productivity',
        title: 'Work & Productivity',
        titleAr: 'العمل والإنتاجية',
        icon: Laptop,
        color: '#3B82F6',
        route: '/work-productivity',
        description: 'Freelancer tools, upskilling, career coach',
        descriptionAr: 'أدوات العمل الحر، تطوير المهارات، مدرب المهنة',
      },
    ],
  },
  {
    id: 'utilities',
    title: 'Utilities & Services',
    titleAr: 'المرافق والخدمات',
    items: [
      {
        id: 'utilities',
        title: 'Utilities',
        titleAr: 'المرافق',
        icon: Zap,
        color: '#F59E0B',
        route: '/utilities',
        description: 'Electricity, water, gas management',
        descriptionAr: 'إدارة الكهرباء والماء والغاز',
      },
      {
        id: 'bills',
        title: 'Bills',
        titleAr: 'الفواتير',
        icon: Receipt,
        color: '#8B5CF6',
        route: '/bills',
        description: 'Bill tracking and payments',
        descriptionAr: 'تتبع ودفع الفواتير',
      },
      {
        id: 'transport',
        title: 'Transport',
        titleAr: 'النقل',
        icon: Car,
        color: '#F59E0B',
        route: '/transport',
        description: 'Transportation and mobility',
        descriptionAr: 'النقل والتنقل',
      },
    ],
  },
  {
    id: 'health-education',
    title: 'Health & Education',
    titleAr: 'الصحة والتعليم',
    items: [
      {
        id: 'health',
        title: 'Health',
        titleAr: 'الصحة',
        icon: Heart,
        color: '#EF4444',
        route: '/health',
        description: 'Health tracking and wellness',
        descriptionAr: 'تتبع الصحة والعافية',
      },
      {
        id: 'education',
        title: 'Education',
        titleAr: 'التعليم',
        icon: GraduationCap,
        color: '#3B82F6',
        route: '/education',
        description: 'Learning and skill development',
        descriptionAr: 'التعلم وتطوير المهارات',
      },
    ],
  },
  {
    id: 'community',
    title: 'Community & Environment',
    titleAr: 'المجتمع والبيئة',
    items: [
      {
        id: 'community',
        title: 'Community',
        titleAr: 'المجتمع',
        icon: Users,
        color: '#06B6D4',
        route: '/community',
        description: 'Social features and neighborhood market',
        descriptionAr: 'الميزات الاجتماعية وسوق الحي',
      },
      {
        id: 'carbon-wallet',
        title: 'Carbon Wallet',
        titleAr: 'محفظة الكربون',
        icon: Leaf,
        color: '#10B981',
        route: '/carbon-wallet',
        description: 'Environmental impact tracking',
        descriptionAr: 'تتبع الأثر البيئي',
      },
      {
        id: 'housing',
        title: 'Housing',
        titleAr: 'الإسكان',
        icon: Building,
        color: '#10B981',
        route: '/housing',
        description: 'Housing assistance and management',
        descriptionAr: 'مساعدة وإدارة الإسكان',
      },
    ],
  },
  {
    id: 'gamification',
    title: 'Gamification & AI',
    titleAr: 'التحفيز والذكاء الاصطناعي',
    items: [
      {
        id: 'gamification',
        title: 'Gamification',
        titleAr: 'التحفيز',
        icon: Trophy,
        color: '#F59E0B',
        route: '/gamification',
        description: 'Family missions, savings adventure, rewards',
        descriptionAr: 'مهام العائلة، مغامرة الادخار، المكافآت',
      },
      {
        id: 'ai-power',
        title: 'AI Power Features',
        titleAr: 'ميزات قوة الذكاء الاصطناعي',
        icon: Sparkles,
        color: '#EC4899',
        route: '/ai-power',
        description: 'AI negotiator, scenario simulator, voice AI',
        descriptionAr: 'مفاوض الذكاء الاصطناعي، محاكي السيناريو، الصوت الذكي',
      },
    ],
  },
];

export default function MoreScreen() {
  const { userData, toggleLanguage, theme, logout, authUser } = useApp();
  const isArabic = userData.language === 'ar';
  const userRole = authUser?.role || 'individual';
  
  const handleLogout = async () => {
    await logout();
  };

  const renderFeatureItem = (item: FeatureItem) => {
    const IconComponent = item.icon;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.featureItem, { borderBottomColor: theme.border }]}
        onPress={() => router.push(item.route as any)}
        testID={`feature-${item.id}`}
      >
        <View style={styles.featureItemLeft}>
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <IconComponent size={20} color="white" />
          </View>
          <View style={styles.featureItemContent}>
            <Text style={[styles.featureItemTitle, { color: theme.text }]}>
              {isArabic ? item.titleAr : item.title}
            </Text>
            {(item.description || item.descriptionAr) && (
              <Text style={[styles.featureItemDescription, { color: theme.textSecondary }]}>
                {isArabic ? item.descriptionAr : item.description}
              </Text>
            )}
          </View>
        </View>
        <ChevronRight size={20} color={theme.textTertiary} />
      </TouchableOpacity>
    );
  };

  const renderCategory = (category: FeatureCategory) => (
    <View key={category.id} style={styles.category}>
      <Text style={[styles.categoryTitle, { color: theme.text }]}>
        {isArabic ? category.titleAr : category.title}
      </Text>
      <View style={[styles.categoryItems, { backgroundColor: theme.card }]}>
        {category.items.map(renderFeatureItem)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {isArabic ? 'المزيد' : 'More Features'}
          </Text>
          <TouchableOpacity onPress={toggleLanguage} style={[styles.languageButton, { backgroundColor: theme.surface }]}>
            <Text style={[styles.languageText, { color: theme.text }]}>
              {isArabic ? 'EN' : 'عربي'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.content}>
          {featureCategories.map(renderCategory)}
        </View>

        {/* Account Section */}
        <View style={styles.category}>
          <Text style={[styles.categoryTitle, { color: theme.text }]}>
            {isArabic ? 'الحساب' : 'Account'}
          </Text>
          <View style={[styles.categoryItems, { backgroundColor: theme.card }]}>
            <View style={[styles.featureItem, { borderBottomColor: theme.border }]}>
              <View style={styles.featureItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
                  <User size={20} color="white" />
                </View>
                <View style={styles.featureItemContent}>
                  <Text style={[styles.featureItemTitle, { color: theme.text }]}>
                    {authUser?.name || 'User'}
                  </Text>
                  <Text style={[styles.featureItemDescription, { color: theme.textSecondary }]}>
                    {userRole === 'business' 
                      ? (isArabic ? 'حساب تجاري' : 'Business Account')
                      : userRole === 'family'
                      ? (isArabic ? 'حساب عائلي' : 'Family Account')
                      : (isArabic ? 'حساب فردي' : 'Individual Account')
                    }
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.featureItem, { borderBottomWidth: 0 }]}
              onPress={handleLogout}
            >
              <View style={styles.featureItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.danger }]}>
                  <LogOut size={20} color="white" />
                </View>
                <View style={styles.featureItemContent}>
                  <Text style={[styles.featureItemTitle, { color: theme.danger }]}>
                    {isArabic ? 'تسجيل الخروج' : 'Logout'}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={theme.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appInfoTitle, { color: theme.primary }]}>Tamween</Text>
          <Text style={[styles.appInfoSubtitle, { color: theme.textSecondary }]}>
            {isArabic
              ? 'تطبيق شامل لإدارة الدعم والمدخرات'
              : 'Comprehensive subsidy and savings management app'}
          </Text>
          <Text style={[styles.appVersion, { color: theme.textTertiary }]}>Version 1.0.0</Text>
        </View>
      </ScrollView>
      
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  category: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryItems: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  featureItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureItemContent: {
    flex: 1,
  },
  featureItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  featureItemDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
    marginTop: 20,
  },
  appInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appInfoSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  appVersion: {
    fontSize: 12,
  },
});