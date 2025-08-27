import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput
} from 'react-native';
import {
  GraduationCap,
  Star,
  Trophy,
  Coins,
  Target,
  BookOpen,
  Gift,
  Calendar,
  DollarSign,
  Award,
  Users,
  Play
} from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';

interface KidsActivity {
  id: string;
  title: string;
  description: string;
  coinsEarned: number;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  dueDate: string;
  category: 'school' | 'personal' | 'family';
}

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: number;
  deadline: string;
  eligibility: string[];
  type: 'academic' | 'need-based' | 'merit';
}

const mockKidsActivities: KidsActivity[] = [
  {
    id: '1',
    title: 'Save 5 BD this week',
    description: 'Put aside 1 BD each day for 5 days',
    coinsEarned: 50,
    completed: false,
    difficulty: 'easy'
  },
  {
    id: '2',
    title: 'Learn about budgeting',
    description: 'Complete the budgeting basics quiz',
    coinsEarned: 75,
    completed: true,
    difficulty: 'medium'
  },
  {
    id: '3',
    title: 'Compare prices',
    description: 'Find the cheapest option for 3 items',
    coinsEarned: 100,
    completed: false,
    difficulty: 'hard'
  }
];

const mockSavingsGoals: SavingsGoal[] = [
  {
    id: '1',
    name: 'School Fees - Spring Term',
    targetAmount: 500,
    currentAmount: 320,
    dueDate: '2024-03-01',
    category: 'school'
  },
  {
    id: '2',
    name: 'Laptop for Studies',
    targetAmount: 800,
    currentAmount: 150,
    dueDate: '2024-06-01',
    category: 'personal'
  }
];

const mockScholarships: Scholarship[] = [
  {
    id: '1',
    title: 'Bahrain Merit Scholarship',
    provider: 'Ministry of Education',
    amount: 2000,
    deadline: '2024-03-15',
    eligibility: ['GPA > 3.5', 'Bahraini Citizen', 'Age 18-25'],
    type: 'merit'
  },
  {
    id: '2',
    title: 'Technical Skills Grant',
    provider: 'Labour Fund (Tamkeen)',
    amount: 1500,
    deadline: '2024-02-28',
    eligibility: ['Enrolled in technical course', 'Unemployed'],
    type: 'need-based'
  }
];

