import { Skeleton } from "@/components/ui/skeleton"

export function LegalPageSkeleton() {
  return (
    <main className="container mx-auto py-10 px-4 max-w-5xl">
      {/* Title */}
      <Skeleton className="h-8 md:h-10 w-3/4 md:w-1/2 mb-4" />
      
      {/* "Last Updated" Date */}
      <Skeleton className="h-4 w-48 mb-8" />

      <div className="space-y-8 max-w-none">
        
        {/* Simulating 4 Sections of text */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3">
            {/* Section Header */}
            <Skeleton className="h-6 w-1/3 mb-2" />
            
            {/* Paragraph lines */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}

        {/* Simulating a List (Common in Privacy Policies) */}
        <div className="space-y-3">
            <Skeleton className="h-6 w-1/4 mb-2" />
            <div className="pl-5 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>

      </div>
    </main>
  )
}