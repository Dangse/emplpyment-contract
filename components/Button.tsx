import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base";
  
  const variants = {
    primary: "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800",
    outline: "border border-slate-300 hover:border-slate-800 hover:text-slate-900 text-slate-600 bg-transparent"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};