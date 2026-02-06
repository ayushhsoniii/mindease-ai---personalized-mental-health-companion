
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { ChatMessage, Mood, UserProfile, TestResult, Resource, SpotifyPlaylist, PersonalityInsights, ResponseStyle } from "../types";

// Initialize the AI client using the environment variable
// In the frontend context, process.env.API_KEY is automatically injected
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key missing in Frontend environment.");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

const RESPONSE_STYLE_GUIDELINES: Record<ResponseStyle, string> = {
  compassionate:
    "Warm, validating, and gentle. Use supportive language, acknowledge feelings, and offer encouragement. Ask one brief, caring follow-up question.",
  direct:
    "Concise, straightforward, and action-oriented. Use short sentences or steps. Avoid excessive hedging while staying respectful.",
  scientific:
    "Clinical, precise, and evidence-informed. Explain mechanisms briefly, use neutral wording, and note uncertainty when relevant.",
  reflective:
    "Calm, thoughtful, and Socratic. Mirror the user's feelings, invite self-reflection, and ask open-ended questions rather than prescribing.",
};

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  kn: "Kannada",
  mr: "Marathi",
  bn: "Bengali",
};

export const geminiService = {
  async *streamChat(
    history: ChatMessage[],
    currentMood: Mood | null,
    profile: UserProfile | null,
    language: string,
    testResults: TestResult[],
    responseStyle: ResponseStyle,
    spotifyVibe?: string
  ) {
    const ai = getAI();
    
    const languageName = LANGUAGE_NAMES[language] || language || "English";
    const systemInstruction = `
      You are MindEase Companion, a world-class empathetic mental health support AI.
      Respond in ${languageName} unless the user explicitly asks for another language.
      User Profile: ${profile ? JSON.stringify(profile) : 'Anonymous'}
      Current Mood: ${currentMood || 'Not specified'}
      Recent Test Results: ${JSON.stringify(testResults)}
      Preferred Language: ${language}
      Response Style: ${responseStyle}
      Style Guidelines: ${RESPONSE_STYLE_GUIDELINES[responseStyle]}
      Spotify Vibe: ${spotifyVibe || 'None'}

      GUIDELINES:
      1. Be deeply empathetic but maintain professional boundaries.
      2. Use the provided context to personalize advice.
      3. If a crisis is detected, provide emergency resources immediately.
      4. Use the googleSearch tool to find specific grounding for psychological concepts or local resources.
      5. Always cite your sources if you use Google Search.
    `;

    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    try {
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
          temperature: 0.7,
        },
      });

      for await (const chunk of responseStream) {
        // Correct usage of .text property as per @google/genai guidelines
        if (chunk.text) {
          yield {
            text: chunk.text,
            grounding: chunk.candidates?.[0]?.groundingMetadata?.groundingChunks
          };
        }
      }
    } catch (error) {
      console.error("Gemini Streaming Error:", error);
      yield { text: "I'm having a moment of silence. Please ensure your environment API_KEY is configured correctly." };
    }
  },

  async getPersonalityInsights(personalityType: string, language: string): Promise<PersonalityInsights> {
    const ai = getAI();
    try {
      const languageName = LANGUAGE_NAMES[language] || language || "English";
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide deep personality insights for the ${personalityType} archetype in ${languageName}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              career: { type: Type.STRING },
              relationships: { type: Type.STRING },
              copingAdvice: { type: Type.STRING },
            },
            required: ["summary", "strengths", "weaknesses", "career", "relationships", "copingAdvice"]
          }
        }
      });

      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Failed to fetch insights:", e);
      throw new Error("Failed to parse insights from Gemini API");
    }
  },

  async getMusicRecommendations(mood: Mood | null, profile: UserProfile | null): Promise<SpotifyPlaylist[]> {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Suggest 4 Spotify playlist themes for a person feeling ${mood || 'neutral'} with personality ${profile?.personalityType || 'unknown'}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                uri: { type: Type.STRING, description: "Spotify open URL" },
                description: { type: Type.STRING }
              },
              required: ["id", "title", "uri", "description"]
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Music recommendation error:", e);
      return [];
    }
  }
};
