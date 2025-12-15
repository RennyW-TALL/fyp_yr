import { GoogleGenAI } from "@google/genai";
import { CHATBOT_SYSTEM_INSTRUCTION } from "../constants";

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing from environment variables");
      throw new Error("API Key not found");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const generateBotResponse = async (
  history: { role: 'user' | 'model'; text: string }[],
  currentMessage: string
): Promise<string> => {
  try {
    const client = getClient();
    
    // Convert history to format expected by the SDK if needed, 
    // but for simple single-turn or recreated chat, we can use the Chat API
    const chat = client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: CHATBOT_SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 500,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: currentMessage });
    return result.text || "I'm having trouble understanding right now. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I'm currently experiencing technical difficulties. Please try again later or contact the counseling center directly if this is urgent.";
  }
};