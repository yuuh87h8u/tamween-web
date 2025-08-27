import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { useApp } from '@/hooks/useAppStore';
import { router } from 'expo-router';
import { 
  Users, 
  UserPlus, 
  Settings, 
  PiggyBank,
  Target,
  Trophy,
  Calendar,
  Heart,
  Shield,
  DollarSign,
  Edit3,
  Eye,
  EyeOff,
  Gamepad2,
  MapPin,
  Gift
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function FamilyManagementScreen() {
  const { userData, theme } = useApp();
  const isArabic = userData.language === 'ar';
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAllowanceModal, setShowAllowanceModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [newAllowance, setNewAllowance] = useState('');

  const familyMembers = [
    {
      id: '1',
      name: isArabic ? 'أحمد محمد' : 'Ahmed Mohammed',
      role: isArabic ? 'رب الأسرة' : 'Head of Family',
      avatar: '👨',
      savings: 1200,
      allowance: 0,
      status: 'active'
    },
    {
      id: '2',
      name: isArabic ? 'فاطمة أحمد' : 'Fatima Ahmed',
      role: isArabic ? 'الزوجة' : 'Spouse',
      avatar: '👩',
      savings: 800,
      allowance: 300,
      status: 'active'
    },
    {
      id: '3',
      name: isArabic ? 'محمد أحمد' : 'Mohammed Ahmed',
      role: isArabic ? 'الابن' : 'Son',
      avatar: '👦',
      savings: 150,
      allowance: 50,
      status: 'active'
    },
    {
      id: '4',
      name: isArabic ? 'عائشة أحمد' : 'Aisha Ahmed',
      role: isArabic ? 'الابنة' : 'Daughter',
      avatar: '👧',
      savings: 75,
      allowance: 30,
      status: 'active'
    }
  ];

  const familyStats = {
    totalSavings: 2225,
    monthlyAllowances: 380,
    completedGoals: 3,
    activeGoals: 2,
    familyMissions: 5,
    totalPoints: 1250
  };

  const familyGoals = [
    {
      id: '1',
      title: isArabic ? 'توفير 500 د.ب للإجازة' : 'Save BD 500 for Vacation',
      target: 500,
      current: 320,
      dueDate: '2024-06-01',
      type: 'savings'
    },
    {
      id: '2', 
      title: isArabic ? 'تقليل فاتورة الكهرباء 20%' : 'Reduce Electricity Bill 20%',
      target: 20,
      current: 12,
      dueDate: '2024-03-31',
      type: 'utility'
    }
  ];

  const handleAddMember = () => {
    setShowAddMemberModal(true);
  };

  const handleSetAllowance = (member: any) => {
    setSelectedMember(member);
    setNewAllowance(member.allowance.toString());
    setShowAllowanceModal(true);
  };

  const saveAllowance = () => {
    console.log(`Setting allowance for ${selectedMember.name}: ${newAllowance} BD`);
    setShowAllowanceModal(false);
    setSelectedMember(null);
    setNewAllowance('');
  };

  const handleMemberPress = (member: any) => {
    Alert.alert(
      member.name,
      isArabic 
        ? `المدخرات: ${member.savings} د.ب\nالمصروف: ${member.allowance} د.ب`
        : `Savings: ${member.savings} BD\nAllowance: ${member.allowance} BD`,
      [
        { text: isArabic ? 'تعديل المصروف' : 'Set Allowance', onPress: () => handleSetAllowance(member) },
        { text: isArabic ? 'عرض التفاصيل' : 'View Details', onPress: () => console.log('View details') },
        { text: isArabic ? 'إغلاق' : 'Close', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>
              {isArabic ? 'إدارة العائلة' : 'Family Management'}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {isArabic ? 'تتبع وإدارة أموال العائلة' : 'Track and manage family finances'}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.settingsButton, { backgroundColor: theme.surface }]}
            onPress={() => console.log('Settings')}
          >
            <Settings size={20} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Family Stats */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={[theme.primary, theme.primaryDark]}
            style={styles.statsCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <PiggyBank size={24} color="white" />
                <Text style={styles.statValue}>{familyStats.totalSavings} BD</Text>
                <Text style={styles.statLabel}>
                  {isArabic ? 'إجمالي المدخرات' : 'Total Savings'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Target size={24} color="white" />
                <Text style={styles.statValue}>{familyStats.activeGoals}</Text>
                <Text style={styles.statLabel}>
                  {isArabic ? 'الأهداف النشطة' : 'Active Goals'}
                </Text>
              </View>
            </View>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Calendar size={24} color="white" />
                <Text style={styles.statValue}>{familyStats.monthlyAllowances} BD</Text>
                <Text style={styles.statLabel}>
                  {isArabic ? 'المصروفات الشهرية' : 'Monthly Allowances'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Trophy size={24} color="white" />
                <Text style={styles.statValue}>{familyStats.totalPoints}</Text>
                <Text style={styles.statLabel}>
                  {isArabic ? 'نقاط العائلة' : 'Family Points'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Family Members */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isArabic ? 'أفراد العائلة' : 'Family Members'}
            </Text>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={handleAddMember}
            >
              <UserPlus size={16} color="white" />
              <Text style={styles.addButtonText}>
                {isArabic ? 'إضافة' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.membersGrid}>
            {familyMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={[styles.memberCard, { backgroundColor: theme.surface }]}
                onPress={() => handleMemberPress(member)}
                activeOpacity={0.7}
              >
                <View style={styles.memberHeader}>
                  <Text style={styles.memberAvatar}>{member.avatar}</Text>
                  <View style={[styles.statusDot, { 
                    backgroundColor: member.status === 'active' ? '#10B981' : '#6B7280' 
                  }]} />
                </View>
                
                <Text style={[styles.memberName, { color: theme.text }]}>
                  {member.name}
                </Text>
                <Text style={[styles.memberRole, { color: theme.textSecondary }]}>
                  {member.role}
                </Text>
                
                <View style={styles.memberStats}>
                  <View style={styles.memberStat}>
                    <Text style={[styles.memberStatValue, { color: theme.primary }]}>
                      {member.savings} BD
                    </Text>
                    <Text style={[styles.memberStatLabel, { color: theme.textTertiary }]}>
                      {isArabic ? 'مدخرات' : 'Savings'}
                    </Text>
                  </View>
                  {member.allowance > 0 && (
                    <View style={styles.memberStat}>
                      <Text style={[styles.memberStatValue, { color: theme.accent }]}>
                        {member.allowance} BD
                      </Text>
                      <Text style={[styles.memberStatLabel, { color: theme.textTertiary }]}>
                        {isArabic ? 'مصروف' : 'Allowance'}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Family Goals */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {isArabic ? 'الأهداف العائلية' : 'Family Goals'}
          </Text>
          
          {familyGoals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <View key={goal.id} style={[styles.goalCard, { backgroundColor: theme.surface }]}>
                <View style={styles.goalHeader}>
                  <Text style={[styles.goalTitle, { color: theme.text }]}>
                    {goal.title}
                  </Text>
                  <Text style={[styles.goalProgress, { color: theme.primary }]}>
                    {Math.round(progress)}%
                  </Text>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                    <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%`, backgroundColor: theme.primary }]} />
                  </View>
                </View>
                
                <View style={styles.goalFooter}>
                  <Text style={[styles.goalAmount, { color: theme.textSecondary }]}>
                    {goal.current} / {goal.target} {goal.type === 'savings' ? 'BD' : '%'}
                  </Text>
                  <Text style={[styles.goalDate, { color: theme.textTertiary }]}>
                    {isArabic ? 'الموعد النهائي:' : 'Due:'} {new Date(goal.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
          </Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.surface }]}
              onPress={() => router.push('/(tabs)/gamification')}
            >
              <Gamepad2 size={24} color={theme.primary} />
              <Text style={[styles.actionTitle, { color: theme.text }]}>
                {isArabic ? 'المهام العائلية' : 'Family Missions'}
              </Text>
              <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>
                {isArabic ? 'مهام ممتعة للعائلة' : 'Fun family challenges'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.surface }]}
              onPress={() => router.push('/(tabs)/gamification')}
            >
              <MapPin size={24} color={theme.accent} />
              <Text style={[styles.actionTitle, { color: theme.text }]}>
                {isArabic ? 'خريطة المدخرات' : 'Savings Map'}
              </Text>
              <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>
                {isArabic ? 'رحلة المدخرات العائلية' : 'Family savings adventure'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.surface }]}
              onPress={() => router.push('/(tabs)/gamification')}
            >
              <Gift size={24} color="#EF4444" />
              <Text style={[styles.actionTitle, { color: theme.text }]}>
                {isArabic ? 'الصناديق السرية' : 'Mystery Boxes'}
              </Text>
              <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>
                {isArabic ? 'مكافآت عائلية' : 'Family rewards'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.surface }]}
              onPress={() => router.push('/(tabs)/health')}
            >
              <Heart size={24} color="#8B5CF6" />
              <Text style={[styles.actionTitle, { color: theme.text }]}>
                {isArabic ? 'الصحة العائلية' : 'Family Health'}
              </Text>
              <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>
                {isArabic ? 'تذكيرات طبية مشتركة' : 'Shared medical reminders'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.surface }]}
              onPress={() => router.push('/(tabs)/bills')}
            >
              <DollarSign size={24} color="#10B981" />
              <Text style={[styles.actionTitle, { color: theme.text }]}>
                {isArabic ? 'تقسيم الفواتير' : 'Bill Splitting'}
              </Text>
              <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>
                {isArabic ? 'تقسيم الإيجار والمرافق' : 'Rent & utilities splitting'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.surface }]}
              onPress={() => router.push('/(tabs)/community')}
            >
              <Users size={24} color="#F59E0B" />
              <Text style={[styles.actionTitle, { color: theme.text }]}>
                {isArabic ? 'المجتمع' : 'Community'}
              </Text>
              <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>
                {isArabic ? 'تحديات حكومية وخيرية' : 'Gov & charity challenges'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Add Member Modal */}
      <Modal
        visible={showAddMemberModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddMemberModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {isArabic ? 'إضافة عضو جديد' : 'Add New Member'}
            </Text>
            
            <View style={styles.modalForm}>
              <TextInput
                style={[styles.modalInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                placeholder={isArabic ? 'اسم العضو' : 'Member Name'}
                placeholderTextColor={theme.textTertiary}
              />
              
              <TextInput
                style={[styles.modalInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                placeholder={isArabic ? 'العلاقة (ابن، ابنة، زوج/ة)' : 'Relationship (son, daughter, spouse)'}
                placeholderTextColor={theme.textTertiary}
              />
              
              <TextInput
                style={[styles.modalInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                placeholder={isArabic ? 'العمر' : 'Age'}
                placeholderTextColor={theme.textTertiary}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: theme.border }]}
                onPress={() => setShowAddMemberModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: theme.primary }]}
                onPress={() => {
                  console.log('Adding new member');
                  setShowAddMemberModal(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: 'white' }]}>
                  {isArabic ? 'إضافة' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Set Allowance Modal */}
      <Modal
        visible={showAllowanceModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAllowanceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {isArabic ? 'تحديد المصروف' : 'Set Allowance'}
            </Text>
            
            {selectedMember && (
              <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
                {isArabic ? 'لـ' : 'For'} {selectedMember.name}
              </Text>
            )}
            
            <View style={styles.modalForm}>
              <TextInput
                style={[styles.modalInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                placeholder={isArabic ? 'المبلغ بالدينار البحريني' : 'Amount in BD'}
                placeholderTextColor={theme.textTertiary}
                value={newAllowance}
                onChangeText={setNewAllowance}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: theme.border }]}
                onPress={() => setShowAllowanceModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: theme.primary }]}
                onPress={saveAllowance}
              >
                <Text style={[styles.modalButtonText, { color: 'white' }]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    marginBottom: 32,
  },
  statsCard: {
    borderRadius: 20,
    padding: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  membersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  memberCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  memberHeader: {
    position: 'relative',
    marginBottom: 12,
  },
  memberAvatar: {
    fontSize: 32,
  },
  statusDot: {
    position: 'absolute',
    top: 0,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  memberStats: {
    width: '100%',
    gap: 8,
  },
  memberStat: {
    alignItems: 'center',
  },
  memberStatValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  memberStatLabel: {
    fontSize: 10,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  goalCard: {
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
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  goalProgress: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalAmount: {
    fontSize: 14,
    fontWeight: '500',
  },
  goalDate: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalForm: {
    marginBottom: 24,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    // backgroundColor set dynamically
  },
  confirmButton: {
    // backgroundColor set dynamically
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});