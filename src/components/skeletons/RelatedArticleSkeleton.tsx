import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export function RelatedArticlesSkeleton() {
  return (
    <div className="sticky top-24">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 border-b-2 border-gray-100 pb-2">
         <Skeleton className="h-6 w-40" />
      </div>

      {/* List */}
      <div className="flex flex-col gap-6">
         {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col gap-2">
               <div className="flex gap-4 items-start">
                  {/* Thumbnail */}
                  <Skeleton className="w-24 h-24 flex-shrink-0 rounded-md" />
                  
                  {/* Text Content */}
                  <div className="flex-1 space-y-2 py-1">
                     <Skeleton className="h-3 w-16" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-3/4" />
                     <Skeleton className="h-3 w-20" />
                  </div>
               </div>
               {i < 5 && <Separator className="mt-2" />}
            </div>
         ))}
      </div>
   </div>
  )
}