
import { GoogleGenAI, Type } from "@google/genai";

export const fetchNewYearMessage = async (name: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a beautiful, heartwarming, and poetic New Year 2025 message for someone named ${name}. 
                 It should include a short poem (4-6 lines) and a warm personalized wish. 
                 The tone should be celebratory, inspiring, and sophisticated.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            poetry: {
              type: Type.STRING,
              description: "A beautiful short poem about the new year and new beginnings.",
            },
            wishes: {
              type: Type.STRING,
              description: "A warm personalized wishing message.",
            },
          },
          required: ["poetry", "wishes"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
  } catch (error) {
    console.error("Error fetching Gemini message:", error);
    return {
      poetry: "As the clock strikes twelve and the night turns gold,\nA story of wonder begins to unfold.\nWith stars as your witness and dreams as your guide,\nMay happiness always be right by your side.",
      wishes: `Happy New Year, ${name}! May 2025 be your most magical year yet, filled with laughter, love, and endless possibilities.`
    };
  }
};
