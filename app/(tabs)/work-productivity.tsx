import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useApp } from '@/hooks/useAppStore';
import { Briefcase, FileText, GraduationCap, TrendingUp, DollarSign, Award } from 'lucide-react-native';

interface FreelanceProject {
  id: string;
  client: string;
  project: string;
  amount: number;
  status: 'pending' | 'completed' | 'invoiced';
  dueDate: string;
}

interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  reward: number;
  progress: number;
}

interface JobSuggestion {
  id: string;
  title: string;
  company: string;
  salary: string;
  match: number;
  type: 'full-time' | 'part-time' | 'freelance';
}

export default function WorkProductivityScreen() {
  const { userData, theme } = useApp();
  const isArabic = userData.language === 'ar';
  const [activeTab, setActiveTab] = useState<'freelance' | 'upskill' | 'career'>('freelance');
  const [invoiceAmount, setInvoiceAmount] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');

  const [freelanceProjects] = useState<FreelanceProject[]>([
    { id: '1', client: 'Tech Solutions', project: 'Website Design', amount: 450, status: 'completed', dueDate: '2024-08-30' },
    { id: '2', client: 'Local Restaurant', project: 'Menu Translation', amount: 120, status: 'invoiced', dueDate: '2024-08-25' },
    { id: '3', client: 'Startup Co.', project: 'Logo Design', amount: 200, status: 'pending', dueDate: '2024-09-05' },
  ]);

  const [courses] = useState<Course[]>([
    { id: '1', title: 'Digital Marketing Basics', provider: 'Coursera', duration: '4 weeks', reward: 25, progress: 75 },
    { id: '2', title: 'Excel for Business', provider: 'LinkedIn Learning', duration: '2 weeks', reward: 15, progress: 100 },
    { id: '3', title: 'Arabic-English Translation', provider: 'Udemy', duration: '6 weeks', reward: 35, progress: 30 },
  ]);

  const [jobSuggestions] = useState<JobSuggestion[]>([
    { id: '1', title: 'Customer Service Rep', company: 'Bahrain Telecom', salary: 'BD 400-500', match: 85, type: 'full-time' },
    { id: '2', title: 'Part-time Translator', company: 'Translation Hub', salary: 'BD 15/hour', match: 92, type: 'part-time' },
    { id: '3', title: 'Freelance Designer', company: 'Various Clients', salary: 'BD 200-800', match: 78, type: 'freelance' },
  ]);

  const totalEarnings = freelanceProjects.reduce((sum, project) => 
    project.status === 'completed' || project.status === 'invoiced' ? sum + project.amount : sum, 0
  );

  const generateInvoice = () => {
    if (!clientName || !invoiceAmount) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'يرجى ملء جميع الحقول' : 'Please fill all fields'
      );
      return;
    }
    
    Alert.alert(
      isArabic ? 'تم إنشاء الفاتورة' : 'Invoice Generated',
      isArabic ? `تم إنشاء فاتورة لـ ${clientName} بمبلغ ${invoiceAmount} د.ب` : `Invoice created for ${clientName} - BD ${invoiceAmount}`,
      [{ text: isArabic ? 'موافق' : 'OK' }]
    );
    
    setClientName('');
    setInvoiceAmount('');
  };

  const renderFreelanceToolkit = () => (
    <View style={styles.section}>
      <View style={styles.earningsCard}>
        <View style={styles.earningsHeader}>
          <DollarSign size={24} color="#28a745" />
          <Text style={styles.earningsTitle}>
            {isArabic ? 'الأرباح الشهرية' : 'Monthly Earnings'}
          </Text>
        </View>
        <Text style={styles.earningsAmount}>BD {totalEarnings}</Text>
        <Text style={styles.earningsSubtext}>
          {isArabic ? `${freelanceProjects.length} مشاريع هذا الشهر` : `${freelanceProjects.length} projects this month`}
        </Text>
      </View>

      <View style={styles.invoiceCard}>
        <Text style={styles.invoiceTitle}>
          {isArabic ? 'إنشاء فاتورة جديدة' : 'Generate New Invoice'}
        </Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            {isArabic ? 'اسم العميل' : 'Client Name'}
          </Text>
          <TextInput
            style={styles.textInput}
            value={clientName}
            onChangeText={setClientName}
            placeholder={isArabic ? 'أدخل اسم العميل' : 'Enter client name'}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            {isArabic ? 'المبلغ (د.ب)' : 'Amount (BD)'}
          </Text>
          <TextInput
            style={styles.textInput}
            value={invoiceAmount}
            onChangeText={setInvoiceAmount}
            keyboardType="numeric"
            placeholder="100"
          />
        </View>
        
        <TouchableOpacity style={styles.generateButton} onPress={generateInvoice}>
          <FileText size={20} color="#fff" />
          <Text style={styles.generateButtonText}>
            {isArabic ? 'إنشاء الفاتورة' : 'Generate Invoice'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.projectsCard}>
        <Text style={styles.projectsTitle}>
          {isArabic ? 'المشاريع الحالية' : 'Current Projects'}
        </Text>
        
        {freelanceProjects.map((project) => (
          <View key={project.id} style={styles.projectItem}>
            <View style={styles.projectInfo}>
              <Text style={styles.projectName}>{project.project}</Text>
              <Text style={styles.projectClient}>{project.client}</Text>
              <Text style={styles.projectDue}>
                {isArabic ? 'الموعد النهائي:' : 'Due:'} {project.dueDate}
              </Text>
            </View>
            <View style={styles.projectDetails}>
              <Text style={styles.projectAmount}>BD {project.amount}</Text>
              <View style={[
                styles.statusBadge,
                project.status === 'completed' && styles.completedBadge,
                project.status === 'invoiced' && styles.invoicedBadge,
                project.status === 'pending' && styles.pendingBadge
              ]}>
                <Text style={[
                  styles.statusText,
                  project.status === 'completed' && styles.completedText,
                  project.status === 'invoiced' && styles.invoicedText,
                  project.status === 'pending' && styles.pendingText
                ]}>
                  {project.status === 'completed' && (isArabic ? 'مكتمل' : 'Completed')}
                  {project.status === 'invoiced' && (isArabic ? 'مُفوتر' : 'Invoiced')}
                  {project.status === 'pending' && (isArabic ? 'قيد التنفيذ' : 'Pending')}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderUpskilling = () => (
    <View style={styles.section}>
      <View style={styles.rewardsCard}>
        <View style={styles.rewardsHeader}>
          <Award size={24} color="#ff6b35" />
          <Text style={styles.rewardsTitle}>
            {isArabic ? 'مكافآت التعلم' : 'Learning Rewards'}
          </Text>
        </View>
        <Text style={styles.rewardsAmount}>BD 40</Text>
        <Text style={styles.rewardsSubtext}>
          {isArabic ? 'مكتسبة من إكمال الدورات' : 'Earned from completed courses'}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        {isArabic ? 'الدورات المتاحة' : 'Available Courses'}
      </Text>

      {courses.map((course) => (
        <View key={course.id} style={styles.courseCard}>
          <View style={styles.courseHeader}>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseProvider}>{course.provider}</Text>
              <Text style={styles.courseDuration}>
                {isArabic ? 'المدة:' : 'Duration:'} {course.duration}
              </Text>
            </View>
            <View style={styles.courseReward}>
              <Text style={styles.rewardAmount}>BD {course.reward}</Text>
              <Text style={styles.rewardLabel}>
                {isArabic ? 'مكافأة' : 'Reward'}
              </Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{course.progress}%</Text>
          </View>
          
          <TouchableOpacity style={[
            styles.courseButton,
            course.progress === 100 && styles.completedButton
          ]}>
            <Text style={[
              styles.courseButtonText,
              course.progress === 100 && styles.completedButtonText
            ]}>
              {course.progress === 100 
                ? (isArabic ? 'مكتمل' : 'Completed')
                : (isArabic ? 'متابعة' : 'Continue')
              }
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderCareerCoach = () => (
    <View style={styles.section}>
      <View style={styles.coachCard}>
        <Text style={styles.coachTitle}>
          {isArabic ? 'مدرب المسار المهني' : 'Career Path Coach'}
        </Text>
        <Text style={styles.coachSubtitle}>
          {isArabic ? 'بناءً على عاداتك في الإنفاق ومهاراتك' : 'Based on your spending habits and skills'}
        </Text>
        
        <View style={styles.insightItem}>
          <Text style={styles.insightLabel}>
            {isArabic ? '• أنت تنفق 30% على التكنولوجيا' : '• You spend 30% on technology'}
          </Text>
        </View>
        <View style={styles.insightItem}>
          <Text style={styles.insightLabel}>
            {isArabic ? '• لديك مهارات في التصميم والترجمة' : '• You have skills in design and translation'}
          </Text>
        </View>
        <View style={styles.insightItem}>
          <Text style={styles.insightLabel}>
            {isArabic ? '• تفضل العمل المرن' : '• You prefer flexible work'}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        {isArabic ? 'الوظائف المقترحة' : 'Suggested Jobs'}
      </Text>

      {jobSuggestions.map((job) => (
        <View key={job.id} style={styles.jobCard}>
          <View style={styles.jobHeader}>
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobCompany}>{job.company}</Text>
              <Text style={styles.jobSalary}>{job.salary}</Text>
            </View>
            <View style={styles.jobMatch}>
              <Text style={styles.matchPercentage}>{job.match}%</Text>
              <Text style={styles.matchLabel}>
                {isArabic ? 'مطابقة' : 'Match'}
              </Text>
            </View>
          </View>
          
          <View style={styles.jobType}>
            <Text style={[
              styles.jobTypeText,
              job.type === 'full-time' && styles.fullTimeText,
              job.type === 'part-time' && styles.partTimeText,
              job.type === 'freelance' && styles.freelanceText
            ]}>
              {job.type === 'full-time' && (isArabic ? 'دوام كامل' : 'Full-time')}
              {job.type === 'part-time' && (isArabic ? 'دوام جزئي' : 'Part-time')}
              {job.type === 'freelance' && (isArabic ? 'عمل حر' : 'Freelance')}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>
              {isArabic ? 'التقديم' : 'Apply'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: isArabic ? 'العمل والإنتاجية' : 'Work & Productivity',
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.text,
        }} 
      />
      
      <View style={[styles.tabContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'freelance' && [styles.activeTab, { backgroundColor: theme.primary }]]}
          onPress={() => setActiveTab('freelance')}
        >
          <Text style={[styles.tabText, { color: theme.textTertiary }, activeTab === 'freelance' && styles.activeTabText]}>
            {isArabic ? 'العمل الحر' : 'Freelance'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upskill' && [styles.activeTab, { backgroundColor: theme.primary }]]}
          onPress={() => setActiveTab('upskill')}
        >
          <Text style={[styles.tabText, { color: theme.textTertiary }, activeTab === 'upskill' && styles.activeTabText]}>
            {isArabic ? 'تطوير المهارات' : 'Upskilling'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'career' && [styles.activeTab, { backgroundColor: theme.primary }]]}
          onPress={() => setActiveTab('career')}
        >
          <Text style={[styles.tabText, { color: theme.textTertiary }, activeTab === 'career' && styles.activeTabText]}>
            {isArabic ? 'المسار المهني' : 'Career'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'freelance' && renderFreelanceToolkit()}
        {activeTab === 'upskill' && renderUpskilling()}
        {activeTab === 'career' && renderCareerCoach()}
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
    fontSize: 14,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  earningsCard: {
    backgroundColor: '#374151',
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
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  earningsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 4,
  },
  earningsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  invoiceCard: {
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
  invoiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#1F2937',
    color: '#FFFFFF',
  },
  generateButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  projectsCard: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  projectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  projectClient: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  projectDue: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  projectDetails: {
    alignItems: 'flex-end',
  },
  projectAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completedBadge: {
    backgroundColor: '#e6f7e6',
  },
  invoicedBadge: {
    backgroundColor: '#e6f3ff',
  },
  pendingBadge: {
    backgroundColor: '#fff3e0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completedText: {
    color: '#28a745',
  },
  invoicedText: {
    color: '#007AFF',
  },
  pendingText: {
    color: '#ff6b35',
  },
  rewardsCard: {
    backgroundColor: '#374151',
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
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  rewardsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 4,
  },
  rewardsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  courseCard: {
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
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  courseProvider: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  courseDuration: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  courseReward: {
    alignItems: 'center',
  },
  rewardAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  rewardLabel: {
    fontSize: 12,
    color: '#9CA3AF',
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
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  courseButton: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completedButton: {
    backgroundColor: '#28a745',
  },
  courseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  completedButtonText: {
    color: '#FFFFFF',
  },
  coachCard: {
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
  coachTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  coachSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  insightItem: {
    marginBottom: 8,
  },
  insightLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  jobCard: {
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
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  jobCompany: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  jobSalary: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 4,
  },
  jobMatch: {
    alignItems: 'center',
  },
  matchPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
  },
  matchLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  jobType: {
    marginBottom: 12,
  },
  jobTypeText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  fullTimeText: {
    backgroundColor: '#1F2937',
    color: '#10B981',
  },
  partTimeText: {
    backgroundColor: '#1F2937',
    color: '#ff6b35',
  },
  freelanceText: {
    backgroundColor: '#1F2937',
    color: '#28a745',
  },
  applyButton: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});