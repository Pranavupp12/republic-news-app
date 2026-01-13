import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
// Removed Badge import as it is no longer used
import type { Metadata } from 'next';
import { format } from 'date-fns-tz';
import Script from 'next/script'; 

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
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
    alternates: {
      canonical: `/article/${article.slug}`,
    },
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || undefined,
      url: `https://republicnews.us/article/${article.slug}`,
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
      modifiedTime: new Date(article.updatedAt).toISOString(),
      authors: [article.authorId || 'Republic News'], 
    },
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

  // --- HELPER: Normalize Categories ---
  const categories = Array.isArray(article.category) 
    ? article.category 
    : (article.category ? [article.category] : []);

  const dateString = format(new Date(article.createdAt), 'MMMM d, yyyy', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  const isoDate = new Date(article.createdAt).toISOString();
  const datePublished = new Date(article.createdAt).toISOString();
  const dateModified = new Date(article.updatedAt).toISOString();

  // --- 2. STRUCTURED DATA (JSON-LD) ---
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.metaTitle || article.title,
    description: article.metaDescription || undefined,
    image: [article.imageUrl],
    datePublished: datePublished,
    dateModified: dateModified,
    articleSection: categories,
    author: [{
      '@type': 'Person',
      name: article.author?.name || 'Republic News',
      url: `https://republicnews.us/author/${article.authorId}`
    }],
    publisher: {
      '@type': 'Organization',
      name: 'Republic News',
      logo: {
        '@type': 'ImageObject',
        url: 'https://republicnews.us/logo/rn-logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://republicnews.us/article/${article.slug}`
    }
  };

  return (
    <main className="container mx-auto py-10 px-8 lg:px-4 max-w-5xl">
      <Script
        id="json-ld-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* --- UPDATED: Categories as Text (Red, Bold, Uppercase) --- */}
        {categories.length > 0 && (
          <div className="text-sm md:text-base font-bold text-red-500 uppercase tracking-wider mb-3">
            {categories.join(" • ")}
          </div>
        )}

        <h1 className="text-3xl lg:text-5xl font-extrabold font-heading tracking-tight mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="text-md md:text-lg text-black mb-4 sm:mb-8 font-medium">
          <span className="uppercase text-black font-bold">{article.author?.name || 'Republic News '}</span>
          <span className="mx-2 text-muted-foreground">|</span>
          <time dateTime={isoDate} className="text-muted-foreground">
            {dateString}
          </time>
        </div>

        <div className="relative h-[280px] md:h-[500px] lg:h-[620px] w-full mb-4 sm:mb-8 overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-contain sm:object-cover"
            priority 
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