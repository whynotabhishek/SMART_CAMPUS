import React from 'react';

type BadgeVariant = 'lost' | 'found' | 'open' | 'matched' | 'claimed';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

export default function Badge({ variant, children }: BadgeProps) {
  const variants = {
    lost: 'bg-red-500 text-white',
    found: 'bg-emerald-500 text-white',
    open: 'bg-zinc-800 text-white',
    matched: 'bg-blue-600 text-white',
    claimed: 'bg-cork text-white',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${variants[variant]}`}>
      {children}
    </span>
  );
}
