
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { HeartHandshake, ArrowRight, User, Globe, Calendar, ChevronDown, UserCircle2, Camera, Check, Upload } from 'lucide-react';
import { UserProfile, AppLanguage } from '../types';
import { getTranslations } from '../translations';

interface AuthPageProps {
  onLogin: (profile: Partial<UserProfile>) => void;
  onCompleteOnboarding: (fullProfile: UserProfile) => void;
  initialStep: 'login' | 'onboarding';
  language: AppLanguage;
}

const COUNTRIES_WITH_FLAGS = [
  { name: "Afghanistan", flag: "🇦🇫" }, { name: "Albania", flag: "🇦🇱" }, { name: "Algeria", flag: "🇩🇿" },
  { name: "Andorra", flag: "🇦🇩" }, { name: "Angola", flag: "🇦🇴" }, { name: "Argentina", flag: "🇦🇷" },
  { name: "Australia", flag: "🇦🇺" }, { name: "Austria", flag: "🇦🇹" }, { name: "Bangladesh", flag: "🇧🇩" },
  { name: "Belgium", flag: "🇧🇪" }, { name: "Brazil", flag: "🇧🇷" }, { name: "Canada", flag: "🇨🇦" },
  { name: "China", flag: "🇨🇳" }, { name: "Colombia", flag: "🇨🇴" }, { name: "Denmark", flag: "🇩🇰" },
  { name: "Egypt", flag: "🇪🇬" }, { name: "Finland", flag: "🇫🇮" }, { name: "France", flag: "🇫🇷" },
  { name: "Germany", flag: "🇩🇪" }, { name: "Greece", flag: "🇬🇷" }, { name: "India", flag: "🇮🇳" },
  { name: "Indonesia", flag: "🇮🇩" }, { name: "Ireland", flag: "🇮🇪" }, { name: "Israel", flag: "🇮🇱" },
  { name: "Italy", flag: "🇮🇹" }, { name: "Japan", flag: "🇯🇵" }, { name: "Kenya", flag: "🇰🇪" },
  { name: "Korea, South", flag: "🇰🇷" }, { name: "Malaysia", flag: "🇲🇾" }, { name: "Mexico", flag: "🇲🇽" },
  { name: "Netherlands", flag: "🇳🇱" }, { name: "New Zealand", flag: "🇳🇿" }, { name: "Nigeria", flag: "🇳🇬" },
  { name: "Norway", flag: "🇳🇴" }, { name: "Pakistan", flag: "🇵🇰" }, { name: "Philippines", flag: "🇵🇭" },
  { name: "Poland", flag: "🇵🇱" }, { name: "Portugal", flag: "🇵🇹" }, { name: "Russia", flag: "🇷🇺" },
  { name: "Saudi Arabia", flag: "🇸🇦" }, { name: "Singapore", flag: "🇸🇬" }, { name: "South Africa", flag: "🇿🇦" },
  { name: "Spain", flag: "🇪🇸" }, { name: "Sweden", flag: "🇸🇪" }, { name: "Switzerland", flag: "🇨🇭" },
  { name: "Thailand", flag: "🇹🇭" }, { name: "Turkey", flag: "🇹🇷" }, { name: "Ukraine", flag: "🇺🇦" },
  { name: "United Arab Emirates", flag: "🇦🇪" }, { name: "United Kingdom", flag: "🇬🇧" },
  { name: "United States", flag: "🇺🇸" }, { name: "Vietnam", flag: "🇻🇳" }
];

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onCompleteOnboarding, initialStep, language }) => {
  const t = getTranslations(language);
  const [nameInput, setNameInput] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const [formData, setFormData] = useState({
    dob: '',
    gender: '',
    nationality: 'United States'
  });

  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [isCustomUpload, setIsCustomUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate 12 unique avatars based on the selected country
  const presetAvatars = useMemo(() => {
    const countrySeed = formData.nationality.replace(/\s/g, '');
    return Array.from({ length: 12 }, (_, i) => 
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${countrySeed}-${i}&backgroundColor=f8fafc,eff6ff`
    );
  }, [formData.nationality]);

  useEffect(() => {
    if (!selectedPhoto && presetAvatars.length > 0) {
      setSelectedPhoto(presetAvatars[0]);
    }
  }, [presetAvatars, selectedPhoto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const safeName = nameInput.trim();
    if (!safeName) return;

    if (formData.dob && formData.gender && formData.nationality) {
      setSaveStatus('saving');
      const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(safeName)}&backgroundColor=eff6ff`;
      const email = `${safeName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
      const fullProfile: UserProfile = {
        name: safeName,
        email,
        dob: formData.dob,
        gender: formData.gender,
        nationality: formData.nationality,
        photoUrl: selectedPhoto || defaultAvatar
      };
      onCompleteOnboarding(fullProfile);
      setTimeout(() => setSaveStatus('saved'), 800);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhoto(reader.result as string);
        setIsCustomUpload(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (url: string) => {
    setSelectedPhoto(url);
    setIsCustomUpload(false);
  };

  const isFormComplete = Boolean(
    nameInput.trim() && formData.dob && formData.gender && formData.nationality
  );
  const firstName = nameInput.trim().split(' ')[0];
  const isSaving = saveStatus === 'saving';
  const subtitle = t.auth.subtitle.replace('{name}', firstName ? `, ${firstName}` : '');

  return (
    <div className="min-h-screen calm-gradient flex items-center justify-center p-6 text-slate-900 transition-theme">
      <div className="bg-white w-full max-w-lg p-10 rounded-[48px] shadow-2xl shadow-blue-100 animate-in fade-in zoom-in duration-500 border border-white/40">
        <div className="space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[var(--primary)] rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200 transition-theme">
                <HeartHandshake className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{t.auth.title}</h2>
            <p className="text-slate-500 mt-2">
              {subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2 text-left">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.auth.nameLabel}</label>
              <div className="relative">
                <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder={t.auth.namePlaceholder}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[var(--primary-light)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-light)]/50 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block text-center">{t.auth.avatarLabel}</label>

              <div className="flex flex-col items-center gap-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-slate-50 relative ring-4 ring-[var(--primary-light)] transition-all hover:ring-8">
                    <img src={selectedPhoto} alt="Selected profile" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <Camera className="w-8 h-8" />
                    </button>
                  </div>
                  {isCustomUpload && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-2 rounded-full shadow-lg border-2 border-white">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="space-y-4 w-full">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    {t.auth.presetsFor.replace('{country}', formData.nationality)}
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 py-2 px-1">
                    {presetAvatars.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handlePresetSelect(url)}
                        className={`aspect-square rounded-2xl border-2 transition-all hover:scale-110 active:scale-95 overflow-hidden relative ${
                          selectedPhoto === url ? 'border-[var(--primary)] shadow-md ring-2 ring-[var(--primary-light)]' : 'border-transparent bg-slate-50 hover:bg-white'
                        }`}
                      >
                        <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                        {selectedPhoto === url && (
                           <div className="absolute inset-0 bg-[var(--primary)]/10 flex items-center justify-center">
                              <Check className="w-4 h-4 text-[var(--primary)]" />
                           </div>
                        )}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`aspect-square rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors ${
                        isCustomUpload ? 'border-green-500 bg-green-50 text-green-600' : ''
                      }`}
                      title={t.auth.uploadTitle}
                    >
                      <Upload className="w-5 h-5" />
                      <span className="text-[8px] font-bold mt-1 uppercase">{t.auth.uploadShort}</span>
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.auth.nationalityLabel}</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                  <select
                    required
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full pl-12 pr-10 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[var(--primary-light)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-light)]/50 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                  >
                    {COUNTRIES_WITH_FLAGS.map(c => (
                      <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.auth.dobLabel}</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder={t.auth.dobPlaceholder}
                    pattern="\d{2}/\d{2}/\d{2}"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[var(--primary-light)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-light)]/50 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.auth.genderLabel}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full pl-12 pr-10 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[var(--primary-light)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-light)]/50 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="text-slate-300">{t.auth.genderPlaceholder}</option>
                    <option value="male">{t.auth.genderOptions.male}</option>
                    <option value="female">{t.auth.genderOptions.female}</option>
                    <option value="non-binary">{t.auth.genderOptions.nonBinary}</option>
                    <option value="prefer-not-to-say">{t.auth.genderOptions.preferNot}</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormComplete || isSaving}
              className={`w-full flex items-center justify-center gap-3 py-5 rounded-[24px] font-black shadow-xl transition-all active:scale-95 group mt-4 uppercase tracking-wider ${
                isFormComplete && !isSaving
                  ? 'bg-[var(--primary)] text-white shadow-blue-100 hover:opacity-90 hover:shadow-2xl'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-slate-100'
              }`}
            >
              {isSaving ? t.auth.saving : t.auth.submit}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            {saveStatus === 'saving' && (
              <div className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                {t.auth.savingNote}
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className="flex items-center justify-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-widest">
                <Check className="w-4 h-4" />
                {t.auth.saved}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
