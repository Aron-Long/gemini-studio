import React, { useEffect, useRef, useState } from 'react';

interface LivePreviewProps {
  code: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Use a key to force re-mounting of the iframe on refresh
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setKey(prev => prev + 1);
  };

  // When code changes, we can also update the key to ensure fresh render
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [code]);

  // Focus the iframe window to ensure keyboard events (arrow keys) are captured immediately
  const focusIframe = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.focus();
    }
  };

  return (
    <div 
      className="w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700 flex flex-col shadow-2xl"
      onClick={focusIframe}
      onMouseEnter={focusIframe}
    >
      {/* Browser Toolbar */}
      <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center px-4 space-x-4 select-none">
        {/* Window Controls (Mac style) */}
        <div className="flex space-x-2 group">
          <div className="w-3 h-3 rounded-full bg-red-500/80 group-hover:bg-red-500 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 group-hover:bg-yellow-500 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-green-500/80 group-hover:bg-green-500 transition-colors" />
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-3 text-slate-400">
           <button className="p-1.5 hover:bg-slate-700 rounded-full hover:text-white transition-colors disabled:opacity-50">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
               <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
             </svg>
           </button>
           <button className="p-1.5 hover:bg-slate-700 rounded-full hover:text-white transition-colors disabled:opacity-50">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
               <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
             </svg>
           </button>
           <button 
             onClick={handleRefresh} 
             className="p-1.5 hover:bg-slate-700 rounded-full hover:text-white transition-colors" 
             title="Refresh Preview"
           >
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
               <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.02-1.06l-.31-.31a7 7 0 00-11.712 3.138.75.75 0 001.449.39 5.5 5.5 0 019.201-2.466l.312.311h-2.433a.75.75 0 000 1.5h4.243a.75.75 0 00.75-.75V5.758a.75.75 0 00-1.5 0v2.43l-.31.31z" clipRule="evenodd" />
             </svg>
           </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 bg-slate-900 h-8 rounded-full border border-slate-600 hover:border-slate-500 transition-colors flex items-center px-4 text-xs text-slate-400 font-mono overflow-hidden">
           <span className="text-green-500 mr-2">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
               <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
             </svg>
           </span>
           <span>localhost:3000/preview/app.html</span>
        </div>

        {/* Extra Menu Icon */}
        <div className="text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
          </svg>
        </div>
      </div>

      {/* Iframe Content */}
      <div className="flex-1 bg-white relative">
        <iframe
          key={key}
          ref={iframeRef}
          srcDoc={code}
          title="Live Preview"
          className="absolute inset-0 w-full h-full border-none bg-white"
          sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
          onLoad={focusIframe}
        />
      </div>
    </div>
  );
};