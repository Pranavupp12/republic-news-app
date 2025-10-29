'use client';

import type { Article, User } from '@prisma/client';
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from 'date-fns-tz';

type ArticleWithAuthor = Article & {
  author: User | null;
};

interface FeaturedArticleCardProps {
  article: ArticleWithAuthor;
}

export function FeaturedArticleCard({ article }: FeaturedArticleCardProps) {
  return (
    <Card className="flex flex-col md:flex-row overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      
      {/* Left Side: Text Content */}
      {/* CHANGE: Reduced padding from px-6 py-4 to p-4 */}
      <CardContent className="flex flex-col p-3 w-full md:w-1/2">
        {/* CHANGE: Reduced heading size from text-2xl to text-xl */}
        <h2 className="text-xl font-bold font-heading mb-2">
          <Link href={`/article/${article.slug}`} className="hover:text-primary transition-colors">
            {article.title}
          </Link>
        </h2>
        {/* CHANGE: Reduced line-clamp from 3 to 2 */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {article.metaDescription}
        </p>
      
        <div className="text-xs text-red-500 mt-auto">
          <span>
            Published at {format(new Date(article.createdAt), 'h:mm a', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}
          </span>
        </div>
      </CardContent>

      {/* Right Side: Image */}
      {/* CHANGE: Reduced min-height from 250px to 200px and padding */}
      <div className="relative w-full md:w-1/2 min-h-[200px] md:min-h-0 p-3">
        <Link href={`/article/${article.slug}`} className="block w-full h-full relative">
          <Image
            src={article.imageUrl || "https://placehold.co/600x400"}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-md"
          />
        </Link>
        <Badge
          variant="default"
          className="absolute top-5 right-5 z-10"
        >
          {article.category}
        </Badge>
      </div>
    </Card>
  );
}
