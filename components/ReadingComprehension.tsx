
import React, { useState, useEffect, useCallback } from 'react';
import { Country, Article } from '../types';
import { getReadingArticle } from '../services/geminiService';
import { TextToSpeechButton } from './Header';

interface ReadingComprehensionProps {
  country: Country;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-400"></div>
    </div>
  );

const ReadingComprehension: React.FC<ReadingComprehensionProps> = ({ country }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleAnswers, setVisibleAnswers] = useState<boolean[]>([]);

  const loadArticle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedArticle = await getReadingArticle(country.name);
      setArticle(fetchedArticle);
      setVisibleAnswers(new Array(fetchedArticle.questions.length).fill(false));
    } catch (err) {
      setError('Failed to load the article. Please try selecting the country again.');
    } finally {
      setLoading(false);
    }
  }, [country.name]);
  
  useEffect(() => {
    loadArticle();
  }, [loadArticle]);
  
  const toggleAnswer = (index: number) => {
    setVisibleAnswers(prev => prev.map((v, i) => (i === index ? !v : v)));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-400">{error}</p>;
  if (!article) return null;

  return (
    <div>
        <div className="flex items-center space-x-2 mb-2">
            <TextToSpeechButton text={article.title.spanish} />
            <h3 className="text-3xl font-bold text-sky-400">{article.title.spanish}</h3>
        </div>
        <p className="text-slate-400 mb-6 ml-9">{article.title.english}</p>
      
      <article className="space-y-4 bg-slate-700/30 p-4 sm:p-6 rounded-lg mb-8">
        {article.content.map((sentence, index) => (
          <div key={index} className="flex items-start space-x-2">
             <div className="pt-1">
                <TextToSpeechButton text={sentence.spanish} />
             </div>
            <div>
                <p className="text-slate-200">{sentence.spanish}</p>
                <p className="text-sm text-slate-400 italic">{sentence.english}</p>
            </div>
          </div>
        ))}
      </article>

      <h4 className="text-2xl font-bold mb-4">Comprehension Questions</h4>
      <div className="space-y-4">
        {article.questions.map((q, index) => (
          <div key={index} className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
                <TextToSpeechButton text={q.question.spanish} />
                <p className="font-semibold text-lg">{q.question.spanish}</p>
            </div>
            <p className="text-sm text-slate-400 mb-3 ml-9">{q.question.english}</p>
            
            {!visibleAnswers[index] ? (
              <button
                onClick={() => toggleAnswer(index)}
                className="text-sm font-semibold text-sky-400 hover:text-sky-300 ml-9"
              >
                Show Answer
              </button>
            ) : (
                <div className="ml-9 animate-fade-in border-l-2 border-emerald-500 pl-4">
                    <div className="flex items-center space-x-2">
                       <TextToSpeechButton text={q.answer.spanish} />
                       <p className="font-bold text-emerald-400">{q.answer.spanish}</p>
                    </div>
                    <p className="text-sm text-slate-300 italic">{q.answer.english}</p>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadingComprehension;
