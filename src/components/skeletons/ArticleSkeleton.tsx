import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export function ArticleSkeleton() {
  return (
    // Updated container width to match max-w-6xl from page.tsx
    <main className="container mx-auto py-8 lg:py-12 px-4 lg:px-0 max-w-6xl">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* --- LEFT COLUMN: MAIN ARTICLE (8 cols) --- */}
        <div className="lg:col-span-8">
          
          {/* Categories */}
          <Skeleton className="h-4 w-48 mb-4" />

          {/* Title (Big & Multiline) */}
          <div className="space-y-3 mb-6">
            <Skeleton className="h-8 md:h-12 w-full" />
            <Skeleton className="h-8 md:h-12 w-5/6" />
            <Skeleton className="h-8 md:h-12 w-2/3" />
          </div>

          {/* Author & Date Row */}
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="h-4 w-32" />
            <span className="text-gray-200">|</span>
            <Skeleton className="h-4 w-40" />
          </div>

          {/* Hero Image */}
          <div className="w-full aspect-video md:h-[500px] rounded-lg overflow-hidden mb-8">
             <Skeleton className="w-full h-full" />
          </div>

          {/* Content Body (Paragraphs) */}
          <div className="space-y-8">
            <div className="space-y-2">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-11/12" />
               <Skeleton className="h-4 w-full" />
            </div>
            
            <div className="space-y-2">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-5/6" />
               <Skeleton className="h-4 w-full" />
            </div>

            <div className="space-y-2">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>


        {/* --- RIGHT COLUMN: SIDEBAR (4 cols) --- */}
        <aside className="lg:col-span-4 hidden lg:block">
           <div className="sticky top-24">
              
              {/* Header: "Related Stories" */}
              <div className="flex items-center gap-2 mb-6 border-b-2 border-gray-100 pb-2">
                 <Skeleton className="h-6 w-40" />
              </div>

              {/* List of 5 Related Items */}
              <div className="flex flex-col gap-6">
                 {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex flex-col gap-2">
                       <div className="flex gap-4 items-start">
                          {/* Thumbnail */}
                          <Skeleton className="w-24 h-24 flex-shrink-0 rounded-md" />
                          
                          {/* Text Content */}
                          <div className="flex-1 space-y-2 py-1">
                             <Skeleton className="h-3 w-16" /> {/* Category */}
                             <Skeleton className="h-4 w-full" /> {/* Title Line 1 */}
                             <Skeleton className="h-4 w-3/4" /> {/* Title Line 2 */}
                             <Skeleton className="h-3 w-20" />  {/* Date */}
                          </div>
                       </div>
                       
                       {/* Divider */}
                       {i < 5 && <Separator className="mt-2" />}
                    </div>
                 ))}
              </div>
           </div>
        </aside>

      </div>
    </main>
  )
}