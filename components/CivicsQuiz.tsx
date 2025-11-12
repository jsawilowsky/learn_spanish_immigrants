
import React, { useState, useEffect, useCallback } from 'react';
import { Country, QuizQuestion, BilingualText } from '../types';
import { getCivicsQuiz } from '../services/geminiService';
import { TextToSpeechButton } from './Header';

interface CivicsQuizProps {
  country: Country;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-400"></div>
  </div>
);

const CivicsQuiz: React.FC<CivicsQuizProps> = ({ country }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<BilingualText | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedQuestions = await getCivicsQuiz(country.name);
      // Shuffle the options for each question to randomize answer positions
      const shuffledQuestions = fetchedQuestions.map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));
      setQuestions(shuffledQuestions);
    } catch (err) {
      setError('Failed to load quiz questions. Please try selecting the country again.');
    } finally {
      setLoading(false);
    }
  }, [country.name]);
  
  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleAnswerSelect = (answer: BilingualText) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const correct = answer.spanish === questions[currentQuestionIndex].correctAnswer.spanish;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setQuizFinished(true);
    }
  };
  
  const handleRestart = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setQuizFinished(false);
    loadQuestions();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-400">{error}</p>;
  if (quizFinished) {
    return (
      <div className="text-center">
        <h3 className="text-3xl font-bold text-sky-400 mb-4">Quiz Complete!</h3>
        <p className="text-xl mb-6">Your score: <span className="font-bold text-white">{score}</span> out of <span className="font-bold text-white">{questions.length}</span></p>
        <button
          onClick={handleRestart}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <div className="mb-4">
        <p className="text-slate-400 text-sm">Question {currentQuestionIndex + 1} of {questions.length}</p>
        <div className="w-full bg-slate-700 rounded-full h-2.5 mt-1">
          <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <TextToSpeechButton text={currentQuestion.question.spanish} />
        <h3 className="text-2xl font-semibold">{currentQuestion.question.spanish}</h3>
      </div>
      <p className="text-slate-400 mb-6 ml-9">{currentQuestion.question.english}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer?.spanish === option.spanish;
          const isCorrectOption = option.spanish === currentQuestion.correctAnswer.spanish;
          let buttonClass = 'bg-slate-700 hover:bg-slate-600';
          if (selectedAnswer) {
            if (isSelected && isCorrect) {
              buttonClass = 'bg-emerald-600';
            } else if (isSelected && !isCorrect) {
              buttonClass = 'bg-red-600';
            } else if (isCorrectOption) {
              buttonClass = 'bg-emerald-600';
            } else {
              buttonClass = 'bg-slate-700 opacity-60';
            }
          }
          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={!!selectedAnswer}
              className={`p-4 rounded-lg text-left transition-all duration-300 w-full ${buttonClass}`}
            >
              <div className="flex items-center space-x-2">
                <TextToSpeechButton text={option.spanish} />
                <div>
                    <span className="font-medium">{option.spanish}</span>
                    <span className="block text-sm text-slate-300 opacity-80">{option.english}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {selectedAnswer && (
        <div className="mt-6 text-center">
            <button
                onClick={handleNextQuestion}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
            >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
        </div>
      )}
    </div>
  );
};

export default CivicsQuiz;
