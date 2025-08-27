import { useState, useRef, useCallback, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useApp } from './useAppStore';
import { router } from 'expo-router';

export type RealTimeVoiceState = 'idle' | 'connecting' | 'listening' | 'processing' | 'speaking';

export interface VoiceAction {
  type: 'navigate' | 'add_note' | 'process_bill' | 'open_feature' | 'reminder';
  data: any;
  confirmation: string;
}

export interface GeminiResponse {
  response: string;
  action?: VoiceAction | null;
  language: string;
  error?: boolean;
}

export function useRealTimeGeminiVoice() {
  const [state, setState] = useState<RealTimeVoiceState>('idle');
  const [isConnected, setIsConnected] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string>('');
  const [sessionActive, setSessionActive] = useState(false);
  
  const { userData } = useApp();
  const isArabic = userData.language === 'ar';
  
  // Refs for managing audio
  const recordingRef = useRef<Audio.Recording | null>(null);
  const webRecognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const isListeningRef = useRef(false);
  const conversationContextRef = useRef<string[]>([]);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Test connection to backend
  const connectToBackend = useCallback(async () => {
    setState('connecting');
    
    try {
      // Check if we have a proper API base URL
      const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
      
      if (!baseUrl) {
        console.log('No API base URL configured, using mock mode');
        setIsConnected(true);
        setState('idle');
        return;
      }
      
      console.log('Connecting to backend at:', baseUrl);
      
      const response = await fetch(`${baseUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Connected to Gemini backend:', result);
        setIsConnected(true);
        setState('idle');
      } else {
        const errorText = await response.text();
        console.error('Backend response error:', response.status, errorText);
        throw new Error(`Backend connection failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to connect to backend:', error);
      setState('idle');
      
      // In development or when no backend is configured, use mock mode
      if (__DEV__ || !process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
        console.log('Using mock mode for voice assistant');
        setIsConnected(true);
        return;
      }
      
      setIsConnected(false);
      
      setTimeout(() => {
        if (!isConnected) {
          Alert.alert(
            isArabic ? 'خطأ في الاتصال' : 'Connection Error',
            isArabic 
              ? 'فشل في الاتصال بمساعد ميزون. سيتم استخدام الوضع التجريبي.' 
              : 'Failed to connect to Mizon assistant. Using demo mode.',
            [
              { 
                text: isArabic ? 'موافق' : 'OK', 
                onPress: () => {
                  setIsConnected(true);
                  setState('idle');
                }
              }
            ]
          );
        }
      }, 2000);
    }
  }, [isArabic, isConnected]);
  
  // Start real-time listening
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
  
  // Web real-time listening with continuous speech recognition
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
      
      // Set up MediaRecorder for audio chunks
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await processAudioBlob(audioBlob);
          audioChunksRef.current = [];
        }
      };
      
      // Use Web Speech Recognition for immediate feedback
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = isArabic ? 'ar-SA' : 'en-US';
        recognition.maxAlternatives = 1;
        
        webRecognitionRef.current = recognition;
        
        recognition.onstart = () => {
          console.log('Real-time speech recognition started');
        };
        
        recognition.onresult = (event: any) => {
          try {
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript;
              }
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
                
                // Stop current recording and process
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                  mediaRecorderRef.current.stop();
                }
                
                // Process the command immediately
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
          if (isListeningRef.current) {
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
      
      // Start recording in chunks
      mediaRecorder.start(3000); // 3-second chunks
      
    } catch (error) {
      console.error('Error starting web realtime listening:', error);
      throw error;
    }
  };
  
  // Mobile real-time recording with continuous processing
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
            await new Promise(resolve => setTimeout(resolve, 3000)); // 3-second chunks
            
            if (recordingRef.current && isListeningRef.current) {
              // Stop current recording
              await recordingRef.current.stopAndUnloadAsync();
              const uri = recordingRef.current.getURI();
              
              if (uri) {
                // Process this chunk
                await processAudioFile(uri);
                
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
  
  // Process audio blob (web)
  const processAudioBlob = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', isArabic ? 'ar' : 'auto');
      formData.append('context', JSON.stringify(conversationContextRef.current));
      
      const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
      
      if (!baseUrl) {
        // Mock transcription and response
        const mockTranscription = isArabic ? 'مرحبا ميزون' : 'Hey Mizon';
        const mockResponse: GeminiResponse = {
          response: isArabic 
            ? 'مرحبا! أنا ميزون، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟'
            : 'Hello! I\'m Mizon, your smart assistant. How can I help you today?',
          language: isArabic ? 'ar' : 'en'
        };
        
        // Add to context
        conversationContextRef.current.push(mockTranscription);
        
        // Stream the response
        await streamResponse(mockResponse.response);
        
        // Speak the response
        await speakResponse(mockResponse.response);
        return;
      }
      
      const response = await fetch(`${baseUrl}/api/gemini-realtime/audio`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result: GeminiResponse & { transcription: string } = await response.json();
        
        if (result.transcription && result.transcription.trim().length > 0) {
          console.log('Transcribed:', result.transcription);
          
          // Check for stop commands
          if (detectStopCommand(result.transcription) && sessionActive) {
            console.log('Stop command detected');
            endSession();
            return;
          }
          
          // Check for wake phrase or process if session is active
          if (sessionActive || detectWakePhrase(result.transcription)) {
            if (!sessionActive) {
              setSessionActive(true);
              console.log('Wake phrase detected');
            }
            
            // Add to context
            conversationContextRef.current.push(result.transcription);
            
            // Stream the response
            await streamResponse(result.response);
            
            // Execute action if present
            if (result.action) {
              executeAction(result.action);
            }
            
            // Speak the response
            await speakResponse(result.response);
          }
        }
      }
    } catch (error) {
      console.error('Error processing audio blob:', error);
    }
  };
  
  // Process audio file (mobile)
  const processAudioFile = async (audioUri: string) => {
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
      formData.append('language', isArabic ? 'ar' : 'auto');
      formData.append('context', JSON.stringify(conversationContextRef.current));

      const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
      
      if (!baseUrl) {
        // Mock transcription and response
        const mockTranscription = isArabic ? 'مرحبا ميزون' : 'Hey Mizon';
        const mockResponse: GeminiResponse = {
          response: isArabic 
            ? 'مرحبا! أنا ميزون، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟'
            : 'Hello! I\'m Mizon, your smart assistant. How can I help you today?',
          language: isArabic ? 'ar' : 'en'
        };
        
        // Add to context
        conversationContextRef.current.push(mockTranscription);
        
        // Stream the response
        await streamResponse(mockResponse.response);
        
        // Speak the response
        await speakResponse(mockResponse.response);
        return;
      }
      
      const response = await fetch(`${baseUrl}/api/gemini-realtime/audio`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result: GeminiResponse & { transcription: string } = await response.json();
        
        if (result.transcription && result.transcription.trim().length > 0) {
          console.log('Transcribed:', result.transcription);
          
          // Check for stop commands
          if (detectStopCommand(result.transcription) && sessionActive) {
            console.log('Stop command detected');
            endSession();
            return;
          }
          
          // Check for wake phrase or process if session is active
          if (sessionActive || detectWakePhrase(result.transcription)) {
            if (!sessionActive) {
              setSessionActive(true);
              console.log('Wake phrase detected');
            }
            
            // Add to context
            conversationContextRef.current.push(result.transcription);
            
            // Stream the response
            await streamResponse(result.response);
            
            // Execute action if present
            if (result.action) {
              executeAction(result.action);
            }
            
            // Speak the response
            await speakResponse(result.response);
          }
        }
      }
    } catch (error) {
      console.error('Error processing audio file:', error);
    }
  };
  
  // Process voice command directly
  const processVoiceCommand = async (text: string) => {
    setState('processing');
    setCurrentResponse('');
    
    try {
      // Add to conversation context
      conversationContextRef.current.push(text);
      
      const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
      
      // Use mock responses if no backend is configured
      if (!baseUrl) {
        const mockResponse: GeminiResponse = {
          response: isArabic 
            ? `تم فهم طلبك: "${text}". هذا رد تجريبي من ميزون الفوري.`
            : `I understood your request: "${text}". This is a mock response from Mizon Realtime.`,
          language: isArabic ? 'ar' : 'en'
        };
        
        // Add mock actions based on keywords
        if (text.toLowerCase().includes('health') || text.includes('صحة') || text.includes('مستشفى')) {
          mockResponse.action = {
            type: 'navigate',
            data: { route: '/(tabs)/health' },
            confirmation: isArabic ? '✅ تم فتح قسم الصحة' : '✅ Opened Health section'
          };
        } else if (text.toLowerCase().includes('bank') || text.includes('بنك')) {
          mockResponse.action = {
            type: 'navigate',
            data: { route: '/(tabs)/banking' },
            confirmation: isArabic ? '✅ تم فتح قسم البنوك' : '✅ Opened Banking section'
          };
        }
        
        // Stream the response
        await streamResponse(mockResponse.response);
        
        // Execute action if present
        if (mockResponse.action) {
          executeAction(mockResponse.action);
        }
        
        // Speak the response
        await speakResponse(mockResponse.response);
        return;
      }
      
      const response = await fetch(`${baseUrl}/api/gemini-realtime/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          context: conversationContextRef.current,
          language: isArabic ? 'ar' : 'en'
        })
      });
      
      if (response.ok) {
        const result: GeminiResponse = await response.json();
        
        // Stream the response
        await streamResponse(result.response);
        
        // Execute action if present
        if (result.action) {
          executeAction(result.action);
        }
        
        // Speak the response
        await speakResponse(result.response);
      }
      
    } catch (error) {
      console.error('Error processing voice command:', error);
      setState('idle');
    }
  };
  
  // Stream response word by word
  const streamResponse = async (text: string) => {
    if (!text || typeof text !== 'string') {
      console.warn('Invalid text for streaming:', text);
      return;
    }
    
    const cleanText = text.trim();
    if (!cleanText) {
      return;
    }
    
    const words = cleanText.split(' ').filter(word => word.length > 0);
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      setCurrentResponse(currentText);
      await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay for streaming
    }
  };
  
  // Speak response with TTS
  const speakResponse = async (text: string) => {
    setState('speaking');
    
    try {
      if (Platform.OS === 'web') {
        if ('speechSynthesis' in window) {
          // Cancel any ongoing speech
          window.speechSynthesis.cancel();
          
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = isArabic ? 'ar-SA' : 'en-US';
          utterance.rate = 1.1;
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
            if (sessionActive) {
              // Continue listening after speaking
              setTimeout(() => {
                if (sessionActive) {
                  setState('listening');
                }
              }, 500);
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
            if (sessionActive) {
              setState('listening');
            }
          }, 2000);
        }
      } else {
        // For mobile, estimate speaking time
        const estimatedTime = Math.max(1500, text.length * 50);
        setTimeout(() => {
          setState('idle');
          if (sessionActive) {
            setState('listening');
          }
        }, estimatedTime);
      }
    } catch (error) {
      console.error('Error speaking response:', error);
      setState('idle');
    }
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
    if (Platform.OS !== 'web') {
      Alert.alert(
        isArabic ? 'تم' : 'Done',
        message,
        [{ text: 'OK' }],
        { cancelable: true }
      );
    }
  };
  
  // Stop listening and clean up
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
  
  // Detect wake phrase
  const detectWakePhrase = useCallback((text: string): boolean => {
    const lowerText = text.toLowerCase();
    const wakePhrases = [
      'hey mizon',
      'مرحبا ميزون',
      'يا ميزون',
      'mizon'
    ];
    
    return wakePhrases.some(phrase => lowerText.includes(phrase));
  }, []);
  
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
        await connectToBackend();
      }
      await startListening();
    }
  }, [state, isConnected, connectToBackend, startListening, stopListening]);
  
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
      
      const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
      
      if (!baseUrl) {
        // Mock image analysis
        const mockResponse: GeminiResponse = {
          response: isArabic 
            ? 'أرى صورة. هذا رد تجريبي لتحليل الصور من ميزون.'
            : 'I can see an image. This is a mock image analysis response from Mizon.',
          language: isArabic ? 'ar' : 'en',
          action: {
            type: 'navigate',
            data: { route: '/(tabs)/bills' },
            confirmation: isArabic ? '✅ تم حفظ الصورة' : '✅ Image saved'
          }
        };
        
        await streamResponse(mockResponse.response);
        
        // Execute action if present
        if (mockResponse.action) {
          executeAction(mockResponse.action);
        }
        
        await speakResponse(mockResponse.response);
        return;
      }
      
      const apiResponse = await fetch(`${baseUrl}/api/gemini-realtime/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64Data,
          text: text || (isArabic ? 'ما هذا؟ هل هذه فاتورة؟' : 'What is this? Is this a bill?'),
          language: isArabic ? 'ar' : 'en'
        })
      });
      
      if (apiResponse.ok) {
        const result: GeminiResponse = await apiResponse.json();
        
        await streamResponse(result.response);
        
        // Execute action if present
        if (result.action) {
          executeAction(result.action);
        }
        
        await speakResponse(result.response);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setState('idle');
    }
  }, [isArabic, executeAction]);
  
  // Initialize connection on mount
  useEffect(() => {
    connectToBackend();
  }, [connectToBackend]);
  
  return {
    state,
    isConnected,
    sessionActive,
    currentResponse,
    startListening,
    stopListening,
    toggleListening,
    sendTextMessage,
    sendImageMessage,
    endSession,
    detectWakePhrase,
    detectStopCommand
  };
}