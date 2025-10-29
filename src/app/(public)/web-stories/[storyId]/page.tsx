import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { StoryViewer } from "./_components/StoryViewer";

interface StoryViewerPageProps {
  params: {
    storyId: string;
  };
}

export default async function StoryViewerPage(props: StoryViewerPageProps) {
  const awaitedParams = await props.params;
  const { storyId } = awaitedParams;

  const story = await prisma.webStory.findUnique({
    where: { id: storyId },
    include: {
      slides: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      author: true,
    },
  });

  if (!story || story.slides.length === 0) {
    notFound();
  }

  return <StoryViewer story={story} />;
}