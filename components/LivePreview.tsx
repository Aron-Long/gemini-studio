import React, { useEffect, useRef, useState } from 'react';

interface LivePreviewProps {
  code: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Use a key to force re-mounting of the iframe on refresh
  const [key, setKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Handle fullscreen toggle
  const handleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        // Enter fullscreen
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        } else if ((containerRef.current as any).mozRequestFullScreen) {
          await (containerRef.current as any).mozRequestFullScreen();
        } else if ((containerRef.current as any).msRequestFullscreen) {
          await (containerRef.current as any).msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700 flex flex-col shadow-2xl"
      onClick={focusIframe}
      onMouseEnter={focusIframe}
    >
      {/* Browser Toolbar */}
      <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center px-4 space-x-4 select-none">
        {/* Fullscreen Button - 放大用第一张图UI, 缩小用第二张图UI */}
        <button
          onClick={handleFullscreen}
          className="p-1.5 hover:bg-slate-700 rounded-lg hover:text-white transition-colors text-slate-400"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            // 第二张图UI: 四个向内指向的L形图标 (缩小/退出全屏)
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              {/* 左上角 L */}
              <path d="M3 3h4M3 3v4" />
              {/* 右上角 L */}
              <path d="M17 3h-4M17 3v4" />
              {/* 左下角 L */}
              <path d="M3 17h4M3 17v-4" />
              {/* 右下角 L */}
              <path d="M17 17h-4M17 17v-4" />
            </svg>
          ) : (
            // 第一张图UI: 四个向外指向的L形图标 (放大/全屏)
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              {/* 左上角 L - 向外 */}
              <path d="M7 3H3M3 3v4" />
              {/* 右上角 L - 向外 */}
              <path d="M13 3h4M17 3v4" />
              {/* 左下角 L - 向外 */}
              <path d="M7 17H3M3 17v-4" />
              {/* 右下角 L - 向外 */}
              <path d="M13 17h4M17 17v-4" />
            </svg>
          )}
        </button>

        {/* Navigation Controls - 移除左右箭头，只保留刷新按钮 */}
        <div className="flex items-center space-x-3 text-slate-400 ml-auto">
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