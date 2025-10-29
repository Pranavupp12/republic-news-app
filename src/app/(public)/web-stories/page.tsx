import { prisma } from '@/lib/prisma';
import { WebStoriesGrid } from './_components/WebStoriesGrid';

export default async function WebStoriesPage() {
    const stories = await prisma.webStory.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return (
        <main className="container mx-auto py-10 px-4">
            <WebStoriesGrid initialStories={stories} />
        </main>
    );
}