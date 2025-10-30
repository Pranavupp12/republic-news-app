import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PaginationControls } from "@/components/ui/PaginationControls";
import type { Metadata } from 'next';
import { ArticleCard } from '../../_components/ArticleCard'; // Import the ArticleCard Client Component

// Define the props interface for the page
interface CategoryPageProps {
  params: {
    // This 'categoryName' MUST match your folder name [categoryName]
    categoryName: string;
  };
  searchParams: { page?: string }; // Include searchParams for pagination
}

// generateMetadata function (Server-Only)
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = params.categoryName;

  // Helper to capitalize the first letter
  const formattedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return {
    title: `${formattedCategory} News - US Headlines`, // Corrected title without duplication
    description: `Read the latest US news, articles, and breaking stories about ${formattedCategory} in the United States. Find all headlines on Republic News.`,
    keywords: ['us news', 'american news', categoryName, `${categoryName} news`, 'headlines', 'usa'],
  };
}

// Category Page Component (Server Component - NO 'use client')
export default async function CategoryPage(props: CategoryPageProps) {
  const ARTICLES_PER_PAGE = 6; // Define articles per page here or import from a config

  // Await params and searchParams directly
  const categoryName = decodeURIComponent(props.params.categoryName);
  const page = props.searchParams.page ?? '1';

  // Fetch articles for the current page
  const articles = await prisma.article.findMany({
    take: ARTICLES_PER_PAGE,
    skip: (Number(page) - 1) * ARTICLES_PER_PAGE,
    where: { category: { equals: categoryName, mode: 'insensitive' } },
    orderBy: { createdAt: 'desc' },
    include: { author: true }, // Include author for the ArticleCard
  });

  // Fetch total count for pagination
  const totalArticles = await prisma.article.count({
    where: { category: { equals: categoryName, mode: 'insensitive' } }
  });

  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);


  return (
    <main className="container mx-auto py-10 px-4">
      {articles.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10 text-lg">
          No articles found in the category yet.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Use the ArticleCard Client Component to render each article */}
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-12">
              <PaginationControls
                  totalPages={totalPages}
                  currentPage={Number(page)}
                  baseUrl={`/category/${categoryName}`} // Pass base URL for links
              />
            </div>
          )}
        </>
      )}
    </main>
  );
}

// Helper function added inside the file for clarity, can be moved to utils
function formattedCategory(categoryName: string): string {
    return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
}