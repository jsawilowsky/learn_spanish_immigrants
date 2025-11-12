
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { QuizQuestion, InterviewQuestion, Article, NewsArticle } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateContentWithSchema = async <T,>(prompt: string, schema: any): Promise<T> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as T;
    } catch (error: any) {
        console.error("Error fetching or parsing data from Gemini API:", error);
        
        // Check for rate limit error
        if (error.status === 429 || error.message?.includes('429') || error.message?.includes('Resource exhausted')) {
            throw new Error("API rate limit reached. Please wait a minute and try again.");
        }
        
        // Check for other API errors
        if (error.status === 404) {
            throw new Error("AI model not available. Please contact support.");
        }
        
        throw new Error("Failed to generate content from AI. Please try again in a few moments.");
    }
};

const bilingualTextSchema = {
    type: Type.OBJECT,
    properties: {
        spanish: { type: Type.STRING },
        english: { type: Type.STRING },
    },
    required: ["spanish", "english"],
};

export const getCivicsQuiz = async (countryName: string): Promise<QuizQuestion[]> => {
    // Load from static JSON files instead of API
    try {
        const response = await fetch(`/data/${countryName.toLowerCase()}.json`);
        if (!response.ok) {
            throw new Error('Content not available for this country yet');
        }
        const data = await response.json();
        return data.civicsQuiz;
    } catch (error) {
        console.error('Error loading quiz:', error);
        throw new Error('Failed to load quiz content. This country content is not available yet.');
    }
    
    /* Original API version - disabled to avoid rate limits
    const prompt = `You are an expert in Latin American civics, immigration law, and a Spanish language tutor.
    const prompt = `You are an expert in Latin American civics, immigration law, and a Spanish language tutor.
    Generate 5 multiple-choice quiz questions about the civics and essential immigration knowledge of ${countryName}.
    For each question, its options, and the correct answer, provide both the Spanish text and an accurate English translation.
    The questions must be tailored to the specific dialect and common knowledge for someone seeking to immigrate to ${countryName}.
    
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

    return generateContentWithSchema<QuizQuestion[]>(prompt, schema);
    */
};

export const getInterviewQuestions = async (countryName: string): Promise<InterviewQuestion[]> => {
    // Load from static JSON files instead of API
    try {
        const response = await fetch(`/data/${countryName.toLowerCase()}.json`);
        if (!response.ok) {
            throw new Error('Content not available for this country yet');
        }
        const data = await response.json();
        return data.interviewQuestions;
    } catch (error) {
        console.error('Error loading interview questions:', error);
        throw new Error('Failed to load interview content. This country content is not available yet.');
    }
    
    /* Original API version - disabled
    const prompt = `You are an experienced immigration consultant and Spanish language tutor specializing in ${countryName} immigration processes.
    const prompt = `You are an experienced immigration consultant and Spanish language tutor specializing in ${countryName} immigration processes.
    Generate 5 comprehensive interview questions for an immigration or residency interview in ${countryName}.
    For each question and its sample answer, provide both the Spanish text and an accurate English translation.
    The questions and answers should reflect the cultural and linguistic nuances, local expressions, and formal language used in ${countryName}.
    
    Cover essential topics such as:
    - Reasons for immigrating and motivation (work, family reunification, study, investment)
    - Personal background (education, professional experience, family situation)
    - Future plans and integration (where you plan to live, work plans, community involvement)
    - Knowledge of ${countryName} (culture, laws, customs, daily life)
    - Financial stability and means of support
    - Understanding of visa/residency requirements and obligations
    - Language proficiency and commitment to learning Spanish
    - Ties to home country and intent to establish roots in ${countryName}
    
    Sample answers should be natural, respectful, and demonstrate good character and genuine intent to integrate.

    Provide the response strictly in the specified JSON format.`;
    
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                question: bilingualTextSchema,
                sampleAnswer: bilingualTextSchema,
            },
            required: ["question", "sampleAnswer"],
        },
    };

    return generateContentWithSchema<InterviewQuestion[]>(prompt, schema);
    */
};

