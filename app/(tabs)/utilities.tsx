import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch
} from 'react-native';
import {
  Zap,
  Thermometer,
  Droplets,
  Wifi,
  WifiOff,
  AlertTriangle,
  TrendingDown,
  Clock,
  Settings,
  Phone
} from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';

interface SmartDevice {
  id: string;
  name: string;
  type: 'plug' | 'meter' | 'thermostat' | 'sensor';
  location: string;
  currentUsage: number;
  status: 'online' | 'offline';
  lastReading: string;
  monthlyUsage: number;
  estimatedCost: number;
}

interface UtilityAlert {
  id: string;
  type: 'leak' | 'high_usage' | 'peak_time' | 'maintenance';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

interface PeakTimeSuggestion {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  potentialSavings: number;
  timeRange: string;
}

const smartDevices: SmartDevice[] = [
  {
    id: '1',
    name: 'Living Room AC',
    type: 'thermostat',
    location: 'Living Room',
    currentUsage: 2.4,
    status: 'online',
    lastReading: '2 min ago',
    monthlyUsage: 180,
    estimatedCost: 25.2
  },
  {
    id: '2',
    name: 'Kitchen Smart Plug',
    type: 'plug',
    location: 'Kitchen',
    currentUsage: 0.8,
    status: 'online',
    lastReading: '1 min ago',
    monthlyUsage: 45,
    estimatedCost: 6.3
  },
  {
    id: '3',
    name: 'Water Meter',
    type: 'meter',
    location: 'Main Supply',
    currentUsage: 12.5,
    status: 'online',
    lastReading: '5 min ago',
    monthlyUsage: 8500,
    estimatedCost: 12.8
  },
  {
    id: '4',
    name: 'Bedroom Sensor',
    type: 'sensor',
    location: 'Master Bedroom',
    currentUsage: 0.1,
    status: 'offline',
    lastReading: '2 hours ago',
    monthlyUsage: 2,
    estimatedCost: 0.3
  }
];

const utilityAlerts: UtilityAlert[] = [
  {
    id: '1',
    type: 'leak',
    title: 'Possible Water Leak Detected',
    titleAr: 'تم اكتشاف تسرب محتمل للمياه',
    description: 'Unusual water usage pattern detected in bathroom area',
    descriptionAr: 'تم اكتشاف نمط استخدام غير عادي للمياه في منطقة الحمام',
    severity: 'high',
    timestamp: '10 min ago'
  },
  {
    id: '2',
    type: 'high_usage',
    title: 'High Electricity Usage',
    titleAr: 'استهلاك عالي للكهرباء',
    description: 'Your AC usage is 30% higher than usual',
    descriptionAr: 'استهلاك المكيف أعلى بنسبة 30% من المعتاد',
    severity: 'medium',
    timestamp: '1 hour ago'
  },
  {
    id: '3',
    type: 'peak_time',
    title: 'Peak Time Alert',
    titleAr: 'تنبيه وقت الذروة',
    description: 'Peak electricity rates start in 30 minutes',
    descriptionAr: 'تبدأ أسعار الكهرباء في وقت الذروة خلال 30 دقيقة',
    severity: 'low',
    timestamp: '30 min ago'
  }
];

const peakTimeSuggestions: PeakTimeSuggestion[] = [
  {
    id: '1',
    title: 'Pre-cool your home',
    titleAr: 'قم بتبريد منزلك مسبقاً',
    description: 'Lower AC temperature before peak hours (2-6 PM)',
    descriptionAr: 'اخفض درجة حرارة المكيف قبل ساعات الذروة (2-6 مساءً)',
    potentialSavings: 15.5,
    timeRange: '12:00 - 14:00'
  },
  {
    id: '2',
    title: 'Use appliances early',
    titleAr: 'استخدم الأجهزة مبكراً',
    description: 'Run washing machine and dishwasher before 2 PM',
    descriptionAr: 'شغل الغسالة وغسالة الأطباق قبل الساعة 2 مساءً',
    potentialSavings: 8.2,
    timeRange: '10:00 - 14:00'
  },
  {
    id: '3',
    title: 'Delay heavy usage',
    titleAr: 'أجل الاستخدام الثقيل',
    description: 'Postpone electric water heater usage until after 6 PM',
    descriptionAr: 'أجل استخدام سخان المياه الكهربائي حتى بعد الساعة 6 مساءً',
    potentialSavings: 12.3,
    timeRange: '18:00 - 22:00'
  }
];

export default function UtilitiesScreen() {
  const { userData, theme } = useApp();
  const [activeTab, setActiveTab] = useState<'devices' | 'alerts' | 'savings'>('devices');
  const [autoMode, setAutoMode] = useState(true);
  const isArabic = userData.language === 'ar';

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'thermostat': return <Thermometer size={24} color="#F59E0B" />;
      case 'plug': return <Zap size={24} color="#3B82F6" />;
      case 'meter': return <Droplets size={24} color="#10B981" />;
      case 'sensor': return <Settings size={24} color="#8B5CF6" />;
      default: return <Zap size={24} color="#6B7280" />;
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'online' ? 
      <Wifi size={16} color="#10B981" /> : 
      <WifiOff size={16} color="#EF4444" />;
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const renderDevices = () => (
    <View>
      {/* Auto Mode Toggle */}
      <View style={styles.autoModeCard}>
        <View style={styles.autoModeHeader}>
          <Settings size={24} color="#10B981" />
          <Text style={styles.autoModeTitle}>
            {isArabic ? 'الوضع التلقائي' : 'Auto Mode'}
          </Text>
          <Switch
            value={autoMode}
            onValueChange={setAutoMode}
            trackColor={{ false: '#374151', true: '#10B981' }}
            thumbColor={autoMode ? '#FFFFFF' : '#9CA3AF'}
          />
        </View>
        <Text style={styles.autoModeDescription}>
          {isArabic 
            ? 'تحسين استهلاك الطاقة تلقائياً بناءً على أنماط الاستخدام'
            : 'Automatically optimize energy usage based on usage patterns'
          }
        </Text>
      </View>

      {/* Device Cards */}
      <View style={styles.devicesContainer}>
        {smartDevices.map((device) => (
          <TouchableOpacity key={device.id} style={styles.deviceCard}>
            <View style={styles.deviceHeader}>
              {getDeviceIcon(device.type)}
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceLocation}>{device.location}</Text>
              </View>
              <View style={styles.deviceStatus}>
                {getStatusIcon(device.status)}
                <Text style={[
                  styles.statusText,
                  { color: device.status === 'online' ? '#10B981' : '#EF4444' }
                ]}>
                  {device.status}
                </Text>
              </View>
            </View>

            <View style={styles.deviceStats}>
              <View style={styles.deviceStat}>
                <Text style={styles.statLabel}>
                  {isArabic ? 'الاستهلاك الحالي' : 'Current Usage'}
                </Text>
                <Text style={styles.statValue}>
                  {device.currentUsage} {device.type === 'meter' ? 'L/h' : 'kW'}
                </Text>
              </View>
              <View style={styles.deviceStat}>
                <Text style={styles.statLabel}>
                  {isArabic ? 'التكلفة الشهرية' : 'Monthly Cost'}
                </Text>
                <Text style={styles.statValue}>BD {device.estimatedCost}</Text>
              </View>
            </View>

            <View style={styles.deviceFooter}>
              <Text style={styles.lastReading}>
                {isArabic ? 'آخر قراءة:' : 'Last reading:'} {device.lastReading}
              </Text>
              <TouchableOpacity style={styles.controlButton}>
                <Text style={styles.controlButtonText}>
                  {isArabic ? 'تحكم' : 'Control'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderAlerts = () => (
    <View style={styles.alertsContainer}>
      {utilityAlerts.map((alert) => (
        <View key={alert.id} style={[
          styles.alertCard,
          { borderLeftColor: getAlertColor(alert.severity) }
        ]}>
          <View style={styles.alertHeader}>
            <AlertTriangle size={20} color={getAlertColor(alert.severity)} />
            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>
                {isArabic ? alert.titleAr : alert.title}
              </Text>
              <Text style={styles.alertTimestamp}>{alert.timestamp}</Text>
            </View>
            <View style={[
              styles.severityBadge,
              { backgroundColor: getAlertColor(alert.severity) }
            ]}>
              <Text style={styles.severityText}>{alert.severity}</Text>
            </View>
          </View>
          
          <Text style={styles.alertDescription}>
            {isArabic ? alert.descriptionAr : alert.description}
          </Text>

          {alert.type === 'leak' && (
            <TouchableOpacity style={styles.actionButton}>
              <Phone size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>
                {isArabic ? 'اتصل بسباك' : 'Call Plumber'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  const renderSavings = () => (
    <View>
      {/* Peak Time Header */}
      <View style={styles.savingsHeader}>
        <Clock size={24} color="#F59E0B" />
        <Text style={styles.savingsHeaderText}>
          {isArabic ? 'توفير في أوقات الذروة' : 'Peak Time Savings'}
        </Text>
      </View>

      {/* Current Peak Status */}
      <View style={styles.peakStatusCard}>
        <Text style={styles.peakStatusTitle}>
          {isArabic ? 'الحالة الحالية' : 'Current Status'}
        </Text>
        <Text style={styles.peakStatusText}>
          {isArabic ? 'خارج أوقات الذروة' : 'Off-Peak Hours'}
        </Text>
        <Text style={styles.peakStatusTime}>
          {isArabic ? 'أوقات الذروة القادمة: 2:00 - 6:00 مساءً' : 'Next peak: 2:00 - 6:00 PM'}
        </Text>
      </View>

      {/* Savings Suggestions */}
      <Text style={styles.sectionTitle}>
        {isArabic ? 'اقتراحات التوفير' : 'Savings Suggestions'}
      </Text>
      
      <View style={styles.suggestionsContainer}>
        {peakTimeSuggestions.map((suggestion) => (
          <TouchableOpacity key={suggestion.id} style={styles.suggestionCard}>
            <View style={styles.suggestionHeader}>
              <TrendingDown size={20} color="#10B981" />
              <View style={styles.suggestionInfo}>
                <Text style={styles.suggestionTitle}>
                  {isArabic ? suggestion.titleAr : suggestion.title}
                </Text>
                <Text style={styles.suggestionTime}>{suggestion.timeRange}</Text>
              </View>
              <Text style={styles.savingsAmount}>
                BD {suggestion.potentialSavings}
              </Text>
            </View>
            
            <Text style={styles.suggestionDescription}>
              {isArabic ? suggestion.descriptionAr : suggestion.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Monthly Savings Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>
          {isArabic ? 'ملخص التوفير الشهري' : 'Monthly Savings Summary'}
        </Text>
        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>BD 45.20</Text>
            <Text style={styles.summaryStatLabel}>
              {isArabic ? 'إجمالي التوفير' : 'Total Saved'}
            </Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>18%</Text>
            <Text style={styles.summaryStatLabel}>
              {isArabic ? 'تقليل الاستهلاك' : 'Usage Reduction'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isArabic ? 'المرافق الذكية' : 'Smart Utilities'}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'devices' && styles.activeTab]}
          onPress={() => setActiveTab('devices')}
        >
          <Text style={[styles.tabText, activeTab === 'devices' && styles.activeTabText]}>
            {isArabic ? 'الأجهزة' : 'Devices'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'alerts' && styles.activeTab]}
          onPress={() => setActiveTab('alerts')}
        >
          <Text style={[styles.tabText, activeTab === 'alerts' && styles.activeTabText]}>
            {isArabic ? 'التنبيهات' : 'Alerts'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'savings' && styles.activeTab]}
          onPress={() => setActiveTab('savings')}
        >
          <Text style={[styles.tabText, activeTab === 'savings' && styles.activeTabText]}>
            {isArabic ? 'التوفير' : 'Savings'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'devices' && renderDevices()}
        {activeTab === 'alerts' && renderAlerts()}
        {activeTab === 'savings' && renderSavings()}
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
    color: '#FFFFFF',
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
    backgroundColor: '#374151',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#10B981',
  },
  tabText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  autoModeCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  autoModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  autoModeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 12,
  },
  autoModeDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  devicesContainer: {
    gap: 16,
  },
  deviceCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  deviceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  deviceLocation: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  deviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  deviceStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  deviceStat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastReading: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  controlButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  controlButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  alertsContainer: {
    gap: 16,
  },
  alertCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertInfo: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  alertTimestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  severityText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  alertDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  savingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  savingsHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  peakStatusCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  peakStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  peakStatusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  peakStatusTime: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  suggestionsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  suggestionCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  suggestionTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  savingsAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  suggestionDescription: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  summaryCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    gap: 32,
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  summaryStatLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});