export default function EducationScreen() {
  const { userData, theme } = useApp();
  const styles = createStyles(theme);
  const [kidsMode, setKidsMode] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [kidsCoins, setKidsCoins] = useState(250);
  const isArabic = userData.language === 'ar';

  const getDifficultyColor = (difficulty: KidsActivity['difficulty']) => {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const getDifficultyText = (difficulty: KidsActivity['difficulty']) => {
    if (isArabic) {
      switch (difficulty) {
        case 'easy': return 'سهل';
        case 'medium': return 'متوسط';
        case 'hard': return 'صعب';
        default: return 'غير محدد';
      }
    } else {
      switch (difficulty) {
        case 'easy': return 'Easy';
        case 'medium': return 'Medium';
        case 'hard': return 'Hard';
        default: return 'Unknown';
      }
    }
  };

  const getScholarshipTypeColor = (type: Scholarship['type']) => {
    switch (type) {
      case 'academic': return '#3B82F6';
      case 'merit': return '#10B981';
      case 'need-based': return '#F59E0B';
      default: return '#9CA3AF';
    }
  };

  const completeActivity = (activityId: string) => {
    const activity = mockKidsActivities.find(a => a.id === activityId);
    if (activity && !activity.completed) {
      activity.completed = true;
      setKidsCoins(prev => prev + activity.coinsEarned);
    }
  };

  const addSavingsGoal = () => {
    if (newGoalName && newGoalAmount) {
      console.log('Adding new savings goal:', { name: newGoalName, amount: newGoalAmount });
      setNewGoalName('');
      setNewGoalAmount('');
      setShowGoalModal(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isArabic ? 'التعليم والأطفال' : 'Education & Kids'}
          </Text>
          <Text style={styles.subtitle}>
            {isArabic ? 'تعلم وادخر للمستقبل' : 'Learn and save for the future'}
          </Text>
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeButton, !kidsMode && styles.activeModeButton]}
            onPress={() => setKidsMode(false)}
          >
            <GraduationCap size={20} color={!kidsMode ? '#FFFFFF' : '#9CA3AF'} />
            <Text style={[styles.modeButtonText, !kidsMode && styles.activeModeButtonText]}>
              {isArabic ? 'وضع البالغين' : 'Adult Mode'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, kidsMode && styles.activeModeButton]}
            onPress={() => setKidsMode(true)}
          >
            <Star size={20} color={kidsMode ? '#FFFFFF' : '#9CA3AF'} />
            <Text style={[styles.modeButtonText, kidsMode && styles.activeModeButtonText]}>
              {isArabic ? 'وضع الأطفال' : 'Kids Mode'}
            </Text>
          </TouchableOpacity>
        </View>

        {kidsMode ? (
          <>
            {/* Kids Coins Balance */}
            <View style={styles.coinsCard}>
              <View style={styles.coinsHeader}>
                <Coins size={32} color="#F59E0B" />
                <View style={styles.coinsInfo}>
                  <Text style={styles.coinsTitle}>
                    {isArabic ? 'عملاتك الذهبية' : 'Your Coins'}
                  </Text>
                  <Text style={styles.coinsAmount}>{kidsCoins}</Text>
                </View>
                <Trophy size={32} color="#10B981" />
              </View>
              <Text style={styles.coinsDescription}>
                {isArabic ? 'اكمل المهام لتحصل على المزيد من العملات!' : 'Complete tasks to earn more coins!'}
              </Text>
            </View>

            {/* Kids Activities */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {isArabic ? 'مهام التوفير' : 'Saving Challenges'}
              </Text>
              {mockKidsActivities.map((activity) => (
                <View key={activity.id} style={styles.activityCard}>
                  <View style={styles.activityHeader}>
                    <View style={styles.activityInfo}>
                      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(activity.difficulty) + '20' }]}>
                        <Text style={[styles.difficultyText, { color: getDifficultyColor(activity.difficulty) }]}>
                          {getDifficultyText(activity.difficulty)}
                        </Text>
                      </View>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                    </View>
                    <View style={styles.activityReward}>
                      <Coins size={20} color="#F59E0B" />
                      <Text style={styles.rewardText}>{activity.coinsEarned}</Text>
                    </View>
                  </View>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  {activity.completed ? (
                    <View style={styles.completedBadge}>
                      <Trophy size={16} color="#10B981" />
                      <Text style={styles.completedText}>
                        {isArabic ? 'مكتمل!' : 'Completed!'}
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.completeButton}
                      onPress={() => completeActivity(activity.id)}
                    >
                      <Text style={styles.completeButtonText}>
                        {isArabic ? 'إكمال المهمة' : 'Complete Task'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {/* Rewards Shop */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {isArabic ? 'متجر المكافآت' : 'Rewards Shop'}
              </Text>
              <View style={styles.rewardsGrid}>
                <View style={styles.rewardItem}>
                  <Gift size={32} color="#EC4899" />
                  <Text style={styles.rewardName}>
                    {isArabic ? 'لعبة جديدة' : 'New Toy'}
                  </Text>
                  <Text style={styles.rewardCost}>500 {isArabic ? 'عملة' : 'coins'}</Text>
                </View>
                <View style={styles.rewardItem}>
                  <BookOpen size={32} color="#3B82F6" />
                  <Text style={styles.rewardName}>
                    {isArabic ? 'كتاب قصص' : 'Story Book'}
                  </Text>
                  <Text style={styles.rewardCost}>300 {isArabic ? 'عملة' : 'coins'}</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* School Fees Planner */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {isArabic ? 'مخطط الرسوم المدرسية' : 'School Fees Planner'}
                </Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowGoalModal(true)}
                >
                  <Text style={styles.addButtonText}>
                    {isArabic ? 'إضافة هدف' : 'Add Goal'}
                  </Text>
                </TouchableOpacity>
              </View>
              {mockSavingsGoals.map((goal) => (
                <View key={goal.id} style={styles.goalCard}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalProgress}>
                      {((goal.currentAmount / goal.targetAmount) * 100).toFixed(0)}%
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }
                      ]} 
                    />
                  </View>
                  <View style={styles.goalDetails}>
                    <Text style={styles.goalAmount}>
                      BD {goal.currentAmount} / BD {goal.targetAmount}
                    </Text>
                    <View style={styles.goalDate}>
                      <Calendar size={16} color="#9CA3AF" />
                      <Text style={styles.dateText}>{goal.dueDate}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Scholarship Alerts */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {isArabic ? 'تنبيهات المنح الدراسية' : 'Scholarship Alerts'}
              </Text>
              {mockScholarships.map((scholarship) => (
                <View key={scholarship.id} style={styles.scholarshipCard}>
                  <View style={styles.scholarshipHeader}>
                    <View style={styles.scholarshipInfo}>
                      <Text style={styles.scholarshipTitle}>{scholarship.title}</Text>
                      <Text style={styles.scholarshipProvider}>{scholarship.provider}</Text>
                    </View>
                    <View style={styles.scholarshipAmount}>
                      <DollarSign size={20} color="#10B981" />
                      <Text style={styles.amountText}>BD {scholarship.amount}</Text>
                    </View>
                  </View>
                  <View style={[styles.typeBadge, { backgroundColor: getScholarshipTypeColor(scholarship.type) + '20' }]}>
                    <Text style={[styles.typeText, { color: getScholarshipTypeColor(scholarship.type) }]}>
                      {scholarship.type.replace('-', ' ').toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.scholarshipDetails}>
                    <Text style={styles.eligibilityTitle}>
                      {isArabic ? 'شروط الأهلية:' : 'Eligibility:'}
                    </Text>
                    {scholarship.eligibility.map((requirement, index) => (
                      <Text key={index} style={styles.eligibilityItem}>
                        • {requirement}
                      </Text>
                    ))}
                  </View>
                  <View style={styles.scholarshipFooter}>
                    <View style={styles.deadline}>
                      <Calendar size={16} color="#EF4444" />
                      <Text style={styles.deadlineText}>
                        {isArabic ? 'الموعد النهائي:' : 'Deadline:'} {scholarship.deadline}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.applyButton}>
                      <Text style={styles.applyButtonText}>
                        {isArabic ? 'تقديم طلب' : 'Apply'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Learning Resources */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {isArabic ? 'موارد التعلم' : 'Learning Resources'}
              </Text>
              <View style={styles.resourcesGrid}>
                <TouchableOpacity style={styles.resourceCard}>
                  <Play size={32} color="#EF4444" />
                  <Text style={styles.resourceTitle}>
                    {isArabic ? 'دورات مالية' : 'Financial Courses'}
                  </Text>
                  <Text style={styles.resourceDescription}>
                    {isArabic ? 'تعلم أساسيات إدارة المال' : 'Learn money management basics'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resourceCard}>
                  <Users size={32} color="#3B82F6" />
                  <Text style={styles.resourceTitle}>
                    {isArabic ? 'ورش عمل' : 'Workshops'}
                  </Text>
                  <Text style={styles.resourceDescription}>
                    {isArabic ? 'ورش تفاعلية للتوفير' : 'Interactive saving workshops'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal
        visible={showGoalModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isArabic ? 'إضافة هدف جديد' : 'Add New Goal'}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder={isArabic ? 'اسم الهدف' : 'Goal Name'}
              placeholderTextColor="#9CA3AF"
              value={newGoalName}
              onChangeText={setNewGoalName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder={isArabic ? 'المبلغ المطلوب' : 'Target Amount'}
              placeholderTextColor="#9CA3AF"
              value={newGoalAmount}
              onChangeText={setNewGoalAmount}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowGoalModal(false)}
              >
                <Text style={styles.cancelButtonText}>
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={addSavingsGoal}
              >
                <Text style={styles.saveButtonText}>
                  {isArabic ? 'حفظ' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeModeButton: {
    backgroundColor: '#10B981',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textTertiary,
    marginLeft: 8,
  },
  activeModeButtonText: {
    color: '#FFFFFF',
  },
  coinsCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  coinsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  coinsInfo: {
    flex: 1,
    alignItems: 'center',
  },
  coinsTitle: {
    fontSize: 16,
    color: theme.textTertiary,
    marginBottom: 4,
  },
  coinsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  coinsDescription: {
    fontSize: 14,
    color: theme.textTertiary,
    textAlign: 'center',
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
    color: theme.text,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: theme.cardSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityInfo: {
    flex: 1,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  activityReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginLeft: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: theme.textTertiary,
    marginBottom: 12,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 4,
  },
  completeButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  rewardsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  rewardItem: {
    flex: 1,
    backgroundColor: theme.cardSecondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  rewardName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  rewardCost: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  goalCard: {
    backgroundColor: theme.cardSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    flex: 1,
  },
  goalProgress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.card,
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
  },
  goalDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: theme.textTertiary,
    marginLeft: 4,
  },
  scholarshipCard: {
    backgroundColor: theme.cardSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  scholarshipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  scholarshipInfo: {
    flex: 1,
  },
  scholarshipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  scholarshipProvider: {
    fontSize: 14,
    color: theme.textTertiary,
  },
  scholarshipAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginLeft: 4,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scholarshipDetails: {
    marginBottom: 12,
  },
  eligibilityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  eligibilityItem: {
    fontSize: 14,
    color: theme.textTertiary,
    marginBottom: 4,
  },
  scholarshipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 4,
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resourcesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  resourceCard: {
    flex: 1,
    backgroundColor: theme.cardSecondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  resourceDescription: {
    fontSize: 12,
    color: theme.textTertiary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: theme.cardSecondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.text,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.cardSecondary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.textTertiary,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});