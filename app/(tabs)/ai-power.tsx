import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useApp } from '@/hooks/useAppStore';
import { MessageCircle, BarChart3, Calculator, Lightbulb } from 'lucide-react-native';

interface NegotiationTemplate {
  id: string;
  service: string;
  template: string;
  successRate: number;
}

interface ScenarioResult {
  scenario: string;
  impact: string;
  recommendation: string;
  severity: 'low' | 'medium' | 'high';
}

export default function AIPowerFeaturesScreen() {
  const { userData, theme } = useApp();
  const isArabic = userData.language === 'ar';
  const [activeTab, setActiveTab] = useState<'negotiator' | 'simulator'>('negotiator');
  const [selectedService, setSelectedService] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');

  const [negotiationTemplates] = useState<NegotiationTemplate[]>([
    {
      id: '1',
      service: 'Mobile Plan',
      template: 'I have been a loyal customer for X years and would like to discuss my current plan. I noticed competitor Y offers similar services for BD X less. Could you help me with a better rate?',
      successRate: 78
    },
    {
      id: '2',
      service: 'Internet Bill',
      template: 'My internet speed has been inconsistent lately, and I am paying BD X monthly. I would appreciate either a service upgrade or a discount to reflect the actual service quality.',
      successRate: 65
    },
    {
      id: '3',
      service: 'Insurance Premium',
      template: 'I have maintained a clean record with no claims for X years. I believe this warrants a loyalty discount on my premium. What options are available?',
      successRate: 82
    },
    {
      id: '4',
      service: 'Bank Fees',
      template: 'I have been banking with you for X years with consistent deposits. The monthly fees seem high compared to other banks. Can we discuss waiving or reducing these fees?',
      successRate: 71
    }
  ]);

  const [scenarioResults] = useState<ScenarioResult[]>([
    {
      scenario: 'Subsidies reduced by 20%',
      impact: 'Monthly expenses increase by BD 45',
      recommendation: 'Reduce AC usage by 2 hours daily, switch to LED bulbs',
      severity: 'medium'
    },
    {
      scenario: 'Fuel subsidy removed',
      impact: 'Transportation costs increase by BD 60/month',
      recommendation: 'Use public transport 3 days/week, carpool options',
      severity: 'high'
    },
    {
      scenario: 'Water subsidy capped at 50%',
      impact: 'Water bill increases by BD 15/month',
      recommendation: 'Install water-saving fixtures, reduce shower time',
      severity: 'low'
    }
  ]);

  const generateNegotiationMessage = (template: NegotiationTemplate) => {
    const customized = template.template
      .replace('X years', `${Math.floor(Math.random() * 5) + 2} years`)
      .replace('BD X', `BD ${Math.floor(Math.random() * 20) + 10}`)
      .replace('competitor Y', 'other providers');
    
    setCustomMessage(customized);
    setSelectedService(template.service);
  };

  const renderNegotiator = () => (
    <View style={styles.section}>
      <View style={styles.headerCard}>
        <MessageCircle size={24} color="#007AFF" />
        <Text style={styles.headerTitle}>
          {isArabic ? 'المفاوض الذكي' : 'AI Negotiator'}
        </Text>
      </View>
      
      <Text style={styles.sectionDescription}>
        {isArabic ? 'احصل على رسائل مخصصة للتفاوض مع مقدمي الخدمات' : 'Get personalized messages to negotiate with service providers'}
      </Text>

      <Text style={styles.sectionTitle}>
        {isArabic ? 'قوالب التفاوض' : 'Negotiation Templates'}
      </Text>

      {negotiationTemplates.map((template) => (
        <View key={template.id} style={styles.templateCard}>
          <View style={styles.templateHeader}>
            <Text style={styles.templateService}>{template.service}</Text>
            <View style={styles.successBadge}>
              <Text style={styles.successRate}>{template.successRate}%</Text>
              <Text style={styles.successLabel}>
                {isArabic ? 'نجاح' : 'Success'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.templatePreview}>
            {template.template.substring(0, 100)}...
          </Text>
          
          <TouchableOpacity 
            style={styles.useTemplateButton}
            onPress={() => generateNegotiationMessage(template)}
          >
            <Text style={styles.useTemplateText}>
              {isArabic ? 'استخدم هذا القالب' : 'Use This Template'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {customMessage && (
        <View style={styles.generatedMessageCard}>
          <Text style={styles.generatedTitle}>
            {isArabic ? 'رسالة مخصصة لـ' : 'Customized Message for'} {selectedService}
          </Text>
          
          <View style={styles.messageContainer}>
            <Text style={styles.generatedMessage}>{customMessage}</Text>
          </View>
          
          <View style={styles.messageActions}>
            <TouchableOpacity style={styles.copyButton}>
              <Text style={styles.copyButtonText}>
                {isArabic ? 'نسخ' : 'Copy'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>
                {isArabic ? 'تعديل' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const renderSimulator = () => (
    <View style={styles.section}>
      <View style={styles.headerCard}>
        <BarChart3 size={24} color="#ff6b35" />
        <Text style={styles.headerTitle}>
          {isArabic ? 'محاكي السيناريوهات' : 'Scenario Simulator'}
        </Text>
      </View>
      
      <Text style={styles.sectionDescription}>
        {isArabic ? 'اكتشف كيف ستؤثر التغييرات المحتملة على ميزانيتك' : 'Discover how potential changes will affect your budget'}
      </Text>

      <Text style={styles.sectionTitle}>
        {isArabic ? 'السيناريوهات المحتملة' : 'Potential Scenarios'}
      </Text>

      {scenarioResults.map((result, index) => (
        <View key={index} style={[
          styles.scenarioCard,
          result.severity === 'high' && styles.highSeverity,
          result.severity === 'medium' && styles.mediumSeverity,
          result.severity === 'low' && styles.lowSeverity
        ]}>
          <View style={styles.scenarioHeader}>
            <Text style={styles.scenarioTitle}>{result.scenario}</Text>
            <View style={[
              styles.severityBadge,
              result.severity === 'high' && styles.highSeverityBadge,
              result.severity === 'medium' && styles.mediumSeverityBadge,
              result.severity === 'low' && styles.lowSeverityBadge
            ]}>
              <Text style={[
                styles.severityText,
                result.severity === 'high' && styles.highSeverityText,
                result.severity === 'medium' && styles.mediumSeverityText,
                result.severity === 'low' && styles.lowSeverityText
              ]}>
                {result.severity === 'high' && (isArabic ? 'عالي' : 'High')}
                {result.severity === 'medium' && (isArabic ? 'متوسط' : 'Medium')}
                {result.severity === 'low' && (isArabic ? 'منخفض' : 'Low')}
              </Text>
            </View>
          </View>
          
          <View style={styles.scenarioContent}>
            <View style={styles.impactSection}>
              <Text style={styles.impactLabel}>
                {isArabic ? 'التأثير:' : 'Impact:'}
              </Text>
              <Text style={styles.impactText}>{result.impact}</Text>
            </View>
            
            <View style={styles.recommendationSection}>
              <Text style={styles.recommendationLabel}>
                {isArabic ? 'التوصية:' : 'Recommendation:'}
              </Text>
              <Text style={styles.recommendationText}>{result.recommendation}</Text>
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.customScenarioButton}>
        <Calculator size={20} color="#007AFF" />
        <Text style={styles.customScenarioText}>
          {isArabic ? 'إنشاء سيناريو مخصص' : 'Create Custom Scenario'}
        </Text>
      </TouchableOpacity>
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
    headerCard: {
      flexDirection: 'row',
      alignItems: 'center',
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
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginLeft: 12,
    },
    sectionDescription: {
      fontSize: 14,
      color: theme.textTertiary,
      marginBottom: 20,
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    templateCard: {
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
    templateHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    templateService: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    successBadge: {
      alignItems: 'center',
    },
    successRate: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#28a745',
    },
    successLabel: {
      fontSize: 12,
      color: theme.textTertiary,
    },
    templatePreview: {
      fontSize: 14,
      color: theme.textTertiary,
      marginBottom: 12,
      lineHeight: 20,
    },
    useTemplateButton: {
      backgroundColor: '#10B981',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    useTemplateText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    generatedMessageCard: {
      backgroundColor: theme.surfaceSecondary,
      padding: 16,
      borderRadius: 12,
      marginTop: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    generatedTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
    },
    messageContainer: {
      backgroundColor: theme.surface,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    generatedMessage: {
      fontSize: 14,
      color: theme.text,
      lineHeight: 20,
    },
    messageActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    copyButton: {
      backgroundColor: '#28a745',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      flex: 0.48,
      alignItems: 'center',
    },
    copyButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    editButton: {
      backgroundColor: '#ff6b35',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      flex: 0.48,
      alignItems: 'center',
    },
    editButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    scenarioCard: {
      backgroundColor: theme.surfaceSecondary,
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      borderLeftWidth: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    highSeverity: {
      borderLeftColor: '#dc3545',
    },
    mediumSeverity: {
      borderLeftColor: '#ffc107',
    },
    lowSeverity: {
      borderLeftColor: '#28a745',
    },
    scenarioHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    scenarioTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      flex: 1,
    },
    severityBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    highSeverityBadge: {
      backgroundColor: '#ffe6e6',
    },
    mediumSeverityBadge: {
      backgroundColor: '#fff3cd',
    },
    lowSeverityBadge: {
      backgroundColor: '#e6f7e6',
    },
    severityText: {
      fontSize: 12,
      fontWeight: '600',
    },
    highSeverityText: {
      color: '#dc3545',
    },
    mediumSeverityText: {
      color: '#856404',
    },
    lowSeverityText: {
      color: '#28a745',
    },
    scenarioContent: {
      marginTop: 8,
    },
    impactSection: {
      marginBottom: 12,
    },
    impactLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    impactText: {
      fontSize: 14,
      color: theme.textTertiary,
    },
    recommendationSection: {
      marginBottom: 8,
    },
    recommendationLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    recommendationText: {
      fontSize: 14,
      color: theme.textTertiary,
    },
    customScenarioButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.surfaceSecondary,
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#10B981',
      borderStyle: 'dashed',
    },
    customScenarioText: {
      fontSize: 16,
      color: '#10B981',
      marginLeft: 8,
      fontWeight: '600',
    },
    voiceContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    voiceButton: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#28a745',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    listeningButton: {
      backgroundColor: '#fff',
      borderWidth: 3,
      borderColor: '#ff4444',
    },
    voiceButtonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
      marginTop: 8,
      textAlign: 'center',
    },
    listeningText: {
      color: '#ff4444',
    },
    queryCard: {
      backgroundColor: theme.surfaceSecondary,
      padding: 16,
      borderRadius: 12,
      marginVertical: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    queryLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    queryText: {
      fontSize: 16,
      color: '#10B981',
      marginBottom: 16,
      fontStyle: 'italic',
    },
    processButton: {
      backgroundColor: '#10B981',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    processButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    exampleQueriesCard: {
      backgroundColor: theme.surfaceSecondary,
      padding: 16,
      borderRadius: 12,
      marginTop: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    exampleTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    exampleQuery: {
      backgroundColor: theme.surface,
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },
    exampleText: {
      fontSize: 14,
      color: theme.textTertiary,
    },
    voiceAssistantNote: {
      backgroundColor: theme.surfaceSecondary,
      margin: 16,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#10B981',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    noteHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    noteTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#10B981',
      marginLeft: 8,
    },
    noteText: {
      fontSize: 14,
      color: theme.textTertiary,
      lineHeight: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: isArabic ? 'الذكاء الاصطناعي' : 'AI Power Features',
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: '#FFFFFF',
        }} 
      />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'negotiator' && styles.activeTab]}
          onPress={() => setActiveTab('negotiator')}
        >
          <Text style={[styles.tabText, activeTab === 'negotiator' && styles.activeTabText]}>
            {isArabic ? 'المفاوض' : 'Negotiator'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'simulator' && styles.activeTab]}
          onPress={() => setActiveTab('simulator')}
        >
          <Text style={[styles.tabText, activeTab === 'simulator' && styles.activeTabText]}>
            {isArabic ? 'المحاكي' : 'Simulator'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'negotiator' && renderNegotiator()}
        {activeTab === 'simulator' && renderSimulator()}
        
        <View style={styles.voiceAssistantNote}>
          <View style={styles.noteHeader}>
            <Lightbulb size={20} color="#10B981" />
            <Text style={styles.noteTitle}>
              {isArabic ? 'نصيحة: المساعد الصوتي' : 'Tip: Voice Assistant'}
            </Text>
          </View>
          <Text style={styles.noteText}>
            {isArabic 
              ? 'استخدم المساعد الصوتي في أسفل الشاشة للحصول على إجابات فورية حول فواتيرك، العروض القريبة، ومقارنة الأسعار. اضغط على الأيقونة الزرقاء واسأل أي سؤال!'
              : 'Use the voice assistant at the bottom of the screen for instant answers about your bills, nearby deals, and price comparisons. Tap the blue icon and ask any question!'
            }
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}