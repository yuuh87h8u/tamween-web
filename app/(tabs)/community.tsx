import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput
} from 'react-native';
import {
  Globe,
  Users,
  Trophy,
  Heart,
  Vote,
  BarChart3,
  MessageSquare,
  Gift,
  Calendar,
  TrendingUp,
  Shield,
  Plus
} from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';

interface FriendCircle {
  id: string;
  name: string;
  members: number;
  totalSavings: number;
  currentChallenge: string;
  rank: number;
}

interface CharityPool {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  targetAmount: number;
  currentAmount: number;
  participants: number;
  endDate: string;
  category: string;
}

interface GovernmentStats {
  totalSubsidySpend: number;
  wasteReduced: number;
  citizensHelped: number;
  lastUpdated: string;
}

interface SubsidyIdea {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  votes: number;
  userVoted: boolean;
  category: string;
  author: string;
}

interface SeasonalChallenge {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  participants: number;
  reward: string;
  endDate: string;
  progress: number;
}

const friendCircles: FriendCircle[] = [
  {
    id: '1',
    name: 'Green Warriors',
    members: 8,
    totalSavings: 1250,
    currentChallenge: 'Reduce electricity by 20%',
    rank: 2
  },
  {
    id: '2',
    name: 'Eco Savers',
    members: 12,
    totalSavings: 2100,
    currentChallenge: 'Water conservation challenge',
    rank: 1
  }
];

const charityPools: CharityPool[] = [
  {
    id: '1',
    name: 'Ramadan Food Packages',
    nameAr: 'طرود رمضان الغذائية',
    description: 'Provide food packages for families in need during Ramadan',
    descriptionAr: 'توفير طرود غذائية للعائلات المحتاجة خلال شهر رمضان',
    targetAmount: 5000,
    currentAmount: 3250,
    participants: 127,
    endDate: '2024-03-15',
    category: 'Food Aid'
  }
];

const governmentStats: GovernmentStats = {
  totalSubsidySpend: 125000000,
  wasteReduced: 15000,
  citizensHelped: 450000,
  lastUpdated: '2024-01-15'
};

const subsidyIdeas: SubsidyIdea[] = [
  {
    id: '1',
    title: 'Solar Panel Subsidies',
    titleAr: 'دعم الألواح الشمسية',
    description: 'Provide subsidies for residential solar panel installation',
    descriptionAr: 'توفير دعم لتركيب الألواح الشمسية في المنازل',
    votes: 234,
    userVoted: false,
    category: 'Energy',
    author: 'Ahmed Al-Mansoori'
  }
];

const seasonalChallenges: SeasonalChallenge[] = [
  {
    id: '1',
    title: 'Ramadan Waste Reduction',
    titleAr: 'تقليل النفايات في رمضان',
    description: 'Reduce food waste during Ramadan by 30%',
    descriptionAr: 'تقليل هدر الطعام خلال شهر رمضان بنسبة 30%',
    participants: 2847,
    reward: 'BD 50 voucher + Special badge',
    endDate: '2024-04-10',
    progress: 68
  }
];

