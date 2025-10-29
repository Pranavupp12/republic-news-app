import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storyId: string }> } // Type params as a Promise
) {
  try {
    //  Await the params object before accessing its properties
    const { storyId } = await params;

    const story = await prisma.webStory.findUnique({
      where: { id: storyId },
      include: {
        slides: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error("Error fetching story:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}