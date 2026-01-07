'use client';

import { cn } from '@/lib/utils'; // Import cn utility
import type { Article, User } from '@prisma/client';
import { ArticleCard } from './ArticleCard'; // <-- 1. Import the ArticleCard component (assuming it's in the same folder)

type ArticleWithAuthor = Article & {
  author: User | null;
};

interface NewsGridProps {
  initialArticles: ArticleWithAuthor[];
  columns?: 2 | 3; // Add an optional columns prop
}

export function NewsGrid({ initialArticles, columns = 3 }: NewsGridProps) {
  // 2. Removed the unused 'useRouter' hook. 
  //    (We still need 'use client' for the nested ArticleCard's client-side date formatting)
  
  // Dynamically set the grid columns class
  const gridClass = cn(
    "grid grid-cols-1 md:grid-cols-2 gap-8",
    columns === 3 && "lg:grid-cols-3"
  );

  return (
    <div className={gridClass}>
      {/* 3. Replaced the duplicated card code with the ArticleCard component */}
      {initialArticles.map((article, index) => (
        <ArticleCard key={article.id} article={article} priority={index < 3} />
      ))}
    </div>
  );
}