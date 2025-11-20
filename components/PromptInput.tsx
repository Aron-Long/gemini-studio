import React, { useState, KeyboardEvent, useEffect, useRef } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const DEFAULT_TEXT = 'Create a web-based snake game';
const TYPING_SPEED = 50; // milliseconds per character

export const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasTypedRef = useRef(false);

  // Typing effect on mount
  useEffect(() => {
    if (!hasTypedRef.current && !isLoading) {
      hasTypedRef.current = true;
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex < DEFAULT_TEXT.length) {
          setDisplayedText(DEFAULT_TEXT.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setInput(DEFAULT_TEXT);
          // Focus the textarea after typing completes
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
              // Move cursor to end
              inputRef.current.setSelectionRange(DEFAULT_TEXT.length, DEFAULT_TEXT.length);
            }
          }, 100);
        }
      }, TYPING_SPEED);

      return () => clearInterval(typingInterval);
    }
  }, [isLoading]);

  // Reset typing effect when loading completes
  useEffect(() => {
    if (!isLoading && input === '') {
      hasTypedRef.current = false;
      setIsTyping(true);
      setDisplayedText('');
    }
  }, [isLoading, input]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const textToSubmit = input.trim() || displayedText.trim();
    if (textToSubmit && !isLoading) {
      onSubmit(textToSubmit);
      // Clear input after submission
      setInput('');
      setDisplayedText('');
      hasTypedRef.current = false;
      setIsTyping(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    setDisplayedText(value);
    setIsTyping(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative group">
      <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur transition duration-1000 ${isLoading ? 'opacity-10' : 'opacity-25 group-hover:opacity-50'}`}></div>
      <div className="relative bg-slate-900 rounded-2xl p-1 border border-slate-800 ring-1 ring-white/10">
        <textarea
          ref={inputRef}
          className="w-full bg-transparent border-none text-slate-200 text-lg p-4 resize-none focus:ring-0 placeholder:text-slate-500 h-24 min-h-[6rem] disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder={isLoading ? "Gemini is building your app..." : ""}
          value={isTyping ? displayedText : input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        
        <div className="flex justify-end items-center px-2 pb-2">
          <button
            onClick={handleSubmit}
            disabled={(!input.trim() && !displayedText.trim()) || isLoading}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
              ${(input.trim() || displayedText.trim()) && !isLoading 
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]' 
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