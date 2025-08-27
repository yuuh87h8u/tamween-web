import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Globe,
  Moon,
  Smartphone,
} from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';
import { VoiceAssistantWrapper } from '@/components/VoiceAssistantWrapper';
import { BackendTest } from '@/components/BackendTest';

export default function ProfileScreen() {
  const { userData, toggleLanguage, theme, toggleTheme } = useApp();
  const isArabic = userData.language === 'ar';

  const profileOptions = [
    {
      icon: <Settings size={20} color={theme.textSecondary} />,
      title: isArabic ? 'الإعدادات' : 'Settings',
      subtitle: isArabic ? 'إدارة تفضيلاتك' : 'Manage your preferences',
    },
    {
      icon: <Bell size={20} color={theme.textSecondary} />,
      title: isArabic ? 'الإشعارات' : 'Notifications',
      subtitle: isArabic ? 'تخصيص التنبيهات' : 'Customize alerts',
    },
    {
      icon: <Shield size={20} color={theme.textSecondary} />,
      title: isArabic ? 'الخصوصية والأمان' : 'Privacy & Security',
      subtitle: isArabic ? 'إدارة بياناتك' : 'Manage your data',
    },
    {
      icon: <Globe size={20} color={theme.textSecondary} />,
      title: isArabic ? 'اللغة' : 'Language',
      subtitle: isArabic ? 'English' : 'العربية',
      onPress: toggleLanguage,
    },
    {
      icon: <Moon size={20} color={theme.textSecondary} />,
      title: isArabic ? 'المظهر' : 'Theme',
      subtitle: userData.theme === 'light' ? (isArabic ? 'فاتح' : 'Light') : (isArabic ? 'داكن' : 'Dark'),
      onPress: toggleTheme,
    },
    {
      icon: <HelpCircle size={20} color={theme.textSecondary} />,
      title: isArabic ? 'المساعدة والدعم' : 'Help & Support',
      subtitle: isArabic ? 'احصل على المساعدة' : 'Get assistance',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: isArabic ? 'الملف الشخصي' : 'Profile',
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: theme.card }]}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.surface }]}>
            <User size={40} color={theme.text} />
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>
            {userData.name || (isArabic ? 'المستخدم' : 'User')}
          </Text>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
            {userData.email || 'user@tamween.bh'}
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.statValue, { color: theme.primary }]}>BD {userData.lifetimeSavings || 2450}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {isArabic ? 'إجمالي المدخرات' : 'Total Savings'}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.statValue, { color: theme.primary }]}>{userData.financialHealthScore || 85}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {isArabic ? 'النقاط الصحية' : 'Health Score'}
            </Text>
          </View>
        </View>

        {/* Profile Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {isArabic ? 'إعدادات الحساب' : 'Account Settings'}
          </Text>
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.optionItem, { backgroundColor: theme.card }]}
              onPress={option.onPress}
            >
              <View style={[styles.optionIcon, { backgroundColor: theme.surface }]}>{option.icon}</View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: theme.text }]}>{option.title}</Text>
                <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>{option.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Backend Test - Development Only */}
        {__DEV__ && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isArabic ? 'اختبار الخادم' : 'Backend Test'}
            </Text>
            <BackendTest />
          </View>
        )}

        {/* App Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {isArabic ? 'معلومات التطبيق' : 'App Information'}
          </Text>
          <View style={[styles.appInfo, { backgroundColor: theme.card }]}>
            <Text style={[styles.appName, { color: theme.primary }]}>Tamween</Text>
            <Text style={[styles.appVersion, { color: theme.textSecondary }]}>
              {isArabic ? 'الإصدار 1.0.0' : 'Version 1.0.0'}
            </Text>
            <Text style={[styles.appDescription, { color: theme.text }]}>
              {isArabic
                ? 'تطبيق تتبع الدعم والمساعد المالي الذكي لمملكة البحرين'
                : 'Subsidy tracker and smart financial assistant for Bahrain'}
            </Text>
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={[styles.signOutButton, { backgroundColor: theme.card, borderColor: '#EF4444' }]}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.signOutText}>
            {isArabic ? 'تسجيل الخروج' : 'Sign Out'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
  },
  appInfo: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 32,
    borderWidth: 1,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
});