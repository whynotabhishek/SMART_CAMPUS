import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  multiline?: boolean;
}

export default function Input({ label, error, helperText, multiline, id, className = '', ...props }: InputProps) {
  const inputClasses = `w-full bg-[#151515] border rounded-lg px-3 py-2 text-white placeholder-ink-dark/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${error ? 'border-red-500' : 'border-zinc-700'}`;
  
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-white">
        {label} {props.required && <span className="text-red-400">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          className={`${inputClasses} resize-y min-h-[100px]`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          className={inputClasses}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <span className="text-xs text-red-400">{error}</span>}
      {helperText && !error && <span className="text-xs text-white/60">{helperText}</span>}
    </div>
  );
}
