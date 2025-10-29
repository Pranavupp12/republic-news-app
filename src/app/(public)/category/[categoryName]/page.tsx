import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { PaginationControls } from "@/components/ui/PaginationControls";
import type { Metadata } from 'next';

const ARTICLES_PER_PAGE = 6;

interface CategoryPageProps {
  params: { categoryName: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = params.categoryName;

  // Helper to capitalize the first letter
  const formattedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return {
    title: `${formattedCategory} News - US Headlines`,
    description: `Read the latest US news, articles, and breaking stories about ${formattedCategory} in the United States. Find all headlines on Republic News.`,
    keywords: ['us news', 'american news', categoryName, `${categoryName} news`, 'headlines', 'usa'],
  };
}

export default async function CategoryPage(props: CategoryPageProps) {
  const awaitedParams = await props.params;
  const awaitedSearchParams = await props.searchParams;
  const categoryName = decodeURIComponent(awaitedParams.categoryName);
  const page = awaitedSearchParams.page ?? '1';

  const articles = await prisma.article.findMany({
    take: ARTICLES_PER_PAGE,
    skip: (Number(page) - 1) * ARTICLES_PER_PAGE,
    where: { category: { equals: categoryName, mode: 'insensitive' } },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });
  const totalArticles = await prisma.article.count({ where: { category: { equals: categoryName, mode: 'insensitive' } } });
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

  if (!articles) {
    notFound();
  }

  return (
    <main className="container mx-auto py-10 px-4">
      {articles.length === 0 ? (
        <p className="text-center text-muted-foreground">No articles found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
             <Card key={article.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0 relative">
                {/* CHANGE: Reduced image height from h-56 to h-48 */}
                <Link href={`/article/${article.slug}`} className="block relative h-48 w-full">
                  <Image src={article.imageUrl || "https://placehold.co/600x400"} alt={article.title} fill style={{ objectFit: "cover" }} />
                </Link>
                <Badge variant="default" className="absolute top-3 right-3">{article.category}</Badge>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow p-4">
                {/* CHANGE: Reduced title size from text-xl to text-lg */}
                <CardTitle className="text-lg font-bold mb-2">
                  <Link href={`/article/${article.slug}`} className="hover:text-primary transition-colors">{article.title}</Link>
                </CardTitle>
                <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">{article.metaDescription}</p>
                <div className="text-sm text-red-500 mt-auto">
                  <span>{article.author?.name || 'Anonymous'}</span>
                  <span className="mx-2 text-muted-foreground">|</span>
                  <span>{new Date(article.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-12">
        <PaginationControls 
            totalPages={totalPages} 
            currentPage={Number(page)} 
            baseUrl={`/category/${categoryName}`} 
        />
      </div>
    </main>
  );
}