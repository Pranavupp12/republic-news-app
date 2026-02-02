'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; 
import { ARTICLE_CATEGORIES } from '@/lib/constants'; 

export function HeaderNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', name: 'Home' },
    ...ARTICLE_CATEGORIES.map((category) => ({
      href: `/category/${category}`,
      name: category,
    })),
    { href: '/web-stories', name: 'Web Stories' },
  ];

  return (
    <div className="md:flex gap-x-6"> {/* Increased gap slightly for better spacing */}
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.name}
            href={link.href}
            // 1. Add 'group' and 'relative' to the parent Link
            className={cn(
              "relative group flex items-center h-full text-sm font-medium transition-colors hover:text-red-500",
              isActive ? "text-red-600" : "text-muted-foreground"
            )}
          >
            {link.name}
            
            {/* 2. The Animated Underline Span */}
            <span 
                className={cn(
                    "absolute bottom-[-16px]  left-0 w-full h-[3px] bg-red-500 transition-transform duration-300 ease-out origin-center",
                    // If active, keep it scaled to 100%. If not, scale to 0 (invisible).
                    // On hover (group-hover), scale to 100%.
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                )}
            />
          </Link>
        );
      })}
    </div>
  );
}