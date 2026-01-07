import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from 'next';
import { format } from 'date-fns-tz';

interface ArticlePageProps {
  params: Promise<{ slug: string }>; // Updated for Next.js 15+ await rules
}

// --- 1. SEO & SOCIAL METADATA ---
export async function generateMetadata(props: ArticlePageProps): Promise<Metadata> {
  const params = await props.params;
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article) {
    return { title: 'Article Not Found' };
  }

  const keywords = article.metaKeywords ? article.metaKeywords.split(',').map(k => k.trim()) : [];
  const publishedTime = new Date(article.createdAt).toISOString();
  
  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || undefined,
    keywords: keywords,
    // NEW: Add Open Graph for Facebook/LinkedIn/WhatsApp
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || undefined,
      url: `https://republicnews.us/article/${article.slug}`, // Replace with your actual domain
      siteName: 'Republic News',
      images: [
        {
          url: article.imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedTime,
      authors: [article.authorId || 'Republic News'], 
    },
    // NEW: Add Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle || article.title,
      description: article.metaDescription || undefined,
      images: [article.imageUrl],
    },
  };
}

export default async function ArticlePage(props: ArticlePageProps) {
  const params = await props.params;
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: { author: true },
  });

  if (!article) {
    notFound();
  }

  const dateString = format(new Date(article.createdAt), 'MMMM d, yyyy', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  const isoDate = new Date(article.createdAt).toISOString();

  // --- 2. STRUCTURED DATA (JSON-LD) ---
  // This tells Google "This is a News Article" for rich snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.metaTitle || article.title,
    image: [article.imageUrl],
    datePublished: isoDate,
    dateModified: isoDate, // Ideally add an 'updatedAt' field to your model later
    author: [{
      '@type': 'Person',
      name: article.author?.name || 'Republic News',
      url: `https://republicnews.us/author/${article.authorId}` // Optional
    }],
  };

  return (
    <main className="container mx-auto py-10 px-10 md:px-0 max-w-4xl">
      {/* Inject JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <Badge variant="default" className="mb-4">{article.category}</Badge>

        <h1 className="text-3xl lg:text-5xl font-extrabold font-heading tracking-tight mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="text-md md:text-lg text-red-500 mb-8 font-medium">
          <span>By {article.author?.name || 'Republic News Staff'}</span>
          <span className="mx-2 text-muted-foreground">•</span>
          <time dateTime={isoDate}>
            {dateString}
          </time>
        </div>

        {/* --- 3. OPTIMIZED IMAGE --- */}
        <div className="relative h-64 md:h-[500px] w-full mb-10 rounded-xl overflow-hidden shadow-sm">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            // FIX: Since this image is max-w-4xl (approx 900px), tell the browser that!
            // Before: 33vw (too small). Now: 100vw on mobile, 900px on desktop.
            sizes="(max-width: 768px) 100vw, 900px" 
            className="object-cover"
            priority // Keep this for LCP
          />
        </div>

        <div
          className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-xl prose-a:text-red-500 hover:prose-a:text-red-600 transition-colors"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </main>
  );
}