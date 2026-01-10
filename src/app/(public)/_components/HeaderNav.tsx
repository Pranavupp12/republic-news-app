'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; 
import { ARTICLE_CATEGORIES } from '@/lib/constants'; // 1. Import constants

export function HeaderNav() {
  const pathname = usePathname();

  // 2. dynamically build the links array
  const navLinks = [
    { href: '/', name: 'Home' },
    ...ARTICLE_CATEGORIES.map((category) => ({
      href: `/category/${category}`, // Matches your existing URL structure
      name: category,
    })),
    { href: '/web-stories', name: 'Web Stories' },
  ];

  return (
    <div className="md:flex gap-x-6">
      {navLinks.map((link) => {
        // Simple check: exact match OR if it's a category link that matches the start
        // (This helps keep the active state accurate)
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "text-sm p-1 md:p-0 font-medium transition-colors hover:text-red-500 ",
              isActive ? "text-red-500" : "text-muted-foreground" // Changed 'text-red-300' to standard muted, or keep red-300 if you prefer
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}