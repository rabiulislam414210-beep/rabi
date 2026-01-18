
import { GoogleGenAI } from "@google/genai";

// Fix: Initialized with process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (name: string, category: string, companyName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a compelling, SEO-friendly product description for an item called "${name}" by "${companyName}" in the "${category}" category. Focus on quality and brand value. Keep it under 100 words.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("AI Generation failed:", error);
    return "Failed to generate description. Please try again.";
  }
};

export const analyzeSalesTrends = async (orderData: any): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As a business analyst, briefly summarize these sales trends and suggest one action to improve revenue: ${JSON.stringify(orderData)}`,
      config: {
        temperature: 0.5,
      },
    });
    return response.text || "No analysis available.";
  } catch (error) {
    return "Sales analysis currently unavailable.";
  }
};
