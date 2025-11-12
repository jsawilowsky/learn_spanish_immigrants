import React, { useState, useEffect, useCallback } from 'react';
import { Country, NewsArticle } from '../types';
import { getNewsArticles } from '../services/geminiService';
import { TextToSpeechButton } from './Header';

interface NewsReaderProps {
  country: Country;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-400"></div>
  </div>
);

const NewsReader: React.FC<NewsReaderProps> = ({ country }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleAnswers, setVisibleAnswers] = useState<boolean[]>([]);
  const [showVocabulary, setShowVocabulary] = useState<boolean>(false);

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedArticles = await getNewsArticles(country.name);
      setArticles(fetchedArticles);
      setSelectedArticle(fetchedArticles[0]);
      setVisibleAnswers(new Array(fetchedArticles[0]?.comprehensionQuestions.length || 0).fill(false));
      setShowVocabulary(false);
    } catch (err) {
      setError('Failed to load news articles. Please try selecting the country again.');
    } finally {
      setLoading(false);
    }
  }, [country.name]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const handleArticleSelect = (article: NewsArticle) => {
    setSelectedArticle(article);
    setVisibleAnswers(new Array(article.comprehensionQuestions.length).fill(false));
    setShowVocabulary(false);
  };

  const toggleAnswer = (index: number) => {
    setVisibleAnswers(prev => prev.map((v, i) => (i === index ? !v : v)));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-400">{error}</p>;
  if (!selectedArticle) return null;

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-sky-400 mb-4">
          📰 Current News from {country.flag} {country.name}
        </h3>
        <p className="text-slate-300 mb-4">
          Practice reading and discussing current events - a common requirement in immigration interviews, especially in Panama.
        </p>

        {/* Article selector tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {articles.map((article, index) => (
            <button
              key={index}
              onClick={() => handleArticleSelect(article)}
              className={`py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-300 ${
                selectedArticle === article
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Article {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Article metadata */}
      <div className="bg-slate-700/30 p-4 rounded-lg mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          <div>
            <p className="text-sm text-slate-400">Source: {selectedArticle.source}</p>
            <p className="text-xs text-slate-500">{selectedArticle.date}</p>
          </div>
          <button
            onClick={() => setShowVocabulary(!showVocabulary)}
            className="mt-2 sm:mt-0 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            {showVocabulary ? 'Hide' : 'Show'} Key Vocabulary
          </button>
        </div>

        {/* Title with TTS */}
        <div className="flex items-start space-x-2 mb-3">
          <TextToSpeechButton text={selectedArticle.title.spanish} />
          <div>
            <h4 className="text-2xl font-bold text-white">{selectedArticle.title.spanish}</h4>
            <p className="text-slate-400 italic">{selectedArticle.title.english}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="flex items-start space-x-2 bg-slate-800/50 p-3 rounded-lg">
          <TextToSpeechButton text={selectedArticle.summary.spanish} />
          <div>
            <p className="text-slate-200 font-semibold">{selectedArticle.summary.spanish}</p>
            <p className="text-sm text-slate-400 italic mt-1">{selectedArticle.summary.english}</p>
          </div>
        </div>
      </div>

      {/* Key Vocabulary Section */}
      {showVocabulary && (
        <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-4 mb-6 animate-fade-in">
          <h5 className="text-xl font-bold text-emerald-400 mb-3">📚 Key Vocabulary</h5>
          <div className="space-y-3">
            {selectedArticle.keyVocabulary.map((vocab, index) => (
              <div key={index} className="bg-slate-800/50 p-3 rounded-lg">
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="text-emerald-400 font-bold">{vocab.spanish}</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-300">{vocab.english}</span>
                </div>
                <p className="text-sm text-slate-400 italic ml-4">{vocab.context}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Article Text */}
      <div className="bg-slate-700/30 p-6 rounded-lg mb-6">
        <h5 className="text-xl font-bold mb-4 flex items-center">
          <span className="text-sky-400">📄 Full Article</span>
          <span className="ml-2 text-xs text-slate-500">(Read aloud for practice)</span>
        </h5>
        <div className="space-y-4">
          {selectedArticle.fullText.map((sentence, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="pt-1">
                <TextToSpeechButton text={sentence.spanish} />
              </div>
              <div>
                <p className="text-slate-200 leading-relaxed">{sentence.spanish}</p>
                <p className="text-sm text-slate-400 italic mt-1">{sentence.english}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comprehension Questions */}
      <div className="bg-slate-700/30 p-6 rounded-lg mb-6">
        <h5 className="text-xl font-bold text-sky-400 mb-4">
          🎯 Interview-Style Comprehension Questions
        </h5>
        <p className="text-sm text-slate-400 mb-4">
          Practice answering these questions as if you're in an immigration interview.
        </p>
        <div className="space-y-4">
          {selectedArticle.comprehensionQuestions.map((q, index) => (
            <div key={index} className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-start space-x-2 mb-2">
                <TextToSpeechButton text={q.question.spanish} />
                <div>
                  <p className="font-semibold text-lg text-white">{q.question.spanish}</p>
                  <p className="text-sm text-slate-400 mt-1">{q.question.english}</p>
                </div>
              </div>

              {!visibleAnswers[index] ? (
                <button
                  onClick={() => toggleAnswer(index)}
                  className="text-sm font-semibold text-sky-400 hover:text-sky-300 ml-9 mt-2"
                >
                  Show Answer
                </button>
              ) : (
                <div className="ml-9 mt-3 animate-fade-in border-l-2 border-emerald-500 pl-4">
                  <div className="flex items-start space-x-2">
                    <TextToSpeechButton text={q.answer.spanish} />
                    <div>
                      <p className="font-bold text-emerald-400">{q.answer.spanish}</p>
                      <p className="text-sm text-slate-300 italic mt-1">{q.answer.english}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reload button */}
      <div className="text-center">
        <button
          onClick={loadNews}
          className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Generate New News Articles
        </button>
      </div>
    </div>
  );
};

export default NewsReader;
