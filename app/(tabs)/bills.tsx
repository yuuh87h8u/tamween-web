import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Switch
} from 'react-native';
import {
  Receipt,
  Zap,
  Droplets,
  Wifi,
  Phone,
  Building,
  CreditCard,
  Bell,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';

interface Bill {
  id: string;
  type: 'electricity' | 'water' | 'internet' | 'phone' | 'municipality';
  provider: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  accountNumber: string;
}

interface SplitBill {
  id: string;
  name: string;
  totalAmount: number;
  yourShare: number;
  participants: string[];
  dueDate: string;
  status: 'pending' | 'paid';
}

const mockBills: Bill[] = [
  {
    id: '1',
    type: 'electricity',
    provider: 'EWA',
    amount: 45.5,
    dueDate: '2024-01-15',
    status: 'pending',
    accountNumber: '123456789'
  },
  {
    id: '2',
    type: 'water',
    provider: 'EWA',
    amount: 12.3,
    dueDate: '2024-01-15',
    status: 'paid',
    accountNumber: '123456789'
  },
  {
    id: '3',
    type: 'internet',
    provider: 'Batelco',
    amount: 25.0,
    dueDate: '2024-01-20',
    status: 'pending',
    accountNumber: '987654321'
  },
  {
    id: '4',
    type: 'phone',
    provider: 'Zain',
    amount: 18.5,
    dueDate: '2024-01-18',
    status: 'pending',
    accountNumber: '555123456'
  }
];

const mockSplitBills: SplitBill[] = [
  {
    id: '1',
    name: 'Apartment Rent',
    totalAmount: 400,
    yourShare: 200,
    participants: ['You', 'Ahmed', 'Sara'],
    dueDate: '2024-01-01',
    status: 'paid'
  },
  {
    id: '2',
    name: 'Utilities Split',
    totalAmount: 85,
    yourShare: 28.33,
    participants: ['You', 'Fatima', 'Omar'],
    dueDate: '2024-01-15',
    status: 'pending'
  }
];

export default function BillsScreen() {
  const { userData, theme } = useApp();
  const styles = createStyles(theme);
  const [bills] = useState<Bill[]>(mockBills);
  const [splitBills] = useState<SplitBill[]>(mockSplitBills);
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const isArabic = userData.language === 'ar';

  const getBillIcon = (type: Bill['type']) => {
    const iconProps = { size: 24, color: '#10B981' };
    switch (type) {
      case 'electricity': return <Zap {...iconProps} />;
      case 'water': return <Droplets {...iconProps} />;
      case 'internet': return <Wifi {...iconProps} />;
      case 'phone': return <Phone {...iconProps} />;
      case 'municipality': return <Building {...iconProps} />;
      default: return <Receipt {...iconProps} />;
    }
  };

  const getStatusColor = (status: Bill['status']) => {
    switch (status) {
      case 'paid': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'overdue': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const getStatusText = (status: Bill['status']) => {
    if (isArabic) {
      switch (status) {
        case 'paid': return 'مدفوع';
        case 'pending': return 'معلق';
        case 'overdue': return 'متأخر';
        default: return 'غير معروف';
      }
    } else {
      switch (status) {
        case 'paid': return 'Paid';
        case 'pending': return 'Pending';
        case 'overdue': return 'Overdue';
        default: return 'Unknown';
      }
    }
  };

  const handlePayBill = (bill: Bill) => {
    Alert.alert(
      isArabic ? 'دفع الفاتورة' : 'Pay Bill',
      isArabic ? 
        `هل تريد دفع فاتورة ${bill.provider} بمبلغ ${bill.amount} دينار بحريني؟` :
        `Do you want to pay ${bill.provider} bill for BD ${bill.amount}?`,
      [
        { text: isArabic ? 'إلغاء' : 'Cancel', style: 'cancel' },
        { text: isArabic ? 'دفع' : 'Pay', onPress: () => console.log('Payment initiated') }
      ]
    );
  };

  const totalPending = bills
    .filter(bill => bill.status === 'pending')
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isArabic ? 'مركز الفواتير الموحد' : 'Unified Bills Hub'}
          </Text>
          <Text style={styles.subtitle}>
            {isArabic ? 'إدارة جميع فواتيرك في مكان واحد' : 'Manage all your bills in one place'}
          </Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>
              {isArabic ? 'ملخص الفواتير' : 'Bills Summary'}
            </Text>
            <Receipt size={24} color="#10B981" />
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>BD {totalPending.toFixed(2)}</Text>
              <Text style={styles.statLabel}>
                {isArabic ? 'إجمالي المعلق' : 'Total Pending'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{bills.filter(b => b.status === 'pending').length}</Text>
              <Text style={styles.statLabel}>
                {isArabic ? 'فواتير معلقة' : 'Pending Bills'}
              </Text>
            </View>
          </View>
        </View>

        {/* Auto Pay & Alerts Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'إعدادات الدفع' : 'Payment Settings'}
          </Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <CreditCard size={20} color="#10B981" />
              <Text style={styles.settingText}>
                {isArabic ? 'الدفع التلقائي' : 'Auto Pay'}
              </Text>
            </View>
            <Switch
              value={autoPayEnabled}
              onValueChange={setAutoPayEnabled}
              trackColor={{ false: '#374151', true: '#10B981' }}
              thumbColor={autoPayEnabled ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color="#F59E0B" />
              <Text style={styles.settingText}>
                {isArabic ? 'تنبيهات الاستحقاق' : 'Due Date Alerts'}
              </Text>
            </View>
            <Switch
              value={alertsEnabled}
              onValueChange={setAlertsEnabled}
              trackColor={{ false: '#374151', true: '#10B981' }}
              thumbColor={alertsEnabled ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Bills List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'فواتيرك' : 'Your Bills'}
          </Text>
          {bills.map((bill) => (
            <View key={bill.id} style={styles.billCard}>
              <View style={styles.billHeader}>
                <View style={styles.billInfo}>
                  {getBillIcon(bill.type)}
                  <View style={styles.billDetails}>
                    <Text style={styles.billProvider}>{bill.provider}</Text>
                    <Text style={styles.billAccount}>
                      {isArabic ? 'رقم الحساب:' : 'Account:'} {bill.accountNumber}
                    </Text>
                  </View>
                </View>
                <View style={styles.billAmount}>
                  <Text style={styles.amountText}>BD {bill.amount}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bill.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(bill.status) }]}>
                      {getStatusText(bill.status)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.billFooter}>
                <View style={styles.dueDateContainer}>
                  <Calendar size={16} color="#9CA3AF" />
                  <Text style={styles.dueDate}>
                    {isArabic ? 'الاستحقاق:' : 'Due:'} {bill.dueDate}
                  </Text>
                </View>
                {bill.status === 'pending' && (
                  <TouchableOpacity
                    style={styles.payButton}
                    onPress={() => handlePayBill(bill)}
                  >
                    <Text style={styles.payButtonText}>
                      {isArabic ? 'دفع' : 'Pay'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Bill Splitter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'تقسيم الفواتير الذكي' : 'Smart Bill Splitter'}
          </Text>
          {splitBills.map((splitBill) => (
            <View key={splitBill.id} style={styles.splitBillCard}>
              <View style={styles.splitBillHeader}>
                <View style={styles.splitBillInfo}>
                  <Users size={20} color="#3B82F6" />
                  <Text style={styles.splitBillName}>{splitBill.name}</Text>
                </View>
                {splitBill.status === 'paid' ? (
                  <CheckCircle size={20} color="#10B981" />
                ) : (
                  <AlertCircle size={20} color="#F59E0B" />
                )}
              </View>
              <View style={styles.splitBillDetails}>
                <View style={styles.splitBillAmount}>
                  <Text style={styles.splitBillTotal}>
                    {isArabic ? 'المجموع:' : 'Total:'} BD {splitBill.totalAmount}
                  </Text>
                  <Text style={styles.splitBillShare}>
                    {isArabic ? 'نصيبك:' : 'Your share:'} BD {splitBill.yourShare.toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.splitBillParticipants}>
                  {isArabic ? 'المشاركون:' : 'Participants:'} {splitBill.participants.join(', ')}
                </Text>
                <Text style={styles.splitBillDue}>
                  {isArabic ? 'الاستحقاق:' : 'Due:'} {splitBill.dueDate}
                </Text>
              </View>
            </View>
          ))}
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
  },
  settingsCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: theme.text,
    marginLeft: 12,
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
  billCard: {
    backgroundColor: theme.cardSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  billInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  billDetails: {
    marginLeft: 12,
    flex: 1,
  },
  billProvider: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  billAccount: {
    fontSize: 14,
    color: theme.textTertiary,
  },
  billAmount: {
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
  billFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 14,
    color: theme.textTertiary,
    marginLeft: 8,
  },
  payButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  splitBillCard: {
    backgroundColor: theme.cardSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  splitBillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  splitBillInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  splitBillName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginLeft: 8,
  },
  splitBillDetails: {
    gap: 8,
  },
  splitBillAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  splitBillTotal: {
    fontSize: 14,
    color: theme.textTertiary,
  },
  splitBillShare: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  splitBillParticipants: {
    fontSize: 14,
    color: theme.textTertiary,
  },
  splitBillDue: {
    fontSize: 14,
    color: '#F59E0B',
  },
});