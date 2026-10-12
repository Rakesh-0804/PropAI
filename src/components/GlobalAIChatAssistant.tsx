'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  User,
  Send,
  X,
  MapPin,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  properties?: Array<{
    id: string;
    title: string;
    price: number;
    city: string;
    propertyType: string;
    bedrooms: number;
    sizeSqft: number;
    imageUrl: string;
  }>;
  suggestions?: string[];
}

export default function GlobalAIChatAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: '👋 Namaste! I am **AGY Real Estate AI**, your 24/7 personal property concierge & financial advisor.\n\nI can help you find verified homes, calculate loan EMIs, estimate investment yields, or analyze neighborhood appreciation across Indian metro cities & global hubs.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'Find 3 BHK in Bangalore under 1.5 Cr',
        'Calculate EMI for 80 Lakh home loan',
        'Which city gives highest rental yield?',
        'Show properties under 20 Lakhs'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Here is what I found for you:',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        properties: data.properties || [],
        suggestions: data.suggestions || ['Ask another question', 'Search properties in Mumbai', 'Calculate EMI']
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: '🤖 I am currently operating on offline AI fallback mode. How can I assist with your property search or loan calculations today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(2)} Lakhs`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative btn-primary p-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 border border-white/20 cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
          </div>
          <span className="hidden sm:inline font-extrabold text-sm pr-1 text-white">Ask AGY AI</span>
          <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-sm text-white">
            <Sparkles className="w-3 h-3 text-amber-300" /> 24/7
          </span>
        </button>
      )}

      {/* Main Chat Assistant Modal Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] glass-card text-[#eaf2ff] p-0 shadow-2xl border border-white/20 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header Bar */}
          <div className="glass p-4 border-b border-white/15 flex items-center justify-between rounded-t-3xl rounded-b-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#5f86ff]/20 text-[#5f86ff] flex items-center justify-center shadow-lg border border-[#5f86ff]/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                  AGY Real Estate AI <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online Concierge & Advisor
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#93a9c7] hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Scroll Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'user'
                      ? 'bg-[#5f86ff] text-white'
                      : 'bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`space-y-2.5 max-w-[82%]`}>
                  <div
                    className={`p-3.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'btn-primary text-white rounded-tr-none font-medium'
                        : 'glass-panel text-[#eaf2ff] rounded-tl-none leading-relaxed'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <span className="block text-[9px] opacity-60 text-right mt-1 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Render Embedded Property Cards if available */}
                  {msg.properties && msg.properties.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] uppercase font-extrabold text-[#5f86ff] tracking-wider block">
                        Matching AI Property Picks:
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.properties.map(prop => (
                          <Link
                            key={prop.id}
                            href={`/properties/${prop.id}`}
                            className="flex items-center gap-3 p-2 rounded-2xl glass-panel hover:border-[#5f86ff]/50 transition-all group"
                          >
                            <img
                              src={prop.imageUrl}
                              alt={prop.title}
                              className="w-14 h-14 rounded-xl object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-white truncate text-xs group-hover:text-[#5f86ff] transition-colors">
                                {prop.title}
                              </h4>
                              <p className="text-[10px] text-[#93a9c7] flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-rose-400 shrink-0" /> {prop.city} • {prop.bedrooms} BHK
                              </p>
                              <p className="font-extrabold text-[#5f86ff] text-xs mt-1">
                                {formatPrice(prop.price)}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#93a9c7] group-hover:text-[#5f86ff] shrink-0 mr-1" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Suggestion Pills */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(sug)}
                          className="chip hover:chip-active text-[10px] font-semibold text-left cursor-pointer"
                        >
                          💡 {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-[#93a9c7] glass-panel p-3 max-w-[70%]">
                <Bot className="w-4 h-4 text-[#5f86ff] animate-spin" />
                <span className="text-xs font-semibold animate-pulse">AGY AI is calculating options...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 glass border-t border-white/15 rounded-b-3xl space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about properties, EMIs, or investment returns..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 glass-input text-xs font-medium"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-primary p-2.5 shadow-md disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-[#93a9c7] px-1">
              <span>Powered by AGY Gemini Neural Models</span>
              <span>100% Verified Data</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
