import { useState, useRef, useCallback, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useApp } from './useAppStore';
import { router } from 'expo-router';

export type GeminiRealtimeState = 'idle' | 'connecting' | 'listening' | 'processing' | 'speaking';

export interface GeminiRealtimeConfig {
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

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY ?? '';
const GEMINI_REALTIME_WS_URL = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService/BidiGenerateContent';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const GEMINI_VISION_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export function useGeminiRealtimeVoice() {
  const [state, setState] = useState<GeminiRealtimeState>('idle');
  const [isConnected, setIsConnected] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string>('');
  const [sessionActive, setSessionActive] = useState(false);
  const [config, setConfig] = useState<GeminiRealtimeConfig>({
    wakePhrase: 'Hey Mizon',
    autoListen: true,
    streamingResponse: true,
    language: 'auto'
  });
  
  const { userData } = useApp();
  const isArabic = userData.language === 'ar';
  
  // Refs for managing audio and WebSocket
  const recordingRef = useRef<Audio.Recording | null>(null);
  const webRecognitionRef = useRef<any>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const isListeningRef = useRef(false);
  const conversationContextRef = useRef<string[]>([]);
  const responseStreamRef = useRef<string>('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  
  // Initialize WebSocket connection to Gemini Realtime API
  const connectToGemini = useCallback(async () => {
    setState('connecting');
    
    try {
      // For web, we'll use a hybrid approach with WebSocket for realtime and REST for fallback
      if (Platform.OS === 'web') {
        // Test basic API connection first
        const testResponse = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: 'Hello' }]
            }],
            generationConfig: {
              maxOutputTokens: 10
            }
          })
        });
        
        if (testResponse.ok) {
          console.log('Connected to Gemini API');
          setIsConnected(true);
          setState('idle');
          
          // Initialize WebSocket for realtime features
          await initializeWebSocket();
        } else {
          throw new Error('API connection failed');
        }
      } else {
        // For mobile, use REST API with streaming simulation
        const testResponse = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: 'Hello' }]
            }],
            generationConfig: {
              maxOutputTokens: 10
            }
          })
        });
        
        if (testResponse.ok) {
          console.log('Connected to Gemini API (Mobile)');
          setIsConnected(true);
          setState('idle');
        } else {
          throw new Error('API connection failed');
        }
      }
    } catch (error) {
      console.error('Failed to connect to Gemini:', error);
      setState('idle');
      setIsConnected(false);
      
      // More detailed error handling
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log('Detailed error:', errorMessage);
      
      // Don't show alert immediately, let user try again
      setTimeout(() => {
        if (!isConnected) {
          Alert.alert(
            isArabic ? 'خطأ في الاتصال' : 'Connection Error',
            isArabic 
              ? 'فشل في الاتصال بمساعد ميزون. يرجى المحاولة مرة أخرى.' 
              : 'Failed to connect to Mizon assistant. Please try again.',
            [
              { 
                text: isArabic ? 'إعادة المحاولة' : 'Retry', 
                onPress: () => connectToGemini() 
              },
              { 
                text: isArabic ? 'إلغاء' : 'Cancel', 
                style: 'cancel' 
              }
            ]
          );
        }
      }, 2000);
    }
  }, [isArabic]);
  
  // Initialize WebSocket connection for realtime features
  const initializeWebSocket = useCallback(async () => {
    try {
      // Note: Google's Gemini doesn't have a public WebSocket API yet
      // We'll simulate realtime behavior with rapid polling and streaming responses
      console.log('WebSocket simulation initialized for realtime experience');
    } catch (error) {
      console.error('WebSocket initialization failed:', error);
    }
  }, []);
  
  // Extract actions from AI response text
  const extractActionFromText = (text: string): VoiceAction | null => {
    const lowerText = text.toLowerCase();
    
    // Navigation actions
    if (lowerText.includes('opening') || lowerText.includes('فتح') || lowerText.includes('navigating') || lowerText.includes('taking you')) {
      if (lowerText.includes('health') || lowerText.includes('hospital') || lowerText.includes('الصحة') || lowerText.includes('المستشفى')) {
        return {
          type: 'navigate',
          data: { route: '/(tabs)/health' },
          confirmation: isArabic ? '✅ تم فتح قسم الصحة' : '✅ Opened Health section'
        };
      }
      if (lowerText.includes('bank') || lowerText.includes('البنك') || lowerText.includes('banking')) {
        return {
          type: 'navigate',
          data: { route: '/(tabs)/banking' },
          confirmation: isArabic ? '✅ تم فتح قسم البنوك' : '✅ Opened Banking section'
        };
      }
      if (lowerText.includes('family') || lowerText.includes('notes') || lowerText.includes('العائلة')) {
        return {
          type: 'navigate',
          data: { route: '/(tabs)/family' },
          confirmation: isArabic ? '✅ تم فتح ملاحظات العائلة' : '✅ Opened Family Notes'
        };
      }
      if (lowerText.includes('bill') || lowerText.includes('فاتورة')) {
        return {
          type: 'navigate',
          data: { route: '/(tabs)/bills' },
          confirmation: isArabic ? '✅ تم فتح قسم الفواتير' : '✅ Opened Bills section'
        };
      }
    }
    
    // Add to notes actions
    if (lowerText.includes('added') || lowerText.includes('تم إضافة') || lowerText.includes('adding')) {
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
      'onions': 'بصل',
      'meat': 'لحم',
      'fish': 'سمك',
      'cheese': 'جبن',
      'butter': 'زبدة',
      'yogurt': 'لبن'
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
          router.push('/(tabs)/bills');
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
  }, []);
  
  // Show visual confirmation of actions
  const showConfirmation = (message: string) => {
    console.log('Confirmation:', message);
    // In a real app, show a toast or overlay instead of alert
    if (Platform.OS !== 'web') {
      Alert.alert(
        isArabic ? 'تم' : 'Done',
        message,
        [{ text: 'OK' }],
        { cancelable: true }
      );
    }
  };
  
  // Start continuous listening with realtime speech recognition
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
      setCurrentResponse('');
      
      if (Platform.OS === 'web') {
        await startWebRealtimeListening();
      } else {
        await startMobileRealtimeRecording();
      }
      
    } catch (error) {
      console.error('Error starting listening:', error);
      setState('idle');
      isListeningRef.current = false;
    }
  }, [isConnected]);
  
  // Web realtime listening with MediaRecorder for audio streaming
  const startWebRealtimeListening = async () => {
    try {
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      
      audioStreamRef.current = stream;
      
      // Set up Web Audio API for real-time processing
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      });
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      // Also use Web Speech Recognition for immediate transcription
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = isArabic ? 'ar-SA' : 'en-US';
        recognition.maxAlternatives = 1;
        
        webRecognitionRef.current = recognition;
        
        recognition.onstart = () => {
          console.log('Realtime speech recognition started');
        };
        
        recognition.onresult = (event: any) => {
          try {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript;
              } else {
                interimTranscript += transcript;
              }
            }
            
            // Process interim results for real-time feel
            if (interimTranscript && sessionActive) {
              console.log('Interim:', interimTranscript);
              // Could show interim text in UI
            }
            
            if (finalTranscript) {
              console.log('Final transcript:', finalTranscript);
              
              // Check for stop commands
              if (detectStopCommand(finalTranscript) && sessionActive) {
                console.log('Stop command detected');
                endSession();
                return;
              }
              
              // Check for wake phrase or process if session is active
              if (sessionActive || detectWakePhrase(finalTranscript)) {
                if (!sessionActive) {
                  setSessionActive(true);
                  console.log('Wake phrase detected, starting session');
                }
                processVoiceCommandRealtime(finalTranscript);
              }
            }
          } catch (error) {
            console.error('Error processing speech result:', error);
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error !== 'aborted' && event.error !== 'no-speech') {
            setTimeout(() => {
              if (isListeningRef.current) {
                try {
                  recognition.start();
                } catch (restartError) {
                  console.error('Error restarting recognition:', restartError);
                }
              }
            }, 1000);
          }
        };
        
        recognition.onend = () => {
          console.log('Speech recognition ended');
          if (isListeningRef.current && config.autoListen) {
            setTimeout(() => {
              try {
                recognition.start();
              } catch (error) {
                console.error('Error restarting recognition:', error);
              }
            }, 100);
          }
        };
        
        recognition.start();
      }
      
      // Set up MediaRecorder for audio chunks (for backup transcription)
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        if (audioChunks.length > 0) {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          // Could send to backup transcription service if needed
          audioChunks.length = 0;
        }
      };
      
      // Start recording in chunks for backup
      mediaRecorder.start(2000); // 2-second chunks
      
      source.connect(processor);
      processor.connect(audioContext.destination);
      
    } catch (error) {
      console.error('Error starting web realtime listening:', error);
      throw error;
    }
  };
  
  // Mobile realtime recording with continuous processing
  const startMobileRealtimeRecording = async () => {
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
          extension: '.m4a',
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
      
      // Process audio in chunks for near real-time experience
      const processAudioChunks = async () => {
        while (isListeningRef.current) {
          try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second chunks
            
            if (recordingRef.current && isListeningRef.current) {
              // Stop current recording
              await recordingRef.current.stopAndUnloadAsync();
              const uri = recordingRef.current.getURI();
              
              if (uri) {
                // Process this chunk
                processAudioChunk(uri);
                
                // Start new recording if still listening
                if (isListeningRef.current) {
                  const { recording: newRecording } = await Audio.Recording.createAsync({
                    android: {
                      extension: '.m4a',
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
                  recordingRef.current = newRecording;
                }
              }
            }
          } catch (error) {
            console.error('Error processing audio chunk:', error);
            break;
          }
        }
      };
      
      processAudioChunks();
      
    } catch (error) {
      console.error('Error starting mobile recording:', error);
      throw error;
    }
  };
  
  // Process audio chunk for mobile
  const processAudioChunk = async (audioUri: string) => {
    try {
      const formData = new FormData();
      const uriParts = audioUri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const audioFile = {
        uri: audioUri,
        name: 'recording.' + fileType,
        type: 'audio/' + fileType
      } as any;

      formData.append('audio', audioFile);
      if (isArabic) {
        formData.append('language', 'ar');
      }

      const response = await fetch('https://toolkit.rork.com/stt/transcribe/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.text && result.text.trim().length > 0) {
          console.log('Transcribed chunk:', result.text);
          
          // Check for stop commands
          if (detectStopCommand(result.text) && sessionActive) {
            console.log('Stop command detected in chunk');
            endSession();
            return;
          }
          
          // Check for wake phrase or process if session is active
          if (sessionActive || detectWakePhrase(result.text)) {
            if (!sessionActive) {
              setSessionActive(true);
              console.log('Wake phrase detected in chunk');
            }
            processVoiceCommand(result.text);
          }
        }
      }
    } catch (error) {
      console.error('Error processing audio chunk:', error);
    }
  };
  
  // Stop listening and clean up all resources
  const stopListening = useCallback(async () => {
    if (!isListeningRef.current) return;
    
    isListeningRef.current = false;
    setState('idle');
    
    try {
      if (Platform.OS === 'web') {
        // Stop speech recognition
        if (webRecognitionRef.current) {
          webRecognitionRef.current.stop();
          webRecognitionRef.current = null;
        }
        
        // Stop media recorder
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current = null;
        }
        
        // Stop audio stream
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach(track => track.stop());
          audioStreamRef.current = null;
        }
        
        // Clean up audio context
        if (audioContextRef.current) {
          if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
          }
          await audioContextRef.current.close();
          audioContextRef.current = null;
        }
        
        // Stop any ongoing speech
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } else {
        if (recordingRef.current) {
          await recordingRef.current.stopAndUnloadAsync();
          recordingRef.current = null;
        }
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      }
    } catch (error) {
      console.error('Error stopping listening:', error);
    }
  }, []);
  
  // Process voice command with realtime streaming response
  const processVoiceCommandRealtime = async (text: string) => {
    setState('processing');
    setCurrentResponse('');
    responseStreamRef.current = '';
    
    try {
      // Add to conversation context
      conversationContextRef.current.push(text);
      
      // Get AI response with realtime streaming
      await getRealtimeAIResponse(text);
      
    } catch (error) {
      console.error('Error processing voice command:', error);
      setState('idle');
    }
  };
  
  // Legacy method for backward compatibility
  const processVoiceCommand = processVoiceCommandRealtime;
  
  // Get realtime AI response with proper streaming
  const getRealtimeAIResponse = async (text: string) => {
    try {
      const systemPrompt = isArabic 
        ? `أنت ميزون، المساعد الذكي الفوري لتطبيق تموين البحرين. خصائصك:

1. الاستجابة الفورية والطبيعية
2. تنفيذ الإجراءات فوراً:
   - "أضف البيض والخبز لملاحظاتي" → إضافة للقائمة
   - "هذه فاتورتي" → معالجة الفاتورة
   - "أنا في المستشفى" → فتح قسم الصحة
   - "خذني لعروض البنوك" → التنقل للصفحة

3. المحادثة الطبيعية مثل المساعد الحقيقي
4. تذكر السياق والمتابعة
5. إعطاء تأكيدات واضحة وسريعة

استجب بشكل طبيعي ومختصر وفوري. عند تنفيذ إجراء، أعط تأكيداً واضحاً.`
        : `You are Mizon, the instant smart assistant for Tamween Bahrain app. Your capabilities:

1. Instant, natural responses
2. Execute actions immediately:
   - "Add eggs and bread to my notes" → update Family Notes instantly
   - "This is my bill" → process bill immediately
   - "I'm at the hospital" → open Health section now
   - "Take me to bank deals" → navigate to Banking instantly

3. Natural conversation like a real assistant
4. Remember context and follow up
5. Give clear, immediate confirmations

Respond naturally, concisely, and instantly. When executing actions, give clear confirmation.`;

      // Use streaming for real-time feel
      const response = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: `Context: ${conversationContextRef.current.slice(-3).join(' ')}` },
                { text: `User: ${text}` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 150,
            candidateCount: 1,
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Gemini API Response:', result);
        
        const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || 
          (isArabic ? 'عذراً، لم أفهم. يمكنك إعادة المحاولة؟' : 'Sorry, I did not understand. Can you try again?');
        
        // Stream response in real-time (faster streaming)
        await streamResponseRealtime(aiResponse);
        
        // Check for actions in the response and execute immediately
        const action = extractActionFromText(aiResponse);
        if (action) {
          executeAction(action);
        }
        
        // Speak the response with overlap (start speaking while still streaming text)
        speakResponseRealtime(aiResponse);
        
      } else {
        const errorText = await response.text();
        console.error('Gemini API Error Response:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error getting realtime AI response:', error);
      const fallbackResponse = isArabic 
        ? 'عذراً، حدث خطأ. يمكنك المحاولة مرة أخرى؟'
        : 'Sorry, there was an error. Can you try again?';
      
      await streamResponseRealtime(fallbackResponse);
      speakResponseRealtime(fallbackResponse);
    }
  };
  
  // Legacy method for backward compatibility
  const getStreamingAIResponse = async (text: string) => {
    try {
      const systemPrompt = isArabic 
        ? `أنت ميزون، المساعد الذكي لتطبيق تموين البحرين. يمكنك:

1. الاستماع المستمر والرد الفوري
2. تنفيذ الإجراءات:
   - "أضف البيض والخبز لملاحظاتي" → إضافة للقائمة
   - "هذه فاتورتي" → معالجة الفاتورة
   - "أنا في المستشفى" → فتح قسم الصحة
   - "خذني لعروض البنوك" → التنقل للصفحة

3. المحادثة الطبيعية والودودة
4. تذكر السياق أثناء المحادثة
5. إعطاء تأكيدات واضحة

استجب بشكل طبيعي ومختصر. عند تنفيذ إجراء، أعط تأكيداً واضحاً.`
        : `You are Mizon, the smart assistant for Tamween Bahrain app. You can:

1. Listen continuously and respond instantly
2. Execute actions:
   - "Add eggs and bread to my notes" → update Family Notes
   - "This is my bill" → process bill
   - "I'm at the hospital" → open Health section
   - "Take me to bank deals" → navigate to Banking

3. Have natural, friendly conversations
4. Remember context during conversation
5. Give clear confirmations

Respond naturally and concisely. When executing actions, give clear confirmation.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: `Context: ${conversationContextRef.current.slice(-3).join(' ')}` },
                { text: `User: ${text}` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200,
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || 
          (isArabic ? 'عذراً، لم أفهم. يمكنك إعادة المحاولة؟' : 'Sorry, I did not understand. Can you try again?');
        
        // Simulate streaming by showing response word by word
        await streamResponse(aiResponse);
        
        // Check for actions in the response
        const action = extractActionFromText(aiResponse);
        if (action) {
          executeAction(action);
        }
        
        // Speak the response
        await speakResponse(aiResponse);
        
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const fallbackResponse = isArabic 
        ? 'عذراً، حدث خطأ. يمكنك المحاولة مرة أخرى؟'
        : 'Sorry, there was an error. Can you try again?';
      
      await streamResponse(fallbackResponse);
      await speakResponse(fallbackResponse);
    }
  };
  
  // Stream response in real-time (faster for better UX)
  const streamResponseRealtime = async (text: string) => {
    if (!text || typeof text !== 'string') {
      console.warn('Invalid text for streaming:', text);
      return;
    }
    
    // Clean the text to avoid rendering issues
    const cleanText = text.trim();
    if (!cleanText) {
      return;
    }
    
    const words = cleanText.split(' ').filter(word => word.length > 0);
    responseStreamRef.current = '';
    
    for (let i = 0; i < words.length; i++) {
      responseStreamRef.current += (i > 0 ? ' ' : '') + words[i];
      const safeResponse = responseStreamRef.current || '';
      setCurrentResponse(safeResponse);
      await new Promise(resolve => setTimeout(resolve, 40)); // 40ms delay for faster streaming
    }
  };
  
  // Legacy method for backward compatibility
  const streamResponse = streamResponseRealtime;
  
  // Speak response with realtime overlap (start speaking while streaming)
  const speakResponseRealtime = async (text: string) => {
    setState('speaking');
    
    try {
      if (Platform.OS === 'web') {
        if ('speechSynthesis' in window) {
          // Cancel any ongoing speech
          window.speechSynthesis.cancel();
          
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = isArabic ? 'ar-SA' : 'en-US';
          utterance.rate = 1.1; // Slightly faster for more natural feel
          utterance.pitch = 1.0;
          utterance.volume = 0.9;
          
          // Try to get a better voice
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(voice => 
            isArabic 
              ? voice.lang.startsWith('ar') && voice.name.includes('Enhanced')
              : voice.lang.startsWith('en') && (voice.name.includes('Enhanced') || voice.name.includes('Premium'))
          ) || voices.find(voice => 
            isArabic ? voice.lang.startsWith('ar') : voice.lang.startsWith('en')
          );
          
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
          
          utterance.onstart = () => {
            console.log('Started speaking:', text.substring(0, 50) + '...');
          };
          
          utterance.onend = () => {
            setState('idle');
            if (config.autoListen && sessionActive) {
              // Continue listening after speaking with shorter delay
              setTimeout(() => {
                if (sessionActive) {
                  setState('listening');
                }
              }, 300); // Faster transition back to listening
            }
          };
          
          utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            setState('idle');
          };
          
          window.speechSynthesis.speak(utterance);
        } else {
          setTimeout(() => {
            setState('idle');
            if (config.autoListen && sessionActive) {
              setState('listening');
            }
          }, 1500); // Shorter timeout
        }
      } else {
        // For mobile, estimate speaking time more accurately
        const estimatedTime = Math.max(1000, text.length * 40); // Minimum 1 second
        setTimeout(() => {
          setState('idle');
          if (config.autoListen && sessionActive) {
            setState('listening');
          }
        }, estimatedTime);
      }
    } catch (error) {
      console.error('Error speaking response:', error);
      setState('idle');
    }
  };
  
  // Legacy method for backward compatibility
  const speakResponse = speakResponseRealtime;
  
  // Detect wake phrase
  const detectWakePhrase = useCallback((text: string): boolean => {
    const lowerText = text.toLowerCase();
    const wakePhrases = [
      config.wakePhrase.toLowerCase(),
      'hey mizon',
      'مرحبا ميزون',
      'يا ميزون',
      'mizon'
    ];
    
    return wakePhrases.some(phrase => lowerText.includes(phrase));
  }, [config.wakePhrase]);
  
  // Detect stop commands
  const detectStopCommand = useCallback((text: string): boolean => {
    const lowerText = text.toLowerCase();
    const stopCommands = [
      'stop',
      'توقف',
      'انتهى',
      'كفى',
      'end',
      'finish',
      'done',
      'quit',
      'exit',
      'bye',
      'goodbye',
      'مع السلامة',
      'وداعا'
    ];
    
    return stopCommands.some(command => lowerText.includes(command));
  }, []);
  
  // Toggle listening
  const toggleListening = useCallback(async () => {
    if (state === 'listening') {
      await stopListening();
      setSessionActive(false);
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
    setCurrentResponse('');
    conversationContextRef.current = [];
  }, [stopListening]);
  
  // Send text message
  const sendTextMessage = useCallback(async (text: string) => {
    await processVoiceCommand(text);
  }, []);
  
  // Send image message
  const sendImageMessage = useCallback(async (imageUri: string, text: string = '') => {
    try {
      setState('processing');
      
      // Convert image to base64
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      
      const base64Data = base64.split(',')[1];
      
      // Use Gemini Vision API
      const visionResponse = await fetch(`${GEMINI_VISION_API_URL}?key=${GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: text || (isArabic ? 'ما هذا؟ هل هذه فاتورة؟' : 'What is this? Is this a bill?') },
              {
                inline_data: {
                  mime_type: blob.type,
                  data: base64Data
                }
              }
            ]
          }]
        })
      });
      
      if (visionResponse.ok) {
        const result = await visionResponse.json();
        const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || 
          (isArabic ? 'لم أتمكن من تحليل الصورة' : 'Could not analyze the image');
        
        await streamResponse(aiResponse);
        
        // Check if it's a bill and navigate accordingly
        if (aiResponse.toLowerCase().includes('bill') || aiResponse.includes('فاتورة')) {
          router.push('/(tabs)/bills');
          showConfirmation(isArabic ? '✅ تم حفظ الفاتورة' : '✅ Bill saved');
        }
        
        await speakResponse(aiResponse);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setState('idle');
    }
  }, [isArabic]);
  
  // Initialize connection on mount
  useEffect(() => {
    connectToGemini();
  }, [connectToGemini]);
  
  // Update config
  const updateConfig = useCallback((newConfig: Partial<GeminiRealtimeConfig>) => {
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
    detectWakePhrase,
    detectStopCommand
  };
}