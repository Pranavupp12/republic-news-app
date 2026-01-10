'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ARTICLE_CATEGORIES } from '@/lib/constants'; // 1. Import constants

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // 2. dynamically build the links array
  const navLinks = [
    { href: '/', name: 'Home' },
    ...ARTICLE_CATEGORIES.map((category) => ({
      href: `/category/${category}`,
      name: category,
    })),
    { href: '/web-stories', name: 'Web Stories' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-8 w-8" />
          <span className="sr-only">Toggle Navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold font-heading text-left">
           Categories
          </SheetTitle>
          <SheetDescription className="sr-only">
            Main site navigation
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col pl-4 space-y-2 mt-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-red-500",
                  isActive ? "text-red-500" : "text-muted-foreground" // standardized color
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}