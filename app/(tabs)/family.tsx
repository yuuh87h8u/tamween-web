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
import { Users, Trophy, Target, Calculator, Award } from 'lucide-react-native';
import { familyMembers, challenges } from '@/constants/mockData';
import { useApp } from '@/hooks/useAppStore';

export default function FamilyScreen() {
  const { userData, theme } = useApp();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'challenges' | 'leaderboard' | 'zakat'>('overview');
  const isArabic = userData.language === 'ar';

  const tabs = [
    { key: 'overview', label: isArabic ? 'نظرة عامة' : 'Overview', icon: Users },
    { key: 'challenges', label: isArabic ? 'التحديات' : 'Challenges', icon: Target },
    { key: 'leaderboard', label: isArabic ? 'المتصدرين' : 'Leaderboard', icon: Trophy },
    { key: 'zakat', label: isArabic ? 'الزكاة' : 'Zakat', icon: Calculator },
  ];

  const badges = [
    { name: 'Water Hero', nameAr: 'بطل المياه', icon: '💧', color: '#06B6D4' },
    { name: 'Budget Master', nameAr: 'خبير الميزانية', icon: '💰', color: '#10B981' },
    { name: 'Eco Warrior', nameAr: 'محارب البيئة', icon: '🌱', color: '#22C55E' },
    { name: 'Deal Hunter', nameAr: 'صياد العروض', icon: '🎯', color: '#F59E0B' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{ 
          title: isArabic ? 'العائلة والمجتمع' : 'Family & Community',
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
        {selectedTab === 'overview' && (
          <>
            {/* Family Balance */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {isArabic ? 'رصيد العائلة' : 'Family Balance'}
              </Text>
              <View style={[styles.balanceCard, { backgroundColor: theme.card }]}>
                <View style={styles.balanceHeader}>
                  <View style={styles.familyAvatars}>
                    {familyMembers.slice(0, 3).map((member, index) => (
                      <Image
                        key={member.id}
                        source={{ uri: member.avatar }}
                        style={[styles.avatar, { marginLeft: index > 0 ? -10 : 0 }]}
                      />
                    ))}
                  </View>
                  <View style={styles.balanceInfo}>
                    <Text style={[styles.balanceAmount, { color: theme.primary }]}>BD 445</Text>
                    <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>
                      {isArabic ? 'إجمالي المدخرات' : 'Total Savings'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Family Members */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {isArabic ? 'أفراد العائلة' : 'Family Members'}
              </Text>
              {familyMembers.map((member) => (
                <View key={member.id} style={[styles.memberCard, { backgroundColor: theme.card }]}>
                  <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                  <View style={styles.memberInfo}>
                    <Text style={[styles.memberName, { color: theme.text }]}>{member.name}</Text>
                    <Text style={[styles.memberSavings, { color: theme.primary }]}>
                      {isArabic ? 'وفر' : 'Saved'} BD {member.savings}
                    </Text>
                  </View>
                  <View style={styles.memberBadges}>
                    {member.badges.slice(0, 2).map((badge, index) => (
                      <View key={index} style={[styles.badgeSmall, { backgroundColor: theme.surface }]}>
                        <Text style={styles.badgeSmallText}>
                          {badges.find(b => b.name === badge)?.icon}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            {/* Current Challenge */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {isArabic ? 'التحدي الحالي' : 'Current Challenge'}
              </Text>
              <View style={[styles.challengeCard, { backgroundColor: theme.card }]}>
                <View style={styles.challengeHeader}>
                  <Text style={[styles.challengeTitle, { color: theme.text }]}>
                    {isArabic ? challenges[0].titleAr : challenges[0].title}
                  </Text>
                  <Text style={[styles.challengeReward, { color: theme.primary }]}>{challenges[0].reward}</Text>
                </View>
                <Text style={[styles.challengeDescription, { color: theme.textSecondary }]}>
                  {isArabic ? challenges[0].descriptionAr : challenges[0].description}
                </Text>
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${(challenges[0].current / challenges[0].target) * 100}%`,
                          backgroundColor: theme.primary
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                    {challenges[0].current}/{challenges[0].target}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {selectedTab === 'challenges' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isArabic ? 'التحديات النشطة' : 'Active Challenges'}
            </Text>
            {challenges.map((challenge) => (
              <View key={challenge.id} style={[styles.challengeCard, { backgroundColor: theme.card }]}>
                <View style={styles.challengeHeader}>
                  <Text style={[styles.challengeTitle, { color: theme.text }]}>
                    {isArabic ? challenge.titleAr : challenge.title}
                  </Text>
                  <Text style={[styles.challengeReward, { color: theme.primary }]}>{challenge.reward}</Text>
                </View>
                <Text style={[styles.challengeDescription, { color: theme.textSecondary }]}>
                  {isArabic ? challenge.descriptionAr : challenge.description}
                </Text>
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${(challenge.current / challenge.target) * 100}%`,
                          backgroundColor: theme.primary
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                    {challenge.current}/{challenge.target}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'leaderboard' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isArabic ? 'متصدري هذا الشهر' : 'This Month\'s Leaders'}
            </Text>
            {familyMembers
              .sort((a, b) => b.savings - a.savings)
              .map((member, index) => (
                <View key={member.id} style={[styles.leaderboardItem, { backgroundColor: theme.card }]}>
                  <View style={styles.rankContainer}>
                    <Text style={[styles.rank, { color: theme.text }]}>#{index + 1}</Text>
                    {index === 0 && <Trophy size={16} color="#F59E0B" />}
                  </View>
                  <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                  <View style={styles.memberInfo}>
                    <Text style={[styles.memberName, { color: theme.text }]}>{member.name}</Text>
                    <Text style={[styles.memberSavings, { color: theme.primary }]}>BD {member.savings}</Text>
                  </View>
                  <View style={styles.memberBadges}>
                    {member.badges.slice(0, 2).map((badge, badgeIndex) => (
                      <View key={badgeIndex} style={[styles.badgeSmall, { backgroundColor: theme.surface }]}>
                        <Text style={styles.badgeSmallText}>
                          {badges.find(b => b.name === badge)?.icon}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
          </View>
        )}

        {selectedTab === 'zakat' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isArabic ? 'حاسبة الزكاة' : 'Zakat Calculator'}
            </Text>
            <View style={[styles.zakatCard, { backgroundColor: theme.card }]}>
              <View style={styles.zakatHeader}>
                <Calculator size={24} color="#10B981" />
                <Text style={[styles.zakatTitle, { color: theme.text }]}>
                  {isArabic ? 'احسب زكاتك' : 'Calculate Your Zakat'}
                </Text>
              </View>
              <Text style={[styles.zakatDescription, { color: theme.textSecondary }]}>
                {isArabic ? 
                  'احسب زكاة أموالك بناءً على المدخرات والاستثمارات' :
                  'Calculate your zakat based on savings and investments'
                }
              </Text>
              <View style={styles.zakatAmount}>
                <Text style={[styles.zakatValue, { color: theme.primary }]}>BD 22.25</Text>
                <Text style={[styles.zakatLabel, { color: theme.textSecondary }]}>
                  {isArabic ? 'الزكاة المستحقة' : 'Zakat Due'}
                </Text>
              </View>
              <TouchableOpacity style={[styles.calculateButton, { backgroundColor: theme.primary }]}>
                <Text style={styles.calculateText}>
                  {isArabic ? 'احسب مرة أخرى' : 'Recalculate'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Badges */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {isArabic ? 'الشارات المتاحة' : 'Available Badges'}
              </Text>
              <View style={styles.badgesGrid}>
                {badges.map((badge, index) => (
                  <View key={index} style={[styles.badgeCard, { backgroundColor: theme.card }]}>
                    <Text style={styles.badgeIcon}>{badge.icon}</Text>
                    <Text style={[styles.badgeName, { color: theme.text }]}>
                      {isArabic ? badge.nameAr : badge.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
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
  balanceCard: {
    borderRadius: 16,
    padding: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  familyAvatars: {
    flexDirection: 'row',
    marginRight: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#111827',
  },
  balanceInfo: {
    flex: 1,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  balanceLabel: {
    fontSize: 14,
  },
  memberCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
  },
  memberSavings: {
    fontSize: 14,
    fontWeight: '500',
  },
  memberBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  badgeSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeSmallText: {
    fontSize: 12,
  },
  challengeCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  challengeReward: {
    fontSize: 12,
    fontWeight: '500',
  },
  challengeDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    minWidth: 40,
  },
  leaderboardItem: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    minWidth: 40,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  zakatCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  zakatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  zakatTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  zakatDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  zakatAmount: {
    alignItems: 'center',
    marginBottom: 20,
  },
  zakatValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  zakatLabel: {
    fontSize: 14,
  },
  calculateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  calculateText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});