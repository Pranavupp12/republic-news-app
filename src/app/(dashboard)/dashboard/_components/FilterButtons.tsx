'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterButtonsProps {
  categories: string[];
  scrollTargetId?: string;
}

export function FilterButtons({ categories, scrollTargetId }: FilterButtonsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentView = searchParams.get('filter') || 'all';
  const currentCategory = searchParams.get('category') || 'all';

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
    <div className="flex items-center gap-x-2">
      {/* Category Select Dropdown */}
      <Select value={currentCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by category..." />
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

      {/* View Buttons */}
      <Button
        variant={currentView === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleViewChange('all')}
      >
        All
      </Button>
      <Button
        variant={currentView === 'today' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleViewChange('today')}
      >
        Today
      </Button>
    </div>
  );
}