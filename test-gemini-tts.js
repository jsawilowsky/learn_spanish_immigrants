import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = "AIzaSyC8NRJXhHEvkzwKkIpbb1SpYE_v2xhHa4A";
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log("Testing Gemini TTS with audio modality...");

const testText = "Hola, ¿cómo estás? Tres de noviembre.";

try {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: [{ parts: [{ text: testText }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Puck' },
        },
      },
    },
  });
  
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (base64Audio) {
    console.log(`✅ Gemini TTS works! Audio data length: ${base64Audio.length}`);
  } else {
    console.log("❌ No audio data in response");
    console.log(JSON.stringify(response, null, 2));
  }
} catch (error) {
  console.error("❌ Error:", error.message);
  if (error.status) {
    console.error("Status:", error.status);
  }
}
