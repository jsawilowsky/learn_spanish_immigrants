import { GoogleGenAI } from "@google/genai";

const API_KEY = "AIzaSyC8NRJXhHEvkzwKkIpbb1SpYE_v2xhHa4A";
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log("Listing available models...");

try {
  const models = await ai.models.list();
  console.log("Available models:");
  for (const model of models) {
    console.log(`- ${model.name}`);
  }
} catch (error) {
  console.error("Error:", error.message);
}
