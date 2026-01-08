
import { GoogleGenAI } from "@google/genai";

// Fix: Strictly use process.env.API_KEY for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Helps students polish their request description.
   */
  async polishDescription(title: string, rawDescription: string) {
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
      // Fix: Access .text property directly instead of calling it as a method
      return response.text || rawDescription;
    } catch (error) {
      console.error("Gemini polish failed:", error);
      return rawDescription;
    }
  },

  /**
   * Suggests an Unsplash keyword for a highly relevant image based on the request.
   */
  async suggestImageKeyword(title: string, description: string) {
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
      // Fix: Access .text property directly instead of calling it as a method
      return response.text?.trim().replace(/"/g, '') || "student university";
    } catch (error) {
      return "university study";
    }
  }
};
