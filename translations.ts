
import { AppLanguage } from './types';

export const languages: { id: AppLanguage; name: string; native: string }[] = [
  { id: 'en', name: 'English', native: 'English' },
  { id: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { id: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { id: 'te', name: 'Telugu', native: 'తెలుగు' },
  { id: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { id: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { id: 'mr', name: 'Marathi', native: 'ಮರಾಠಿ' },
  { id: 'bn', name: 'Bengali', native: 'বাংলা' },
];

export const translations: Record<AppLanguage, any> = {
  en: {
    systemStatus: "System Intelligence Status",
    talk: "Talk",
    music: "Music",
    assessments: "Assessments",
    insights: "Insights",
    themes: "Themes",
    personalityTab: "Personality",
    howAreYou: "How's your mind today?",
    thinking: "Thinking...",
    helpIsHere: "Help is here.",
    crisisNote: "If you're in crisis, please connect with a human support line immediately.",
    startDiscovery: "Start Discovery",
    yourJourney: "Your Journey",
    lifestyleBlueprint: "Evidence-Based Blueprint",
    saveBlueprint: "Lock in Habits",
    eqPulse: "EQ Pulse",
    personalityArchetype: "Identity Archetype",
    lifestyle: {
      sleep: { label: "Sleep Quality", desc: "Duration & consistency (Vedaa et al. 2024)" },
      exercise: { label: "Physical Activity", desc: "Movement & strength (Noetel et al. 2024)" },
      social: { label: "Social Connection", desc: "Interaction vs isolation (Wang et al. 2023)" },
      diet: { label: "Nutritional Health", desc: "Dietary patterns (Lane et al. 2022)" },
      stress: { label: "Cortisol Balance", desc: "Stress management (Kim et al. 2002)" },
      substance: { label: "Substance Influence", desc: "Alcohol/Stimulant impact" },
      screen: { label: "Digital Consumption", desc: "Screen time before bed" },
      nature: { label: "Natural Exposure", desc: "Sunlight & nature time" },
      purpose: { label: "Purpose & Meaning", desc: "Engagement in life" },
      routine: { label: "Daily Structure", desc: "Routine and predictability" }
    },
    personality: {
      title: "Personality Assessment",
      phase: "Discovery Phase",
      statement: "Statement",
      next: "Next",
      finish: "Finish Assessment",
      skip: "Skip for now",
      agree: "Agree",
      disagree: "Disagree",
      mind: "Mind",
      energy: "Energy",
      nature: "Nature",
      tactics: "Tactics",
      questions: [
        "You regularly make new friends.",
        "You feel exhausted after spending time with a large group of people.",
        "You enjoy being the center of attention.",
        "You prefer to perform your best work alone rather than in a team.",
        "You are usually the one to start conversations.",
        "You spend a lot of your free time exploring various random topics that pique your interest.",
        "You often spend time exploring unrealistic yet intriguing ideas.",
        "You prefer to focus on the concrete details of the present moment.",
        "Your dreams tend to focus on the real world and its events.",
        "You are more of a big-picture person than a detail-oriented one.",
        "You often find yourself lost in thought when you are walking in nature.",
        "You find it easy to stay grounded and focused on the facts.",
        "Your emotions control you more than you control them.",
        "In a disagreement, you prioritize truth over people's feelings.",
        "You are more inclined to follow your head than your heart.",
        "You find it easy to empathize with a person whose experiences are very different from yours.",
        "You would rather be liked than be powerful.",
        "You prioritize efficiency and logic in your professional life.",
        "Your work style is closer to random energy spikes than a methodical routine.",
        "You prefer to have a to-do list for each day.",
        "You often make decisions on a whim.",
        "You like to have a clear plan before starting any new project.",
        "Your workspace is usually very organized.",
        "You keep your options open rather than committing to a final plan early on."
      ],
      types: {
        "INTJ": { name: "The Architect", desc: "Imaginative and strategic thinkers, with a plan for everything." },
        "INTP": { name: "The Logician", desc: "Innovative inventors with an unquenchable thirst for knowledge." },
        "ENTJ": { name: "The Commander", desc: "Bold, imaginative and strong-willed leaders, always finding a way – or making one." },
        "ENTP": { name: "The Debater", desc: "Smart and curious thinkers who cannot resist a intellectual challenge." },
        "INFJ": { name: "The Advocate", desc: "Quiet and mystical, yet very inspiring and tireless idealists." },
        "INFP": { name: "The Mediator", desc: "Poetic, kind and altruistic people, always eager to help a good cause." },
        "ENFJ": { name: "The Protagonist", desc: "Charismatic and inspiring leaders, able to mesmerize their listeners." },
        "ENFP": { name: "The Campaigner", desc: "Enthusiastic, creative and sociable free spirits, who can always find a reason to smile." },
        "ISTJ": { name: "The Logistician", desc: "Practical and fact-minded individuals, whose reliability cannot be doubted." },
        "ISFJ": { name: "The Defender", desc: "Very dedicated and warm protectors, always ready to defend their loved ones." },
        "ESTJ": { name: "The Executive", desc: "Excellent administrators, unsurpassed at managing things – or people." },
        "ESFJ": { name: "The Consul", desc: "Extraordinarily caring, social and popular people, always eager to help." },
        "ISTP": { name: "The Virtuoso", desc: "Bold and practical experimenters, masters of all kinds of tools." },
        "ISFP": { name: "The Adventurer", desc: "Flexible and charming artists, always ready to explore and experience something new." },
        "ESTP": { name: "The Entrepreneur", desc: "Smart, energetic and very perceptive people, who truly enjoy living on the edge." },
        "ESFP": { name: "The Entertainer", desc: "Spontaneous, energetic and enthusiastic people – life is never boring around them." }
      }
    },
    nav: {
      selectLanguage: "Select Language",
      systemSynced: "System Synced",
      quotaLimit: "Quota Limit",
      syncing: "Syncing..."
    },
    setupGuide: {
      localKnowledgeTitle: "Local Knowledge Base (RAG)",
      localKnowledgeQuota: "Offline (Quota Limit Hit)",
      localKnowledgeReady: "Online & Grounded",
      localKnowledgeOffline: "Host Not Found (localhost:8000)",
      localKnowledgeConnecting: "Connecting to Local API...",
      cloudStatusTitle: "Direct Cloud AI Status",
      cloudStatusValue: "Always Online (Primary Inference)",
      quotaHelpTitle: "Solving 429 Errors",
      quotaHelpDesc: "The 429 error means the Free Tier quota was reached. The app automatically switches to Direct Cloud Grounding until your quota resets (usually within 60 seconds).",
      backToCompanion: "Back to Companion"
    },
    chat: {
      title: "MindEase Gemini",
      badges: {
        localKnowledge: "Local Knowledge",
        cloudOnly: "Cloud Only",
        webSearch: "Web Search"
      },
      empty: {
        title: "Intelligence Center Ready",
        connected: "Connected to Local Knowledge Base. I'm ready to provide context-aware support.",
        cloudFallback: "Direct Cloud AI active. Backend not detected on localhost:8000."
      },
      errors: {
        generic: "Something went wrong. Please try again.",
        overloaded: "The AI is busy right now. Please retry in 30-60 seconds.",
        quota: "Error: Quota exceeded (429). Please wait 1 minute.",
        ragFallback: "I'm having trouble connecting to my local knowledge base. I will switch to direct cloud reasoning to assist you."
      },
      loading: "Generating {style} response...",
      inputPlaceholder: "Fir Se aa Gya Rona Dhona Karne?",
      activeStyle: "Active Style: {style}",
      statusLocal: "Local Host Linked",
      statusCloud: "Direct Cloud AI",
      poweredBy: "Powered by Gemini 3 Pro"
    },
    responseStyles: {
      compassionate: "Warm",
      direct: "Direct",
      scientific: "Clinical",
      reflective: "Reflective"
    },
    auth: {
      title: "Personalize Your Profile",
      subtitle: "Tailoring our AI support for you{name}.",
      nameLabel: "Your Full Name",
      namePlaceholder: "e.g. Alex Johnson",
      avatarLabel: "Customize Your Avatar",
      presetsFor: "Presets for {country}",
      uploadTitle: "Upload custom photo",
      uploadShort: "Own DP",
      nationalityLabel: "Nationality",
      dobLabel: "Date of Birth (DD/MM/YY)",
      dobPlaceholder: "e.g. 15/08/95",
      genderLabel: "Gender",
      genderPlaceholder: "Select gender",
      genderOptions: {
        male: "Male",
        female: "Female",
        nonBinary: "Non-binary",
        preferNot: "Prefer not to say"
      },
      submit: "Begin Journey",
      saving: "Saving...",
      savingNote: "Saving your profile...",
      saved: "Profile saved"
    },
    assessment: {
      filters: {
        All: "All",
        Mood: "Mood",
        Stress: "Stress",
        Behavior: "Behavior",
        ADHD: "ADHD",
        Intelligence: "Intelligence"
      },
      searchPlaceholder: "Search self-discovery tools...",
      startDiscovery: "Start Discovery",
      insightTitle: "Insight Gained",
      insightSubtitle: "This knowledge is a gift to your future self. We've integrated this into your personalized path.",
      journeyStage: "Your Journey Stage",
      backToDashboard: "Back to Dashboard",
      stepLabel: "Step {current} of {total}",
      pause: "Pause",
      optionLabels: {
        "Not at all": "Not at all",
        "Several days": "Several days",
        "More than half the days": "More than half the days",
        "Nearly every day": "Nearly every day",
        "Strongly Disagree": "Strongly Disagree",
        "Disagree": "Disagree",
        "Slightly Disagree": "Slightly Disagree",
        "Neutral": "Neutral",
        "Slightly Agree": "Slightly Agree",
        "Agree": "Agree",
        "Strongly Agree": "Strongly Agree",
        "Never": "Never",
        "Almost Never": "Almost Never",
        "Sometimes": "Sometimes",
        "Fairly Often": "Fairly Often",
        "Very Often": "Very Often",
        "None / Very Satisfied": "None / Very Satisfied",
        "Mild / Satisfied": "Mild / Satisfied",
        "Moderate / Neutral": "Moderate / Neutral",
        "Severe / Dissatisfied": "Severe / Dissatisfied",
        "Very Severe / Very Dissatisfied": "Very Severe / Very Dissatisfied",
        "Rarely": "Rarely",
        "Often": "Often"
      },
      interpretations: {
        "Exceptional Emotional Wisdom": "Exceptional Emotional Wisdom",
        "High Emotional Awareness": "High Emotional Awareness",
        "Steadily Developing": "Steadily Developing",
        "Early Awareness Stage": "Early Awareness Stage",
        "High Need for Nurturing": "High Need for Nurturing",
        "Significant Support Focus": "Significant Support Focus",
        "Self-Care Priority": "Self-Care Priority",
        "Light Support Focus": "Light Support Focus",
        "Radiant Well-being": "Radiant Well-being",
        "Deep Awareness (Seeking Calm)": "Deep Awareness (Seeking Calm)",
        "Moderate Alertness": "Moderate Alertness",
        "Light Awareness": "Light Awareness",
        "Deeply Grounded": "Deeply Grounded",
        "High Resilience Training Opportunity": "High Resilience Training Opportunity",
        "Steady Adaptation": "Steady Adaptation",
        "Excellent Resilience": "Excellent Resilience",
        "Priority Rest Recovery": "Priority Rest Recovery",
        "Moderate Recovery Needs": "Moderate Recovery Needs",
        "Healthy Maintenance": "Healthy Maintenance",
        "Optimal Rest": "Optimal Rest",
        "Vibrant & Dynamic Mind": "Vibrant & Dynamic Mind",
        "Structured Focus": "Structured Focus"
      },
      tests: {}
    },
    insightsPage: {
      clinicalRiskStatus: "Clinical Risk Status",
      riskFactors: {
        sleep: "Sleep",
        exercise: "Exercise",
        social: "Social",
        diet: "Diet"
      },
      riskLabels: {
        sleepHighMortality: "12% Higher Mortality Risk",
        sleepElevatedMental: "Elevated Mental Illness Risk",
        sleepOptimalRecovery: "Optimal Recovery Window",
        exerciseLowActivity: "Low Activity Impact",
        exerciseHighImpact: "High-Impact Modalities Used",
        socialMortality: "32% Increased Mortality Risk",
        dietHighAnxiety: "High Anxiety/Depression Correlation"
      },
      recentMood: "Recent Mood",
      establishingBaseline: "Establishing Baseline",
      blueprintStatus: "Blueprint Status",
      calibrated: "Calibrated",
      pending: "Pending",
      groundedBlueprintTitle: "Scientifically Grounded Blueprint",
      groundedBlueprintSubtitle: "Derived from meta-analyses on 2M+ individuals.",
      updateHabitLog: "Update Habit Log",
      sections: {
        sleep: "Sleep (Vedaa et al.)",
        exercise: "Exercise (Noetel et al.)",
        diet: "Diet (Lane et al.)",
        social: "Social (Wang et al.)"
      },
      labels: {
        hoursPerNight: "Hours per night?",
        nightAwakenings: "Experience nighttime awakenings?",
        activeDaysPerWeek: "Active days / week?",
        processedFoodIntake: "Processed Food Intake?",
        followMediterranean: "Follow Mediterranean patterns?",
        liveAlone: "Do you live alone?",
        selfReportedLoneliness: "Self-Reported Loneliness?"
      },
      exerciseOptions: {
        Walking: "Walking",
        Yoga: "Yoga",
        Strength: "Strength",
        Aerobic: "Aerobic",
        Other: "Other"
      },
      dietOptions: {
        Daily: "Daily (High Risk)",
        Often: "Often",
        Sometimes: "Sometimes",
        Never: "Never (Optimal)"
      },
      lonelinessOptions: {
        High: "High (Significant Risk)",
        Moderate: "Moderate",
        Low: "Low",
        None: "None"
      },
      discardChanges: "Discard Changes",
      finalizeBlueprint: "Finalize Blueprint",
      blueprintRequiredTitle: "Scientific Blueprint Required",
      blueprintRequiredDesc: "To provide high-quality RAG support, we need to calibrate your clinical factors.",
      startIntakeForm: "Start Intake Form",
      longitudinalTitle: "Longitudinal Evidence History",
      noAssessments: "No clinical assessments logged recently."
    },
    environment: {
      titleLabel: "Environment Assessment",
      title: "How does your environment affect you?",
      summary: "Environmental psychology shows that factors like air quality, social safety, and access to nature can account for up to 30% of your emotional baseline.",
      impactScoreLabel: "Impact Score",
      impactLabels: {
        nurturing: "Nurturing Environment",
        stable: "Stable Environment",
        demanding: "Demanding Environment",
        critical: "Critical Support Needed"
      },
      sliderScale: {
        restricting: "Restricting",
        supportive: "Supportive"
      },
      factors: {
        physical: {
          label: "Physical",
          desc: "Air quality, noise levels, and natural light exposure in your daily settings."
        },
        social: {
          label: "Social",
          desc: "Strength of support networks, neighborhood safety, and your sense of belonging."
        },
        economic: {
          label: "Economic",
          desc: "Financial stability, job security, and access to quality healthcare/amenities."
        },
        built: {
          label: "Built",
          desc: "Proximity to green spaces, walkability, and the aesthetic quality of your home/office."
        }
      },
      updateButton: "Update Eco-Sync",
      assessmentScalesTitle: "Assessment Scales",
      assessmentScalesQuote: "Researchers utilize several validated methods to quantify how surroundings affect health.",
      assessmentScalesList: [
        { name: "WHO Burden of Disease", desc: "Assessing global health loss attributed to environmental risks." },
        { name: "NEWS Scale", desc: "Evaluating neighborhood walkability and its impact on mental activity." },
        { name: "Environmental Quality Index", desc: "Composite metric of air, water, land, and sociodemographic environments." },
        { name: "Social Determinants of Health", desc: "Conditions in which people are born, grow, live, and work." }
      ],
      statisticalImpactTitle: "Statistical Impact",
      modelComment: "// Mental Health Score Model",
      statisticalImpactCards: {
        exposure: {
          label: "Exposure Assessment",
          text: "Quantifying air quality (AQI) and noise (decibels)."
        },
        outcome: {
          label: "Outcome Measurement",
          text: "Assessing health using validated questionnaires."
        },
        correlation: {
          label: "Correlation Analysis",
          text: "Regression models to determine factor relationships."
        },
        gis: {
          label: "GIS Mapping",
          text: "Identifying community patterns and health hotspots."
        }
      },
      footerTitle: "Practical Self-Assessment",
      footerText: "For personal growth, identify key factors in your environment (rated 1-10), track changes in your mental health scores, and monitor your journal for mood shifts corresponding to environmental conditions."
    },
    personalityInsights: {
      errorUnavailable: "Detailed insights are unavailable right now.",
      emptyTitle: "Who are you?",
      emptySubtitle: "Unlock deep insights into your personality, strengths, and communication style by taking our short assessment.",
      startDiscovery: "Start Discovery",
      resultLabel: "Your Result",
      typeLabel: "The {type}",
      resultFallback: "Here is your core personality archetype from the assessment.",
      generatingFull: "Generating full insights...",
      generating: "Generating...",
      generateFull: "Generate Full Insights",
      identityReport: "Identity Report • {name}",
      keyStrengths: "Key Strengths",
      growthAreas: "Growth Areas",
      careerPurpose: "Career & Purpose",
      copingStrategies: "Coping Strategies"
    },
    musicPage: {
      vibes: [
        "Mellow & Reflective",
        "High-Energy Focus",
        "Calm & Ambient",
        "Stirring & Emotional",
        "Dark & Intense",
        "Uplifting & Vibrant"
      ],
      spotifyConnect: "Spotify Connect",
      heroTitle: "Music for your Soul.",
      heroSubtitle: "Connect your Spotify to let MindEase AI curate therapy-grade playlists and track your listening vibe for deeper personalized support.",
      connecting: "Connecting...",
      linkAccount: "Link Spotify Account",
      vibeTrackerTitle: "Spotify Vibe Tracker",
      vibeTrackerSubtitle: "Sync your recent activity to help MindEase AI sense your overall mood.",
      analyzingHistory: "Analyzing History...",
      syncRecentVibe: "Sync Recent Vibe",
      therapeuticAudio: "Therapeutic Audio",
      forYou: "For you, {name}",
      personalizedSelections: "Personalized selections based on your {type} archetype.",
      reCurate: "Re-Curate",
      matchingSounds: "Matching sounds to your spirit...",
      archetypePick: "Archetype Pick"
    },
    themesPage: {
      title: "Digital Sanctuaries",
      subtitle: "Choose an atmosphere that resonates with your mind. From calming skies to cybernetic midnights.",
      neonSeries: "Neon Midnight Series",
      natureSeries: "Vibrant Nature Series",
      activeLabel: "Active",
      engageNeon: "Engage Neon",
      selectSanctuary: "Select Sanctuary",
      footerNote: "Your choice of atmosphere syncs across all devices - Deep personalization for your wellbeing",
      catalog: {}
    },
    resources: {
      empty: "Resources will appear here based on your conversation.",
      learnMore: "Learn More",
      categories: {
        Coping: "Coping",
        Exercise: "Exercise",
        Education: "Education",
        Emergency: "Emergency",
        Music: "Music"
      }
    },
    moods: {
      Great: "Great",
      Good: "Good",
      Okay: "Okay",
      Anxious: "Anxious",
      Sad: "Sad",
      Overwhelmed: "Overwhelmed"
    }
  },
  hi: { talk: "बातचीत", music: "संगीत", assessments: "मूल्यांकन", insights: "अंतर्दृष्टि", themes: "थीम्स" },
  ta: { talk: "உரையாடல்", music: "இசை", assessments: "மதிப்பீடுகள்", insights: "நுண்ணறிவு", themes: "தீம்கள்" },
  te: { talk: "మాటలు", music: "సంగీతం", assessments: "అంచనాలు", insights: "అంతర్దృష్తులు", themes: "థీమ్స్" },
  ml: { talk: "സംസാരം", music: "സംഗീതം", assessments: "മൂല്യനിർണ്ണയം", insights: "ഉൾക്കാഴ്ചകൾ", themes: "തീമുകൾ" },
  kn: { talk: "ಮಾತುಕತೆ", music: "ಸಂಗೀತ", assessments: "ಮೌಲ್ಯಮಾಪನ", insights: "ಒಳನೋಟಗಳು", themes: "ಥೀಮ್‌ಗಳು" },
  mr: { talk: "संवाद", music: "संगीत", assessments: "मूल्यमापन", insights: "अंतर्दृष्टी", themes: "थीम्स" },
  bn: { talk: "কথা বলা", music: "সঙ্গীত", assessments: "মূল্যায়ন", insights: "অন্তর্দৃষ্টি", themes: "থিম" }
};

const isPlainObject = (value: any) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const deepMerge = (base: any, override: any): any => {
  if (base === undefined) return override;
  if (override === undefined) return base;
  if (Array.isArray(base)) return Array.isArray(override) ? override : base;
  if (isPlainObject(base) && isPlainObject(override)) {
    const output: any = { ...base };
    for (const key of Object.keys(override)) {
      output[key] = deepMerge(base[key], override[key]);
    }
    return output;
  }
  return override;
};

export const getTranslations = (lang: AppLanguage) =>
  deepMerge(translations.en, translations[lang] || {});
