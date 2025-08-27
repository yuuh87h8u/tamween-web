import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useApp } from '@/hooks/useAppStore';
import { TrendingUp, Calculator, Users, FileText, CreditCard, DollarSign } from 'lucide-react-native';

interface CreditScoreData {
  score: number;
  category: string;
  factors: string[];
  improvements: string[];
}

interface LoanRequest {
  id: string;
  amount: number;
  purpose: string;
  requester: string;
  status: 'pending' | 'approved' | 'rejected';
  interestRate: number;
}

export default function AdvancedFinanceScreen() {
  const { userData, theme } = useApp();
  const isArabic = userData.language === 'ar';
  const [activeTab, setActiveTab] = useState<'credit' | 'tax' | 'loans'>('credit');
  const [zakatAmount, setZakatAmount] = useState<string>('');
  const [loanAmount, setLoanAmount] = useState<string>('');

  const [creditScore] = useState<CreditScoreData>({
    score: 742,
    category: 'Good',
    factors: ['Payment History', 'Credit Utilization', 'Length of Credit History'],
    improvements: ['Pay bills on time', 'Reduce credit card balances', 'Avoid new credit inquiries']
  });

  const [loanRequests] = useState<LoanRequest[]>([
    { id: '1', amount: 200, purpose: 'Emergency repair', requester: 'Ahmed K.', status: 'pending', interestRate: 0 },
    { id: '2', amount: 500, purpose: 'Business startup', requester: 'Fatima M.', status: 'approved', interestRate: 2 },
    { id: '3', amount: 150, purpose: 'Medical bills', requester: 'Omar S.', status: 'pending', interestRate: 0 },
  ]);

  const calculateZakat = (amount: number): number => {
    return amount * 0.025; // 2.5% zakat rate
  };

  const handleLoanRequest = (requestId: string, action: 'approve' | 'reject') => {
    Alert.alert(
      isArabic ? 'طلب القرض' : 'Loan Request',
      isArabic ? `هل تريد ${action === 'approve' ? 'الموافقة على' : 'رفض'} هذا الطلب؟` : `${action === 'approve' ? 'Approve' : 'Reject'} this loan request?`,
      [
        { text: isArabic ? 'إلغاء' : 'Cancel', style: 'cancel' },
        { text: isArabic ? 'تأكيد' : 'Confirm', onPress: () => console.log(`${action} loan ${requestId}`) }
      ]
    );
  };

  const renderCreditScore = () => (
    <View style={styles.section}>
      <View style={[styles.creditScoreCard, { backgroundColor: theme.surfaceSecondary }]}>
        <View style={styles.scoreHeader}>
          <TrendingUp size={24} color="#28a745" />
          <Text style={[styles.scoreTitle, { color: theme.text }]}>
            {isArabic ? 'النقاط الائتمانية' : 'Credit Score'}
          </Text>
        </View>
        
        <View style={styles.scoreDisplay}>
          <Text style={styles.scoreNumber}>{creditScore.score}</Text>
          <Text style={[styles.scoreCategory, { color: theme.textSecondary }]}>{creditScore.category}</Text>
        </View>
        
        <View style={[styles.scoreBar, { backgroundColor: theme.border }]}>
          <View style={[styles.scoreProgress, { width: `${(creditScore.score / 850) * 100}%` }]} />
        </View>
        
        <Text style={[styles.scoreRange, { color: theme.textSecondary }]}>300 - 850</Text>
      </View>

      <View style={[styles.factorsCard, { backgroundColor: theme.surfaceSecondary }]}>
        <Text style={[styles.factorsTitle, { color: theme.text }]}>
          {isArabic ? 'العوامل المؤثرة' : 'Key Factors'}
        </Text>
        {creditScore.factors.map((factor, index) => (
          <View key={index} style={styles.factorItem}>
            <View style={styles.factorDot} />
            <Text style={[styles.factorText, { color: theme.textSecondary }]}>{factor}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.improvementsCard, { backgroundColor: theme.surfaceSecondary }]}>
        <Text style={[styles.improvementsTitle, { color: theme.text }]}>
          {isArabic ? 'نصائح للتحسين' : 'Improvement Tips'}
        </Text>
        {creditScore.improvements.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Text style={styles.tipNumber}>{index + 1}</Text>
            <Text style={[styles.tipText, { color: theme.textSecondary }]}>{tip}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTaxHelper = () => (
    <View style={styles.section}>
      <View style={[styles.zakatCard, { backgroundColor: theme.surfaceSecondary }]}>
        <View style={styles.zakatHeader}>
          <Calculator size={24} color="#007AFF" />
          <Text style={[styles.zakatTitle, { color: theme.text }]}>
            {isArabic ? 'حاسبة الزكاة' : 'Zakat Calculator'}
          </Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
            {isArabic ? 'إجمالي المدخرات (د.ب)' : 'Total Savings (BD)'}
          </Text>
          <TextInput
            style={[styles.amountInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
            value={zakatAmount}
            onChangeText={setZakatAmount}
            keyboardType="numeric"
            placeholder={isArabic ? 'أدخل المبلغ' : 'Enter amount'}
            placeholderTextColor={theme.textTertiary}
          />
        </View>
        
        {zakatAmount && (
          <View style={[styles.zakatResult, { backgroundColor: theme.surface }]}>
            <Text style={[styles.zakatResultLabel, { color: theme.textSecondary }]}>
              {isArabic ? 'الزكاة المستحقة:' : 'Zakat Due:'}
            </Text>
            <Text style={styles.zakatResultAmount}>
              BD {calculateZakat(parseFloat(zakatAmount) || 0).toFixed(2)}
            </Text>
          </View>
        )}
        
        <View style={[styles.zakatInfo, { backgroundColor: theme.surface }]}>
          <Text style={[styles.zakatInfoText, { color: theme.textSecondary }]}>
            {isArabic ? 'الزكاة 2.5% من إجمالي المدخرات التي تزيد عن النصاب' : 'Zakat is 2.5% of total savings above nisab threshold'}
          </Text>
        </View>
      </View>

      <View style={[styles.taxTipsCard, { backgroundColor: theme.surfaceSecondary }]}>
        <Text style={[styles.taxTipsTitle, { color: theme.text }]}>
          {isArabic ? 'نصائح ضريبية' : 'Tax Tips'}
        </Text>
        <View style={styles.tipItem}>
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            {isArabic ? '• احتفظ بجميع الإيصالات للمصروفات الطبية' : '• Keep all receipts for medical expenses'}
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            {isArabic ? '• وثق التبرعات الخيرية للحصول على خصومات' : '• Document charitable donations for deductions'}
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            {isArabic ? '• راجع الإعفاءات الضريبية المتاحة' : '• Review available tax exemptions'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderMicroLoans = () => (
    <View style={styles.section}>
      <View style={[styles.loanStatsCard, { backgroundColor: theme.surfaceSecondary }]}>
        <Text style={[styles.loanStatsTitle, { color: theme.text }]}>
          {isArabic ? 'إحصائيات القروض' : 'Loan Statistics'}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>BD 850</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {isArabic ? 'متاح للإقراض' : 'Available to Lend'}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>BD 200</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {isArabic ? 'مُقرض حاليًا' : 'Currently Lent'}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.newLoanCard, { backgroundColor: theme.surfaceSecondary }]}>
        <Text style={[styles.newLoanTitle, { color: theme.text }]}>
          {isArabic ? 'طلب قرض جديد' : 'Request New Loan'}
        </Text>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
            {isArabic ? 'المبلغ المطلوب (د.ب)' : 'Amount Needed (BD)'}
          </Text>
          <TextInput
            style={[styles.amountInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
            value={loanAmount}
            onChangeText={setLoanAmount}
            keyboardType="numeric"
            placeholder="100"
            placeholderTextColor={theme.textTertiary}
          />
        </View>
        <TouchableOpacity style={styles.requestButton}>
          <Text style={styles.requestButtonText}>
            {isArabic ? 'إرسال الطلب' : 'Submit Request'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.loanRequestsCard, { backgroundColor: theme.surfaceSecondary }]}>
        <Text style={[styles.loanRequestsTitle, { color: theme.text }]}>
          {isArabic ? 'طلبات القروض' : 'Loan Requests'}
        </Text>
        {loanRequests.map((request) => (
          <View key={request.id} style={[styles.loanRequestItem, { borderBottomColor: theme.border }]}>
            <View style={styles.loanRequestInfo}>
              <Text style={[styles.loanRequester, { color: theme.text }]}>{request.requester}</Text>
              <Text style={[styles.loanPurpose, { color: theme.textSecondary }]}>{request.purpose}</Text>
              <Text style={styles.loanAmount}>BD {request.amount}</Text>
              {request.interestRate > 0 && (
                <Text style={styles.loanInterest}>
                  {isArabic ? `فائدة: ${request.interestRate}%` : `Interest: ${request.interestRate}%`}
                </Text>
              )}
            </View>
            {request.status === 'pending' && (
              <View style={styles.loanActions}>
                <TouchableOpacity 
                  style={styles.approveButton}
                  onPress={() => handleLoanRequest(request.id, 'approve')}
                >
                  <Text style={styles.approveButtonText}>
                    {isArabic ? 'موافق' : 'Approve'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.rejectButton}
                  onPress={() => handleLoanRequest(request.id, 'reject')}
                >
                  <Text style={styles.rejectButtonText}>
                    {isArabic ? 'رفض' : 'Reject'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {request.status === 'approved' && (
              <View style={styles.statusBadge}>
                <Text style={styles.approvedText}>
                  {isArabic ? 'مُوافق عليه' : 'Approved'}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: isArabic ? 'التمويل المتقدم' : 'Advanced Finance',
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.text,
        }} 
      />
      
      <View style={[styles.tabContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'credit' && [styles.activeTab, { backgroundColor: theme.primary }]]}
          onPress={() => setActiveTab('credit')}
        >
          <Text style={[styles.tabText, { color: theme.textTertiary }, activeTab === 'credit' && styles.activeTabText]}>
            {isArabic ? 'النقاط الائتمانية' : 'Credit Score'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'tax' && [styles.activeTab, { backgroundColor: theme.primary }]]}
          onPress={() => setActiveTab('tax')}
        >
          <Text style={[styles.tabText, { color: theme.textTertiary }, activeTab === 'tax' && styles.activeTabText]}>
            {isArabic ? 'الضرائب والزكاة' : 'Tax & Zakat'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'loans' && [styles.activeTab, { backgroundColor: theme.primary }]]}
          onPress={() => setActiveTab('loans')}
        >
          <Text style={[styles.tabText, { color: theme.textTertiary }, activeTab === 'loans' && styles.activeTabText]}>
            {isArabic ? 'القروض الصغيرة' : 'Micro Loans'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'credit' && renderCreditScore()}
        {activeTab === 'tax' && renderTaxHelper()}
        {activeTab === 'loans' && renderMicroLoans()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
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
  creditScoreCard: {
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
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  scoreDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#28a745',
  },
  scoreCategory: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 4,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 4,
  },
  scoreRange: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  factorsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  factorsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  factorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#28a745',
    marginRight: 12,
  },
  factorText: {
    fontSize: 14,
  },
  improvementsCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  improvementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
    marginRight: 12,
  },
  tipText: {
    fontSize: 14,
    flex: 1,
  },
  zakatCard: {
    backgroundColor: '#374151',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zakatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  zakatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#1F2937',
    color: '#FFFFFF',
  },
  zakatResult: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  zakatResultLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  zakatResultAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
  },
  zakatInfo: {
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 8,
  },
  zakatInfoText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  taxTipsCard: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taxTipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  loanStatsCard: {
    backgroundColor: '#374151',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loanStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsRow: {
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
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  newLoanCard: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newLoanTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  requestButton: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loanRequestsCard: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loanRequestsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  loanRequestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  loanRequestInfo: {
    flex: 1,
  },
  loanRequester: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loanPurpose: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  loanAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginTop: 4,
  },
  loanInterest: {
    fontSize: 12,
    color: '#ff6b35',
    marginTop: 2,
  },
  loanActions: {
    flexDirection: 'row',
  },
  approveButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#e6f7e6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  approvedText: {
    color: '#28a745',
    fontSize: 12,
    fontWeight: '600',
  },
});