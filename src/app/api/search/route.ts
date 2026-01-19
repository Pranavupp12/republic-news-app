import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });

  try {
    // 1. Fetch broad matches from DB
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
        slug: { not: null },
      },
      take: 20, 
      orderBy: { createdAt: 'desc' },
      select: { 
        slug: true, 
        title: true, 
        category: true,
        imageUrl: true,
        createdAt: true,
        content: true // Needed for filtering, but we won't send it to client to save bandwidth
      },
    });

    const lowerQuery = query.toLowerCase();
    // Helper: Regex for whole word matching (prevents "ice" matching "police")
    // We only enforce this strictness for short queries (<= 3 chars) to remove noise.
    const isWholeWord = (text: string, term: string) => {
      if (term.length > 3) return text.toLowerCase().includes(term); // Long words: loose match ok
      const regex = new RegExp(`\\b${term}\\b`, 'i');
      return regex.test(text);
    };

    const exactMatches: any[] = [];
    const relatedMatches: any[] = [];

    articles.forEach((article) => {
      const titleLower = article.title.toLowerCase();
      const contentLower = article.content.toLowerCase();
      
      // Clean up the object to send less data
      const cleanArticle = { ...article, content: undefined };

      // 2. SORTING LOGIC
      // Priority A: Title contains the query
      if (titleLower.includes(lowerQuery)) {
        exactMatches.push(cleanArticle);
      } 
      // Priority B: Content contains the query (BUT must pass whole-word check)
      else if (isWholeWord(contentLower, lowerQuery)) {
        relatedMatches.push(cleanArticle);
      }
      // If it failed both (e.g. it was "police" matching "ice"), it gets dropped entirely.
    });

    // 3. Return Split Groups
    return NextResponse.json({
        exact: exactMatches,
        related: relatedMatches
    });

  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}