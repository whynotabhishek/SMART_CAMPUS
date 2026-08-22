'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CATEGORIES, ZONES } from '@/lib/constants';
import { api } from '@/lib/api';
import ReportCard from '@/components/ReportCard';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Search } from 'lucide-react';
import type { Report } from '@/lib/types';

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const typeParam = searchParams.get('type') || '';
  const categoryParam = searchParams.get('category') || '';
  const zoneParam = searchParams.get('location_zone') || '';
  const searchParam = searchParams.get('search') || '';

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const filters: Record<string, string> = { status: 'open' };
      if (typeParam) filters.type = typeParam;
      if (categoryParam) filters.category = categoryParam;
      if (zoneParam) filters.location_zone = zoneParam;
      if (searchParam) filters.search = searchParam;
      
      const data = await api.getReports(filters);
      setReports(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load reports';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [typeParam, categoryParam, zoneParam, searchParam]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="py-6 space-y-6">
      <h1 className="font-display text-4xl">Browse Reports</h1>
      
      {/* Filters */}
      <div className="bg-[#151515] p-4 rounded-lg border border-zinc-800 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-white mb-1">Type</label>
          <div className="flex bg-zinc-800 p-1 rounded-lg">
            <button 
              className={`flex-1 py-1 text-sm rounded-lg transition ${!typeParam ? 'bg-[#151515] shadow-sm' : ''}`}
              onClick={() => updateFilter('type', '')}
            >All</button>
            <button 
              className={`flex-1 py-1 text-sm rounded-lg transition ${typeParam === 'lost' ? 'bg-red-500 text-white' : ''}`}
              onClick={() => updateFilter('type', 'lost')}
            >Lost</button>
            <button 
              className={`flex-1 py-1 text-sm rounded-lg transition ${typeParam === 'found' ? 'bg-emerald-500 text-white' : ''}`}
              onClick={() => updateFilter('type', 'found')}
            >Found</button>
          </div>
        </div>
        
        <Select 
          id="category-filter" label="Category" 
          value={categoryParam} onChange={(e) => updateFilter('category', e.target.value)}
          options={[{ value: '', label: 'All Categories' }, ...CATEGORIES.map(c => ({ value: c, label: c }))]}
        />
        
        <Select 
          id="zone-filter" label="Location Zone" 
          value={zoneParam} onChange={(e) => updateFilter('location_zone', e.target.value)}
          options={[{ value: '', label: 'All Zones' }, ...ZONES.map(z => ({ value: z, label: z }))]}
        />
        
        <div className="relative">
          <Input 
            id="search" label="Search" 
            defaultValue={searchParam}
            onBlur={(e) => updateFilter('search', (e.target as HTMLInputElement).value)}
            onKeyDown={(e) => e.key === 'Enter' && updateFilter('search', (e.target as HTMLInputElement).value)}
            placeholder="Search titles..." 
          />
          <Search size={16} className="absolute right-3 top-9 text-white/40" />
        </div>
      </div>
      
      <div className="text-sm text-white/70 font-medium">
        Showing {reports.length} reports
      </div>

      {loading ? (
        <LoadingState count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchReports} />
      ) : reports.length === 0 ? (
        <EmptyState title="No results found" message="Try adjusting your filters to find what you're looking for." />
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

export default function BrowsePage() {
  return (
    <Suspense fallback={<LoadingState count={6} />}>
      <BrowseContent />
    </Suspense>
  );
}
