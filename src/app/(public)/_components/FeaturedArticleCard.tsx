'use client'; 

import type { Article, User } from '@prisma/client';
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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

  return (
    // Added 'h-full' to ensure the card takes available height
    <Card className="flex flex-col md:flex-row overflow-hidden border-none h-full">

       {/* Right Side: Image */}
      <div className="relative w-full h-60 md:h-auto md:w-1/2 min-h-[200px] p-3 md:order-last">
        <Link href={`/article/${article.slug}`} className="block w-full h-full relative">
          <Image
            src={article.imageUrl || "https://placehold.co/600x400"}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-md"
            priority={priority} 
          />
        </Link>
        <Badge
          variant="default"
          className="absolute top-5 right-5 z-10 text-xs sm:text-sm"
        >
          {article.category}
        </Badge>
      </div>

      {/* Left Side: Text Content */}
      {/* - Removed 'space-x-2' (this was causing the weird left indentation)
          - Added 'justify-between': Pushes Title to top, Footer to bottom, Desc in middle
          - Added 'gap-2': Ensures minimum spacing so elements don't touch
      */}
      <CardContent className="flex flex-col p-3 w-full md:w-1/2 gap-2">
        <h2 className="text-xl font-bold font-heading mb-2">
          <Link href={`/article/${article.slug}`} className="hover:text-primary transition-colors">
            {article.title}
          </Link>
        </h2>
        
        <p className="text-sm text-muted-foreground line-clamp-4">
          {article.metaDescription}
        </p>
      
        {/* Removed 'mt-auto' because justify-between handles the spacing now */}
        <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
          <span>
            Published at {formattedTime || '...'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}