import React, { useState, useEffect } from 'react';
import { DialectGuide as DialectGuideType, getDialectGuide, speakText } from '../services/geminiService';

interface Props {
  markAsCompleted?: (module: string) => void;
  completedModules?: string[];
  country: { name: string; flag: string };
}

const DialectGuide: React.FC<Props> = ({ country }) => {
  const [content, setContent] = useState<DialectGuideType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getDialectGuide(country.name);
        setContent(data);
      } catch (error) {
        console.error('Error loading dialect guide:', error);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [country.name]);

  if (loading) {
    return <div className="text-center py-8">Loading dialect guide for {country.name}...</div>;
  }

  if (!content) {
    return <div className="text-center py-8 text-red-400">Content not available yet.</div>;
  }

  const BilingualText = ({ text, title }: { text: { spanish: string; english: string }; title?: string }) => (
    <div className="space-y-2 mb-4">
      {title && <h4 className="font-semibold text-sky-300">{title}</h4>}
      <div className="flex justify-between">
        <div className="flex-1 pr-2">
          <h5 className="font-semibold text-sm">Español:</h5>
          <p className="text-sm">{text.spanish}</p>
        </div>
        <div className="flex-1 pl-2">
          <h5 className="font-semibold text-sm">English:</h5>
          <p className="text-sm">{text.english}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => speakText(text.spanish, 'es')}
          className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs"
        >
          🔊 Español
        </button>
        <button
          onClick={() => speakText(text.english, 'en')}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs"
        >
          🔊 English
        </button>
      </div>
    </div>
  );

  const DialectVariation = ({ variation }: { variation: { category: { spanish: string; english: string }; spanishExample: string; englishExplanation: string } }) => (
    <div className="bg-slate-700/50 p-3 rounded-lg mb-4">
      <BilingualText text={variation.category} title="Category" />
      <div className="ml-4">
        <p className="font-semibold mb-1">Ejemplo en Español: <span className="text-green-400">{variation.spanishExample}</span></p>
        <p className="text-gray-300 mb-2">Explanation: {variation.englishExplanation}</p>
        <button
          onClick={() => speakText(variation.spanishExample, 'es')}
          className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs"
        >
          🔊 Play Example
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        {country.flag} Dialect Guide for {country.name}
      </h2>
      <BilingualText text={content.introduction} />
      <section>
        <h3 className="text-xl font-semibold mb-4">Variations</h3>
        {content.variations.map((variation, idx) => (
          <DialectVariation key={idx} variation={variation} />
        ))}
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-4">Tips for Integration</h3>
        {content.tips.map((tip, idx) => (
          <BilingualText key={idx} text={tip} />
        ))}
      </section>
    </div>
  );
};

export default DialectGuide;
