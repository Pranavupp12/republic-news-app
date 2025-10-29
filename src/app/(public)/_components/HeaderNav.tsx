'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; 

// Define your navigation links
const navLinks = [
  { href: '/', name: 'Home' },
  { href: '/category/Technology', name: 'Technology' },
  { href: '/category/Travel', name: 'Travel' },
  { href: '/category/Sports', name: 'Sports' },
  { href: '/category/Business', name: 'Business' },
  { href: '/category/Culture', name: 'Culture' },
  { href: '/category/News', name: 'News' },
  { href: '/web-stories', name: 'Web Stories' },
];

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex gap-x-6">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-red-500",
              isActive ? "text-red-500" : "text-red-300"
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}