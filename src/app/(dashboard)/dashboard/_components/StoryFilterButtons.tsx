'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function StoryFilterButtons() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilter = searchParams.get('storyFilter') || 'all';

  const handleFilterClick = (filter: 'all' | 'today') => {
    const params = new URLSearchParams(searchParams);
    params.set('storyFilter', filter);
    params.set('storyPage', '1'); // Reset to page 1
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        variant={currentFilter === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleFilterClick('all')}
      >
        All
      </Button>
      <Button
        variant={currentFilter === 'today' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleFilterClick('today')}
      >
        Today
      </Button>
    </div>
  );
}