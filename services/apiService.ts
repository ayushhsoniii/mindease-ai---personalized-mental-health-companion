import { ChatMessage, Mood, UserProfile, TestResult, Resource, SpotifyPlaylist, ResponseStyle, UserData } from "../types";

const API_BASE_URL = "http://localhost:8000";

export class ApiService {
  private ragStatus: string = "unknown";

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(2000) 
      });
      if (response.ok) {
        const data = await response.json();
        this.ragStatus = data.rag;
        return true;
      }
      return false;
    } catch (error) {
      this.ragStatus = "offline";
      return false;
    }
  }

  getRagStatus() {
    return this.ragStatus;
  }

  async *generateResponseStream(
    history: ChatMessage[],
    currentMood: Mood | null,
    profile: UserProfile | null,
    language: string,
    testResults: TestResult[],
    responseStyle: ResponseStyle,
    spotifyVibe?: string
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: history[history.length - 1].content,
          history: history.slice(0, -1),
          context: {
            mood: currentMood,
            profile,
            language,
            testResults,
            responseStyle,
            spotifyVibe
          }
        }),
      });

      if (!response.ok) {
        if (response.status === 429) yield { text: "Error: Quota exceeded (429). Please wait 1 minute." };
        else throw new Error("Backend error");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          yield { text: chunk };
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      yield { text: "I'm having trouble connecting to my local knowledge base. I will switch to direct cloud reasoning to assist you." };
    }
  }

  async syncUserData(userData: UserData): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async getPersonalizedResources(context: string): Promise<Resource[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context }),
      });
      return await response.json();
    } catch { return []; }
  }
}

export const apiService = new ApiService();
