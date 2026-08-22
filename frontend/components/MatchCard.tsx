'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import ConfidenceBars from './ConfidenceBars';
import { formatRelativeTime, getScoreColor } from '@/lib/utils';
import type { MatchResult } from '@/lib/types';

interface MatchCardProps {
  match: MatchResult;
  reportType: 'lost' | 'found';
}

export default function MatchCard({ match, reportType }: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLowScore = match.overall_score < 40;
  
  return (
    <Card className={`relative ${isLowScore ? 'opacity-80' : ''}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Score Column */}
        <div className="flex flex-col items-center justify-center min-w-[80px] p-2 bg-cork/10 rounded-sm">
          <span className="text-xs uppercase tracking-wider text-ink-dark/60 font-medium mb-1">Match</span>
          <span 
            className="font-mono text-3xl font-bold" 
            style={{ color: getScoreColor(match.overall_score) }}
          >
            {Math.round(match.overall_score)}%
          </span>
        </div>
        
        {/* Details Column */}
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-1">
            <h3 className={`font-medium ${isLowScore ? 'text-base' : 'text-lg'}`}>
              {match.matched_report.title}
            </h3>
            <span className="text-xs text-ink-dark/60">{formatRelativeTime(match.matched_report.created_at)}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 text-xs mb-3">
            <Badge variant={match.matched_report.type}>{match.matched_report.type}</Badge>
            <span className="bg-cork/10 px-2 py-0.5 rounded-sm">{match.matched_report.category}</span>
            <span className="flex items-center gap-1 bg-cork/10 px-2 py-0.5 rounded-sm">
              <MapPin size={10} /> {match.matched_report.location_zone}
            </span>
          </div>
          
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-thumbtack-blue flex items-center gap-1 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-thumbtack-blue rounded-sm"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {expanded ? 'Hide breakdown' : 'Show breakdown'}
          </button>
        </div>
        
        {/* Action Column */}
        <div className="flex items-center sm:pl-4 sm:border-l sm:border-cork/20">
          <Link href={`/claim/${match.id}`} className="w-full sm:w-auto">
            <Button variant="success" className="w-full">
              Claim This
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Expandable Section */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-cork/20 animate-fadeIn">
          <div className="bg-paper-white p-4 rounded-sm border border-cork/10 mb-3">
            <ConfidenceBars scores={match.scores} />
          </div>
          <p className="text-sm italic text-ink-dark/70 px-2">
            "{match.explanation}"
          </p>
          {isLowScore && (
            <p className="text-xs text-pin-red mt-2 px-2">
              Note: This is a low-confidence match. Proceed with caution.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
