'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, LayoutGrid, ClipboardList, PackageSearch, Settings, HelpCircle } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const NavItem = ({ href, icon: Icon, label, active }: { href: string, icon: any, label: string, active?: boolean }) => {
    const isActive = active !== undefined ? active : pathname === href;
    return (
      <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${isActive ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}>
        <Icon size={18} className={isActive ? 'text-black' : ''} />
        {label}
      </Link>
    );
  };

  return (
    <aside className="hidden md:flex w-[260px] h-screen bg-[#0a0a0a] border-r border-zinc-800/50 flex-col flex-shrink-0 sticky top-0 left-0 text-white">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-2">
        <div className="bg-white text-black p-1.5 rounded-full flex items-center justify-center">
          <Search size={16} strokeWidth={3} />
        </div>
        <span className="font-bold text-xl tracking-tight">CampusFind</span>
      </div>

      {/* User Profile Widget */}
      <div className="px-4 mb-6">
        <div className="bg-[#1a1a1a] rounded-xl p-3 flex items-center gap-3 border border-zinc-800/50">
          <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden flex-shrink-0">
            {/* Placeholder for User Avatar */}
            <img src="https://i.pravatar.cc/150?u=alex" alt="Alex Rivers" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white leading-tight">Alex Rivers</span>
            <span className="text-xs text-zinc-400">Campus Member</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        <NavItem href="/" icon={LayoutGrid} label="Dashboard" active={pathname === '/'} />
        <NavItem href="/my-reports" icon={ClipboardList} label="My Reports" active={pathname.includes('/my-reports')} />
        <NavItem href="/browse" icon={PackageSearch} label="Browse All" active={pathname.includes('/browse') || pathname.includes('/matches')} />
        
        <div className="pt-6 pb-2">
          <span className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Actions</span>
        </div>
        
        <Link href="/report/lost" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
          Report Lost Item
        </Link>

        <Link href="/report/found" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          Report Found Item
        </Link>
      </nav>

      {/* Bottom Links */}
      <div className="p-4 space-y-1 mb-2">
        <NavItem href="/settings" icon={Settings} label="Settings" active={false} />
        <NavItem href="/help" icon={HelpCircle} label="Help" active={false} />
      </div>
    </aside>
  );
}
