import React, { useState, KeyboardEvent } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative group">
      <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur transition duration-1000 ${isLoading ? 'opacity-10' : 'opacity-25 group-hover:opacity-50'}`}></div>
      <div className="relative bg-slate-900 rounded-2xl p-1 border border-slate-800 ring-1 ring-white/10">
        <textarea
          className="w-full bg-transparent border-none text-slate-200 text-lg p-4 resize-none focus:ring-0 placeholder:text-slate-500 h-24 min-h-[6rem] disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder={isLoading ? "Gemini is building your app..." : "Create a web-based Snake game."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        
        <div className="flex justify-between items-center px-2 pb-2">
          <div className="flex gap-2">
             <button disabled={isLoading} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors disabled:opacity-0" title="Add Image (Mock)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
             </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
              ${input.trim() && !isLoading 
                ? 'bg-slate-100 text-slate-900 hover:bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
            `}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm">Building...</span>
              </>
            ) : (
              <>
                <span className="text-sm">Generate</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};