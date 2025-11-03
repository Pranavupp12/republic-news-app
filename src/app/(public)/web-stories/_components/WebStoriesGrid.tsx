'use client';

import type { WebStory } from '@prisma/client';
import { StoryGridItem } from './StoryGridItem'; // <-- 1. Import the new component

interface WebStoriesGridProps {
  initialStories: WebStory[];
}

export function WebStoriesGrid({ initialStories }: WebStoriesGridProps) {

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {/* 2. Use the new component in the map loop */}
      {initialStories.map(story => (
        <StoryGridItem key={story.id} story={story} />
      ))}
    </div>
  );
}
