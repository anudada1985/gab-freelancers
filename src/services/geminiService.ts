import { GoogleGenAI } from "@google/genai";

declare const process: any;

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateJobDescription = async (title: string, skills: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning mock description.");
    return "This is a placeholder description because the API key is missing. In a real environment, Gemini would generate a detailed job description here based on the title.";
  }

  try {
    const prompt = `
      You are an expert HR consultant for a Pakistani freelancing platform called "GAB Freelancers".
      Write a professional, encouraging, and clear job description for a gig with the title: "${title}".
      Required skills: ${skills}.
      
      Structure the response with:
      1. A brief project overview.
      2. Key Responsibilities (bullet points).
      3. Requirements (bullet points).
      4. A closing sentence encouraging local talent to apply.
      
      Keep the tone professional yet accessible. Do not use markdown formatting like **bold** or # headers, just plain text with line breaks.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Error generating job description:", error);
    return "An error occurred while generating the description. Please try again or write it manually.";
  }
};