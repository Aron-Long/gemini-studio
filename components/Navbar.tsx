import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <nav className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
            <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.949 49.949 0 0 0-9.902 3.912l-.003.002-.34.18a.75.75 0 0 1-.707 0A50.009 50.009 0 0 0 7.5 2.174v-.224c0-.131.067-.248.182-.316l.002-.001.006-.004.018-.01a4.5 4.5 0 0 1 2.32-.632A4.5 4.5 0 0 1 11.7 2.805Z" />
            <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 0 1-.46.71 47.878 47.878 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.877 47.877 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 0 1 6 13.18v1.27a1.5 1.5 0 0 0 1.5 1.5h1v2.5a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-2.5h1a1.5 1.5 0 0 0 1.5-1.5h1a1.5 1.5 0 0 0 1.5-1.5v-1.27Z" />
          </svg>
        </div>
        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Gemini 3 pro
        </span>
      </div>
      
      <div className="flex gap-4">
      </div>
    </nav>
  );
};