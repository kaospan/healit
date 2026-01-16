import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  userName?: string;
}

/**
 * ChatGPT-style Chat Interface Component
 * 
 * @description Interactive chat interface for dashboard
 */
export default function ChatInterface({ userName }: ChatInterfaceProps) {
  const { language } = useLanguage();
  const isHebrew = language === Language.HEBREW;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: isHebrew 
        ? `שלום ${userName || ''}! אני עוזר הבריאות הדיגיטלי של Healit. אני כאן כדי לעזור לך עם מעקב אחר הפניות, בדיקות ותיאום טיפולים. איך אוכל לעזור לך היום?`
        : `Hello ${userName || ''}! I'm your Healit digital health assistant. I'm here to help you track referrals, tests, and coordinate care. How can I help you today?`,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (replace with actual AI integration later)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(inputValue, isHebrew),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (input: string, hebrew: boolean): string => {
    const lowerInput = input.toLowerCase();
    
    // Simple response logic (replace with AI later)
    if (lowerInput.includes('הפני') || lowerInput.includes('referral')) {
      return hebrew
        ? 'אני יכול לעזור לך לעקוב אחר ההפניות שלך. האם יש לך הפניה ספציפית שתרצה לבדוק?'
        : 'I can help you track your referrals. Do you have a specific referral you\'d like to check?';
    } else if (lowerInput.includes('בדיק') || lowerInput.includes('test') || lowerInput.includes('exam')) {
      return hebrew
        ? 'אני יכול לעזור לך לעקוב אחר תוצאות בדיקות ובדיקות ממתינות. מה תרצה לבדוק?'
        : 'I can help you track test results and pending exams. What would you like to check?';
    } else if (lowerInput.includes('חירום') || lowerInput.includes('emergency')) {
      return hebrew
        ? '⚠️ במקרה חירום - התקשר מיד למוקד 101! אני לא מבצע אבחון רפואי. אם זו שאלה כללית, אני כאן לעזור.'
        : '⚠️ In case of emergency - call 101 immediately! I don\'t make medical diagnoses. If this is a general question, I\'m here to help.';
    } else if (lowerInput.includes('עזרה') || lowerInput.includes('help')) {
      return hebrew
        ? 'אני יכול לעזור לך עם:\n- מעקב הפניות ובדיקות\n- תיאום טיפולים\n- בדיקת תוצאות\n- זיהוי פערים בטיפול\n\nמה תרצה לעשות?'
        : 'I can help you with:\n- Tracking referrals and tests\n- Coordinating care\n- Checking results\n- Identifying care gaps\n\nWhat would you like to do?';
    } else {
      return hebrew
        ? 'אני כאן כדי לעזור עם מעקב אחר הטיפול הרפואי שלך. אני לא מבצע אבחנות או נותן ייעוץ רפואי. האם תוכל לספר לי יותר על מה שאתה מחפש?'
        : 'I\'m here to help with tracking your medical care. I don\'t make diagnoses or provide medical advice. Can you tell me more about what you\'re looking for?';
    }
  };

  const quickActions = isHebrew ? [
    'בדוק הפניות שלי',
    'תוצאות בדיקות',
    'מעקבים ממתינים',
    'מה חדש?'
  ] : [
    'Check my referrals',
    'Test results',
    'Pending follow-ups',
    'What\'s new?'
  ];

  const handleQuickAction = (action: string) => {
    setInputValue(action);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          💬 {isHebrew ? 'עוזר בריאות דיגיטלי' : 'Digital Health Assistant'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isHebrew ? 'מעקב ותיאום טיפולים' : 'Care tracking and coordination'}
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <div className="whitespace-pre-line">{message.content}</div>
              <div
                className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString(isHebrew ? 'he-IL' : 'en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isHebrew ? 'הקלד הודעה...' : 'Type a message...'}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !inputValue.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isHebrew ? 'שלח' : 'Send'}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {isHebrew 
            ? '⚠️ זכור: אני לא מבצע אבחנות רפואיות. במקרה חירום התקשר ל-101'
            : '⚠️ Remember: I don\'t make medical diagnoses. In case of emergency, call 101'}
        </p>
      </form>
    </div>
  );
}
