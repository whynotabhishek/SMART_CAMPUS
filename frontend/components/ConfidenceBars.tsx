'use client';
import { useEffect, useState } from 'react';
import { SCORE_COLOURS, SCORE_LABELS } from '@/lib/constants';
import type { MatchScores } from '@/lib/types';

interface ConfidenceBarsProps {
  scores: MatchScores;
  animated?: boolean;
}

export default function ConfidenceBars({ scores, animated = true }: ConfidenceBarsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (animated) {
      setMounted(true);
    }
  }, [animated]);

  const bars = [
    { key: 'visual', label: SCORE_LABELS.visual, score: scores.visual_score, color: SCORE_COLOURS.visual },
    { key: 'text', label: SCORE_LABELS.text, score: scores.text_score, color: SCORE_COLOURS.text },
    { key: 'location', label: SCORE_LABELS.location, score: scores.location_score, color: SCORE_COLOURS.location },
    { key: 'time', label: SCORE_LABELS.time, score: scores.time_score, color: SCORE_COLOURS.time },
  ];

  return (
    <div className="space-y-3">
      {bars.map((bar, index) => {
        const pct = Math.round(bar.score * 100);
        const isVisualZero = bar.key === 'visual' && bar.score === 0;
        const targetWidth = Math.max(pct, 2) + '%';
        
        return (
          <div 
            key={bar.key} 
            className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"
            style={{ 
              opacity: animated && !mounted ? 0 : 1,
              animation: animated && mounted ? `fadeIn 0.4s ease-out ${index * 0.1}s forwards` : 'none'
            }}
          >
            <span className="text-sm font-medium w-32 shrink-0">{bar.label}</span>
            
            <div className="flex-grow flex items-center gap-3">
              {isVisualZero ? (
                <span className="text-sm italic text-ink-dark/50 bg-cork/10 px-3 py-1 rounded-sm">No photo</span>
              ) : (
                <div 
                  className="relative h-6 bg-opacity-10 w-full max-w-[200px]" 
                  style={{ backgroundColor: `${bar.color}20` }}
                >
                  <div 
                    className="absolute top-0 left-0 h-full torn-bar transition-all duration-1000"
                    style={{ 
                      backgroundColor: bar.color,
                      width: animated && !mounted ? '0%' : targetWidth,
                      animation: animated && mounted ? `fillBar 0.6s ease-out ${index * 0.1}s forwards` : 'none',
                      '--target-width': targetWidth
                    } as React.CSSProperties}
                  />
                </div>
              )}
              
              {!isVisualZero && (
                <span className="font-mono text-sm w-12 text-right">{pct}%</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
