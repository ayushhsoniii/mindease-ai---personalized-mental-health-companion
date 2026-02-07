
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, User, Bot, Sparkles, Brain, ShieldCheck, Search, Database, Fingerprint, Heart, Target, Microscope, HelpCircle, ExternalLink, Zap, Cloud } from 'lucide-react';
import { ChatMessage, Mood, UserProfile, AppLanguage, TestResult, ResponseStyle } from '../types';
import { apiService } from '../services/apiService';
import { getTranslations } from '../translations';

interface ChatWindowProps {
  currentMood: Mood | null;
  userProfile: UserProfile | null;
  testResults: TestResult[];
  spotifyVibe?: string;
  language: AppLanguage;
  responseStyle: ResponseStyle;
  isBackendOnline: boolean;
  ragStatus: string;
  onStyleChange: (style: ResponseStyle) => void;
  onNewMessage: (history: ChatMessage[]) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  currentMood, 
  userProfile, 
  testResults, 
  spotifyVibe, 
  language, 
  responseStyle,
  isBackendOnline,
  ragStatus,
  onStyleChange,
  onNewMessage 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [groundingLinks, setGroundingLinks] = useState<{title: string, uri: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = getTranslations(language);
  const responseStyleLabel = t.responseStyles?.[responseStyle] || responseStyle;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);
    setGroundingLinks([]);

    const aiMsgId = (Date.now() + 1).toString();
    const initialAiMsg: ChatMessage = {
      id: aiMsgId,
      role: 'model',
      content: '',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, initialAiMsg]);

    let stream;

let fullContent = '';

