import React, { useState, useRef, useEffect } from 'react';
import { generateBotResponse } from '../../services/geminiService';
import { Send, User, Bot, Loader2, AlertTriangle, Phone } from 'lucide-react';
import { ChatMessage } from '../../types';

const ChatbotPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm your virtual mental health assistant. I'm here to listen and support you. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build history for context (last 10 messages)
      const history = messages.slice(-10).map(m => ({ role: m.role, text: m.text }));
      const responseText = await generateBotResponse(history, userMsg.text);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to detect if emergency resources should be shown (simple keyword check for demo UI enhancement)
  // Real implementation relies on Gemini response content, but we can augment the UI if specific keywords appear in the bot response
  const lastMessage = messages[messages.length - 1];
  const showEmergency = lastMessage?.role === 'model' && (
      lastMessage.text.toLowerCase().includes('suicide') || 
      lastMessage.text.toLowerCase().includes('self-harm') ||
      lastMessage.text.toLowerCase().includes('help line')
  );

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Disclaimer Banner */}
      <div className="bg-blue-50 px-4 py-2 text-xs text-blue-800 text-center border-b border-blue-100 flex items-center justify-center">
        <AlertTriangle className="h-3 w-3 mr-2" />
        This is an AI automated system. Not for medical diagnosis. In emergencies, call 999.
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-brand-100 text-brand-600' : 'bg-green-100 text-green-600'}`}>
                {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              
              <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-brand-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-200 shadow-sm rounded-tl-none'
              } ${msg.isError ? 'border-red-300 bg-red-50 text-red-800' : ''}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
                    <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                </div>
             </div>
          </div>
        )}

        {showEmergency && (
             <div className="mx-auto max-w-lg bg-red-50 border border-red-200 rounded-xl p-4 mt-4 animate-fade-in">
                 <div className="flex items-center gap-3 text-red-800 font-bold mb-2">
                     <Phone className="h-5 w-5" /> Emergency Resources
                 </div>
                 <div className="text-sm text-red-700 space-y-1">
                     <p>Befrienders KL: <a href="tel:03-76272929" className="underline">03-76272929</a> (24/7)</p>
                     <p>Talian Kasih: <a href="tel:15999" className="underline">15999</a></p>
                     <p>APU Counseling: Level 4, Spine</p>
                 </div>
             </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="flex gap-2 relative">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 p-3 pr-12 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                disabled={isLoading}
            />
            <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 transition-colors"
            >
                <Send className="h-4 w-4" />
            </button>
        </form>
        <p className="text-center text-xs text-slate-400 mt-2">
            Messages are private and confidential. AI can make mistakes.
        </p>
      </div>
    </div>
  );
};

export default ChatbotPage;