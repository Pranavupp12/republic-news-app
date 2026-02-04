import { prisma } from "@/lib/prisma";
import { NewsGrid } from "./_components/NewsGrid";
import { PaginationControls } from "@/components/ui/PaginationControls";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { FeaturedArticleCard } from "./_components/FeaturedArticleCard";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image"; 
import type { Metadata } from 'next';
import { format } from 'date-fns-tz';
import { unstable_cache } from "next/cache";
import { EntertainmentCarousel } from "./_components/EntertainmentCarousel";
import { DiscoverNewsLayout } from "./_components/DiscoverNewsLayout";
import { cn } from "@/lib/utils";
import { Suspense } from "react"; // 1. Import Suspense
import { Skeleton } from "@/components/ui/skeleton"; // 2. Import Skeleton for fallbacks

export const metadata: Metadata = {
  title: "Latest US News & Breaking Headlines",
  description: "Get the latest breaking news from the United States, including politics, business, technology, and culture.",
  keywords: ['us news', 'american news', 'breaking news', 'headlines', 'usa news', 'politics', 'business'],
};

const FEATURED_ARTICLES_COUNT = 7;

// --- DATA FETCHERS (Kept exactly as they were) ---

const getCachedHeadlines = unstable_cache(
  async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysArticles = await prisma.article.findMany({
      where: { createdAt: { gte: today } },
      orderBy: { createdAt: 'desc' },
      include: { author: true },
      take: 50,
    });
    const MIN_HEADLINES = 5; 
    if (todaysArticles.length < MIN_HEADLINES) {
      const needed = MIN_HEADLINES - todaysArticles.length;
      const olderBackfill = await prisma.article.findMany({
        where: { createdAt: { lt: today } },
        orderBy: { createdAt: 'desc' },
        include: { author: true },
        take: needed,
      });
      return [...todaysArticles, ...olderBackfill];
    }
    return todaysArticles;
  },
  ['headlines-articles-adaptive-v3'],
  { revalidate: 60 }
);

