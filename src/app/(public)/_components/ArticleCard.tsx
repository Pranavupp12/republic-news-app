
'use client'; 

import type { Article, User } from '@prisma/client';
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns-tz';

// Define the expected prop type
type ArticleWithAuthor = Article & {
  author: User | null;
};

interface ArticleCardProps {
  article: ArticleWithAuthor;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card key={article.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <Link href={`/article/${article.slug}`} className="block relative h-48 w-full">
          <Image
            src={article.imageUrl || "https://placehold.co/600x400"}
            alt={article.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Assuming 3 columns, adjust if needed
          />
        </Link>
        <Badge variant="default" className="absolute top-3 right-3">{article.category}</Badge>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-4">
        <CardTitle className="text-lg font-bold mb-2">
          <Link href={`/article/${article.slug}`} className="hover:text-primary transition-colors">{article.title}</Link>
        </CardTitle>
        <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">{article.metaDescription}</p>
        <div className="text-sm text-red-500 mt-auto"> {/* Use muted-foreground for consistency */}
          <span>{article.author?.name || 'Anonymous'}</span>
          <span className="mx-2 text-muted-foreground">|</span>
          {/* Date formatting happens here, on the client */}
          <span>{format(new Date(article.createdAt), 'MMM d, yyyy, h:mm a', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}</span>
        </div>
      </CardContent>
    </Card>
  );
}