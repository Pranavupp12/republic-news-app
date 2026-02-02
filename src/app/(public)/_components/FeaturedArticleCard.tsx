'use client'; 

import type { Article, User } from '@prisma/client';
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from 'react';

type ArticleWithAuthor = Article & {
  author: User | null;
};

interface FeaturedArticleCardProps {
  article: ArticleWithAuthor;
  priority?: boolean;
}

export function FeaturedArticleCard({ article, priority = false }: FeaturedArticleCardProps) {
  // State to hold the smart date string (e.g., "Published Yesterday at 5:00 PM")
  const [dateLabel, setDateLabel] = useState('');

  useEffect(() => {
    const articleDate = new Date(article.createdAt);
    const now = new Date();

    // Format the time part (e.g., "3:30 PM")
    const timeString = articleDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Check if the date is Today
    const isToday = articleDate.toDateString() === now.toDateString();

    // Check if the date is Yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = articleDate.toDateString() === yesterday.toDateString();

    if (isToday) {
      setDateLabel(`Published at ${timeString}`);
    } else if (isYesterday) {
      setDateLabel(`Published Yesterday at ${timeString}`);
    } else {
      // Fallback for older articles (e.g., "Published on Jan 15 at 3:30 PM")
      const dateString = articleDate.toLocaleDateString('en-US', {
        month: 'short', 
        day: 'numeric'
      });
      setDateLabel(`Published on ${dateString} at ${timeString}`);
    }

  }, [article.createdAt]);

  // Ensure categories is always an array
  const categories = Array.isArray(article.category) 
    ? article.category 
    : (article.category ? [article.category] : []);

  return (
    <Card className="flex flex-col md:flex-row overflow-hidden border-none h-full group">

       {/* Right Side: Image (md:order-last pushes it to the right on desktop) */}
      <div className="relative w-full h-60 md:h-auto md:w-1/2 min-h-[240px] p-3 md:order-last">
        <Link href={`/article/${article.slug}`} className="block w-full h-full relative overflow-hidden rounded-none">
          <Image
            src={article.imageUrl || "https://placehold.co/600x400"}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority={priority}
          />
        </Link>
      </div>

      {/* Left Side: Text Content */}
      <CardContent className="flex flex-col py-3 w-full md:w-1/2 gap-3 justify-center">
        
        {/* Categories (Red, Bold, Uppercase) */}
        {categories.length > 0 && (
          <div className="text-xs font-bold text-red-600 uppercase tracking-wider">
            {categories.join(" • ")}
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold font-heading leading-tight mb-1">
          <Link href={`/article/${article.slug}`} className="group-hover:underline decoration-red-500 underline-offset-4 decoration-2">
            {article.title}
          </Link>
        </h2>
        
        {/* Description (Limited to 3 lines) */}
        <p className="text-sm md:text-md text-muted-foreground line-clamp-3">
          {article.metaDescription}
        </p>
      
        {/* Smart Date Footer */}
        <div className="text-xs text-muted-foreground border-t pt-3 mt-1 font-medium">
          {dateLabel || 'Loading...'}
        </div>
      </CardContent>
    </Card>
  );
}