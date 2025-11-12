// Simple static content generator - no API calls
import fs from 'fs';

const countries = [
  { name: 'Mexico', flag: '🇲🇽' },
  { name: 'Panama', flag: '🇵🇦' },
  { name: 'Paraguay', flag: '🇵🇾' },
  { name: 'Argentina', flag: '🇦🇷' },
  { name: 'Colombia', flag: '🇨🇴' },
  { name: 'Peru', flag: '🇵🇪' },
  { name: 'Chile', flag: '🇨🇱' },
  { name: 'Ecuador', flag: '🇪🇨' },
];

// Sample static content for Panama
const panamaContent = {
  civicsQuiz: [
    {
      question: { 
        spanish: "¿Cuándo celebra Panamá su Día de la Independencia de Colombia?", 
        english: "When does Panama celebrate its Independence Day from Colombia?" 
      },
      options: [
        { spanish: "3 de noviembre", english: "November 3rd" },
        { spanish: "28 de noviembre", english: "November 28th" },
        { spanish: "15 de septiembre", english: "September 15th" },
        { spanish: "20 de diciembre", english: "December 20th" }
      ],
      correctAnswer: { spanish: "3 de noviembre", english: "November 3rd" }
    },
    {
      question: { 
        spanish: "¿Cuáles son los tres poderes del gobierno panameño?", 
        english: "What are the three branches of the Panamanian government?" 
      },
      options: [
        { spanish: "Ejecutivo, Legislativo y Judicial", english: "Executive, Legislative and Judicial" },
        { spanish: "Presidente, Congreso y Policía", english: "President, Congress and Police" },
        { spanish: "Federal, Estatal y Municipal", english: "Federal, State and Municipal" },
        { spanish: "Civil, Militar y Religioso", english: "Civil, Military and Religious" }
      ],
      correctAnswer: { spanish: "Ejecutivo, Legislativo y Judicial", english: "Executive, Legislative and Judicial" }
    },
    {
      question: { 
        spanish: "¿Cuál es la capital de Panamá?", 
        english: "What is the capital of Panama?" 
      },
      options: [
        { spanish: "Ciudad de Panamá", english: "Panama City" },
        { spanish: "Colón", english: "Colón" },
        { spanish: "David", english: "David" },
        { spanish: "Chitré", english: "Chitré" }
      ],
      correctAnswer: { spanish: "Ciudad de Panamá", english: "Panama City" }
    },
    {
      question: { 
        spanish: "¿Cuántas provincias tiene Panamá?", 
        english: "How many provinces does Panama have?" 
      },
      options: [
        { spanish: "10 provincias", english: "10 provinces" },
        { spanish: "7 provincias", english: "7 provinces" },
        { spanish: "15 provincias", english: "15 provinces" },
        { spanish: "5 provincias", english: "5 provinces" }
      ],
      correctAnswer: { spanish: "10 provincias", english: "10 provinces" }
    },
    {
      question: { 
        spanish: "¿Qué símbolo nacional representa el Canal de Panamá?", 
        english: "What national symbol represents the Panama Canal?" 
      },
      options: [
        { spanish: "Es una maravilla de ingeniería moderna", english: "It is a modern engineering marvel" },
        { spanish: "Es parte del escudo nacional", english: "It is part of the national coat of arms" },
        { spanish: "Es la bandera nacional", english: "It is the national flag" },
        { spanish: "Es el himno nacional", english: "It is the national anthem" }
      ],
      correctAnswer: { spanish: "Es una maravilla de ingeniería moderna", english: "It is a modern engineering marvel" }
    }
  ],
  interviewQuestions: [
    {
      question: { 
        spanish: "¿Por qué desea emigrar a Panamá?", 
        english: "Why do you want to immigrate to Panama?" 
      },
      sampleAnswer: { 
        spanish: "Deseo emigrar a Panamá porque es un país con grandes oportunidades económicas, tiene un sistema de salud excelente, y la gente es muy acogedora. Me interesa trabajar en el sector de servicios financieros y contribuir al desarrollo del país.", 
        english: "I want to immigrate to Panama because it is a country with great economic opportunities, has an excellent healthcare system, and the people are very welcoming. I am interested in working in the financial services sector and contributing to the country's development." 
      }
    },
    {
      question: { 
        spanish: "¿Cuál es su nivel de español?", 
        english: "What is your level of Spanish?" 
      },
      sampleAnswer: { 
        spanish: "Mi nivel de español es intermedio. Puedo mantener conversaciones cotidianas, leer periódicos y entender noticias. Estoy tomando clases adicionales para mejorar mi fluidez y vocabulario profesional.", 
        english: "My Spanish level is intermediate. I can maintain everyday conversations, read newspapers and understand news. I am taking additional classes to improve my fluency and professional vocabulary." 
      }
    },
    {
      question: { 
        spanish: "¿Tiene familiares en Panamá?", 
        english: "Do you have family in Panama?" 
      },
      sampleAnswer: { 
        spanish: "No tengo familiares directos en Panamá, pero tengo varios amigos que viven allí y me han hablado muy bien del país. También he visitado Panamá dos veces como turista.", 
        english: "I don't have direct family in Panama, but I have several friends who live there and have spoken highly of the country. I have also visited Panama twice as a tourist." 
      }
    },
    {
      question: { 
        spanish: "¿Qué sabe sobre la cultura panameña?", 
        english: "What do you know about Panamanian culture?" 
      },
      sampleAnswer: { 
        spanish: "Sé que Panamá tiene una rica herencia cultural que mezcla influencias indígenas, españolas y afrocaribeñas. Conozco el folclore como el tamborito y la pollera. También sé que el país es muy diverso y cosmopolita debido al Canal de Panamá.", 
        english: "I know that Panama has a rich cultural heritage that mixes indigenous, Spanish and Afro-Caribbean influences. I know folklore like the tamborito and the pollera. I also know that the country is very diverse and cosmopolitan due to the Panama Canal." 
      }
    },
    {
      question: { 
        spanish: "¿Cómo planea mantenerse económicamente en Panamá?", 
        english: "How do you plan to support yourself financially in Panama?" 
      },
      sampleAnswer: { 
        spanish: "Tengo una oferta de trabajo como analista financiero en una empresa internacional con sede en Ciudad de Panamá. También tengo ahorros suficientes para los primeros seis meses mientras me establezco.", 
        english: "I have a job offer as a financial analyst at an international company based in Panama City. I also have enough savings for the first six months while I get established." 
      }
    }
  ],
  readingArticle: {
    title: { 
      spanish: "Panamá Lanza Nuevo Programa de Integración para Inmigrantes", 
      english: "Panama Launches New Integration Program for Immigrants" 
    },
    content: [
      { spanish: "El gobierno de Panamá ha anunciado un nuevo programa de integración diseñado para ayudar a los inmigrantes a adaptarse a la vida en el país.", english: "The government of Panama has announced a new integration program designed to help immigrants adapt to life in the country." },
      { spanish: "El programa incluye clases gratuitas de español, talleres sobre cultura panameña y asistencia para encontrar empleo.", english: "The program includes free Spanish classes, workshops on Panamanian culture, and assistance in finding employment." },
      { spanish: "Según la ministra de Gobierno, María Rodríguez, el objetivo es facilitar la integración de los nuevos residentes.", english: "According to the Minister of Government, María Rodríguez, the goal is to facilitate the integration of new residents." },
      { spanish: "Las clases de español se ofrecerán en varios centros comunitarios en Ciudad de Panamá y otras provincias.", english: "Spanish classes will be offered at several community centers in Panama City and other provinces." },
      { spanish: "Los talleres culturales cubrirán temas como la historia de Panamá, tradiciones locales y el sistema legal.", english: "Cultural workshops will cover topics such as Panama's history, local traditions, and the legal system." },
      { spanish: "El programa también conectará a los inmigrantes con empresas que buscan trabajadores calificados.", english: "The program will also connect immigrants with companies looking for skilled workers." },
      { spanish: "Se espera que más de 5,000 personas participen en el programa durante el primer año.", english: "More than 5,000 people are expected to participate in the program during the first year." },
      { spanish: "Los interesados pueden registrarse en línea o visitar las oficinas de migración.", english: "Those interested can register online or visit immigration offices." }
    ],
    questions: [
      {
        question: { spanish: "¿Qué incluye el nuevo programa de integración?", english: "What does the new integration program include?" },
        answer: { spanish: "Incluye clases gratuitas de español, talleres sobre cultura panameña y asistencia para encontrar empleo.", english: "It includes free Spanish classes, workshops on Panamanian culture, and assistance in finding employment." }
      },
      {
        question: { spanish: "¿Cuál es el objetivo del programa según la ministra?", english: "What is the goal of the program according to the minister?" },
        answer: { spanish: "El objetivo es facilitar la integración de los nuevos residentes.", english: "The goal is to facilitate the integration of new residents." }
      },
      {
        question: { spanish: "¿Cuántas personas se espera que participen en el primer año?", english: "How many people are expected to participate in the first year?" },
        answer: { spanish: "Se espera que más de 5,000 personas participen.", english: "More than 5,000 people are expected to participate." }
      }
    ]
  }
};

// Write Panama content
fs.writeFileSync(
  './public/data/panama.json',
  JSON.stringify(panamaContent, null, 2)
);

console.log('✅ Generated content for Panama');
