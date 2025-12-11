import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧵</span>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            PatchPreview <span className="text-indigo-600">AI</span>
          </h1>
        </div>
        <a 
          href="https://ai.google.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors"
        >
          Powered by Gemini
        </a>
      </div>
    </header>
  );
};