import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import {
  Heart,
  Shield,
  Calendar,
  MapPin,
  DollarSign,
  Bell,
  Activity,
  Pill,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';

interface HealthWalletItem {
  id: string;
  type: 'insurance' | 'medication' | 'checkup' | 'emergency';
  description: string;
  amount: number;
  date: string;
  covered: boolean;
}

interface HealthReminder {
  id: string;
  type: 'vaccination' | 'checkup' | 'medication' | 'screening';
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

interface Pharmacy {
  id: string;
  name: string;
  distance: number;
  rating: number;
  hasSubsidy: boolean;
  subsidyPercentage?: number;
  openHours: string;
}

const mockHealthWallet: HealthWalletItem[] = [
  {
    id: '1',
    type: 'insurance',
    description: 'Monthly Health Insurance Premium',
    amount: 45.0,
    date: '2024-01-01',
    covered: true
  },
  {
    id: '2',
    type: 'medication',
    description: 'Diabetes Medication',
    amount: 25.5,
    date: '2024-01-15',
    covered: true
  },
  {
    id: '3',
    type: 'checkup',
    description: 'Annual Health Checkup',
    amount: 80.0,
    date: '2024-01-10',
    covered: false
  },
  {
    id: '4',
    type: 'emergency',
    description: 'Emergency Room Visit',
    amount: 150.0,
    date: '2024-01-05',
    covered: true
  }
];

const mockHealthReminders: HealthReminder[] = [
  {
    id: '1',
    type: 'vaccination',
    title: 'Annual Flu Shot',
    dueDate: '2024-02-01',
    priority: 'high',
    completed: false
  },
  {
    id: '2',
    type: 'checkup',
    title: 'Dental Checkup',
    dueDate: '2024-02-15',
    priority: 'medium',
    completed: false
  },
  {
    id: '3',
    type: 'screening',
    title: 'Blood Pressure Check',
    dueDate: '2024-01-25',
    priority: 'high',
    completed: true
  }
];

const mockPharmacies: Pharmacy[] = [
  {
    id: '1',
    name: 'Al Dawaa Pharmacy',
    distance: 1.2,
    rating: 4.5,
    hasSubsidy: true,
    subsidyPercentage: 30,
    openHours: '8:00 AM - 10:00 PM'
  },
  {
    id: '2',
    name: 'Nasser Pharmacy',
    distance: 2.1,
    rating: 4.2,
    hasSubsidy: true,
    subsidyPercentage: 25,
    openHours: '24 Hours'
  },
  {
    id: '3',
    name: 'City Pharmacy',
    distance: 0.8,
    rating: 4.0,
    hasSubsidy: false,
    openHours: '9:00 AM - 9:00 PM'
  }
];

export default function HealthScreen() {
  const { userData, theme } = useApp();
  const styles = createStyles(theme);
  const [healthWallet] = useState<HealthWalletItem[]>(mockHealthWallet);
  const [healthReminders] = useState<HealthReminder[]>(mockHealthReminders);
  const [pharmacies] = useState<Pharmacy[]>(mockPharmacies);
  const isArabic = userData.language === 'ar';

  const getHealthIcon = (type: HealthWalletItem['type']) => {
    const iconProps = { size: 20, color: '#10B981' };
    switch (type) {
      case 'insurance': return <Shield {...iconProps} />;
      case 'medication': return <Pill {...iconProps} />;
      case 'checkup': return <Stethoscope {...iconProps} />;
      case 'emergency': return <AlertTriangle {...iconProps} />;
      default: return <Heart {...iconProps} />;
    }
  };

  const getReminderIcon = (type: HealthReminder['type']) => {
    const iconProps = { size: 20, color: '#3B82F6' };
    switch (type) {
      case 'vaccination': return <Shield {...iconProps} />;
      case 'checkup': return <Stethoscope {...iconProps} />;
      case 'medication': return <Pill {...iconProps} />;
      case 'screening': return <Activity {...iconProps} />;
      default: return <Heart {...iconProps} />;
    }
  };

  const getPriorityColor = (priority: HealthReminder['priority']) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#9CA3AF';
    }
  };

  const getPriorityText = (priority: HealthReminder['priority']) => {
    if (isArabic) {
      switch (priority) {
        case 'high': return 'عالية';
        case 'medium': return 'متوسطة';
        case 'low': return 'منخفضة';
        default: return 'غير محدد';
      }
    } else {
      switch (priority) {
        case 'high': return 'High';
        case 'medium': return 'Medium';
        case 'low': return 'Low';
        default: return 'Unknown';
      }
    }
  };

  const handleBookAppointment = (pharmacy: Pharmacy) => {
    Alert.alert(
      isArabic ? 'حجز موعد' : 'Book Appointment',
      isArabic ? 
        `هل تريد حجز موعد في ${pharmacy.name}؟` :
        `Would you like to book an appointment at ${pharmacy.name}?`,
      [
        { text: isArabic ? 'إلغاء' : 'Cancel', style: 'cancel' },
        { text: isArabic ? 'حجز' : 'Book', onPress: () => console.log('Booking appointment') }
      ]
    );
  };

  const totalCovered = healthWallet
    .filter(item => item.covered)
    .reduce((sum, item) => sum + item.amount, 0);

  const totalOutOfPocket = healthWallet
    .filter(item => !item.covered)
    .reduce((sum, item) => sum + item.amount, 0);

  const pendingReminders = healthReminders.filter(reminder => !reminder.completed);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isArabic ? 'الصحة والحماية' : 'Health & Protection'}
          </Text>
          <Text style={styles.subtitle}>
            {isArabic ? 'تتبع صحتك ونفقاتك الطبية' : 'Track your health and medical expenses'}
          </Text>
        </View>

        {/* Health Wallet Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>
              {isArabic ? 'محفظة الصحة' : 'Health Wallet'}
            </Text>
            <Heart size={24} color="#EF4444" />
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>BD {totalCovered.toFixed(2)}</Text>
              <Text style={styles.statLabel}>
                {isArabic ? 'مغطى بالتأمين' : 'Insurance Covered'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>BD {totalOutOfPocket.toFixed(2)}</Text>
              <Text style={styles.statLabel}>
                {isArabic ? 'من الجيب' : 'Out of Pocket'}
              </Text>
            </View>
          </View>
        </View>

        {/* Health Reminders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isArabic ? 'تذكيرات الصحة الوقائية' : 'Preventive Health Reminders'}
            </Text>
            <View style={styles.remindersBadge}>
              <Bell size={16} color="#FFFFFF" />
              <Text style={styles.remindersCount}>{pendingReminders.length}</Text>
            </View>
          </View>
          {healthReminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderCard}>
              <View style={styles.reminderHeader}>
                <View style={styles.reminderInfo}>
                  {getReminderIcon(reminder.type)}
                  <View style={styles.reminderDetails}>
                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                    <View style={styles.reminderMeta}>
                      <Calendar size={14} color="#9CA3AF" />
                      <Text style={styles.reminderDate}>{reminder.dueDate}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.reminderStatus}>
                  {reminder.completed ? (
                    <CheckCircle size={20} color="#10B981" />
                  ) : (
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(reminder.priority) + '20' }]}>
                      <Text style={[styles.priorityText, { color: getPriorityColor(reminder.priority) }]}>
                        {getPriorityText(reminder.priority)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Health Wallet Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'سجل النفقات الطبية' : 'Medical Expenses Log'}
          </Text>
          {healthWallet.map((item) => (
            <View key={item.id} style={styles.walletCard}>
              <View style={styles.walletHeader}>
                <View style={styles.walletInfo}>
                  {getHealthIcon(item.type)}
                  <View style={styles.walletDetails}>
                    <Text style={styles.walletDescription}>{item.description}</Text>
                    <Text style={styles.walletDate}>{item.date}</Text>
                  </View>
                </View>
                <View style={styles.walletAmount}>
                  <Text style={styles.amountText}>BD {item.amount.toFixed(2)}</Text>
                  <View style={[styles.coverageBadge, { backgroundColor: item.covered ? '#10B981' : '#EF4444' }]}>
                    <Text style={styles.coverageText}>
                      {item.covered ? 
                        (isArabic ? 'مغطى' : 'Covered') : 
                        (isArabic ? 'غير مغطى' : 'Not Covered')
                      }
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Subsidized Medicine Tracker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'متتبع الأدوية المدعومة' : 'Subsidized Medicine Tracker'}
          </Text>
          {pharmacies.map((pharmacy) => (
            <View key={pharmacy.id} style={styles.pharmacyCard}>
              <View style={styles.pharmacyHeader}>
                <View style={styles.pharmacyInfo}>
                  <View style={styles.pharmacyNameRow}>
                    <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
                    {pharmacy.hasSubsidy && (
                      <View style={styles.subsidyBadge}>
                        <Text style={styles.subsidyText}>
                          {pharmacy.subsidyPercentage}% {isArabic ? 'خصم' : 'OFF'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.pharmacyMeta}>
                    <View style={styles.pharmacyDistance}>
                      <MapPin size={14} color="#9CA3AF" />
                      <Text style={styles.distanceText}>
                        {pharmacy.distance} km {isArabic ? 'بعيد' : 'away'}
                      </Text>
                    </View>
                    <Text style={styles.ratingText}>⭐ {pharmacy.rating}</Text>
                  </View>
                  <View style={styles.pharmacyHours}>
                    <Clock size={14} color="#9CA3AF" />
                    <Text style={styles.hoursText}>{pharmacy.openHours}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.visitButton}
                  onPress={() => handleBookAppointment(pharmacy)}
                >
                  <Text style={styles.visitButtonText}>
                    {isArabic ? 'زيارة' : 'Visit'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Health Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'نصائح صحية' : 'Health Tips'}
          </Text>
          <View style={styles.tipsCard}>
            <View style={styles.tipItem}>
              <Activity size={20} color="#10B981" />
              <Text style={styles.tipText}>
                {isArabic ? 
                  'اشرب 8 أكواب من الماء يومياً للحفاظ على صحتك' :
                  'Drink 8 glasses of water daily to maintain good health'
                }
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Heart size={20} color="#EF4444" />
              <Text style={styles.tipText}>
                {isArabic ? 
                  'مارس الرياضة لمدة 30 دقيقة يومياً لتحسين صحة القلب' :
                  'Exercise for 30 minutes daily to improve heart health'
                }
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Shield size={20} color="#3B82F6" />
              <Text style={styles.tipText}>
                {isArabic ? 
                  'احرص على الفحوصات الدورية للكشف المبكر عن الأمراض' :
                  'Regular checkups help with early disease detection'
                }
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  remindersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  remindersCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  reminderCard: {
    backgroundColor: theme.cardSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reminderDetails: {
    marginLeft: 12,
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  reminderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderDate: {
    fontSize: 14,
    color: theme.textTertiary,
    marginLeft: 4,
  },
  reminderStatus: {
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  walletCard: {
    backgroundColor: theme.cardSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  walletDetails: {
    marginLeft: 12,
    flex: 1,
  },
  walletDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  walletDate: {
    fontSize: 14,
    color: theme.textTertiary,
  },
  walletAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  coverageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  coverageText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  pharmacyCard: {
    backgroundColor: theme.cardSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  pharmacyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pharmacyInfo: {
    flex: 1,
  },
  pharmacyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    flex: 1,
  },
  subsidyBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subsidyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  pharmacyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 16,
  },
  pharmacyDistance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    color: theme.textTertiary,
    marginLeft: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#F59E0B',
  },
  pharmacyHours: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursText: {
    fontSize: 14,
    color: theme.textTertiary,
    marginLeft: 4,
  },
  visitButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  visitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tipText: {
    fontSize: 14,
    color: theme.textTertiary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});