export const getReadingArticle = async (countryName: string): Promise<Article> => {
    // Load from static JSON files instead of API
    try {
        const response = await fetch(`/data/${countryName.toLowerCase()}.json`);
        if (!response.ok) {
            throw new Error('Content not available for this country yet');
        }
        const data = await response.json();
        return data.readingArticle;
    } catch (error) {
        console.error('Error loading reading article:', error);
        throw new Error('Failed to load reading content. This country content is not available yet.');
    }
    
    /* Original API version - disabled
    const prompt = `You are a journalist and Spanish language tutor specializing in content for new immigrants in ${countryName}.
    const prompt = `You are a journalist and Spanish language tutor specializing in content for new immigrants in ${countryName}.
    Write a short newspaper-style article (about 150-200 words) about topics crucial for immigrants living in ${countryName}. Use an intermediate vocabulary level with some advanced terms that immigrants need to know.
    
    Choose from immigration-relevant topics such as:
    - Recent immigration policy changes or reforms
    - Cultural festivals and traditions immigrants should understand
    - Practical information about healthcare, education, or public services
    - Housing market and neighborhoods welcoming to immigrants
    - Labor market opportunities and professional requirements
    - Legal rights and responsibilities of residents/citizens
    - Integration programs and language learning resources
    - Success stories of immigrant communities
    - Important civic duties and community participation
    - Transportation, banking, or daily life essentials
    
    The article's title and its comprehension questions/answers must have both Spanish and English versions.
    The main content of the article must be an array of sentence objects, where each object contains the Spanish sentence and its English translation.
    Include 3-4 comprehension questions that test understanding of key immigration-related information.
    The tone should be informative, practical, and welcoming.

    Provide the response strictly in the specified JSON format.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            title: bilingualTextSchema,
            content: {
                type: Type.ARRAY,
                items: bilingualTextSchema,
            },
            questions: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: bilingualTextSchema,
                        answer: bilingualTextSchema,
                    },
                    required: ["question", "answer"],
                },
            },
        },
        required: ["title", "content", "questions"],
    };

    return generateContentWithSchema<Article>(prompt, schema);
    */
};

export const getNewsArticles = async (countryName: string): Promise<NewsArticle[]> => {
    const prompt = `You are a news curator and Spanish language tutor specializing in immigration preparation for ${countryName}.
    Generate 3 realistic current news articles from ${countryName} that would be relevant and helpful for immigrants preparing for interviews or citizenship tests.
    These articles should simulate what someone might be asked to read and discuss during an immigration interview in Panama-style format.
    
    Each article should:
    - Cover topics like: local government initiatives, cultural events, economic developments, immigration policies, public services, community programs, or national achievements
    - Be written in natural Spanish appropriate for ${countryName}'s dialect
    - Include a realistic source name (newspaper or media outlet common in ${countryName})
    - Have a recent date (within last 2 months)
    - Contain 8-12 sentences in the full text
    - Include 5-7 key vocabulary words that immigrants should understand, with context
    - Have 3-4 comprehension questions that test understanding like in an interview
    
    The articles should feel authentic and be at an intermediate Spanish level, helping immigrants practice reading and discussing current events.
    
    Provide the response strictly in the specified JSON format.`;

    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                title: bilingualTextSchema,
                source: { type: Type.STRING },
                date: { type: Type.STRING },
                summary: bilingualTextSchema,
                fullText: {
                    type: Type.ARRAY,
                    items: bilingualTextSchema,
                },
                keyVocabulary: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            spanish: { type: Type.STRING },
                            english: { type: Type.STRING },
                            context: { type: Type.STRING },
                        },
                        required: ["spanish", "english", "context"],
                    },
                },
                comprehensionQuestions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: bilingualTextSchema,
                            answer: bilingualTextSchema,
                        },
                        required: ["question", "answer"],
                    },
                },
            },
            required: ["title", "source", "date", "summary", "fullText", "keyVocabulary", "comprehensionQuestions"],
        },
    };

    return generateContentWithSchema<NewsArticle[]>(prompt, schema);
};

export const getSpeechAudio = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Puck' }, // Puck is a good Spanish voice
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data returned from API.");
        }
        return base64Audio;
    } catch (error: any) {
        console.error("Error fetching speech audio from Gemini API:", error);
        if (error.status === 429) {
            throw new Error("TTS temporarily unavailable due to rate limits. Please wait a moment.");
        }
        if (error.status === 400) {
            throw new Error("Audio generation not available for this model.");
        }
        throw new Error("TTS unavailable: " + (error.message || "Unknown error"));
    }
};


// --- Audio Utilities ---

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / 1; // 1 channel
  const buffer = ctx.createBuffer(1, frameCount, 24000); // 1 channel, 24000 sample rate

  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}


let audioContext: AudioContext | null = null;
const getAudioContext = (): AudioContext => {
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return audioContext;
};

export const playAudio = async (base64Audio: string) => {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }
        const decodedBytes = decode(base64Audio);
        const audioBuffer = await decodeAudioData(decodedBytes, ctx);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
    } catch (error) {
        console.error("Error playing audio:", error);
    }
};

// Convert numbers to Spanish words for better TTS pronunciation
const numberToSpanish = (text: string): string => {
    const numberMap: Record<string, string> = {
        '0': 'cero', '1': 'uno', '2': 'dos', '3': 'tres', '4': 'cuatro',
        '5': 'cinco', '6': 'seis', '7': 'siete', '8': 'ocho', '9': 'nueve',
        '10': 'diez', '11': 'once', '12': 'doce', '13': 'trece', '14': 'catorce',
        '15': 'quince', '16': 'dieciséis', '17': 'diecisiete', '18': 'dieciocho',
        '19': 'diecinueve', '20': 'veinte', '30': 'treinta', '40': 'cuarenta',
        '50': 'cincuenta', '100': 'cien', '1000': 'mil', '5000': 'cinco mil'
    };
    
    let result = text;
    // Replace numbers with word boundaries to avoid replacing parts of dates/years
    Object.entries(numberMap).forEach(([num, word]) => {
        const regex = new RegExp(`\\b${num}\\b`, 'g');
        result = result.replace(regex, word);
    });
    
    return result;
};

