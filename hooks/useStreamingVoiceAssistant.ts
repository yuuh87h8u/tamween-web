import { useState, useRef, useCallback, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useApp } from './useAppStore';
import { router } from 'expo-router';

export type StreamingVoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export interface StreamingVoiceConfig {
  wakePhrase: string;
  autoListen: boolean;
  continuousMode: boolean;
  language: 'en' | 'ar' | 'auto';
}

export interface VoiceAction {
  type: 'navigate' | 'add_note' | 'process_bill' | 'open_feature' | 'reminder';
  data: any;
  confirmation: string;
}

const GOOGLE_API_KEY = 'AIzaSyDofcXNYF9JkQAKcLd2IGbyzv9IPSD079s';

export function useStreamingVoiceAssistant() {
  const [state, setState] = useState<StreamingVoiceState>('idle');
  const [currentResponse, setCurrentResponse] = useState<string>('');
  const [sessionActive, setSessionActive] = useState(false);
  const [config, setConfig] = useState<StreamingVoiceConfig>({
    wakePhrase: 'Hey Mizon',
    autoListen: true,
    continuousMode: true,
    language: 'auto'
  });
  
  const { userData } = useApp();
  const isArabic = userData.language === 'ar';
  
  // Refs for managing audio
  const recordingRef = useRef<Audio.Recording | null>(null);
  const webRecognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const conversationContextRef = useRef<string[]>([]);
  const responseStreamRef = useRef<string>('');
  
  // Start continuous listening with wake phrase detection
  const startListening = useCallback(async () => {
    if (isListeningRef.current) return;
    
    try {
      if (Platform.OS !== 'web') {
        await Haptics.selectionAsync();
      }
      
      setState('listening');
      isListeningRef.current = true;
      setSessionActive(true);
      
      if (Platform.OS === 'web') {
        await startWebSpeechRecognition();
      } else {
        await startMobileRecording();
      }
      
    } catch (error) {
      console.error('Error starting listening:', error);
      setState('idle');
      isListeningRef.current = false;
    }
  }, []);
  
  // Web Speech Recognition with continuous listening
  const startWebSpeechRecognition = async () => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported');
      }
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Keep listening
      recognition.interimResults = true; // Get partial results
      recognition.lang = isArabic ? 'ar-SA' : 'en-US';
      recognition.maxAlternatives = 1;
      
      webRecognitionRef.current = recognition;
      
      recognition.onstart = () => {
        console.log('Continuous speech recognition started');
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
          
          if (finalTranscript) {
            console.log('Final transcript:', finalTranscript);
            
            // Check for wake phrase or process if session is active
            if (sessionActive || detectWakePhrase(finalTranscript)) {
              if (!sessionActive) {
                setSessionActive(true);
                console.log('Wake phrase detected, starting session');
              }
              processVoiceCommand(finalTranscript);
            }
          }
        } catch (error) {
          console.error('Error processing speech result:', error);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
          // Restart recognition on error (except for intentional stops)
          setTimeout(() => {
            if (isListeningRef.current) {
              recognition.start();
            }
          }, 1000);
        }
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended');
        // Restart if still in listening mode
        if (isListeningRef.current && config.continuousMode) {
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
    } catch (error) {
      console.error('Error starting web speech recognition:', error);
      throw error;
    }
  };
  
  // Mobile recording with periodic processing
  const startMobileRecording = async () => {
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
            await new Promise(resolve => setTimeout(resolve, 3000)); // 3-second chunks
            
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
  
  // Stop listening
  const stopListening = useCallback(async () => {
    if (!isListeningRef.current) return;
    
    isListeningRef.current = false;
    setState('idle');
    
    try {
      if (Platform.OS === 'web') {
        if (webRecognitionRef.current) {
          webRecognitionRef.current.stop();
          webRecognitionRef.current = null;
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
  
  // Process voice command with streaming response
  const processVoiceCommand = async (text: string) => {
    setState('processing');
    setCurrentResponse('');
    responseStreamRef.current = '';
    
    try {
      // Add to conversation context
      conversationContextRef.current.push(text);
      
      // Get AI response with streaming
      await getStreamingAIResponse(text);
      
    } catch (error) {
      console.error('Error processing voice command:', error);
      setState('idle');
    }
  };
  
  // Get streaming AI response
  const getStreamingAIResponse = async (text: string) => {
    try {
      const systemPrompt = isArabic 
        ? `أنت ميزون، المساعد الذكي لتطبيق تموين البحرين. يمكنك:

1. الاستماع المستمر والرد الفوري
2. تنفيذ الإجراءات:
   - \"أضف البيض والخبز لملاحظاتي\" → إضافة للقائمة
   - \"هذه فاتورتي\" → معالجة الفاتورة
   - \"أنا في المستشفى\" → فتح قسم الصحة
   - \"خذني لعروض البنوك\" → التنقل للصفحة

3. المحادثة الطبيعية والودودة
4. تذكر السياق أثناء المحادثة
5. إعطاء تأكيدات واضحة

استجب بشكل طبيعي ومختصر. عند تنفيذ إجراء، أعط تأكيداً واضحاً.`
        : `You are Mizon, the smart assistant for Tamween Bahrain app. You can:

1. Listen continuously and respond instantly
2. Execute actions:
   - \"Add eggs and bread to my notes\" → update Family Notes
   - \"This is my bill\" → process bill
   - \"I'm at the hospital\" → open Health section
   - \"Take me to bank deals\" → navigate to Banking

3. Have natural, friendly conversations
4. Remember context during conversation
5. Give clear confirmations

Respond naturally and concisely. When executing actions, give clear confirmation.`;

      // Use Google Gemini API for better responses
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`, {
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
  
  // Stream response word by word for real-time feel
  const streamResponse = async (text: string) => {
    const words = text.split(' ');
    responseStreamRef.current = '';
    
    for (let i = 0; i < words.length; i++) {
      responseStreamRef.current += (i > 0 ? ' ' : '') + words[i];
      setCurrentResponse(responseStreamRef.current);
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay between words
    }
  };
  
  // Extract actions from AI response
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
  
  // Extract items from text
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
  
  // Execute actions
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
          console.log('Adding items to family notes:', action.data.items);
          showConfirmation(action.confirmation);
          break;
          
        case 'process_bill':
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
          console.log('Creating reminder:', action.data);
          showConfirmation(action.confirmation);
          break;
      }
    } catch (error) {
      console.error('Error executing action:', error);
    }
  }, []);
  
  // Show confirmation
  const showConfirmation = (message: string) => {
    console.log('Confirmation:', message);
    Alert.alert(
      isArabic ? 'تم' : 'Done',
      message,
      [{ text: 'OK' }],
      { cancelable: true }
    );
  };
  
  // Speak response
  const speakResponse = async (text: string) => {
    setState('speaking');
    
    try {
      if (Platform.OS === 'web') {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = isArabic ? 'ar-SA' : 'en-US';
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          
          utterance.onend = () => {
            setState('idle');
            if (config.continuousMode && sessionActive) {
              // Continue listening after speaking
              setTimeout(() => {
                if (sessionActive) {
                  setState('listening');
                }
              }, 500);
            }
          };
          
          utterance.onerror = () => {
            setState('idle');
          };
          
          window.speechSynthesis.speak(utterance);
        } else {
          setTimeout(() => {
            setState('idle');
            if (config.continuousMode && sessionActive) {
              setState('listening');
            }
          }, 2000);
        }
      } else {
        // For mobile, we'll use a simple timeout since expo-speech might not be available
        setTimeout(() => {
          setState('idle');
          if (config.continuousMode && sessionActive) {
            setState('listening');
          }
        }, text.length * 50); // Estimate speaking time
      }
    } catch (error) {
      console.error('Error speaking response:', error);
      setState('idle');
    }
  };
  
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
  
  // Toggle listening
  const toggleListening = useCallback(async () => {
    if (state === 'listening') {
      await stopListening();
      setSessionActive(false);
    } else if (state === 'idle') {
      await startListening();
    }
  }, [state, startListening, stopListening]);
  
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
      const visionResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GOOGLE_API_KEY}`, {
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
          router.push('/bills');
          showConfirmation(isArabic ? '✅ تم حفظ الفاتورة' : '✅ Bill saved');
        }
        
        await speakResponse(aiResponse);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setState('idle');
    }
  }, [isArabic]);
  
  // Update config
  const updateConfig = useCallback((newConfig: Partial<StreamingVoiceConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);
  
  return {
    state,
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