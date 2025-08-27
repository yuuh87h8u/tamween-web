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
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Search,
  Filter,
  BookOpen,
  Store,
  TrendingUp
} from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';

interface GigJob {
  id: string;
  title: string;
  titleAr: string;
  company: string;
  hourlyRate: number;
  location: string;
  type: 'delivery' | 'tutoring' | 'cleaning' | 'tech' | 'other';
  requirements: string[];
  flexible: boolean;
  rating: number;
}

interface MicroBusiness {
  id: string;
  name: string;
  category: string;
  description: string;
  owner: string;
  rating: number;
  monthlyRevenue: number;
}

interface SkillCourse {
  id: string;
  title: string;
  titleAr: string;
  provider: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  free: boolean;
  rating: number;
}

const gigJobs: GigJob[] = [
  {
    id: '1',
    title: 'Food Delivery Driver',
    titleAr: 'سائق توصيل طعام',
    company: 'Talabat',
    hourlyRate: 8,
    location: 'Manama',
    type: 'delivery',
    requirements: ['Valid driving license', 'Own vehicle'],
    flexible: true,
    rating: 4.5
  },
  {
    id: '2',
    title: 'English Tutor',
    titleAr: 'مدرس لغة إنجليزية',
    company: 'Private',
    hourlyRate: 15,
    location: 'Online/Home',
    type: 'tutoring',
    requirements: ['Bachelor degree', 'Teaching experience'],
    flexible: true,
    rating: 4.8
  },
  {
    id: '3',
    title: 'House Cleaning',
    titleAr: 'تنظيف منازل',
    company: 'CleanCo',
    hourlyRate: 6,
    location: 'Various',
    type: 'cleaning',
    requirements: ['Experience preferred'],
    flexible: true,
    rating: 4.2
  }
];

const microBusinesses: MicroBusiness[] = [
  {
    id: '1',
    name: 'Fatima\'s Homemade Sweets',
    category: 'Food & Beverages',
    description: 'Traditional Bahraini sweets and desserts',
    owner: 'Fatima Al-Khalifa',
    rating: 4.9,
    monthlyRevenue: 450
  },
  {
    id: '2',
    name: 'Ahmed\'s Tech Repair',
    category: 'Technology',
    description: 'Mobile phone and laptop repair services',
    owner: 'Ahmed Hassan',
    rating: 4.7,
    monthlyRevenue: 680
  },
  {
    id: '3',
    name: 'Handmade Crafts by Sara',
    category: 'Arts & Crafts',
    description: 'Traditional handicrafts and jewelry',
    owner: 'Sara Mohammed',
    rating: 4.6,
    monthlyRevenue: 320
  }
];

const skillCourses: SkillCourse[] = [
  {
    id: '1',
    title: 'Digital Marketing Basics',
    titleAr: 'أساسيات التسويق الرقمي',
    provider: 'Bahrain Institute',
    duration: '4 weeks',
    level: 'beginner',
    category: 'Marketing',
    free: true,
    rating: 4.5
  },
  {
    id: '2',
    title: 'Basic Accounting',
    titleAr: 'المحاسبة الأساسية',
    provider: 'BIBF',
    duration: '6 weeks',
    level: 'beginner',
    category: 'Finance',
    free: false,
    rating: 4.7
  },
  {
    id: '3',
    title: 'Mobile App Development',
    titleAr: 'تطوير تطبيقات الهاتف',
    provider: 'Tech Academy',
    duration: '12 weeks',
    level: 'intermediate',
    category: 'Technology',
    free: false,
    rating: 4.8
  }
];

