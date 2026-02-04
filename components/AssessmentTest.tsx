
import React, { useState } from 'react';
import { ClipboardCheck, ArrowRight, CheckCircle2, Search, Brain, Activity, ShieldAlert, Sparkles, AlertCircle, Zap, Heart } from 'lucide-react';
import { TestResult, AppLanguage } from '../types';

interface TestOption {
  label: string;
  value: number;
}

interface TestData {
  id: string;
  name: string;
  category: 'Mood' | 'Stress' | 'Behavior' | 'ADHD' | 'Intelligence';
  description: string;
  questions: string[];
  options: TestOption[];
  getInterpretation: (score: number) => string;
}

const DEFAULT_OPTIONS: TestOption[] = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 }
];

const WLEIS_OPTIONS: TestOption[] = [
  { label: 'Strongly Disagree', value: 1 },
  { label: 'Disagree', value: 2 },
  { label: 'Slightly Disagree', value: 3 },
  { label: 'Neutral', value: 4 },
  { label: 'Slightly Agree', value: 5 },
  { label: 'Agree', value: 6 },
  { label: 'Strongly Agree', value: 7 }
];

const TESTS_DATA: TestData[] = [
  {
    id: 'wleis',
    name: 'Emotional Intelligence (WLEIS)',
    category: 'Intelligence',
    description: 'Discover how beautifully you navigate emotions in yourself and those around you.',
    questions: [
      "I have a good sense of why I have certain feelings most of the time.",
      "I have a good understanding of my own emotions.",
      "I really understand what I feel.",
      "I always know whether I am happy or not.",
      "I always know my friends' emotions from their behavior.",
      "I am a good observer of others' emotions.",
      "I am sensitive to the feelings and emotions of others.",
      "I have a good understanding of the emotions of people around me.",
      "I always set goals for myself and then try my best to achieve them.",
      "I always tell myself I am a competent person.",
      "I am a self-motivated person.",
      "I would always encourage myself to try my best.",
      "I am able to control my temper and handle difficulties rationally.",
      "I am quite capable of controlling my own emotions.",
      "I can always calm down quickly when I am very angry.",
      "I have good control of my own emotions."
    ],
    options: WLEIS_OPTIONS,
    getInterpretation: (s) => s >= 96 ? 'Exceptional Emotional Wisdom' : s >= 80 ? 'High Emotional Awareness' : s >= 60 ? 'Steadily Developing' : 'Early Awareness Stage'
  },
  {
    id: 'phq9',
    name: 'Self-Compassion Check (PHQ-9)',
    category: 'Mood',
    description: 'A gentle check on your current emotional load to see how we can best support you.',
    questions: [
      "Little interest or pleasure in doing things?",
      "Feeling down, depressed, or hopeless?",
      "Trouble falling or staying asleep, or sleeping too much?",
      "Feeling tired or having little energy?",
      "Poor appetite or overeating?",
      "Feeling bad about yourself — or that you are a failure?",
      "Trouble concentrating on things, such as reading or watching TV?",
      "Moving or speaking so slowly that other people could have noticed?",
      "Thoughts that you would be better off dead, or of hurting yourself?"
    ],
    options: DEFAULT_OPTIONS,
    getInterpretation: (s) => s >= 20 ? 'High Need for Nurturing' : s >= 15 ? 'Significant Support Focus' : s >= 10 ? 'Self-Care Priority' : s >= 5 ? 'Light Support Focus' : 'Radiant Well-being'
  },
  {
    id: 'gad7',
    name: 'Peace & Focus (GAD-7)',
    category: 'Mood',
    description: 'Measuring your inner calm to find tools that help you stay grounded.',
    questions: [
      "Feeling nervous, anxious, or on edge?",
      "Not being able to stop or control worrying?",
      "Worrying too much about different things?",
      "Trouble relaxing?",
      "Being so restless that it's hard to sit still?",
      "Becoming easily annoyed or irritable?",
      "Feeling afraid, as if something awful might happen?"
    ],
    options: DEFAULT_OPTIONS,
    getInterpretation: (s) => s >= 15 ? 'Deep Awareness (Seeking Calm)' : s >= 10 ? 'Moderate Alertness' : s >= 5 ? 'Light Awareness' : 'Deeply Grounded'
  },
  {
    id: 'pss',
    name: 'Resilience Index (PSS-10)',
    category: 'Stress',
    description: 'A look at how you handle life\'s dynamic waves.',
    questions: [
      "How often have you been upset because of something that happened unexpectedly?",
      "How often have you felt that you were unable to control the important things in your life?",
      "How often have you felt nervous and 'stressed'?",
      "How often have you felt confident about your ability to handle your personal problems?",
      "How often have you felt that things were going your way?",
      "How often have you found that you could not cope with all the things that you had to do?",
      "How often have you been able to control irritations in your life?",
      "How often have you felt that you were on top of things?",
      "How often have you been angered because of things that were outside of your control?",
      "How often have you felt difficulties were piling up so high that you could not overcome them?"
    ],
    options: [
      { label: 'Never', value: 0 },
      { label: 'Almost Never', value: 1 },
      { label: 'Sometimes', value: 2 },
      { label: 'Fairly Often', value: 3 },
      { label: 'Very Often', value: 4 }
    ],
    getInterpretation: (s) => s >= 27 ? 'High Resilience Training Opportunity' : s >= 14 ? 'Steady Adaptation' : 'Excellent Resilience'
  },
  {
    id: 'isi',
    name: 'Rest Recovery (ISI)',
    category: 'Behavior',
    description: 'Checking in on your biological battery and sleep quality.',
    questions: [
      "Difficulty falling asleep",
      "Difficulty staying asleep",
      "Problem of waking up too early",
      "How satisfied are you with your current sleep pattern?",
      "How noticeable to others is your sleep problem?",
      "How worried/distressed are you about your current sleep problem?",
      "To what extent do you consider your sleep problem to interfere with your daily functioning?"
    ],
    options: [
      { label: 'None / Very Satisfied', value: 0 },
      { label: 'Mild / Satisfied', value: 1 },
      { label: 'Moderate / Neutral', value: 2 },
      { label: 'Severe / Dissatisfied', value: 3 },
      { label: 'Very Severe / Very Dissatisfied', value: 4 }
    ],
    getInterpretation: (s) => s >= 22 ? 'Priority Rest Recovery' : s >= 15 ? 'Moderate Recovery Needs' : s >= 8 ? 'Healthy Maintenance' : 'Optimal Rest'
  },
  {
    id: 'asrs',
    name: 'Focus Archetype (ASRS)',
    category: 'ADHD',
    description: 'Understanding how your mind processes and directs its energy.',
    questions: [
      "How often do you have trouble wrapping up the final details of a project?",
      "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
      "How often do you have problems remembering appointments or obligations?",
      "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
      "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
      "How often do you feel overly active and compelled to do things, as if you were driven by a motor?"
    ],
    options: [
      { label: 'Never', value: 0 },
      { label: 'Rarely', value: 1 },
      { label: 'Sometimes', value: 2 },
      { label: 'Often', value: 3 },
      { label: 'Very Often', value: 4 }
    ],
    getInterpretation: (s) => s >= 4 ? 'Vibrant & Dynamic Mind' : 'Structured Focus'
  }
];

