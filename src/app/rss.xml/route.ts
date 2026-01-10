import { prisma } from "@/lib/prisma";
import RSS from "rss";

// IMPORTANT: Replace this with your actual, live domain
const YOUR_DOMAIN = "https://www.republicnews.us";

export async function GET() {
  const feed = new RSS({
    title: "Republic News",
    description: "The latest news headlines, updated daily.",
    site_url: YOUR_DOMAIN,
    feed_url: `${YOUR_DOMAIN}/rss.xml`,
    language: "en",
    pubDate: new Date(),
  });

  // Fetch your recent articles using Prisma
  const articles = await prisma.article.findMany({
    take: 50, // OPTIMIZATION: Limit to recent 50 to keep feed light
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: true,
    },
  });

  // Add each article to the feed
  articles.forEach((article) => {
    feed.item({
      title: article.title,
      description: article.metaDescription || article.content.substring(0, 200),
      url: `${YOUR_DOMAIN}/article/${article.slug}`,
      guid: article.id,
      date: article.createdAt,
      author: article.author?.name || "Republic News Team",
      categories: [article.category], // This automatically picks up your new categories
    });
  });

  const xml = feed.xml({ indent: true });

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}