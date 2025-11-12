
import React, { useState } from 'react';
import { getSpeechAudio, playAudio } from '../services/geminiService';
import { PlayIcon, AudioLoadingIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-4xl mx-auto text-center mb-8 sm:mb-12">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-500">
        Immigrant's Spanish Guide
      </h1>
      <p className="text-slate-400 mt-2 text-lg">
        Your personalized path to language and civics mastery.
      </p>
    </header>
  );
};

export default Header;


interface TextToSpeechButtonProps {
  text: string;
}

export const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({ text }) => {
  // TTS removed - Gemini models with audio modality not available with free API key
  // Google AI Studio uses different infrastructure not accessible via API
  return null;
};
