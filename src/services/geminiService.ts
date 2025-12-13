import { GoogleGenAI } from "@google/genai";

// Access the API key injected by Vite. 
// We use a safe check because 'process' might not exist in the browser runtime.
const apiKey = process.env.API_KEY || '';

// Initialize AI only if key exists to prevent immediate crash, though it will fail on generation
const ai = new GoogleGenAI({ apiKey });

export const generateJobDescription = async (title: string, skills: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning mock description.");
    return `[Mock AI Response] Job Title: ${title}\n\nWe are looking for a skilled professional with experience in ${skills}.\n\nResponsibilities:\n- Deliver high quality work\n- Communicate effectively\n- Meet deadlines\n\nRequirements:\n- Proven track record\n- Strong portfolio\n\nPlease apply with your recent work samples.`;
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
