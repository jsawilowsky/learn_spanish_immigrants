
import React, { useState, useEffect, useCallback } from 'react';
import { Country, InterviewQuestion } from '../types';
import { getInterviewQuestions } from '../services/geminiService';
import { TextToSpeechButton } from './Header';

interface InterviewPracticeProps {
  country: Country;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-400"></div>
    </div>
  );

const SentenceWithTTS: React.FC<{ text: string }> = ({ text }) => {
  // Simple sentence splitter
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  return (
    <>
      {sentences.map((sentence, index) => (
        <div key={index} className="flex items-start space-x-2 mb-1">
          <div className="pt-1">
            <TextToSpeechButton text={sentence} />
          </div>
          <span>{sentence}</span>
        </div>
      ))}
    </>
  );
};

const InterviewPractice: React.FC<InterviewPracticeProps> = ({ country }) => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleAnswer, setVisibleAnswer] = useState<number | null>(null);

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedQuestions = await getInterviewQuestions(country.name);
      setQuestions(fetchedQuestions);
    } catch (err) {
      setError('Failed to load interview questions. Please try selecting the country again.');
    } finally {
      setLoading(false);
    }
  }, [country.name]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const toggleAnswer = (index: number) => {
    setVisibleAnswer(visibleAnswer === index ? null : index);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-400">{error}</p>;

  return (
    <div>
      <h3 className="text-3xl font-bold text-sky-400 mb-2">Interview Practice</h3>
      <p className="text-slate-400 mb-6">Practice common interview questions. Click on a question to reveal a sample answer with translations and audio.</p>
      <div className="space-y-4">
        {questions.map((q, index) => (
          <div key={index} className="bg-slate-700/50 rounded-lg">
            <button
              onClick={() => toggleAnswer(index)}
              className="w-full text-left p-4 hover:bg-slate-700 rounded-lg transition-colors duration-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <TextToSpeechButton text={q.question.spanish} />
                    <span className="font-semibold text-lg">{q.question.spanish}</span>
                  </div>
                  <p className="text-slate-400 ml-9">{q.question.english}</p>
                </div>
                <span className={`transform transition-transform duration-300 ${visibleAnswer === index ? 'rotate-180' : 'rotate-0'}`}>
                  ▼
                </span>
              </div>
            </button>
            {visibleAnswer === index && (
              <div className="p-4 border-t border-slate-600 animate-fade-in">
                <p className="text-sky-300 font-semibold mb-2">Sample Answer:</p>
                <div className="text-slate-300 mb-3">
                  <SentenceWithTTS text={q.sampleAnswer.spanish} />
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                    <p className="text-sm font-semibold text-slate-400 mb-1">English Translation:</p>
                    <p className="text-sm text-slate-300 italic">{q.sampleAnswer.english}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewPractice;
