import React from 'react';
import Button from './Button';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-start p-6 bg-[#151515] border-l-4 border-red-500 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-white mb-2">Something went wrong</h3>
      <p className="text-white/70 mb-4">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>Retry</Button>
    </div>
  );
}
