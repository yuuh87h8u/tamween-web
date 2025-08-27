import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Users, 
  Building2, 
  ArrowRight,
  Shield
} from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';

export default function LoginSelection() {
  const { theme, userData } = useApp();
  const isArabic = userData.language === 'ar';

  const loginTypes = [
    {
      id: 'individual',
      title: isArabic ? 'حساب فردي' : 'Individual Account',
      subtitle: isArabic ? 'للمواطنين والمقيمين' : 'For Citizens & Residents',
      description: isArabic 
        ? 'إدارة الأموال الشخصية، الدعم الحكومي، والمدخرات'
        : 'Manage personal finances, subsidies, and savings',
      icon: User,
      color: '#4F46E5',
      gradient: ['#4F46E5', '#7C3AED'],
      features: isArabic 
        ? ['الدعم الحكومي', 'البنوك الشخصية', 'التسوق الذكي', 'المساعد الذكي']
        : ['Government Subsidies', 'Personal Banking', 'Smart Shopping', 'AI Assistant']
    },
    {
      id: 'family',
      title: isArabic ? 'حساب عائلي' : 'Family Account',
      subtitle: isArabic ? 'للعائلات والأسر' : 'For Households & Families',
      description: isArabic 
        ? 'إدارة مالية عائلية مع حسابات فرعية للأطفال'
        : 'Family financial management with sub-accounts',
      icon: Users,
      color: '#059669',
      gradient: ['#059669', '#0D9488'],
      features: isArabic 
        ? ['إدارة العائلة', 'مصروف الأطفال', 'التحديات العائلية', 'المدخرات المشتركة']
        : ['Family Management', 'Kids Allowance', 'Family Challenges', 'Shared Savings']
    },
    {
      id: 'business',
      title: isArabic ? 'حساب تجاري' : 'Business Account',
      subtitle: isArabic ? 'للشركات والمؤسسات' : 'For Businesses & Institutions',
      description: isArabic 
        ? 'للبنوك، المتاجر، الشركات، والمؤسسات الحكومية'
        : 'For banks, stores, companies, and government institutions',
      icon: Building2,
      color: '#DC2626',
      gradient: ['#DC2626', '#EA580C'],
      features: isArabic 
        ? ['لوحة الأعمال', 'العروض والخصومات', 'التكامل المصرفي', 'التحليلات']
        : ['Business Dashboard', 'Offers & Deals', 'Banking Integration', 'Analytics']
    }
  ];

  const handleLoginTypeSelect = (type: string) => {
    router.push(`/login?type=${type}` as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            {isArabic ? 'مرحباً بك في تموين' : 'Welcome to Tamween'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {isArabic 
              ? 'اختر نوع الحساب المناسب لك'
              : 'Choose your account type to get started'
            }
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {loginTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <TouchableOpacity
                key={type.id}
                style={[styles.card, { backgroundColor: theme.surface }]}
                onPress={() => handleLoginTypeSelect(type.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={type.gradient as [string, string]}
                  style={styles.iconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <IconComponent size={32} color="white" />
                </LinearGradient>

                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={styles.titleContainer}>
                      <Text style={[styles.cardTitle, { color: theme.text }]}>
                        {type.title}
                      </Text>
                      <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                        {type.subtitle}
                      </Text>
                    </View>
                    <ArrowRight size={20} color={theme.textTertiary} />
                  </View>

                  <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
                    {type.description}
                  </Text>

                  <View style={styles.featuresContainer}>
                    {type.features.map((feature, index) => (
                      <View key={index} style={[styles.featureTag, { backgroundColor: theme.surfaceSecondary }]}>
                        <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <View style={[styles.securityBadge, { backgroundColor: theme.surface }]}>
            <Shield size={16} color={theme.primary} />
            <Text style={[styles.securityText, { color: theme.textSecondary }]}>
              {isArabic ? 'محمي بأعلى معايير الأمان' : 'Protected with highest security standards'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  cardsContainer: {
    gap: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  securityText: {
    fontSize: 13,
    fontWeight: '500',
  },
});