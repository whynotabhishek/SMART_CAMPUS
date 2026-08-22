import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  multiline?: boolean;
}

export default function Input({ label, error, helperText, multiline, id, className = '', ...props }: InputProps) {
  const inputClasses = `w-full bg-paper-white border rounded-sm px-3 py-2 text-ink-dark placeholder-ink-dark/40 focus:outline-none focus:ring-2 focus:ring-thumbtack-blue transition-shadow ${error ? 'border-pin-red' : 'border-cork'}`;
  
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-ink-dark">
        {label} {props.required && <span className="text-pin-red">*</span>}
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
      {error && <span className="text-xs text-pin-red">{error}</span>}
      {helperText && !error && <span className="text-xs text-ink-dark/60">{helperText}</span>}
    </div>
  );
}
