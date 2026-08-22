import React from 'react';

interface CardProps {
  children: React.ReactNode;
  type?: 'lost' | 'found';
  pinned?: boolean;
  className?: string;
}

export default function Card({ children, type, pinned = false, className = '' }: CardProps) {
  const pinClass = type ? `pin-dot pin-dot-${type}` : '';
  const hoverClass = pinned ? 'transition-transform duration-200 hover:-rotate-1 hover:shadow-md' : '';
  
  return (
    <div className={`bg-[#151515] shadow-sm border border-zinc-800 rounded-xl p-4 ${pinClass} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
