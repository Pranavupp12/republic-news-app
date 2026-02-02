import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function HomeSkeleton() {
  return (
    <main className="container mx-auto py-4 lg:py-10 px-4 lg:px-0">
      
      {/* MAIN GRID: Left (Headlines 75%) | Right (Sidebar 25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 sm:gap-8">
        
        {/* --- LEFT COLUMN: HEADLINES --- */}
        <div className="lg:col-span-3 order-1">
          <Card className="border-none shadow-none">
            <CardContent className="pt-5 pb-5 px-0">
              
              {/* Header: "Latest Headlines" */}
              <Skeleton className="h-10 w-48 mb-6 mx-4" /> 

              <div className="space-y-8">
                
                {/* A. FIRST TWO LARGE CARDS (Image Right, Text Left on Desktop) */}
                {[1, 2].map((i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-6 p-4">
                     {/* Text Side */}
                     <div className="w-full md:w-1/2 space-y-4 py-2">
                        <Skeleton className="h-3 w-24" /> {/* Category */}
                        <Skeleton className="h-8 w-full" /> {/* Title Line 1 */}
                        <Skeleton className="h-8 w-3/4" /> {/* Title Line 2 */}
                        <Skeleton className="h-4 w-full" /> {/* Description */}
                        <Skeleton className="h-4 w-5/6" /> 
                        <Separator className="mt-4" />
                        <Skeleton className="h-3 w-32" /> {/* Footer/Date */}
                     </div>
                     {/* Image Side */}
                     <div className="w-full md:w-1/2 h-60 md:h-auto md:order-last">
                        <Skeleton className="w-full h-full rounded-xl" />
                     </div>
                  </div>
                ))}

                {/* B. THE MIDDLE GRID (2 Small Cards Side-by-Side) */}
                <div className="px-4 py-2">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                      {[1, 2].map((i) => (
                         <div key={i} className="flex gap-4 items-start">
                            {/* Small Image */}
                            <Skeleton className="w-24 h-24 flex-shrink-0 rounded-md" />
                            {/* Text */}
                            <div className="flex-1 space-y-2">
                               <Skeleton className="h-3 w-16" /> {/* Category */}
                               <Skeleton className="h-4 w-full" /> {/* Title 1 */}
                               <Skeleton className="h-4 w-5/6" /> {/* Title 2 */}
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                {/* C. REMAINING LARGE CARDS */}
                {[1, 2].map((i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-6 p-4">
                     <div className="w-full md:w-1/2 space-y-4 py-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                     </div>
                     <div className="w-full md:w-1/2 h-60 md:h-auto md:order-last">
                        <Skeleton className="w-full h-full rounded-xl" />
                     </div>
                  </div>
                ))}

              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- RIGHT COLUMN: SIDEBAR (More News & Trending) --- */}
        <div className="lg:col-span-1 order-2 flex flex-col gap-8">
          
          {/* Part 1: More News (Text List) */}
          <Card className="border-none shadow-none">
            <CardContent className="px-4 lg:px-0 pt-0 md:pt-22 space-y-6">
               {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i}>
                    <Skeleton className="h-3 w-20 mb-2" /> {/* Category */}
                    <Skeleton className="h-4 w-full mb-1" /> {/* Title 1 */}
                    <Skeleton className="h-4 w-3/4 mb-2" /> {/* Title 2 */}
                    <Skeleton className="h-3 w-24" /> {/* Date */}
                    {i < 5 && <Separator className="mt-4" />}
                 </div>
               ))}
            </CardContent>
          </Card>

          {/* Part 2: Trending (Numbered List) */}
          <Card className="border-none shadow-none">
            <CardContent className="px-4 lg:px-0 pb-5">
               <Skeleton className="h-6 w-32 mb-6" /> {/* "Trending Now" Header */}
               <div className="space-y-6">
                 {[1, 2, 3, 4, 5].map((i) => (
                   <div key={i} className="flex gap-4 items-start">
                     <Skeleton className="h-8 w-6" /> {/* Number */}
                     <div className="space-y-2 w-full">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                     </div>
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* --- BOTTOM SECTION: Discover More Grid --- */}
      <div className="mt-12 px-4 lg:px-0 space-y-6">
         <Skeleton className="h-10 w-48" /> {/* Header */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
               <div key={i} className="space-y-3">
                  <Skeleton className="w-full aspect-video rounded-lg" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
               </div>
            ))}
         </div>
      </div>
    </main>
  )
}