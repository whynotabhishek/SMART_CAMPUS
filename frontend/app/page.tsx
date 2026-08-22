'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';
import ReportCard from '@/components/ReportCard';
import LoadingState from '@/components/ui/LoadingState';
import type { Report } from '@/lib/types';

export default function Home() {
  const [stats, setStats] = useState({ open_reports: 0, total_matches: 0 });
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, reportsData] = await Promise.all([
          api.getStats().catch(() => ({ open_reports: 0, total_matches: 0 })),
          api.getReports({ limit: '6' }).catch(() => [])
        ]);
        setStats(statsData);
        setReports(reportsData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="font-display text-5xl tracking-wide flex items-center justify-center gap-3">
          <span>📌</span> CampusFind
        </h1>
        <p className="text-xl text-ink-dark/80">
          AI-powered Lost & Found for IIT Delhi
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link href="/report/lost">
            <Button variant="danger" size="lg" className="w-full sm:w-auto">I Lost Something</Button>
          </Link>
          <Link href="/report/found">
            <Button variant="success" size="lg" className="w-full sm:w-auto">I Found Something</Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 gap-4 max-w-2xl mx-auto text-center">
        <div className="bg-paper-white p-6 rounded-sm border border-cork/20">
          <div className="font-mono text-4xl text-thumbtack-blue font-bold mb-1">{stats.open_reports}</div>
          <div className="text-sm text-ink-dark/70 uppercase tracking-wider">Open Reports</div>
        </div>
        <div className="bg-paper-white p-6 rounded-sm border border-cork/20">
          <div className="font-mono text-4xl text-found-green font-bold mb-1">{stats.total_matches}</div>
          <div className="text-sm text-ink-dark/70 uppercase tracking-wider">Successful Matches</div>
        </div>
      </section>

      {/* Recent Reports */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-cork/30 pb-2">
          <h2 className="font-display text-2xl text-ink-dark">Recent Reports</h2>
          <Link href="/browse" className="text-sm text-thumbtack-blue hover:underline">View all →</Link>
        </div>
        
        {loading ? (
          <LoadingState count={6} />
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-ink-dark/60 bg-paper-white/50 border border-cork/20 rounded-sm">
            No recent reports to show.
          </div>
        )}
      </section>
    </div>
  );
}
