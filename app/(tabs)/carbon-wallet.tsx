import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions
} from 'react-native';
import {
  Leaf,
  Award,
  Recycle,
  Car,
  Zap,
  ShoppingBag,
  TrendingUp,
  Gift
} from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';

const { width } = Dimensions.get('window');

interface EcoBadge {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  requirement: number;
  earned: boolean;
  progress: number;
}

interface CarbonActivity {
  id: string;
  type: 'transport' | 'energy' | 'recycling' | 'shopping';
  description: string;
  descriptionAr: string;
  carbonSaved: number;
  date: string;
  reward?: number;
}

const ecoBadges: EcoBadge[] = [
  {
    id: '1',
    name: 'Green Commuter',
    nameAr: 'المتنقل الأخضر',
    description: 'Use public transport 20 times',
    descriptionAr: 'استخدم المواصلات العامة 20 مرة',
    icon: 'car',
    requirement: 20,
    earned: true,
    progress: 20
  },
  {
    id: '2',
    name: 'Energy Saver',
    nameAr: 'موفر الطاقة',
    description: 'Reduce electricity usage by 15%',
    descriptionAr: 'قلل استهلاك الكهرباء بنسبة 15%',
    icon: 'zap',
    requirement: 15,
    earned: false,
    progress: 12
  },
  {
    id: '3',
    name: 'Recycling Hero',
    nameAr: 'بطل إعادة التدوير',
    description: 'Recycle 50 items',
    descriptionAr: 'أعد تدوير 50 عنصر',
    icon: 'recycle',
    requirement: 50,
    earned: false,
    progress: 32
  }
];

const carbonActivities: CarbonActivity[] = [
  {
    id: '1',
    type: 'transport',
    description: 'Used bus instead of car',
    descriptionAr: 'استخدمت الحافلة بدلاً من السيارة',
    carbonSaved: 2.3,
    date: '2024-01-15',
    reward: 0.5
  },
  {
    id: '2',
    type: 'energy',
    description: 'Reduced AC usage during peak hours',
    descriptionAr: 'قللت استخدام المكيف في ساعات الذروة',
    carbonSaved: 1.8,
    date: '2024-01-14'
  },
  {
    id: '3',
    type: 'recycling',
    description: 'Recycled plastic bottles',
    descriptionAr: 'أعدت تدوير زجاجات البلاستيك',
    carbonSaved: 0.5,
    date: '2024-01-13',
    reward: 0.2
  }
];

