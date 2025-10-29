  
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { cn } from '@/lib/utils'; // Import cn utility
import type { Article, User } from '@prisma/client';
import { format } from 'date-fns-tz';

type ArticleWithAuthor = Article & {
  author: User | null;
};

interface NewsGridProps {
  initialArticles: ArticleWithAuthor[];
  columns?: 2 | 3; // Add an optional columns prop
}

export function NewsGrid({ initialArticles, columns = 3 }: NewsGridProps) {
  const router = useRouter();
  
  // Dynamically set the grid columns class
  const gridClass = cn(
    "grid grid-cols-1 md:grid-cols-2 gap-8",
    columns === 3 && "lg:grid-cols-3"
  );

  return (
    <div className={gridClass}>
      {initialArticles.map((article) => (
        <Card key={article.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="p-0 relative">
            {/* CHANGE: Reduced image height from h-56 to h-48 */}
            <Link href={`/article/${article.slug}`} className="block relative h-48 w-full">
              <Image
                src={article.imageUrl || "https://placehold.co/600x400"}
                alt={article.title}
                fill
                sizes={columns === 3 ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : "(max-width: 768px) 100vw, 50vw"}
                style={{ objectFit: "cover" }}
              />
            </Link>
            <Badge variant="default" className="absolute top-3 right-3">{article.category}</Badge>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow p-4">
            {/* CHANGE: Reduced title size from text-xl to text-lg */}
            <CardTitle className="text-lg font-bold mb-2">
              <Link href={`/article/${article.slug}`} className="hover:text-primary transition-colors">{article.title}</Link>
            </CardTitle>
            <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">{article.metaDescription}</p>
            <div className="text-sm text-red-500 mt-auto">
              <span>{article.author?.name || 'Anonymous'}</span>
              <span className="mx-2 text-muted-foreground">|</span>
              <span>{format(new Date(article.createdAt), 'MMM d, yyyy, h:mm a', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}