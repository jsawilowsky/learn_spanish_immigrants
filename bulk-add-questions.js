const fs = require('fs');

// Questions templates for different countries
const colombiaQuestions = [
  {
    question: { spanish: "¿Quién fue Simón Bolívar?", english: "Who was Simón Bolívar?" },
    options: [
      { spanish: "El Libertador de varios países sudamericanos", english: "The Liberator of several South American countries" },
      { spanish: "Un cantante famoso", english: "A famous singer" },
      { spanish: "Un futbolista", english: "A football player" },
      { spanish: "Un poeta", english: "A poet" }
    ],
    correctAnswer: { spanish: "El Libertador de varios países sudamericanos", english: "The Liberator of several South American countries" }
  },
  {
    question: { spanish: "¿Cuál es la moneda de Colombia?", english: "What is Colombia's currency?" },
    options: [
      { spanish: "Peso colombiano", english: "Colombian Peso" },
      { spanish: "Bolívar", english: "Bolívar" },
      { spanish: "Dólar", english: "Dollar" },
      { spanish: "Sol", english: "Sol" }
    ],
    correctAnswer: { spanish: "Peso colombiano", english: "Colombian Peso" }
  },
  {
    question: { spanish: "¿Qué colores tiene la bandera de Colombia?", english: "What colors does Colombia's flag have?" },
    options: [
      { spanish: "Amarillo, azul y rojo", english: "Yellow, blue and red" },
      { spanish: "Verde, blanco y rojo", english: "Green, white and red" },
      { spanish: "Azul, blanco y rojo", english: "Blue, white and red" },
      { spanish: "Rojo y amarillo", english: "Red and yellow" }
    ],
    correctAnswer: { spanish: "Amarillo, azul y rojo", english: "Yellow, blue and red" }
  },
  {
    question: { spanish: "¿Cuántos departamentos tiene Colombia?", english: "How many departments does Colombia have?" },
    options: [
      { spanish: "32 departamentos y un Distrito Capital", english: "32 departments and one Capital District" },
      { spanish: "25 departamentos", english: "25 departments" },
      { spanish: "40 departamentos", english: "40 departments" },
      { spanish: "20 departamentos", english: "20 departments" }
    ],
    correctAnswer: { spanish: "32 departamentos y un Distrito Capital", english: "32 departments and one Capital District" }
  },
  {
    question: { spanish: "¿Cuál es el período presidencial en Colombia?", english: "What is the presidential term in Colombia?" },
    options: [
      { spanish: "4 años", english: "4 years" },
      { spanish: "6 años", english: "6 years" },
      { spanish: "5 años", english: "5 years" },
      { spanish: "3 años", english: "3 years" }
    ],
    correctAnswer: { spanish: "4 años", english: "4 years" }
  },
  {
    question: { spanish: "¿Qué océano bordea a Colombia?", english: "What ocean borders Colombia?" },
    options: [
      { spanish: "Océano Pacífico y Mar Caribe", english: "Pacific Ocean and Caribbean Sea" },
      { spanish: "Solo Océano Atlántico", english: "Only Atlantic Ocean" },
      { spanish: "Solo Océano Pacífico", english: "Only Pacific Ocean" },
      { spanish: "Océano Índico", english: "Indian Ocean" }
    ],
    correctAnswer: { spanish: "Océano Pacífico y Mar Caribe", english: "Pacific Ocean and Caribbean Sea" }
  },
  {
    question: { spanish: "¿En qué año se independizó Colombia?", english: "In what year did Colombia gain independence?" },
    options: [
      { spanish: "1810", english: "1810" },
      { spanish: "1819", english: "1819" },
      { spanish: "1825", english: "1825" },
      { spanish: "1776", english: "1776" }
    ],
    correctAnswer: { spanish: "1810", english: "1810" }
  },
  {
    question: { spanish: "¿Cuál es la bebida típica de Colombia?", english: "What is the typical drink of Colombia?" },
    options: [
      { spanish: "Café colombiano", english: "Colombian coffee" },
      { spanish: "Tequila", english: "Tequila" },
      { spanish: "Pisco", english: "Pisco" },
      { spanish: "Mate", english: "Mate" }
    ],
    correctAnswer: { spanish: "Café colombiano", english: "Colombian coffee" }
  },
  {
    question: { spanish: "¿Cuál es el himno nacional de Colombia?", english: "What is Colombia's national anthem?" },
    options: [
      { spanish: "Himno Nacional de la República de Colombia (Oh gloria inmarcesible)", english: "National Anthem of the Republic of Colombia (Oh unfading glory)" },
      { spanish: "Colombia tierra querida", english: "Colombia beloved land" },
      { spanish: "Cali Pachanguero", english: "Cali Pachanguero" },
      { spanish: "La pollera colorá", english: "La pollera colorá" }
    ],
    correctAnswer: { spanish: "Himno Nacional de la República de Colombia (Oh gloria inmarcesible)", english: "National Anthem of the Republic of Colombia (Oh unfading glory)" }
  },
  {
    question: { spanish: "¿Qué país NO limita con Colombia?", english: "Which country does NOT border Colombia?" },
    options: [
      { spanish: "Argentina", english: "Argentina" },
      { spanish: "Venezuela", english: "Venezuela" },
      { spanish: "Brasil", english: "Brazil" },
      { spanish: "Perú", english: "Peru" }
    ],
    correctAnswer: { spanish: "Argentina", english: "Argentina" }
  },
  {
    question: { spanish: "¿Cuántas cámaras tiene el Congreso de Colombia?", english: "How many chambers does Colombia's Congress have?" },
    options: [
      { spanish: "Dos: Cámara de Representantes y Senado", english: "Two: Chamber of Representatives and Senate" },
      { spanish: "Una sola cámara", english: "Only one chamber" },
      { spanish: "Tres cámaras", english: "Three chambers" },
      { spanish: "Cuatro cámaras", english: "Four chambers" }
    ],
    correctAnswer: { spanish: "Dos: Cámara de Representantes y Senado", english: "Two: Chamber of Representatives and Senate" }
  },
  {
    question: { spanish: "¿Qué escritor colombiano ganó el Premio Nobel?", english: "Which Colombian writer won the Nobel Prize?" },
    options: [
      { spanish: "Gabriel García Márquez", english: "Gabriel García Márquez" },
      { spanish: "Jorge Luis Borges", english: "Jorge Luis Borges" },
      { spanish: "Pablo Neruda", english: "Pablo Neruda" },
      { spanish: "Octavio Paz", english: "Octavio Paz" }
    ],
    correctAnswer: { spanish: "Gabriel García Márquez", english: "Gabriel García Márquez" }
  },
  {
    question: { spanish: "¿Cuál es el deporte más popular en Colombia?", english: "What is the most popular sport in Colombia?" },
    options: [
      { spanish: "Fútbol", english: "Football (Soccer)" },
      { spanish: "Ciclismo", english: "Cycling" },
      { spanish: "Béisbol", english: "Baseball" },
      { spanish: "Tenis", english: "Tennis" }
    ],
    correctAnswer: { spanish: "Fútbol", english: "Football (Soccer)" }
  },
  {
    question: { spanish: "¿Cuál es la zona cafetera de Colombia?", english: "What is the coffee region of Colombia?" },
    options: [
      { spanish: "Eje Cafetero (Caldas, Risaralda, Quindío)", english: "Coffee Axis (Caldas, Risaralda, Quindío)" },
      { spanish: "La Costa Caribe", english: "The Caribbean Coast" },
      { spanish: "La Amazonía", english: "The Amazon" },
      { spanish: "Los Llanos Orientales", english: "The Eastern Plains" }
    ],
    correctAnswer: { spanish: "Eje Cafetero (Caldas, Risaralda, Quindío)", english: "Coffee Axis (Caldas, Risaralda, Quindío)" }
  },
  {
    question: { spanish: "¿Qué música tradicional es famosa en Colombia?", english: "What traditional music is famous in Colombia?" },
    options: [
      { spanish: "Cumbia y vallenato", english: "Cumbia and vallenato" },
      { spanish: "Tango", english: "Tango" },
      { spanish: "Mariachi", english: "Mariachi" },
      { spanish: "Samba", english: "Samba" }
    ],
    correctAnswer: { spanish: "Cumbia y vallenato", english: "Cumbia and vallenato" }
  }
];

console.log('Colombia questions generated:', colombiaQuestions.length);
console.log('Run this script with node to generate question templates');
