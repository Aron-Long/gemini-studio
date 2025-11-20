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

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-code.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <div className="flex items-center gap-3">
            <button 
              onClick={handleCopy}
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M13.887 3.182c.396.037.79.08 1.183.128C13.5 6.169 12.884 9.244 12 12c-.884 2.756-1.5 5.831-2.07 8.69a48.275 48.275 0 01-1.183-.128c-.352-.033-.71-.074-1.05-.12a48.041 48.041 0 01-3.478-.397.75.75 0 01-.493-.398l-.008-.023a39.975 39.975 0 01.25-5.975c2.31-1.776 5.471-2.221 8.268-2.221.003 0 .005 0 .007 0a4.5 4.5 0 00.08-8.227A4 4 0 0012.182 3.05zM15 6.75a.75.75 0 00-.75.75A3.75 3.75 0 0110.5 12a.75.75 0 00-1.5 0A5.25 5.25 0 0015 7.5a.75.75 0 00.75-.75zM4.182 4.31a39.78 39.78 0 0112.719 0c.131.012.26.025.39.04a4.5 4.5 0 00-1.352 2.306 51.842 51.842 0 00-3.436-.384c-.284-.027-.565-.05-.846-.068a39.78 39.78 0 00-1.11 0c-.281.018-.562.04-.846.068a51.811 51.811 0 00-3.436.384 4.5 4.5 0 00-1.352-2.306c.13-.015.26-.028.39-.04zm1.285 3.544a.75.75 0 01.442.106l3.757 2.25a.75.75 0 01.636.848v6.799a.75.75 0 01-.53.91l-4.25 1.106a.75.75 0 01-.96-.529l-1.384-5.323a.75.75 0 01.564-.821l3.75-.954zM8.5 10.5v5.67l3.129-1.545.48-1.698-3.609-2.162v-1.265z" clipRule="evenodd" />
                  </svg>
                  Copy Code
                </>
              )}
            </button>
            <button 
              onClick={handleDownload}
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              title="Download Code"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 00-1.09 1.03l4.25 4.5a.75.75 0 001.07 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
              </svg>
              Download
            </button>
          </div>
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