import { prisma } from "@/lib/prisma";
import { PaginationControls } from "@/components/ui/PaginationControls";
import type { Metadata } from 'next';
import { ArticleCard } from '../../_components/ArticleCard'; 
import { FeaturedArticleCard } from '../../_components/FeaturedArticleCard'; 
import Image from "next/image";
import { unstable_cache } from "next/cache"; // 1. Import this

const CATEGORY_INFO: Record<string, string> = {
  Travel: "Destinations, travel tips, tourism industry updates, and guides for your next adventure.",
  Sports: "Game scores, player stats, match highlights, and commentary on major leagues.",
  News: "Breaking headlines, national updates, and critical daily reports from across the US.",
  Politics: "Legislative updates, election coverage, policy analysis, and government insights.",
  Health: "Public health policies, medical breakthroughs, wellness trends, and healthcare news.",
  Climate: "Environmental news, sustainability efforts, weather events, and climate policy.",
  Entertainment: "Movies, music, celebrity buzz, and pop culture trends.",
  US: "National affairs, federal updates, and stories impacting the American public.",
};

interface CategoryPageProps {
  params: Promise<{ categoryName: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata(props: CategoryPageProps): Promise<Metadata> {
  const awaitedParams = await props.params;
  const categoryName = awaitedParams.categoryName;
  const formattedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return {
    title: `${formattedCategory} News - Republic News`,
    description: `Read the latest news about ${formattedCategory}. ${CATEGORY_INFO[formattedCategory] || ''}`,
  };
}

// --- 2. CACHED DATA FETCHERS ---
const getCachedCategoryArticles = unstable_cache(
  async (categoryName: string, page: number) => {
    const ARTICLES_PER_PAGE = 10;
    return await prisma.article.findMany({
      take: ARTICLES_PER_PAGE,
      skip: (page - 1) * ARTICLES_PER_PAGE,
      where: { category: { has: categoryName } }, 
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  },
  ['category-articles-list'], // Key name
  { revalidate: 60 } // Cache for 60 seconds
);

const getCachedCategoryCount = unstable_cache(
  async (categoryName: string) => {
    return await prisma.article.count({
      where: { category: { has: categoryName } }
    });
  },
  ['category-articles-count'], 
  { revalidate: 60 }
);

export default async function CategoryPage(props: CategoryPageProps) {
  const ARTICLES_PER_PAGE = 10; 

  const awaitedParams = await props.params;
  const awaitedSearchParams = await props.searchParams;

  const categoryName = decodeURIComponent(awaitedParams.categoryName);
  const page = Number(awaitedSearchParams.page ?? '1');

  // 3. USE CACHED FUNCTIONS IN PARALLEL
  const [articles, totalArticles] = await Promise.all([
    getCachedCategoryArticles(categoryName, page),
    getCachedCategoryCount(categoryName)
  ]);

  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

  const heroArticles = articles.slice(0, 3);
  const listArticles = articles.slice(3);

  const description = CATEGORY_INFO[categoryName] || `Latest news and updates from the ${categoryName} section.`;

  return (
    <main className="w-full pb-12">
      <section className="relative mb-12 h-[250px] sm:h-[350px] w-full flex flex-col justify-center items-center text-center overflow-hidden">
        <Image
          src="/images/news-banner.png" 
          alt={`${categoryName} banner`}
          fill
          priority
          className="object-cover z-0"
          sizes="100vw"
        />
        <div className="relative z-10 px-8">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-medium font-heading mb-4 text-white">
            {categoryName}
          </h1>
          <p className="text-md sm:text-lg font-medium text-gray-300 leading-relaxed max-w-xl mx-auto">
            {description}
          </p>
        </div>
      </section>

      <div className="mx-4 md:mx-20 lg:mx-40 px-4 lg:px-0">
        {articles.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground text-lg">No articles found in this category yet.</p>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {heroArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </section>

            {listArticles.length > 0 && (
              <section className="max-w-3xl mx-auto">
                 <div className="flex items-center mb-8">
                    <h2 className="text-3xl font-medium font-heading px-4"> Read More in {categoryName}</h2>
                 </div>
                 
                 <div className="space-y-8">
                   {listArticles.map((article) => (
                     <div key={article.id}>
                       <FeaturedArticleCard article={article} />
                     </div>
                   ))}
                 </div>
              </section>
            )}

            {totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <PaginationControls
                    totalPages={totalPages}
                    currentPage={page}
                    baseUrl={`/category/${categoryName}`}
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}