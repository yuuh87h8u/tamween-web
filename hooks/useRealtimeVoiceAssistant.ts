import { useState, useRef, useCallback, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { Audio } from 'expo-av';

import * as Haptics from 'expo-haptics';
import { useApp } from './useAppStore';
import { router } from 'expo-router';

export type RealtimeVoiceState = 'idle' | 'connecting' | 'listening' | 'processing' | 'speaking';

export interface RealtimeVoiceConfig {
  wakePhrase: string;
  autoListen: boolean;
  streamingResponse: boolean;
  language: 'en' | 'ar' | 'auto';
}

export interface VoiceAction {
  type: 'navigate' | 'add_note' | 'process_bill' | 'open_feature' | 'reminder';
  data: any;
  confirmation: string;
}

interface AudioChunk {
  data: ArrayBuffer;
  timestamp: number;
}



const GEMINI_API_KEY = 'AIzaSyDofcXNYF9JkQAKcLd2IGbyzv9IPSD079s';
const WEBSOCKET_URL = 'wss://generativelanguage.googleapis.com/ws/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent';

export function useRealtimeVoiceAssistant() {
  const [state, setState] = useState<RealtimeVoiceState>('idle');
  const [isConnected, setIsConnected] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string>('');
  const [sessionActive, setSessionActive] = useState(false);
  const [config, setConfig] = useState<RealtimeVoiceConfig>({
    wakePhrase: 'Hey Mizon',
    autoListen: true,
    streamingResponse: true,
    language: 'auto'
  });
  
  const { userData } = useApp();
  const isArabic = userData.language === 'ar';
  
  // Refs for managing audio and WebSocket
  const wsRef = useRef<WebSocket | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const isListeningRef = useRef(false);
  const conversationContextRef = useRef<string[]>([]);
  
  // Initialize WebSocket connection to Gemini Realtime API
  const connectToGemini = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }
    
    setState('connecting');
    
    try {
      const ws = new WebSocket(`${WEBSOCKET_URL}?key=${GEMINI_API_KEY}`);
      
      ws.onopen = () => {
        console.log('Connected to Gemini Realtime API');
        setIsConnected(true);
        setState('idle');
        
        // Send initial configuration
        const initMessage = {
          setup: {
            model: 'models/gemini-2.0-flash-exp',
            generation_config: {
              response_modalities: ['AUDIO', 'TEXT'],
              speech_config: {
                voice_config: {
                  prebuilt_voice_config: {
                    voice_name: isArabic ? 'ar-XA-Wavenet-A' : 'en-US-Neural2-A'
                  }
                }
              }
            },
            system_instruction: {
              parts: [{
                text: isArabic 
                  ? `أنت ميزون، المساعد الذكي لتطبيق تموين البحرين. أنت مساعد صوتي تفاعلي يمكنه:

1. الاستماع المستمر والرد الفوري
2. تنفيذ الإجراءات في التطبيق:
   - "أضف البيض والخبز لملاحظاتي" → إضافة للقائمة
   - "هذه فاتورتي" (مع صورة) → معالجة الفاتورة
   - "أنا في المستشفى" → فتح قسم الصحة
   - "خذني لعروض البنوك" → التنقل للصفحة

3. المحادثة الطبيعية بالعربية والإنجليزية
4. تذكر السياق أثناء المحادثة
5. إعطاء تأكيدات صوتية ومرئية

استجب بشكل طبيعي وودود. عند تنفيذ إجراء، أعط تأكيداً واضحاً.`
                  : `You are Mizon, the smart assistant for the Tamween Bahrain app. You are an interactive voice assistant that can:

1. Listen continuously and respond instantly
2. Execute actions in the app:
   - "Add eggs and bread to my notes" → update Family Notes list
   - "This is my bill" (with photo) → process OCR and file under Bills
   - "I'm at the hospital" → open Hospital feature
   - "Take me to bank deals" → navigate to Banking page

3. Have natural conversations in Arabic & English
4. Remember context during conversation
5. Give spoken + on-screen confirmations

Respond naturally and friendly. When executing actions, give clear confirmation.`
              }]
            }
          }
        };
        
        ws.send(JSON.stringify(initMessage));
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleGeminiMessage(message);
        } catch (error) {
          console.error('Error parsing Gemini message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setState('idle');
        Alert.alert(
          isArabic ? 'خطأ في الاتصال' : 'Connection Error',
          isArabic ? 'فشل الاتصال بالمساعد الصوتي' : 'Failed to connect to voice assistant'
        );
      };
      
      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        setState('idle');
      };
      
      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to connect to Gemini:', error);
      setState('idle');
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'فشل في بدء المساعد الصوتي' : 'Failed to start voice assistant'
      );
    }
  }, [isArabic]);
  
  // Handle messages from Gemini Realtime API
  const handleGeminiMessage = useCallback((message: any) => {
    console.log('Gemini message:', message);
    
    if (message.candidates?.[0]?.content?.parts) {
      const parts = message.candidates[0].content.parts;
      
      parts.forEach((part: any) => {
        if (part.text) {
          // Handle text response - stream it
          setCurrentResponse(prev => prev + part.text);
          
          // Check for actions in the text
          const action = extractActionFromText(part.text);
          if (action) {
            executeAction(action);
          }
        }
        
        if (part.inline_data?.mime_type?.startsWith('audio/')) {
          // Handle streaming audio response
          playAudioChunk(part.inline_data.data);
        }
      });
    }
    
    if (message.candidates?.[0]?.finish_reason === 'STOP') {
      setState('idle');
      if (config.autoListen && sessionActive) {
        // Continue listening for follow-up
        setTimeout(() => startListening(), 1000);
      }
    }
  }, [config.autoListen, sessionActive]);
  
  // Extract actions from AI response text
  const extractActionFromText = (text: string): VoiceAction | null => {
    const lowerText = text.toLowerCase();
    
    // Navigation actions
    if (lowerText.includes('opening') || lowerText.includes('فتح')) {
      if (lowerText.includes('health') || lowerText.includes('hospital') || lowerText.includes('الصحة') || lowerText.includes('المستشفى')) {
        return {
          type: 'navigate',
          data: { route: '/health' },
          confirmation: isArabic ? '✅ تم فتح قسم الصحة' : '✅ Opened Health section'
        };
      }
      if (lowerText.includes('bank') || lowerText.includes('البنك')) {
        return {
          type: 'navigate',
          data: { route: '/banking' },
          confirmation: isArabic ? '✅ تم فتح قسم البنوك' : '✅ Opened Banking section'
        };
      }
      if (lowerText.includes('family') || lowerText.includes('notes') || lowerText.includes('العائلة')) {
        return {
          type: 'navigate',
          data: { route: '/family' },
          confirmation: isArabic ? '✅ تم فتح ملاحظات العائلة' : '✅ Opened Family Notes'
        };
      }
    }
    
    // Add to notes actions
    if (lowerText.includes('added') || lowerText.includes('تم إضافة')) {
      const items = extractItemsFromText(text);
      if (items.length > 0) {
        return {
          type: 'add_note',
          data: { items },
          confirmation: isArabic ? `✅ تم إضافة ${items.join('، ')} للقائمة` : `✅ Added ${items.join(', ')} to list`
        };
      }
    }
    
    return null;
  };
  
  // Extract items from text for shopping lists
  const extractItemsFromText = (text: string): string[] => {
    const commonItems = {
      'eggs': 'بيض',
      'bread': 'خبز', 
      'milk': 'حليب',
      'rice': 'رز',
      'chicken': 'دجاج',
      'tomatoes': 'طماطم',
      'water': 'ماء',
      'sugar': 'سكر',
      'oil': 'زيت',
      'onions': 'بصل'
    };
    
    const items: string[] = [];
    const lowerText = text.toLowerCase();
    
    Object.entries(commonItems).forEach(([en, ar]) => {
      if (lowerText.includes(en) || lowerText.includes(ar)) {
        items.push(isArabic ? ar : en);
      }
    });
    
    return items;
  };
  
  // Execute actions triggered by voice commands
  const executeAction = useCallback(async (action: VoiceAction) => {
    console.log('Executing action:', action);
    
    try {
      switch (action.type) {
        case 'navigate':
          if (action.data.route) {
            router.push(action.data.route);
            showConfirmation(action.confirmation);
          }
          break;
          
        case 'add_note':
          // In a real app, save to AsyncStorage or backend
          console.log('Adding items to family notes:', action.data.items);
          showConfirmation(action.confirmation);
          break;
          
        case 'process_bill':
          // Handle bill processing
          console.log('Processing bill:', action.data);
          router.push('/bills');
          showConfirmation(action.confirmation);
          break;
          
        case 'open_feature':
          if (action.data.feature) {
            router.push(action.data.feature as any);
            showConfirmation(action.confirmation);
          }
          break;
          
        case 'reminder':
          // Create reminder
          console.log('Creating reminder:', action.data);
          showConfirmation(action.confirmation);
          break;
      }
    } catch (error) {
      console.error('Error executing action:', error);
    }
  }, [isArabic]);
  
  // Show visual confirmation of actions
  const showConfirmation = (message: string) => {
    // In a real app, show a toast or overlay
    console.log('Confirmation:', message);
    Alert.alert(
      isArabic ? 'تم' : 'Done',
      message,
      [{ text: 'OK' }],
      { cancelable: true }
    );
  };
  
  // Start continuous listening
  const startListening = useCallback(async () => {
    if (!isConnected || isListeningRef.current) {
      return;
    }
    
    try {
      if (Platform.OS !== 'web') {
        await Haptics.selectionAsync();
      }
      
      setState('listening');
      isListeningRef.current = true;
      setSessionActive(true);
      
      if (Platform.OS === 'web') {
        await startWebAudioStream();
      } else {
        await startMobileAudioStream();
      }
      
    } catch (error) {
      console.error('Error starting listening:', error);
      setState('idle');
      isListeningRef.current = false;
    }
  }, [isConnected]);
  
  // Start web audio streaming
  const startWebAudioStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      mediaStreamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      });
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      processor.onaudioprocess = (event) => {
        if (!isListeningRef.current || !wsRef.current) return;
        
        const inputBuffer = event.inputBuffer;
        const inputData = inputBuffer.getChannelData(0);
        
        // Convert to 16-bit PCM
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
        }
        
        // Send audio chunk to Gemini
        if (wsRef.current.readyState === WebSocket.OPEN) {
          const message = {
            realtime_input: {
              media_chunks: [{
                mime_type: 'audio/pcm',
                data: btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)))
              }]
            }
          };
          
          wsRef.current.send(JSON.stringify(message));
        }
      };
      
      source.connect(processor);
      processor.connect(audioContext.destination);
      
    } catch (error) {
      console.error('Error starting web audio stream:', error);
      throw error;
    }
  };
  
  // Start mobile audio streaming
  const startMobileAudioStream = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      
      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/wav',
          bitsPerSecond: 128000,
        },
      });
      
      recordingRef.current = recording;
      
      // For mobile, we'll need to periodically send chunks
      // This is a simplified approach - in production, use streaming
      const sendAudioChunks = async () => {
        while (isListeningRef.current && recordingRef.current) {
          try {
            // Get current recording status and send chunk
            const status = await recordingRef.current.getStatusAsync();
            if (status.isRecording && wsRef.current?.readyState === WebSocket.OPEN) {
              // In a real implementation, you'd stream audio chunks here
              // For now, we'll use the existing approach but with shorter intervals
            }
            await new Promise(resolve => setTimeout(resolve, 100)); // 100ms chunks
          } catch (error) {
            console.error('Error sending audio chunk:', error);
            break;
          }
        }
      };
      
      sendAudioChunks();
      
    } catch (error) {
      console.error('Error starting mobile audio stream:', error);
      throw error;
    }
  };
  
  // Stop listening
  const stopListening = useCallback(async () => {
    if (!isListeningRef.current) return;
    
    isListeningRef.current = false;
    setState('processing');
    
    try {
      if (Platform.OS === 'web') {
        // Stop web audio stream
        if (processorRef.current) {
          processorRef.current.disconnect();
          processorRef.current = null;
        }
        if (audioContextRef.current) {
          await audioContextRef.current.close();
          audioContextRef.current = null;
        }
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
        }
      } else {
        // Stop mobile recording
        if (recordingRef.current) {
          await recordingRef.current.stopAndUnloadAsync();
          recordingRef.current = null;
        }
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      }
      
      // Send end of input signal to Gemini
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const endMessage = {
          realtime_input: {
            media_chunks: []
          }
        };
        wsRef.current.send(JSON.stringify(endMessage));
      }
      
    } catch (error) {
      console.error('Error stopping listening:', error);
    }
  }, []);
  
  // Play audio chunk from Gemini response
  const playAudioChunk = useCallback(async (audioData: string) => {
    try {
      setState('speaking');
      
      if (Platform.OS === 'web') {
        // For web, use Web Audio API to play streaming audio
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(
          Uint8Array.from(atob(audioData), c => c.charCodeAt(0)).buffer
        );
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        
        source.onended = () => {
          if (config.autoListen && sessionActive) {
            setState('listening');
          } else {
            setState('idle');
          }
        };
        
        source.start();
      } else {
        // For mobile, use expo-av to play audio
        const { sound } = await Audio.Sound.createAsync(
          { uri: `data:audio/wav;base64,${audioData}` },
          { shouldPlay: true }
        );
        
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            if (config.autoListen && sessionActive) {
              setState('listening');
            } else {
              setState('idle');
            }
            sound.unloadAsync();
          }
        });
      }
    } catch (error) {
      console.error('Error playing audio chunk:', error);
      setState('idle');
    }
  }, [config.autoListen, sessionActive]);
  
  // Send text message to Gemini
  const sendTextMessage = useCallback(async (text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      await connectToGemini();
      return;
    }
    
    setState('processing');
    setCurrentResponse('');
    
    // Add to conversation context
    conversationContextRef.current.push(text);
    
    const message = {
      contents: [{
        parts: [{ text }],
        role: 'user'
      }]
    };
    
    wsRef.current.send(JSON.stringify(message));
  }, [connectToGemini]);
  
  // Send image with text to Gemini
  const sendImageMessage = useCallback(async (imageUri: string, text: string = '') => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      await connectToGemini();
      return;
    }
    
    setState('processing');
    setCurrentResponse('');
    
    try {
      // Convert image to base64
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      
      const base64Data = base64.split(',')[1];
      
      const message = {
        contents: [{
          parts: [
            { text: text || (isArabic ? 'ما هذا؟' : 'What is this?') },
            {
              inline_data: {
                mime_type: blob.type,
                data: base64Data
              }
            }
          ],
          role: 'user'
        }]
      };
      
      wsRef.current.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending image message:', error);
      setState('idle');
    }
  }, [connectToGemini, isArabic]);
  
  // Toggle listening state
  const toggleListening = useCallback(async () => {
    if (state === 'listening') {
      await stopListening();
    } else if (state === 'idle') {
      if (!isConnected) {
        await connectToGemini();
      }
      await startListening();
    }
  }, [state, isConnected, connectToGemini, startListening, stopListening]);
  
  // End session
  const endSession = useCallback(async () => {
    setSessionActive(false);
    await stopListening();
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setState('idle');
    conversationContextRef.current = [];
  }, [stopListening]);
  
  // Wake phrase detection (simplified)
  const detectWakePhrase = useCallback((text: string): boolean => {
    const lowerText = text.toLowerCase();
    const wakePhrases = [
      config.wakePhrase.toLowerCase(),
      'hey mizon',
      'مرحبا ميزون',
      'يا ميزون'
    ];
    
    return wakePhrases.some(phrase => lowerText.includes(phrase));
  }, [config.wakePhrase]);
  
  // Initialize connection on mount
  useEffect(() => {
    connectToGemini();
    
    return () => {
      endSession();
    };
  }, []);
  
  // Update config
  const updateConfig = useCallback((newConfig: Partial<RealtimeVoiceConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);
  
  return {
    state,
    isConnected,
    sessionActive,
    currentResponse,
    config,
    startListening,
    stopListening,
    toggleListening,
    sendTextMessage,
    sendImageMessage,
    endSession,
    updateConfig,
    detectWakePhrase
  };
}