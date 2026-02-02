import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface RelatedArticlesProps {
  currentArticleId: string;
  categories: string[];
}

export async function RelatedArticles({ currentArticleId, categories }: RelatedArticlesProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  const relatedArticles = await prisma.article.findMany({
    where: {
      category: { hasSome: categories },
      id: { not: currentArticleId },
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      createdAt: true,
      category: true,
    }
  });

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-24"> 
      
      <div className="flex items-center gap-2 mb-6 border-b-2 border-red-500 pb-2">
        <span className="text-lg font-bold uppercase tracking-wider text-black">
          Related Stories
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {relatedArticles.map((item, index) => {
           // Ensure categories is an array
           const itemCats = Array.isArray(item.category) 
            ? item.category 
            : (item.category ? [item.category] : []);

           return (
            <div key={item.id} className="group flex flex-col gap-2">
              <Link href={`/article/${item.slug}`} className="flex gap-4 items-start">
                
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-none bg-gray-100">
                   <Image 
                     src={item.imageUrl || "https://placehold.co/200x200"}
                     alt={item.title}
                     fill
                     className="object-cover "
                     sizes="100px"
                   />
                </div>

                <div className="flex flex-col gap-1">
                   {/* UPDATED: Show ALL categories joined by bullet */}
                   {itemCats.length > 0 && (
                     <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider leading-tight">
                       {itemCats.join(" • ")}
                     </span>
                   )}

                   <h3 className="text-sm font-bold font-heading leading-snug group-hover:text-red-600 transition-colors line-clamp-3">
                     {item.title}
                   </h3>
                   
                   <span className="text-[10px] text-muted-foreground mt-1">
                      {format(new Date(item.createdAt), "MMM d, yyyy")}
                   </span>
                </div>
              </Link>
              
              {index < relatedArticles.length - 1 && (
                <Separator className="mt-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}