import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    // 1. Fetch all articles where either the title or category matches.
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            category: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: { id: true, title: true, category: true },
    });

    // 2. Score the results to prioritize category matches.
    const scoredResults = articles.map(article => {
      let score = 0;
      const queryLower = query.toLowerCase();
      
      // Higher score for a category match
      if (article.category.toLowerCase().includes(queryLower)) {
        score += 2;
      }
      // Lower score for a title match
      if (article.title.toLowerCase().includes(queryLower)) {
        score += 1;
      }
      
      return { ...article, score };
    });

    // 3. Sort by score in descending order.
    const sortedResults = scoredResults.sort((a, b) => b.score - a.score);

    // 4. Return the top 5 from the sorted list.
    const finalResults = sortedResults.slice(0, 5);

    return NextResponse.json(finalResults);

  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}