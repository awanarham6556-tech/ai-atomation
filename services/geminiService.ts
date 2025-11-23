import { GoogleGenAI } from "@google/genai";
import { Channel } from "../types";

// Safely retrieve API key to prevent crashes in browser-only environments where process is undefined
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    console.warn("Environment variable access failed, utilizing fallback/empty key");
    return '';
  }
};

const GEMINI_API_KEY = getApiKey();

export const analyzeChannel = async (url: string): Promise<Partial<Channel>> => {
    if (!GEMINI_API_KEY) {
        return {
            name: "Unknown Channel",
            description: "API Key missing. Cannot analyze.",
            tags: ["Error"],
            subscribers: "0"
        };
    }

    try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const prompt = `Analyze the YouTube channel URL/Name: "${url}". 
        Return a JSON object with fields: "name" (creative guess based on url), "description" (short 1 sentence summary), "tags" (array of 3 strings), "subscribers" (estimate string like '1.2M').`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        
        const text = response.text || "{}";
        return JSON.parse(text);
    } catch (e) {
        console.error("Gemini analysis failed", e);
        return {
            name: "Channel " + url.substring(0, 10),
            description: "Could not analyze channel details.",
            tags: ["General"],
            subscribers: "Unknown"
        };
    }
};

export const generateCaption = async (videoTitle: string, channelName: string, config: any): Promise<string> => {
    if (!GEMINI_API_KEY) return `Check out this video: ${videoTitle}! #video`;

    try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const prompt = `Write a viral Facebook post caption for a video titled "${videoTitle}" from the channel "${channelName}".
        Target Audience: ${config.targetAudience}.
        Style: Engaging, click-worthy, but not spammy. Include 2 hashtags.
        Keep it under 280 characters.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        return response.text || `Watch ${videoTitle} now!`;
    } catch (e) {
        console.error("Gemini caption failed", e);
        return `New video alert: ${videoTitle}`;
    }
};