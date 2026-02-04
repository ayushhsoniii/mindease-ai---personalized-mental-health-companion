
import React from 'react';
import { Check } from 'lucide-react';
import { AppTheme } from '../types';

interface ThemeSelectorProps {
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}

const THEMES: { id: AppTheme; label: string; colors: string[] }[] = [
  { id: 'blue', label: 'Calm Sky', colors: ['bg-blue-500', 'bg-blue-100'] },
  { id: 'green', label: 'Forest', colors: ['bg-emerald-600', 'bg-emerald-100'] },
  { id: 'red', label: 'Passion', colors: ['bg-rose-500', 'bg-rose-100'] },
  { id: 'purple', label: 'Lavender', colors: ['bg-violet-500', 'bg-violet-100'] },
  { id: 'orange', label: 'Sunset', colors: ['bg-amber-500', 'bg-amber-100'] },
  { id: 'teal', label: 'Ocean', colors: ['bg-teal-600', 'bg-teal-100'] },
  { id: 'pink', label: 'Sakura', colors: ['bg-pink-500', 'bg-pink-100'] },
  { id: 'brown', label: 'Earth', colors: ['bg-amber-900', 'bg-orange-50'] },
  { id: 'dark-blue', label: 'Neon Cyan', colors: ['bg-black', 'bg-cyan-400'] },
  { id: 'dark-green', label: 'Neon Emerald', colors: ['bg-black', 'bg-lime-400'] },
  { id: 'dark-purple', label: 'Neon Violet', colors: ['bg-black', 'bg-fuchsia-500'] },
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="flex items-center gap-3 p-1.5">
      <div className="flex gap-2 pr-2 overflow-x-auto no-scrollbar">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => onThemeChange(t.id)}
            title={t.label}
            className={`w-9 h-9 rounded-full border-2 transition-all flex-shrink-0 flex items-center justify-center relative group ${
              currentTheme === t.id ? 'border-[var(--primary)] scale-110 shadow-lg' : 'border-transparent hover:scale-105'
            }`}
          >
            <div className={`w-full h-full rounded-full overflow-hidden flex transform rotate-45`}>
                <div className={`w-1/2 h-full ${t.colors[0]}`} />
                <div className={`w-1/2 h-full ${t.colors[1]}`} />
            </div>
            {currentTheme === t.id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className={`w-3 h-3 drop-shadow-md ${t.id.startsWith('dark') ? 'text-white' : 'text-slate-800'}`} />
              </div>
            )}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap theme-text-muted">
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
