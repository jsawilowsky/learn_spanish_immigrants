import React, { useState, useEffect } from 'react';
import { PracticalKnowledge as PracticalKnowledgeType, getPracticalKnowledge, speakText } from '../services/geminiService';

interface Props {
  markAsCompleted?: (module: string) => void;
  country: { name: string; flag: string };
}

const PracticalKnowledge: React.FC<Props> = ({ country }) => {
  const [content, setContent] = useState<PracticalKnowledgeType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getPracticalKnowledge(country.name);
        setContent(data);
      } catch (error) {
        console.error('Error loading practical knowledge:', error);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [country.name]);

  if (loading) {
    return <div className="text-center py-8">Loading practical knowledge for {country.name}...</div>;
  }

  if (!content) {
    return <div className="text-center py-8 text-red-400">Content not available yet.</div>;
  }

  const BilingualText = ({ text }: { text: { spanish: string; english: string } }) => (
    <div className="space-y-2 mb-4">
      <div className="flex justify-between">
        <div className="flex-1 pr-2">
          <h4 className="font-semibold text-sky-300">Español:</h4>
          <p className="text-sm">{text.spanish}</p>
        </div>
        <div className="flex-1 pl-2">
          <h4 className="font-semibold text-blue-300">English:</h4>
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

  const BilingualFact = ({ fact }: { fact: { spanish: string; english: string } }) => (
    <li key={fact.spanish} className="flex justify-between py-1">
      <span className="flex-1 pr-2 text-sm">{fact.spanish}</span>
      <span className="flex-1 pl-2 text-sm text-gray-300">({fact.english})</span>
    </li>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        {country.flag} Practical Knowledge for {country.name}
      </h2>
      {content.sections.map((section, idx) => (
        <section key={idx} className="bg-slate-700/50 p-4 rounded-lg">
          <BilingualText text={section.title} />
          <BilingualText text={section.content} />
          <div>
            <h5 className="font-semibold text-lg mb-2">Key Facts:</h5>
            <ul className="space-y-1">
              {section.keyFacts.map((fact, fidx) => <BilingualFact key={fidx} fact={fact} />)}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
};

export default PracticalKnowledge;
