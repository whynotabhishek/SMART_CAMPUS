'use client';
import Link from 'next/link';
import { Download, Plus, Archive, Handshake, CheckCircle2, MoreHorizontal, MapPin, Clock } from 'lucide-react';

export default function DashboardOverview() {
  return (
    <div className="p-10 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Overview</h1>
          <p className="text-zinc-400">Track your reported items and matches.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button className="flex-1 md:flex-none items-center justify-center flex gap-2 px-4 py-2.5 rounded-lg border border-zinc-700 text-sm font-medium hover:bg-zinc-800 transition-colors">
            <Download size={16} /> EXPORT
          </button>
          <Link href="/report/lost" className="flex-1 md:flex-none items-center justify-center flex gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors">
            <Plus size={18} /> New Report
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* Active Reports */}
        <div className="bg-[#151515] rounded-2xl p-6 relative overflow-hidden border border-zinc-800/60">
          <Archive size={120} className="absolute -right-6 -bottom-6 text-zinc-800/30" strokeWidth={1.5} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 tracking-wide text-xs font-semibold text-zinc-400 uppercase">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              ACTIVE REPORTS
            </div>
            <div className="text-6xl font-bold text-white mb-4">04</div>
            <div className="text-sm text-zinc-400">
              <span className="text-emerald-400 font-medium">↗ +1</span> since last week
            </div>
          </div>
        </div>

        {/* Potential Matches */}
        <div className="bg-[#151515] rounded-2xl p-6 relative overflow-hidden border border-zinc-800/60">
          <Handshake size={140} className="absolute -right-8 -bottom-8 text-zinc-800/30 -rotate-12" strokeWidth={1.5} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 tracking-wide text-xs font-semibold text-zinc-400 uppercase">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              POTENTIAL MATCHES
            </div>
            <div className="text-6xl font-bold text-white mb-4">12</div>
            <div className="text-sm text-zinc-400">Requires your review</div>
          </div>
        </div>

        {/* Items Recovered */}
        <div className="bg-[#151515] rounded-2xl p-6 relative overflow-hidden border border-zinc-800/60">
          <CheckCircle2 size={120} className="absolute -right-6 -bottom-6 text-zinc-800/30" strokeWidth={1.5} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 tracking-wide text-xs font-semibold text-zinc-400 uppercase">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              ITEMS RECOVERED
            </div>
            <div className="text-6xl font-bold text-white mb-4">02</div>
            <div className="text-sm text-zinc-400">This semester</div>
          </div>
        </div>
      </div>

      {/* Priority Matches */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Priority Matches</h2>
        <Link href="/matches" className="text-sm font-semibold tracking-wide text-zinc-400 hover:text-white transition-colors uppercase">
          VIEW ALL →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Match Card 1 */}
        <div className="bg-[#151515] rounded-2xl p-5 border border-zinc-800/60 flex flex-col">
          <div className="flex gap-5 mb-5">
            <div className="w-32 h-32 rounded-xl bg-zinc-800 flex-shrink-0 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&q=80" alt="HydroFlask" className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div className="bg-black text-xs font-bold px-2 py-1 rounded-md text-zinc-300 border border-zinc-800">
                  98% MATCH
                </div>
                <button className="text-zinc-500 hover:text-white"><MoreHorizontal size={20} /></button>
              </div>
              <h3 className="font-bold text-white text-lg mb-1.5 leading-tight">Matte Black HydroFlask</h3>
              <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                Found near the Main Library, 2nd floor study area. Has a small dent on the bottom rim. Black cap with a standard loop handle.
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-zinc-800/50">
            <div className="flex items-center gap-1.5 text-sm text-zinc-400">
              <MapPin size={16} /> Main Library
            </div>
            <Link href="/matches/mock-1" className="px-5 py-2 text-sm font-medium rounded-lg border border-zinc-700 hover:bg-zinc-800 transition-colors">
              Review
            </Link>
          </div>
        </div>

        {/* Match Card 2 */}
        <div className="bg-[#151515] rounded-2xl p-5 border border-zinc-800/60 flex flex-col">
          <div className="flex gap-5 mb-5">
            <div className="w-32 h-32 rounded-xl bg-zinc-800 flex-shrink-0 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&q=80" alt="Headphones" className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div className="bg-black text-xs font-bold px-2 py-1 rounded-md text-zinc-300 border border-zinc-800">
                  85% MATCH
                </div>
                <button className="text-zinc-500 hover:text-white"><MoreHorizontal size={20} /></button>
              </div>
              <h3 className="font-bold text-white text-lg mb-1.5 leading-tight">Sony WH-1000XM4</h3>
              <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                Left in Student Union cafeteria booth. Black color, in original carrying case. Seems to have a custom sticker removed.
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-zinc-800/50">
            <div className="flex items-center gap-1.5 text-sm text-zinc-400">
              <Clock size={16} /> 2 hours ago
            </div>
            <Link href="/matches/mock-2" className="px-5 py-2 text-sm font-medium rounded-lg border border-zinc-700 hover:bg-zinc-800 transition-colors">
              Review
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