export default function CarbonWalletScreen() {
  const { userData, theme } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'activities'>('overview');
  const isArabic = userData.language === 'ar';

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'transport': return <Car size={20} color="#10B981" />;
      case 'energy': return <Zap size={20} color="#F59E0B" />;
      case 'recycling': return <Recycle size={20} color="#3B82F6" />;
      case 'shopping': return <ShoppingBag size={20} color="#8B5CF6" />;
      default: return <Leaf size={20} color="#10B981" />;
    }
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'car': return <Car size={24} color="#10B981" />;
      case 'zap': return <Zap size={24} color="#F59E0B" />;
      case 'recycle': return <Recycle size={24} color="#3B82F6" />;
      default: return <Award size={24} color="#10B981" />;
    }
  };

  const renderOverview = () => (
    <View>
      {/* Carbon Savings Card */}
      <View style={styles.carbonCard}>
        <View style={styles.carbonHeader}>
          <Leaf size={32} color="#10B981" />
          <View style={styles.carbonStats}>
            <Text style={styles.carbonAmount}>{userData.carbonSaved} kg</Text>
            <Text style={styles.carbonLabel}>
              {isArabic ? 'الكربون المحفوظ' : 'CO₂ Saved'}
            </Text>
          </View>
        </View>
        <View style={styles.carbonProgress}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '68%' }]} />
          </View>
          <Text style={styles.progressText}>
            {isArabic ? '68% من هدف الشهر' : '68% of monthly goal'}
          </Text>
        </View>
      </View>

      {/* Eco Rewards */}
      <View style={styles.rewardsCard}>
        <View style={styles.cardHeader}>
          <Gift size={24} color="#F59E0B" />
          <Text style={styles.cardTitle}>
            {isArabic ? 'مكافآت بيئية' : 'Eco Rewards'}
          </Text>
        </View>
        <View style={styles.rewardsList}>
          <View style={styles.rewardItem}>
            <Text style={styles.rewardAmount}>BD 12.50</Text>
            <Text style={styles.rewardLabel}>
              {isArabic ? 'خصومات المنتجات الخضراء' : 'Green Product Discounts'}
            </Text>
          </View>
          <View style={styles.rewardItem}>
            <Text style={styles.rewardAmount}>BD 8.20</Text>
            <Text style={styles.rewardLabel}>
              {isArabic ? 'مكافآت إعادة التدوير' : 'Recycling Rewards'}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Recycle size={24} color="#3B82F6" />
          <Text style={styles.actionText}>
            {isArabic ? 'مراكز إعادة التدوير' : 'Recycling Centers'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <TrendingUp size={24} color="#10B981" />
          <Text style={styles.actionText}>
            {isArabic ? 'نصائح توفير الطاقة' : 'Energy Tips'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBadges = () => (
    <View style={styles.badgesContainer}>
      {ecoBadges.map((badge) => (
        <View key={badge.id} style={[styles.badgeCard, badge.earned && styles.earnedBadge]}>
          <View style={styles.badgeHeader}>
            {getBadgeIcon(badge.icon)}
            <View style={styles.badgeInfo}>
              <Text style={styles.badgeName}>
                {isArabic ? badge.nameAr : badge.name}
              </Text>
              <Text style={styles.badgeDescription}>
                {isArabic ? badge.descriptionAr : badge.description}
              </Text>
            </View>
            {badge.earned && (
              <Award size={20} color="#F59E0B" />
            )}
          </View>
          <View style={styles.badgeProgress}>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: `${(badge.progress / badge.requirement) * 100}%` }
              ]} />
            </View>
            <Text style={styles.progressText}>
              {badge.progress}/{badge.requirement}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderActivities = () => (
    <View style={styles.activitiesContainer}>
      {carbonActivities.map((activity) => (
        <View key={activity.id} style={styles.activityCard}>
          <View style={styles.activityHeader}>
            {getActivityIcon(activity.type)}
            <View style={styles.activityInfo}>
              <Text style={styles.activityDescription}>
                {isArabic ? activity.descriptionAr : activity.description}
              </Text>
              <Text style={styles.activityDate}>{activity.date}</Text>
            </View>
            <View style={styles.activityStats}>
              <Text style={styles.carbonSaved}>-{activity.carbonSaved} kg CO₂</Text>
              {activity.reward && (
                <Text style={styles.rewardEarned}>+BD {activity.reward}</Text>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
    },
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      backgroundColor: theme.surfaceSecondary,
      marginHorizontal: 4,
      borderRadius: 8,
    },
    activeTab: {
      backgroundColor: theme.primary,
    },
    tabText: {
      fontSize: 14,
      color: theme.textTertiary,
      fontWeight: '500',
    },
    activeTabText: {
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    carbonCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
    },
    carbonHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    carbonStats: {
      marginLeft: 16,
    },
    carbonAmount: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#10B981',
    },
    carbonLabel: {
      fontSize: 14,
      color: theme.textTertiary,
    },
    carbonProgress: {
      marginTop: 16,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.surfaceSecondary,
      borderRadius: 4,
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#10B981',
      borderRadius: 4,
    },
    progressText: {
      fontSize: 12,
      color: theme.textTertiary,
      textAlign: 'center',
    },
    rewardsCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginLeft: 12,
    },
    rewardsList: {
      gap: 12,
    },
    rewardItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    rewardAmount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#F59E0B',
    },
    rewardLabel: {
      fontSize: 14,
      color: theme.textTertiary,
      flex: 1,
      textAlign: 'right',
      marginLeft: 12,
    },
    quickActions: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
    actionButton: {
      flex: 1,
      backgroundColor: theme.surfaceSecondary,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
    },
    actionText: {
      fontSize: 12,
      color: theme.text,
      marginTop: 8,
      textAlign: 'center',
      fontWeight: '500',
    },
    badgesContainer: {
      gap: 16,
    },
    badgeCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 2,
      borderColor: theme.surfaceSecondary,
    },
    earnedBadge: {
      borderColor: '#10B981',
    },
    badgeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    badgeInfo: {
      flex: 1,
      marginLeft: 12,
    },
    badgeName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    badgeDescription: {
      fontSize: 14,
      color: theme.textTertiary,
    },
    badgeProgress: {
      marginTop: 12,
    },
    activitiesContainer: {
      gap: 12,
    },
    activityCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
    },
    activityHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    activityInfo: {
      flex: 1,
      marginLeft: 12,
    },
    activityDescription: {
      fontSize: 14,
      color: theme.text,
      marginBottom: 4,
    },
    activityDate: {
      fontSize: 12,
      color: theme.textTertiary,
    },
    activityStats: {
      alignItems: 'flex-end',
    },
    carbonSaved: {
      fontSize: 14,
      fontWeight: '600',
      color: '#10B981',
    },
    rewardEarned: {
      fontSize: 12,
      color: '#F59E0B',
      marginTop: 2,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isArabic ? 'المحفظة البيئية' : 'Carbon Wallet'}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            {isArabic ? 'نظرة عامة' : 'Overview'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'badges' && styles.activeTab]}
          onPress={() => setActiveTab('badges')}
        >
          <Text style={[styles.tabText, activeTab === 'badges' && styles.activeTabText]}>
            {isArabic ? 'الشارات' : 'Badges'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'activities' && styles.activeTab]}
          onPress={() => setActiveTab('activities')}
        >
          <Text style={[styles.tabText, activeTab === 'activities' && styles.activeTabText]}>
            {isArabic ? 'الأنشطة' : 'Activities'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'badges' && renderBadges()}
        {activeTab === 'activities' && renderActivities()}
      </ScrollView>
    </SafeAreaView>
  );
}