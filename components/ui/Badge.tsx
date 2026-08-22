import React from 'react';

type BadgeVariant = 'lost' | 'found' | 'open' | 'matched' | 'claimed';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

export default function Badge({ variant, children }: BadgeProps) {
  const variants = {
    lost: 'bg-pin-red text-white',
    found: 'bg-found-green text-white',
    open: 'bg-cork/20 text-ink-dark',
    matched: 'bg-thumbtack-blue text-white',
    claimed: 'bg-cork text-white',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${variants[variant]}`}>
      {children}
    </span>
  );
}
