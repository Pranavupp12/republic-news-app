'use client';

import type { StorySlide } from '@prisma/client';
import Image from 'next/image';
import { format } from 'date-fns-tz';
import { useState, useEffect } from 'react'; // <-- 1. Import hooks

interface StorySlideComponentProps {
  slide: StorySlide;
  storyTitle: string;
  authorName: string;
  publishedDate: Date;
}

export function StorySlideComponent({ slide, authorName, publishedDate }: StorySlideComponentProps) {
  // 2. Add state for the formatted date
  const [formattedDate, setFormattedDate] = useState('');

  // 3. Use useEffect to format date only on the client-side
  useEffect(() => {
    // This code only runs in the browser, after hydration
    setFormattedDate(
      format(new Date(publishedDate), 'MMM d, yyyy', { 
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone 
      })
    );
  }, [publishedDate]); // Re-run if the prop changes

  return (
    <div className="relative w-full h-full bg-black rounded-lg">
      {/* Image Container */}
      <div className="w-full h-full flex items-center justify-center">
        <Image
          src={slide.imageUrl}
          alt={slide.caption || 'Web Story Slide'}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      
      {/* Caption section at the bottom */}
      {slide.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white text-lg font-bold text-left">
            {slide.caption}
          </p>
          <p className="text-white/80 text-xs mt-2">
            By {authorName} | Published {/* 4. Display the state variable */}
            {formattedDate || '...'}
          </p>
        </div>
      )}
    </div>
  );
};
