import React, { useEffect, useRef, useState } from 'react';

interface CodeViewerProps {
  code: string;
  isStreaming?: boolean;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ code, isStreaming = false }) => {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLDivElement>(null);
  // Smart scrolling: track if we should auto-scroll
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle user scroll event to determine if they are "detached" from the bottom
  const handleScroll = () => {
    if (preRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = preRef.current;
      // If the user is within 50px of the bottom, stick to bottom. Otherwise, let them scroll freely.
      // Using absolute difference to handle any float precision issues
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
      setShouldAutoScroll(isAtBottom);
    }
  };

  // Auto-scroll to bottom during streaming only if shouldAutoScroll is true
  useEffect(() => {
    if (isStreaming && shouldAutoScroll && preRef.current) {
      // Use instant scrolling to prevent jittering during high-frequency updates
      preRef.current.scrollTo({
        top: preRef.current.scrollHeight,
        behavior: 'instant'
      });
    }
  }, [code, isStreaming, shouldAutoScroll]);

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col relative">
      {/* Header - Fixed Height */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 flex-none z-10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-700" />
          <div className="w-3 h-3 rounded-full bg-slate-700" />
          <div className="w-3 h-3 rounded-full bg-slate-700" />
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {isStreaming ? 'stream_incoming_data...' : 'source.html'}
        </span>
        {!isStreaming && (
          <button 
            onClick={handleCopy}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        )}
      </div>

      {/* Code Content Wrapper - Takes remaining space */}
      <div className="flex-1 relative min-h-0">
        {/* Scrollable Area - Absolutely positioned to fill the wrapper */}
        <div 
          ref={preRef}
          onScroll={handleScroll}
          className="absolute inset-0 overflow-y-auto p-4 custom-scrollbar"
        >
          <pre className={`text-sm font-mono whitespace-pre-wrap break-all transition-colors duration-300 pb-20 ${isStreaming ? 'text-emerald-400/90' : 'text-slate-300'}`}>
            <code>
              {code}
              {isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 bg-emerald-500 animate-pulse align-middle" />
              )}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};