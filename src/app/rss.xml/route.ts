import { prisma } from "@/lib/prisma"; // Or your prisma client path
import RSS from "rss";

// IMPORTANT: Replace this with your actual, live domain
const YOUR_DOMAIN = "https://republicnewss.netlify.app";

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
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: true, // Include author data
    },
  });

  // Add each article to the feed
  articles.forEach((article) => {
    feed.item({
      title: article.title,
      // Use metaDescription or a substring of content
      description: article.metaDescription || article.content.substring(0, 200),
      url: `${YOUR_DOMAIN}/article/${article.slug}`,
      guid: article.id, // Prisma uses 'id', not '_id'
      date: article.createdAt,
      author: article.author?.name || "Republic News Team",
      categories: [article.category],
    });
  });

  // Generate the XML string
  const xml = feed.xml({ indent: true });

  // Return the response with the correct XML content type
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}