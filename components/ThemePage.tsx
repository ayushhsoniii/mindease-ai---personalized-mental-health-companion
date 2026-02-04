
import React from 'react';
import { Palette, Check, Sparkles, Moon, Sun, Wind, Trees, Flame, Waves, Heart, Mountain, Zap } from 'lucide-react';
import { AppTheme } from '../types';

interface ThemePageProps {
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}

interface ThemeDefinition {
  id: AppTheme;
  name: string;
  description: string;
  icon: any;
  gradient: string;
  colors: string[];
}

const THEMES: ThemeDefinition[] = [
  { 
    id: 'blue', 
    name: 'Calm Sky', 
    description: 'A serene and balanced atmosphere to quiet the mind.', 
    icon: Wind, 
    gradient: 'from-blue-400 to-blue-600',
    colors: ['bg-blue-500', 'bg-blue-100'] 
  },
  { 
    id: 'green', 
    name: 'Forest Canopy', 
    description: 'Grounding and refreshing. Perfect for growth and healing.', 
    icon: Trees, 
    gradient: 'from-emerald-500 to-teal-700',
    colors: ['bg-emerald-600', 'bg-emerald-100'] 
  },
  { 
    id: 'purple', 
    name: 'Lavender Mist', 
    description: 'Soothing purple tones to ease tension and promote sleep.', 
    icon: Sparkles, 
    gradient: 'from-violet-500 to-purple-700',
    colors: ['bg-violet-500', 'bg-violet-100'] 
  },
  { 
    id: 'teal', 
    name: 'Ocean Depths', 
    description: 'Refreshing and revitalizing. Find your flow.', 
    icon: Waves, 
    gradient: 'from-teal-400 to-cyan-600',
    colors: ['bg-teal-600', 'bg-teal-100'] 
  },
  { 
    id: 'orange', 
    name: 'Golden Sunset', 
    description: 'Warm, optimistic energy for low-mood days.', 
    icon: Sun, 
    gradient: 'from-amber-400 to-orange-600',
    colors: ['bg-amber-500', 'bg-amber-100'] 
  },
  { 
    id: 'pink', 
    name: 'Sakura Garden', 
    description: 'Soft and gentle. A theme for self-compassion.', 
    icon: Heart, 
    gradient: 'from-pink-400 to-rose-600',
    colors: ['bg-pink-500', 'bg-pink-100'] 
  },
  { 
    id: 'red', 
    name: 'Vibrant Passion', 
    description: 'Bold colors to ignite motivation and energy.', 
    icon: Flame, 
    gradient: 'from-rose-500 to-red-700',
    colors: ['bg-rose-500', 'bg-rose-100'] 
  },
  { 
    id: 'brown', 
    name: 'Earthen Ground', 
    description: 'Solid and stable. For when you need to feel rooted.', 
    icon: Mountain, 
    gradient: 'from-amber-800 to-stone-900',
    colors: ['bg-amber-900', 'bg-orange-50'] 
  }
];

const NEON_THEMES: ThemeDefinition[] = [
  { 
    id: 'dark-blue', 
    name: 'Neon Cyan', 
    description: 'Midnight focus with striking electric blue highlights.', 
    icon: Moon, 
    gradient: 'from-black to-slate-900',
    colors: ['bg-black', 'bg-cyan-400'] 
  },
  { 
    id: 'dark-green', 
    name: 'Neon Emerald', 
    description: 'Total blackness paired with vibrant toxic green energy.', 
    icon: Zap, 
    gradient: 'from-black to-slate-900',
    colors: ['bg-black', 'bg-lime-400'] 
  },
  { 
    id: 'dark-purple', 
    name: 'Neon Violet', 
    description: 'A cybernetic midnight with deep ultraviolet glow.', 
    icon: Sparkles, 
    gradient: 'from-black to-slate-900',
    colors: ['bg-black', 'bg-fuchsia-500'] 
  }
];

const ThemePage: React.FC<ThemePageProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 text-[var(--primary)] border border-[var(--border)]">
          <Palette className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight theme-text-main">Digital Sanctuaries</h1>
        <p className="text-lg theme-text-muted max-w-2xl mx-auto font-medium">
          Choose an atmosphere that resonates with your mind. From calming skies to cybernetic midnights.
        </p>
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
           <Moon className="w-5 h-5 theme-text-main" />
           <h2 className="text-xl font-black uppercase tracking-widest theme-text-main">Neon Midnight Series</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {NEON_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={`relative p-8 rounded-[40px] text-left transition-all group overflow-hidden border-2 flex flex-col justify-between h-72 ${
                currentTheme === theme.id 
                  ? 'border-[var(--primary)] bg-black shadow-[0_0_30px_rgba(0,243,255,0.1)] scale-[1.02]' 
                  : 'border-transparent bg-black hover:border-white/10 hover:-translate-y-1'
              }`}
            >
              <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br ${theme.gradient} opacity-5 group-hover:opacity-20 transition-opacity`} />
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-lg ${
                  currentTheme === theme.id ? 'bg-[var(--primary)] text-black' : 'bg-zinc-900 text-zinc-500'
                }`}>
                  <theme.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{theme.name}</h3>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                  {theme.description}
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-between mt-auto">
                <div className="flex gap-2">
                  <div className={`w-6 h-6 rounded-full bg-black border-2 border-zinc-800 shadow-sm`} />
                  <div className={`w-6 h-6 rounded-full ${theme.colors[1]} border-2 border-white shadow-sm`} />
                </div>
                {currentTheme === theme.id ? (
                  <div className="flex items-center gap-2 text-[var(--primary)] font-black text-[10px] uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                    <Check className="w-3 h-3" /> Active
                  </div>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">Engage Neon</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
           <Sun className="w-5 h-5 theme-text-main" />
           <h2 className="text-xl font-black uppercase tracking-widest theme-text-main">Vibrant Nature Series</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={`relative p-8 rounded-[40px] text-left transition-all group overflow-hidden border-2 flex flex-col justify-between h-72 ${
                currentTheme === theme.id 
                  ? 'border-[var(--primary)] bg-white shadow-2xl scale-[1.02]' 
                  : 'border-transparent bg-white shadow-sm hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br ${theme.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-lg ${
                  currentTheme === theme.id ? 'bg-[var(--primary)] text-white' : 'bg-slate-50 text-slate-400'
                }`}>
                  <theme.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2 theme-text-main">{theme.name}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed opacity-80 theme-text-muted">
                  {theme.description}
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-between mt-auto">
                <div className="flex gap-2">
                  <div className={`w-6 h-6 rounded-full ${theme.colors[0]} border-2 border-white shadow-sm`} />
                  <div className={`w-6 h-6 rounded-full ${theme.colors[1]} border-2 border-white shadow-sm`} />
                </div>
                {currentTheme === theme.id ? (
                  <div className="flex items-center gap-2 text-[var(--primary)] font-black text-[10px] uppercase tracking-widest bg-[var(--primary-light)] px-3 py-1 rounded-full">
                    <Check className="w-3 h-3" /> Active
                  </div>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">Select Sanctuary</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="p-10 theme-card rounded-[48px] text-center backdrop-blur-sm">
        <p className="text-xs font-black uppercase tracking-[0.2em] theme-text-muted">
          Your choice of atmosphere syncs across all devices • Deep personalization for your wellbeing
        </p>
      </div>
    </div>
  );
};

export default ThemePage;
