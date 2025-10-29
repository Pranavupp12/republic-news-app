import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { AddSlideForm } from './_components/AddSlideForm';
import { SlideDataTable } from './_components/SlideDataTable';
import Link from 'next/link'; 
import { Button } from '@/components/ui/button'; 
import { ArrowLeft } from 'lucide-react'; 

export default async function AddSlidesPage({ params }: { params: { storyId: string } }) {
    const awaitedParams = await params;
    const storyId = awaitedParams.storyId;

    const story = await prisma.webStory.findUnique({
        where: { id: storyId },
        include: { 
            slides: { orderBy: { createdAt: 'asc' } },
            author: true,
        },
    });
    if (!story) notFound();

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex items-center gap-x-4">
                <Button asChild variant="outline" size="icon">
                    <Link href="/dashboard?tab=stories">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Dashboard</span>
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold font-heading">Manage Slides</h1>
            </div>
            
            <AddSlideForm storyId={story.id} storyTitle={story.title} />

            <SlideDataTable slides={story.slides} authorName={story.author?.name || 'N/A'} />
        </div>
    );
}