const getCachedFeaturedOlderArticles = unstable_cache(
  async (excludeIds: string[]) => {
    return await prisma.article.findMany({
      take: FEATURED_ARTICLES_COUNT,
      where: { isFeatured: true, id: { notIn: excludeIds } },
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  },
  ['featured-older-articles'],
  { revalidate: 60 }
);

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

const getCachedEntertainmentArticles = unstable_cache(
  async () => {
    return await prisma.article.findMany({
      where: { category: { has: 'Entertainment' } },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  },
  ['entertainment-articles-home'],
  { revalidate: 60 }
);

// --- MAIN PAGE COMPONENT ---

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HomePage(props: HomePageProps) {
  const search = await props.searchParams;
  const page = search.page ?? '1';

  // 1. We ONLY await the Critical LCP Data (Headlines) here.
  // This ensures the main hero section loads as fast as possible.
  const headlinesData = await getCachedHeadlines();
  const headlineIds = headlinesData.map(article => article.id);

  const firstTwoHeadlines = headlinesData.slice(0, 2);
  const middleTwoGrid = headlinesData.slice(2, 4);
  const remainingHeadlines = headlinesData.slice(4);

  return (
    <main className="container mx-auto py-4 lg:py-10 px-4 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 sm:gap-8">

        {/* --- LEFT COLUMN: HEADLINES (Kept Standard) --- */}
        <div className="lg:col-span-3 order-1">
          <Card className="border-none shadow-none">
            <CardContent className="pt-5 pb-5 px-0">
              <h1 className="text-3xl font-medium font-heading mb-6 text-left px-4">
                <span className="text-red-500">Latest</span> Headlines
              </h1>
              
              {headlinesData.length > 0 ? (
                <div className="space-y-8 max-h-[740px] overflow-y-auto hide-scrollbar">
                  {/* A. FIRST TWO LARGE CARDS */}
                  {firstTwoHeadlines.map((article) => (
                    <FeaturedArticleCard key={article.id} article={article} priority={true} />
                  ))}

                  {/* B. THE BREAK: 2-COLUMN GRID */}
                  {middleTwoGrid.length > 0 && (
                    <div className="px-4 py-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            {middleTwoGrid.map((article, index) => {
                                const categories = Array.isArray(article.category) ? article.category : (article.category ? [article.category] : []);
                                return (
                                    <div key={article.id} className={cn("flex gap-4 items-start group", index === 0 ? "md:border-r md:border-gray-200 md:pr-6" : "")}>
                                        <Link href={`/article/${article.slug}`} className="relative w-40 h-40 flex-shrink-0 overflow-hidden rounded-none">
                                            <Image src={article.imageUrl || "https://placehold.co/200x200"} alt={article.title} fill className="object-cover" sizes="100px" />
                                        </Link>
                                        <div className="flex flex-col gap-1.5">
                                            {categories.length > 0 && <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{categories.join(" • ")}</span>}
                                            <Link href={`/article/${article.slug}`}>
                                                <h3 className="text-sm md:text-base font-bold font-heading leading-snug line-clamp-3 group-hover:underline decoration-red-500 underline-offset-4 decoration-2">{article.title}</h3>
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                  )}

                  {/* C. REMAINING */}
                  {remainingHeadlines.map((article) => (
                    <FeaturedArticleCard key={article.id} article={article} priority={false} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-muted/50 rounded-lg p-8">
                  <p className="text-sm text-muted-foreground">No news available at the moment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* --- RIGHT COLUMN: SIDEBAR (Suspended) --- */}
        <div className="lg:col-span-1 order-2 flex flex-col gap-8">
           {/* We wrap the HEAVY logic in Suspense. The fallback is a simple Skeleton. */}
           <Suspense fallback={<SidebarSkeleton />}>
              <SidebarSection headlineIds={headlineIds} />
           </Suspense>
        </div>

      </div>

      {/* --- ENTERTAINMENT (Suspended) --- */}
      <Suspense fallback={<div className="h-64 w-full bg-muted/20 animate-pulse rounded-lg mt-8" />}>
         <EntertainmentSection />
      </Suspense>


      {/* --- DISCOVER MORE (Suspended) --- */}
      <section id="more-news" className="mt-8 mb-12 px-4">
         <Suspense fallback={<div className="h-96 w-full bg-muted/10 animate-pulse rounded-lg" />}>
            <DiscoverMoreSection headlineIds={headlineIds} page={page} />
         </Suspense>
      </section>
      
    </main>
  );
}

// --- SUB-COMPONENTS (Refactored for Streaming) ---
// By moving the data fetching INTO these components, Next.js can stream them independently.

async function SidebarSection({ headlineIds }: { headlineIds: string[] }) {
  // Fetch data *inside* the component to allow suspension
  const [featuredOlderArticles, trendingArticles] = await Promise.all([
    getCachedFeaturedOlderArticles(headlineIds),
    getCachedTrendingArticles(),
  ]);

  return (
    <>
      {/* Featured List */}
      <Card className="border-none shadow-none">
        <CardContent className="px-4 lg:px-0 pt-0 md:pt-22">
          <div className="space-y-4 max-h-[485px] overflow-y-auto hide-scrollbar pr-1">
            {featuredOlderArticles.length > 0 ? (
              featuredOlderArticles.map((article, index) => {
                const categories = Array.isArray(article.category) ? article.category : article.category ? [article.category] : [];
                return (
                  <div key={article.id}>
                    <Link href={`/article/${article.slug}`} className="block group">
                      {categories.length > 0 && <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">{categories.join(" • ")}</div>}
                      <h3 className="text-sm font-bold font-heading group-hover:underline decoration-red-500 underline-offset-4 decoration-2 mb-1 leading-snug">{article.title}</h3>
                      <p className="text-[10px] text-muted-foreground">{format(new Date(article.createdAt), "MMM d, h:mm a")}</p>
                    </Link>
                    {index < featuredOlderArticles.length - 1 && <Separator className="mt-3" />}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No featured articles.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trending List */}
      <Card className="border-none shadow-none mb-8">
        <CardContent className="px-4 lg:px-0 pt-0 pb-5">
          <h2 className="text-xl font-medium font-heading mb-4 flex items-center gap-2">
            <span className="text-red-600">Trending</span> Now
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-600">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
          </h2>
          <div className="flex flex-col">
            {trendingArticles.length > 0 ? (
              trendingArticles.map((article, index) => (
                <Link key={article.id} href={`/article/${article.slug}`} className="group flex items-start gap-3 py-3 hover:bg-slate-50 transition-colors border-l-2 border-transparent hover:border-red-500 pl-2">
                  <span className="text-xl font-black text-gray-300 group-hover:text-red-500/50 transition-colors leading-none select-none">{index + 1}</span>
                  <span className="font-medium text-gray-700 group-hover:text-red-600 transition-colors text-sm leading-snug line-clamp-2">{article.trendingTopic}</span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No trending topics.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

async function EntertainmentSection() {
  const entertainmentArticles = await getCachedEntertainmentArticles();
  return <EntertainmentCarousel articles={entertainmentArticles} />;
}

async function DiscoverMoreSection({ headlineIds, page }: { headlineIds: string[], page: string }) {
  const ARTICLES_PER_PAGE = 6;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalPaginatedArticles = await prisma.article.count({
    where: {
      isFeatured: { not: true },
      createdAt: { lt: today },
      id: { notIn: headlineIds }
    }
  });

  const totalPages = Math.ceil(Math.max(0, totalPaginatedArticles) / ARTICLES_PER_PAGE);

  const paginatedOlderArticles = await prisma.article.findMany({
    take: ARTICLES_PER_PAGE,
    skip: (Number(page) - 1) * ARTICLES_PER_PAGE,
    where: {
      isFeatured: { not: true },
      createdAt: { lt: today },
      id: { notIn: headlineIds }
    },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  if (paginatedOlderArticles.length === 0) return null;

  return (
    <>
      <h2 className="text-3xl font-medium font-heading text-black mb-4">
        <span className="text-red-500">Discover</span> More
      </h2>

      {paginatedOlderArticles.length >= 5 ? (
        <DiscoverNewsLayout articles={paginatedOlderArticles} />
      ) : (
        <NewsGrid initialArticles={paginatedOlderArticles} columns={3} />
      )}

      {totalPages > 1 && (
        <div className="mt-12">
          {/* Make sure scrollTargetId matches the ID we put on the wrapper in HomePage 
          */}
          <PaginationControls
            totalPages={totalPages}
            currentPage={Number(page)}
            scrollTargetId="more-news"
          />
        </div>
      )}
    </>
  );
}

// Simple internal skeleton for the sidebar
function SidebarSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
         {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
      </div>
      <div className="space-y-4">
         <Skeleton className="h-8 w-32" />
         {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    </div>
  )
}