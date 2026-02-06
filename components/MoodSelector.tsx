
import React from 'react';
import { Mood, AppLanguage } from '../types';
import { getTranslations } from '../translations';

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onSelect: (mood: Mood) => void;
  language?: AppLanguage;
}

const moods = [
  { type: Mood.GREAT, emoji: '😊' },
  { type: Mood.GOOD, emoji: '🙂' },
  { type: Mood.OKAY, emoji: '😐' },
  { type: Mood.ANXIOUS, emoji: '😰' },
  { type: Mood.SAD, emoji: '😢' },
  { type: Mood.OVERWHELMED, emoji: '🤯' },
];

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelect, language = 'en' }) => {
  const t = getTranslations(language);
  return (
    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
      {moods.map((m) => (
        <button
          key={m.type}
          onClick={() => onSelect(m.type)}
          className={`flex flex-col items-center p-4 rounded-3xl transition-all border-2 w-24 theme-card ${
            selectedMood === m.type
              ? 'bg-[var(--primary-light)] border-[var(--primary)] scale-105 shadow-md'
              : 'border-transparent hover:bg-[var(--primary-light)]/20'
          }`}
        >
          <span className="text-3xl mb-1">{m.emoji}</span>
          <span className="text-xs font-bold uppercase tracking-tight theme-text-main">{t.moods?.[m.type] || m.type}</span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
