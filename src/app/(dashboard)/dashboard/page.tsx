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
import { Suspense } from "react";
import DashboardLoading from "./loading";
// 1. IMPORT NOTIFICATION COMPONENTS
import { getNotificationHistory } from "@/actions/notificationActions";
import { CreateDigestForm } from "./notifications/_components/CreateDigestForm";
import { NotificationHistoryTable } from "./notifications/_components/NotificationHistoryTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ARTICLES_PER_PAGE = 10;

interface DashboardPageProps {
  searchParams: Promise<{
    filter?: 'all' | 'today';
    storyFilter?: 'all' | 'today';
    category?: string;
    page?: string;
    storyPage?: string;
    tab?: 'manage' | 'stories' | 'notifications' | 'stats'; // Added 'notifications'
  }>
}

export default async function DashboardPage(props: DashboardPageProps) {
  const session = await getServerSession(authOptions);
  const search = await props.searchParams;
  const activeTab = search.tab || 'manage';
 
  // --- 1. PREPARE PARAMETERS ---
  const articleFilter = search.filter || 'all';
  const categoryFilter = search.category;
  const articlePage = Number(search.page ?? '1');

  const storyFilter = search.storyFilter || 'all';
  const storyPage = Number(search.storyPage ?? '1');

  // --- 2. BUILD QUERIES ---
  const whereClause: Prisma.ArticleWhereInput = {};
  if (articleFilter === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    whereClause.createdAt = { gte: today };
  }
  if (categoryFilter) {
    whereClause.category = categoryFilter;
  }

  const storyWhereClause: Prisma.WebStoryWhereInput = {};
  if (storyFilter === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    storyWhereClause.createdAt = { gte: today };
  }

  // --- 3. INITIATE PROMISES ---
  
  // A. Manage Tab Promises
  const articlesPromise = prisma.article.findMany({
    take: ARTICLES_PER_PAGE,
    skip: (articlePage - 1) * ARTICLES_PER_PAGE,
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });
  const totalListArticlesPromise = prisma.article.count({ where: whereClause });
  const categoriesResultPromise = prisma.article.findMany({
    select: { category: true },
    distinct: ['category'],
  });
  const trendingCountPromise = prisma.article.count({ where: { isTrending: true } });

  // B. Stories Tab Promises
  const webStoriesPromise = prisma.webStory.findMany({
    take: ARTICLES_PER_PAGE,
    skip: (storyPage - 1) * ARTICLES_PER_PAGE,
    where: storyWhereClause, 
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });
  const totalWebStoriesPromise = prisma.webStory.count({ where: storyWhereClause });

  // C. Notifications Tab Promises
  // We fetch recent articles for the digest selector
  const notificationArticlesPromise = prisma.article.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, createdAt: true }
  });

  // D. Stats Tab Promises
  const totalArticlesPromise = prisma.article.count();
  const featuredCountPromise = prisma.article.count({ where: { isFeatured: true } });
  const currentlyFeaturedPromise = prisma.article.findMany({ where: { isFeatured: true }, select: { title: true, category: true }, take: 7 });
  const currentlyTrendingPromise = prisma.article.findMany({ where: { isTrending: true }, select: { title: true, category: true }, take: 7 });
  const articlesPerCategoryPromise = prisma.article.groupBy({ by: ['category'], _count: { category: true } });


  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-8">
      <section>
        <h1 className="text-3xl font-bold font-heading">Welcome, {session?.user?.name}!</h1>
        <p className="text-muted-foreground">Manage your news articles here.</p>
      </section>

      <Tabs value={activeTab} className="w-full">
        {/* ADDED NOTIFICATIONS TAB TRIGGER */}
        <TabsList className="grid w-fit grid-cols-4">
          <TabsTrigger value="manage" asChild><Link href="/dashboard?tab=manage">Manage Articles</Link></TabsTrigger>
          <TabsTrigger value="stories" asChild><Link href="/dashboard?tab=stories">Web Stories</Link></TabsTrigger>
          <TabsTrigger value="notifications" asChild><Link href="/dashboard?tab=notifications">Notifications</Link></TabsTrigger>
          <TabsTrigger value="stats" asChild><Link href="/dashboard?tab=stats">Statistics</Link></TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="mt-6">
          <Suspense key={articlePage + articleFilter + categoryFilter} fallback={<DashboardLoading />}>
            <ManageTabContent 
              articlesPromise={articlesPromise}
              countPromise={totalListArticlesPromise}
              categoriesPromise={categoriesResultPromise}
              trendingCountPromise={trendingCountPromise}
              currentPage={articlePage}
              isTodayFilterActive={articleFilter === 'today'}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="stories" className="mt-6">
          <Suspense key={storyPage + storyFilter} fallback={<DashboardLoading />}>
            <StoriesTabContent 
              storiesPromise={webStoriesPromise}
              countPromise={totalWebStoriesPromise}
              currentPage={storyPage}
              storyFilter={storyFilter}
            />
          </Suspense>
        </TabsContent>

        {/* --- ADDED NOTIFICATIONS TAB CONTENT --- */}
        <TabsContent value="notifications" className="mt-6">
          <Suspense fallback={<DashboardLoading />}>
            <NotificationsTabContent 
               articlesPromise={notificationArticlesPromise}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Suspense fallback={<DashboardLoading />}>
            <StatsTabContent 
              totalArticlesPromise={totalArticlesPromise}
              featuredCountPromise={featuredCountPromise}
              trendingCountPromise={trendingCountPromise}
              currentlyFeaturedPromise={currentlyFeaturedPromise}
              currentlyTrendingPromise={currentlyTrendingPromise}
              articlesPerCategoryPromise={articlesPerCategoryPromise}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

