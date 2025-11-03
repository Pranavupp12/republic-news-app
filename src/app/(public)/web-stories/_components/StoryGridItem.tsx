'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { WebStory } from '@prisma/client';
import { format } from 'date-fns-tz';

interface StoryGridItemProps {
  story: WebStory;
}

export function StoryGridItem({ story }: StoryGridItemProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // This code only runs in the browser, after hydration
    setFormattedDate(
      format(new Date(story.createdAt), 'MMM d, yyyy', { 
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone 
      })
    );
  }, [story.createdAt]); // Re-run if the story prop changes

  return (
    <Link href={`/web-stories/${story.id}`} className="block relative aspect-[9/16] rounded-lg overflow-hidden group">
      <Image 
        src={story.coverImage} 
        alt={story.title} 
        fill 
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-start text-left">
        <p className="text-white font-bold text-sm mb-1 line-clamp-2">{story.title}</p>
        <p className="text-white/80 text-xs">
          {formattedDate || '...'} {/* Display the formatted date */}
        </p>
      </div>
    </Link>
  );
}