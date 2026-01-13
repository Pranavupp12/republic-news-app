'use client';

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns-tz";
// Badge import removed as it is no longer used
import type { Article, User } from "@prisma/client";

interface DiscoverNewsLayoutProps {
  articles: (Article & { author: User | null })[];
}

export function DiscoverNewsLayout({ articles }: DiscoverNewsLayoutProps) {
  if (!articles || articles.length < 5) return null;

  const heroArticle = articles[0];
  const sideArticle = articles[1];
  const bottomArticles = articles.slice(2, 5);

  // Helper to render categories as "CAT1 • CAT2" text
  const renderCategories = (article: Article) => {
    const categories = Array.isArray(article.category) 
      ? article.category 
      : (article.category ? [article.category] : []);

    if (categories.length === 0) return null;

    return (
      <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">
        {categories.join(" • ")}
      </div>
    );
  };

  // Helper to render the Author | Date metadata line
  const renderMetadata = (article: Article & { author: User | null }) => (
    <div className="mt-auto flex items-center text-xs font-medium uppercase tracking-wider">
      <span className="font-bold text-gray-900 mr-2">
        {article.author?.name || 'News Team'}
      </span>
      <span className="text-gray-400">|</span>
      <span className="text-gray-500 ml-2">
        {format(new Date(article.createdAt), 'MMM d, yyyy, h:mm a')}
      </span>
    </div>
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-8">
        
        {/* --- 1. HERO ARTICLE (Top Left - Spans 8 Cols) --- */}
        <div className="lg:col-span-8">
          <Link href={`/article/${heroArticle.slug}`} className="group grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
            {/* Text Section (Left) */}
            <div className="md:col-span-5 flex flex-col justify-center order-2 md:order-1">
              
              {/* UPDATED: Category Text above Title */}
              {renderCategories(heroArticle)}

              <h3 className="text-3xl font-bold font-heading text-gray-900 leading-tight mb-3 group-hover:underline decoration-red-500 underline-offset-4 decoration-2">
                {heroArticle.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {heroArticle.metaDescription}
              </p>
              {renderMetadata(heroArticle)}
            </div>

            {/* Image Section (Right) */}
            <div className="md:col-span-7 order-1 md:order-2 relative h-64 md:h-full min-h-[280px] overflow-hidden">
              <Image
                src={heroArticle.imageUrl || "https://placehold.co/800x600"}
                alt={heroArticle.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              {/* Removed Badge Overlay */}
            </div>
          </Link>
        </div>

        {/* --- 2. SIDE ARTICLE (Top Right - Spans 4 Cols) --- */}
        <div className="lg:col-span-4">
          <Link href={`/article/${sideArticle.slug}`} className="group flex flex-col h-full">
             <div className="relative w-full aspect-video mb-4 overflow-hidden">
                <Image
                  src={sideArticle.imageUrl || "https://placehold.co/600x400"}
                  alt={sideArticle.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Removed Badge Overlay */}
             </div>

             {/* UPDATED: Category Text above Title */}
             {renderCategories(sideArticle)}

             <h3 className="text-xl font-bold font-heading text-gray-900 leading-snug mb-2 group-hover:underline decoration-red-500 underline-offset-4 decoration-2">
               {sideArticle.title}
             </h3>
             <p className="text-gray-600 text-sm line-clamp-3 mb-4">
               {sideArticle.metaDescription}
             </p>
             {renderMetadata(sideArticle)}
          </Link>
        </div>

        {/* --- 3. BOTTOM ROW (3 Articles - Span 4 Cols Each) --- */}
        {bottomArticles.map((article) => (
          <div key={article.id} className="lg:col-span-4">
            <Link href={`/article/${article.slug}`} className="group flex flex-col h-full">
              <div className="relative w-full aspect-video mb-4 overflow-hidden">
                 <Image
                   src={article.imageUrl || "https://placehold.co/600x400"}
                   alt={article.title}
                   fill
                   className="object-cover"
                   sizes="(max-width: 768px) 100vw, 33vw"
                 />
                 {/* Removed Badge Overlay */}
              </div>

              {/* UPDATED: Category Text above Title */}
              {renderCategories(article)}

              <h3 className="text-lg font-bold font-heading text-gray-900 leading-snug mb-2 group-hover:underline decoration-red-500 underline-offset-4 decoration-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {article.metaDescription}
              </p>
              {renderMetadata(article)}
            </Link>
          </div>
        ))}

      </div>
    </div>
  );
}