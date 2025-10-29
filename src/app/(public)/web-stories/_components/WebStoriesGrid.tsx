'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Pusher from 'pusher-js';
import Link from 'next/link';
import Image from 'next/image';
import type { WebStory } from '@prisma/client';

interface WebStoriesGridProps {
  initialStories: WebStory[];
}

export function WebStoriesGrid({ initialStories }: WebStoriesGridProps) {
  const router = useRouter();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
      console.error("Pusher environment variables are not set!");
      return;
    }

    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusherClient.subscribe('stories-channel');

    channel.bind('stories-updated', () => {
      router.refresh();
    });

    return () => {
      pusherClient.unsubscribe('stories-channel');
      pusherClient.disconnect();
    };
  }, [router]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {initialStories.map(story => (
        <Link key={story.id} href={`/web-stories/${story.id}`} className="block relative aspect-[9/16] rounded-lg overflow-hidden group">
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
              {new Date(story.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}