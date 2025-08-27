import { useState } from 'react';
import { Platform, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { useApp } from './useAppStore';
import { router } from 'expo-router';
import { GoogleAPIService } from '@/constants/mockData';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export type VoiceIntent = 
  | 'NearbyStore'
  | 'NearbyDeals'
  | 'PriceCompare'
  | 'BestThing'
  | 'HandsFreeToggle'
  | 'AddToNotes'
  | 'FeatureAdvisor'
  | 'BillCapture'
  | 'FeatureNavigation'
  | 'BillReminder'
  | 'Unknown';

export interface VoiceResponse {
  intent: VoiceIntent;
  text: string;
  data?: any;
  action?: 'navigate' | 'save' | 'remind' | 'capture';
  targetFeature?: string;
}

export interface BillData {
  amount: number;
  dueDate: string;
  type: string;
  company: string;
  category: 'electricity' | 'water' | 'internet' | 'phone' | 'gas' | 'other';
}

export interface MultimodalInput {
  type: 'voice' | 'text' | 'image';
  content: string;
  imageUri?: string;
  language?: 'en' | 'ar';
}

export interface Store {
  name: string;
  distance: number;
  hours: string;
  address: string;
}

export interface PriceComparison {
  item: string;
  stores: {
    name: string;
    price: number;
    distance: number;
    hours: string;
  }[];
}

const mockStores: Store[] = [
  { name: 'LuLu Hypermarket', distance: 0.8, hours: '8AM - 12AM', address: 'Seef District' },
  { name: 'Carrefour City Centre', distance: 1.2, hours: '10AM - 12AM', address: 'City Centre Bahrain' },
  { name: 'Mega Mart', distance: 2.1, hours: '7AM - 11PM', address: 'Budaiya Highway' }
];

const mockPrices: Record<string, PriceComparison> = {
  rice: {
    item: 'Rice (5kg)',
    stores: [
      { name: 'LuLu Hypermarket', price: 3.5, distance: 0.8, hours: '8AM - 12AM' },
      { name: 'Carrefour', price: 4.2, distance: 1.2, hours: '10AM - 12AM' },
      { name: 'Mega Mart', price: 3.8, distance: 2.1, hours: '7AM - 11PM' }
    ]
  },
  milk: {
    item: 'Milk (1L)',
    stores: [
      { name: 'LuLu Hypermarket', price: 0.8, distance: 0.8, hours: '8AM - 12AM' },
      { name: 'Carrefour', price: 0.9, distance: 1.2, hours: '10AM - 12AM' },
      { name: 'Mega Mart', price: 0.85, distance: 2.1, hours: '7AM - 11PM' }
    ]
  }
};

export function useVoiceAssistant() {
  const [state, setState] = useState<VoiceState>('idle');
  const [isHandsFreeMode, setIsHandsFreeMode] = useState(false);
  const [lastResponse, setLastResponse] = useState<VoiceResponse | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [webRecognition, setWebRecognition] = useState<any>(null);
  
  // Always call hooks unconditionally
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const { userData } = useApp();
  const isArabic = userData.language === 'ar';

  const startListening = async () => {
    try {
      // Prevent multiple recordings
      if (recording) {
        console.log('Recording already in progress');
        return;
      }

      if (Platform.OS !== 'web') {
        await Haptics.selectionAsync();
      }

      // Check and request permission properly
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..');
        const newPermission = await requestPermission();
        if (newPermission.status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Microphone permission is required to use voice features. Please enable it in your device settings.',
            [{ text: 'OK' }]
          );
          return;
        }
      }

      // Handle web recording with real Web Speech API
      if (Platform.OS === 'web') {
        try {
          // Clean up any existing recognition first
          if (webRecognition) {
            try {
              webRecognition.abort();
            } catch (e) {
              console.log('Error aborting previous recognition:', e);
            }
            setWebRecognition(null);
          }
          
          // Use Web Speech API for real-time speech recognition
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          if (!SpeechRecognition) {
            throw new Error('Speech recognition not supported');
          }
          
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = isArabic ? 'ar-SA' : 'en-US';
          recognition.maxAlternatives = 1;
          
          // Store recognition instance
          setWebRecognition(recognition);
          
          recognition.onstart = () => {
            setState('listening');
            console.log('Web speech recognition started');
          };
          
          recognition.onresult = (event: any) => {
            try {
              if (event.results && event.results.length > 0) {
                const transcript = event.results[0][0].transcript;
                console.log('Web speech recognition result:', transcript);
                setState('processing');
                // Clean up recognition
                setWebRecognition(null);
                // Process immediately for real-time feel
                processVoiceCommand(transcript);
              }
            } catch (resultError) {
              console.error('Error processing speech result:', resultError);
              setState('idle');
              setWebRecognition(null);
            }
          };
          
          recognition.onerror = (event: any) => {
            console.error('Web speech recognition error:', event.error);
            setState('idle');
            setWebRecognition(null);
            
            // Handle different error types
            if (event.error === 'aborted') {
              console.log('Speech recognition was aborted - this is normal when stopping');
              return;
            }
            
            if (event.error === 'no-speech') {
              Alert.alert(
                'No Speech Detected',
                'Please speak clearly and try again.',
                [{ text: 'OK' }]
              );
              return;
            }
            
            if (event.error === 'not-allowed') {
              Alert.alert(
                'Microphone Permission Denied',
                'Please allow microphone access and try again.',
                [{ text: 'OK' }]
              );
              return;
            }
            
            Alert.alert(
              'Speech Recognition Error',
              `Error: ${event.error}. Please try again.`,
              [{ text: 'OK' }]
            );
          };
          
          recognition.onend = () => {
            console.log('Web speech recognition ended');
            setWebRecognition(null);
            if (state === 'listening') {
              setState('idle');
            }
          };
          
          // Start recognition
          recognition.start();
          return;
        } catch (webError) {
          console.error('Web speech recognition not available:', webError);
          setState('idle');
          setWebRecognition(null);
          Alert.alert(
            'Speech Recognition Not Available',
            'Your browser does not support speech recognition. Please use a supported browser like Chrome.',
            [{ text: 'OK' }]
          );
          return;
        }
      }

      // Configure audio session properly for iOS
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      console.log('Starting recording..');
      const { recording: newRecording } = await Audio.Recording.createAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });
      
      setRecording(newRecording);
      setState('listening');
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
      setState('idle');
      
      // More specific error messages
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage?.includes('Permission denied') || errorMessage?.includes('NotAllowedError')) {
        Alert.alert(
          'Permission Denied',
          'Microphone permission is required. Please enable it in your device settings and try again.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to start recording. Please try again.');
      }
    }
  };

  const stopListening = async () => {
    try {
      console.log('Stopping recording..');
      
      // Handle web differently - properly stop Web Speech API
      if (Platform.OS === 'web') {
        if (webRecognition) {
          try {
            webRecognition.stop(); // Use stop() instead of abort() for graceful shutdown
          } catch (e) {
            console.log('Error stopping web recognition:', e);
          }
        }
        setState('idle');
        return;
      }
      
      setState('processing');
      
      if (!recording) {
        console.log('No recording to stop');
        setState('idle');
        return;
      }
      
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      console.log('Recording completed, URI:', uri);
      
      // Clean up recording object first
      setRecording(null);
      
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      
      console.log('Recording stopped and stored at', uri);
      
      if (uri) {
        await processAudio(uri);
      } else {
        setState('idle');
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      setRecording(null);
      setState('idle');
    }
  };

  const processAudio = async (audioUri: string) => {
    try {
      if (Platform.OS === 'web') {
        // Web processing is handled by the Web Speech API in startListening
        setState('idle');
        return;
      }

      console.log('Processing audio with real API...');
      const formData = new FormData();
      const uriParts = audioUri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      console.log('Audio file info:', { audioUri, fileType });

      const audioFile = {
        uri: audioUri,
        name: "recording." + fileType,
        type: "audio/" + fileType
      } as any;

      formData.append('audio', audioFile);
      console.log('FormData prepared with audio file');
      if (isArabic) {
        formData.append('language', 'ar');
      }

      // Real API call to speech-to-text with streaming support
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch('https://toolkit.rork.com/stt/transcribe/', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Speech-to-text result:', result);
      
      if (result.text && result.text.trim().length > 0) {
        // Process immediately for real-time feel - no delay
        processVoiceCommand(result.text);
      } else {
        console.warn('Empty or no text received from speech-to-text:', result);
        // Try with a fallback message
        const fallbackText = isArabic ? 'مرحباً، كيف يمكنني مساعدتك؟' : 'Hello, how can I help you?';
        processVoiceCommand(fallbackText);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      setState('idle');
      
      // More detailed error handling
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('Detailed error:', errorMessage);
      
      if (errorMessage.includes('No text received') || errorMessage.includes('aborted')) {
        // Audio was recorded but no speech detected or timeout
        Alert.alert(
          isArabic ? 'لم يتم اكتشاف كلام' : 'No Speech Detected',
          isArabic ? 'لم نتمكن من سماع أي كلام. تأكد من التحدث بوضوح وحاول مرة أخرى.' : 'We couldn\'t hear any speech. Please speak clearly and try again.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          isArabic ? 'خطأ في التعرف على الصوت' : 'Speech Recognition Error',
          isArabic ? 'لم نتمكن من معالجة الصوت. يرجى المحاولة مرة أخرى.' : 'Could not process audio. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const processMultimodalInput = async (input: MultimodalInput) => {
    setState('processing');
    console.log('Processing multimodal input:', input);
    
    try {
      let response: VoiceResponse;
      
      if (input.type === 'image') {
        response = await processImageInput(input);
      } else {
        response = await processTextInput(input.content);
      }
      
      // Handle navigation and actions based on response
      await handleResponseAction(response);
      
      setLastResponse(response);
      await speakResponse(response.text);
      
    } catch (error) {
      console.error('Error processing multimodal input:', error);
      setState('idle');
      Alert.alert('Error', 'Failed to process input');
    }
  };

  const processImageInput = async (input: MultimodalInput): Promise<VoiceResponse> => {
    // For demo purposes, simulate bill recognition
    // In production, integrate with Gemini Vision API
    const mockBillData: BillData = {
      amount: 45.50,
      dueDate: '2024-09-15',
      type: 'Electricity Bill',
      company: 'Electricity & Water Authority',
      category: 'electricity'
    };
    
    const responseText = isArabic 
      ? `تم التعرف على فاتورة الكهرباء بمبلغ ${mockBillData.amount} دينار، تاريخ الاستحقاق ${mockBillData.dueDate}. تم حفظها في قسم الفواتير.`
      : `Recognized electricity bill for BD ${mockBillData.amount}, due ${mockBillData.dueDate}. Saved to Bills section.`;
    
    return {
      intent: 'BillCapture',
      text: responseText,
      data: mockBillData,
      action: 'save',
      targetFeature: 'bills'
    };
  };

  const processTextInput = async (text: string): Promise<VoiceResponse> => {
    try {
      console.log('Processing text with AI:', text);
      
      // First try to get AI response
      const aiResponse = await getAIResponse(text);
      if (aiResponse) {
        // Parse AI response for intent and actions
        const intent = detectIntent(text);
        return {
          intent,
          text: aiResponse,
          action: getActionFromIntent(intent),
          targetFeature: getTargetFeatureFromIntent(intent)
        };
      }
    } catch (error) {
      console.error('AI processing failed, using fallback:', error);
    }
    
    // Fallback to rule-based processing
    const intent = detectIntent(text);
    
    switch (intent) {
      case 'NearbyStore':
        return await handleNearbyStore();
      case 'NearbyDeals':
        return await handleNearbyDeals();
      case 'PriceCompare':
        return await handlePriceCompare(text);
      case 'BestThing':
        return await handleBestThing();
      case 'HandsFreeToggle':
        return await handleHandsFreeToggle();
      case 'AddToNotes':
        return await handleAddToNotes(text);
      case 'FeatureAdvisor':
        return await handleFeatureAdvisor();
      case 'FeatureNavigation':
        return await handleFeatureNavigation(text);
      case 'BillReminder':
        return await handleBillReminder(text);
      default:
        return {
          intent: 'Unknown',
          text: isArabic 
            ? 'مرحباً! أنا تموين، مساعدك الذكي. يمكنني مساعدتك في إدارة الفواتير، العثور على العروض، مقارنة الأسعار، والتنقل بين الميزات. كيف يمكنني مساعدتك؟'
            : 'Hello! I\'m Tamween, your smart assistant. I can help you manage bills, find deals, compare prices, and navigate features. How can I help you?'
        };
    }
  };

  const processVoiceCommand = async (text: string) => {
    await processMultimodalInput({ type: 'voice', content: text });
  };

  const detectIntent = (text: string): VoiceIntent => {
    const lowerText = text.toLowerCase();
    
    // Bill-related patterns
    if (lowerText.includes('this is my bill') || lowerText.includes('bill') ||
        lowerText.includes('هذه فاتورتي') || lowerText.includes('فاتورة')) {
      return 'BillCapture';
    }
    
    // Bill reminder patterns
    if (lowerText.includes('remind me to pay') || lowerText.includes('bill reminder') ||
        lowerText.includes('ذكرني بدفع') || lowerText.includes('تذكير فاتورة')) {
      return 'BillReminder';
    }
    
    // Feature navigation patterns
    if (lowerText.includes('take me to') || lowerText.includes('open') || lowerText.includes('show me') ||
        lowerText.includes('خذني إلى') || lowerText.includes('افتح') || lowerText.includes('أرني')) {
      return 'FeatureNavigation';
    }
    
    // Hospital/Health patterns
    if (lowerText.includes('hospital') || lowerText.includes('health') ||
        lowerText.includes('المستشفى') || lowerText.includes('الصحة')) {
      return 'FeatureNavigation';
    }
    
    // Nearby Store patterns
    if (lowerText.includes('nearest store') || lowerText.includes('closest store') || 
        lowerText.includes('أقرب سوبرماركت') || lowerText.includes('أقرب متجر')) {
      return 'NearbyStore';
    }
    
    // Nearby Deals patterns
    if (lowerText.includes('deals near') || lowerText.includes('nearby deals') ||
        lowerText.includes('العروض القريبة') || lowerText.includes('عروض قريبة')) {
      return 'NearbyDeals';
    }
    
    // Price Compare patterns
    if (lowerText.includes('want to buy') || lowerText.includes('buy') ||
        lowerText.includes('أبي أشتري') || lowerText.includes('أريد أشتري')) {
      return 'PriceCompare';
    }
    
    // Best Thing patterns
    if (lowerText.includes('best thing') || lowerText.includes('best feature') ||
        lowerText.includes('أفضل ميزة') || lowerText.includes('أفضل شيء')) {
      return 'BestThing';
    }
    
    // Hands-free patterns
    if (lowerText.includes('hands-free') ||
        lowerText.includes('بدون استخدام اليدين')) {
      return 'HandsFreeToggle';
    }
    
    // Add to notes patterns
    if (lowerText.includes('add to notes') || lowerText.includes('add to my notes') ||
        lowerText.includes('أضيف للملاحظات') || lowerText.includes('أضف للقائمة')) {
      return 'AddToNotes';
    }
    
    // Feature Advisor patterns
    if (lowerText.includes('what feature') || lowerText.includes('help me with') ||
        lowerText.includes('شنو الميزة') || lowerText.includes('ساعدني')) {
      return 'FeatureAdvisor';
    }
    
    return 'Unknown';
  };

  const handleNearbyStore = async (): Promise<VoiceResponse> => {
    try {
      // Try to get real location
      if (Platform.OS !== 'web') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          const nearbyStores = await GoogleAPIService.findNearbyStores(
            location.coords.latitude,
            location.coords.longitude
          );
          
          if (nearbyStores.length > 0) {
            const nearestStore = nearbyStores[0];
            const responseText = isArabic 
              ? `أقرب متجر هو ${nearestStore.name} على بعد ${nearestStore.distance} كيلومتر في ${nearestStore.address}`
              : `The nearest store is ${nearestStore.name}, ${nearestStore.distance}km away at ${nearestStore.address}`;
            
            return {
              intent: 'NearbyStore',
              text: responseText,
              data: { stores: nearbyStores.slice(0, 3) }
            };
          }
        }
      }
    } catch (error) {
      console.error('Error getting location or nearby stores:', error);
    }
    
    // Fallback to mock data
    const nearestStore = mockStores[0];
    const responseText = isArabic 
      ? `أقرب متجر هو ${nearestStore.name} على بعد ${nearestStore.distance} كيلومتر. ساعات العمل من ${nearestStore.hours}`
      : `The nearest store is ${nearestStore.name}, ${nearestStore.distance}km away. Open ${nearestStore.hours}`;
    
    return {
      intent: 'NearbyStore',
      text: responseText,
      data: { stores: mockStores.slice(0, 3) }
    };
  };

  const handleNearbyDeals = async (): Promise<VoiceResponse> => {
    const responseText = isArabic 
      ? 'يوجد خصم 25% على البقالة في لولو و 30% على الإلكترونيات في كارفور'
      : 'There\'s 25% off groceries at LuLu and 30% off electronics at Carrefour';
    
    // Navigate to deals page
    router.push('/shopping');
    
    return {
      intent: 'NearbyDeals',
      text: responseText
    };
  };

  const handlePriceCompare = async (text: string): Promise<VoiceResponse> => {
    // Extract item from text
    let item = 'rice'; // default
    if (text.toLowerCase().includes('milk') || text.includes('حليب')) {
      item = 'milk';
    }
    
    const comparison = mockPrices[item];
    if (!comparison) {
      return {
        intent: 'PriceCompare',
        text: isArabic ? 'عذراً، لا يمكنني العثور على أسعار لهذا المنتج' : 'Sorry, I couldn\'t find prices for that item'
      };
    }
    
    const bestPrice = comparison.stores.reduce((min, store) => 
      store.price < min.price ? store : min
    );
    
    const responseText = isArabic 
      ? `أفضل سعر لـ${comparison.item} هو ${bestPrice.price} دينار في ${bestPrice.name}`
      : `Best price for ${comparison.item} is BD ${bestPrice.price} at ${bestPrice.name}`;
    
    return {
      intent: 'PriceCompare',
      text: responseText,
      data: comparison
    };
  };

  const handleBestThing = async (): Promise<VoiceResponse> => {
    const responseText = isArabic 
      ? 'أفضل ميزة في التطبيق هي مستشار البطاقات الذكي الذي يوفر لك المال. هل تريد فتحه الآن؟'
      : 'The best feature in the app is the Smart Card Advisor that saves you money. Would you like to open it now?';
    
    return {
      intent: 'BestThing',
      text: responseText,
      data: { feature: 'banking', action: 'open' }
    };
  };

  const handleHandsFreeToggle = async (): Promise<VoiceResponse> => {
    setIsHandsFreeMode(!isHandsFreeMode);
    const responseText = isArabic 
      ? `تم ${!isHandsFreeMode ? 'تفعيل' : 'إلغاء'} الوضع بدون استخدام اليدين`
      : `Hands-free mode ${!isHandsFreeMode ? 'enabled' : 'disabled'}`;
    
    return {
      intent: 'HandsFreeToggle',
      text: responseText
    };
  };

  const handleAddToNotes = async (text: string): Promise<VoiceResponse> => {
    // Extract items from text
    const items = extractItemsFromText(text);
    const responseText = isArabic 
      ? `تم إضافة ${items.join('، ')} إلى قائمة التسوق العائلية`
      : `Added ${items.join(', ')} to family shopping list`;
    
    return {
      intent: 'AddToNotes',
      text: responseText,
      data: { items }
    };
  };

  const handleFeatureAdvisor = async (): Promise<VoiceResponse> => {
    const responseText = isArabic 
      ? 'يمكن لميزة تتبع الدعم مساعدتك في مراقبة استهلاكك وتوفير المال'
      : 'The Subsidy Tracker feature can help you monitor your usage and save money';
    
    router.push('/subsidies');
    
    return {
      intent: 'FeatureAdvisor',
      text: responseText
    };
  };

  const extractItemsFromText = (text: string): string[] => {
    const commonItems = {
      'eggs': 'بيض',
      'bread': 'خبز', 
      'milk': 'حليب',
      'rice': 'رز',
      'chicken': 'دجاج',
      'tomatoes': 'طماطم'
    };
    
    const items: string[] = [];
    const lowerText = text.toLowerCase();
    
    Object.entries(commonItems).forEach(([en, ar]) => {
      if (lowerText.includes(en) || lowerText.includes(ar)) {
        items.push(isArabic ? ar : en);
      }
    });
    
    return items.length > 0 ? items : [isArabic ? 'عناصر' : 'items'];
  };

  const speakResponse = async (text: string) => {
    setState('speaking');
    
    try {
      // For web, use Web Speech API
      if (Platform.OS === 'web') {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = isArabic ? 'ar-SA' : 'en-US';
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          
          utterance.onend = () => {
            setState('idle');
          };
          
          utterance.onerror = () => {
            setState('idle');
          };
          
          window.speechSynthesis.speak(utterance);
        } else {
          // Fallback for browsers without speech synthesis
          setTimeout(() => {
            setState('idle');
          }, 2000);
        }
        return;
      }
      
      // For mobile, use expo-speech
      const speechOptions = {
        language: isArabic ? 'ar-SA' : 'en-US',
        pitch: 1.0,
        rate: 0.8,
        quality: Speech.VoiceQuality.Enhanced,
        onDone: () => {
          setState('idle');
        },
        onError: (error: any) => {
          console.error('Speech error:', error);
          setState('idle');
        },
        onStopped: () => {
          setState('idle');
        }
      };
      
      await Speech.speak(text, speechOptions);
      
    } catch (error) {
      console.error('Error in text-to-speech:', error);
      // Fallback - just wait and complete
      setTimeout(() => {
        setState('idle');
      }, 2000);
    }
  };

  const handleFeatureNavigation = async (text: string): Promise<VoiceResponse> => {
    const lowerText = text.toLowerCase();
    let targetFeature = '';
    let responseText = '';
    
    // Detect target feature from text
    if (lowerText.includes('hospital') || lowerText.includes('health') || lowerText.includes('المستشفى') || lowerText.includes('الصحة')) {
      targetFeature = 'health';
      responseText = isArabic ? 'فتح قسم الصحة والمستشفيات' : 'Opening Health & Hospital section';
    } else if (lowerText.includes('bank') || lowerText.includes('banking') || lowerText.includes('البنك') || lowerText.includes('المصرفية')) {
      targetFeature = 'banking';
      responseText = isArabic ? 'فتح قسم البنوك والعروض المصرفية' : 'Opening Banking & Finance deals';
    } else if (lowerText.includes('family') || lowerText.includes('notes') || lowerText.includes('العائلة') || lowerText.includes('الملاحظات')) {
      targetFeature = 'family';
      responseText = isArabic ? 'فتح ملاحظات العائلة' : 'Opening Family Notes';
    } else if (lowerText.includes('bills') || lowerText.includes('الفواتير')) {
      targetFeature = 'bills';
      responseText = isArabic ? 'فتح قسم الفواتير' : 'Opening Bills section';
    } else {
      responseText = isArabic ? 'لم أتمكن من تحديد الميزة المطلوبة' : 'Could not identify the requested feature';
    }
    
    return {
      intent: 'FeatureNavigation',
      text: responseText,
      action: 'navigate',
      targetFeature
    };
  };

  const handleBillReminder = async (text: string): Promise<VoiceResponse> => {
    // Extract bill type from text
    const lowerText = text.toLowerCase();
    let billType = 'bill';
    
    if (lowerText.includes('water') || lowerText.includes('الماء')) {
      billType = 'water bill';
    } else if (lowerText.includes('electricity') || lowerText.includes('الكهرباء')) {
      billType = 'electricity bill';
    } else if (lowerText.includes('internet') || lowerText.includes('الإنترنت')) {
      billType = 'internet bill';
    }
    
    const responseText = isArabic 
      ? `تم إنشاء تذكير لدفع ${billType === 'water bill' ? 'فاتورة الماء' : billType === 'electricity bill' ? 'فاتورة الكهرباء' : billType === 'internet bill' ? 'فاتورة الإنترنت' : 'الفاتورة'}`
      : `Created reminder to pay ${billType}`;
    
    return {
      intent: 'BillReminder',
      text: responseText,
      data: { billType, reminderDate: new Date().toISOString() },
      action: 'remind'
    };
  };

  const getAIResponse = async (text: string): Promise<string | null> => {
    try {
      const systemPrompt = isArabic 
        ? `أنت تموين، المساعد الذكي لتطبيق تموين البحرين. يمكنك مساعدة المستخدمين في:
- إدارة الفواتير والتذكيرات
- العثور على أفضل العروض والأسعار
- التنقل بين ميزات التطبيق
- مقارنة الأسعار بين المتاجر
- تتبع الدعم الحكومي

أجب بشكل مفيد ومختصر باللغة العربية.`
        : `You are Tamween, the smart assistant for the Tamween Bahrain app. You can help users with:
- Managing bills and reminders
- Finding best deals and prices
- Navigating app features
- Comparing prices across stores
- Tracking government subsidies

Respond helpfully and concisely in English.`;

      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('AI response:', result);
      return result.completion || null;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return null;
    }
  };

  const getActionFromIntent = (intent: VoiceIntent): 'navigate' | 'save' | 'remind' | undefined => {
    switch (intent) {
      case 'FeatureNavigation':
      case 'NearbyDeals':
      case 'BestThing':
      case 'FeatureAdvisor':
        return 'navigate';
      case 'BillCapture':
      case 'AddToNotes':
        return 'save';
      case 'BillReminder':
        return 'remind';
      default:
        return undefined;
    }
  };

  const getTargetFeatureFromIntent = (intent: VoiceIntent): string | undefined => {
    switch (intent) {
      case 'NearbyDeals':
        return '/shopping';
      case 'BestThing':
        return '/banking';
      case 'FeatureAdvisor':
        return '/subsidies';
      default:
        return undefined;
    }
  };

  const handleResponseAction = async (response: VoiceResponse) => {
    switch (response.action) {
      case 'navigate':
        if (response.targetFeature) {
          const targetPath = response.targetFeature as any;
          router.push(targetPath);
        }
        break;
      case 'save':
        // In a real app, save data to appropriate storage
        console.log('Saving data:', response.data);
        break;
      case 'remind':
        // In a real app, create reminder/notification
        console.log('Creating reminder:', response.data);
        break;
    }
    
    // Legacy navigation handling
    switch (response.intent) {
      case 'NearbyDeals':
        router.push('/shopping');
        break;
      case 'BestThing':
        router.push('/banking');
        break;
      case 'FeatureAdvisor':
        router.push('/subsidies');
        break;
      case 'HandsFreeToggle':
        setIsHandsFreeMode(!isHandsFreeMode);
        break;
    }
  };

  const toggleListening = async () => {
    if (state === 'listening') {
      await stopListening();
    } else if (state === 'idle') {
      await startListening();
    }
  };

  return {
    state,
    isHandsFreeMode,
    lastResponse,
    startListening,
    stopListening,
    toggleListening,
    setIsHandsFreeMode,
    processMultimodalInput,
    processTextInput
  };
}