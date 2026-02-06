
import React, { useState, useMemo } from 'react';
import { UserData, UserProfile, AppLanguage, LifestyleData } from '../types';
// Added Microscope to imports to fix "Cannot find name 'Microscope'" error
import { TrendingUp, Calendar, Target, Award, Sparkles, User, Moon, Utensils, Heart, Plus, Edit2, Check, X, ShieldCheck, Activity, Users, Monitor, Sun, Zap, LayoutGrid, Info, AlertTriangle, Microscope } from 'lucide-react';
import { getTranslations } from '../translations';

interface InsightsDashboardProps {
  data: UserData;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  language: AppLanguage;
}

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ data, onUpdateProfile, language }) => {
  const [isEditingLifestyle, setIsEditingLifestyle] = useState(false);
  const [formData, setFormData] = useState<LifestyleData>(data.profile?.lifestyleFactors || {
    sleepHours: 7,
    sleepAwakenings: false,
    exerciseDays: 3,
    exerciseTypes: ['Walking'],
    dietUPF: 'Sometimes',
    dietMediterranean: false,
    socialLivesAlone: false,
    socialLoneliness: 'Low',
    screenBeforeBed: true,
    sunlightExposure: 20,
    purposeLevel: 7,
    routinePredictability: 7
  });

  const t = getTranslations(language);
  const lastMood = data.moodHistory[data.moodHistory.length - 1];
  const lastMoodLabel = lastMood ? (t.moods?.[lastMood.mood] || lastMood.mood) : t.insightsPage.establishingBaseline;

  const handleSave = () => {
    onUpdateProfile({ lifestyleFactors: formData });
    setIsEditingLifestyle(false);
  };

  const riskAnalysis = useMemo(() => {
    const risks: { factor: 'sleep' | 'exercise' | 'social' | 'diet'; label: string; severity: 'critical' | 'warning' | 'optimal'; citation: string }[] = [];
    const f = formData;

    // Sleep Analysis (Vedaa et al. 2024, Shah et al. 2025)
    if (f.sleepHours < 5) {
      risks.push({ factor: 'sleep', label: 'sleepHighMortality', severity: 'critical', citation: 'Shah et al. 2025' });
    } else if (f.sleepHours < 8) {
      risks.push({ factor: 'sleep', label: 'sleepElevatedMental', severity: 'warning', citation: 'Vedaa et al. 2024' });
    } else {
      risks.push({ factor: 'sleep', label: 'sleepOptimalRecovery', severity: 'optimal', citation: 'Vedaa et al. 2024' });
    }

    // Exercise Analysis (Noetel et al. 2024)
    if (f.exerciseDays < 2) {
      risks.push({ factor: 'exercise', label: 'exerciseLowActivity', severity: 'warning', citation: 'Noetel et al. 2024' });
    } else if (f.exerciseTypes.includes('Yoga') || f.exerciseTypes.includes('Strength') || f.exerciseTypes.includes('Walking')) {
      risks.push({ factor: 'exercise', label: 'exerciseHighImpact', severity: 'optimal', citation: 'Noetel et al. 2024' });
    }

    // Social Analysis (Wang et al. 2023)
    if (f.socialLivesAlone && f.socialLoneliness === 'High') {
      risks.push({ factor: 'social', label: 'socialMortality', severity: 'critical', citation: 'Wang et al. 2023' });
    }

    // Diet Analysis (Lane et al. 2022)
    if (f.dietUPF === 'Daily') {
      risks.push({ factor: 'diet', label: 'dietHighAnxiety', severity: 'critical', citation: 'Lane et al. 2022' });
    }

    return risks;
  }, [formData]);

  const exerciseOptions: LifestyleData['exerciseTypes'][number][] = ['Walking', 'Yoga', 'Strength', 'Aerobic', 'Other'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
             <ShieldCheck className="w-32 h-32" />
          </div>
          <div className="flex items-center gap-3 mb-6 text-purple-500">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">{t.insightsPage.clinicalRiskStatus}</span>
          </div>
          <div className="space-y-4">
             {riskAnalysis.slice(0, 3).map((risk, idx) => {
               const factorLabel = t.insightsPage.riskFactors?.[risk.factor] || risk.factor;
               const riskLabel = t.insightsPage.riskLabels?.[risk.label] || risk.label;
               return (
               <div key={idx} className={`flex items-center justify-between p-3 rounded-2xl border ${
                 risk.severity === 'critical' ? 'bg-red-50 border-red-100 text-red-700' : 
                 risk.severity === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-700' : 
                 'bg-emerald-50 border-emerald-100 text-emerald-700'
               }`}>
                  <div className="flex items-center gap-2">
                    {risk.severity === 'critical' ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    <span className="text-xs font-black uppercase">{factorLabel}: {riskLabel}</span>
                  </div>
                  <span className="text-[8px] font-bold opacity-60">{risk.citation}</span>
               </div>
             )})}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-blue-500">
              <TrendingUp className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t.insightsPage.recentMood}</span>
            </div>
            <div className="text-xl font-bold text-slate-800">{lastMoodLabel}</div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-green-500">
              <Calendar className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t.insightsPage.blueprintStatus}</span>
            </div>
            <div className="text-xl font-bold text-slate-800">{data.profile?.lifestyleFactors ? t.insightsPage.calibrated : t.insightsPage.pending}</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-slate-800">{t.insightsPage.groundedBlueprintTitle}</h3>
                <p className="text-xs theme-text-muted font-medium">{t.insightsPage.groundedBlueprintSubtitle}</p>
             </div>
          </div>
          {!isEditingLifestyle && (
            <button 
              onClick={() => setIsEditingLifestyle(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
            >
              <Edit2 className="w-4 h-4" /> {t.insightsPage.updateHabitLog}
            </button>
          )}
        </div>

        {isEditingLifestyle ? (
          <div className="space-y-10 animate-in slide-in-from-top duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Sleep Section */}
                <div className="space-y-6">
                   <h4 className="flex items-center gap-2 text-sm font-black uppercase text-indigo-500"><Moon className="w-4 h-4" /> {t.insightsPage.sections.sleep}</h4>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <label className="text-sm font-bold text-slate-600">{t.insightsPage.labels.hoursPerNight}</label>
                         <input 
                            type="number" min="1" max="15" 
                            value={formData.sleepHours} 
                            onChange={e => setFormData({...formData, sleepHours: parseInt(e.target.value)})}
                            className="w-16 p-2 bg-slate-50 rounded-lg text-center font-bold"
                         />
                      </div>
                      <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer">
                         <input 
                            type="checkbox" 
                            checked={formData.sleepAwakenings} 
                            onChange={e => setFormData({...formData, sleepAwakenings: e.target.checked})}
                            className="w-5 h-5 accent-indigo-500"
                         />
                         <span className="text-xs font-bold text-slate-700">{t.insightsPage.labels.nightAwakenings}</span>
                      </label>
                   </div>
                </div>

                {/* Exercise Section */}
                <div className="space-y-6">
                   <h4 className="flex items-center gap-2 text-sm font-black uppercase text-emerald-500"><Activity className="w-4 h-4" /> {t.insightsPage.sections.exercise}</h4>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <label className="text-sm font-bold text-slate-600">{t.insightsPage.labels.activeDaysPerWeek}</label>
                         <input 
                            type="number" min="0" max="7" 
                            value={formData.exerciseDays} 
                            onChange={e => setFormData({...formData, exerciseDays: parseInt(e.target.value)})}
                            className="w-16 p-2 bg-slate-50 rounded-lg text-center font-bold"
                         />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {exerciseOptions.map(opt => (
                          <button
                            key={opt}
                            onClick={() => {
                              const types = formData.exerciseTypes.includes(opt) 
                                ? formData.exerciseTypes.filter(t => t !== opt)
                                : [...formData.exerciseTypes, opt];
                              setFormData({...formData, exerciseTypes: types});
                            }}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                              formData.exerciseTypes.includes(opt) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-slate-400'
                            }`}
                          >
                            {t.insightsPage.exerciseOptions?.[opt] || opt}
                          </button>
                        ))}
                      </div>
                   </div>
                </div>

                {/* Diet Section */}
                <div className="space-y-6">
                   <h4 className="flex items-center gap-2 text-sm font-black uppercase text-amber-500"><Utensils className="w-4 h-4" /> {t.insightsPage.sections.diet}</h4>
                   <div className="space-y-4">
                      <div className="space-y-2">
                         <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.insightsPage.labels.processedFoodIntake}</label>
                         <select 
                            value={formData.dietUPF} 
                            onChange={e => setFormData({...formData, dietUPF: e.target.value as any})}
                            className="w-full p-3 bg-slate-50 rounded-xl font-bold appearance-none"
                         >
                            <option value="Daily">{t.insightsPage.dietOptions?.Daily || 'Daily (High Risk)'}</option>
                            <option value="Often">{t.insightsPage.dietOptions?.Often || 'Often'}</option>
                            <option value="Sometimes">{t.insightsPage.dietOptions?.Sometimes || 'Sometimes'}</option>
                            <option value="Never">{t.insightsPage.dietOptions?.Never || 'Never (Optimal)'}</option>
                         </select>
                      </div>
                      <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer">
                         <input 
                            type="checkbox" 
                            checked={formData.dietMediterranean} 
                            onChange={e => setFormData({...formData, dietMediterranean: e.target.checked})}
                            className="w-5 h-5 accent-amber-500"
                         />
                         <span className="text-xs font-bold text-slate-700">{t.insightsPage.labels.followMediterranean}</span>
                      </label>
                </div>
                </div>

                {/* Social Section */}
                <div className="space-y-6">
                   <h4 className="flex items-center gap-2 text-sm font-black uppercase text-blue-500"><Users className="w-4 h-4" /> {t.insightsPage.sections.social}</h4>
                   <div className="space-y-4">
                      <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer">
                         <input 
                            type="checkbox" 
                            checked={formData.socialLivesAlone} 
                            onChange={e => setFormData({...formData, socialLivesAlone: e.target.checked})}
                            className="w-5 h-5 accent-blue-500"
                         />
                         <span className="text-xs font-bold text-slate-700">{t.insightsPage.labels.liveAlone}</span>
                      </label>
                      <div className="space-y-2">
                         <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.insightsPage.labels.selfReportedLoneliness}</label>
                         <select 
                            value={formData.socialLoneliness} 
                            onChange={e => setFormData({...formData, socialLoneliness: e.target.value as any})}
                            className="w-full p-3 bg-slate-50 rounded-xl font-bold"
                         >
                            <option value="High">{t.insightsPage.lonelinessOptions?.High || 'High (Significant Risk)'}</option>
                            <option value="Moderate">{t.insightsPage.lonelinessOptions?.Moderate || 'Moderate'}</option>
                            <option value="Low">{t.insightsPage.lonelinessOptions?.Low || 'Low'}</option>
                            <option value="None">{t.insightsPage.lonelinessOptions?.None || 'None'}</option>
                         </select>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                <button onClick={() => setIsEditingLifestyle(false)} className="px-6 py-3 text-slate-400 font-bold">{t.insightsPage.discardChanges}</button>
                <button 
                  onClick={handleSave}
                  className="px-10 py-3 bg-[var(--primary)] text-white rounded-2xl font-black shadow-lg shadow-blue-100 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> {t.insightsPage.finalizeBlueprint}
                </button>
             </div>
          </div>
        ) : !data.profile?.lifestyleFactors ? (
          <div className="py-20 text-center bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-100">
             <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm mb-6">
                <Microscope className="w-10 h-10 text-[var(--primary)]" />
             </div>
             <h4 className="text-2xl font-black text-slate-800 mb-2">{t.insightsPage.blueprintRequiredTitle}</h4>
             <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">{t.insightsPage.blueprintRequiredDesc}</p>
             <button onClick={() => setIsEditingLifestyle(true)} className="px-12 py-4 bg-white text-[var(--primary)] border-2 border-[var(--primary-light)] rounded-3xl font-black uppercase tracking-widest">
                {t.insightsPage.startIntakeForm}
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {riskAnalysis.map((risk, idx) => {
               const factorLabel = t.insightsPage.riskFactors?.[risk.factor] || risk.factor;
               const riskLabel = t.insightsPage.riskLabels?.[risk.label] || risk.label;
               return (
               <div key={idx} className={`p-6 rounded-[32px] border relative overflow-hidden transition-all hover:scale-[1.02] ${
                 risk.severity === 'critical' ? 'bg-red-50/50 border-red-100' : 
                 risk.severity === 'warning' ? 'bg-amber-50/50 border-amber-100' : 
                 'bg-emerald-50/50 border-emerald-100'
               }`}>
                  <div className="flex items-center gap-3 mb-4">
                     {risk.severity === 'critical' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                     {risk.severity === 'warning' && <Zap className="w-5 h-5 text-amber-500" />}
                     {risk.severity === 'optimal' && <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                     <h5 className="font-black text-xs uppercase tracking-widest text-slate-400">{factorLabel}</h5>
                  </div>
                  <div className="text-lg font-black text-slate-800 leading-tight mb-2">{riskLabel}</div>
                  <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                     <Info className="w-3 h-3" /> {risk.citation}
                  </div>
               </div>
             )})}
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" /> {t.insightsPage.longitudinalTitle}
        </h3>
        <div className="space-y-4">
          {data.testResults.length === 0 ? (
            <p className="text-sm text-slate-500 italic">{t.insightsPage.noAssessments}</p>
          ) : (
            data.testResults.slice().reverse().map(result => (
              <div key={result.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100/50">
                <div>
                  <div className="font-bold text-slate-700">{result.testName}</div>
                  <div className="text-xs text-slate-400">{result.date}</div>
                </div>
                <div className="px-4 py-1 bg-white rounded-full text-[10px] font-black uppercase text-[var(--primary)] border border-blue-50">
                  {result.interpretation}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsDashboard;