interface AssessmentTestProps {
  onComplete: (result: TestResult) => void;
  initialTestId?: string;
  // Fix: Added language prop to interface to satisfy App.tsx requirements
  language: AppLanguage;
}

// Fix: Added language to component props
const AssessmentTest: React.FC<AssessmentTestProps> = ({ onComplete, initialTestId, language }) => {
  const [activeTest, setActiveTest] = useState<TestData | null>(
    initialTestId ? TESTS_DATA.find(t => t.id === initialTestId) || null : null
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Mood' | 'Stress' | 'Behavior' | 'ADHD' | 'Intelligence'>('All');

  const filteredTests = TESTS_DATA.filter(t => 
    (activeCategory === 'All' || t.category === activeCategory) &&
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAnswer = (val: number) => {
    const newAnswers = [...answers, val];
    if (currentStep < activeTest!.questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentStep(currentStep + 1);
    } else {
      const totalScore = newAnswers.reduce((a, b) => a + b, 0);
      const maxPossible = activeTest!.questions.length * Math.max(...activeTest!.options.map(o => o.value));
      
      const result: TestResult = {
        id: Date.now().toString(),
        testName: activeTest!.name,
        score: totalScore,
        maxScore: maxPossible,
        interpretation: activeTest!.getInterpretation(totalScore),
        date: new Date().toLocaleDateString()
      };
      onComplete(result);
      setIsFinished(true);
    }
  };

  const resetTest = () => {
    setActiveTest(null);
    setIsFinished(false);
    setCurrentStep(0);
    setAnswers([]);
  };

  if (isFinished) {
    return (
      <div className="bg-white p-10 rounded-[48px] text-center space-y-6 border border-slate-100 shadow-sm animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-50">
          <Sparkles className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">Insight Gained</h3>
          <p className="text-slate-500 max-w-sm mx-auto">This knowledge is a gift to your future self. We've integrated this into your personalized path.</p>
        </div>
        <div className="p-6 bg-slate-50 rounded-[32px] inline-block">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Your Journey Stage</span>
          <span className="text-2xl font-black text-emerald-600 uppercase">{activeTest?.getInterpretation(answers.reduce((a,b)=>a+b,0))}</span>
        </div>
        <div>
          <button 
            onClick={resetTest}
            className="px-8 py-4 bg-[var(--primary)] text-white rounded-3xl font-bold shadow-xl shadow-blue-100 hover:opacity-90 transition-all active:scale-95"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (activeTest) {
    const progress = ((currentStep + 1) / activeTest.questions.length) * 100;

    return (
      <div className="bg-white p-6 md:p-12 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden animate-in slide-in-from-right duration-500">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-50">
          <div 
            className="h-full bg-[var(--primary)] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mb-12 flex justify-between items-center">
          <div>
            <span className="text-xs font-black text-[var(--primary)] uppercase tracking-widest block mb-1">
              {activeTest.name}
            </span>
            <span className="text-slate-400 text-sm font-medium">Step {currentStep + 1} of {activeTest.questions.length}</span>
          </div>
          <button onClick={resetTest} className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-slate-50 px-4 py-2 rounded-xl transition-all">Pause</button>
        </div>

        <div className="mb-10 min-h-[100px] flex items-center">
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
            {activeTest.questions[currentStep]}
          </h3>
        </div>

        <div className={`grid grid-cols-1 ${activeTest.options.length > 4 ? 'md:grid-cols-2' : ''} gap-4`}>
          {activeTest.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option.value)}
              className="p-6 text-left bg-slate-50 hover:bg-white border-2 border-transparent hover:border-[var(--primary)] hover:shadow-xl hover:shadow-blue-50/50 rounded-3xl transition-all group flex justify-between items-center"
            >
              <span className="font-bold text-slate-700 text-lg group-hover:text-[var(--primary)] transition-colors">{option.label}</span>
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <ArrowRight className="w-5 h-5 text-[var(--primary)]" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div className="flex gap-2 p-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
          {(['All', 'Mood', 'Stress', 'Behavior', 'ADHD', 'Intelligence'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat ? 'bg-[var(--primary)] text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative group min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[var(--primary)] transition-colors" />
          <input
            type="text"
            placeholder="Search self-discovery tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium outline-none shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map(test => (
          <div 
            key={test.id} 
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                  test.category === 'Mood' ? 'bg-blue-50 text-blue-500 shadow-blue-50' : 
                  test.category === 'Stress' ? 'bg-orange-50 text-orange-500 shadow-orange-50' :
                  test.category === 'Behavior' ? 'bg-purple-50 text-purple-500 shadow-purple-50' :
                  test.category === 'Intelligence' ? 'bg-red-50 text-red-500 shadow-red-50' :
                  'bg-emerald-50 text-emerald-500 shadow-emerald-50'
                }`}>
                  {test.category === 'Mood' && <Brain className="w-7 h-7" />}
                  {test.category === 'Stress' && <Activity className="w-7 h-7" />}
                  {test.category === 'Behavior' && <ShieldAlert className="w-7 h-7" />}
                  {test.category === 'ADHD' && <Sparkles className="w-7 h-7" />}
                  {test.category === 'Intelligence' && <Zap className="w-7 h-7" />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{test.category}</span>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-[var(--primary)] transition-colors">{test.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-8 opacity-80">{test.description}</p>
            </div>
            <button 
              onClick={() => setActiveTest(test)}
              className="w-full py-4 bg-slate-50 hover:bg-[var(--primary)] hover:text-white text-slate-700 rounded-3xl font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 group/btn"
            >
              Start Discovery
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentTest;
