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
  SheetDescription // <-- Import the sheet components
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-8 w-8" />
          <span className="sr-only">Toggle Navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        {/* --- THIS IS THE FIX --- */}
        <SheetHeader>
          <SheetTitle className="text-lg font-bold font-heading text-left">
           Categories
          </SheetTitle>
          {/* We can use SheetDescription to label the navigation */}
          <SheetDescription className="sr-only">
            Main site navigation
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col pl-5 space-y-2 mt-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-red-500",
                  isActive ? "text-red-500" : "text-red-300"
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