import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = "AIzaSyC8NRJXhHEvkzwKkIpbb1SpYE_v2xhHa4A";
const ai = new GoogleGenAI({ apiKey: API_KEY });

const bilingualTextSchema = {
    type: Type.OBJECT,
    properties: {
        spanish: { type: Type.STRING },
        english: { type: Type.STRING },
    },
    required: ["spanish", "english"],
};

console.log("Testing Civics Quiz generation for Mexico...");

try {
  const prompt = `You are an expert in Latin American civics, immigration law, and a Spanish language tutor.
    Generate 5 multiple-choice quiz questions about the civics and essential immigration knowledge of Mexico.
    For each question, its options, and the correct answer, provide both the Spanish text and an accurate English translation.
    The questions must be tailored to the specific dialect and common knowledge for someone seeking to immigrate to Mexico.
    
    Cover a diverse range of topics including:
    - Independence day and national holidays
    - Government structure (branches, legislative system)
    - Number of states/provinces/departments
    - Current leader and political system
    - Key constitutional facts and citizen rights
    - National symbols (anthem, coat of arms, national colors)
    - Important historical figures and dates
    - Basic geography (capital, major cities, borders)
    - Cultural traditions and national identity
    - Public services and institutions immigrants should know

    Provide the response strictly in the specified JSON format. The 'options' array must contain exactly four unique items.`;

  const schema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            question: bilingualTextSchema,
            options: { type: Type.ARRAY, items: bilingualTextSchema },
            correctAnswer: bilingualTextSchema,
        },
        required: ["question", "options", "correctAnswer"],
    },
  };

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: schema,
    },
  });
  
  console.log("✅ Quiz generated successfully!");
  console.log(response.text.substring(0, 500));
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error("Full error:", error);
}
