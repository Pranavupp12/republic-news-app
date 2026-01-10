// src/components/ArticleCard.tsx
'use client'; 

import type { Article, User } from '@prisma/client';
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from 'react';

type ArticleWithAuthor = Article & {
  author: User | null;
};

interface ArticleCardProps {
  article: ArticleWithAuthor;
  // OPTIMIZATION 1: Accept a priority prop to control lazy loading
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // OPTIMIZATION 2: Use native browser API instead of importing date-fns
    // This removes the need to bundle a library for client-side formatting
    const date = new Date(article.createdAt);
    setFormattedDate(
      date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    );
  }, [article.createdAt]);

  return (
    <Card className="flex flex-col overflow-hidden rounded-none">
      <CardHeader className="p-0 relative">
        <Link href={`/article/${article.slug}`} className="block relative h-60 w-full">
          <Image
            src={article.imageUrl || "https://placehold.co/600x400"}
            alt={article.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            // OPTIMIZATION 1: Only prioritize if explicitly told to (e.g., top 2 items)
            priority={priority}
          />
        </Link>
        <Badge variant="default" className="absolute top-3 right-3 text-xs sm:text-sm">{article.category}</Badge>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-4">
        <CardTitle className="text-lg font-bold mb-1">
          <Link href={`/article/${article.slug}`} className="hover:text-primary transition-colors">{article.title}</Link>
        </CardTitle>
        <p className="text-muted-foreground mb-3 flex-grow line-clamp-3">{article.metaDescription}</p>
        <div className="text-sm text-red-500 mt-auto">
          <span>{article.author?.name || 'Anonymous'}</span>
          <span className="mx-2 text-muted-foreground">|</span>
          <span>{formattedDate || '...'}</span> 
        </div>
      </CardContent>
    </Card>
  );
}