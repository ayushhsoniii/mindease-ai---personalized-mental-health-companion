
import React, { useState, useEffect } from 'react';
import { Wind, Users, DollarSign, Building, Trees, Info, Sparkles, Save, CloudRain, ShieldCheck, Microscope, LineChart, Layers, MapPin, Database, Binary } from 'lucide-react';
import { EnvironmentData, AppLanguage } from '../types';
import { getTranslations } from '../translations';

interface EnvironmentAssessmentProps {
  initialData?: EnvironmentData;
  language: AppLanguage;
  onSave: (data: EnvironmentData) => void;
}

const EnvironmentAssessment: React.FC<EnvironmentAssessmentProps> = ({ initialData, language, onSave }) => {
  const t = getTranslations(language);
  const [scores, setScores] = useState<EnvironmentData>(initialData || {
    physical: 7,
    social: 7,
    economic: 7,
    built: 7
  });

  const [impactScore, setImpactScore] = useState(0);

  useEffect(() => {
    // Formula: Avg of factors, where higher is better for mental health.
    const avg = (scores.physical + scores.social + scores.economic + scores.built) / 4;
    setImpactScore(avg);
  }, [scores]);

  const handleSliderChange = (key: keyof EnvironmentData, val: number) => {
    setScores(prev => ({ ...prev, [key]: val }));
  };

  const getImpactLabel = (score: number) => {
    if (score >= 8) return { label: t.environment.impactLabels.nurturing, color: "text-emerald-500", bg: "bg-emerald-50" };
    if (score >= 6) return { label: t.environment.impactLabels.stable, color: "text-blue-500", bg: "bg-blue-50" };
    if (score >= 4) return { label: t.environment.impactLabels.demanding, color: "text-orange-500", bg: "bg-orange-50" };
    return { label: t.environment.impactLabels.critical, color: "text-red-500", bg: "bg-red-50" };
  };

  const currentImpact = getImpactLabel(impactScore);
  const statisticalCards = [
    { key: 'exposure', icon: Layers },
    { key: 'outcome', icon: Database },
    { key: 'correlation', icon: Binary },
    { key: 'gis', icon: MapPin }
  ];

  const FactorSlider = ({ 
    label, 
    value, 
    icon: Icon, 
    onChange, 
    desc 
  }: { 
    label: string, 
    value: number, 
    icon: any, 
    onChange: (v: number) => void,
    desc: string
  }) => (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-800">{label}</h4>
        </div>
        <span className={`text-xl font-black ${value > 7 ? 'text-emerald-500' : value > 4 ? 'text-blue-500' : 'text-orange-500'}`}>
          {value}/10
        </span>
      </div>
      <p className="text-xs text-slate-400 font-medium leading-relaxed">{desc}</p>
      <input 
        type="range" 
        min="1" 
        max="10" 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
      />
      <div className="flex justify-between text-[8px] font-black uppercase text-slate-300 tracking-widest">
        <span>{t.environment.sliderScale.restricting}</span>
        <span>{t.environment.sliderScale.supportive}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <CloudRain className="w-40 h-40" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-4 max-w-xl">
             <div className="flex items-center gap-2 text-indigo-500">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">{t.environment.titleLabel}</span>
             </div>
             <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t.environment.title}</h2>
             <p className="text-slate-500 font-medium leading-relaxed">
               {t.environment.summary}
             </p>
           </div>
           
           <div className={`p-8 rounded-[40px] text-center space-y-2 border-2 transition-colors ${currentImpact.bg} border-white shadow-xl`}>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t.environment.impactScoreLabel}</div>
              <div className={`text-6xl font-black ${currentImpact.color}`}>{impactScore.toFixed(1)}</div>
              <div className={`text-sm font-bold uppercase tracking-widest ${currentImpact.color}`}>{currentImpact.label}</div>
           </div>
        </div>
      </div>

      {/* Interactive Assessment Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FactorSlider 
          label={t.environment.factors.physical.label} 
          value={scores.physical} 
          icon={Wind}
          onChange={(v) => handleSliderChange('physical', v)}
          desc={t.environment.factors.physical.desc}
        />
        <FactorSlider 
          label={t.environment.factors.social.label} 
          value={scores.social} 
          icon={Users}
          onChange={(v) => handleSliderChange('social', v)}
          desc={t.environment.factors.social.desc}
        />
        <FactorSlider 
          label={t.environment.factors.economic.label} 
          value={scores.economic} 
          icon={DollarSign}
          onChange={(v) => handleSliderChange('economic', v)}
          desc={t.environment.factors.economic.desc}
        />
        <FactorSlider 
          label={t.environment.factors.built.label} 
          value={scores.built} 
          icon={Trees}
          onChange={(v) => handleSliderChange('built', v)}
          desc={t.environment.factors.built.desc}
        />
      </div>

      <div className="flex justify-center pt-6">
        <button 
          onClick={() => onSave(scores)}
          className="flex items-center gap-3 px-12 py-5 bg-indigo-600 text-white rounded-[24px] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 group"
        >
          <Save className="w-5 h-5" />
          {t.environment.updateButton}
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Scientific Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
        {/* Methodologies */}
        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-indigo-500">
            <Microscope className="w-6 h-6" />
            <h3 className="text-xl font-black uppercase tracking-tight">{t.environment.assessmentScalesTitle}</h3>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
              {t.environment.assessmentScalesQuote}
            </p>
            <ul className="space-y-3">
              {t.environment.assessmentScalesList.map((item: any, i: number) => (
                <li key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-100 transition-colors">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] font-black text-indigo-500 shadow-sm flex-shrink-0">0{i+1}</div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Statistical Model */}
        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-blue-500">
            <LineChart className="w-6 h-6" />
            <h3 className="text-xl font-black uppercase tracking-tight">{t.environment.statisticalImpactTitle}</h3>
          </div>
          <div className="space-y-6">
             <div className="p-6 bg-slate-900 rounded-3xl text-emerald-400 font-mono text-[11px] leading-relaxed border-2 border-slate-800 shadow-inner">
               <span className="text-slate-500 font-italic">{t.environment.modelComment}</span><br/>
               Score = β₀ + β₁(Air) + β₂(Nature) + β₃(Noise) + β₄(Social) + ε
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {statisticalCards.map((item, i) => {
                 const card = t.environment.statisticalImpactCards[item.key];
                 return (
                   <div key={i} className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50 space-y-2">
                     <item.icon className="w-4 h-4 text-blue-500" />
                     <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{card.label}</h4>
                     <p className="text-[10px] text-slate-500 leading-tight">{card.text}</p>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 flex items-start gap-4">
        <Info className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
        <div className="space-y-2">
          <h5 className="font-bold text-slate-700 uppercase text-xs tracking-widest">{t.environment.footerTitle}</h5>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            {t.environment.footerText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentAssessment;
