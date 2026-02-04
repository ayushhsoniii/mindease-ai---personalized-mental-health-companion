
import React, { useState } from 'react';
import { ArrowRight, Sparkles, Brain, Zap, Users, Shield, Check, X } from 'lucide-react';
import { AppLanguage } from '../types';
import { translations } from '../translations';

interface PersonalityTestProps {
  language: AppLanguage;
  onComplete: (type: string, description: string) => void;
  onSkip?: () => void;
}

const TRAITS_METADATA = [
  { trait: "E", weight: 1 }, { trait: "E", weight: -1 }, { trait: "E", weight: 1 }, { trait: "E", weight: -1 }, { trait: "E", weight: 1 }, { trait: "E", weight: -1 },
  { trait: "N", weight: 1 }, { trait: "N", weight: -1 }, { trait: "N", weight: -1 }, { trait: "N", weight: 1 }, { trait: "N", weight: 1 }, { trait: "N", weight: -1 },
  { trait: "T", weight: -1 }, { trait: "T", weight: 1 }, { trait: "T", weight: 1 }, { trait: "T", weight: -1 }, { trait: "T", weight: -1 }, { trait: "T", weight: 1 },
  { trait: "J", weight: -1 }, { trait: "J", weight: 1 }, { trait: "J", weight: -1 }, { trait: "J", weight: 1 }, { trait: "J", weight: 1 }, { trait: "J", weight: -1 }
];

const PersonalityTest: React.FC<PersonalityTestProps> = ({ language, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({ E: 0, N: 0, T: 0, J: 0 });
  const [selectedScore, setSelectedScore] = useState<number | null>(null);

  // Defensive fallback for translations
  const langKey = translations[language] ? language : 'en';
  const t = translations[langKey]?.personality || translations.en.personality;

  const LIKERT_OPTIONS = [
    { label: t.agree, score: 3, size: "w-14 h-14", color: "bg-emerald-500", hover: "hover:ring-emerald-200" },
    { label: "", score: 2, size: "w-11 h-11", color: "bg-emerald-400", hover: "hover:ring-emerald-100" },
    { label: "", score: 1, size: "w-9 h-9", color: "bg-emerald-300", hover: "hover:ring-emerald-50" },
    { label: "", score: 0, size: "w-7 h-7", color: "bg-slate-200", hover: "hover:ring-slate-100" },
    { label: "", score: -1, size: "w-9 h-9", color: "bg-purple-300", hover: "hover:ring-purple-50" },
    { label: "", score: -2, size: "w-11 h-11", color: "bg-purple-400", hover: "hover:ring-purple-100" },
    { label: t.disagree, score: -3, size: "w-14 h-14", color: "bg-purple-500", hover: "hover:ring-purple-200" }
  ];

  const handleNext = () => {
    if (selectedScore === null) return;

    const metadata = TRAITS_METADATA[currentStep];
    const newScores = { 
      ...scores, 
      [metadata.trait]: scores[metadata.trait as keyof typeof scores] + (selectedScore * metadata.weight) 
    };
    
    setScores(newScores);
    setSelectedScore(null);

    if (currentStep < t.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const type = 
        (newScores.E >= 0 ? "E" : "I") +
        (newScores.N >= 0 ? "N" : "S") +
        (newScores.T >= 0 ? "T" : "F") +
        (newScores.J >= 0 ? "J" : "P");
      
      const typeData = t.types[type];
      onComplete(typeData.name, typeData.desc);
    }
  };

  const progress = ((currentStep) / t.questions.length) * 100;

  return (
    <div className="min-h-screen calm-gradient flex items-center justify-center p-4 md:p-6 text-slate-900">
      <div className="bg-white w-full max-w-3xl p-8 md:p-16 rounded-[48px] shadow-2xl shadow-blue-100 relative overflow-hidden animate-in fade-in zoom-in duration-500 border border-white/50">
        
        {onSkip && (
          <button 
            onClick={onSkip}
            className="absolute top-8 right-8 flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest transition-colors group"
          >
            {t.skip} <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          </button>
        )}

        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles className="w-3.5 h-3.5" /> {t.phase}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
            {t.title}
          </h2>
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="w-full max-w-md h-1.5 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              {t.statement} {currentStep + 1} of {t.questions.length}
            </span>
          </div>
        </div>

        <div className="mb-16 text-center px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-700 leading-snug min-h-[80px] flex items-center justify-center italic">
            "{t.questions[currentStep]}"
          </h3>
        </div>

        <div className="space-y-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto px-2 relative">
             <div className="absolute -top-8 left-0 text-[10px] font-black uppercase text-emerald-600 tracking-widest">{t.agree}</div>
             <div className="absolute -top-8 right-0 text-[10px] font-black uppercase text-purple-600 tracking-widest">{t.disagree}</div>

             {LIKERT_OPTIONS.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedScore(opt.score)}
                  className={`relative flex items-center justify-center rounded-full transition-all duration-300 ring-offset-4 ${opt.size} ${
                    selectedScore === opt.score 
                      ? `${opt.color} ring-4 ring-indigo-100 scale-110 shadow-lg` 
                      : `bg-slate-100 ${opt.hover} hover:ring-2 hover:bg-white`
                  }`}
                >
                  {selectedScore === opt.score && <Check className="w-5 h-5 text-white" />}
                  {opt.label && <span className="absolute -bottom-8 whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:block">{opt.label}</span>}
                </button>
             ))}
          </div>

          <div className="flex justify-center pt-8">
            <button
              onClick={handleNext}
              disabled={selectedScore === null}
              className={`flex items-center justify-center gap-3 px-12 py-5 rounded-[24px] font-black text-white shadow-xl transition-all active:scale-95 group uppercase tracking-widest ${
                selectedScore !== null 
                  ? 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700' 
                  : 'bg-slate-200 cursor-not-allowed text-slate-400'
              }`}
            >
              {currentStep < t.questions.length - 1 ? t.next : t.finish}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-50 flex items-center justify-center gap-8 md:gap-12 text-slate-300">
          <TraitIcon icon={Users} label={t.mind} active={currentStep < 6} />
          <TraitIcon icon={Zap} label={t.energy} active={currentStep >= 6 && currentStep < 12} />
          <TraitIcon icon={Brain} label={t.nature} active={currentStep >= 12 && currentStep < 18} />
          <TraitIcon icon={Shield} label={t.tactics} active={currentStep >= 18} />
        </div>
      </div>
    </div>
  );
};

const TraitIcon = ({ icon: Icon, label, active }: { icon: any, label: string, active: boolean }) => (
  <div className={`flex flex-col items-center gap-2 transition-colors ${active ? 'text-indigo-400' : 'text-slate-200'}`}>
    <Icon className={`w-5 h-5 ${active ? 'animate-pulse' : ''}`} />
    <span className="text-[9px] uppercase font-black tracking-[0.2em]">{label}</span>
  </div>
);

export default PersonalityTest;
