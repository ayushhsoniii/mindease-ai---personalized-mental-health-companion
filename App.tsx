
import React, { useState, useEffect, useRef } from 'react';
import { Mood, UserData, TestResult, UserProfile, AppLanguage, ResponseStyle } from './types';
import ChatWindow from './components/ChatWindow';
import AssessmentTest from './components/AssessmentTest';
import InsightsDashboard from './components/InsightsDashboard';
import AuthPage from './components/AuthPage';
import PersonalityInsights from './components/PersonalityInsights';
import ThemePage from './components/ThemePage';
import MusicTherapy from './components/MusicTherapy';
import { apiService } from './services/apiService';
import { getTranslations, languages } from './translations';
import { HeartHandshake, LogOut, Palette, Globe, Database, Terminal, Server, X, ZapOff, ShieldCheck, Check } from 'lucide-react';


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'tests' | 'insights' | 'personality' | 'themes' | 'music'>('chat');
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [ragStatus, setRagStatus] = useState<string>("initializing");
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('mindease_userdata');
    return saved ? JSON.parse(saved) : { 
      profile: null, moodHistory: [], testResults: [], isAuthenticated: false,
      onboardingComplete: false, personalityTestComplete: false, theme: 'blue',
      language: 'en', responseStyle: 'compassionate', spotifyLinked: false,
      recommendedPlaylists: []
    };
  });

  const languageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = async () => {
      const online = await apiService.checkHealth();
      setIsBackendOnline(online);
      setRagStatus(apiService.getRagStatus());
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('mindease_userdata', JSON.stringify(userData));
    document.documentElement.setAttribute('data-theme', userData.theme);
  }, [userData]);

  // Handle clicking outside of language menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const syncUserData = (next: UserData) => {
    if (!next.profile?.email) return;
    void apiService.syncUserData(next);
  };

  const shouldShowAuth =
    !userData.isAuthenticated || !userData.onboardingComplete || !userData.profile;

  if (shouldShowAuth) {
    return (
      <AuthPage
        onLogin={(p) => {
          const next = {
            ...userData,
            profile: p as UserProfile,
            isAuthenticated: true
          };
          setUserData(next);
          syncUserData(next);
        }}
        onCompleteOnboarding={(p) => {
          const next = {
            ...userData,
            profile: p,
            isAuthenticated: true,
            onboardingComplete: true
          };
          setUserData(next);
          syncUserData(next);
        }}
        initialStep={!userData.isAuthenticated ? 'login' : 'onboarding'}
        language={userData.language || 'en'}
      />
    );
  }

  const handleLanguageChange = (lang: AppLanguage) => {
    setUserData({ ...userData, language: lang });
    setShowLanguageMenu(false);
  };
  const t = getTranslations(userData.language);
  const isDarkTheme = userData.theme.startsWith('dark');
  const tabLabels: Record<typeof activeTab, string> = {
    chat: t.talk,
    tests: t.assessments,
    insights: t.insights,
    personality: t.personalityTab || t.personalityArchetype || 'Personality',
    themes: t.themes,
    music: t.music
  };


  return (
    <div className="min-h-screen calm-gradient pb-28 md:pb-12 transition-theme">
      {/* Setup Guide Modal */}
      {showSetupGuide && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-8 shadow-2xl animate-in zoom-in duration-300">
             <div className="flex justify-between items-start mb-6">
                <div className="bg-blue-50 p-4 rounded-3xl"><Server className="w-8 h-8 text-blue-500" /></div>
                <button onClick={() => setShowSetupGuide(false)} className="p-2 text-slate-300 hover:text-slate-500"><X className="w-6 h-6" /></button>
             </div>
             <h2 className="text-2xl font-black text-slate-800 mb-2">
                {t.systemStatus}
             </h2>

             <div className="space-y-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                   <Database className={`w-5 h-5 shrink-0 ${ragStatus === 'ready' ? 'text-green-500' : 'text-orange-400'}`} />
                   <div>
                      <p className="text-xs font-black uppercase text-slate-400 mb-1">{t.setupGuide.localKnowledgeTitle}</p>
                      <p className={`text-sm font-bold ${ragStatus === 'quota_exceeded' ? 'text-orange-500' : ragStatus === 'offline' ? 'text-slate-400' : 'text-slate-600'}`}>
                        {ragStatus === 'quota_exceeded' ? t.setupGuide.localKnowledgeQuota : ragStatus === 'ready' ? t.setupGuide.localKnowledgeReady : ragStatus === 'offline' ? t.setupGuide.localKnowledgeOffline : t.setupGuide.localKnowledgeConnecting}
                      </p>
                   </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                   <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
                   <div>
                      <p className="text-xs font-black uppercase text-blue-400 mb-1">{t.setupGuide.cloudStatusTitle}</p>
                      <p className="text-sm font-bold text-blue-700">{t.setupGuide.cloudStatusValue}</p>
                   </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                   <Terminal className="w-5 h-5 text-indigo-500 shrink-0" />
                   <div>
                      <p className="text-xs font-black uppercase text-slate-400 mb-1">{t.setupGuide.quotaHelpTitle}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{t.setupGuide.quotaHelpDesc}</p>
                   </div>
                </div>
             </div>
             <button onClick={() => setShowSetupGuide(false)} className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl font-black shadow-lg">{t.setupGuide.backToCompanion}</button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[var(--card-bg)]/40 backdrop-blur-md border-b border-[var(--border)] theme-card h-24 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center shadow-lg"><HeartHandshake className="w-6 h-6 text-white" /></div>
            <span className="font-extrabold text-2xl tracking-tighter theme-text-main">MindEase AI</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSetupGuide(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                ragStatus === 'quota_exceeded' ? 'bg-orange-50 border-orange-200' : 'bg-[var(--bg-solid)] border-[var(--border)]'
              }`}
            >
              {ragStatus === 'quota_exceeded' ? <ZapOff className="w-4 h-4 text-orange-500" /> : <Database className={`w-4 h-4 ${isBackendOnline ? 'text-green-500' : 'text-slate-300'}`} />}
              <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${ragStatus === 'quota_exceeded' ? 'text-orange-600' : 'text-slate-400'}`}>
                {ragStatus === 'quota_exceeded' ? t.nav.quotaLimit : isBackendOnline ? t.nav.systemSynced : t.nav.syncing}
              </span>
            </button>
            
            <div className="relative" ref={languageMenuRef}>
              <button 
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className={`p-3 theme-card border border-[var(--border)] rounded-full transition-all hover:scale-110 active:scale-90 flex items-center gap-2 ${showLanguageMenu ? 'bg-[var(--primary-light)] border-[var(--primary)] text-[var(--primary)]' : 'theme-text-muted'}`}
              >
                <Globe className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">
                  {languages.find(l => l.id === userData.language)?.native}
                </span>
              </button>
              
              {showLanguageMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-[32px] shadow-2xl border border-slate-100 py-4 z-[60] animate-in slide-in-from-top-2 duration-200">
                  <div className="px-6 py-2 border-b border-slate-50 mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.nav.selectLanguage}</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto px-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => handleLanguageChange(lang.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${
                          userData.language === lang.id 
                            ? 'bg-[var(--primary-light)] text-[var(--primary)]' 
                            : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-black">{lang.native}</span>
                          <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500">{lang.name}</span>
                        </div>
                        {userData.language === lang.id && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setActiveTab('themes')} className="p-3 theme-card border border-[var(--border)] rounded-full theme-text-muted transition-all hover:scale-110 active:scale-90"><Palette className="w-5 h-5" /></button>
            <button onClick={() => setUserData({...userData, isAuthenticated: false})} className="p-2 theme-text-muted hover:text-red-500 transition-colors"><LogOut className="w-5 h-5" /></button>
          </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 gap-10">
          <div>
            <div className={`flex items-center gap-1 mb-6 p-1 backdrop-blur-sm rounded-2xl border w-fit ${
              isDarkTheme ? 'bg-white/10 border-white/10' : 'bg-white/50 border-white/40'
            }`}>
              {(['chat', 'tests', 'insights', 'personality', 'music'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab
                      ? 'bg-white text-[var(--primary)] shadow-md'
                      : isDarkTheme
                        ? 'text-slate-200 hover:text-white'
                        : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tabLabels[tab] || tab}
                </button>
              ))}
            </div>

            {activeTab === 'chat' && (
              <ChatWindow 
                currentMood={currentMood} 
                userProfile={userData.profile} 
                testResults={userData.testResults} 
                language={userData.language || 'en'} 
                responseStyle={userData.responseStyle}
                isBackendOnline={isBackendOnline}
                ragStatus={ragStatus}
                onStyleChange={(s) => setUserData({...userData, responseStyle: s})}
                onNewMessage={() => {}} 
              />
            )}
            {activeTab === 'insights' && <InsightsDashboard data={userData} onUpdateProfile={(p) => setUserData({...userData, profile: {...userData.profile!, ...p}})} language={userData.language} />}
            {activeTab === 'personality' && <PersonalityInsights profile={userData.profile} language={userData.language} onTakeTest={(type, desc) => setUserData({...userData, profile: {...userData.profile!, personalityType: type, personalityDescription: desc}})} />}
            {activeTab === 'themes' && <ThemePage currentTheme={userData.theme} onThemeChange={(t) => setUserData({...userData, theme: t})} language={userData.language} />}
            {activeTab === 'tests' && <AssessmentTest language={userData.language} onComplete={(r) => setUserData({...userData, testResults: [...userData.testResults, r]})} />}
            {activeTab === 'music' && (
              <MusicTherapy 
                currentMood={currentMood} profile={userData.profile} 
                isLinked={userData.spotifyLinked} recommendedPlaylists={userData.recommendedPlaylists}
                onLink={() => setUserData({...userData, spotifyLinked: true})}
                onRefresh={(p) => setUserData({...userData, recommendedPlaylists: p})}
                onVibeUpdate={(v) => setUserData({...userData, spotifyVibe: v})}
                language={userData.language}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
