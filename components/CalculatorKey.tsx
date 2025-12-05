import React from 'react';

interface CalculatorKeyProps {
  label: string | React.ReactNode;
  value?: string;
  onClick: (value: string) => void;
  variant?: 'default' | 'operator' | 'action' | 'scientific';
  className?: string;
  doubleWidth?: boolean;
}

const CalculatorKey: React.FC<CalculatorKeyProps> = ({ 
  label, 
  value, 
  onClick, 
  variant = 'default',
  className = '',
  doubleWidth = false
}) => {
  const handleClick = () => {
    onClick(value || (typeof label === 'string' ? label : ''));
  };

  const baseStyles = "relative overflow-hidden rounded-2xl text-xl font-medium transition-all duration-200 active:scale-95 flex items-center justify-center select-none";
  
  const variants = {
    default: "bg-slate-800 text-slate-200 hover:bg-slate-700 shadow-lg shadow-slate-900/50",
    operator: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/50",
    action: "bg-slate-600 text-slate-100 hover:bg-slate-500 shadow-lg shadow-slate-900/50",
    scientific: "bg-slate-900 text-slate-400 hover:bg-slate-800 text-sm font-semibold border border-slate-800"
  };

  const widthClass = doubleWidth ? "col-span-2 aspect-[2.1/1]" : "aspect-square";

  return (
    <button 
      onClick={handleClick}
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
    >
      {label}
    </button>
  );
};

export default CalculatorKey;