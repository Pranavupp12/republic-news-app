'use client'; // <-- 1. Add 'use client' directive

import type { Article, User } from '@prisma/client';
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from 'date-fns-tz';
import { useState, useEffect } from 'react'; // <-- 2. Import hooks

type ArticleWithAuthor = Article & {
  author: User | null;
};

interface FeaturedArticleCardProps {
  article: ArticleWithAuthor;
}

export function FeaturedArticleCard({ article }: FeaturedArticleCardProps) {
  // 3. Add state for the formatted date
  const [formattedDate, setFormattedDate] = useState('');

  // 4. Use useEffect to format date only on the client-side
  useEffect(() => {
    // This code only runs in the browser, after hydration
    setFormattedDate(
      format(new Date(article.createdAt), 'h:mm a', { 
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone 
      })
    );
  }, [article.createdAt]); // Re-run if the article prop changes

  return (
    <Card className="flex flex-col md:flex-row overflow-hidden  transition-shadow duration-300">

       {/* Right Side: Image */}
      <div className="relative w-full h-48 md:h-auto md:w-1/2 min-h-[200px] md:min-h-0 p-3 md:order-last">
        <Link href={`/article/${article.slug}`} className="block w-full h-full relative">
          <Image
            src={article.imageUrl || "https://placehold.co/600x400"}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-md"
            priority
          />
        </Link>
        <Badge
          variant="default"
          className="absolute top-5 right-5 z-10"
        >
          {article.category}
        </Badge>
      </div>

      {/* Left Side: Text Content */}
      <CardContent className="flex flex-col p-3 w-full md:w-1/2">
        <h2 className="text-xl font-bold font-heading mb-2">
          <Link href={`/article/${article.slug}`} className="hover:text-primary transition-colors">
            {article.title}
          </Link>
        </h2>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {article.metaDescription}
        </p>
      
        <div className="text-xs text-red-500 mt-auto"> {/* Changed red-500 back to muted-foreground */}
          <span>
            {/* 5. Display the state variable */}
            Published at {formattedDate || '...'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
