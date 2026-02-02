import { prisma } from '@/lib/prisma';
import { WebStoriesGrid } from './_components/WebStoriesGrid';
import { unstable_cache } from 'next/cache'; // 1. Import

// 2. Create the cached fetcher
const getCachedWebStories = unstable_cache(
  async () => {
    return await prisma.webStory.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },
  ['web-stories-list'], // Unique Key
  { revalidate: 60 }    // Cache for 60 seconds
);

export default async function WebStoriesPage() {
    // 3. Use the cached function
    const stories = await getCachedWebStories();

    return (
        <main className="container mx-auto py-10 px-4">
            <WebStoriesGrid initialStories={stories} />
        </main>
    );
}