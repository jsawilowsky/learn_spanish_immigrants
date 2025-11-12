import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CountrySelector from './components/CountrySelector';
import CivicsQuiz from './components/CivicsQuiz';
import ReadingComprehension from './components/ReadingComprehension';
import InterviewPractice from './components/InterviewPractice';
import NewsReader from './components/NewsReader';
import PracticalKnowledge from './components/PracticalKnowledge';
import DialectGuide from './components/DialectGuide';

interface Country {
  name: string;
  flag: string;
}

import { COUNTRIES } from './constants';

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [currentModule, setCurrentModule] = useState('Civics Quiz');
  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    const key = `completedModules_${selectedCountry?.name || 'general'}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  });

  const moduleTabs = [
    { name: 'Civics Quiz', icon: () => <span className="w-5 h-5">🛡️</span> },
    { name: 'Reading Comprehension', icon: () => <span className="w-5 h-5">📖</span> },
    { name: 'Interview Practice', icon: () => <span className="w-5 h-5">🎤</span> },
    { name: 'News Reader', icon: () => <span className="w-5 h-5">📰</span> },
    { name: 'Practical Knowledge', icon: () => <span className="w-5 h-5">🏢</span> },
    { name: 'Dialect Guide', icon: () => <span className="w-5 h-5">🌍</span> },
  ];

  useEffect(() => {
    if (selectedCountry) {
      const key = `completedModules_${selectedCountry.name}`;
      localStorage.setItem(key, JSON.stringify(completedModules));
    }
  }, [completedModules, selectedCountry]);

  const markAsCompleted = (moduleName: string) => {
    if (!completedModules.includes(moduleName)) {
      setCompletedModules(prev => [...prev, moduleName]);
    }
  };

  const progressPercentage = selectedCountry ? (completedModules.length / moduleTabs.length) * 100 : 0;

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setCurrentModule('Civics Quiz');
  };

  const handleReset = () => {
    setSelectedCountry(null);
    setCompletedModules([]);
  };

  const CurrentModuleComponent = useMemo(() => {
    if (!selectedCountry) return null;
    switch (currentModule) {
      case 'Civics Quiz':
        return <CivicsQuiz key={selectedCountry.name} country={selectedCountry} markAsCompleted={markAsCompleted} completedModules={completedModules} />;
      case 'Reading Comprehension':
        return <ReadingComprehension key={selectedCountry.name} country={selectedCountry} markAsCompleted={markAsCompleted} completedModules={completedModules} />;
      case 'Interview Practice':
        return <InterviewPractice key={selectedCountry.name} country={selectedCountry} markAsCompleted={markAsCompleted} completedModules={completedModules} />;
      case 'News Reader':
        return <NewsReader key={selectedCountry.name} country={selectedCountry} markAsCompleted={markAsCompleted} completedModules={completedModules} />;
      case 'Practical Knowledge':
        return <PracticalKnowledge key={selectedCountry.name} country={selectedCountry} markAsCompleted={markAsCompleted} completedModules={completedModules} />;
      case 'Dialect Guide':
        return <DialectGuide key={selectedCountry.name} country={selectedCountry} markAsCompleted={markAsCompleted} completedModules={completedModules} />;
      default:
        return null;
    }
  }, [currentModule, selectedCountry, completedModules, markAsCompleted]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header progress={progressPercentage} />
      <main className="w-full max-w-4xl mx-auto flex-grow">
        {!selectedCountry ? (
          <div className="text-center mt-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-sky-400 mb-4">Welcome!</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Start your journey by selecting a country. We'll tailor the Spanish lessons and civics content specifically for you.
            </p>
            <CountrySelector countries={COUNTRIES} onSelectCountry={handleCountrySelect} />
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-slate-800/50 p-4 rounded-xl">
              <h2 className="text-2xl font-bold">
                Learning for: <span className="text-sky-400">{selectedCountry.flag} {selectedCountry.name}</span>
              </h2>
              <button
                onClick={handleReset}
                className="mt-3 sm:mt-0 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Change Country
              </button>
            </div>

            <div className="mb-6">
              <div className="flex space-x-2 sm:space-x-4 border-b border-slate-700 flex-wrap">
                {moduleTabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setCurrentModule(tab.name)}
                    className={`flex items-center space-x-2 py-3 px-4 font-semibold text-sm sm:text-base transition-colors duration-300 ${
                      currentModule === tab.name
                        ? 'border-b-2 border-sky-400 text-sky-400'
                        : 'text-slate-400 hover:text-sky-300'
                    }`}
                  >
                    <tab.icon />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl shadow-2xl p-4 sm:p-8">
              {CurrentModuleComponent}
            </div>
          </div>
        )}
      </main>
      <footer className="w-full max-w-4xl mx-auto text-center text-slate-500 py-6 mt-8">
        <p>&copy; {new Date().getFullYear()} Immigrant's Spanish Guide. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
