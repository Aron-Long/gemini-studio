import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PromptInput } from './components/PromptInput';
import { LivePreview } from './components/LivePreview';
import { CodeViewer } from './components/CodeViewer';
import { generateFrontendCode } from './services/geminiService';
import { GeneratedCodeResponse, ViewMode } from './types';

// Placeholder code for initial state
const PLACEHOLDER_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 flex items-center justify-center min-h-screen font-sans">
    <div class="text-center p-10">
        <div class="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
           <span class="text-4xl">✨</span>
        </div>
        <h1 class="text-4xl font-bold text-slate-200 mb-4">Ready to Create?</h1>
        <p class="text-slate-500 max-w-md mx-auto">Enter a prompt below to generate a UI component using Gemini 3 Pro.</p>
    </div>
</body>
</html>`;

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedCodeResponse | null>(null);
  // Holds the raw text while streaming
  const [streamingContent, setStreamingContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle generating code
  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setStreamingContent('');
    
    // 1. Automatically jump to Code view to show the "Thinking/Writing" process
    setViewMode(ViewMode.CODE);

    try {
      // 2. Call service with a callback for streaming chunks
      const result = await generateFrontendCode(prompt, (chunkText) => {
        setStreamingContent(chunkText);
      });
      
      setGeneratedData(result);
      
      // 3. Once finished, automatically switch to Preview to run the code
      setViewMode(ViewMode.PREVIEW);
    } catch (err) {
      setError("Failed to generate code. Please try again.");
      console.error(err);
      // If error, stay on code view so user can maybe see what happened or try again
    } finally {
      setIsLoading(false);
      setStreamingContent(null);
    }
  };

  // Determine content to show
  // If streaming, show the raw stream. If finished, show the parsed code. If neither, placeholder.
  const displayCode = streamingContent !== null 
    ? streamingContent 
    : (generatedData ? generatedData.code : PLACEHOLDER_CODE);

  const explanation = generatedData ? generatedData.explanation : "Waiting for your prompt...";

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Ambient Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none z-0" />
        
        {/* Content Container */}
        <div className="flex-1 flex flex-col z-10 p-6 gap-6 max-w-[1600px] mx-auto w-full h-[calc(100vh-4rem)]">
          
          {/* Top: Input Section */}
          <div className="flex-none">
             <div className="flex flex-col items-center justify-center mb-6 text-center">
                {!generatedData && !isLoading && (
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                    What do you want to build?
                  </h1>
                )}
             </div>
             <PromptInput onSubmit={handleGenerate} isLoading={isLoading} />
             
             {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center max-w-3xl mx-auto">
                  {error}
                </div>
             )}
          </div>

          {/* Bottom: Workspace Section */}
          <div className="flex-1 min-h-0 flex gap-4">
            {/* Left Panel: Explanation & Logic (Only visible when finished generation or split view) */}
            {generatedData && !isLoading && viewMode === ViewMode.SPLIT && (
               <div className="w-1/4 hidden lg:flex flex-col gap-4 animate-fade-in">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 h-full overflow-y-auto custom-scrollbar">
                    <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">Gemini Insights</h3>
                    <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                      {explanation}
                    </p>
                  </div>
               </div>
            )}

            {/* Right Panel: Output Area */}
            <div className={`flex-1 flex flex-col bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-500`}>
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800">
                 <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
                    <button 
                      onClick={() => setViewMode(ViewMode.PREVIEW)}
                      disabled={isLoading}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === ViewMode.PREVIEW ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 disabled:opacity-50'}`}
                    >
                      Preview
                    </button>
                    <button 
                      onClick={() => setViewMode(ViewMode.CODE)}
                      disabled={isLoading}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === ViewMode.CODE ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 disabled:opacity-50'}`}
                    >
                      Code
                    </button>
                    <button 
                      onClick={() => setViewMode(ViewMode.SPLIT)}
                      disabled={isLoading}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === ViewMode.SPLIT ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 disabled:opacity-50'} hidden md:block`}
                    >
                      Split
                    </button>
                 </div>
                 <div className="flex items-center gap-2 text-xs text-slate-500">
                    {isLoading && (
                      <span className="flex items-center gap-1 text-blue-400 animate-pulse">
                        <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Generating...
                      </span>
                    )}
                    <span>Gemini 3 Pro</span>
                 </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 relative flex overflow-hidden">
                 {/* Preview Mode */}
                 {(viewMode === ViewMode.PREVIEW || viewMode === ViewMode.SPLIT) && !isLoading && (
                   <div className={`flex-1 relative ${viewMode === ViewMode.SPLIT ? 'w-1/2 border-r border-slate-800' : 'w-full'}`}>
                      <LivePreview code={displayCode} />
                   </div>
                 )}
                 
                 {/* Code Mode */}
                 {(viewMode === ViewMode.CODE || viewMode === ViewMode.SPLIT || isLoading) && (
                   <div className={`flex-1 relative flex flex-col min-h-0 bg-slate-950 ${viewMode === ViewMode.SPLIT && !isLoading ? 'w-1/2' : 'w-full'}`}>
                      <CodeViewer code={displayCode} isStreaming={isLoading} />
                   </div>
                 )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;