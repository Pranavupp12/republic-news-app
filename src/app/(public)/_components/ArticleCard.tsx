'use client'; 

import type { Article, User } from '@prisma/client';
import Link from "next/link";
import Image from "next/image";
// Removed Badge import as it is no longer used
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from 'react';

type ArticleWithAuthor = Article & {
  author: User | null;
};

interface ArticleCardProps {
  article: ArticleWithAuthor;
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
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

  // SAFEGUARD: Ensure categories is always an array
  const categories = Array.isArray(article.category) 
    ? article.category 
    : (article.category ? [article.category] : []);

  return (
    <Card className="flex flex-col overflow-hidden border-none rounded-none h-full group">
      <CardHeader className="p-0 relative">
        <Link href={`/article/${article.slug}`} className="block relative h-60 w-full">
          <Image
            src={article.imageUrl || "https://placehold.co/600x400"}
            alt={article.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className=""
          />
        </Link>
        
        {/* REMOVED: Absolute Badge overlay */}
      </CardHeader>
      
      <CardContent className="flex flex-col flex-grow p-4">
        
        {/* UPDATED: Category Text above Title */}
        {categories.length > 0 && (
          <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">
            {categories.join(" • ")}
          </div>
        )}

        <CardTitle className="text-lg font-bold mb-2 leading-tight">
          <Link href={`/article/${article.slug}`} className="group-hover:underline decoration-red-500 underline-offset-4 decoration-2">
            {article.title}
          </Link>
        </CardTitle>
        
        <p className="text-muted-foreground mb-4 flex-grow line-clamp-3 text-sm">
          {article.metaDescription}
        </p>
        
        <div className="text-xs font-medium text-gray-500 mt-auto  tracking-wide border-t pt-3 flex items-center">
          <span className="text-black font-bold uppercase mr-2">{article.author?.name || 'Anonymous'}</span>
          <span className="text-gray-300 mr-2">|</span>
          <span>{formattedDate || '...'}</span> 
        </div>
      </CardContent>
    </Card>
  );
}