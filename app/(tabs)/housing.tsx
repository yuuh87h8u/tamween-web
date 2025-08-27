import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert
} from 'react-native';
import {
  Building,
  Home,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Droplets,
  Zap,
  Thermometer,
  Award,
  TrendingDown
} from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';

interface HousingSubsidy {
  id: string;
  type: 'rent' | 'mortgage' | 'utilities';
  amount: number;
  status: 'approved' | 'pending' | 'rejected';
  applicationDate: string;
  nextPayment?: string;
}

interface RentSplit {
  id: string;
  propertyName: string;
  totalRent: number;
  yourShare: number;
  participants: string[];
  dueDate: string;
  status: 'paid' | 'pending';
}

interface EnergyTip {
  id: string;
  category: 'cooling' | 'lighting' | 'appliances' | 'water';
  title: string;
  description: string;
  potentialSavings: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Grant {
  id: string;
  title: string;
  provider: string;
  amount: number;
  eligibility: string[];
  deadline: string;
  type: 'energy_efficiency' | 'solar' | 'insulation';
}

const mockHousingSubsidies: HousingSubsidy[] = [
  {
    id: '1',
    type: 'rent',
    amount: 200,
    status: 'approved',
    applicationDate: '2023-12-01',
    nextPayment: '2024-02-01'
  },
  {
    id: '2',
    type: 'utilities',
    amount: 50,
    status: 'pending',
    applicationDate: '2024-01-15'
  }
];

const mockRentSplits: RentSplit[] = [
  {
    id: '1',
    propertyName: 'Seef Apartment',
    totalRent: 600,
    yourShare: 300,
    participants: ['You', 'Ahmed', 'Sara'],
    dueDate: '2024-02-01',
    status: 'pending'
  },
  {
    id: '2',
    propertyName: 'Manama Villa',
    totalRent: 800,
    yourShare: 200,
    participants: ['You', 'Family Members'],
    dueDate: '2024-02-01',
    status: 'paid'
  }
];

const mockEnergyTips: EnergyTip[] = [
  {
    id: '1',
    category: 'cooling',
    title: 'Set AC to 24°C',
    description: 'Increase your AC temperature by 2°C to save on electricity',
    potentialSavings: 15,
    difficulty: 'easy'
  },
  {
    id: '2',
    category: 'lighting',
    title: 'Switch to LED bulbs',
    description: 'Replace incandescent bulbs with LED alternatives',
    potentialSavings: 25,
    difficulty: 'easy'
  },
  {
    id: '3',
    category: 'appliances',
    title: 'Unplug unused devices',
    description: 'Reduce phantom power consumption by unplugging devices',
    potentialSavings: 10,
    difficulty: 'easy'
  },
  {
    id: '4',
    category: 'water',
    title: 'Fix water leaks',
    description: 'Repair any dripping faucets or running toilets',
    potentialSavings: 20,
    difficulty: 'medium'
  }
];

const mockGrants: Grant[] = [
  {
    id: '1',
    title: 'Solar Panel Installation Grant',
    provider: 'Sustainable Energy Authority',
    amount: 2000,
    eligibility: ['Homeowner', 'Bahraini Citizen', 'Property < 10 years old'],
    deadline: '2024-06-30',
    type: 'solar'
  },
  {
    id: '2',
    title: 'Home Insulation Subsidy',
    provider: 'Ministry of Housing',
    amount: 800,
    eligibility: ['Household income < BD 1000', 'Property > 5 years old'],
    deadline: '2024-04-15',
    type: 'insulation'
  }
];

export default function HousingScreen() {
  const { userData, theme } = useApp();
  const [housingSubsidies] = useState<HousingSubsidy[]>(mockHousingSubsidies);
  const [rentSplits] = useState<RentSplit[]>(mockRentSplits);
  const [energyTips] = useState<EnergyTip[]>(mockEnergyTips);
  const [grants] = useState<Grant[]>(mockGrants);
  const [auditAnswers, setAuditAnswers] = useState({
    homeSize: '',
    occupants: '',
    acUsage: ''
  });
  const isArabic = userData.language === 'ar';

  const getSubsidyIcon = (type: HousingSubsidy['type']) => {
    const iconProps = { size: 20, color: '#10B981' };
    switch (type) {
      case 'rent': return <Home {...iconProps} />;
      case 'mortgage': return <Building {...iconProps} />;
      case 'utilities': return <Zap {...iconProps} />;
      default: return <Home {...iconProps} />;
    }
  };

  const getStatusColor = (status: HousingSubsidy['status']) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const getStatusText = (status: HousingSubsidy['status']) => {
    if (isArabic) {
      switch (status) {
        case 'approved': return 'موافق عليه';
        case 'pending': return 'قيد المراجعة';
        case 'rejected': return 'مرفوض';
        default: return 'غير معروف';
      }
    } else {
      switch (status) {
        case 'approved': return 'Approved';
        case 'pending': return 'Pending';
        case 'rejected': return 'Rejected';
        default: return 'Unknown';
      }
    }
  };

  const getCategoryIcon = (category: EnergyTip['category']) => {
    const iconProps = { size: 20, color: '#3B82F6' };
    switch (category) {
      case 'cooling': return <Thermometer {...iconProps} />;
      case 'lighting': return <Lightbulb {...iconProps} />;
      case 'appliances': return <Zap {...iconProps} />;
      case 'water': return <Droplets {...iconProps} />;
      default: return <Lightbulb {...iconProps} />;
    }
  };

  const getDifficultyColor = (difficulty: EnergyTip['difficulty']) => {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const handleApplyGrant = (grant: Grant) => {
    Alert.alert(
      isArabic ? 'تقديم طلب منحة' : 'Apply for Grant',
      isArabic ? 
        `هل تريد تقديم طلب للحصول على ${grant.title}؟` :
        `Would you like to apply for ${grant.title}?`,
      [
        { text: isArabic ? 'إلغاء' : 'Cancel', style: 'cancel' },
        { text: isArabic ? 'تقديم' : 'Apply', onPress: () => console.log('Applying for grant') }
      ]
    );
  };

  const runEnergyAudit = () => {
    if (auditAnswers.homeSize && auditAnswers.occupants && auditAnswers.acUsage) {
      Alert.alert(
        isArabic ? 'نتائج التدقيق الطاقي' : 'Energy Audit Results',
        isArabic ? 
          'بناءً على إجاباتك، يمكنك توفير حتى 30% من فاتورة الكهرباء' :
          'Based on your answers, you could save up to 30% on your electricity bill',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        isArabic ? 'معلومات ناقصة' : 'Incomplete Information',
        isArabic ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields'
      );
    }
  };

  const totalSubsidyAmount = housingSubsidies
    .filter(s => s.status === 'approved')
    .reduce((sum, s) => sum + s.amount, 0);

  const totalRentShare = rentSplits.reduce((sum, split) => sum + split.yourShare, 0);

  const styles = StyleSheet.create({
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
      color: theme.textTertiary,
    },
    summaryCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 20,
      marginBottom: 20,
    },
    summaryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
    },
    summaryStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#10B981',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: theme.textTertiary,
      textAlign: 'center',
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 16,
    },
    subsidyCard: {
      backgroundColor: theme.surfaceSecondary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    subsidyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    subsidyInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    subsidyDetails: {
      marginLeft: 12,
      flex: 1,
    },
    subsidyType: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    applicationDate: {
      fontSize: 14,
      color: theme.textTertiary,
    },
    subsidyAmount: {
      alignItems: 'flex-end',
    },
    amountText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
    },
    nextPayment: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    nextPaymentText: {
      fontSize: 14,
      color: theme.textTertiary,
      marginLeft: 8,
    },
    rentCard: {
      backgroundColor: theme.surfaceSecondary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    rentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    rentInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    propertyName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginLeft: 8,
    },
    rentDetails: {
      gap: 8,
    },
    rentAmounts: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    totalRent: {
      fontSize: 14,
      color: theme.textTertiary,
    },
    yourShare: {
      fontSize: 14,
      fontWeight: '600',
      color: '#10B981',
    },
    participants: {
      fontSize: 14,
      color: theme.textTertiary,
    },
    dueDate: {
      fontSize: 14,
      color: '#F59E0B',
    },
    auditCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
    },
    auditDescription: {
      fontSize: 14,
      color: theme.textTertiary,
      marginBottom: 20,
      textAlign: 'center',
    },
    auditQuestion: {
      marginBottom: 16,
    },
    questionText: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 8,
    },
    auditInput: {
      backgroundColor: theme.surfaceSecondary,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.text,
    },
    auditButton: {
      backgroundColor: '#10B981',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    auditButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    tipCard: {
      backgroundColor: theme.surfaceSecondary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    tipHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    tipInfo: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flex: 1,
    },
    tipDetails: {
      marginLeft: 12,
      flex: 1,
    },
    tipTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    tipDescription: {
      fontSize: 14,
      color: theme.textTertiary,
    },
    tipSavings: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    savingsText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#10B981',
      marginLeft: 4,
    },
    difficultyBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    difficultyText: {
      fontSize: 12,
      fontWeight: '600',
    },
    grantCard: {
      backgroundColor: theme.surfaceSecondary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    grantHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    grantInfo: {
      flex: 1,
    },
    grantTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    grantProvider: {
      fontSize: 14,
      color: theme.textTertiary,
    },
    grantAmount: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    grantAmountText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#10B981',
      marginLeft: 4,
    },
    grantDetails: {
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
    grantFooter: {
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
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isArabic ? 'الإسكان والمعيشة' : 'Housing & Living'}
          </Text>
          <Text style={styles.subtitle}>
            {isArabic ? 'إدارة دعم الإسكان وتوفير الطاقة' : 'Manage housing subsidies and energy savings'}
          </Text>
        </View>

        {/* Housing Subsidy Dashboard */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>
              {isArabic ? 'لوحة دعم الإسكان' : 'Housing Subsidy Dashboard'}
            </Text>
            <Building size={24} color="#10B981" />
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>BD {totalSubsidyAmount}</Text>
              <Text style={styles.statLabel}>
                {isArabic ? 'الدعم الشهري' : 'Monthly Subsidy'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{housingSubsidies.filter(s => s.status === 'pending').length}</Text>
              <Text style={styles.statLabel}>
                {isArabic ? 'طلبات معلقة' : 'Pending Applications'}
              </Text>
            </View>
          </View>
        </View>

        {/* Housing Subsidies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'دعم الإسكان' : 'Housing Subsidies'}
          </Text>
          {housingSubsidies.map((subsidy) => (
            <View key={subsidy.id} style={styles.subsidyCard}>
              <View style={styles.subsidyHeader}>
                <View style={styles.subsidyInfo}>
                  {getSubsidyIcon(subsidy.type)}
                  <View style={styles.subsidyDetails}>
                    <Text style={styles.subsidyType}>
                      {isArabic ? 
                        (subsidy.type === 'rent' ? 'دعم الإيجار' : subsidy.type === 'mortgage' ? 'دعم الرهن العقاري' : 'دعم المرافق') :
                        (subsidy.type === 'rent' ? 'Rent Subsidy' : subsidy.type === 'mortgage' ? 'Mortgage Aid' : 'Utilities Aid')
                      }
                    </Text>
                    <Text style={styles.applicationDate}>
                      {isArabic ? 'تاريخ التقديم:' : 'Applied:'} {subsidy.applicationDate}
                    </Text>
                  </View>
                </View>
                <View style={styles.subsidyAmount}>
                  <Text style={styles.amountText}>BD {subsidy.amount}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(subsidy.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(subsidy.status) }]}>
                      {getStatusText(subsidy.status)}
                    </Text>
                  </View>
                </View>
              </View>
              {subsidy.nextPayment && (
                <View style={styles.nextPayment}>
                  <Calendar size={16} color="#9CA3AF" />
                  <Text style={styles.nextPaymentText}>
                    {isArabic ? 'الدفعة التالية:' : 'Next payment:'} {subsidy.nextPayment}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Smart Rent Splitter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'تقسيم الإيجار الذكي' : 'Smart Rent Splitter'}
          </Text>
          {rentSplits.map((split) => (
            <View key={split.id} style={styles.rentCard}>
              <View style={styles.rentHeader}>
                <View style={styles.rentInfo}>
                  <Home size={20} color="#3B82F6" />
                  <Text style={styles.propertyName}>{split.propertyName}</Text>
                </View>
                {split.status === 'paid' ? (
                  <CheckCircle size={20} color="#10B981" />
                ) : (
                  <AlertTriangle size={20} color="#F59E0B" />
                )}
              </View>
              <View style={styles.rentDetails}>
                <View style={styles.rentAmounts}>
                  <Text style={styles.totalRent}>
                    {isArabic ? 'إجمالي الإيجار:' : 'Total Rent:'} BD {split.totalRent}
                  </Text>
                  <Text style={styles.yourShare}>
                    {isArabic ? 'نصيبك:' : 'Your Share:'} BD {split.yourShare}
                  </Text>
                </View>
                <Text style={styles.participants}>
                  {isArabic ? 'المشاركون:' : 'Participants:'} {split.participants.join(', ')}
                </Text>
                <Text style={styles.dueDate}>
                  {isArabic ? 'تاريخ الاستحقاق:' : 'Due Date:'} {split.dueDate}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Energy Audit Tool */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'أداة التدقيق الطاقي' : 'Energy Audit Tool'}
          </Text>
          <View style={styles.auditCard}>
            <Text style={styles.auditDescription}>
              {isArabic ? 
                'أجب على الأسئلة التالية للحصول على نصائح مخصصة لتوفير الطاقة' :
                'Answer the following questions to get personalized energy saving tips'
              }
            </Text>
            <View style={styles.auditQuestion}>
              <Text style={styles.questionText}>
                {isArabic ? 'حجم المنزل (متر مربع):' : 'Home size (sq meters):'}
              </Text>
              <TextInput
                style={styles.auditInput}
                placeholder={isArabic ? 'مثال: 150' : 'e.g., 150'}
                placeholderTextColor="#9CA3AF"
                value={auditAnswers.homeSize}
                onChangeText={(text) => setAuditAnswers(prev => ({ ...prev, homeSize: text }))}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.auditQuestion}>
              <Text style={styles.questionText}>
                {isArabic ? 'عدد السكان:' : 'Number of occupants:'}
              </Text>
              <TextInput
                style={styles.auditInput}
                placeholder={isArabic ? 'مثال: 4' : 'e.g., 4'}
                placeholderTextColor="#9CA3AF"
                value={auditAnswers.occupants}
                onChangeText={(text) => setAuditAnswers(prev => ({ ...prev, occupants: text }))}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.auditQuestion}>
              <Text style={styles.questionText}>
                {isArabic ? 'ساعات تشغيل المكيف يومياً:' : 'AC usage hours per day:'}
              </Text>
              <TextInput
                style={styles.auditInput}
                placeholder={isArabic ? 'مثال: 8' : 'e.g., 8'}
                placeholderTextColor="#9CA3AF"
                value={auditAnswers.acUsage}
                onChangeText={(text) => setAuditAnswers(prev => ({ ...prev, acUsage: text }))}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity style={styles.auditButton} onPress={runEnergyAudit}>
              <Text style={styles.auditButtonText}>
                {isArabic ? 'تشغيل التدقيق' : 'Run Audit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Energy Efficiency Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'نصائح كفاءة الطاقة' : 'Energy Efficiency Tips'}
          </Text>
          {energyTips.map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <View style={styles.tipInfo}>
                  {getCategoryIcon(tip.category)}
                  <View style={styles.tipDetails}>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <Text style={styles.tipDescription}>{tip.description}</Text>
                  </View>
                </View>
                <View style={styles.tipSavings}>
                  <TrendingDown size={16} color="#10B981" />
                  <Text style={styles.savingsText}>BD {tip.potentialSavings}</Text>
                </View>
              </View>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(tip.difficulty) + '20' }]}>
                <Text style={[styles.difficultyText, { color: getDifficultyColor(tip.difficulty) }]}>
                  {isArabic ? 
                    (tip.difficulty === 'easy' ? 'سهل' : tip.difficulty === 'medium' ? 'متوسط' : 'صعب') :
                    tip.difficulty.charAt(0).toUpperCase() + tip.difficulty.slice(1)
                  }
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Energy Efficiency Grants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'منح كفاءة الطاقة' : 'Energy Efficiency Grants'}
          </Text>
          {grants.map((grant) => (
            <View key={grant.id} style={styles.grantCard}>
              <View style={styles.grantHeader}>
                <View style={styles.grantInfo}>
                  <Text style={styles.grantTitle}>{grant.title}</Text>
                  <Text style={styles.grantProvider}>{grant.provider}</Text>
                </View>
                <View style={styles.grantAmount}>
                  <DollarSign size={20} color="#10B981" />
                  <Text style={styles.grantAmountText}>BD {grant.amount}</Text>
                </View>
              </View>
              <View style={styles.grantDetails}>
                <Text style={styles.eligibilityTitle}>
                  {isArabic ? 'شروط الأهلية:' : 'Eligibility:'}
                </Text>
                {grant.eligibility.map((requirement, index) => (
                  <Text key={index} style={styles.eligibilityItem}>
                    • {requirement}
                  </Text>
                ))}
              </View>
              <View style={styles.grantFooter}>
                <View style={styles.deadline}>
                  <Calendar size={16} color="#EF4444" />
                  <Text style={styles.deadlineText}>
                    {isArabic ? 'الموعد النهائي:' : 'Deadline:'} {grant.deadline}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => handleApplyGrant(grant)}
                >
                  <Text style={styles.applyButtonText}>
                    {isArabic ? 'تقديم طلب' : 'Apply'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}