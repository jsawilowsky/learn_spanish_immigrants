import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = "AIzaSyC8NRJXhHEvkzwKkIpbb1SpYE_v2xhHa4A";
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log("Testing TTS with different models...");

const models = [
  "gemini-2.0-flash-exp-tts",
  "gemini-2.0-flash-exp",
  "gemini-1.5-flash-8b"
];

for (const model of models) {
  console.log(`\nTrying model: ${model}`);
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: "Hola, ¿cómo estás?" }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      console.log(`✅ ${model} works! Audio length: ${base64Audio.length}`);
      break;
    } else {
      console.log(`❌ ${model} - No audio data returned`);
    }
  } catch (error) {
    console.log(`❌ ${model} - Error: ${error.message}`);
  }
}
