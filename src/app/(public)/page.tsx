import { prisma } from "@/lib/prisma";
import { NewsGrid } from "./_components/NewsGrid";
import { PaginationControls } from "@/components/ui/PaginationControls";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { FeaturedArticleCard } from "./_components/FeaturedArticleCard";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from 'next';
import { format } from 'date-fns-tz';
import { unstable_cache } from "next/cache"; 
import { EntertainmentCarousel } from "./_components/EntertainmentCarousel";
import { DiscoverNewsLayout } from "./_components/DiscoverNewsLayout";

export const metadata: Metadata = {
  title: "Latest US News & Breaking Headlines",
  description: "Get the latest breaking news from the United States, including politics, business, technology, and culture.",
  keywords: ['us news', 'american news', 'breaking news', 'headlines', 'usa news', 'politics', 'business'],
};

const FEATURED_ARTICLES_COUNT = 7;
const ARTICLES_PER_PAGE = 6;

// --- 1. CACHED QUERY FOR HEADLINES (Smart Fill) ---
const getCachedHeadlines = unstable_cache(
  async () => {
    return await prisma.article.findMany({
      take: 3, 
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  },
  ['headlines-articles-main'],
  { revalidate: 60 } 
);

// --- 2. CACHED QUERY FOR FEATURED OLDER ARTICLES ---
const getCachedFeaturedOlderArticles = unstable_cache(
  async (excludeIds: string[]) => {
    return await prisma.article.findMany({
      take: FEATURED_ARTICLES_COUNT,
      where: {
        isFeatured: true,
        id: { notIn: excludeIds } 
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

// --- 4. CACHED QUERY FOR ENTERTAINMENT ---
const getCachedEntertainmentArticles = unstable_cache(
  async () => {
    return await prisma.article.findMany({
      where: {
        category: { has: 'Entertainment' }
      },
      take: 10, 
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  },
  ['entertainment-articles-home'],
  { revalidate: 60 }
);

interface HomePageProps {
  searchParams: Promise<{ page?: string }>; 
}

export default async function HomePage(props: HomePageProps) {
  const search = await props.searchParams;
  const page = search.page ?? '1';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // --- STEP 1: Fetch Headlines First ---
  const headlinesData = await getCachedHeadlines();
  
  // Extract IDs to exclude from other lists
  const headlineIds = headlinesData.map(article => article.id);

  // --- STEP 2: Fetch Other Data in Parallel ---
  const [featuredOlderArticles, trendingArticles, entertainmentArticles] = await Promise.all([
    getCachedFeaturedOlderArticles(headlineIds),
    getCachedTrendingArticles(),
    getCachedEntertainmentArticles()
  ]);

  // --- FIX: Exclude Headline IDs from Discover More Count ---
  const totalPaginatedArticles = await prisma.article.count({
    where: {
      isFeatured: { not: true },
      createdAt: { lt: today },
      id: { notIn: headlineIds } // <--- Added this exclusion
    }
  });

  const totalPages = Math.ceil(Math.max(0, totalPaginatedArticles) / ARTICLES_PER_PAGE);

  // --- FIX: Exclude Headline IDs from Discover More List ---
  const paginatedOlderArticles = await prisma.article.findMany({
    take: ARTICLES_PER_PAGE,
    skip: (Number(page) - 1) * ARTICLES_PER_PAGE,
    where: {
      isFeatured: { not: true },
      createdAt: { lt: today },
      id: { notIn: headlineIds } // <--- Added this exclusion
    },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  return (
    <main className="container mx-auto py-4 lg:py-10 px-4 lg:px-0">
      {/* --- TOP SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">

        {/* --- LEFT COLUMN: FEATURED & TRENDING --- */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card className="border-none">
            <CardContent className="px-4 pt-5 pb-5">
              <h2 className="text-2xl text-black font-semibold font-heading mb-2 block lg:hidden">
                more news
              </h2>
              <div className="space-y-4 max-h-[485px] overflow-y-auto hide-scrollbar pr-2">
                {featuredOlderArticles.length > 0 ? (
                  featuredOlderArticles.map((article, index) => {
                    const categories = Array.isArray(article.category)
                      ? article.category
                      : article.category
                        ? [article.category]
                        : [];

                    return (
                      <div key={article.id}>
                        <Link href={`/article/${article.slug}`} className="block group">

                          {categories.length > 0 && (
                            <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">
                              {categories.join(" • ")}
                            </div>
                          )}

                          <h3 className="font-bold font-heading group-hover:underline decoration-red-500 underline-offset-4 decoration-2 mb-2">
                            {article.title}
                          </h3>

                          <p className="text-xs mt-1">
                            <span className="uppercase text-black font-bold">{article.author?.name || "Anonymous"}</span>
                            <span className="mx-2 text-muted-foreground">|</span>
                            <span>
                              {format(
                                new Date(article.createdAt),
                                "MMM d, yyyy, h:mm a",
                                {
                                  timeZone:
                                    Intl.DateTimeFormat().resolvedOptions().timeZone,
                                }
                              )}
                            </span>
                          </p>
                        </Link>
                        {index < featuredOlderArticles.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No featured articles.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-0 border-t border-gray-200 shadow-none">
            <CardContent className="px-0 pt-6 pb-5">
              <h2 className="text-xl font-bold font-heading mb-4 px-4 flex items-center gap-2">
                <span className="text-red-600">Trending</span> Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-red-600"
                >
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </h2>

              <div className="flex flex-col">
                {trendingArticles.length > 0 ? (
                  trendingArticles.map((article, index) => (
                    <Link
                      key={article.id}
                      href={`/article/${article.slug}`}
                      className="group flex items-start gap-3 py-3 px-4 hover:bg-slate-50 transition-colors border-l-2 border-transparent hover:border-red-500"
                    >
                      <span className="text-2xl font-black text-gray-200 group-hover:text-red-500/50 transition-colors -mt-1 leading-none select-none">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-700 group-hover:text-red-600 transition-colors text-sm leading-snug">
                        {article.trendingTopic}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="px-4 text-sm text-muted-foreground">
                    No trending topics right now.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- RIGHT COLUMN: HEADLINES --- */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <Card className="border-none">
            <CardContent className="pt-5 pb-5">
              <h1 className="text-3xl font-semibold font-heading mb-2 text-left px-4"><span className="text-red-500">Latest</span> Headlines</h1>
              {headlinesData.length > 0 ? (
                <div className="space-y-8 max-h-[740px] overflow-y-auto hide-scrollbar">
                  {headlinesData.map((article, index) => (
                    <FeaturedArticleCard key={article.id} article={article} priority={index < 2} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-muted/50 rounded-lg p-8">
                  <p className="text-sm text-muted-foreground">
                    No news available at the moment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* --- ENTERTAINMENT CAROUSEL --- */}
      <EntertainmentCarousel articles={entertainmentArticles} />

      {/* --- DISCOVER MORE --- */}
      {paginatedOlderArticles.length > 0 && (
        <section id="more-news" className="mt-8 mb-12">
          <h2 className="text-3xl font-semibold font-heading text-black mb-4">
            Discover More
          </h2>

          {paginatedOlderArticles.length >= 5 ? (
            <DiscoverNewsLayout articles={paginatedOlderArticles} />
          ) : (
            <NewsGrid initialArticles={paginatedOlderArticles} columns={3} />
          )}

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