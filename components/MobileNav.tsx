'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, ClipboardList, PackageSearch, PlusCircle } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const NavItem = ({ href, icon: Icon, label, active }: { href: string, icon: any, label: string, active: boolean }) => {
    return (
      <Link href={href} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${active ? 'text-white' : 'text-zinc-500'}`}>
        <Icon size={20} className={active ? 'text-white' : ''} />
        <span className="text-[10px] font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-[#0a0a0a] border-t border-zinc-800 flex items-center justify-around z-50 pb-safe">
      <NavItem href="/" icon={LayoutGrid} label="Dashboard" active={pathname === '/'} />
      <NavItem href="/browse" icon={PackageSearch} label="Browse" active={pathname.includes('/browse')} />
      
      {/* Floating Action Button for New Report */}
      <div className="relative -top-5">
        <Link href="/report/found" className="flex items-center justify-center w-12 h-12 bg-white text-black rounded-full shadow-lg hover:bg-zinc-200 transition-colors">
          <PlusCircle size={24} />
        </Link>
      </div>

      <NavItem href="/my-reports" icon={ClipboardList} label="My Reports" active={pathname.includes('/my-reports')} />
    </div>
  );
}