try {
  let stream;

  if (isBackendOnline && ragStatus === 'ready') {
    stream = apiService.generateResponseStream(
      newHistory,
      currentMood,
      userProfile,
      language,
      testResults,
      responseStyle,
      spotifyVibe
    );
  } else {
    throw new Error("Backend unavailable");
  }

  for await (const chunk of stream) {
    fullContent += chunk.text;

    if (chunk.grounding) {
      const links = chunk.grounding
        .filter((c: any) => c.web)
        .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));

      setGroundingLinks(prev => [...new Set([...prev, ...links])]);
    }

    setMessages(prev =>
      prev.map(m =>
        m.id === aiMsgId ? { ...m, content: fullContent } : m
      )
    );
  }

  onNewMessage([...newHistory, { ...initialAiMsg, content: fullContent }]);

} catch (err: any) {
  console.error(err);

  let safeMessage = t.chat.errors.generic;

  if (
    err?.message?.includes("503") ||
    err?.message?.includes("UNAVAILABLE") ||
    err?.message?.includes("overloaded")
  ) {
    safeMessage = t.chat.errors.overloaded;
  }

  setMessages(prev =>
    prev.map(m =>
      m.id === aiMsgId ? { ...m, content: safeMessage } : m
    )
  );
} finally {
  setIsLoading(false);
}


    

  };

  const personas: { id: ResponseStyle; label: string; icon: any; color: string }[] = [
    { id: 'compassionate', label: t.responseStyles.compassionate, icon: Heart, color: 'text-pink-500' },
    { id: 'direct', label: t.responseStyles.direct, icon: Target, color: 'text-orange-500' },
    { id: 'scientific', label: t.responseStyles.scientific, icon: Microscope, color: 'text-blue-500' },
    { id: 'reflective', label: t.responseStyles.reflective, icon: HelpCircle, color: 'text-purple-500' },
  ];

  return (
    <div className="flex flex-col h-[650px] theme-card rounded-[48px] shadow-2xl border border-[var(--border)] overflow-hidden transition-theme">
      {/* RAG & Persona Header */}
      <div className="px-8 py-6 border-b border-[var(--border)] bg-[var(--primary-light)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[var(--primary)] rounded-2xl flex items-center justify-center shadow-lg relative">
             <Bot className="w-8 h-8 text-white" />
             <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[var(--card-bg)] flex items-center justify-center">
               <ShieldCheck className="w-3 h-3 text-white" />
             </div>
          </div>
          <div>
            <h3 className="font-black text-xl theme-text-main leading-tight flex items-center gap-2">
              {t.chat.title}
              <span className={`animate-pulse w-2 h-2 rounded-full ${isBackendOnline ? 'bg-green-500' : 'bg-blue-400'}`} />
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
               <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border transition-colors ${isBackendOnline ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                  <Database className="w-2.5 h-2.5" /> {isBackendOnline ? t.chat.badges.localKnowledge : t.chat.badges.cloudOnly}
               </span>
               <span className="flex items-center gap-1.5 text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                  <Search className="w-2.5 h-2.5" /> {t.chat.badges.webSearch}
               </span>
            </div>
          </div>
        </div>

        {/* Persona Selector */}
        <div className="bg-[var(--card-bg)] p-1.5 rounded-2xl border border-[var(--border)] flex items-center gap-1 shadow-sm">
          {personas.map(p => (
            <button
              key={p.id}
              onClick={() => onStyleChange(p.id)}
              title={p.label}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                responseStyle === p.id 
                  ? `bg-[var(--primary-light)] ${p.color} font-black shadow-inner` 
                  : 'theme-text-muted hover:bg-slate-50'
              }`}
            >
              <p.icon className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-tighter hidden sm:block">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth bg-[var(--bg-solid)]"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-sm mx-auto">
            <div className="w-24 h-24 bg-[var(--primary-light)] rounded-[32px] flex items-center justify-center animate-pulse">
              <Brain className="w-12 h-12 text-[var(--primary)]" />
            </div>
            <div className="space-y-3">
               <h4 className="text-2xl font-black theme-text-main">{t.chat.empty.title}</h4>
               <p className="theme-text-muted text-sm leading-relaxed font-medium">
                  {isBackendOnline 
                    ? t.chat.empty.connected
                    : t.chat.empty.cloudFallback}
               </p>
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-[var(--primary)]' : 'theme-card border border-[var(--border)]'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 theme-text-muted" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className={`p-5 rounded-[28px] text-[15px] leading-relaxed shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-[var(--primary)] text-white rounded-tr-none' 
                    : 'theme-card text-slate-800 border border-[var(--border)] rounded-tl-none'
                }`}>
                  {msg.content || (isLoading && msg.role === 'model' && <Loader2 className="w-4 h-4 animate-spin opacity-50" />)}
                </div>
                {msg.role === 'model' && groundingLinks.length > 0 && msg.id === messages[messages.length-1].id && (
                    <div className="flex flex-wrap gap-2 px-2">
                        {groundingLinks.map((link, idx) => (
                            <a 
                                key={idx} 
                                href={link.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-bold text-blue-600 shadow-sm hover:bg-blue-50 transition-colors"
                            >
                                <Search className="w-2.5 h-2.5" /> {link.title.substring(0, 20)}...
                            </a>
                        ))}
                    </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length-1]?.role !== 'model' && (
          <div className="flex justify-start">
            <div className="flex gap-4 items-center theme-text-muted">
              <div className="w-10 h-10 rounded-2xl theme-card flex items-center justify-center border border-[var(--border)] shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-[var(--primary)]" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">
                {t.chat.loading.replace('{style}', responseStyleLabel)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-8 border-t border-[var(--border)] bg-[var(--card-bg)]/80 backdrop-blur-md">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.chat.inputPlaceholder}
            className="w-full pl-8 pr-16 py-6 bg-[var(--bg-solid)] rounded-[32px] border-2 border-transparent focus:border-[var(--primary)] focus:bg-[var(--card-bg)] transition-all text-sm outline-none theme-text-main shadow-inner font-bold"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[var(--primary)] text-white rounded-2xl flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-[var(--primary)]/20 active:scale-90"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-4 px-4">
           <div className="flex items-center gap-4">
              <p className="text-[8px] theme-text-muted font-black uppercase tracking-[0.2em]">
                {t.chat.activeStyle.replace('{style}', responseStyleLabel)}
              </p>
              <div className="flex items-center gap-1.5">
                {isBackendOnline ? (
                  <Zap className="w-3 h-3 text-emerald-500 animate-pulse" />
                ) : (
                  <Cloud className="w-3 h-3 text-blue-400" />
                )}
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isBackendOnline ? 'text-emerald-500' : 'text-blue-400'}`}>
                  {isBackendOnline ? t.chat.statusLocal : t.chat.statusCloud}
                </span>
              </div>
           </div>
           <p className="text-[8px] theme-text-muted font-black uppercase tracking-[0.2em]">{t.chat.poweredBy}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