export default function CommunityScreen() {
  const { userData, theme } = useApp();
  const [activeTab, setActiveTab] = useState<'circles' | 'charity' | 'government' | 'challenges'>('circles');
  const [newIdeaText, setNewIdeaText] = useState('');
  const isArabic = userData.language === 'ar';

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
      marginHorizontal: 2,
      borderRadius: 8,
    },
    activeTab: {
      backgroundColor: theme.primary,
    },
    tabText: {
      fontSize: 12,
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
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#10B981',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      justifyContent: 'center',
      gap: 8,
    },
    createButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    circlesContainer: {
      gap: 16,
    },
    circleCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
    },
    circleHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    circleInfo: {
      flex: 1,
    },
    circleName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    circleMembers: {
      fontSize: 14,
      color: theme.textTertiary,
    },
    rankBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceSecondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      gap: 4,
    },
    rankText: {
      fontSize: 12,
      color: '#F59E0B',
      fontWeight: '600',
    },
    circleStats: {
      marginBottom: 12,
    },
    circleStat: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#10B981',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme.textTertiary,
    },
    currentChallenge: {
      backgroundColor: theme.surfaceSecondary,
      borderRadius: 8,
      padding: 12,
    },
    challengeLabel: {
      fontSize: 12,
      color: theme.textTertiary,
      marginBottom: 4,
    },
    challengeText: {
      fontSize: 14,
      color: theme.text,
      fontWeight: '500',
    },
    charityHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    charityHeaderText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginLeft: 12,
    },
    charityContainer: {
      gap: 16,
    },
    charityCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
    },
    charityInfo: {
      marginBottom: 16,
    },
    charityName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    charityDescription: {
      fontSize: 14,
      color: theme.textTertiary,
      marginBottom: 8,
    },
    charityCategory: {
      fontSize: 12,
      color: '#EF4444',
      fontWeight: '500',
    },
    charityProgress: {
      marginBottom: 16,
    },
    progressInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    progressAmount: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    progressParticipants: {
      fontSize: 12,
      color: theme.textTertiary,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.surfaceSecondary,
      borderRadius: 4,
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#EF4444',
      borderRadius: 4,
    },
    charityFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    endDate: {
      fontSize: 12,
      color: theme.textTertiary,
    },
    donateButton: {
      backgroundColor: '#EF4444',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    donateButtonText: {
      fontSize: 14,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    govStatsCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
    },
    govStatsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    govStatsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginLeft: 12,
    },
    govStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 16,
    },
    govStat: {
      alignItems: 'center',
    },
    govStatValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#3B82F6',
      marginBottom: 4,
    },
    govStatLabel: {
      fontSize: 12,
      color: theme.textTertiary,
      textAlign: 'center',
    },
    lastUpdated: {
      fontSize: 12,
      color: theme.textTertiary,
      textAlign: 'center',
    },
    votingSection: {
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 16,
    },
    newIdeaCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
    },
    newIdeaInput: {
      backgroundColor: theme.surfaceSecondary,
      borderRadius: 8,
      padding: 12,
      color: theme.text,
      fontSize: 14,
      minHeight: 80,
      textAlignVertical: 'top',
      marginBottom: 12,
    },
    submitButton: {
      backgroundColor: '#10B981',
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
    },
    submitButtonText: {
      fontSize: 14,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    ideasContainer: {
      gap: 16,
    },
    ideaCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
    },
    ideaHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    ideaInfo: {
      flex: 1,
    },
    ideaTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    ideaAuthor: {
      fontSize: 12,
      color: theme.textTertiary,
    },
    categoryBadge: {
      backgroundColor: theme.surfaceSecondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    categoryText: {
      fontSize: 10,
      color: theme.text,
      fontWeight: '500',
    },
    ideaDescription: {
      fontSize: 14,
      color: theme.textTertiary,
      marginBottom: 12,
    },
    ideaFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    voteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#10B981',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      gap: 4,
    },
    votedButton: {
      backgroundColor: '#10B981',
      borderColor: '#10B981',
    },
    voteButtonText: {
      fontSize: 12,
      color: '#10B981',
      fontWeight: '500',
    },
    votedButtonText: {
      color: '#FFFFFF',
    },
    challengesHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    challengesHeaderText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginLeft: 12,
    },
    challengesContainer: {
      gap: 16,
    },
    challengeCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
    },
    challengeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    challengeTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      flex: 1,
    },
    participantsBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceSecondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      gap: 4,
    },
    participantsText: {
      fontSize: 12,
      color: '#8B5CF6',
      fontWeight: '500',
    },
    challengeDescription: {
      fontSize: 14,
      color: theme.textTertiary,
      marginBottom: 16,
    },
    challengeProgress: {
      marginBottom: 16,
    },
    progressLabel: {
      fontSize: 14,
      color: theme.text,
      fontWeight: '500',
    },
    challengeReward: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 8,
    },
    rewardText: {
      fontSize: 14,
      color: '#F59E0B',
      fontWeight: '500',
    },
    joinButton: {
      backgroundColor: '#8B5CF6',
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
    },
    joinButtonText: {
      fontSize: 14,
      color: '#FFFFFF',
      fontWeight: '600',
    },
  });

  const handleVote = (ideaId: string) => {
    console.log('Voting for idea:', ideaId);
  };

  const renderCircles = () => (
    <View>
      <TouchableOpacity style={styles.createButton}>
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.createButtonText}>
          {isArabic ? 'إنشاء دائرة جديدة' : 'Create New Circle'}
        </Text>
      </TouchableOpacity>

      <View style={styles.circlesContainer}>
        {friendCircles.map((circle) => (
          <TouchableOpacity key={circle.id} style={styles.circleCard}>
            <View style={styles.circleHeader}>
              <View style={styles.circleInfo}>
                <Text style={styles.circleName}>{circle.name}</Text>
                <Text style={styles.circleMembers}>
                  {circle.members} {isArabic ? 'أعضاء' : 'members'}
                </Text>
              </View>
              <View style={styles.rankBadge}>
                <Trophy size={16} color="#F59E0B" />
                <Text style={styles.rankText}>#{circle.rank}</Text>
              </View>
            </View>
            
            <View style={styles.circleStats}>
              <View style={styles.circleStat}>
                <Text style={styles.statValue}>BD {circle.totalSavings}</Text>
                <Text style={styles.statLabel}>
                  {isArabic ? 'إجمالي التوفير' : 'Total Savings'}
                </Text>
              </View>
            </View>
            
            <View style={styles.currentChallenge}>
              <Text style={styles.challengeLabel}>
                {isArabic ? 'التحدي الحالي:' : 'Current Challenge:'}
              </Text>
              <Text style={styles.challengeText}>{circle.currentChallenge}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCharity = () => (
    <View>
      <View style={styles.charityHeader}>
        <Heart size={24} color="#EF4444" />
        <Text style={styles.charityHeaderText}>
          {isArabic ? 'التبرعات الجماعية' : 'Charity Pools'}
        </Text>
      </View>

      <View style={styles.charityContainer}>
        {charityPools.map((pool) => (
          <View key={pool.id} style={styles.charityCard}>
            <View style={styles.charityInfo}>
              <Text style={styles.charityName}>
                {isArabic ? pool.nameAr : pool.name}
              </Text>
              <Text style={styles.charityDescription}>
                {isArabic ? pool.descriptionAr : pool.description}
              </Text>
              <Text style={styles.charityCategory}>{pool.category}</Text>
            </View>
            
            <View style={styles.charityProgress}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressAmount}>
                  BD {pool.currentAmount.toLocaleString()} / BD {pool.targetAmount.toLocaleString()}
                </Text>
                <Text style={styles.progressParticipants}>
                  {pool.participants} {isArabic ? 'مشارك' : 'participants'}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[
                  styles.progressFill,
                  { width: `${(pool.currentAmount / pool.targetAmount) * 100}%` }
                ]} />
              </View>
            </View>
            
            <View style={styles.charityFooter}>
              <Text style={styles.endDate}>
                {isArabic ? 'ينتهي في:' : 'Ends:'} {pool.endDate}
              </Text>
              <TouchableOpacity style={styles.donateButton}>
                <Text style={styles.donateButtonText}>
                  {isArabic ? 'تبرع' : 'Donate'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderGovernment = () => (
    <View>
      <View style={styles.govStatsCard}>
        <View style={styles.govStatsHeader}>
          <BarChart3 size={24} color="#3B82F6" />
          <Text style={styles.govStatsTitle}>
            {isArabic ? 'إحصائيات الدعم الحكومي' : 'Government Subsidy Stats'}
          </Text>
        </View>
        
        <View style={styles.govStats}>
          <View style={styles.govStat}>
            <Text style={styles.govStatValue}>
              BD {(governmentStats.totalSubsidySpend / 1000000).toFixed(1)}M
            </Text>
            <Text style={styles.govStatLabel}>
              {isArabic ? 'إجمالي الدعم' : 'Total Subsidies'}
            </Text>
          </View>
          <View style={styles.govStat}>
            <Text style={styles.govStatValue}>
              {(governmentStats.wasteReduced / 1000).toFixed(1)}K tons
            </Text>
            <Text style={styles.govStatLabel}>
              {isArabic ? 'النفايات المقللة' : 'Waste Reduced'}
            </Text>
          </View>
          <View style={styles.govStat}>
            <Text style={styles.govStatValue}>
              {(governmentStats.citizensHelped / 1000).toFixed(0)}K
            </Text>
            <Text style={styles.govStatLabel}>
              {isArabic ? 'المواطنون المستفيدون' : 'Citizens Helped'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.lastUpdated}>
          {isArabic ? 'آخر تحديث:' : 'Last updated:'} {governmentStats.lastUpdated}
        </Text>
      </View>

      <View style={styles.votingSection}>
        <Text style={styles.sectionTitle}>
          {isArabic ? 'اقتراحات الدعم' : 'Subsidy Ideas'}
        </Text>
        
        <View style={styles.newIdeaCard}>
          <TextInput
            style={styles.newIdeaInput}
            placeholder={isArabic ? 'اقترح فكرة دعم جديدة...' : 'Suggest a new subsidy idea...'}
            placeholderTextColor="#9CA3AF"
            value={newIdeaText}
            onChangeText={setNewIdeaText}
            multiline
          />
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>
              {isArabic ? 'إرسال' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ideasContainer}>
          {subsidyIdeas.map((idea) => (
            <View key={idea.id} style={styles.ideaCard}>
              <View style={styles.ideaHeader}>
                <View style={styles.ideaInfo}>
                  <Text style={styles.ideaTitle}>
                    {isArabic ? idea.titleAr : idea.title}
                  </Text>
                  <Text style={styles.ideaAuthor}>
                    {isArabic ? 'بواسطة:' : 'by'} {idea.author}
                  </Text>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{idea.category}</Text>
                </View>
              </View>
              
              <Text style={styles.ideaDescription}>
                {isArabic ? idea.descriptionAr : idea.description}
              </Text>
              
              <View style={styles.ideaFooter}>
                <TouchableOpacity 
                  style={[styles.voteButton, idea.userVoted && styles.votedButton]}
                  onPress={() => handleVote(idea.id)}
                >
                  <Vote size={16} color={idea.userVoted ? "#FFFFFF" : "#10B981"} />
                  <Text style={[styles.voteButtonText, idea.userVoted && styles.votedButtonText]}>
                    {idea.votes} {isArabic ? 'صوت' : 'votes'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderChallenges = () => (
    <View>
      <View style={styles.challengesHeader}>
        <Calendar size={24} color="#8B5CF6" />
        <Text style={styles.challengesHeaderText}>
          {isArabic ? 'التحديات الموسمية' : 'Seasonal Challenges'}
        </Text>
      </View>

      <View style={styles.challengesContainer}>
        {seasonalChallenges.map((challenge) => (
          <View key={challenge.id} style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
              <Text style={styles.challengeTitle}>
                {isArabic ? challenge.titleAr : challenge.title}
              </Text>
              <View style={styles.participantsBadge}>
                <Users size={16} color="#8B5CF6" />
                <Text style={styles.participantsText}>
                  {challenge.participants.toLocaleString()}
                </Text>
              </View>
            </View>
            
            <Text style={styles.challengeDescription}>
              {isArabic ? challenge.descriptionAr : challenge.description}
            </Text>
            
            <View style={styles.challengeProgress}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>
                  {isArabic ? 'التقدم:' : 'Progress:'} {challenge.progress}%
                </Text>
                <Text style={styles.endDate}>
                  {isArabic ? 'ينتهي:' : 'Ends:'} {challenge.endDate}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[
                  styles.progressFill,
                  { width: `${challenge.progress}%` }
                ]} />
              </View>
            </View>
            
            <View style={styles.challengeReward}>
              <Gift size={16} color="#F59E0B" />
              <Text style={styles.rewardText}>
                {isArabic ? 'الجائزة:' : 'Reward:'} {challenge.reward}
              </Text>
            </View>
            
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>
                {isArabic ? 'انضم للتحدي' : 'Join Challenge'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isArabic ? 'المجتمع' : 'Community'}
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'circles' && styles.activeTab]}
          onPress={() => setActiveTab('circles')}
        >
          <Text style={[styles.tabText, activeTab === 'circles' && styles.activeTabText]}>
            {isArabic ? 'الدوائر' : 'Circles'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'charity' && styles.activeTab]}
          onPress={() => setActiveTab('charity')}
        >
          <Text style={[styles.tabText, activeTab === 'charity' && styles.activeTabText]}>
            {isArabic ? 'الخير' : 'Charity'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'government' && styles.activeTab]}
          onPress={() => setActiveTab('government')}
        >
          <Text style={[styles.tabText, activeTab === 'government' && styles.activeTabText]}>
            {isArabic ? 'الحكومة' : 'Government'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'challenges' && styles.activeTab]}
          onPress={() => setActiveTab('challenges')}
        >
          <Text style={[styles.tabText, activeTab === 'challenges' && styles.activeTabText]}>
            {isArabic ? 'التحديات' : 'Challenges'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'circles' && renderCircles()}
        {activeTab === 'charity' && renderCharity()}
        {activeTab === 'government' && renderGovernment()}
        {activeTab === 'challenges' && renderChallenges()}
      </ScrollView>
    </SafeAreaView>
  );
}