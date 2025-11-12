
export interface BilingualText {
  spanish: string;
  english: string;
}

export interface BilingualSentence {
  spanish: string;
  english: string;
}

export interface Country {
  name: string;
  flag: string;
}

export enum LearningModuleType {
  Civics = 'Civics Quiz',
  Interview = 'Interview Practice',
  Reading = 'Reading Comprehension',
}

export interface QuizQuestion {
  question: BilingualText;
  options: BilingualText[];
  correctAnswer: BilingualText;
}

export interface InterviewQuestion {
  question: BilingualText;
  sampleAnswer: BilingualText;
}

export interface Article {
  title: BilingualText;
  content: BilingualSentence[];
  questions: {
    question: BilingualText;
    answer: BilingualText;
  }[];
}

export interface NewsArticle {
  title: BilingualText;
  source: string;
  date: string;
  summary: BilingualText;
  fullText: BilingualSentence[];
  keyVocabulary: {
    spanish: string;
    english: string;
    context: string;
  }[];
  comprehensionQuestions: {
    question: BilingualText;
    answer: BilingualText;
  }[];
}
