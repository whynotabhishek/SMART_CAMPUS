import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { truncate, formatRelativeTime } from '@/lib/utils';
import type { Report } from '@/lib/types';

export default function ReportCard({ report }: { report: Report }) {
  return (
    <Link href={`/matches/${report.id}`} className="block h-full">
      <Card type={report.type} pinned className="h-full flex flex-col group cursor-pointer hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <Badge variant={report.type}>{report.type}</Badge>
          <span className="text-xs text-white/60">{formatRelativeTime(report.created_at)}</span>
        </div>
        
        <h3 className="font-medium text-lg text-white mb-1 group-hover:text-blue-400 transition-colors">
          {report.title}
        </h3>
        
        <p className="text-sm text-white/70 mb-4 flex-grow line-clamp-2">
          {truncate(report.description, 100)}
        </p>
        
        <div className="flex flex-wrap gap-2 text-xs text-white/70 mt-auto pt-3 border-t border-zinc-800">
          <span className="bg-zinc-800 px-2 py-1 rounded-lg">{report.category}</span>
          <span className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-lg">
            <MapPin size={12} /> {report.location_zone}
          </span>
        </div>
      </Card>
    </Link>
  );
}
