import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
}

export default function Select({ label, options, error, id, className = '', ...props }: SelectProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-white">
        {label} {props.required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          className={`w-full bg-[#151515] border rounded-lg px-3 py-2 appearance-none text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${error ? 'border-red-500' : 'border-zinc-700'}`}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-zinc-400">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
