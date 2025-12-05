import React, { useState, useEffect, useCallback } from 'react';
import { History, Eraser, Delete, Plus, Minus, X, Divide, Equal, Calculator, BrainCircuit, Maximize2, Menu, Sparkles } from 'lucide-react';
import CalculatorKey from './components/CalculatorKey';
import Display from './components/Display';
import HistoryPanel from './components/HistoryPanel';
import AiInterface from './components/AiInterface';
import { solveMathWithGemini } from './services/geminiService';
import { HistoryItem, CalculatorMode } from './types';

const App: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [scientificMode, setScientificMode] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('calc_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // Save history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(history));
  }, [history]);

  const addToHistory = (expr: string, res: string, isAi = false, explanation = '') => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      expression: expr,
      result: res,
      timestamp: Date.now(),
      isAi,
      explanation
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  const handleDelete = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  const handleInput = (val: string) => {
    // Prevent multiple decimals
    if (val === '.' && expression.split(/[+\-*/]/).pop()?.includes('.')) return;
    
    // Prevent multiple operators
    if (['+', '-', '*', '/', '%'].includes(val)) {
       const lastChar = expression.slice(-1);
       if (['+', '-', '*', '/', '%'].includes(lastChar)) {
         setExpression(prev => prev.slice(0, -1) + val);
         return;
       }
    }

    setExpression(prev => prev + val);
  };

  const safeEvaluate = (expr: string): string => {
    try {
      // Basic sanitation
      // eslint-disable-next-line no-useless-escape
      const sanitized = expr.replace(/[^0-9+\-*/.()%e\s]/g, '');
      if (!sanitized) return '';
      // eslint-disable-next-line no-new-func
      const func = new Function(`return ${sanitized}`);
      const res = func();
      
      if (!isFinite(res) || isNaN(res)) return 'Error';
      
      // Format number to avoid floating point weirdness (e.g., 0.1 + 0.2)
      return String(Math.round(res * 100000000) / 100000000);
    } catch (e) {
      return 'Error';
    }
  };

  const handleCalculate = () => {
    if (!expression) return;
    const res = safeEvaluate(expression);
    setResult(res);
    addToHistory(expression, res);
    // After calculation, we might want to start fresh or keep result
    // Keeping expression for now, maybe in a "completed" state visually
  };

  const handleAiSolve = async (prompt: string) => {
    setIsAiProcessing(true);
    // Add the prompt to expression temporarily or clear it
    setExpression(prompt);
    setResult('...');
    
    try {
      const aiResponse = await solveMathWithGemini(prompt);
      setResult(aiResponse.result);
      
      let explanationText = "";
      if (aiResponse.steps && aiResponse.steps.length > 0) {
        explanationText = aiResponse.steps.join(' ');
      }

      addToHistory(prompt, aiResponse.result, true, explanationText);
    } catch (e) {
      setResult('Error');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleScientificOp = (func: string) => {
    if (func === 'pi') {
      setExpression(prev => prev + Math.PI.toFixed(4));
    } else if (func === 'e') {
       setExpression(prev => prev + Math.E.toFixed(4));
    } else if (['sin', 'cos', 'tan', 'log', 'sqrt'].includes(func)) {
      // Since we use basic JS eval, we need to convert these to Math.func
      // But for display we want "sin(".
      // This simple calculator might need a parser for advanced functions.
      // For simplicity in this demo, let's use AI for scientific inputs immediately 
      // OR map simple scientific inputs to Math.x if wrapped correctly.
      // Let's rely on standard calc for simple stuff and AI for complex.
      // Actually, let's try to support basic JS Math functions in the eval wrapper.
      setExpression(prev => prev + `Math.${func}(`);
    } else if (func === '^') {
        setExpression(prev => prev + '**');
    } else {
        setExpression(prev => prev + func);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isAiMode) return; // Disable standard keys in AI mode

      const key = e.key;
      if (/[0-9.]/.test(key)) handleInput(key);
      if (['+', '-', '*', '/'].includes(key)) handleInput(key);
      if (key === 'Enter') handleCalculate();
      if (key === 'Backspace') handleDelete();
      if (key === 'Escape') handleClear();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [expression, isAiMode]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background Gradient Orbs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-indigo-900/20 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-violet-900/20 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col h-[850px] max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="flex bg-slate-800/50 p-1 rounded-full border border-slate-800">
             <button 
               onClick={() => setScientificMode(false)}
               className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${!scientificMode ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
             >
               Standard
             </button>
             <button 
               onClick={() => setScientificMode(true)}
               className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${scientificMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
             >
               Scientific
             </button>
          </div>
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <History size={20} />
          </button>
        </div>

        {/* Display */}
        <div className="px-6 pt-2">
            <Display expression={expression} result={result} isAiProcessing={isAiProcessing} />
        </div>

        {/* AI Toggle Bar */}
        <div className="px-6 mb-4">
            <button 
                onClick={() => setIsAiMode(!isAiMode)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all border ${isAiMode ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/50' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
            >
                {isAiMode ? (
                    <>
                        <X size={18} />
                        <span className="font-semibold text-sm">Close AI Assistant</span>
                    </>
                ) : (
                    <>
                        <Sparkles size={18} />
                        <span className="font-semibold text-sm">Ask Gemini AI</span>
                    </>
                )}
            </button>
        </div>

        {/* Keypad Container */}
        <div className="flex-1 bg-slate-900 px-6 pb-6 pt-2 flex flex-col justify-end">
          
          {/* Scientific Keys Row (collapsible/scrollable if needed) */}
          {scientificMode && (
             <div className="grid grid-cols-4 gap-3 mb-3">
                {['sin', 'cos', 'tan', 'log', '(', ')', '^', 'sqrt', 'pi', 'e'].map(key => (
                    <CalculatorKey 
                        key={key} 
                        label={key} 
                        variant="scientific" 
                        onClick={() => handleScientificOp(key)}
                        className={key === 'sqrt' ? 'text-lg' : ''}
                    />
                ))}
             </div>
          )}

          {/* Standard Keypad */}
          <div className="grid grid-cols-4 gap-3">
            <CalculatorKey label="AC" variant="action" onClick={handleClear} className="text-red-400" />
            <CalculatorKey label={<Delete size={22} />} variant="action" onClick={handleDelete} />
            <CalculatorKey label="%" variant="action" onClick={() => handleInput('%')} />
            <CalculatorKey label={<Divide size={22} />} value="/" variant="operator" onClick={handleInput} />

            <CalculatorKey label="7" onClick={handleInput} />
            <CalculatorKey label="8" onClick={handleInput} />
            <CalculatorKey label="9" onClick={handleInput} />
            <CalculatorKey label={<X size={22} />} value="*" variant="operator" onClick={handleInput} />

            <CalculatorKey label="4" onClick={handleInput} />
            <CalculatorKey label="5" onClick={handleInput} />
            <CalculatorKey label="6" onClick={handleInput} />
            <CalculatorKey label={<Minus size={22} />} value="-" variant="operator" onClick={handleInput} />

            <CalculatorKey label="1" onClick={handleInput} />
            <CalculatorKey label="2" onClick={handleInput} />
            <CalculatorKey label="3" onClick={handleInput} />
            <CalculatorKey label={<Plus size={22} />} value="+" variant="operator" onClick={handleInput} />

            <CalculatorKey label="0" onClick={handleInput} doubleWidth />
            <CalculatorKey label="." onClick={handleInput} />
            <CalculatorKey label={<Equal size={22} />} variant="operator" onClick={handleCalculate} className="bg-gradient-to-br from-indigo-600 to-violet-600" />
          </div>
        </div>

        {/* Overlays */}
        <HistoryPanel 
            isOpen={isHistoryOpen} 
            history={history} 
            onClose={() => setIsHistoryOpen(false)}
            onClear={() => setHistory([])}
            onSelect={(item) => {
                setExpression(item.expression);
                setResult(item.result);
                setIsHistoryOpen(false);
            }}
        />

        {isAiMode && (
            <AiInterface 
                onSolve={handleAiSolve} 
                isProcessing={isAiProcessing}
                onClose={() => setIsAiMode(false)}
            />
        )}

      </div>
      
      {/* Footer Info */}
      <div className="fixed bottom-4 text-slate-600 text-xs font-mono">
        Powered by Gemini 2.5 Flash
      </div>
    </div>
  );
};

export default App;