export default function JobsIncomeScreen() {
  const { userData, theme } = useApp();
  const [activeTab, setActiveTab] = useState<'gigs' | 'business' | 'courses'>('gigs');
  const [searchQuery, setSearchQuery] = useState('');
  const isArabic = userData.language === 'ar';

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'delivery': return '#3B82F6';
      case 'tutoring': return '#10B981';
      case 'cleaning': return '#F59E0B';
      case 'tech': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderGigs = () => (
    <View>
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: theme.surfaceSecondary }]}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder={isArabic ? 'ابحث عن وظائف...' : 'Search jobs...'}
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Job Cards */}
      <View style={styles.jobsContainer}>
        {gigJobs.map((job) => (
          <TouchableOpacity key={job.id} style={[styles.jobCard, { backgroundColor: theme.surfaceSecondary }]}>
            <View style={styles.jobHeader}>
              <View style={styles.jobInfo}>
                <Text style={[styles.jobTitle, { color: theme.text }]}>
                  {isArabic ? job.titleAr : job.title}
                </Text>
                <Text style={[styles.jobCompany, { color: theme.textSecondary }]}>{job.company}</Text>
              </View>
              <View style={[styles.jobType, { backgroundColor: getJobTypeColor(job.type) }]}>
                <Text style={styles.jobTypeText}>{job.type}</Text>
              </View>
            </View>
            
            <View style={styles.jobDetails}>
              <View style={styles.jobDetail}>
                <MapPin size={16} color="#9CA3AF" />
                <Text style={[styles.jobDetailText, { color: theme.textSecondary }]}>{job.location}</Text>
              </View>
              <View style={styles.jobDetail}>
                <DollarSign size={16} color="#10B981" />
                <Text style={[styles.jobDetailText, { color: theme.textSecondary }]}>BD {job.hourlyRate}/hr</Text>
              </View>
              <View style={styles.jobDetail}>
                <Star size={16} color="#F59E0B" />
                <Text style={[styles.jobDetailText, { color: theme.textSecondary }]}>{job.rating}</Text>
              </View>
            </View>

            {job.flexible && (
              <View style={styles.flexibleBadge}>
                <Clock size={14} color="#10B981" />
                <Text style={styles.flexibleText}>
                  {isArabic ? 'مرن' : 'Flexible'}
                </Text>
              </View>
            )}

            <View style={styles.requirements}>
              <Text style={[styles.requirementsTitle, { color: theme.text }]}>
                {isArabic ? 'المتطلبات:' : 'Requirements:'}
              </Text>
              {job.requirements.map((req, index) => (
                <Text key={index} style={[styles.requirement, { color: theme.textSecondary }]}>• {req}</Text>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderBusiness = () => (
    <View>
      {/* Business Hub Header */}
      <View style={styles.businessHeader}>
        <Store size={24} color="#10B981" />
        <Text style={[styles.businessHeaderText, { color: theme.text }]}>
          {isArabic ? 'مركز الأعمال الصغيرة' : 'Micro-Business Hub'}
        </Text>
      </View>

      {/* Start Business Button */}
      <TouchableOpacity style={styles.startBusinessButton}>
        <Text style={styles.startBusinessText}>
          {isArabic ? 'ابدأ عملك الخاص' : 'Start Your Business'}
        </Text>
      </TouchableOpacity>

      {/* Featured Businesses */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {isArabic ? 'أعمال مميزة' : 'Featured Businesses'}
      </Text>
      
      <View style={styles.businessesContainer}>
        {microBusinesses.map((business) => (
          <TouchableOpacity key={business.id} style={[styles.businessCard, { backgroundColor: theme.surfaceSecondary }]}>
            <View style={styles.businessInfo}>
              <Text style={[styles.businessName, { color: theme.text }]}>{business.name}</Text>
              <Text style={styles.businessCategory}>{business.category}</Text>
              <Text style={[styles.businessDescription, { color: theme.textSecondary }]}>{business.description}</Text>
              <Text style={[styles.businessOwner, { color: theme.textSecondary }]}>
                {isArabic ? 'المالك:' : 'Owner:'} {business.owner}
              </Text>
            </View>
            
            <View style={styles.businessStats}>
              <View style={styles.businessStat}>
                <Star size={16} color="#F59E0B" />
                <Text style={[styles.businessStatText, { color: theme.textSecondary }]}>{business.rating}</Text>
              </View>
              <View style={styles.businessStat}>
                <TrendingUp size={16} color="#10B981" />
                <Text style={[styles.businessStatText, { color: theme.textSecondary }]}>BD {business.monthlyRevenue}/mo</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCourses = () => (
    <View>
      {/* Courses Header */}
      <View style={styles.coursesHeader}>
        <BookOpen size={24} color="#3B82F6" />
        <Text style={[styles.coursesHeaderText, { color: theme.text }]}>
          {isArabic ? 'دورات تطوير المهارات' : 'Skill Development Courses'}
        </Text>
      </View>

      {/* Course Cards */}
      <View style={styles.coursesContainer}>
        {skillCourses.map((course) => (
          <TouchableOpacity key={course.id} style={[styles.courseCard, { backgroundColor: theme.surfaceSecondary }]}>
            <View style={styles.courseHeader}>
              <View style={styles.courseInfo}>
                <Text style={[styles.courseTitle, { color: theme.text }]}>
                  {isArabic ? course.titleAr : course.title}
                </Text>
                <Text style={[styles.courseProvider, { color: theme.textSecondary }]}>{course.provider}</Text>
              </View>
              <View style={styles.courseBadges}>
                {course.free && (
                  <View style={styles.freeBadge}>
                    <Text style={styles.freeBadgeText}>
                      {isArabic ? 'مجاني' : 'FREE'}
                    </Text>
                  </View>
                )}
                <View style={[styles.levelBadge, { backgroundColor: getLevelColor(course.level) }]}>
                  <Text style={styles.levelBadgeText}>{course.level}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.courseDetails}>
              <View style={styles.courseDetail}>
                <Clock size={16} color="#9CA3AF" />
                <Text style={[styles.courseDetailText, { color: theme.textSecondary }]}>{course.duration}</Text>
              </View>
              <View style={styles.courseDetail}>
                <Star size={16} color="#F59E0B" />
                <Text style={[styles.courseDetailText, { color: theme.textSecondary }]}>{course.rating}</Text>
              </View>
            </View>
            
            <Text style={styles.courseCategory}>{course.category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          {isArabic ? 'الوظائف والدخل' : 'Jobs & Income'}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: theme.surface }]}>
        <TouchableOpacity
          style={[styles.tab, { backgroundColor: theme.surfaceSecondary }, activeTab === 'gigs' && [styles.activeTab, { backgroundColor: theme.primary }]]}
          onPress={() => setActiveTab('gigs')}
        >
          <Text style={[styles.tabText, { color: theme.textSecondary }, activeTab === 'gigs' && styles.activeTabText]}>
            {isArabic ? 'وظائف مؤقتة' : 'Gig Jobs'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, { backgroundColor: theme.surfaceSecondary }, activeTab === 'business' && [styles.activeTab, { backgroundColor: theme.primary }]]}
          onPress={() => setActiveTab('business')}
        >
          <Text style={[styles.tabText, { color: theme.textSecondary }, activeTab === 'business' && styles.activeTabText]}>
            {isArabic ? 'أعمال صغيرة' : 'Business'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, { backgroundColor: theme.surfaceSecondary }, activeTab === 'courses' && [styles.activeTab, { backgroundColor: theme.primary }]]}
          onPress={() => setActiveTab('courses')}
        >
          <Text style={[styles.tabText, { color: theme.textSecondary }, activeTab === 'courses' && styles.activeTabText]}>
            {isArabic ? 'دورات' : 'Courses'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'gigs' && renderGigs()}
        {activeTab === 'business' && renderBusiness()}
        {activeTab === 'courses' && renderCourses()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobsContainer: {
    gap: 16,
  },
  jobCard: {
    borderRadius: 16,
    padding: 16,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 14,
  },
  jobType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  jobTypeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  jobDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobDetailText: {
    fontSize: 14,
  },
  flexibleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  flexibleText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  requirements: {
    marginTop: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  requirement: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  businessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  businessHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  startBusinessButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  startBusinessText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  businessesContainer: {
    gap: 16,
  },
  businessCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
  },
  businessInfo: {
    marginBottom: 12,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  businessCategory: {
    fontSize: 14,
    color: '#10B981',
    marginBottom: 8,
  },
  businessDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  businessOwner: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  businessStats: {
    flexDirection: 'row',
    gap: 16,
  },
  businessStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  businessStatText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  coursesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  coursesHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  coursesContainer: {
    gap: 16,
  },
  courseCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  courseProvider: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  courseBadges: {
    gap: 4,
  },
  freeBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  freeBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  levelBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  courseDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  courseDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  courseDetailText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  courseCategory: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
});