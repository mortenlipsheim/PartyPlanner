'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PartyPopper, UsersRound } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppHeader() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Fêtes' },
    { href: '/neighbors', label: 'Voisins' },
  ];

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-2xl font-headline font-bold">
          <PartyPopper className="w-8 h-8 text-primary" />
          <span>Hohwald Party</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
