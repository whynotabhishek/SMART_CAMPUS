import React from 'react';

export default function LoadingState({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-paper-white border border-cork/20 rounded-[2px] p-4 animate-pulse relative pin-dot pin-dot-lost">
          <div className="h-6 bg-cork/30 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-cork/20 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-cork/20 rounded w-full mb-4"></div>
          <div className="flex gap-2 mb-2">
            <div className="h-4 bg-cork/20 rounded w-1/4"></div>
            <div className="h-4 bg-cork/20 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
