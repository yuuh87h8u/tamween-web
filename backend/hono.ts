import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes
app.use("*", cors());

// Mount tRPC router at /trpc
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/trpc",
    router: appRouter,
    createContext,
  })
);

// Gemini Realtime API endpoints
app.post("/gemini-realtime/text", async (c) => {
  try {
    const { text, context, language } = await c.req.json();
    const response = await getGeminiResponse(text, context || [], language || "en");
    return c.json(response);
  } catch (error) {
    console.error("Text processing error:", error);
    return c.json({ error: "Failed to process text" }, 500);
  }
});

app.post("/gemini-realtime/audio", async (c) => {
  try {
    const formData = await c.req.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || "auto";
    const context = JSON.parse(formData.get('context') as string || '[]');
    
    if (!audioFile) {
      return c.json({ error: "No audio file provided" }, 400);
    }
    
    // Convert audio to base64
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    
    // Transcribe audio
    const transcription = await transcribeAudio(audioBase64, language);
    
    if (!transcription || !transcription.trim()) {
      return c.json({ error: "No transcription available" }, 400);
    }
    
    // Get AI response
    const response = await getGeminiResponse(transcription, context, language);
    
    return c.json({
      transcription,
      ...response
    });
  } catch (error) {
    console.error("Audio processing error:", error);
    return c.json({ error: "Failed to process audio" }, 500);
  }
});

app.post("/gemini-realtime/image", async (c) => {
  try {
    const { imageData, text, language } = await c.req.json();
    const response = await getGeminiVisionResponse(imageData, text || "", language || "en");
    return c.json(response);
  } catch (error) {
    console.error("Image processing error:", error);
    return c.json({ error: "Failed to process image" }, 500);
  }
});



// Transcribe audio using external STT service
async function transcribeAudio(audioData: string, language: string = "auto"): Promise<string> {
  try {
    // Convert base64 audio to blob
    const audioBuffer = Buffer.from(audioData, 'base64');
    
    const formData = new FormData();
    const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
    formData.append('audio', audioBlob, 'audio.wav');
    
    if (language && language !== 'auto') {
      formData.append('language', language);
    }
    
    const response = await fetch('https://toolkit.rork.com/stt/transcribe/', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.text || "";
    }
    
    return "";
  } catch (error) {
    console.error("Transcription error:", error);
    return "";
  }
}

// Get Gemini AI response
async function getGeminiResponse(text: string, context: string[], language: string = "en") {
  try {
    const isArabic = language === 'ar';
    const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;
    
    if (!GOOGLE_API_KEY) {
      console.error('GOOGLE_API_KEY not found in environment variables');
      throw new Error('Google API key not configured');
    }
    
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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `Context: ${context.slice(-3).join(' ')}` },
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
      const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || 
        (isArabic ? 'عذراً، لم أفهم. يمكنك إعادة المحاولة؟' : 'Sorry, I did not understand. Can you try again?');
      
      // Check for actions
      const action = extractActionFromText(aiResponse, isArabic);
      
      return {
        response: aiResponse,
        action: action,
        language: language
      };
      
    } else {
      throw new Error(`Gemini API error: ${response.status}`);
    }
  } catch (error) {
    console.error("Gemini response error:", error);
    const fallbackResponse = language === 'ar' 
      ? 'عذراً، حدث خطأ. يمكنك المحاولة مرة أخرى؟'
      : 'Sorry, there was an error. Can you try again?';
    
    return {
      response: fallbackResponse,
      action: null,
      language: language,
      error: true
    };
  }
}

// Get Gemini Vision response
async function getGeminiVisionResponse(imageData: string, text: string, language: string = "en") {
  try {
    const isArabic = language === 'ar';
    const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;
    
    if (!GOOGLE_API_KEY) {
      console.error('GOOGLE_API_KEY not found in environment variables');
      throw new Error('Google API key not configured');
    }
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
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
                mime_type: 'image/jpeg',
                data: imageData
              }
            }
          ]
        }]
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || 
        (isArabic ? 'لم أتمكن من تحليل الصورة' : 'Could not analyze the image');
      
      // Check if it's a bill and create navigation action
      let action = null;
      if (aiResponse.toLowerCase().includes('bill') || aiResponse.includes('فاتورة')) {
        action = {
          type: 'navigate',
          data: { route: '/(tabs)/bills' },
          confirmation: isArabic ? '✅ تم حفظ الفاتورة' : '✅ Bill saved'
        };
      }
      
      return {
        response: aiResponse,
        action: action,
        language: language
      };
    }
  } catch (error) {
    console.error("Vision response error:", error);
    const fallbackResponse = language === 'ar' 
      ? 'عذراً، لم أتمكن من تحليل الصورة'
      : 'Sorry, I could not analyze the image';
    
    return {
      response: fallbackResponse,
      action: null,
      language: language,
      error: true
    };
  }
}



// Extract actions from AI response
function extractActionFromText(text: string, isArabic: boolean): any {
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
}

// Extract items from text for shopping lists
function extractItemsFromText(text: string): string[] {
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
      items.push(en); // Always return English for consistency
    }
  });
  
  return items;
}

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", message: "Gemini Realtime API is running" });
});

// Simple health check endpoint
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});


export default app;