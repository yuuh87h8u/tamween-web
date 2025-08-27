import React, { useState } from 'react';
import { Send, Camera, Mic, Image as ImageIcon, Zap } from 'lucide-react';
import { useApp } from '../hooks/useAppStore';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUri?: string;
}

export default function AIAssistant() {
  const { userData, theme, authUser } = useApp();
  const isArabic = userData.language === 'ar';
  const userRole = authUser?.role || 'individual';
  
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
    
    // Simulate AI response
    setTimeout(() => {
      addMessage({
        type: 'assistant',
        content: isArabic 
          ? 'شكراً لرسالتك! أنا هنا لمساعدتك في إدارة الفواتير والعثور على العروض.'
          : 'Thanks for your message! I\'m here to help you manage bills and find deals.'
      });
    }, 1000);
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      addMessage({
        type: 'user',
        content: isArabic ? 'رسالة صوتية...' : 'Voice message...'
      });
      
      setTimeout(() => {
        setIsRecording(false);
        addMessage({
          type: 'assistant',
          content: isArabic 
            ? 'أقرب متجر هو لولو هايبرماركت على بعد 0.8 كيلومتر. ساعات العمل من 8AM - 12AM'
            : 'The nearest store is LuLu Hypermarket, 0.8km away. Open 8AM - 12AM'
        });
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
            <Zap size={16} color="white" />
          </div>
          <div>
            <h1 className="font-semibold" style={{ color: theme.text }}>
              {userRole === 'family' 
                ? (isArabic ? 'المستشار المالي العائلي' : 'Family Financial Advisor')
                : userRole === 'business'
                ? (isArabic ? 'مساعد الأعمال الذكي' : 'Business AI Assistant')
                : (isArabic ? 'مساعد تموين الذكي' : 'Tamween AI Assistant')
              }
            </h1>
            <p className="text-sm" style={{ color: theme.textTertiary }}>
              {isArabic ? 'صور • صوت • نص' : 'Photos • Voice • Text'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start gap-2 max-w-xs lg:max-w-md">
              {message.type === 'assistant' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.surface }}>
                  <Zap size={16} color={theme.primary} />
                </div>
              )}
              
              <div
                className={`px-4 py-3 rounded-2xl ${
                  message.type === 'user' 
                    ? 'rounded-br-sm' 
                    : 'rounded-bl-sm'
                }`}
                style={{ 
                  backgroundColor: message.type === 'user' ? theme.primary : theme.surfaceSecondary,
                  color: message.type === 'user' ? 'white' : theme.text
                }}
              >
                {message.imageUri && (
                  <img src={message.imageUri} alt="Uploaded" className="w-48 h-36 object-cover rounded-lg mb-2" />
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
        <div className="flex items-end gap-2">
          <button className="p-3 rounded-full" style={{ backgroundColor: theme.surfaceSecondary }}>
            <Camera size={20} color={theme.textTertiary} />
          </button>
          
          <button className="p-3 rounded-full" style={{ backgroundColor: theme.surfaceSecondary }}>
            <ImageIcon size={20} color={theme.textTertiary} />
          </button>
          
          <button 
            className={`p-3 rounded-full ${isRecording ? 'bg-red-500' : ''}`}
            style={{ backgroundColor: isRecording ? '#EF4444' : theme.surfaceSecondary }}
            onClick={handleVoiceToggle}
          >
            <Mic size={20} color={isRecording ? 'white' : theme.textTertiary} />
          </button>
          
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ backgroundColor: theme.surfaceSecondary }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
              className="flex-1 bg-transparent outline-none"
              style={{ color: theme.text }}
              placeholder={isArabic ? 'اكتب رسالتك...' : 'Type your message...'}
            />
          </div>
          
          <button
            onClick={handleSendText}
            disabled={!inputText.trim()}
            className={`p-3 rounded-full ${!inputText.trim() ? 'opacity-50' : ''}`}
            style={{ backgroundColor: theme.primary }}
          >
            <Send size={20} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}