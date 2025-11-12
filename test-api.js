import { GoogleGenAI } from "@google/genai";

const API_KEY = "AIzaSyC8NRJXhHEvkzwKkIpbb1SpYE_v2xhHa4A";
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log("Testing Gemini API connection...");

try {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: "Say hello in Spanish",
  });
  
  console.log("✅ API works! Response:", response.text);
} catch (error) {
  console.error("❌ API Error:", error.message);
}
