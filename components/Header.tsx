'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Plus } from 'lucide-react';
import Button from './ui/Button';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => pathname === path ? 'font-bold' : '';

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#151515]/80 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl text-white flex items-center">
          📌 CampusFind
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={`hover:text-blue-400 transition ${isActive('/')}`}>Home</Link>
          <Link href="/browse" className={`hover:text-blue-400 transition ${isActive('/browse')}`}>Browse</Link>
          <div className="flex gap-3">
            <Link href="/report/lost">
              <Button variant="danger" size="sm" className="flex items-center gap-1">
                <Plus size={16} /> Report Lost
              </Button>
            </Link>
            <Link href="/report/found">
              <Button variant="success" size="sm" className="flex items-center gap-1">
                <Plus size={16} /> Report Found
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-white" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#151515] border-b border-zinc-800 p-4 flex flex-col gap-4 absolute w-full shadow-lg">
          <Link href="/" onClick={toggleMenu} className={`block p-2 hover:bg-zinc-800 rounded ${isActive('/')}`}>Home</Link>
          <Link href="/browse" onClick={toggleMenu} className={`block p-2 hover:bg-zinc-800 rounded ${isActive('/browse')}`}>Browse</Link>
          <div className="flex flex-col gap-2 mt-2">
            <Link href="/report/lost" onClick={toggleMenu}>
              <Button variant="danger" className="w-full justify-center">Report Lost Item</Button>
            </Link>
            <Link href="/report/found" onClick={toggleMenu}>
              <Button variant="success" className="w-full justify-center">Report Found Item</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
