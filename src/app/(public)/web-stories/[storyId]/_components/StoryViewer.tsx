'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { WebStory, StorySlide, User } from '@prisma/client';
import { StorySlideComponent } from './StorySlideComponent';
import { Button } from '@/components/ui/button'; 
import { X, ChevronLeft, ChevronRight } from 'lucide-react'; 
import { cn } from '@/lib/utils';

type StoryWithSlidesAndAuthor = WebStory & {
    slides: StorySlide[];
    author: User | null;
}

interface StoryViewerProps {
  story: StoryWithSlidesAndAuthor;
}

export function StoryViewer({ story }: StoryViewerProps) {
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const goToNext = () => {
    setCurrentSlideIndex((prevIndex) => Math.min(prevIndex + 1, story.slides.length - 1));
  };

  const goToPrevious = () => {
    setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const currentSlide = story.slides[currentSlideIndex];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      {/* Close Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 hover:text-white"
        onClick={() => router.push('/web-stories')}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Main Container */}
      <div className="flex items-center justify-center w-full max-w-xl">
        {/* Previous Button */}
        <Button 
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 hover:text-white mr-4 disabled:opacity-30"
          onClick={goToPrevious}
          disabled={currentSlideIndex === 0}
        >
          <ChevronLeft className="h-10 w-10" />
        </Button>

        {/* Story Content */}
        <div className="relative w-full max-w-sm aspect-[9/16] rounded-lg overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-2 left-2 right-2 z-20 flex items-center gap-x-1">
            {story.slides.map((_, index) => (
              <div key={index} className="h-1 flex-grow rounded-full bg-white/40">
                <div 
                  className={cn("h-1 rounded-full bg-white transition-all duration-300", index <= currentSlideIndex ? "w-full" : "w-0")}
                />
              </div>
            ))}
          </div>
          
          {/* Render the current slide */}
          <StorySlideComponent slide={currentSlide} storyTitle={story.title}  authorName={story.author?.name || 'Anonymous'}  publishedDate={story.createdAt} />
        </div>
        
        {/* Next Button */}
        <Button 
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 hover:text-white ml-4 disabled:opacity-30"
          onClick={goToNext}
          disabled={currentSlideIndex === story.slides.length - 1}
        >
          <ChevronRight className="h-10 w-10" />
        </Button>
      </div>
    </div>
  );
}