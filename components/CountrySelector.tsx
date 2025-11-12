
import React from 'react';
import { Country } from '../types';

interface CountrySelectorProps {
  countries: Country[];
  onSelectCountry: (country: Country) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ countries, onSelectCountry }) => {
  return (
    <div className="max-w-md mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {countries.map((country) => (
            <button
                key={country.name}
                onClick={() => onSelectCountry(country)}
                className="group flex flex-col items-center p-4 bg-slate-800 rounded-lg shadow-md hover:bg-sky-500/20 hover:scale-105 transform transition-all duration-300"
            >
                <span 
                  className="text-6xl mb-2 group-hover:scale-125 transition-transform duration-300"
                  style={{ fontFamily: '"Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif' }}
                >
                  {country.flag}
                </span>
                <span className="font-semibold text-slate-200">{country.name}</span>
            </button>
            ))}
      </div>
    </div>
  );
};

export default CountrySelector;
