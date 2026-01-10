import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
// 1. IMPORT YOUR CONSTANT
import { ARTICLE_CATEGORIES } from '@/lib/constants';

// IMPORTANT: Replace this with your actual, live website domain
const URL = "https://www.republicnews.us";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  // 1. Get Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${URL}/web-stories`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // 2. Get Category Pages (Dynamically from constants.ts)
  // FIX: Map over ARTICLE_CATEGORIES instead of a hardcoded list
  const categoryPages: MetadataRoute.Sitemap = ARTICLE_CATEGORIES.map((category) => ({
    url: `${URL}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 3. Get Article Pages (from Prisma)
  const articles = await prisma.article.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${URL}/article/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'never',
    priority: 0.6,
  }));

  // 4. Get Web Story Pages (from Prisma)
  const stories = await prisma.webStory.findMany({
    select: {
      id: true,
      createdAt: true,
    },
  });
  const storyPages: MetadataRoute.Sitemap = stories.map((story) => ({
    url: `${URL}/web-stories/${story.id}`,
    lastModified: story.createdAt,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  // 5. Combine all pages
  return [
    ...staticPages,
    ...categoryPages,
    ...articlePages,
    ...storyPages,
  ];
}