async function ManageTabContent({ articlesPromise, countPromise, categoriesPromise, trendingCountPromise, currentPage, isTodayFilterActive }: any) {
  const [articles, totalArticles, categoriesResult, trendingCount] = await Promise.all([articlesPromise, countPromise, categoriesPromise, trendingCountPromise]);
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);
  const allCategories = categoriesResult.map((item: any) => item.category);

  return (
    <div className="grid grid-cols-1 gap-8">
      <section><AddNewsForm /></section>
      <section id="existing-articles">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold font-heading">Existing Articles</h2>
          <FilterButtons categories={allCategories} scrollTargetId="existing-articles" />
        </div>
        <NewsDataTable
          articles={articles}
          currentPage={currentPage}
          articlesPerPage={ARTICLES_PER_PAGE}
          isTodayFilterActive={isTodayFilterActive}
          trendingCount={trendingCount}
        />
        {totalPages > 1 && (
          <div className="mt-8">
            <PaginationControls totalPages={totalPages} currentPage={currentPage} baseUrl="/dashboard" scrollTargetId="existing-articles" />
          </div>
        )}
      </section>
    </div>
  );
}

async function StoriesTabContent({ storiesPromise, countPromise, currentPage, storyFilter }: any) {
  const [webStories, totalWebStories] = await Promise.all([storiesPromise, countPromise]);
  const totalPages = Math.ceil(totalWebStories / ARTICLES_PER_PAGE);

  return (
    <WebStoryManager
      stories={webStories}
      currentPage={currentPage}
      articlesPerPage={ARTICLES_PER_PAGE}
      totalPages={totalPages}
      storyFilter={storyFilter} 
    />
  );
}

// --- NEW SUB-COMPONENT FOR NOTIFICATIONS ---
async function NotificationsTabContent({ articlesPromise }: any) {
  const [recentArticles, historyResult] = await Promise.all([
    articlesPromise,
    getNotificationHistory() // We fetch history directly here as it's not paginated yet
  ]);
  
  const logs = historyResult.success ? historyResult.logs : [];

  return (
    <div className="grid grid-cols-1 gap-8">
      <section>
        <div className="mb-4">
            <h2 className="text-2xl font-semibold font-heading">Compose Digest</h2>
            <p className="text-sm text-muted-foreground">Select articles to send a summary notification to all subscribers.</p>
        </div>
        <CreateDigestForm articles={recentArticles} />
      </section>

      <section>
        <Card className="border-none">
            <CardHeader><CardTitle>Sent History</CardTitle></CardHeader>
            <CardContent>
                <NotificationHistoryTable logs={logs as any} />
            </CardContent>
        </Card>
      </section>
    </div>
  );
}

async function StatsTabContent({
  totalArticlesPromise, featuredCountPromise, trendingCountPromise, currentlyFeaturedPromise, currentlyTrendingPromise, articlesPerCategoryPromise
}: any) {
  const [
    totalArticles, featuredCount, trendingCount, currentlyFeatured, currentlyTrending, articlesPerCategory,
  ] = await Promise.all([
    totalArticlesPromise, featuredCountPromise, trendingCountPromise, currentlyFeaturedPromise, currentlyTrendingPromise, articlesPerCategoryPromise
  ]);
  const stats = { totalArticles, featuredCount, trendingCount, currentlyFeatured, currentlyTrending, articlesPerCategory };
  return <StatsCard stats={stats} />;
}