// Use Google Translate TTS - free and high quality

export interface PracticalKnowledgeSection {
    title: BilingualText;
    content: BilingualText;
    keyFacts: BilingualText[];
}

export interface PracticalKnowledge {
    sections: PracticalKnowledgeSection[];
}

export const getPracticalKnowledge = async (countryName: string): Promise<PracticalKnowledge> => {
    const prompt = `You are an expert on ${countryName} providing practical knowledge for Spanish-learning immigrants. Generate structured content in intermediate Spanish with English translations. Focus on immigration-relevant info: weather/climate, tourism/notable locations, historical figures/events, daily life tips.

Provide in JSON with sections (e.g., Weather, Tourism, History). Each section has:
- title: {spanish: "...", english: "..."}
- content: Short paragraph {spanish: "...", english: "..."}
- keyFacts: Array of bullet points {spanish: "...", english: "..."}

Keep content 100-200 words total, culturally sensitive, useful for integration.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            sections: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: bilingualTextSchema,
                        content: bilingualTextSchema,
                        keyFacts: {
                            type: Type.ARRAY,
                            items: bilingualTextSchema,
                        },
                    },
                    required: ['title', 'content', 'keyFacts'],
                },
            },
        },
        required: ['sections'],
    };

    return generateContentWithSchema<PracticalKnowledge>(prompt, schema);
};


export interface DialectVariation {
    category: BilingualText;
    spanishExample: string;
    englishExplanation: string;
    ttsAudio?: string;  // Optional for future Google Cloud TTS
}

export interface DialectGuide {
    introduction: BilingualText;
    variations: DialectVariation[];
    tips: BilingualText[];
}

export const getDialectGuide = async (countryName: string): Promise<DialectGuide> => {
    const prompt = `You are a Spanish dialect expert for immigrants to ${countryName}. Generate a guide on local Spanish variations (e.g., vocabulary, idioms, pronunciation) vs. standard Spanish. Focus on practical, immigration-relevant terms (e.g., bureaucracy, daily life, greetings).

Provide in JSON:
- introduction: Short bilingual paragraph {spanish: "...", english: "..."}
- variations: Array of {category: {spanish: "...", english: "..."}, spanishExample: "...", englishExplanation: "..."}
  Categories: Greetings, Food, Transportation, Official Terms, Slang.
- tips: Array of bilingual tips for integration.

Use intermediate level, 5-8 variations, culturally accurate.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            introduction: bilingualTextSchema,
            variations: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        category: bilingualTextSchema,
                        spanishExample: { type: Type.STRING },
                        englishExplanation: { type: Type.STRING },
                    },
                    required: ['category', 'spanishExample', 'englishExplanation'],
                },
            },
            tips: {
                type: Type.ARRAY,
                items: bilingualTextSchema,
            },
        },
        required: ['introduction', 'variations', 'tips'],
    };

    return generateContentWithSchema<DialectGuide>(prompt, schema);
};
export const speakText = (text: string, lang: string = 'es') => {
    try {
        // Convert numbers to Spanish words first
        const processedText = numberToSpanish(text);
        
        // Use Google Translate's unofficial TTS API
        // This provides much better quality than browser TTS
        const encodedText = encodeURIComponent(processedText);
        const audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodedText}`);
        
        audio.play().catch(error => {
            console.error('Error playing Google TTS audio:', error);
            // Fallback to browser TTS if Google fails
            fallbackBrowserTTS(processedText, lang);
        });
    } catch (error) {
        console.error('Error with Google TTS:', error);
        fallbackBrowserTTS(text, lang);
    }
};

// Fallback browser TTS (lower quality)
const fallbackBrowserTTS = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'es' ? 'es-ES' : lang;
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Wait for voices to load then pick the best Spanish voice
        const setVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            
            // Prioritize high-quality Spanish voices
            const preferredVoices = [
                'Google español',
                'Microsoft Helena - Spanish (Spain)',
                'Microsoft Laura - Spanish (Spain)', 
                'Monica',
                'Paulina',
                'es-ES',
                'es-MX'
            ];
            
            for (const preferred of preferredVoices) {
                const voice = voices.find(v => 
                    v.name.includes(preferred) || 
                    v.lang.includes('es-')
                );
                if (voice) {
                    utterance.voice = voice;
                    break;
                }
            }
        };
        
        if (window.speechSynthesis.getVoices().length > 0) {
            setVoice();
        } else {
            window.speechSynthesis.onvoiceschanged = setVoice;
        }
        
        window.speechSynthesis.speak(utterance);
    }
};
