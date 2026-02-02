import { Skeleton } from "@/components/ui/skeleton"

export function SitemapSkeleton() {
  return (
    <main className="container mx-auto py-10 px-10 md:px-4 max-w-5xl">
      {/* Centered Title */}
      <div className="flex justify-center mb-12">
        <Skeleton className="h-8 md:h-10 w-48" />
      </div>
      
      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-8">
        
        {/* Column Loop (Main Pages, Categories, Legal) */}
        {[1, 2, 3].map((colIndex) => (
          <div key={colIndex} className="space-y-4">
            {/* Column Header */}
            <div className="pb-2 border-b border-gray-100 dark:border-gray-800">
               <Skeleton className="h-6 w-32" />
            </div>

            {/* List Links */}
            <ul className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((itemIndex) => (
                <li key={itemIndex}>
                  {/* Randomize widths slightly for realism */}
                  <Skeleton className={`h-4 ${itemIndex % 2 === 0 ? 'w-24' : 'w-32'}`} />
                </li>
              ))}
            </ul>
          </div>
        ))}
        
      </div>
    </main>
  )
}