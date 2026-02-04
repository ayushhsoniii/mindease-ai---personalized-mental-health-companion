
export enum Mood {
  GREAT = 'Great',
  GOOD = 'Good',
  OKAY = 'Okay',
  ANXIOUS = 'Anxious',
  SAD = 'Sad',
  OVERWHELMED = 'Overwhelmed'
}

export type ResponseStyle = 'compassionate' | 'direct' | 'scientific' | 'reflective';

export type AppTheme = 'blue' | 'green' | 'red' | 'dark' | 'purple' | 'orange' | 'teal' | 'pink' | 'brown' | 'dark-blue' | 'dark-green' | 'dark-purple';

export type AppLanguage = 'en' | 'hi' | 'ta' | 'te' | 'ml' | 'kn' | 'mr' | 'bn';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface Resource {
  id: string;
  title: string;
  category: 'Coping' | 'Exercise' | 'Education' | 'Emergency' | 'Music';
  description: string;
  url?: string;
}

export interface TestResult {
  id: string;
  testName: string;
  score: number;
  maxScore: number;
  interpretation: string;
  date: string;
}

export interface LifestyleData {
  sleepHours: number;
  sleepAwakenings: boolean;
  exerciseDays: number;
  exerciseTypes: ('Walking' | 'Yoga' | 'Strength' | 'Aerobic' | 'Other')[];
  dietUPF: 'Daily' | 'Often' | 'Sometimes' | 'Never';
  dietMediterranean: boolean;
  socialLivesAlone: boolean;
  socialLoneliness: 'High' | 'Moderate' | 'Low' | 'None';
  screenBeforeBed: boolean;
  sunlightExposure: number; // minutes
  purposeLevel: number; // 1-10
  routinePredictability: number; // 1-10
}

export interface UserProfile {
  name: string;
  email: string;
  dob: string;
  gender: string;
  nationality: string;
  photoUrl?: string;
  personalityType?: string;
  personalityDescription?: string;
  lifestyleFactors?: LifestyleData;
  profession?: string;
}

export interface SpotifyPlaylist {
  id: string;
  title: string;
  uri: string;
  description: string;
}

// Added missing PersonalityInsights interface to resolve import errors
export interface PersonalityInsights {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  career: string;
  relationships: string;
  copingAdvice: string;
}

// Added missing EnvironmentData interface for environmental assessments
export interface EnvironmentData {
  physical: number;
  social: number;
  economic: number;
  built: number;
}

export interface UserData {
  profile: UserProfile | null;
  moodHistory: { date: string; mood: Mood }[];
  testResults: TestResult[];
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  personalityTestComplete: boolean;
  theme: AppTheme;
  language: AppLanguage;
  responseStyle: ResponseStyle;
  spotifyLinked: boolean;
  spotifyVibe?: string;
  recommendedPlaylists: SpotifyPlaylist[];
}
