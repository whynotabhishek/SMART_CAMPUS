'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils';
import type { Report, MatchResult } from '@/lib/types';
import { MapPin } from 'lucide-react';

export default function MatchesPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [report, setReport] = useState<Report | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [reportData, matchesData] = await Promise.all([
        api.getReport(id),
        api.getMatches(id)
      ]);
      setReport(reportData);
      setMatches(matchesData.matches);
    } catch (err: any) {
      setError(err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="py-8"><LoadingState count={3} /></div>;
  if (error) return <div className="py-8"><ErrorState message={error} onRetry={fetchData} /></div>;
  if (!report) return null;

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Original Report Summary */}
      <div className="bg-cork/10 border-l-4 border-cork p-4 rounded-sm mb-8">
        <h2 className="text-sm font-medium text-ink-dark/60 uppercase tracking-wider mb-2">Your Report</h2>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-lg">{report.title}</h3>
            <p className="text-sm text-ink-dark/80 line-clamp-1">{report.description}</p>
          </div>
          <Badge variant={report.type}>{report.type}</Badge>
        </div>
        <div className="flex gap-4 mt-2 text-xs text-ink-dark/60">
          <span className="flex items-center gap-1"><MapPin size={12} /> {report.location_zone}</span>
          <span>{formatRelativeTime(report.created_at)}</span>
        </div>
      </div>

      <h2 className="font-display text-3xl mb-6">Potential Matches</h2>
      
      {matches.length === 0 ? (
        <EmptyState 
          title="No matches found yet" 
          message="We'll keep looking. Check back later or make sure your report details are accurate." 
        />
      ) : (
        <div className="space-y-4">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} reportType={report.type} />
          ))}
        </div>
      )}
    </div>
  );
}
