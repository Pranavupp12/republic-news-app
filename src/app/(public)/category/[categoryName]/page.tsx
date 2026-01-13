import { prisma } from "@/lib/prisma";
import { PaginationControls } from "@/components/ui/PaginationControls";
import type { Metadata } from 'next';
import { ArticleCard } from '../../_components/ArticleCard'; 
import { FeaturedArticleCard } from '../../_components/FeaturedArticleCard'; // Import the horizontal card
import { Separator } from "@/components/ui/separator";

// --- CATEGORY DESCRIPTIONS MAP ---
const CATEGORY_INFO: Record<string, string> = {
  Technology: "The latest gadgets, software updates, AI breakthroughs, and tech industry news.",
  Travel: "Destinations, travel tips, tourism industry updates, and guides for your next adventure.",
  Sports: "Game scores, player stats, match highlights, and commentary on major leagues.",
  Business: "Financial markets, corporate earnings, economic policy, and startup ecosystems.",
  Culture: "Entertainment, lifestyle, arts, social trends, and celebrity news.",
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

export default async function CategoryPage(props: CategoryPageProps) {
  const ARTICLES_PER_PAGE = 10; // Increased to 10 as requested

  const awaitedParams = await props.params;
  const awaitedSearchParams = await props.searchParams;

  const categoryName = decodeURIComponent(awaitedParams.categoryName);
  const page = awaitedSearchParams.page ?? '1';

  // Fetch articles
  const articles = await prisma.article.findMany({
    take: ARTICLES_PER_PAGE,
    skip: (Number(page) - 1) * ARTICLES_PER_PAGE,
    where: { category: { has: categoryName } }, // Case sensitive check
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  const totalArticles = await prisma.article.count({
    where: { category: { has: categoryName } }
  });

  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

  // Split logic: First 2 are Hero, Rest are List
  const heroArticles = articles.slice(0, 2);
  const listArticles = articles.slice(2);

  const description = CATEGORY_INFO[categoryName] || `Latest news and updates from the ${categoryName} section.`;

  return (
    <main className="mx-20 lg:mx-40 py-8 md:py-12 px-4 lg:px-0">
      
      {/* --- 1. CATEGORY BANNER --- */}
      <section className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold font-heading mb-4 text-black">
          {categoryName}
        </h1>
        <div className="w-24 h-1 bg-red-600 mx-auto mb-6" />
        <p className="text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      </section>

      {articles.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground text-lg">No articles found in this category yet.</p>
        </div>
      ) : (
        <>
          {/* --- 2. HERO SECTION (Top 2 Articles) --- */}
          {/* We use a grid for the first two to make them prominent */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {heroArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </section>

          {/* --- 3. LIST SECTION (Rest of Articles) --- */}
          {listArticles.length > 0 && (
            <section className="max-w-4xl mx-auto">
               <div className="flex items-center mb-8">
                  <h2 className="text-2xl font-bold font-heading mr-4">More in {categoryName}</h2>
                  <Separator className="flex-grow" />
               </div>
               
               <div className="space-y-8">
                 {listArticles.map((article) => (
                   <div key={article.id}>
                     {/* Reuse FeaturedArticleCard because it has the horizontal layout you want */}
                     <FeaturedArticleCard article={article} />
                     <Separator className="mt-8" />
                   </div>
                 ))}
               </div>
            </section>
          )}

          {/* --- 4. PAGINATION --- */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center">
              <PaginationControls
                  totalPages={totalPages}
                  currentPage={Number(page)}
                  baseUrl={`/category/${categoryName}`}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
}