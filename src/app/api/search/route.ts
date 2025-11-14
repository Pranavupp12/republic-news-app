import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
        // Ensure that the slug is not null
        slug: { not: null },
      },
      // THE FIX: Select the 'slug' instead of 'id'
      select: { 
        slug: true, 
        title: true, 
        category: true 
      },
    });

    const scoredResults = articles.map(article => {
      let score = 0;
      const queryLower = query.toLowerCase();
      
      if (article.category.toLowerCase().includes(queryLower)) score += 2;
      if (article.title.toLowerCase().includes(queryLower)) score += 1;
      
      return { ...article, score };
    });

    const sortedResults = scoredResults.sort((a, b) => b.score - a.score);
    const finalResults = sortedResults.slice(0, 5);

    return NextResponse.json(finalResults);

  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}