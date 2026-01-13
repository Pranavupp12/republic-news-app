'use client'; 

import type { Article, User } from '@prisma/client';
import Link from "next/link";
import Image from "next/image";
// Badge import removed as it is no longer used
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
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    const date = new Date(article.createdAt);
    setFormattedTime(
      date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    );
  }, [article.createdAt]);

  // SAFEGUARD: Ensure categories is always an array
  const categories = Array.isArray(article.category) 
    ? article.category 
    : (article.category ? [article.category] : []);

  return (
    <Card className="flex flex-col md:flex-row overflow-hidden border-none h-full group">

       {/* Right Side: Image */}
      <div className="relative w-full h-60 md:h-auto md:w-1/2 min-h-[200px] p-3 md:order-last">
        <Link href={`/article/${article.slug}`} className="block w-full h-full relative">
          <Image
            src={article.imageUrl || "https://placehold.co/600x400"}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover "
            priority={priority} 
          />
        </Link>
        
        {/* REMOVED: The Category Badges that were here */}
      </div>

      {/* Left Side: Text Content */}
      <CardContent className="flex flex-col py-3 w-full md:w-1/2 gap-2">
        
        {/* NEW: Categories displayed as text above the title */}
        {categories.length > 0 && (
          <div className="text-xs font-bold text-red-500 uppercase tracking-wider">
            {categories.join(" • ")}
          </div>
        )}

        <h2 className="text-xl font-bold font-heading mb-1">
          <Link href={`/article/${article.slug}`} className="group-hover:underline decoration-red-500 underline-offset-4 decoration-2">
            {article.title}
          </Link>
        </h2>
        
        <p className="text-sm text-muted-foreground line-clamp-4">
          {article.metaDescription}
        </p>
      
        <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
          <span>
            Published at {formattedTime || '...'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}