import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from 'next'; // ADDED: Import Metadata type
import { format } from 'date-fns-tz';

// CHANGED: Interface now expects 'slug' instead of 'articleId'
interface ArticlePageProps {
  params: {
    slug: string;
  };
}

//
// ADDED: 1. The generateMetadata function for SEO
//
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  // Fetch the article by slug
  const awaitedParams = await params;

  const article = await prisma.article.findUnique({
    where: { slug: awaitedParams.slug },
  });

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The article you are looking for does not exist.',
    };
  }

  // Split keywords string into an array, or provide an empty array
  const keywords = article.metaKeywords ? article.metaKeywords.split(',').map(k => k.trim()) : [];

  return {
    // Use metaTitle if it exists, otherwise fall back to the main title
    title: article.metaTitle || article.title,
    // Use metaDescription if it exists
    description: article.metaDescription || undefined,
    // Add keywords
    keywords: keywords,
  };
}

//
// 2. Your updated Page Component
//
export default async function ArticlePage(props: ArticlePageProps) { // CHANGED: Props

  const awaitedParams = await props.params;
  const { slug } = awaitedParams;
  
  // CHANGED: Fetch by slug
  const article = await prisma.article.findUnique({
    where: { slug }, // Use the slug from the URL
    include: { author: true },
  });

  // If no article is found, show a 404 page
  if (!article) {
    notFound();
  }

  return (
    <main className="container mx-auto py-10 px-10 md:px-0 max-w-4xl">
      <article>
        {/* Category Badge */}
        <Badge variant="default">{article.category}</Badge>

        {/* Title (this is the <h1>, metadata handles the <title>) */}
        <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight my-4">
          {article.title}
        </h1>

        {/* Metadata: Author and Date */}
        <div className="text-md md:text-lg text-red-500 mb-8">
          <span>By {article.author?.name || 'Anonymous'}</span>
          <span className="mx-2 text-muted-foreground">•</span>
          <span>
            {format(new Date(article.createdAt), 'MMMM d, yyyy', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}
          </span>
        </div>

        {/* Main Image */}
        <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        <div
          className="prose dark:prose-invert max-w-none "
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </main>
  );
}