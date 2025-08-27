import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView 
} from 'react-native';
import { Stack } from 'expo-router';
import { TrendingUp, Zap, Droplets, Car, ShoppingCart } from 'lucide-react-native';
import { subsidyData } from '@/constants/mockData';
import { useApp } from '@/hooks/useAppStore';
import AlertBanner from '@/components/AlertBanner';
import { VoiceAssistantWrapper } from '@/components/VoiceAssistantWrapper';

export default function SubsidiesScreen() {
  const { userData, theme } = useApp();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'electricity' | 'water' | 'fuel' | 'food'>('overview');
  const isArabic = userData.language === 'ar';

  const tabs = [
    { key: 'overview', label: isArabic ? 'نظرة عامة' : 'Overview' },
    { key: 'electricity', label: isArabic ? 'كهرباء' : 'Electricity' },
    { key: 'water', label: isArabic ? 'مياه' : 'Water' },
    { key: 'fuel', label: isArabic ? 'وقود' : 'Fuel' },
    { key: 'food', label: isArabic ? 'طعام' : 'Food' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'electricity': return <Zap size={20} color="#10B981" />;
      case 'water': return <Droplets size={20} color="#06B6D4" />;
      case 'fuel': return <Car size={20} color="#3B82F6" />;
      case 'food': return <ShoppingCart size={20} color="#F59E0B" />;
      default: return <TrendingUp size={20} color="#10B981" />;
    }
  };

  const electricityData = subsidyData.find(s => s.type === 'electricity');
  const isNearLimit = electricityData && (electricityData.currentUsage / electricityData.subsidyLimit) > 0.85;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{ 
          title: isArabic ? 'الدعم والمرافق' : 'Subsidies & Utilities',
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }} 
      />
      
      {/* Alert */}
      {isNearLimit && (
        <View style={styles.alertContainer}>
          <AlertBanner
            message={isArabic ? 
              'أنت تقترب من حد دعم الكهرباء' : 
              "You're nearing the electricity subsidy threshold"
            }
            type="warning"
          />
        </View>
      )}

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              { backgroundColor: theme.surface },
              selectedTab === tab.key && { backgroundColor: theme.primary }
            ]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Text style={[
              styles.tabText,
              { color: theme.textSecondary },
              selectedTab === tab.key && { color: '#FFFFFF' }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' && (
          <>
            {/* Usage vs Bahrain Average */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {isArabic ? 'الاستهلاك مقابل متوسط البحرين' : 'Usage vs Bahrain Average'}
              </Text>
              <View style={[styles.chartContainer, { backgroundColor: theme.card }]}>
                {subsidyData.map((item, index) => (
                  <View key={index} style={styles.barContainer}>
                    <View style={styles.barGroup}>
                      <View style={[
                        styles.bar,
                        { 
                          height: (item.currentUsage / 200) * 100,
                          backgroundColor: item.color 
                        }
                      ]} />
                      <View style={[
                        styles.bar,
                        { 
                          height: (item.bahrainAverage / 200) * 100,
                          backgroundColor: theme.border,
                          marginLeft: 4
                        }
                      ]} />
                    </View>
                    <Text style={[styles.barLabel, { color: theme.textSecondary }]}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
                  <Text style={[styles.legendText, { color: theme.textSecondary }]}>
                    {isArabic ? 'استهلاكك' : 'Your Usage'}
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: theme.border }]} />
                  <Text style={[styles.legendText, { color: theme.textSecondary }]}>
                    {isArabic ? 'متوسط البحرين' : 'Bahrain Average'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Subsidy Cards */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {isArabic ? 'تفاصيل الدعم' : 'Subsidy Details'}
              </Text>
              {subsidyData.map((item, index) => (
                <View key={index} style={[styles.subsidyCard, { backgroundColor: theme.card }]}>
                  <View style={styles.subsidyHeader}>
                    {getIcon(item.type)}
                    <View style={styles.subsidyInfo}>
                      <Text style={[styles.subsidyTitle, { color: theme.text }]}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Text>
                      <Text style={[styles.subsidySavings, { color: theme.success }]}>
                        {isArabic ? 'وفرت' : 'Saved'} BD {item.savings}
                      </Text>
                    </View>
                    <View style={styles.usageInfo}>
                      <Text style={[styles.usageText, { color: theme.text }]}>
                        {item.currentUsage}/{item.subsidyLimit}
                      </Text>
                      <Text style={[styles.usageLabel, { color: theme.textSecondary }]}>
                        {isArabic ? 'الاستهلاك' : 'Usage'}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${(item.currentUsage / item.subsidyLimit) * 100}%`,
                          backgroundColor: item.color
                        }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* Tips */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {isArabic ? 'نصائح للتوفير' : 'Saving Tips'}
              </Text>
              <View style={[styles.tipCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.tipText, { color: theme.text }]}>
                  {isArabic ? 
                    'استخدم المصابيح الموفرة للطاقة لتوفير BD 3 شهرياً' :
                    'Switch to energy-saving bulbs to save BD 3 monthly'
                  }
                </Text>
              </View>
              <View style={[styles.tipCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.tipText, { color: theme.text }]}>
                  {isArabic ? 
                    'قلل من وقت الاستحمام لتوفير المياه والمال' :
                    'Reduce shower time to save water and money'
                  }
                </Text>
              </View>
            </View>
          </>
        )}

        {selectedTab !== 'overview' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Details
            </Text>
            <Text style={[styles.comingSoon, { color: theme.textSecondary }]}>
              {isArabic ? 'قريباً...' : 'Coming soon...'}
            </Text>
          </View>
        )}
      </ScrollView>
      <VoiceAssistantWrapper />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  alertContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  tabsContainer: {
    maxHeight: 50,
  },
  tabsContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  barContainer: {
    alignItems: 'center',
  },
  barGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 12,
    borderRadius: 6,
    minHeight: 20,
  },
  barLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  subsidyCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  subsidyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subsidyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  subsidyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  subsidySavings: {
    fontSize: 14,
    fontWeight: '500',
  },
  usageInfo: {
    alignItems: 'flex-end',
  },
  usageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  usageLabel: {
    fontSize: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  tipCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  comingSoon: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});