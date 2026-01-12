import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Article } from '@prisma/client';
import {
  Newspaper, Star, TrendingUp,
} from 'lucide-react';
import { StatsChart } from "./StatsChart";

export interface ArticleStats {
  totalArticles: number;
  featuredCount: number;
  trendingCount: number;
  currentlyFeatured: Pick<Article, 'title' | 'category'>[];
  currentlyTrending: Pick<Article, 'title' | 'category'>[];
  articlesPerCategory: {
    _count: { category: number };
    category: string;
  }[];
}

interface StatsCardProps {
  stats: ArticleStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  return (
    <Card className="min-h-[520px] border-none" >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-x-2 font-heading">
            <Newspaper className="h-6 w-6" />
            <span>Article Statistics</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* --- COLUMN 1: PIE CHART --- */}
          <div className="flex flex-col items-center text-center">
            <h4 className="font-semibold mb-3 text-sm font-heading">Article Overview</h4>
            {/* PASS THE trendingCount PROP HERE */}
            <StatsChart 
                totalArticles={stats.totalArticles} 
                featuredCount={stats.featuredCount} 
                trendingCount={stats.trendingCount}
            />
          </div>

          {/* --- COLUMN 2: FEATURED & TRENDING LISTS --- */}
          <div className="flex flex-col border-l pl-6 space-y-4">
            <div>
              <h4 className="font-semibold mb-3 text-sm font-heading">Currently Featured ({stats.featuredCount} / 7)</h4>
              {stats.currentlyFeatured.length > 0 ? (
                <div className="space-y-2 overflow-y-auto max-h-32 pr-2">
                  {stats.currentlyFeatured.map((article) => (
                    <div key={article.title} className="flex items-start text-sm">
                        <Star className="h-4 w-4 mr-2 mt-1 text-yellow-500 flex-shrink-0" />
                        <div>
                            <p className="font-medium leading-tight">{article.title}</p>
                            <p className="text-xs text-muted-foreground">{article.category}</p>
                        </div>
                    </div>
                  ))}
                </div>
              ) : (<p className="text-sm text-muted-foreground">No articles are featured.</p>)}
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-sm font-heading">Currently Trending ({stats.trendingCount} / 7)</h4>
              {stats.currentlyTrending.length > 0 ? (
                <div className="space-y-2 overflow-y-auto max-h-32 pr-2">
                  {stats.currentlyTrending.map((article) => (
                    <div key={article.title} className="flex items-start text-sm">
                        <TrendingUp className="h-4 w-4 mr-2 mt-1 text-blue-500 flex-shrink-0" />
                        <div>
                            <p className="font-medium leading-tight">{article.title}</p>
                            <p className="text-xs text-muted-foreground">{article.category}</p>
                        </div>
                    </div>
                  ))}
                </div>
              ) : (<p className="text-sm text-muted-foreground">No articles are trending.</p>)}
            </div>
          </div>
          
          {/* --- COLUMN 3: ARTICLES PER CATEGORY --- */}
          <div className="flex flex-col border-l pl-6">
            <h4 className="font-semibold mb-3 text-sm font-heading">Articles Per Category</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              {stats.articlesPerCategory.map((item) => (
                <div key={item.category} className="rounded-md bg-muted p-2">
                  <p className="text-xs font-semibold text-muted-foreground">{item.category}</p>
                  <p className="text-2xl font-bold">{item._count.category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}