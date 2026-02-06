
import React from 'react';
import { Resource, AppLanguage } from '../types';
import { BookOpen, Activity, Heart, LifeBuoy, ExternalLink } from 'lucide-react';
import { getTranslations } from '../translations';

interface ResourceLibraryProps {
  resources: Resource[];
  language?: AppLanguage;
}

const getIcon = (category: string) => {
  switch (category) {
    case 'Coping': return <Heart className="w-5 h-5 text-pink-500" />;
    case 'Exercise': return <Activity className="w-5 h-5 text-green-500" />;
    case 'Education': return <BookOpen className="w-5 h-5 text-blue-500" />;
    case 'Emergency': return <LifeBuoy className="w-5 h-5 text-red-500" />;
    default: return <BookOpen className="w-5 h-5 text-slate-500" />;
  }
};

const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ resources, language = 'en' }) => {
  const t = getTranslations(language);
  return (
    <div className="grid grid-cols-1 gap-4">
      {resources.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-sm text-slate-500">
            {t.resources.empty}
          </p>
        </div>
      ) : (
        resources.map((res) => (
          <div key={res.id} className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-white transition-colors">
                {getIcon(res.category)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-800 mb-1">{res.title}</h4>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                    res.category === 'Emergency' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {t.resources.categories?.[res.category] || res.category}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  {res.description}
                </p>
                <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider">
                  {t.resources.learnMore} <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ResourceLibrary;
