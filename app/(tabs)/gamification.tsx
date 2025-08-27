import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useApp } from '@/hooks/useAppStore';
import { Trophy, Map, Gift, Users, Target, Star, Zap } from 'lucide-react-native';

interface Mission {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  type: 'family' | 'individual';
  difficulty: 'easy' | 'medium' | 'hard';
  timeLeft: string;
}

interface MapLevel {
  id: string;
  name: string;
  unlocked: boolean;
  completed: boolean;
  savingsRequired: number;
  reward: string;
}

interface MysteryBox {
  id: string;
  type: 'bronze' | 'silver' | 'gold';
  cost: number;
  prizes: string[];
}

export default function GamificationScreen() {
  const { userData, theme } = useApp();
  const isArabic = userData.language === 'ar';
  const [activeTab, setActiveTab] = useState<'missions' | 'map' | 'mystery'>('missions');
  const [selectedBox, setSelectedBox] = useState<MysteryBox | null>(null);
  const [showBoxModal, setShowBoxModal] = useState(false);

  const [missions] = useState<Mission[]>([
    {
      id: '1',
      title: isArabic ? 'توفير 10 د.ب في البقالة' : 'Save BD 10 on Groceries',
      description: isArabic ? 'استخدم الكوبونات والعروض' : 'Use coupons and deals',
      target: 10,
      current: 7,
      reward: 5,
      type: 'family',
      difficulty: 'easy',
      timeLeft: '3 days'
    },
    {
      id: '2',
      title: isArabic ? 'تقليل استهلاك الكهرباء 15%' : 'Reduce Electricity 15%',
      description: isArabic ? 'مقارنة بالشهر الماضي' : 'Compared to last month',
      target: 15,
      current: 8,
      reward: 15,
      type: 'family',
      difficulty: 'medium',
      timeLeft: '2 weeks'
    },
    {
      id: '3',
      title: isArabic ? 'المشي 10000 خطوة يوميًا' : 'Walk 10,000 Steps Daily',
      description: isArabic ? 'لمدة أسبوع كامل' : 'For a full week',
      target: 7,
      current: 4,
      reward: 10,
      type: 'individual',
      difficulty: 'medium',
      timeLeft: '4 days'
    }
  ]);

  const [mapLevels] = useState<MapLevel[]>([
    { id: '1', name: 'Savings Starter', unlocked: true, completed: true, savingsRequired: 50, reward: 'Budget Badge' },
    { id: '2', name: 'Deal Hunter', unlocked: true, completed: true, savingsRequired: 100, reward: 'Shopping Expert' },
    { id: '3', name: 'Subsidy Master', unlocked: true, completed: false, savingsRequired: 200, reward: 'Energy Saver' },
    { id: '4', name: 'Investment Guru', unlocked: false, completed: false, savingsRequired: 500, reward: 'Financial Wizard' },
    { id: '5', name: 'Wealth Builder', unlocked: false, completed: false, savingsRequired: 1000, reward: 'Money Master' },
  ]);

  const [mysteryBoxes] = useState<MysteryBox[]>([
    {
      id: '1',
      type: 'bronze',
      cost: 10,
      prizes: ['BD 5 Voucher', 'Free Coffee', '2x Points Multiplier']
    },
    {
      id: '2',
      type: 'silver',
      cost: 25,
      prizes: ['BD 15 Voucher', 'Restaurant Discount', 'Premium Badge']
    },
    {
      id: '3',
      type: 'gold',
      cost: 50,
      prizes: ['BD 50 Voucher', 'Shopping Spree', 'VIP Status']
    }
  ]);

  const currentSavings = 275;
  const totalPoints = 180;

  const openMysteryBox = (box: MysteryBox) => {
    setSelectedBox(box);
    setShowBoxModal(true);
  };

  const renderMissions = () => (
    <View style={styles.section}>
      <View style={styles.pointsCard}>
        <View style={styles.pointsHeader}>
          <Star size={24} color="#ffd700" />
          <Text style={styles.pointsTitle}>
            {isArabic ? 'النقاط المتاحة' : 'Available Points'}
          </Text>
        </View>
        <Text style={styles.pointsAmount}>{totalPoints}</Text>
        <Text style={styles.pointsSubtext}>
          {isArabic ? 'اكمل المهام لكسب المزيد' : 'Complete missions to earn more'}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        {isArabic ? 'المهام النشطة' : 'Active Missions'}
      </Text>

      {missions.map((mission) => {
        const progress = (mission.current / mission.target) * 100;
        
        return (
          <View key={mission.id} style={styles.missionCard}>
            <View style={styles.missionHeader}>
              <View style={styles.missionInfo}>
                <Text style={styles.missionTitle}>{mission.title}</Text>
                <Text style={styles.missionDescription}>{mission.description}</Text>
              </View>
              <View style={styles.missionReward}>
                <Text style={styles.rewardPoints}>{mission.reward}</Text>
                <Text style={styles.rewardLabel}>
                  {isArabic ? 'نقاط' : 'Points'}
                </Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {mission.current}/{mission.target}
              </Text>
            </View>
            
            <View style={styles.missionFooter}>
              <View style={styles.missionTags}>
                <View style={[
                  styles.typeTag,
                  mission.type === 'family' ? styles.familyTag : styles.individualTag
                ]}>
                  <Text style={[
                    styles.tagText,
                    mission.type === 'family' ? styles.familyTagText : styles.individualTagText
                  ]}>
                    {mission.type === 'family' 
                      ? (isArabic ? 'عائلي' : 'Family')
                      : (isArabic ? 'فردي' : 'Individual')
                    }
                  </Text>
                </View>
                <View style={[
                  styles.difficultyTag,
                  mission.difficulty === 'easy' && styles.easyTag,
                  mission.difficulty === 'medium' && styles.mediumTag,
                  mission.difficulty === 'hard' && styles.hardTag
                ]}>
                  <Text style={styles.tagText}>
                    {mission.difficulty === 'easy' && (isArabic ? 'سهل' : 'Easy')}
                    {mission.difficulty === 'medium' && (isArabic ? 'متوسط' : 'Medium')}
                    {mission.difficulty === 'hard' && (isArabic ? 'صعب' : 'Hard')}
                  </Text>
                </View>
              </View>
              <Text style={styles.timeLeft}>
                {isArabic ? 'متبقي:' : 'Time left:'} {mission.timeLeft}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderSavingsMap = () => (
    <View style={styles.section}>
      <View style={styles.mapHeader}>
        <Map size={24} color="#007AFF" />
        <Text style={styles.mapTitle}>
          {isArabic ? 'خريطة المدخرات' : 'Savings Adventure Map'}
        </Text>
      </View>
      
      <View style={styles.savingsProgress}>
        <Text style={styles.savingsAmount}>BD {currentSavings}</Text>
        <Text style={styles.savingsLabel}>
          {isArabic ? 'إجمالي المدخرات' : 'Total Savings'}
        </Text>
      </View>

      <View style={styles.mapContainer}>
        {mapLevels.map((level, index) => (
          <View key={level.id} style={styles.levelContainer}>
            <View style={[
              styles.levelNode,
              level.completed && styles.completedNode,
              level.unlocked && !level.completed && styles.unlockedNode,
              !level.unlocked && styles.lockedNode
            ]}>
              <Text style={[
                styles.levelNumber,
                level.completed && styles.completedText,
                level.unlocked && !level.completed && styles.unlockedText,
                !level.unlocked && styles.lockedNodeText
              ]}>
                {index + 1}
              </Text>
            </View>
            
            <View style={styles.levelInfo}>
              <Text style={[
                styles.levelName,
                !level.unlocked && styles.lockedLevelName
              ]}>
                {level.name}
              </Text>
              <Text style={styles.levelRequirement}>
                {isArabic ? 'يتطلب:' : 'Requires:'} BD {level.savingsRequired}
              </Text>
              <Text style={styles.levelReward}>
                {isArabic ? 'المكافأة:' : 'Reward:'} {level.reward}
              </Text>
            </View>
            
            {index < mapLevels.length - 1 && (
              <View style={[
                styles.levelConnector,
                level.completed && styles.completedConnector
              ]} />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const renderMysteryBoxes = () => (
    <View style={styles.section}>
      <View style={styles.mysteryHeader}>
        <Gift size={24} color="#ff6b35" />
        <Text style={styles.mysteryTitle}>
          {isArabic ? 'صناديق المكافآت' : 'Mystery Box Rewards'}
        </Text>
      </View>
      
      <Text style={styles.mysterySubtitle}>
        {isArabic ? 'استخدم نقاطك لفتح الصناديق والحصول على مكافآت' : 'Use your points to unlock boxes and win prizes'}
      </Text>

      <View style={styles.boxesContainer}>
        {mysteryBoxes.map((box) => (
          <TouchableOpacity
            key={box.id}
            style={[
              styles.mysteryBox,
              box.type === 'bronze' && styles.bronzeBox,
              box.type === 'silver' && styles.silverBox,
              box.type === 'gold' && styles.goldBox
            ]}
            onPress={() => openMysteryBox(box)}
            disabled={totalPoints < box.cost}
          >
            <Gift size={32} color="#fff" />
            <Text style={styles.boxType}>
              {box.type === 'bronze' && (isArabic ? 'برونزي' : 'Bronze')}
              {box.type === 'silver' && (isArabic ? 'فضي' : 'Silver')}
              {box.type === 'gold' && (isArabic ? 'ذهبي' : 'Gold')}
            </Text>
            <Text style={styles.boxCost}>{box.cost} {isArabic ? 'نقاط' : 'Points'}</Text>
            {totalPoints < box.cost && (
              <View style={styles.lockedOverlay}>
                <Text style={styles.lockedText}>
                  {isArabic ? 'مقفل' : 'Locked'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={showBoxModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBoxModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isArabic ? 'فتح الصندوق!' : 'Opening Box!'}
            </Text>
            {selectedBox && (
              <>
                <View style={[
                  styles.modalBox,
                  selectedBox.type === 'bronze' && styles.bronzeBox,
                  selectedBox.type === 'silver' && styles.silverBox,
                  selectedBox.type === 'gold' && styles.goldBox
                ]}>
                  <Gift size={48} color="#fff" />
                </View>
                <Text style={styles.modalPrize}>
                  {isArabic ? 'فزت بـ:' : 'You won:'}
                </Text>
                <Text style={styles.prizeText}>
                  {selectedBox.prizes[Math.floor(Math.random() * selectedBox.prizes.length)]}
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowBoxModal(false)}
                >
                  <Text style={styles.modalButtonText}>
                    {isArabic ? 'رائع!' : 'Awesome!'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 8,
      marginHorizontal: 4,
    },
    activeTab: {
      backgroundColor: theme.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textTertiary,
    },
    activeTabText: {
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
    },
    section: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    pointsCard: {
      backgroundColor: theme.surfaceSecondary,
      padding: 20,
      borderRadius: 12,
      marginBottom: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    pointsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    pointsTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginLeft: 8,
    },
    pointsAmount: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#ffd700',
      marginBottom: 4,
    },
    pointsSubtext: {
      fontSize: 14,
      color: theme.textTertiary,
    },
    missionCard: {
      backgroundColor: theme.surfaceSecondary,
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    missionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    missionInfo: {
      flex: 1,
    },
    missionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    missionDescription: {
      fontSize: 14,
      color: theme.textTertiary,
      marginTop: 4,
    },
    missionReward: {
      alignItems: 'center',
    },
    rewardPoints: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#ffd700',
    },
    rewardLabel: {
      fontSize: 12,
      color: theme.textTertiary,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    progressBar: {
      flex: 1,
      height: 8,
      backgroundColor: '#4B5563',
      borderRadius: 4,
      marginRight: 12,
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#28a745',
      borderRadius: 4,
    },
    progressText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#28a745',
    },
    missionFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    missionTags: {
      flexDirection: 'row',
    },
    typeTag: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginRight: 8,
    },
    familyTag: {
      backgroundColor: '#e6f3ff',
    },
    individualTag: {
      backgroundColor: '#fff3e0',
    },
    difficultyTag: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    easyTag: {
      backgroundColor: '#e6f7e6',
    },
    mediumTag: {
      backgroundColor: '#fff3e0',
    },
    hardTag: {
      backgroundColor: '#ffe6e6',
    },
    tagText: {
      fontSize: 12,
      fontWeight: '600',
    },
    familyTagText: {
      color: '#007AFF',
    },
    individualTagText: {
      color: '#ff6b35',
    },
    timeLeft: {
      fontSize: 12,
      color: theme.textTertiary,
    },
    mapHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    mapTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginLeft: 8,
    },
    savingsProgress: {
      alignItems: 'center',
      marginBottom: 24,
    },
    savingsAmount: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#10B981',
    },
    savingsLabel: {
      fontSize: 14,
      color: theme.textTertiary,
      marginTop: 4,
    },
    mapContainer: {
      paddingHorizontal: 20,
    },
    levelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      position: 'relative',
    },
    levelNode: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    completedNode: {
      backgroundColor: '#28a745',
    },
    unlockedNode: {
      backgroundColor: '#10B981',
    },
    lockedNode: {
      backgroundColor: '#4B5563',
    },
    levelNumber: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    completedText: {
      color: '#FFFFFF',
    },
    unlockedText: {
      color: '#FFFFFF',
    },
    lockedNodeText: {
      color: theme.textTertiary,
    },
    levelInfo: {
      flex: 1,
    },
    levelName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    lockedLevelName: {
      color: theme.textTertiary,
    },
    levelRequirement: {
      fontSize: 14,
      color: theme.textTertiary,
      marginTop: 2,
    },
    levelReward: {
      fontSize: 12,
      color: '#10B981',
      marginTop: 2,
    },
    levelConnector: {
      position: 'absolute',
      left: 24,
      top: 50,
      width: 2,
      height: 20,
      backgroundColor: '#4B5563',
    },
    completedConnector: {
      backgroundColor: '#28a745',
    },
    mysteryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    mysteryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginLeft: 8,
    },
    mysterySubtitle: {
      fontSize: 14,
      color: theme.textTertiary,
      marginBottom: 24,
      textAlign: 'center',
    },
    boxesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    mysteryBox: {
      width: 100,
      height: 120,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    bronzeBox: {
      backgroundColor: '#cd7f32',
    },
    silverBox: {
      backgroundColor: '#c0c0c0',
    },
    goldBox: {
      backgroundColor: '#ffd700',
    },
    boxType: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginTop: 8,
    },
    boxCost: {
      fontSize: 12,
      color: '#FFFFFF',
      marginTop: 4,
    },
    lockedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    lockedText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.surfaceSecondary,
      padding: 24,
      borderRadius: 16,
      alignItems: 'center',
      width: '80%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 20,
    },
    modalBox: {
      width: 80,
      height: 80,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalPrize: {
      fontSize: 16,
      color: theme.textTertiary,
      marginBottom: 8,
    },
    prizeText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#10B981',
      marginBottom: 20,
    },
    modalButton: {
      backgroundColor: '#10B981',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    modalButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: isArabic ? 'التحديات والمكافآت' : 'Challenges & Rewards',
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: '#FFFFFF',
        }} 
      />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'missions' && styles.activeTab]}
          onPress={() => setActiveTab('missions')}
        >
          <Text style={[styles.tabText, activeTab === 'missions' && styles.activeTabText]}>
            {isArabic ? 'المهام' : 'Missions'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'map' && styles.activeTab]}
          onPress={() => setActiveTab('map')}
        >
          <Text style={[styles.tabText, activeTab === 'map' && styles.activeTabText]}>
            {isArabic ? 'الخريطة' : 'Map'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'mystery' && styles.activeTab]}
          onPress={() => setActiveTab('mystery')}
        >
          <Text style={[styles.tabText, activeTab === 'mystery' && styles.activeTabText]}>
            {isArabic ? 'الصناديق' : 'Mystery'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'missions' && renderMissions()}
        {activeTab === 'map' && renderSavingsMap()}
        {activeTab === 'mystery' && renderMysteryBoxes()}
      </ScrollView>
    </SafeAreaView>
  );
}