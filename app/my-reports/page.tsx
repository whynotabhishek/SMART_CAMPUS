'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import ReportCard from '@/components/ReportCard';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import type { Report } from '@/lib/types';

export default function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would filter by the logged-in user's ID.
    // For this demo, we'll fetch all reports and just show the first few to simulate "My Reports".
    api.getReports().then(data => {
      setReports(data.slice(0, 2)); // Simulate 2 active reports for the current user
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-10 max-w-[1200px] mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">My Reports</h1>
        <p className="text-zinc-400">Manage the items you have reported as lost or found.</p>
      </div>

      {loading ? (
        <LoadingState count={3} />
      ) : reports.length === 0 ? (
        <EmptyState title="No reports found" message="You haven't reported any items yet." actionLabel="Report an Item" actionHref="/report/lost" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map(report => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
