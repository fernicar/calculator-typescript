import React, { useEffect, useRef } from 'react';

interface DisplayProps {
  expression: string;
  result: string;
  isAiProcessing?: boolean;
}

const Display: React.FC<DisplayProps> = ({ expression, result, isAiProcessing }) => {
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [expression, result]);

  return (
    <div className="w-full bg-slate-950 rounded-3xl p-6 mb-6 shadow-inner shadow-black/50 border border-slate-800 relative overflow-hidden h-32 flex flex-col justify-end">
      {/* Background glow effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20"></div>

      {isAiProcessing && (
         <div className="absolute top-4 right-4 flex items-center gap-2 text-indigo-400 text-xs font-mono animate-pulse">
           <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
           AI THINKING...
         </div>
      )}

      {/* Expression (Input) */}
      <div 
        className="w-full text-right text-slate-400 text-lg mb-2 font-mono overflow-x-auto no-scrollbar whitespace-nowrap"
      >
        {expression || '0'}
      </div>

      {/* Result */}
      <div 
        ref={displayRef}
        className={`w-full text-right text-4xl sm:text-5xl font-bold tracking-tight overflow-x-auto no-scrollbar whitespace-nowrap transition-colors duration-300 ${isAiProcessing ? 'text-indigo-400/50' : 'text-white'}`}
      >
        {result || (expression ? '=' : '0')}
      </div>
    </div>
  );
};

export default Display;