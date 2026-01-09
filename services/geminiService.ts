import { GoogleGenAI } from "@google/genai";

// Safe API key retrieval that works in all environments
const getApiKey = (): string => {
  // Try different ways to get the API key
  if (typeof process !== 'undefined' && process.env?.API_KEY) {
    return process.env.API_KEY;
  }
  
  // For Vite environment variables
  if (typeof import.meta !== 'undefined') {
    const viteEnv = import.meta.env as any;
    if (viteEnv?.VITE_GEMINI_API_KEY) {
      return viteEnv.VITE_GEMINI_API_KEY;
    }
  }
  
  return '';
};

// Initialize AI client safely
let ai: any = null;

try {
  const apiKey = getApiKey();
  if (apiKey && apiKey.length > 0) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (error) {
  console.warn("Gemini AI initialization failed:", error);
}

export const geminiService = {
  /**
   * Helps students polish their request description.
   */
  async polishDescription(title: string, rawDescription: string): Promise<string> {
    // Return original if no AI available
    if (!ai) {
      console.log("Gemini not available - returning original description");
      return rawDescription;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `I am writing a request for financial aid as a student. 
        Title: ${title}
        Draft: ${rawDescription}
        
        Please rewrite this to be respectful, clear, and focused on the facts, while maintaining the sense of urgency. Keep it concise.`,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      
      return response.text || rawDescription;
    } catch (error) {
      console.error("Gemini polish failed:", error);
      return rawDescription;
    }
  },

  /**
   * Suggests an Unsplash keyword for a highly relevant image based on the request.
   */
  async suggestImageKeyword(title: string, description: string): Promise<string> {
    // Return default if no AI available
    if (!ai) {
      return "university student";
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Given a student financial aid request title and description, suggest ONE specific search keyword (max 3 words) that would return a relevant, high-quality, non-stock-looking photograph from Unsplash.
        
        Title: ${title}
        Description: ${description}
        
        Example: "college dormitory mess hall" or "broken student laptop" or "university tuition office".
        Return ONLY the keyword.`,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      
      return response.text?.trim().replace(/"/g, '') || "student university";
    } catch (error) {
      console.error("Gemini keyword suggestion failed:", error);
      return "university study";
    }
  }
};

export default geminiService;