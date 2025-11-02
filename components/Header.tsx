
import React from 'react';
import { PawPrintIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white/30 backdrop-blur-md sticky top-0 z-20 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <PawPrintIcon className="w-8 h-8 text-pet-dark" />
        <h1 className="ml-3 text-2xl font-bold text-pet-darkest tracking-tight">
          Pet-AI Emotion Translator
        </h1>
      </div>
    </header>
  );
};

export default Header;
