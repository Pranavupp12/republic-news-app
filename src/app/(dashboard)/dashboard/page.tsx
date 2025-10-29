import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddNewsForm } from "./_components/AddNewsForm";
import { NewsDataTable } from "./_components/NewsDataTable";
import { FilterButtons } from "./_components/FilterButtons";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { Prisma } from "@prisma/client";
import { StatsCard } from "./_components/StatsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebStoryManager } from "./_components/WebStoryManager";
import Link from "next/link";

const ARTICLES_PER_PAGE = 10;

interface DashboardPageProps {
  searchParams: {
    filter?: 'all' | 'today';
    storyFilter?: 'all' | 'today';
    category?: string;
    page?: string;
    storyPage?: string;
    tab?: 'manage' | 'stories' | 'stats';
  }
}

export default async function DashboardPage(props: DashboardPageProps) {
  const session = await getServerSession(authOptions);

  const search = await props.searchParams;
  const activeTab = search.tab || 'manage';
 
  // Article Filters
  const articleFilter = search.filter || 'all';
  const categoryFilter = search.category;
  const articlePage = search.page ?? '1';

  // Story Filters
  const storyFilter = search.storyFilter || 'all';
  const storyPage = search.storyPage ?? '1';


  // --- Data fetching logic remains the same ---
  const totalArticlesPromise = prisma.article.count();
  const featuredCountPromise = prisma.article.count({ where: { isFeatured: true } });
  const trendingCountPromise = prisma.article.count({ where: { isTrending: true } });
  const currentlyFeaturedPromise = prisma.article.findMany({ where: { isFeatured: true }, select: { title: true, category: true }, take: 7 });
  const currentlyTrendingPromise = prisma.article.findMany({ where: { isTrending: true }, select: { title: true, category: true }, take: 7 });
  const articlesPerCategoryPromise = prisma.article.groupBy({ by: ['category'], _count: { category: true } });

  const whereClause: Prisma.ArticleWhereInput = {};
  if (articleFilter === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    whereClause.createdAt = { gte: today };
  }
  if (categoryFilter) {
    whereClause.category = categoryFilter;
  }

  const totalListArticlesPromise = prisma.article.count({ where: whereClause });
  const articlesPromise = prisma.article.findMany({
    take: ARTICLES_PER_PAGE,
    skip: (Number(articlePage) - 1) * ARTICLES_PER_PAGE,
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  const categoriesResultPromise = prisma.article.findMany({
    select: { category: true },
    distinct: ['category'],
  });

  const storyWhereClause: Prisma.WebStoryWhereInput = {};
  if (storyFilter === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    storyWhereClause.createdAt = { gte: today };
  }

  // Fetch existing web stories for the new tab
  const webStoriesPromise = await prisma.webStory.findMany({
    take: ARTICLES_PER_PAGE,
    skip: (Number(storyPage) - 1) * ARTICLES_PER_PAGE,
    where: storyWhereClause, 
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });
  const totalWebStoriesPromise = prisma.webStory.count({ where: storyWhereClause });

  const [
    totalArticles,
    featuredCount,
    trendingCount,
    currentlyFeatured,
    currentlyTrending,
    articlesPerCategory,
    totalListArticles,
    articles,
    categoriesResult,
    webStories,
    totalWebStories,
  ] = await Promise.all([
    totalArticlesPromise,
    featuredCountPromise,
    trendingCountPromise,
    currentlyFeaturedPromise,
    currentlyTrendingPromise,
    articlesPerCategoryPromise,
    totalListArticlesPromise,
    articlesPromise,
    categoriesResultPromise,
    webStoriesPromise,
    totalWebStoriesPromise,
  ]);
  const stats = { totalArticles, featuredCount, trendingCount, currentlyFeatured, currentlyTrending, articlesPerCategory };
  const totalStoryPages = Math.ceil(totalWebStories / ARTICLES_PER_PAGE);
  const totalArticlePages = Math.ceil(totalListArticles / ARTICLES_PER_PAGE);
  const allCategories = categoriesResult.map(item => item.category);
  const isTodayFilterActive = articleFilter === 'today';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-8">
      <section>
        <h1 className="text-3xl font-bold font-heading">Welcome, {session?.user?.name}!</h1>
        <p className="text-muted-foreground">Manage your news articles here.</p>
      </section>

      <Tabs value={activeTab} className="w-full">
        {/* THE FIX 1: Make tabs compact and left-aligned */}
        <TabsList className="grid w-fit grid-cols-3">
          <TabsTrigger value="manage" asChild>
            <Link href="/dashboard?tab=manage">Manage Articles</Link>
          </TabsTrigger>
          <TabsTrigger value="stories" asChild>
            <Link href="/dashboard?tab=stories">Web Stories</Link>
          </TabsTrigger>
          <TabsTrigger value="stats" asChild>
            <Link href="/dashboard?tab=stats">Statistics</Link>
          </TabsTrigger>
        </TabsList>

        {/* --- MANAGE ARTICLES TAB --- */}
        <TabsContent value="manage" className="mt-6">
          <div className="grid grid-cols-1 gap-8">
            <section>
              {/* THE FIX 2: Removed the max-width wrapper so the form is full-width */}
              <AddNewsForm />
            </section>
            <section id="existing-articles">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold font-heading">Existing Articles</h2>
                <FilterButtons categories={allCategories} scrollTargetId="existing-articles" />
              </div>
              <NewsDataTable
                articles={articles}
                currentPage={Number(articlePage)}
                articlesPerPage={ARTICLES_PER_PAGE}
                isTodayFilterActive={isTodayFilterActive}
                trendingCount={trendingCount}
              />
              {totalArticlePages > 1 && (
                <div className="mt-8">
                  <PaginationControls totalPages={totalArticlePages} currentPage={Number(articlePage)} baseUrl="/dashboard" scrollTargetId="existing-articles" />
                </div>
              )}
            </section>
          </div>
        </TabsContent>

        {/* --- WEB STORIES TAB --- */}
        <TabsContent value="stories" className="mt-6">
          <WebStoryManager
            stories={webStories}
            currentPage={Number(storyPage)}
            articlesPerPage={ARTICLES_PER_PAGE}
            totalPages={totalStoryPages}
            storyFilter={storyFilter} />
        </TabsContent>

        {/* --- STATISTICS TAB --- */}
        <TabsContent value="stats" className="mt-6">
          <StatsCard stats={stats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}