import React from 'react';
import Link from 'next/link';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({ title, message, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-[#151515]/50 border border-zinc-800 rounded-lg">
      <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
      <p className="text-white/60 mb-6 max-w-md">{message}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="outline">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
