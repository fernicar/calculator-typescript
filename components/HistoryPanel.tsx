import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Trash2, ChevronRight, BrainCircuit } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
  onClose: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, isOpen, onClear, onSelect, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex bg-slate-950/80 backdrop-blur-md transition-opacity duration-300">
      <div className="w-full h-full sm:max-w-xs bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <Clock size={18} />
            <span>History</span>
          </div>
          <button onClick={onClear} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors" title="Clear History">
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-sm">
              <p>No history yet.</p>
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="w-full text-left p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-800/50 hover:border-indigo-500/30 group transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${item.isAi ? 'bg-indigo-900/50 text-indigo-300' : 'bg-slate-700/50 text-slate-400'}`}>
                    {item.isAi ? <BrainCircuit size={10} className="inline mr-1"/> : null}
                    {item.isAi ? 'AI' : 'STD'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <div className="text-slate-400 text-sm truncate font-mono mb-1">{item.expression}</div>
                <div className="text-indigo-400 font-semibold text-lg text-right truncate">{item.result}</div>
                {item.explanation && (
                  <div className="mt-2 text-xs text-slate-500 border-t border-slate-700/50 pt-2 line-clamp-2">
                    {item.explanation}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
        
        <button onClick={onClose} className="p-4 text-center text-slate-400 hover:text-white border-t border-slate-800 transition-colors">
            Close History
        </button>
      </div>
      <div className="flex-1" onClick={onClose}></div>
    </div>
  );
};

export default HistoryPanel;