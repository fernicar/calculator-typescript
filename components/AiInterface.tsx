import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, BrainCircuit } from 'lucide-react';

interface AiInterfaceProps {
  onSolve: (prompt: string) => Promise<void>;
  isProcessing: boolean;
  onClose: () => void;
}

const AiInterface: React.FC<AiInterfaceProps> = ({ onSolve, isProcessing, onClose }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSolve(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 p-4 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 z-40">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <Sparkles size={18} />
          <span className="font-semibold text-sm">Gemini Math Assistant</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything... e.g. 'Solve 3x + 5 = 20' or 'Calculate tip for $85'"
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 pr-12 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none h-24 text-sm font-mono leading-relaxed"
          disabled={isProcessing}
        />
        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="absolute bottom-3 right-3 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-900/20"
        >
          {isProcessing ? (
            <BrainCircuit size={18} className="animate-pulse" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>
      
      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          "Sqrt of 144 + 50",
          "Area of circle r=5",
          "Solve 2x^2 + 4x = 0",
          "Convert 100 USD to EUR"
        ].map((suggestion, i) => (
          <button
            key={i}
            onClick={() => setInput(suggestion)}
            className="flex-shrink-0 text-xs px-3 py-1.5 bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 border border-slate-700 hover:text-slate-200 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AiInterface;