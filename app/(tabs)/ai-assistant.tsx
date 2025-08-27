import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView
} from 'react-native';
import { 
  Send, 
  Camera, 
  Mic, 
  MicOff, 
  Image as ImageIcon,
  FileText,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react-native';
import { Stack } from 'expo-router';
import { useApp } from '@/hooks/useAppStore';
import { VoiceResponse } from '@/hooks/useVoiceAssistant';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUri?: string;
  response?: VoiceResponse;
}

interface FeatureSheet {
  visible: boolean;
  feature: string;
  title: string;
  description: string;
}

export default function AIAssistantScreen() {
  const { userData, theme, authUser } = useApp();
  const isArabic = userData.language === 'ar';
  const userRole = authUser?.role || 'individual';
  const [state] = useState<'idle' | 'processing'>('idle');
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: isArabic 
        ? 'مرحباً! أنا تموين، مساعدك الذكي. يمكنني مساعدتك في إدارة الفواتير، العثور على العروض، مقارنة الأسعار، والتنقل بين الميزات. أرسل لي صورة فاتورة، أو اكتب أو تحدث معي!'
        : 'Hello! I\'m Tamween, your smart assistant. I can help you manage bills, find deals, compare prices, and navigate features. Send me a bill photo, or type or speak to me!',
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [featureSheet, setFeatureSheet] = useState<FeatureSheet>({
    visible: false,
    feature: '',
    title: '',
    description: ''
  });
  
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendText = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = inputText.trim();
    setInputText('');
    
    // Add user message
    addMessage({
      type: 'user',
      content: userMessage
    });
    
    // Simulate processing with mock response
    const mockResponse: VoiceResponse = {
      intent: 'Unknown',
      text: isArabic 
        ? 'شكراً لرسالتك! أنا هنا لمساعدتك في إدارة الفواتير والعثور على العروض.'
        : 'Thanks for your message! I\'m here to help you manage bills and find deals.',
      action: userMessage.toLowerCase().includes('bill') ? 'navigate' : undefined,
      targetFeature: userMessage.toLowerCase().includes('bill') ? 'bills' : undefined
    };
    
    // Add assistant response
    addMessage({
      type: 'assistant',
      content: mockResponse.text,
      response: mockResponse
    });
    
    // Show feature sheet if navigating to a feature
    if (mockResponse.action === 'navigate' && mockResponse.targetFeature) {
      showFeatureSheet(mockResponse.targetFeature, mockResponse.text);
    }
  };

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          isArabic ? 'إذن مطلوب' : 'Permission Required',
          isArabic ? 'نحتاج إذن للوصول إلى الصور' : 'We need permission to access your photos'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
        // Add user message with image
        addMessage({
          type: 'user',
          content: isArabic ? 'صورة فاتورة' : 'Bill image',
          imageUri
        });
        
        // Simulate bill recognition
        const mockBillResponse: VoiceResponse = {
          intent: 'BillCapture',
          text: isArabic 
            ? 'تم التعرف على فاتورة الكهرباء بمبلغ 45.50 دينار، تاريخ الاستحقاق 2024-09-15. تم حفظها في قسم الفواتير.'
            : 'Recognized electricity bill for BD 45.50, due 2024-09-15. Saved to Bills section.',
          action: 'save',
          targetFeature: 'bills',
          data: {
            amount: 45.50,
            dueDate: '2024-09-15',
            type: 'Electricity Bill',
            company: 'Electricity & Water Authority',
            category: 'electricity'
          }
        };
        
        // Add assistant response
        addMessage({
          type: 'assistant',
          content: mockBillResponse.text,
          response: mockBillResponse
        });
        
        // Show feature sheet if saving to bills
        if (mockBillResponse.action === 'save' && mockBillResponse.targetFeature === 'bills') {
          showFeatureSheet('bills', mockBillResponse.text);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'فشل في تحديد الصورة' : 'Failed to pick image'
      );
    }
  };

  const handleCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          isArabic ? 'إذن مطلوب' : 'Permission Required',
          isArabic ? 'نحتاج إذن للوصول إلى الكاميرا' : 'We need permission to access your camera'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
        // Add user message with image
        addMessage({
          type: 'user',
          content: isArabic ? 'صورة فاتورة من الكاميرا' : 'Bill photo from camera',
          imageUri
        });
        
        // Simulate bill recognition
        const mockBillResponse: VoiceResponse = {
          intent: 'BillCapture',
          text: isArabic 
            ? 'تم التعرف على فاتورة الكهرباء بمبلغ 45.50 دينار، تاريخ الاستحقاق 2024-09-15. تم حفظها في قسم الفواتير.'
            : 'Recognized electricity bill for BD 45.50, due 2024-09-15. Saved to Bills section.',
          action: 'save',
          targetFeature: 'bills',
          data: {
            amount: 45.50,
            dueDate: '2024-09-15',
            type: 'Electricity Bill',
            company: 'Electricity & Water Authority',
            category: 'electricity'
          }
        };
        
        // Add assistant response
        addMessage({
          type: 'assistant',
          content: mockBillResponse.text,
          response: mockBillResponse
        });
        
        // Show feature sheet if saving to bills
        if (mockBillResponse.action === 'save' && mockBillResponse.targetFeature === 'bills') {
          showFeatureSheet('bills', mockBillResponse.text);
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'فشل في التقاط الصورة' : 'Failed to take photo'
      );
    }
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      setIsRecording(false);
      // Voice processing will be handled by the voice assistant hook
    } else {
      setIsRecording(true);
      // Start voice recording - this would integrate with the voice assistant
      addMessage({
        type: 'user',
        content: isArabic ? 'رسالة صوتية...' : 'Voice message...'
      });
      
      // Simulate voice processing
      setTimeout(() => {
        setIsRecording(false);
        const mockVoiceResponse: VoiceResponse = {
          intent: 'NearbyStore',
          text: isArabic 
            ? 'أقرب متجر هو لولو هايبرماركت على بعد 0.8 كيلومتر. ساعات العمل من 8AM - 12AM'
            : 'The nearest store is LuLu Hypermarket, 0.8km away. Open 8AM - 12AM',
          data: { stores: [{ name: 'LuLu Hypermarket', distance: 0.8, hours: '8AM - 12AM', address: 'Seef District' }] }
        };
        
        addMessage({
          type: 'assistant',
          content: mockVoiceResponse.text,
          response: mockVoiceResponse
        });
      }, 2000);
    }
  };

  const showFeatureSheet = (feature: string, description: string) => {
    const featureNames: Record<string, { en: string; ar: string }> = {
      bills: { en: 'Bills Management', ar: 'إدارة الفواتير' },
      health: { en: 'Health & Hospital', ar: 'الصحة والمستشفيات' },
      banking: { en: 'Banking & Finance', ar: 'البنوك والمالية' },
      family: { en: 'Family Notes', ar: 'ملاحظات العائلة' }
    };
    
    const featureName = featureNames[feature];
    if (featureName) {
      setFeatureSheet({
        visible: true,
        feature,
        title: isArabic ? featureName.ar : featureName.en,
        description
      });
    }
  };

  const handleUseFeature = () => {
    setFeatureSheet(prev => ({ ...prev, visible: false }));
    const featurePath = featureSheet.feature as any;
    router.push(featurePath);
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.type === 'user';
    
    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.assistantMessage,
          { alignSelf: isUser ? 'flex-end' : 'flex-start' }
        ]}
      >
        {!isUser && (
          <View style={styles.assistantAvatar}>
            <Zap size={16} color="#10B981" />
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? [styles.userBubble, { backgroundColor: theme.primary }] : [styles.assistantBubble, { backgroundColor: theme.surfaceSecondary }]
        ]}>
          {message.imageUri && (
            <Image source={{ uri: message.imageUri }} style={styles.messageImage} />
          )}
          
          <Text style={[
            styles.messageText,
            isUser ? styles.userText : [styles.assistantText, { color: theme.text }]
          ]}>
            {message.content}
          </Text>
          
          {message.response?.action && (
            <View style={styles.actionIndicator}>
              {message.response.action === 'save' && <CheckCircle size={14} color="#10B981" />}
              {message.response.action === 'navigate' && <FileText size={14} color="#3B82F6" />}
              {message.response.action === 'remind' && <AlertCircle size={14} color="#F59E0B" />}
              <Text style={styles.actionText}>
                {message.response.action === 'save' && (isArabic ? 'تم الحفظ' : 'Saved')}
                {message.response.action === 'navigate' && (isArabic ? 'فتح الميزة' : 'Opening feature')}
                {message.response.action === 'remind' && (isArabic ? 'تم التذكير' : 'Reminder set')}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{ 
          title: userRole === 'family' 
            ? (isArabic ? 'المستشار المالي العائلي' : 'Family Financial Advisor')
            : userRole === 'business'
            ? (isArabic ? 'مساعد الأعمال الذكي' : 'Business AI Assistant')
            : (isArabic ? 'مساعد تموين الذكي' : 'Tamween AI Assistant'),
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.text,
        }} 
      />
      
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={styles.headerContent}>
          <View style={styles.aiIndicator}>
            <Zap size={20} color={theme.primary} />
          </View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {isArabic ? 'مساعد تموين الذكي' : 'Tamween AI Assistant'}
          </Text>
        </View>
        <Text style={[styles.headerSubtitle, { color: theme.textTertiary }]}>
          {isArabic ? 'صور • صوت • نص' : 'Photos • Voice • Text'}
        </Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          
          {false && (
            <View style={[styles.messageContainer, styles.assistantMessage]}>
              <View style={styles.assistantAvatar}>
                <Zap size={16} color="#10B981" />
              </View>
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <Text style={[styles.messageText, styles.assistantText]}>
                  {isArabic ? 'جاري المعالجة...' : 'Processing...'}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.surfaceSecondary }]}
              onPress={handleCamera}
            >
              <Camera size={20} color={theme.textTertiary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.surfaceSecondary }]}
              onPress={handleImagePicker}
            >
              <ImageIcon size={20} color={theme.textTertiary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.surfaceSecondary },
                isRecording && styles.recordingButton
              ]}
              onPress={handleVoiceToggle}
            >
              {isRecording ? (
                <MicOff size={20} color="white" />
              ) : (
                <Mic size={20} color={theme.textTertiary} />
              )}
            </TouchableOpacity>
            
            <TextInput
              ref={inputRef}
              style={[styles.textInput, { backgroundColor: theme.surfaceSecondary, color: theme.text }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder={isArabic ? 'اكتب رسالتك...' : 'Type your message...'}
              placeholderTextColor={theme.textTertiary}
              multiline
              maxLength={500}
              textAlign={isArabic ? 'right' : 'left'}
            />
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: theme.primary },
                !inputText.trim() && [styles.sendButtonDisabled, { backgroundColor: theme.surfaceSecondary }]
              ]}
              onPress={handleSendText}
              disabled={!inputText.trim()}
            >
              <Send size={20} color={inputText.trim() ? 'white' : theme.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Feature Sheet Modal */}
      {featureSheet.visible && (
        <View style={styles.featureSheetOverlay}>
          <View style={[styles.featureSheet, { backgroundColor: theme.surface }]}>
            <Text style={[styles.featureSheetTitle, { color: theme.text }]}>{featureSheet.title}</Text>
            <Text style={[styles.featureSheetDescription, { color: theme.textSecondary }]}>{featureSheet.description}</Text>
            
            <View style={styles.featureSheetActions}>
              <TouchableOpacity
                style={[styles.featureSheetCancel, { backgroundColor: theme.surfaceSecondary }]}
                onPress={() => setFeatureSheet(prev => ({ ...prev, visible: false }))}
              >
                <Text style={[styles.featureSheetCancelText, { color: theme.textSecondary }]}>
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.featureSheetUse, { backgroundColor: theme.primary }]}
                onPress={handleUseFeature}
              >
                <Text style={styles.featureSheetUseText}>
                  {isArabic ? 'استخدم الآن' : 'Use Now'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    marginLeft: 44,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '100%',
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  assistantText: {
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
  },
  actionText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 6,
  },
  inputContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingButton: {
    backgroundColor: '#EF4444',
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
  },
  featureSheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  featureSheet: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  featureSheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  featureSheetDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  featureSheetActions: {
    flexDirection: 'row',
    gap: 12,
  },
  featureSheetCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  featureSheetCancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  featureSheetUse: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  featureSheetUseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});