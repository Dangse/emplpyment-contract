import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  textarea?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ label, textarea, className = '', ...props }) => {
  const baseClasses = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-slate-900 placeholder-slate-400";
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      {textarea ? (
        <textarea 
          className={`${baseClasses} min-h-[100px] resize-y ${className}`} 
          {...props as any} 
        />
      ) : (
        <input 
          className={`${baseClasses} ${className}`} 
          {...props} 
        />
      )}
    </div>
  );
};