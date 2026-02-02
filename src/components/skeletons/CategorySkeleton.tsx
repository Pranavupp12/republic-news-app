import { Skeleton } from "@/components/ui/skeleton"

export function CategorySkeleton() {
  return (
    // 1. Full-width container just like real page
    <main className="w-full pb-12">
      
      {/* --- 1. BANNER SKELETON (Full Width) --- */}
      <div className="relative mb-12 h-[350px] w-full flex flex-col justify-center items-center overflow-hidden bg-gray-900/10">
        {/* Simulating the text in the center of banner */}
        <div className="flex flex-col items-center gap-4 w-full px-8">
           <Skeleton className="h-16 w-1/2 md:w-1/3 bg-gray-300/20" /> {/* Title */}
           <Skeleton className="h-1 w-20 bg-red-600/50" /> {/* Red separator */}
           <Skeleton className="h-6 w-3/4 md:w-1/4 bg-gray-300/20" /> {/* Description */}
        </div>
      </div>

      {/* --- CONTENT CONTAINER (Matches your page margins) --- */}
      <div className="mx-4 md:mx-20 lg:mx-40 px-4 lg:px-0">
        
        {/* --- 2. HERO SECTION SKELETON (Grid of 3) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-3">
              {/* Image */}
              <Skeleton className="w-full aspect-[4/3] rounded-lg" />
              
              {/* Meta (Category/Date) */}
              <div className="flex gap-2 mt-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>

              {/* Title */}
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
            </div>
          ))}
        </div>

        {/* --- 3. LIST SECTION SKELETON (Stacked) --- */}
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Section Header */}
            <Skeleton className="h-8 w-48 mb-6" />

            {/* List Items (Simulating FeaturedArticleCard look) */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col md:flex-row gap-4 items-start">
                {/* Horizontal Layout: Image Left, Text Right */}
                <Skeleton className="w-full md:w-1/3 aspect-video rounded-lg shrink-0" />
                
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex gap-2">
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-11/12" />
                  <div className="flex gap-2 pt-1">
                     <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            ))}
        </div>

      </div>
    </main>
  )
}