'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface FilterButtonsProps {
  categories: string[];
  scrollTargetId?: string;
}

export function FilterButtons({ categories, scrollTargetId }: FilterButtonsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current values from URL
  const currentView = searchParams.get('filter') || 'all';
  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';

  // Local state for input
  const [text, setText] = useState(currentSearch);

  // Sync local state with URL if URL changes externally (e.g. back button)
  useEffect(() => {
    setText(currentSearch);
  }, [currentSearch]);

  // 1. MANUAL SEARCH TRIGGER
  const handleSearch = () => {
    // Only search if the text is different from what's already in the URL
    if (text === currentSearch) return;

    const params = new URLSearchParams(searchParams);
    if (text.trim()) {
      params.set('search', text.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset pagination
    
    router.push(`/dashboard?${params.toString()}`, { scroll: false });
    // Optional: Scroll to table
    // scrollToTarget();
  };

  // 2. Handle "Enter" Key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 3. Clear Search
  const clearSearch = () => {
    setText('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    params.set('page', '1');
    router.push(`/dashboard?${params.toString()}`, { scroll: false });
  };

  const handleViewChange = (filter: 'all' | 'today') => {
    const params = new URLSearchParams(searchParams);
    params.set('filter', filter);
    params.set('page', '1');
    router.push(`/dashboard?${params.toString()}`, { scroll: false });
    scrollToTarget();
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    params.set('page', '1');
    router.push(`/dashboard?${params.toString()}`, { scroll: false });
    scrollToTarget();
  };
  
  const scrollToTarget = () => {
    if (scrollTargetId) {
      setTimeout(() => {
        const element = document.getElementById(scrollTargetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
      
      {/* SEARCH BAR GROUP */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-64">
          <Input
            placeholder="Search titles..."
            className="pr-8 h-9" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown} // Trigger search on Enter
          />
          {text && (
            <button 
              onClick={clearSearch}
              className="absolute right-2 top-2.5 text-muted-foreground hover:text-black"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* THE SEARCH BUTTON */}
        <Button 
            size="sm" 
            onClick={handleSearch}
            className="h-9 px-3 border border-gray-200 bg-white text-black hover:bg-gray-100"
        >
            <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Category Select Dropdown */}
      <Select value={currentCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-full sm:w-[180px] h-9">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* View Buttons Group */}
      <div className="flex gap-2 w-full sm:w-auto">
        <Button
          variant={currentView === 'all' ? 'default' : 'outline'}
          size="sm"
          className='flex-1 sm:flex-none border border-gray-200'
          onClick={() => handleViewChange('all')}
        >
          All
        </Button>
        <Button
          variant={currentView === 'today' ? 'default' : 'outline'}
          size="sm"
           className='flex-1 sm:flex-none border border-gray-200'
          onClick={() => handleViewChange('today')}
        >
          Today
        </Button>
      </div>
    </div>
  );
}