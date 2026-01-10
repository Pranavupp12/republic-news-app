import { prisma } from "@/lib/prisma";
import { NewsGrid } from "./_components/NewsGrid";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { FeaturedArticleCard } from "./_components/FeaturedArticleCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Metadata } from 'next';
import { format } from 'date-fns-tz';
import { unstable_cache } from "next/cache"; // <-- IMPORT THIS

export const metadata: Metadata = {
  title: "Latest US News & Breaking Headlines",
  description: "Get the latest breaking news from the United States, including politics, business, technology, and culture.",
  keywords: ['us news', 'american news', 'breaking news', 'headlines', 'usa news', 'politics', 'business'],
};

const FEATURED_ARTICLES_COUNT = 7;
const ARTICLES_PER_PAGE = 6;

// --- 1. CACHED QUERY FOR TODAY'S ARTICLES ---
const getCachedTodaysArticles = unstable_cache(
  async (today: Date) => {
    return await prisma.article.findMany({
      where: { createdAt: { gte: today } },
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  },
  ['todays-articles'], 
  { revalidate: 60 } // Revalidate every 60 seconds
);

// --- 2. CACHED QUERY FOR FEATURED OLDER ARTICLES ---
const getCachedFeaturedOlderArticles = unstable_cache(
  async (today: Date) => {
    return await prisma.article.findMany({
      take: FEATURED_ARTICLES_COUNT,
      where: {
        isFeatured: true,
        createdAt: { lt: today }
      },
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  },
  ['featured-older-articles'],
  { revalidate: 60 }
);

// --- 3. CACHED QUERY FOR TRENDING ARTICLES ---
const getCachedTrendingArticles = unstable_cache(
  async () => {
    return await prisma.article.findMany({
      where: { isTrending: true },
      take: 7,
      orderBy: { updatedAt: 'desc' },
    });
  },
  ['trending-articles'],
  { revalidate: 60 }
);

interface HomePageProps {
  searchParams: Promise<{ page?: string }>; // Updated for Next.js 15+ await rules
}

export default async function HomePage(props: HomePageProps) {
  const search = await props.searchParams;
  const page = search.page ?? '1';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // --- USE THE CACHED FUNCTIONS ---
  // We run them in parallel for even more speed
  const [todaysArticles, featuredOlderArticles, trendingArticles] = await Promise.all([
    getCachedTodaysArticles(today),
    getCachedFeaturedOlderArticles(today),
    getCachedTrendingArticles(),
  ]);

  // Note: Pagination queries usually shouldn't be heavily cached if they change often, 
  // but since this is "older news", we keep it direct or could cache it too. 
  // For now, let's keep the paginated list direct to ensure accuracy on page changes,
  // as it is less critical for the "Above the Fold" LCP speed.
  
  const totalPaginatedArticles = await prisma.article.count({
    where: {
      isFeatured: { not: true },
      createdAt: { lt: today }
    }
  });

  const totalPages = Math.ceil(Math.max(0, totalPaginatedArticles) / ARTICLES_PER_PAGE);

  const paginatedOlderArticles = await prisma.article.findMany({
    take: ARTICLES_PER_PAGE,
    skip: (Number(page) - 1) * ARTICLES_PER_PAGE,
    where: {
      isFeatured: { not: true },
      createdAt: { lt: today }
    },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  return (
    <main className="container mx-auto py-4 lg:py-10 px-4 lg:px-0">
      {/* --- TOP SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- SWAPPED: LEFT COLUMN IS NOW FEATURED & TRENDING --- */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card>
            <CardContent className="px-4 pt-5 pb-5">
              <h2 className="text-2xl text-red-500 font-bold font-heading mb-2">Featured</h2>
              <div className="space-y-4 max-h-[485px] overflow-y-auto hide-scrollbar pr-2">
                {featuredOlderArticles.length > 0 ? (
                  featuredOlderArticles.map((article, index) => (
                    <div key={article.id}>
                      <Link href={`/article/${article.slug}`} className="block group">
                        <Badge variant="default" className="mb-1 text-xs sm:text-sm">{article.category}</Badge>
                        <h3 className="font-bold font-heading group-hover:text-primary transition-colors">{article.title}</h3>

                        <p className="text-xs text-red-500 mt-1">
                          <span>{article.author?.name || 'Anonymous'}</span>
                          <span className="mx-2 text-muted-foreground">|</span>
                          <span>
                            {format(new Date(article.createdAt), 'MMM d, yyyy, h:mm a', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}
                          </span>
                        </p>

                      </Link>
                      {index < featuredOlderArticles.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No featured articles.</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardContent className="p-4 pt-5 pb-5">
              <h2 className="text-2xl font-bold font-heading mb-2"><span className="text-red-500">Trending</span> Topics</h2>
              <div className="flex flex-wrap gap-2">
                {trendingArticles.length > 0 ? (
                  trendingArticles.map((article) => (
                    <Button key={article.id} variant="secondary" size="sm" asChild>
                      <Link href={`/article/${article.slug}`}>
                        {article.trendingTopic}
                      </Link>
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No trending topics right now.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- SWAPPED: RIGHT COLUMN IS NOW TODAY'S HEADLINES --- */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <Card>
            <CardContent className="pt-5 pb-5">
              <h1 className="text-2xl font-bold font-heading mb-2 text-center"><span className="text-red-500">Today&apos;s</span> Headlines</h1>
              {todaysArticles.length > 0 ? (
                <div className="space-y-8 max-h-[740px] overflow-y-auto hide-scrollbar">
                  {todaysArticles.map((article,index) => (
                    <FeaturedArticleCard key={article.id} article={article} priority={index < 2} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-muted/50 rounded-lg p-8">
                  <p className="text-sm text-muted-foreground">
                    No news published today.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* --- BOTTOM SECTION (Unchanged) --- */}
      {paginatedOlderArticles.length > 0 && (
        <section id="more-news" className="mt-8 lg:mt-12">
          <Separator />
          <h2 className="text-3xl font-bold font-heading my-6 lg:my-8 text-center"><span className="text-red-500">Discover</span> More</h2>
          <NewsGrid initialArticles={paginatedOlderArticles} columns={3} />
          {totalPages > 1 && (
            <div className="mt-12">
              <PaginationControls
                totalPages={totalPages}
                currentPage={Number(page)}
                scrollTargetId="more-news"
              />
            </div>
          )}
        </section>
      )}
    </main>
  );
}