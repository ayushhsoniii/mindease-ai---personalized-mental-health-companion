
import React, { useEffect, useState } from 'react';
import { Sparkles, Brain, Briefcase, Heart, Shield, AlertCircle, Loader2, Zap, Target, ArrowRight, TrendingUp, Award } from 'lucide-react';
import { UserProfile, PersonalityInsights as PersonalityInsightsData, TestResult, AppLanguage } from '../types';
import { geminiService } from '../services/geminiService';
import { translations } from '../translations';
import PersonalityTest from './PersonalityTest';

interface PersonalityInsightsProps {
  profile: UserProfile | null;
  testResults?: TestResult[];
  language: AppLanguage;
  onTakeTest: (type: string, description: string) => void;
  onTakeEQTest?: () => void;
}

const PersonalityInsights: React.FC<PersonalityInsightsProps> = ({ profile, testResults = [], language, onTakeTest, onTakeEQTest }) => {
  const [insights, setInsights] = useState<PersonalityInsightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTest, setShowTest] = useState(false);
  
  const t = translations[language] || translations['en'];
  const eqResult = testResults.find(t => t.testName.includes('Emotional Intelligence') || t.testName === 'Emotional Intelligence (WLEIS)');

  useEffect(() => {
    const fetchInsights = async () => {
      if (profile?.personalityType) {
        setLoading(true);
        try {
          const data = await geminiService.getPersonalityInsights(profile.personalityType, language);
          setInsights(data);
        } catch (error) {
          console.error("Failed to fetch personality insights", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchInsights();
  }, [profile?.personalityType, language]);

  if (showTest) {
    return (
      <div className="bg-white rounded-[48px] overflow-hidden shadow-2xl">
         <PersonalityTest language={language} onComplete={(type, desc) => { onTakeTest(type, desc); setShowTest(false); }} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Generating Your Archetype Profile...</p>
      </div>
    );
  }

  if (!profile?.personalityType) {
    return (
      <div className="bg-white rounded-[48px] p-10 md:p-20 text-center space-y-8 shadow-sm border border-slate-100 max-w-3xl mx-auto">
        <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-[32px] flex items-center justify-center mx-auto">
          <Brain className="w-12 h-12" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Who are you?</h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Unlock deep insights into your personality, strengths, and communication style by taking our short assessment.
          </p>
        </div>
        <button 
          onClick={() => setShowTest(true)}
          className="flex items-center gap-3 px-12 py-5 bg-indigo-600 text-white rounded-[24px] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all mx-auto active:scale-95 group"
        >
          {t.startDiscovery}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="bg-indigo-600 rounded-[48px] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
        <div className="absolute -right-20 -top-20 opacity-10">
          <Sparkles className="w-80 h-80" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
           <div className="w-32 h-32 md:w-48 md:h-48 rounded-[40px] border-4 border-white/20 shadow-2xl overflow-hidden flex-shrink-0">
             <img src={profile.photoUrl} alt="User" className="w-full h-full object-cover" />
           </div>
           <div className="space-y-6 flex-1 text-center md:text-left">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
               Identity Report • {profile.name}
             </div>
             <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
               The {profile?.personalityType}
             </h1>
             <p className="text-lg text-indigo-50 font-medium leading-relaxed max-w-2xl">
               {insights.summary}
             </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Zap className="w-7 h-7 text-amber-500" /> Key Strengths
          </h3>
          <div className="space-y-3">
            {insights.strengths?.map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-bold text-amber-900">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Target className="w-7 h-7 text-purple-500" /> Growth Areas
          </h3>
          <div className="space-y-3">
            {insights.weaknesses?.map((w, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-100/50">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="font-bold text-purple-900">{w}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-blue-500" /> Career & Purpose
          </h3>
          <p className="text-slate-600 font-medium leading-relaxed">{insights.career}</p>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Shield className="w-7 h-7 text-green-500" /> Coping Strategies
          </h3>
          <p className="text-slate-600 font-medium leading-relaxed">{insights.copingAdvice}</p>
      </div>
    </div>
  );
};

export default PersonalityInsights;