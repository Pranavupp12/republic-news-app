import { prisma } from "@/lib/prisma";
import { PaginationControls } from "@/components/ui/PaginationControls";
import type { Metadata } from 'next';
import { ArticleCard } from '../../_components/ArticleCard'; 
import { FeaturedArticleCard } from '../../_components/FeaturedArticleCard'; 
import Image from "next/image";

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

// --- NEW: CATEGORY BANNER IMAGES MAP ---
// Ensure these files exist in your public/images folder
const CATEGORY_IMAGES: Record<string, string> = {
  Technology: "/images/technology.jpg",
  Travel: "/images/travel.jpg",
  Sports: "/images/sports.png",
  Business: "/images/business.jpg",
  Culture: "/images/culture.jpg",
  News: "/images/news.png",
  Politics: "/images/politics.png",
  Health: "/images/health.jpg",
  Climate: "/images/climate.jpg",
  Entertainment: "/images/entertainment.jpg",
  US: "/images/us.png",
};

// Fallback image if a specific category image is missing
const DEFAULT_BANNER = "/images/news-banner.png"; 

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
  const ARTICLES_PER_PAGE = 10; 

  const awaitedParams = await props.params;
  const awaitedSearchParams = await props.searchParams;

  const categoryName = decodeURIComponent(awaitedParams.categoryName);
  const page = awaitedSearchParams.page ?? '1';

  // Fetch articles
  const articles = await prisma.article.findMany({
    take: ARTICLES_PER_PAGE,
    skip: (Number(page) - 1) * ARTICLES_PER_PAGE,
    where: { category: { has: categoryName } }, 
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  const totalArticles = await prisma.article.count({
    where: { category: { has: categoryName } }
  });

  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

  // Split logic: First 3 are Hero, Rest are List
  const heroArticles = articles.slice(0, 3);
  const listArticles = articles.slice(3);

  const description = CATEGORY_INFO[categoryName] || `Latest news and updates from the ${categoryName} section.`;
  
  // Logic to determine which image to show
  const bannerImage = CATEGORY_IMAGES[categoryName] || DEFAULT_BANNER;

  return (
    // 1. REMOVE MARGINS from main so it spans full width
    <main className="w-full pb-12">
      
      {/* --- 1. CATEGORY BANNER (Full Width) --- */}
      <section className="relative mb-12 h-[310px] w-full flex flex-col justify-center items-center text-center overflow-hidden">
        
        {/* A. The Banner Image Background */}
        <Image
          src={bannerImage} // <--- UPDATED to use dynamic image
          alt={`${categoryName} banner`}
          fill
          priority
          className="object-cover z-0"
          sizes="100vw"
        />

        {/* B. Dark Overlay (Essential for text readability) */}
        <div className="absolute inset-0 bg-black/50 z-0" />

        {/* C. The Text Content (Must have relative z-index to sit on top) */}
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading mb-4 text-white">
            {categoryName}
          </h1>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-6" />
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        
      </section>

      {/* --- NEW CONTAINER FOR CONTENT (With Margins) --- */}
      <div className="mx-4 md:mx-20 lg:mx-40 px-4 lg:px-0">
        
        {articles.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground text-lg">No articles found in this category yet.</p>
          </div>
        ) : (
          <>
            {/* --- 2. HERO SECTION (Top 3 Articles) --- */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {heroArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </section>

            {/* --- 3. LIST SECTION (Rest of Articles) --- */}
            {listArticles.length > 0 && (
              <section className="max-w-3xl mx-auto">
                 <div className="flex items-center mb-8">
                    <h2 className="text-3xl font-semibold font-heading mr-4">More in {categoryName}</h2>
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
      </div>
    </main>
  );
}